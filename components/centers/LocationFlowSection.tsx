import React, { useState, useEffect } from "react";
import { Country, State, District } from "@/types/centers";
import { centerService } from "@/lib/centerServices";

interface LocationFlowSectionProps {
  countries: Country[];
  currentStep: "country" | "state" | "district" | "centers";
  selectedCountry: Country | null;
  selectedState: string | null;
  selectedDistrict: string | null;
  onCountrySelect: (country: Country) => void;
  onStateSelect: (state: string) => void;
  onDistrictSelect: (district: string) => void;
  onBackToCountries: () => void;
  onBackToStates: () => void;
  onBackToDistricts: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFlowCentersFound: (centers: any[]) => void;
  loading: boolean;
}

const LocationFlowSection: React.FC<LocationFlowSectionProps> = ({
  countries,
  currentStep,
  selectedCountry,
  selectedState,
  selectedDistrict,
  onCountrySelect,
  onStateSelect,
  onDistrictSelect,
  onBackToCountries,
  onBackToStates,
  onBackToDistricts,
  onFlowCentersFound,
  loading,
}) => {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load states when country is selected
  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      centerService
        .getCountryStates(selectedCountry.country)
        .then(setStates)
        .catch(console.error)
        .finally(() => setLoadingStates(false));
    }
  }, [selectedCountry]);

  // Load districts when state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoadingDistricts(true);
      centerService
        .getDistricts(selectedCountry.country, selectedState)
        .then(setDistricts)
        .catch(console.error)
        .finally(() => setLoadingDistricts(false));
    }
  }, [selectedCountry, selectedState]);

  const handleFindCenters = async () => {
    if (!selectedCountry || !selectedState || !selectedDistrict) return;

    try {
      const centers = await centerService.getCentersInDistrict(
        selectedCountry.country,
        selectedState,
        selectedDistrict
      );
      onFlowCentersFound(centers);
    } catch (error) {
      console.error("Error fetching centers in district:", error);
      alert("Error fetching centers. Please try again.");
    }
  };

  const formatName = (name: string) => {
    return name.replace(/_/g, " ");
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "country":
        return 25;
      case "state":
        return 50;
      case "district":
        return 75;
      case "centers":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Browse Centers by Location
            </h2>
            <div className="text-sm text-gray-300">
              Step{" "}
              {["country", "state", "district", "centers"].indexOf(
                currentStep
              ) + 1}{" "}
              of 4
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-2">
            <div
              className={`text-center ${currentStep === "country" ? "text-blue-300 font-semibold" : "text-gray-400"}`}
            >
              <div className="text-sm">Country</div>
            </div>
            <div
              className={`text-center ${currentStep === "state" ? "text-blue-300 font-semibold" : "text-gray-400"}`}
            >
              <div className="text-sm">State</div>
            </div>
            <div
              className={`text-center ${currentStep === "district" ? "text-blue-300 font-semibold" : "text-gray-400"}`}
            >
              <div className="text-sm">District</div>
            </div>
            <div
              className={`text-center ${currentStep === "centers" ? "text-blue-300 font-semibold" : "text-gray-400"}`}
            >
              <div className="text-sm">Centers</div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {(currentStep !== "country" || selectedCountry) && (
          <div className="flex items-center space-x-2 mb-6 text-sm">
            <button
              onClick={onBackToCountries}
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              All Countries
            </button>

            {selectedCountry && (
              <>
                <span className="text-gray-400">›</span>
                {currentStep === "country" ? (
                  <span className="text-white font-semibold">
                    {formatName(selectedCountry.country)}
                  </span>
                ) : (
                  <button
                    onClick={onBackToStates}
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {formatName(selectedCountry.country)}
                  </button>
                )}
              </>
            )}

            {selectedState && (
              <>
                <span className="text-gray-400">›</span>
                {currentStep === "state" ? (
                  <span className="text-white font-semibold">
                    {formatName(selectedState)}
                  </span>
                ) : (
                  <button
                    onClick={onBackToDistricts}
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {formatName(selectedState)}
                  </button>
                )}
              </>
            )}

            {selectedDistrict && currentStep === "centers" && (
              <>
                <span className="text-gray-400">›</span>
                <span className="text-white font-semibold">
                  {formatName(selectedDistrict)}
                </span>
              </>
            )}
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-96">
          {/* Country Selection */}
          {currentStep === "country" && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Select a Country to Explore Centers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {countries.map((country) => (
                  <div
                    key={country.country}
                    onClick={() => onCountrySelect(country)}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {formatName(country.country)}
                      </h4>
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        {country.count}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {country.count} center{country.count !== 1 ? "s" : ""}{" "}
                      available
                    </p>
                    <div className="mt-3 flex items-center text-blue-300 text-sm">
                      <span>View states</span>
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* State Selection */}
          {currentStep === "state" && selectedCountry && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Select a State in {formatName(selectedCountry.country)}
              </h3>

              {loadingStates ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-white mt-4">Loading states...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {states.map((state) => (
                    <div
                      key={state.state}
                      onClick={() => onStateSelect(state.state)}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 cursor-pointer transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                          {formatName(state.state)}
                        </h4>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                          {state.totalCenters}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {state.totalCenters} center
                        {state.totalCenters !== 1 ? "s" : ""} in this state
                      </p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(state.totalCenters / Math.max(...states.map((s) => s.totalCenters))) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-3 flex items-center text-green-300 text-sm">
                        <span>View districts</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* District Selection */}
          {currentStep === "district" && selectedCountry && selectedState && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Select a District in {formatName(selectedState)},{" "}
                {formatName(selectedCountry.country)}
              </h3>

              {loadingDistricts ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="text-white mt-4">Loading districts...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {districts.map((district) => (
                    <div
                      key={district.district}
                      onClick={() => onDistrictSelect(district.district)}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {formatName(district.district)}
                        </h4>
                        <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                          {district.totalCenters}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {district.totalCenters} center
                        {district.totalCenters !== 1 ? "s" : ""} in this
                        district
                      </p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${(district.totalCenters / Math.max(...districts.map((d) => d.totalCenters))) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-3 flex items-center text-purple-300 text-sm">
                        <span>View centers</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Centers Action */}
          {currentStep === "centers" &&
            selectedCountry &&
            selectedState &&
            selectedDistrict && (
              <div className="text-center py-8">
                <div className="bg-white/5 rounded-xl p-8 border border-white/10 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Centers in {formatName(selectedDistrict)}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Ready to explore centers in {formatName(selectedDistrict)},{" "}
                    {formatName(selectedState)}?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-300">
                        {selectedCountry.count}
                      </div>
                      <div className="text-sm text-gray-300">
                        Total in Country
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-300">
                        {states.find((s) => s.state === selectedState)
                          ?.totalCenters || 0}
                      </div>
                      <div className="text-sm text-gray-300">
                        Total in State
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-300">
                        {districts.find((d) => d.district === selectedDistrict)
                          ?.totalCenters || 0}
                      </div>
                      <div className="text-sm text-gray-300">
                        Total in District
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFindCenters}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2 mx-auto"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading Centers...</span>
                      </>
                    ) : (
                      <>
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
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                          />
                        </svg>
                        <span>
                          Explore{" "}
                          {districts.find(
                            (d) => d.district === selectedDistrict
                          )?.totalCenters || 0}{" "}
                          Centers
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default LocationFlowSection;
