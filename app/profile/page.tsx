"use client";

import MyBackground from "@/components/MyBackground";
import React, { useState, useEffect } from "react";
import {
  BsArrowLeft,
  BsCamera,
  BsPencil,
  BsCheck,
  BsX,
  BsTrash,
  BsBoxArrowRight,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthModel";
import { v4 as uuidv4 } from "uuid";

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  dob: string;
  profileImage: string;
  phonenumber: string;
}

// API response interface
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: User;
}

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showClearDataPopup, setShowClearDataPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [captcherInput, setcaptcherInput] = useState("");
  const { setCurrentUser, currentUser } = useAuthStore();
  const router = useRouter();

  // Captcha generation (fixed)
  const generateCaptchaFromUuid = (): string => {
    const cleanUuid = uuidv4().replace(/-/g, "");
    const length = Math.floor(Math.random() * 2) + 7; // 7 or 8
    return cleanUuid.substring(0, length);
  };

  // Stable captcha value
  const captcherString = React.useMemo(() => {
    const uuid = generateCaptchaFromUuid();
    return (currentUser?.name || "User") + uuid;
  }, [currentUser?.name]);

  // Mock API call to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await api.post(
          `${API_URL}/profile`,
          {},
          { withCredentials: true }
        );
        setCurrentUser(res.data.data);
        setEditedUser(res.data.data);
        setUser(res.data.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        // Optionally clear user or redirect
        // Fallback mock data
        const mockUser: User = {
          id: "1",
          name: "Alex Johnson",
          email: "alex.johnson@example.com",
          dob: "1990-05-15",
          profileImage: "",
          phonenumber: "+1 (555) 123-4567",
        };
        setUser(mockUser);
        setEditedUser(mockUser);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editedUser),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setUser((prev) => (prev ? { ...prev, ...editedUser } : null));
        setIsEditing(false);
        console.log("Profile updated successfully");
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await api.post(`${API_URL}/logout`, {}, { withCredentials: true });
      router.push("/chat");
      setCurrentUser(null);
      toast.success("logout successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("failed to signout user");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete(`${API_URL}/delete-account`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setShowDeletePopup(false);
        setCurrentUser(null);
        toast.success("Account deleted successfully");
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  const handleClearData = async () => {
    try {
      if (captcherInput.trim() !== captcherString) {
        toast.error("Captcher does not match");
        return;
      }
      const response = await api.delete(`${API_URL}/delete-all-sessions`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setShowClearDataPopup(false);
        setcaptcherInput("");
        toast.success("All data cleared successfully");
        console.log("Data cleared successfully");
      } else {
        throw new Error(response.data || "Failed to clear data");
      }
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditedUser((prev) => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <MyBackground>
        <div className="flex items-center justify-between p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BsArrowLeft
              className="text-gray-200 cursor-pointer hover:text-white transition-all transform hover:scale-110"
              size={24}
              onClick={() => router.push("/chat")}
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-5xl text-gray-50 font-bold text-center flex-1 mx-4"
          >
            PROFILE
          </motion.h1>
          <div className="w-6"></div>
        </div>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-3 border-white/30 border-t-white"
          ></motion.div>
        </div>
      </MyBackground>
    );
  }

  return (
    <MyBackground>
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <BsArrowLeft
            className="text-gray-200 cursor-pointer hover:text-white transition-all"
            size={28}
            onClick={() => router.push("/chat")}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-center flex-1 mx-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          PROFILE
        </motion.h1>

        <div className="w-6"></div>
      </div>

      {/* Profile Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6"
      >
        {/* Profile Image Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-6 sm:mb-8"
        >
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-3 border-white/30 shadow-xl"
            >
              {editedUser.profileImage ? (
                <img
                  src={editedUser.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {editedUser.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </motion.div>

            {isEditing && (
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition-all group"
              >
                <BsCamera className="text-white text-sm" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </motion.label>
            )}
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-4 flex gap-2 flex-wrap justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditToggle}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-md text-sm ${
                isEditing
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-4 w-4 border-2 border-white/30 border-t-white"
                ></motion.div>
              ) : isEditing ? (
                <>
                  <BsCheck className="text-base" />
                  Save
                </>
              ) : (
                <>
                  <BsPencil className="text-sm" />
                  Edit Profile
                </>
              )}
            </motion.button>

            {isEditing && (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                disabled={isSaving}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white transition-all shadow-md text-sm ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <BsX className="text-base" />
                Cancel
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-5 shadow-xl border border-white/20 mb-6"
        >
          <div className="space-y-5">
            {/* Name Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Full Name
              </label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  type="text"
                  value={editedUser.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm text-sm"
                  placeholder="Enter your name"
                  disabled={isSaving}
                />
              ) : (
                <div className="px-3 py-2.5 bg-white/5 rounded-lg border border-transparent backdrop-blur-sm">
                  <p className="text-white">{user?.name}</p>
                </div>
              )}
            </motion.div>

            {/* Email Field (Non-editable) */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Email Address
              </label>
              <div className="px-3 py-2.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                <p className="text-gray-300">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </motion.div>

            {/* Phone Number Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Phone Number
              </label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  type="tel"
                  value={editedUser.phonenumber || ""}
                  onChange={(e) =>
                    handleInputChange("phonenumber", e.target.value)
                  }
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm text-sm"
                  placeholder="Enter your phone number"
                  disabled={isSaving}
                />
              ) : (
                <div className="px-3 py-2.5 bg-white/5 rounded-lg border border-transparent backdrop-blur-sm">
                  <p className="text-white">{user?.phonenumber}</p>
                </div>
              )}
            </motion.div>

            {/* Date of Birth Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Date of Birth
              </label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  type="date"
                  value={editedUser.dob || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm text-sm"
                  disabled={isSaving}
                />
              ) : (
                <div className="px-3 py-2.5 bg-white/5 rounded-lg border border-transparent backdrop-blur-sm">
                  <p className="text-white">{user?.dob}</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons - More Compact */}
        <motion.div variants={itemVariants} className="space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowClearDataPopup(true)}
              className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all shadow-md text-sm flex items-center justify-center gap-2"
            >
              <BsTrash className="text-xs" />
              Clear Data
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSignOut}
              className="py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm shadow-md text-sm flex items-center justify-center gap-2"
            >
              <BsBoxArrowRight className="text-xs" />
              Sign Out
            </motion.button>
          </div>

          {/* Delete Account Button - Full Width */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeletePopup(true)}
            className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-md text-sm flex items-center justify-center gap-2"
          >
            <BsTrash className="text-xs" />
            Delete Account
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {showDeletePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-indigo-900 rounded-xl p-5 max-w-sm w-full border border-white/20 shadow-2xl"
            >
              <div className="text-center mb-1">
                <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BsTrash className="text-rose-400 text-lg" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Delete Account?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </p>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeletePopup(false)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all text-sm"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Data Confirmation Popup */}
      <AnimatePresence>
        {showClearDataPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-amber-900 rounded-xl p-5 max-w-sm w-full border border-white/20 shadow-2xl"
            >
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BsTrash className="text-amber-400 text-lg" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Clear All Data?
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  This will delete all your chat history and preferences. This
                  action cannot be undone.
                </p>
              </div>

              <div className="mb-3">
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Type the text below to confirm
                </label>
                <div className="relative">
                  <input
                    type={"text"}
                    value={captcherInput}
                    onChange={(e) => setcaptcherInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                    placeholder="Enter the captcha text"
                    autoComplete="off"
                  />
                  {/* Display captcha */}
                  <div className="mt-2 p-3 bg-black/30 rounded-lg border border-amber-500/30">
                    <p className="text-amber-300 text-sm font-mono tracking-wider break-all">
                      {captcherString}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowClearDataPopup(false);
                    setcaptcherInput("");
                  }}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearData}
                  disabled={
                    !captcherInput || captcherInput.trim() !== captcherString
                  }
                  className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
                    captcherInput.trim() === captcherString
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Clear Data
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MyBackground>
  );
}

export default ProfilePage;
