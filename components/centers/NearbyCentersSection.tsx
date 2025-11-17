import React, { useState } from "react";
import { centerService } from "@/lib/centerServices";
import { Center } from "@/types/centers";

interface NearbyCentersSectionProps {
  onNearbyCentersFound: (centers: Center[]) => void;
  loading: boolean;
}

const NearbyCentersSection: React.FC<NearbyCentersSectionProps> = ({
  onNearbyCentersFound,
  loading,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [lastLocation, setLastLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const findNearbyCenters = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLastLocation({ latitude, longitude });

          const centers = await centerService.findNearbyCenters({
            latitude,
            longitude,
            // Note: API automatically uses 5km radius and falls back to nearest center
          });

          onNearbyCentersFound(centers);
        } catch (error) {
          console.error("Error finding nearby centers:", error);
          alert("Error finding nearby centers. Please try again.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access to use this feature.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again.";
            break;
          default:
            errorMessage += "Please ensure location services are enabled.";
        }

        alert(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache location for 1 minute
      }
    );
  };

  const handleRetryLastLocation = async () => {
    if (!lastLocation) return;

    setIsLocating(true);
    try {
      const centers = await centerService.findNearbyCenters({
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude,
      });
      onNearbyCentersFound(centers);
    } catch (error) {
      console.error("Error finding nearby centers:", error);
      alert("Error finding nearby centers. Please try again.");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">
              Find Centers Near You
            </h2>
            <p className="text-gray-200">
              Discover centers within 5km of your location. If no centers are
              found nearby,
              {"we'll"} show you the closest available center.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {lastLocation && (
              <button
                onClick={handleRetryLastLocation}
                disabled={isLocating || loading}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2 whitespace-nowrap"
              >
                {isLocating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Retry Search</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={findNearbyCenters}
              disabled={isLocating || loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2 whitespace-nowrap"
            >
              {isLocating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Locating...</span>
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {lastLocation ? "Update Location" : "Find Nearby Centers"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-200 text-sm flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
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
                <strong>How it works:</strong> We search for centers within 5km
                of your location. If no centers are found in this range,{" "}
                {"we'll"} automatically show you the nearest available center.
              </span>
            </p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-200 text-sm flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
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
              <span>
                <strong>Privacy Note:</strong> Your location data is used only
                for this search and is not stored. We respect your privacy and
                only process location information in your browser.
              </span>
            </p>
          </div>
        </div>

        {lastLocation && !isLocating && !loading && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-200 text-sm text-center">
              ✅ Nearby centers loaded below
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyCentersSection;
