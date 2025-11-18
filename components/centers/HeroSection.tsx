import React from "react";
import { Country } from "@/types/centers";
import { motion } from "framer-motion";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/useAuthModel";
interface HeroSectionProps {
  countries?: Country[];
}
// Simple fade-in animation
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const HeroSection: React.FC<HeroSectionProps> = ({ countries }) => {
  const totalCenters =
    countries?.reduce((acc, country) => acc + country.count, 0) || 0;
  const totalCountries = countries?.length || 0;
  // const { currentUser } = useAuthStore();
  // const router = useRouter();

  return (
    <motion.section
      className="text-center mb-10"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Main Title */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
        variants={fadeInUp}
      >
        Find Your <span className="text-blue-300">Meditation Center</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8"
        variants={fadeInUp}
      >
        Discover {totalCenters.toLocaleString()} centers across {totalCountries}{" "}
        countries worldwide. Search by location, browse by region, or find
        centers nearby using your current location.
      </motion.p>

      {/* Statistics */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8"
        variants={staggerContainer}
      >
        {[
          {
            value: totalCenters.toLocaleString(),
            label: "Total Centers",
            color: "text-blue-300",
          },
          {
            value: totalCountries,
            label: "Countries",
            color: "text-green-300",
          },
          { value: "50+", label: "States/Regions", color: "text-purple-300" },
          { value: "1000+", label: "Cities Covered", color: "text-yellow-300" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-gray-300 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      {/* <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        variants={staggerContainer}
      >
        {[
          {
            icon: (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            ),
            title: "Smart Search",
            description:
              "Find centers by name, location, or keywords with real-time filtering",
            bgColor: "bg-blue-500",
          },
          {
            icon: (
              <svg
                className="w-6 h-6 text-white"
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
            ),
            title: "Nearby Centers",
            description:
              "Discover centers close to your current location with geolocation",
            bgColor: "bg-green-500",
          },
          {
            icon: (
              <svg
                className="w-6 h-6 text-white"
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
            ),
            title: "Browse by Region",
            description:
              "Explore centers by country and state with detailed statistics",
            bgColor: "bg-purple-500",
          },
        ].map((feature) => (
          <motion.div
            key={feature.title}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            variants={fadeInUp}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div> */}
      {/* <div className="flex justify-end mr-5 md:justify-end mt-3 ">
        <button
          className="bg-green-600 hover:bg-green-500 font-semibold text-white flex gap-3 px-3 py-2 justify-center rounded-lg"
          onClick={() =>
            currentUser
              ? router.push("/centers/create")
              : router.push("/login-or-create-account")
          }
        >
          <span>
            <Plus />
          </span>
          <span>ADD Center</span>
        </button>
      </div> */}
    </motion.section>
  );
};

export default HeroSection;
