import React from "react";
import Link from "next/link";
import { Center, Coordinator } from "@/types/centers";
import { usePathname } from "next/navigation";

interface AllCentersSectionProps {
  centers: Center[];
  searchQuery: string;
  loading: boolean;
}

const AllCentersSection: React.FC<AllCentersSectionProps> = ({
  centers = [],
  searchQuery,
  loading,
}) => {
  const formatName = (name: string) => {
    return name.replace(/_/g, " ");
  };
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin/dashboard/centers");

  const formatSchedule = (schedule: string) => {
    return schedule.replace(/\n/g, ", ");
  };
  // console.log("centers in AllCenter page", centers);
  // console.log(searchQuery);
  if (loading) {
    return (
      <section className="mb-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-white mt-4">Loading centers...</p>
        </div>
      </section>
    );
  }

  const count = centers?.length ?? 0;

  if (count === 0 && searchQuery) {
    return (
      <section className="mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Centers Found
          </h3>
          <p className="text-gray-300">
            {`No centers found for ${searchQuery}. Try adjusting your search`}
            criteria or browse by district.
          </p>
        </div>
      </section>
    );
  }

  if (count === 0) {
    // When no centers and no search query, show friendly empty state
    return (
      <section className="mb-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">
            No Centers Available
          </h3>
          <p className="text-gray-300">
            No centers are available at the moment. Try changing filters or
            check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Found Centers"}
          </h2>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {count} {count === 1 ? "Center" : "Centers"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div
              key={center.id}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              {/* Location Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                    {formatName(center.District)}
                  </span>
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                    {formatName(center.State)}
                  </span>
                </div>
                {center.coordinators && center.coordinators.length > 0 && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    {center.coordinators.length} coordinator
                    {center.coordinators.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Center Name */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                {center.Address.split(",")[0] || "Sahaja Yoga Center"}
              </h3>

              {/* Address */}
              <div className="space-y-3 text-sm text-gray-300 mb-4">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
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
                  <span className="leading-relaxed">{center.Address}</span>
                </div>

                {/* Schedule */}
                {center.schedule && (
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
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
                    <span className="leading-relaxed">
                      {formatSchedule(center.schedule)}
                    </span>
                  </div>
                )}
              </div>

              {/* Coordinators */}
              {center.coordinators && center.coordinators.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    Coordinators:
                  </h4>
                  <div className="space-y-2">
                    {center.coordinators
                      .slice(0, 2)
                      .map((coordinator: Coordinator, index: number) => (
                        <div key={index} className="bg-white/5 rounded-lg p-2">
                          <div className="font-medium text-white text-sm">
                            {coordinator.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {coordinator.phone}
                          </div>
                          {coordinator.email && (
                            <div className="text-xs text-gray-400 truncate">
                              {coordinator.email}
                            </div>
                          )}
                        </div>
                      ))}
                    {center.coordinators.length > 2 && (
                      <div className="text-center text-xs text-gray-400">
                        +{center.coordinators.length - 2} more coordinator
                        {center.coordinators.length - 2 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link
                  href={
                    isAdminRoute
                      ? `/admin/dashboard/centers/${center.id}`
                      : `/centers/${center.id}`
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200 font-medium text-sm text-center"
                >
                  View Details
                </Link>
                {/* ✅ Only show Contact button if first coordinator has a phone */}
                {center.coordinators &&
                  center.coordinators.length > 0 &&
                  center.coordinators[0].phone && (
                    <a
                      href={`tel:${center.coordinators[0].phone}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-200 font-medium text-sm text-center block"
                    >
                      Contact
                    </a>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCentersSection;
