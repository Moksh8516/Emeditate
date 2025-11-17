/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthModel";
import LeafletMap from "@/components/centers/LeafletMap";
import MyBackground from "@/components/MyBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_URL } from "@/lib/config";

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

export default function CreateCenter() {
  const router = useRouter();
  const { currentUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
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

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to continue");
      router.push("/login-or-create-account");
    }
  }, [currentUser, router]);

  // Input Handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Map → Form auto-fill
  const handleAddressSelect = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      Country: data.country,
      State: data.state,
      District: data.district,
      Address: data.fullAddress,
      latitude: data.lat,
      longitude: data.lng,
    }));
  };

  const addCoordinator = () => {
    setCoordinators([...coordinators, { name: "", phone: "", email: "" }]);
  };

  const removeCoordinator = (index: number) => {
    setCoordinators(coordinators.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.Country || !formData.State || !formData.District) {
        toast.error("Fill all required fields.");
        return;
      }

      if (!formData.latitude || !formData.longitude) {
        toast.error("Select location on map.");
        return;
      }

      const payload = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        coordinators: coordinators.filter(
          (c) => c.name.trim() && c.phone.trim()
        ),
      };

      const res = await axios.post(`${API_URL}/centers/create`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Center created!");
        router.push("/centers");
      } else throw new Error();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create center");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <MyBackground>
      <Navbar />

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            Create New Center
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white/10 p-8 rounded-2xl border border-white/20 space-y-8 backdrop-blur-sm"
          >
            {/* Map */}
            <div>
              <label className="text-white font-medium">
                Select Location on Map *
              </label>
              <LeafletMap onAddressSelect={handleAddressSelect} />
            </div>

            {/* Country / State / District fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Country", "State", "District"].map((field) => (
                <div key={field}>
                  <label className="block text-white mb-1">{field} *</label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
                  />
                </div>
              ))}
            </div>

            {/* Address */}
            <div>
              <label className="block text-white mb-1">Full Address *</label>
              <textarea
                name="Address"
                rows={3}
                value={formData.Address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-white mb-1">Schedule *</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white mb-1">Description</label>
              <textarea
                name="Description"
                rows={3}
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
              />
            </div>

            {/* Coordinators */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-white font-semibold">
                  Coordinators
                </h3>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 rounded-xl text-white"
                  onClick={addCoordinator}
                >
                  + Add Coordinator
                </button>
              </div>

              <div className="space-y-4 mt-4">
                {coordinators.map((c, i) => (
                  <div key={i} className="bg-white/10 p-4 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={c.name}
                        onChange={(e) =>
                          (coordinators[i].name = e.target.value) &&
                          setCoordinators([...coordinators])
                        }
                        className="px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30"
                      />

                      <input
                        type="tel"
                        required
                        placeholder="Phone"
                        value={c.phone}
                        onChange={(e) =>
                          (coordinators[i].phone = e.target.value) &&
                          setCoordinators([...coordinators])
                        }
                        className="px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30"
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={c.email}
                        onChange={(e) =>
                          (coordinators[i].email = e.target.value) &&
                          setCoordinators([...coordinators])
                        }
                        className="px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30"
                      />
                    </div>

                    {coordinators.length > 1 && (
                      <button
                        type="button"
                        className="mt-2 text-red-400"
                        onClick={() => removeCoordinator(i)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {loading ? "Creating..." : "Create Center"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </MyBackground>
  );
}
