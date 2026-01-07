/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import MyBackground from "@/components/MyBackground";
import { Center } from "@/types/centers";
import { centerService } from "@/lib/centerServices";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthModel";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useMapEvents } from "react-leaflet";
import type * as L from "leaflet";

// Map Click Handler (for react-leaflet)
interface MapClickHandlerProps {
  onClick: (e: L.LeafletMouseEvent) => void;
}
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onClick }) => {
  useMapEvents({ click: onClick });
  return null;
};

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Leaflet CSS and icon fix
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { API_URL } from "@/lib/config";
import { EditIcon, TrashIcon } from "lucide-react";

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔍 Reverse Geocoding Function
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
    );
    if (!response.ok) throw new Error("Geocoding failed");
    const data = await response.json();
    const addr = data.address || {};

    return {
      country: addr.country || "",
      state: addr.state || addr.region || addr.state_district || "",
      district:
        addr.county ||
        addr.city ||
        addr.town ||
        addr.village ||
        addr.suburb ||
        "",
      fullAddress: data.display_name || "",
    };
  } catch (err) {
    console.warn("Reverse geocoding failed:", err);
    return null;
  }
};

const CenterDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [center, setCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    Country: "",
    State: "",
    District: "",
    Address: "",
    Description: "",
    schedule: "",
    latitude: 0,
    longitude: 0,
    coordinators: [{ name: "", phone: "", email: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPosition, setTempPosition] = useState<[number, number]>([0, 0]);
  const [isLocating, setIsLocating] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);

  const centerId = params.id as string;

  useEffect(() => {
    if (centerId) loadCenter();
  }, [centerId]);

  const loadCenter = async () => {
    try {
      setLoading(true);
      const centerData = await centerService.getCenter(centerId);
      setCenter(centerData);
      setEditData({
        Country: centerData.Country || "",
        State: centerData.State || "",
        District: centerData.District || "",
        Address: centerData.Address || "",
        Description: centerData.Description || "",
        schedule: centerData.schedule || "",
        latitude: centerData.latitude || 0,
        longitude: centerData.longitude || 0,
        coordinators: Array.isArray(centerData.coordinators)
          ? centerData.coordinators.map((c) => ({
              name: c.name || "",
              phone: c.phone || "",
              email: c.email || "",
            }))
          : [{ name: "", phone: "", email: "" }],
      });
      setTempPosition([centerData.latitude || 0, centerData.longitude || 0]);
    } catch (err) {
      console.error("Error loading center:", err);
      setError("Failed to load center details");
    } finally {
      setLoading(false);
    }
  };

  const formatName = (name: string) => name.replace(/_/g, " ");
  const formatSchedule = (schedule: string) =>
    schedule
      .split("\n")
      .filter((line) => line.trim())
      .join(", ");

  const position: [number, number] = useMemo(
    () => [center?.latitude || 0, center?.longitude || 0],
    [center]
  );

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinatorChange = (
    index: number,
    field: "name" | "phone" | "email",
    value: string
  ) => {
    const newCoordinators = [...editData.coordinators];
    newCoordinators[index] = { ...newCoordinators[index], [field]: value };
    setEditData((prev) => ({ ...prev, coordinators: newCoordinators }));
  };

  const addCoordinator = () => {
    setEditData((prev) => ({
      ...prev,
      coordinators: [...prev.coordinators, { name: "", phone: "", email: "" }],
    }));
  };

  const removeCoordinator = (index: number) => {
    if (editData.coordinators.length <= 1) return;
    const newCoordinators = editData.coordinators.filter((_, i) => i !== index);
    setEditData((prev) => ({ ...prev, coordinators: newCoordinators }));
  };

  // 🗺️ Handle map click + reverse geocode
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const newLat = parseFloat(lat.toFixed(6));
    const newLng = parseFloat(lng.toFixed(6));

    setEditData((prev) => ({ ...prev, latitude: newLat, longitude: newLng }));
    setTempPosition([lat, lng]);
    toast.success(`Location set to: ${newLat}, ${newLng}`);

    const geo = await reverseGeocode(lat, lng);
    if (geo) {
      setEditData((prev) => ({
        ...prev,
        Country: geo.country,
        State: geo.state,
        District: geo.district,
        Address: geo.fullAddress,
      }));
      toast.success("Address fields updated from location", {
        id: "geocode",
        duration: 2000,
      });
    }
  };

  const deleteCenter = async (id: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to delete a center.");
      router.push("/login-or-create-account");
    }
    const resp = await api.delete(`${API_URL}/centers/delete/${id}`, {
      withCredentials: true,
    });
    if (resp.data.success) {
      toast.success("Center deleted successfully.");
      router.push("/admin/dashboard/centers");
    } else {
      toast.error("Failed to delete center. Please try again.");
    }
  };

  // 📍 Get current location + reverse geocode
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    toast.loading("Getting your current location...", { id: "location" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLat = parseFloat(latitude.toFixed(6));
        const newLng = parseFloat(longitude.toFixed(6));

        setEditData((prev) => ({
          ...prev,
          latitude: newLat,
          longitude: newLng,
        }));
        setTempPosition([latitude, longitude]);
        setMapZoom(16);

        const geo = await reverseGeocode(latitude, longitude);
        if (geo) {
          setEditData((prev) => ({
            ...prev,
            Country: geo.country,
            State: geo.state,
            District: geo.district,
            Address: geo.fullAddress,
          }));
        }

        toast.success("Location set to your current position!", {
          id: "location",
          duration: 3000,
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let msg = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED)
          msg = "Location access denied. Please enable it in browser settings.";
        else if (error.code === error.POSITION_UNAVAILABLE)
          msg = "Location unavailable.";
        else if (error.code === error.TIMEOUT)
          msg = "Location request timed out.";

        toast.error(msg, { id: "location", duration: 5000 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in to edit a center.");
      router.push("/login-or-create-account");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(
        `${API_URL}/centers/update/${centerId}`,
        {
          Country: editData.Country || undefined,
          State: editData.State || undefined,
          District: editData.District || undefined,
          Address: editData.Address || undefined,
          Description: editData.Description || undefined,
          schedule: editData.schedule || undefined,
          latitude: editData.latitude || undefined,
          longitude: editData.longitude || undefined,
          coordinators: editData.coordinators.filter(
            (c) => c.name.trim() || c.phone.trim() || c.email.trim()
          ),
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update center");
      }

      toast.success("Center updated successfully!");
      setIsEditing(false);
      loadCenter();
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (loading & error UI remains unchanged)

  if (loading) {
    return (
      <MyBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-white mt-4">Loading center details...</p>
          </div>
        </div>
        <Footer />
      </MyBackground>
    );
  }

  if (error || !center) {
    return (
      <MyBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">
              Center Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              {error || "The requested center could not be found."}
            </p>
            <button
              onClick={() => router.push("/centers")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Centers
            </button>
          </div>
        </div>
        <Footer />
      </MyBackground>
    );
  }

  return (
    <MyBackground>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/admin/dashboard/centers")}
              className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Centers</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  currentUser
                    ? setIsEditing(true)
                    : router.push("/login-or-create-account")
                }
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm flex flex-col items-center rounded-lg transition-colors"
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit Center</span>
              </button>
              <button
                onClick={() => currentUser && deleteCenter(center.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm flex flex-col items-center rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {formatName(center.District)}
                  </span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                    {formatName(center.State)}
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {formatName(center.Country)}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Sahaja Yoga Center
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {center.Address}
                </p>
              </div>
              {center.centerImage && (
                <div className="mt-4 md:mt-0 md:ml-6">
                  <div className="w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Center Image</span>
                  </div>
                </div>
              )}
            </div>

            {center.schedule && (
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Schedule
                </h3>
                <p className="text-gray-300">
                  {formatSchedule(center.schedule)}
                </p>
              </div>
            )}

            {center.Description && (
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {center.Description}
                </p>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Coordinates</div>
                  <div className="text-white">
                    {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Established</div>
                  <div className="text-white">
                    {new Date(
                      center.createdAt._seconds * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-64 rounded-lg overflow-hidden border border-white/20">
                <MapContainer
                  center={position}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>
                      <div className="font-semibold">{center.Address}</div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="mt-4 text-center">
                <a
                  href={`https://www.google.com/maps?q=${center.latitude},${center.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Coordinators (unchanged) */}
          {center.coordinators && center.coordinators.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Center Coordinators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {center.coordinators.map((coordinator, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {coordinator.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-gray-300">
                          {coordinator.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-300 break-all">
                          {coordinator.email}
                        </span>
                      </div>
                    </div>
                    {/* ✅ Only show Contact button if first coordinator has a phone */}
                    {center.coordinators &&
                      center.coordinators.length > 0 &&
                      center.coordinators[0].phone && (
                        <a
                          href={`tel:${center.coordinators[0].phone}`}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200 font-medium text-sm text-center block px-3"
                        >
                          Contact Coordinator
                        </a>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✨ Enhanced Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-4xl my-8 border border-gray-700 shadow-2xl">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Edit Center Details
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Update the center information and location
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmitEdit}
                  className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
                >
                  {/* Location Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Location Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="Country"
                          placeholder="Enter country"
                          value={editData.Country}
                          onChange={handleEditChange}
                          className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          State *
                        </label>
                        <input
                          type="text"
                          name="State"
                          placeholder="Enter state"
                          value={editData.State}
                          onChange={handleEditChange}
                          className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          District *
                        </label>
                        <input
                          type="text"
                          name="District"
                          placeholder="Enter district"
                          value={editData.District}
                          onChange={handleEditChange}
                          className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Full Address *
                      </label>
                      <input
                        type="text"
                        name="Address"
                        placeholder="Enter complete address"
                        value={editData.Address}
                        onChange={handleEditChange}
                        className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Map Picker */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        Set Location on Map
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                          Click on map to set coordinates
                        </span>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isLocating}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {isLocating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Locating...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.656 14.828l1.414-1.414-1.414-1.414M13.121 6.343l1.415 1.415 1.414-1.415M17.656 9.172l-1.414-1.415M9.172 17.656l-1.415 1.414 1.415 1.414M6.343 13.121l-1.415-1.415-1.414 1.415M9.172 6.343L7.757 7.757 6.343 6.343M14.828 17.656l1.414 1.414 1.414-1.414M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                              </svg>
                              <span>My Location</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Latitude
                        </label>
                        <input
                          type="number"
                          name="latitude"
                          placeholder="Latitude"
                          step="any"
                          value={editData.latitude}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              latitude: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Longitude
                        </label>
                        <input
                          type="number"
                          name="longitude"
                          placeholder="Longitude"
                          step="any"
                          value={editData.longitude}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              longitude: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-600 relative">
                      <MapContainer
                        center={tempPosition}
                        zoom={mapZoom}
                        scrollWheelZoom={true}
                        className="w-full h-full cursor-pointer"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[editData.latitude, editData.longitude]}
                        >
                          <Popup>
                            <div className="font-semibold text-center">
                              Selected Location
                              <br />
                              <span className="text-sm text-gray-600">
                                {editData.latitude.toFixed(6)},{" "}
                                {editData.longitude.toFixed(6)}
                              </span>
                            </div>
                          </Popup>
                        </Marker>
                        <MapClickHandler onClick={handleMapClick} />
                      </MapContainer>

                      {/* Zoom Controls */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMapZoom((prev) => Math.min(prev + 1, 18))
                          }
                          className="w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 rounded-lg shadow-lg flex items-center justify-center transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMapZoom((prev) => Math.max(prev - 1, 1))
                          }
                          className="w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 rounded-lg shadow-lg flex items-center justify-center transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 12H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Click on the map or use {"My Location"} to set
                          coordinates
                        </span>
                      </div>
                      <div className="text-right">
                        <div>
                          Current: {editData.latitude.toFixed(6)},{" "}
                          {editData.longitude.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Schedule */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="Description"
                        placeholder="Enter center description..."
                        value={editData.Description}
                        onChange={handleEditChange}
                        rows={4}
                        className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Schedule
                        <span className="text-gray-500 text-xs ml-2">
                          (one entry per line)
                        </span>
                      </label>
                      <textarea
                        name="schedule"
                        placeholder="Monday: 6-8 PM&#10;Tuesday: 7-9 PM&#10;Wednesday: Meditation"
                        value={editData.schedule}
                        onChange={handleEditChange}
                        rows={4}
                        className="w-full p-3 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Coordinators */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Coordinators
                      </h3>
                      <button
                        type="button"
                        onClick={addCoordinator}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Add Coordinator</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {editData.coordinators.map((coord, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-xl p-4 border border-gray-600"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-white font-medium">
                              Coordinator {idx + 1}
                            </h4>
                            {editData.coordinators.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCoordinator(idx)}
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <label className="text-xs text-gray-400">
                                Full Name
                              </label>
                              <input
                                type="text"
                                placeholder="Name"
                                value={coord.name}
                                onChange={(e) =>
                                  handleCoordinatorChange(
                                    idx,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs text-gray-400">
                                Phone Number
                              </label>
                              <input
                                type="text"
                                placeholder="Phone"
                                value={coord.phone}
                                onChange={(e) =>
                                  handleCoordinatorChange(
                                    idx,
                                    "phone",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs text-gray-400">
                                Email Address
                              </label>
                              <input
                                type="email"
                                placeholder="Email"
                                value={coord.email}
                                onChange={(e) =>
                                  handleCoordinatorChange(
                                    idx,
                                    "email",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg disabled:opacity-50 transition-all font-medium shadow-lg shadow-emerald-600/25"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving Changes...</span>
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </MyBackground>
  );
};

export default CenterDetailPage;
