"use client";
// pages/introduction.tsx
import { useEffect, useRef, useState } from "react";
import MyBackground from "@/components/MyBackground";
import { motion, useAnimation, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function IntroductionPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  // Animation controls for each section
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();

  // Refs for scroll detection
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  // Check if elements are in view
  const inView1 = useInView(ref1, { once: true, margin: "-100px" });
  const inView2 = useInView(ref2, { once: true, margin: "-100px" });
  const inView3 = useInView(ref3, { once: true, margin: "-100px" });
  const inView4 = useInView(ref4, { once: true, margin: "-100px" });

  // Animate when in view
  useEffect(() => {
    if (inView1) controls1.start("visible");
    if (inView2) controls2.start("visible");
    if (inView3) controls3.start("visible");
    if (inView4) controls4.start("visible");
  }, [
    inView1,
    inView2,
    inView3,
    inView4,
    controls1,
    controls2,
    controls3,
    controls4,
  ]);

  return (
    <MyBackground>
      <Navbar />
      <div className="min-h-screen py-5">
        {/* Hero Section */}
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-indigo-900/50 z-10"></div>
          <div className="absolute inset-0 opacity-10"></div>
          <div className="relative z-20 text-center px-2 md:px-4 max-w-4xl">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Sahaja Yoga
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-4xl font-light text-purple-200 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Path to Self-Realization
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-purple-900/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-700/30">
                <blockquote className="text-white text-lg md:text-xl italic leading-relaxed">
                  The time has come for all of you to get your self-realisation,
                  by which your attention becomes enlightened, your health gets
                  completely all right, your mental processes are sensible, but
                  above all you stand in your present.
                </blockquote>
                <p className="mt-4 text-purple-300 font-medium">
                  – H.H. Shri Mataji Nirmala Devi, 29.09.1994, Los Angeles, USA
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-2 md:px-4 py-16 max-w-6xl">
          {/* Introduction */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/heroImage.jpg')] bg-center bg-contain bg-no-repeat w-full h-full">
                    <Image
                      src={"/heroImage.jpg"}
                      alt="Sahaja Yoga Hero Image"
                      className="w-full h-full object-cover"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  What is Sahaja Yoga?
                </h2>
                <p className="text-gray-700 text-lg mb-4">
                  Sahaja Yoga is a meditation technique developed by Shri Mataji
                  Nirmala Devi in 1970. Sahaja means{" "}
                  <span className="font-semibold text-purple-600">
                    {"born with you"}
                  </span>{" "}
                  and Yoga means{" "}
                  <span className="font-semibold text-purple-600">
                    {"union with the divine."}
                  </span>
                </p>
                <p className="text-gray-700 text-lg">
                  It is a natural and spontaneous process that gently transforms
                  us from within, enabling us to manifest and express positive
                  human qualities and to enjoy the peace and the bliss of life
                  described in all scriptures.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Animated Sections */}

          {/* Subtle System */}
          <motion.div
            ref={ref1}
            className="mb-24"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={controls1}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                The Subtle System
              </h2>
            </div>

            {/* Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
              {/* Image */}
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/subtle-system.png')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
              </div>

              {/* Text Section with Expand */}
              <div className="md:w-1/2 flex flex-col">
                <div
                  className={`text-gray-700 text-lg transition-all duration-500 pr-2 scroll-smooth ${isExpanded ? "max-h-[800px] overflow-y-auto" : "max-h-[400px] overflow-hidden"}`}
                >
                  {/* Introduction */}
                  <p className="mb-4">
                    The subtle system in Sahaja Yoga refers to the invisible
                    network of energy centers (chakras), channels (nadis), and
                    flows (Kundalini) that govern physical, mental, and
                    spiritual well-being. The chart integrates key concepts from
                    Sahaja Yoga teachings.
                  </p>

                  {/* 1. Nadis */}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    1. Nadis (Energy Channels)
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Sushumna Nadi:</strong> Central channel along the
                      spine, pathway for Kundalini energy, symbolizing the
                      present moment and higher consciousness.
                    </li>
                    <li>
                      <strong>Ida Nadi:</strong> Left channel (moon-energy),
                      linked to the past and subconscious mind; governs
                      emotional and intuitive faculties (Mother’s side).
                    </li>
                    <li>
                      <strong>Pingala Nadi:</strong> Right channel (sun-energy),
                      associated with the future and superconscious mind;
                      regulates mental and physical activity (Father’s side).
                    </li>
                  </ul>
                  <p className="mt-2">
                    Balancing Ida and Pingala through meditation harmonizes
                    energies, allowing Kundalini to rise through Sushumna.
                  </p>

                  {/* 2. Chakras */}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    2. Chakras (Energy Centers)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table-auto border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="border border-gray-300 px-2 py-1">
                            No
                          </th>
                          <th className="border border-gray-300 px-2 py-1">
                            Name
                          </th>
                          <th className="border border-gray-300 px-2 py-1">
                            Location
                          </th>
                          <th className="border border-gray-300 px-2 py-1">
                            Function
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">1</td>
                          <td className="border px-2 py-1">Mooladhara</td>
                          <td className="border px-2 py-1">Base of spine</td>
                          <td className="border px-2 py-1">
                            Survival instincts, connection to Earth
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">2</td>
                          <td className="border px-2 py-1">Swadisthan</td>
                          <td className="border px-2 py-1">Lower abdomen</td>
                          <td className="border px-2 py-1">
                            Creativity, emotions, relationships
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">3</td>
                          <td className="border px-2 py-1">Nabhi</td>
                          <td className="border px-2 py-1">Navel</td>
                          <td className="border px-2 py-1">
                            Willpower, self-esteem
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">4</td>
                          <td className="border px-2 py-1">Anahata</td>
                          <td className="border px-2 py-1">Heart</td>
                          <td className="border px-2 py-1">
                            Love, compassion, balance
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">5</td>
                          <td className="border px-2 py-1">Vishuddhi</td>
                          <td className="border px-2 py-1">Throat</td>
                          <td className="border px-2 py-1">
                            Communication, truthfulness
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">6</td>
                          <td className="border px-2 py-1">Agnya</td>
                          <td className="border px-2 py-1">Between brows</td>
                          <td className="border px-2 py-1">
                            Intuition, wisdom
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">7</td>
                          <td className="border px-2 py-1">Sahasrara</td>
                          <td className="border px-2 py-1">Crown</td>
                          <td className="border px-2 py-1">
                            Spiritual awakening, unity with Divine
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2">
                    <strong>Additional Labels:</strong> 3b (Void) — transitional
                    state; 5b (Hamsa) — symbolic of the Divine Self.
                  </p>

                  {/* 3. Collective Realms */}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    3. Collective Realms
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Collective Subconscious:</strong> Inherited
                      ancestral patterns (left side).
                    </li>
                    <li>
                      <strong>Collective Supraconscious:</strong> Connection to
                      universal consciousness and potentialities (right side).
                    </li>
                  </ul>

                  {/* 4. Hands, Feet, Head */}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    4. Hands, Feet, and Head
                  </h3>
                  <p>
                    Hands: Chakras map to fingertips (e.g., thumb = root chakra)
                    for healing practices.
                  </p>
                  <p>
                    Feet: Heels (1) and soles (7) link to grounding and cosmic
                    connection.
                  </p>
                  <p>
                    Head: Numbers 1–7 correspond to chakras from base of skull
                    to crown.
                  </p>

                  {/* 5. Practical Significance */}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    5. Practical Significance
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Kundalini Awakening:</strong> Clears blockages and
                      fosters spiritual growth.
                    </li>
                    <li>
                      <strong>Balance:</strong> Harmonizing Ida and Pingala
                      creates peace and clarity.
                    </li>
                    <li>
                      <strong>Self-Realization:</strong> Full activation of
                      Sahasrara unites you with the Divine.
                    </li>
                  </ul>
                </div>

                {/* View More / Less Button */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="self-start px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Three Nadis */}
          <motion.div
            ref={ref2}
            className="mb-24"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={controls2}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                The Three Nadis
              </h2>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row-reverse gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/All-Nadis.png')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
                {/* View More Link */}
                <div className="mt-6 p-2 border-t text-center bg-white rounded-3xl border-gray-200">
                  <a
                    href="https://sahajayogakar.org/three-nadis/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors group"
                  >
                    <span>Learn more about the Nadis</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="md:w-1/2">
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? "max-h-[2000px]" : "max-h-[400px]"
                  } md:max-h-none`}
                >
                  <p className="text-gray-700 text-lg mb-4">
                    The subtle system is composed of three main energy channels:
                  </p>

                  <ul className="text-gray-700 text-lg space-y-6">
                    {/* Ida Nadi */}
                    <li className="flex items-start">
                      <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-1">
                        1
                      </div>
                      <div>
                        <span className="font-semibold text-purple-600">
                          Ida Nadi
                        </span>
                        <p className="mt-1">
                          Associated with emotions, desires, and the past. It
                          begins at the Mooladhara chakra (base of the spine)
                          and travels along the left side of the spinal cord,
                          ending in the superego area of the {"brain's"} right
                          hemisphere.
                        </p>
                        <p className="mt-2">
                          Qualities: Joy, peace, and emotional depth when
                          balanced.
                        </p>
                        <p className="mt-1 italic text-purple-700">
                          Imbalance effects: Lethargy, depression, or emotional
                          heaviness
                        </p>
                      </div>
                    </li>

                    {/* Pingala Nadi */}
                    <li className="flex items-start">
                      <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-1">
                        2
                      </div>
                      <div>
                        <span className="font-semibold text-orange-600">
                          Pingala Nadi
                        </span>
                        <p className="mt-1">
                          Related to action, planning, and the future. It starts
                          at the Mooladhara and runs along the right side of the
                          spinal cord, ending in the ego area of the {`brain's`}{" "}
                          left hemisphere.
                        </p>
                        <p className="mt-2">
                          Governs mental activity and physical energy.
                        </p>
                        <p className="mt-1 italic text-orange-700">
                          Overactivity effects: Stress, irritability, and
                          overheating
                        </p>
                      </div>
                    </li>

                    {/* Sushumna Nadi */}
                    <li className="flex items-start">
                      <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-1">
                        3
                      </div>
                      <div>
                        <span className="font-semibold text-green-600">
                          Sushumna Nadi
                        </span>
                        <p className="mt-1">
                          The spiritual channel running through the center of
                          the spine.
                        </p>
                        <p className="mt-2">
                          When the Kundalini rises through Sushumna:
                        </p>
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li>Nourishes all chakras</li>
                          <li>Leads to Self-Realization</li>
                        </ul>
                        <p className="mt-2">
                          Maintains balance between Ida and Pingala.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Expand Button - Mobile Only */}
                <div className="mt-4 text-center md:hidden">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="self-start px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kundalini */}
          <motion.div
            ref={ref3}
            className="mb-24"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={controls3}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Kundalini Awakening
              </h2>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/kundalini-awakening.gif')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
                {/* View More Link */}
                <div className="mt-6 p-3 text-center bg-white rounded-3xl border-gray-200">
                  <a
                    href="https://sahajayogakar.org/Kundalini/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors group"
                  >
                    <span>Learn more about the Kundalni</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="md:w-1/2">
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? "max-h-[2000px]" : "max-h-[400px]"
                  } md:max-h-none`}
                >
                  <p className="text-gray-700 text-lg mb-4">
                    Kundalini is the power of pure desire within us - a motherly
                    and soothing spiritual energy that lies dormant at the base
                    of the spine in the sacrum bone. Ancient civilizations
                    recognized this sacred energy residing in the bone.
                  </p>

                  <h3 className="font-semibold text-purple-600 text-lg mt-6 mb-2">
                    Self-Realization Process
                  </h3>
                  <p className="text-gray-700 text-lg mb-4">
                    Self-Realization is the awakening of the Kundalini through
                    the central channel (Sushumna Nadi). This spiritual energy:
                  </p>
                  <ul className="text-gray-700 text-lg mb-4 space-y-2 list-disc ml-6">
                    <li>
                      Pierces through the six chakras above the sacrum bone
                    </li>
                    <li>
                      Emerges at the crown of the head (fontanel bone area)
                    </li>
                    <li>Manifests as a gentle {`"fountain"`} of coolness</li>
                  </ul>

                  <h3 className="font-semibold text-purple-600 text-lg mt-6 mb-2">
                    The Twice-Born
                  </h3>
                  <p className="text-gray-700 text-lg">
                    This awakening is known as Self-Realization - the birth of
                    the spirit within. Those who receive this experience are
                    known as{" "}
                    <span className="font-semibold">realized souls</span> or
                    <span className="font-semibold text-purple-600">
                      {" "}
                      dweejaha
                    </span>{" "}
                    in Sanskrit, meaning
                    <span className="italic"> {"twice born."}</span>
                  </p>
                </div>
                {/* Expand Button - Mobile Only */}
                <div className="mt-4 text-center md:hidden">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="self-start px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Self Realization */}

          <motion.div
            ref={ref4}
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={controls4}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Self Realization
              </h2>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row-reverse gap-8">
              {/* Video */}
              <div className="md:w-1/2">
                <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/00U6U1MMxDg"
                    title="Self Realization - Shri Mataji"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* View More Link */}
                <div className="mt-6 p-2 border-t text-center bg-white rounded-3xl border-gray-200">
                  <a
                    href="https://sahajayogakar.org/self-realization"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors group"
                  >
                    <span>Learn more about the self realisation</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Text */}
              <div className="md:w-1/2 text-gray-700 text-lg space-y-4">
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? "max-h-[2000px]" : "max-h-[400px]"
                  } md:max-h-none`}
                >
                  <p>
                    I bow to all the seekers of truth. As I told you yesterday
                    that truth is truth, and cannot be changed, or cannot be
                    molded and cannot be organized. And if we are the seekers of
                    truth, we have to keep our minds open about it. Absolute
                    truth you can only find after Self Realisation. Because the
                    self itself, your Spirit itself is the embodiment of truth.
                    <br />
                    <span className="italic">
                      – H.H. Shri Mataji Nirmala Devi, 08 July 1988, Paris,
                      France
                    </span>
                  </p>

                  <p>
                    “It is everyone’s right to achieve this state of one’s
                    evolution and everything necessary is already inbuilt. But
                    as I respect your freedom, you have to have the desire to
                    achieve this state, it cannot be forced upon you.”
                    <br />
                    <span className="italic">
                      – H.H. Shri Mataji Nirmala Devi
                    </span>
                  </p>

                  <p>
                    You can receive your Self Realisation (connection with your
                    Self) while sitting in front of your computer. The only
                    condition is your sincere desire to have it. During the
                    experience you will keep your left hand with the palm
                    upwards on your lap and place the right palm on various
                    parts of the body on your left side, while keeping your eyes
                    closed for the entire duration. This way you will be free of
                    distractions and able to keep your attention inside. Taking
                    off your shoes might also help since the Mother Earth sucks
                    all negativity through our feet.
                  </p>

                  <p>
                    “I invite you to this feast of Divine Bliss, which is
                    pouring around you, even in this Kaliyuga, in these
                    God-forsaken modern times. I hope you will come and enjoy
                    the spiritual experience of the Life Eternal.”
                    <br />
                    <span className="italic">
                      – H.H. Shri Mataji Nirmala Devi – Part of the letter
                      written in 1972 during Her trip to America
                    </span>
                  </p>
                </div>
                {/* Expand Button - Mobile Only */}
                <div className="mt-4 text-center md:hidden">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="self-start px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </MyBackground>
  );
}
