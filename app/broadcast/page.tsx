"use client";

import Footer from "@/components/Footer";
import MyBackground from "@/components/MyBackground";
import Navbar from "@/components/Navbar";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Broadcast() {
  const isLive = true; // You can toggle this manually or via your own logic
  const youtubeVideoId = "uMSunbqWctQ"; // Replace with your live stream ID

  const upcomingStreams = [
    { date: "Tomorrow", time: "7:00 PM", title: "Special Guest Interview" },
    { date: "Friday", time: "8:00 PM", title: "Q&A Session" },
    { date: "Sunday", time: "6:30 PM", title: "Weekly Recap" },
  ];

  return (
    <MyBackground>
      <Navbar />
      <div className="min-h-screen text-white py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-white bg-clip-text text-transparent">
            Live Broadcast
          </h1>
          <div className="flex justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                isLive
                  ? "bg-red-500/90 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isLive ? "bg-white" : "bg-gray-400"
                }`}
              ></span>
              {isLive ? "LIVE NOW" : "OFFLINE"}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Video Player */}
          <section className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1`}
                  title="Live Broadcast"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold mb-2">
                  Welcome to Our Live Stream!
                </h2>
                <p className="text-gray-300 text-sm">
                  Watch the live broadcast directly from YouTube. Don’t forget
                  to like, share, and subscribe on YouTube!
                </p>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Upcoming Streams */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Upcoming Streams</h3>
              <div className="space-y-3">
                {upcomingStreams.map((stream, i) => (
                  <div
                    key={i}
                    className="border-l-3 border-purple-500 pl-3 py-1.5"
                  >
                    <div className="font-medium text-sm">{stream.title}</div>
                    <div className="text-xs text-gray-300">
                      {stream.date} at {stream.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social & YouTube CTA */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Join the Conversation</h3>
              <p className="text-sm text-gray-300 mb-4">
                Chat live and interact with others on the official YouTube
                stream.
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-red-600 hover:bg-red-700 py-2.5 rounded-lg font-medium transition-colors"
              >
                Watch on YouTube →
              </a>
            </div>

            {/* Follow Us */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-center">Follow Us</h3>
              <div className="flex gap-3 justify-center">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61571190040367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-purple-500 transition-colors"
                >
                  <FaFacebookF size={20} />
                </a>

                {/* X / Twitter */}
                <a
                  href="https://x.com/SSocials153546"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-purple-500 transition-colors"
                >
                  <FaXTwitter size={20} />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/sahaja-yoga-karnataka-64a340348"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-purple-500 transition-colors"
                >
                  <FaLinkedinIn size={20} />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/sahajayogakarnatakaofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-purple-500 transition-colors"
                >
                  <FaInstagram size={20} />
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@SahajaYogaKarnatakaOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-purple-500 transition-colors"
                >
                  <FaYoutube size={20} />
                </a>

                {/* Pinterest */}
                <a
                  href="https://in.pinterest.com/SahajaYogaKar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-purple-500 transition-colors"
                >
                  <FaPinterestP size={20} />
                </a>
              </div>
            </div>
          </aside>
        </main>
      </div>
      <Footer />
    </MyBackground>
  );
}

export default Broadcast;
