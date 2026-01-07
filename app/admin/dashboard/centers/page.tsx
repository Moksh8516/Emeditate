"use client";

import React, { useState, useEffect } from "react";
import MyBackground from "@/components/MyBackground";
import HeroSection from "@/components/centers/HeroSection";
import SearchSection from "@/components/centers/SearchSection";
import NearbyCentersSection from "@/components/centers/NearbyCentersSection";
import LocationFlowSection from "@/components/centers/LocationFlowSection";
import AllCentersSection from "@/components/centers/AllCentersSection";
import { Center, Country } from "@/types/centers";
import { centerService } from "@/lib/centerServices";
import Footer from "@/components/Footer";

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

  useEffect(() => {
    loadCountries();
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
        {/* Centers Top Header */}
        <header className="bg-white/10 md:shadow-lg backdop-blur-md px-4 py-3 rounded-xl sticky">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-center relative">
              {/* Center Title */}
              <h1 className="text-2xl font-bold text-white">
                Sahaja Yoga Centers
              </h1>

              {/* Optional Right Action (future use) */}
              {/* 
      <div className="absolute right-0 flex items-center">
        <button className="text-sm text-indigo-600 hover:underline">
          Login
        </button>
      </div> 
      */}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection countries={countries} />

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
