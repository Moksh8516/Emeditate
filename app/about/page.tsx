'use client';
// pages/introduction.tsx
import { useEffect, useRef } from 'react';
import MyBackground from '@/components/MyBackground';
import { motion, useAnimation, useInView } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function IntroductionPage() {
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
  }, [inView1, inView2, inView3, inView4, controls1, controls2, controls3, controls4]);

  return (
    <MyBackground>
      <Navbar />
      <div className="min-h-screen py-5">
        {/* Hero Section */}
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-indigo-900/50 z-10"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="relative z-20 text-center px-4 max-w-4xl">
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
                  The time has come for all of you to get your self-realisation, by which your attention becomes enlightened, 
                  your health gets completely all right, your mental processes are sensible, but above all you stand in your present.
                </blockquote>
                <p className="mt-4 text-purple-300 font-medium">
                  – H.H. Shri Mataji Nirmala Devi, 29.09.1994, Los Angeles, USA
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
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
                  <div className="bg-[url('/lotus.svg')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">What is Sahaja Yoga?</h2>
                <p className="text-gray-700 text-lg mb-4">
                  Sahaja Yoga is a meditation technique developed by Shri Mataji Nirmala Devi in 1970. 
                  Sahaja means <span className="font-semibold text-purple-600">{"born with you"}</span> and 
                  Yoga means <span className="font-semibold text-purple-600">{"union with the divine."}</span>
                </p>
                <p className="text-gray-700 text-lg">
                  It is a natural and spontaneous process that gently transforms us from within, 
                  enabling us to manifest and express positive human qualities and to enjoy the peace and 
                  the bliss of life described in all scriptures.
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
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate={controls1}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">The Subtle System</h2>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/subtle-system.svg')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <p className="text-gray-700 text-lg mb-4">
                  The subtle system is the foundation of Sahaja Yoga, consisting of energy centers (chakras) 
                  and channels (nadis) that govern our physical, mental, and spiritual well-being.
                </p>
                <p className="text-gray-700 text-lg">
                  Through meditation, we can cleanse and balance this subtle system, allowing the Kundalini 
                  energy to rise and bring about our self-realization.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Three Nadis */}
          <motion.div 
            ref={ref2}
            className="mb-24"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate={controls2}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">The Three Nadis</h2>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row-reverse gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/nadis.svg')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <p className="text-gray-700 text-lg mb-4">
                  The subtle system is composed of three main energy channels:
                </p>
                <ul className="text-gray-700 text-lg space-y-3">
                  <li className="flex items-start">
                    <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-1">1</div>
                    <span className="font-semibold text-purple-600">Ida Nadi</span> - The left channel representing the moon energy, cooling and nurturing
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-1">2</div>
                    <span className="font-semibold text-orange-600">Pingala Nadi</span> - The right channel representing the sun energy, heating and active
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-1">3</div>
                    <span className="font-semibold text-green-600">Sushumna Nadi</span> - The central channel through which the Kundalini rises
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          {/* Kundalini */}
          <motion.div 
            ref={ref3}
            className="mb-24"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate={controls3}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">Kundalini Awakening</h2>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/kundalini.svg')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <p className="text-gray-700 text-lg mb-4">
                  The Kundalini is a divine, dormant energy residing at the base of the spine. 
                  When awakened through Sahaja Yoga meditation, it rises through the central channel, 
                  piercing through the chakras and connecting us with the universal divine energy.
                </p>
                <p className="text-gray-700 text-lg">
                  This awakening is known as Self-Realization - the birth of the spirit within us. 
                  Those who have received Realization are known as {"realized souls"} or 
                  <span className="font-semibold text-purple-600"> dweejaha</span> in Sanskrit, 
                  meaning {"twice born."}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Self Realization */}
          <motion.div 
            ref={ref4}
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate={controls4}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold">Self Realization</h2>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl p-8 flex flex-col md:flex-row-reverse gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <div className="bg-[url('/self-realization.svg')] bg-center bg-contain bg-no-repeat w-full h-full"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <p className="text-gray-700 text-lg mb-4">
                  Self-Realization is the experience of the union of the individual spirit with the universal 
                  divine energy. It is not an intellectual concept but an actualization of our spiritual potential.
                </p>
                <p className="text-gray-700 text-lg mb-4">
                  Through regular Sahaja Yoga meditation, we can maintain and deepen this state of 
                  Self-Realization, leading to:
                </p>
                <ul className="text-gray-700 text-lg space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Inner peace and balance
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Improved physical and mental health
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Enhanced creativity and focus
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Connection with your true self
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center border-4 border-white/20">
              <div className="w-10 h-10 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Sahaja Yoga Karnataka</h3>
            <p className="max-w-2xl mx-auto text-purple-200">
              A spiritual movement of global proportions with practitioners in over 160 countries, 
              united by their experience of inner joy and peace through Self-Realization.
            </p>
            <div className="mt-8 text-sm text-purple-300">
              © {new Date().getFullYear()} Sahaja Yoga Meditation Center. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </MyBackground>
  );
}