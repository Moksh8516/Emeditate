"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import MyBackground from "@/components/MyBackground";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthModel";
import dynamic from "next/dynamic";
import { API_URL } from "@/lib/config";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Dynamically import ALL Leaflet-related components with ssr: false
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

// Import useMapEvents dynamically as well
const MapClickHandler = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMapEvents } = mod;
      const MapClickHandlerComponent = ({
        onClick,
      }: {
        onClick: (e: any) => void;
      }) => {
        useMapEvents({ click: onClick });
        return null;
      };
      return {
        default: MapClickHandlerComponent,
      };
    }),
  { ssr: false }
);

// TypeScript interfaces
interface Coordinator {
  name: string;
  phone: string;
  email: string;
}

interface FormData {
  Country: string;
  State: string;
  District: string;
  schedule: string;
  Address: string;
  Description: string;
  longitude: string;
  latitude: string;
}

// 🔍 Reverse Geocoding Utility
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

const CreateCenter: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [coordinators, setCoordinators] = useState<Coordinator[]>([
    { name: "", phone: "", email: "" },
  ]);
  const [formData, setFormData] = useState<FormData>({
    Country: "",
    State: "",
    District: "",
    schedule: "",
    Address: "",
    Description: "",
    longitude: "",
    latitude: "",
  });

  // Center map on India by default
  const mapCenter: [number, number] = [20.5937, 78.9629];
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );

  // Fix Leaflet icons only on client side
  useEffect(() => {
    setIsMounted(true);

    // Only run this code on the client side
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (isMounted && !currentUser) {
      toast.error("You must be logged in to create a center.");
      router.push("/login-or-create-account");
    }
  }, [currentUser, router, isMounted]);

  // Don't render until mounted on client
  if (!isMounted) {
    return (
      <MyBackground>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white">Loading...</p>
        </div>
      </MyBackground>
    );
  }

  if (!currentUser) {
    return (
      <MyBackground>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white">Redirecting to login...</p>
        </div>
      </MyBackground>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinatorChange = (
    index: number,
    field: keyof Coordinator,
    value: string
  ) => {
    setCoordinators((prev) =>
      prev.map((coord, i) =>
        i === index ? { ...coord, [field]: value } : coord
      )
    );
  };

  const addCoordinator = () => {
    setCoordinators([...coordinators, { name: "", phone: "", email: "" }]);
  };

  const removeCoordinator = (index: number) => {
    if (coordinators.length > 1) {
      setCoordinators(coordinators.filter((_, i) => i !== index));
    }
  };

  // 🗺️ Handle map click + auto-fill address
  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;
    const latRounded = parseFloat(lat.toFixed(6));
    const lngRounded = parseFloat(lng.toFixed(6));

    setMarkerPosition([lat, lng]);
    setFormData((prev) => ({
      ...prev,
      latitude: latRounded.toString(),
      longitude: lngRounded.toString(),
    }));

    const geo = await reverseGeocode(lat, lng);
    if (geo) {
      setFormData((prev) => ({
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

  // 📍 Get current location + auto-fill
  const getCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    toast.loading("Getting your current location...", { id: "loc" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const lat = parseFloat(latitude.toFixed(6));
        const lng = parseFloat(longitude.toFixed(6));

        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));

        const geo = await reverseGeocode(lat, lng);
        if (geo) {
          setFormData((prev) => ({
            ...prev,
            Country: geo.country,
            State: geo.state,
            District: geo.district,
            Address: geo.fullAddress,
          }));
        }

        toast.success("Location set to your current position!", {
          id: "loc",
          duration: 3000,
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let msg = "Failed to get location";
        if (error.code === error.PERMISSION_DENIED)
          msg = "Location access denied.";
        toast.error(msg, { id: "loc" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.Country ||
        !formData.State ||
        !formData.District ||
        !formData.Address ||
        !formData.schedule
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      if (!formData.latitude || !formData.longitude) {
        toast.error("Please select a location on the map.");
        return;
      }

      const payload = {
        ...formData,
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        coordinators: coordinators.filter(
          (coord) => coord.name.trim() && coord.phone.trim()
        ),
        Description: formData.Description.trim() || null,
      };

      const response = await axios.post(`${API_URL}/centers/create`, payload, {
        withCredentials: true,
      });

      if (response.data?.success) {
        toast.success("Center created successfully!");
        router.push("/admin/dashboard");
      } else {
        throw new Error("Failed to create center");
      }
    } catch (error: any) {
      console.error("Error creating center:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create center. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyBackground>
      <Navbar />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Create New Center
            </h1>
            <p className="text-white/80 text-lg">
              Fill in the details and select location on the map below
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sm:p-8 space-y-8"
          >
            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-white mb-3 font-medium"
                  htmlFor="Country"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="Country"
                  name="Country"
                  required
                  value={formData.Country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., India"
                />
              </div>

              <div>
                <label
                  className="block text-white mb-3 font-medium"
                  htmlFor="State"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="State"
                  name="State"
                  required
                  value={formData.State}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Karnataka"
                />
              </div>

              <div>
                <label
                  className="block text-white mb-3 font-medium"
                  htmlFor="District"
                >
                  District *
                </label>
                <input
                  type="text"
                  id="District"
                  name="District"
                  required
                  value={formData.District}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bangalore"
                />
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-white font-medium">
                  Select Location on Map *
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  {isLocating ? "Locating..." : "📍 Use My Location"}
                </button>
              </div>
              <p className="text-white/70 text-sm mb-3">
                Click anywhere on the map to set the {"center's"} location.
              </p>
              <div className="h-80 rounded-xl overflow-hidden border border-white/20">
                <MapContainer
                  center={mapCenter}
                  zoom={5}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {markerPosition && <Marker position={markerPosition} />}
                  <MapClickHandler onClick={handleMapClick} />
                </MapContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.latitude}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white cursor-default"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.longitude}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white cursor-default"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label
                className="block text-white mb-3 font-medium"
                htmlFor="schedule"
              >
                Schedule *
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                required
                value={formData.schedule}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            </div>

            {/* Address */}
            <div>
              <label
                className="block text-white mb-3 font-medium"
                htmlFor="Address"
              >
                Full Address *
              </label>
              <textarea
                id="Address"
                name="Address"
                required
                rows={3}
                value={formData.Address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter complete address"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-white mb-3 font-medium"
                htmlFor="Description"
              >
                Description
              </label>
              <textarea
                id="Description"
                name="Description"
                rows={3}
                value={formData.Description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Optional description about the center"
              />
            </div>

            {/* Coordinators */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  Coordinators
                </h3>
                <button
                  type="button"
                  onClick={addCoordinator}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  + Add Coordinator
                </button>
              </div>

              {coordinators.map((coordinator, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">
                      Coordinator {index + 1}
                    </h4>
                    {coordinators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCoordinator(index)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={coordinator.name}
                        onChange={(e) =>
                          handleCoordinatorChange(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={coordinator.phone}
                        onChange={(e) =>
                          handleCoordinatorChange(
                            index,
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={coordinator.email}
                        onChange={(e) =>
                          handleCoordinatorChange(
                            index,
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional email"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Center...</span>
                  </>
                ) : (
                  <span>Create Center</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </MyBackground>
  );
};

export default CreateCenter;
