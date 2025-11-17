import React, { useState, useEffect } from "react";
import { Country, State } from "@/types/centers";
import { centerService } from "@/lib/centerServices";

interface CentersByDistrictSectionProps {
  countries: Country[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDistrictCentersFound: (centers: any[]) => void;
  loading: boolean;
}

const CentersByDistrictSection: React.FC<CentersByDistrictSectionProps> = ({
  countries,
  onDistrictCentersFound,
  loading,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      centerService
        .getCountryStates(selectedCountry)
        .then(setStates)
        .catch(console.error)
        .finally(() => setLoadingStates(false));
    } else {
      setStates([]);
      setSelectedState("");
    }
  }, [selectedCountry]);

  const handleFindCenters = async () => {
    if (!selectedState) return;

    try {
      // Since we don't have district-level API yet, we'll use state-level data
      // You can replace this with actual district API when available
      const centers = await centerService.searchCenters("", {
        state: selectedState,
      });
      onDistrictCentersFound(centers);
    } catch (error) {
      console.error("Error fetching centers in state:", error);
      alert("Error fetching centers. Please try again.");
    }
  };

  // Format names for display (remove underscores)
  const formatName = (name: string) => {
    return name.replace(/_/g, " ");
  };

  return (
    <section className="mb-12">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Browse Centers by Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Country Selection */}
          <div>
            <label
              htmlFor="browse-country"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Country
            </label>
            <select
              id="browse-country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.country} value={country.country}>
                  {formatName(country.country)} ({country.count} centers)
                </option>
              ))}
            </select>
          </div>

          {/* State Selection */}
          <div>
            <label
              htmlFor="browse-state"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              State / Region
            </label>
            <select
              id="browse-state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!selectedCountry || loadingStates}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.state} value={state.state}>
                  {formatName(state.state)} ({state.totalCenters} centers)
                </option>
              ))}
            </select>
            {loadingStates && (
              <p className="text-xs text-gray-400 mt-1">Loading states...</p>
            )}
          </div>
        </div>

        {/* Statistics Card */}
        {selectedCountry && (
          <div className="mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                {formatName(selectedCountry)} - Center Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">
                    {countries.find((c) => c.country === selectedCountry)
                      ?.count || 0}
                  </div>
                  <div className="text-sm text-gray-300">Total Centers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {states.length}
                  </div>
                  <div className="text-sm text-gray-300">States/Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">
                    {states.reduce((acc, state) => acc + state.totalCenters, 0)}
                  </div>
                  <div className="text-sm text-gray-300">
                    Total in Selection
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top States Preview */}
        {selectedCountry && states.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Top States with Most Centers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {states
                .sort((a, b) => b.totalCenters - a.totalCenters)
                .slice(0, 6)
                .map((state) => (
                  <div
                    key={state.state}
                    className={`bg-white/5 rounded-lg p-3 border ${
                      selectedState === state.state
                        ? "border-purple-500"
                        : "border-white/10"
                    } cursor-pointer hover:bg-white/10 transition-colors`}
                    onClick={() => setSelectedState(state.state)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-medium">
                        {formatName(state.state)}
                      </span>
                      <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                        {state.totalCenters}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(state.totalCenters / Math.max(...states.map((s) => s.totalCenters))) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleFindCenters}
            disabled={!selectedState || loading}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2"
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
                  Find Centers in{" "}
                  {selectedState ? formatName(selectedState) : "State"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CentersByDistrictSection;
