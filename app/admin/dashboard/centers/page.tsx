"use client";

import React, { useState, useEffect, useRef } from "react";
import MyBackground from "@/components/MyBackground";
import HeroSection from "@/components/centers/HeroSection";
import SearchSection from "@/components/centers/SearchSection";
import NearbyCentersSection from "@/components/centers/NearbyCentersSection";
import LocationFlowSection from "@/components/centers/LocationFlowSection";
import AllCentersSection from "@/components/centers/AllCentersSection";
import { Center, Country } from "@/types/centers";
import { centerService } from "@/lib/centerServices";
import Footer from "@/components/Footer";
import { FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthModel";
import { API_URL } from "@/lib/config";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { CurrentUser } from "../blog/page";
import { MapPin, Plus } from "lucide-react";

type FlowStep = "country" | "state" | "district" | "centers";
type ResultsSource = "search" | "nearby" | "flow" | null;

const CentersPage: React.FC = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsSource, setResultsSource] = useState<ResultsSource>(null);
  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>("country");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    email: "",
    initial: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getProfile = async () => {
    try {
      const res = await api.post(
        `${API_URL}/profile`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setCurrentUser({
          name: res.data.data.name,
          email: res.data.data.email,
          initial: res.data.data.name.charAt(0).toUpperCase(),
        });

        useAuthStore.getState().setCurrentUser({
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data?.role,
          initial: res.data.data.name.charAt(0).toUpperCase(),
          dob: res.data.data?.dob,
          profileImage: res.data.data?.profileImage,
          age: res.data.data?.age,
        });
      } else {
        throw new Error(res.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Authentication failed. Redirecting to login...");
      router.push("/admin/login");
    }
  };

  const handleSignOut = async () => {
    const res = await api.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    if (res.data.success) {
      toast.success("Logged out successfully!");
      useAuthStore.getState().clearUser();
      router.push("/admin/login");
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    loadCountries();
    getProfile();
  }, []);

  const loadCountries = async () => {
    try {
      const countriesData = await centerService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (query: string, filters?: any) => {
    setLoading(true);
    try {
      const results = await centerService.searchCenters(query, filters);
      setCenters(results);
      setSearchQuery(query);
      setResultsSource("search");
      // Reset flow when searching
      setCurrentStep("country");
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedDistrict(null);
    } catch (error) {
      console.error("Error searching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNearbyCenters = (nearbyCenters: Center[]) => {
    // console.log("nearbyCenters in fn", nearbyCenters);
    setCenters(nearbyCenters);
    setSearchQuery("Nearby Centers");
    setResultsSource("nearby");
    // Reset flow when using nearby
    setCurrentStep("country");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedDistrict(null);
  };

  const handleFlowCenters = (flowCenters: Center[]) => {
    setCenters(flowCenters);
    setSearchQuery(`Centers in ${selectedDistrict}`);
    setResultsSource("flow");
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedDistrict(null);
    setCurrentStep("state");
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict(null);
    setCurrentStep("district");
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setCurrentStep("centers");
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedDistrict(null);
    setCurrentStep("country");
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setCurrentStep("state");
  };

  const handleBackToDistricts = () => {
    setSelectedDistrict(null);
    setCurrentStep("district");
  };
  // console.log("centers", centers);
  return (
    <MyBackground>
      <div className="min-h-screen py-8">
        {/* Top Navigation Bar */}
        <header className="bg-white/10 md:shadow-lg backdop-blur-md mb-5 rounded-xl relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <Link href="/admin/dashboard">
                    <h1 className="text-xl font-bold text-white">
                      Centers Dashboard
                    </h1>
                    <p className="text-sm text-gray-300">
                      Find Sahaja Yoga Centers Worldwide
                    </p>
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                {/* User Profile Dropdown */}
                <div className="relative ml-3" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none px-3 py-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {currentUser.initial}
                    </div>
                    <span className="ml-2 font-medium hidden text-gray-100 md:inline">
                      {currentUser.name}
                    </span>
                    <FiChevronDown className="ml-1 text-gray-100" />
                  </button>

                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-3 px-4 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUserCircle className="mr-3 text-gray-500" />
                          My Profile
                        </Link>
                        <Link
                          href="/admin/dashboard/change-password"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className="mr-3 text-gray-500" />
                          Change Password
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaSignOutAlt className="mr-3 text-gray-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection countries={countries} />
        <div className="flex justify-end mr-5 md:justify-end my-3 ">
          <button
            className="bg-green-600 hover:bg-green-500 font-semibold text-white flex gap-3 px-3 py-2 justify-center rounded-lg"
            onClick={() =>
              currentUser
                ? router.push("/admin/dashboard/centers/create")
                : router.push("/login-or-create-account")
            }
          >
            <span>
              <Plus />
            </span>
            <span>ADD Center</span>
          </button>
        </div>
        {/* Search Section */}
        <SearchSection onSearch={handleSearch} loading={loading} />
        {(resultsSource === "search" || (loading && !resultsSource)) && (
          <AllCentersSection
            centers={centers}
            searchQuery={searchQuery}
            loading={loading}
          />
        )}

        {/* Nearby Centers Section */}
        <NearbyCentersSection
          onNearbyCentersFound={handleNearbyCenters}
          loading={loading}
        />
        {resultsSource === "nearby" && (
          <AllCentersSection
            centers={centers}
            searchQuery={searchQuery}
            loading={loading}
          />
        )}

        {/* Location Flow Section */}
        <LocationFlowSection
          countries={countries}
          currentStep={currentStep}
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          onCountrySelect={handleCountrySelect}
          onStateSelect={handleStateSelect}
          onDistrictSelect={handleDistrictSelect}
          onBackToCountries={handleBackToCountries}
          onBackToStates={handleBackToStates}
          onBackToDistricts={handleBackToDistricts}
          onFlowCentersFound={handleFlowCenters}
          loading={loading}
        />

        {/* Results Section */}
        {resultsSource === "flow" && (
          <AllCentersSection
            centers={centers}
            searchQuery={searchQuery}
            loading={loading}
          />
        )}
      </div>
      <Footer />
    </MyBackground>
  );
};

export default CentersPage;
