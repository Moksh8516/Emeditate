"use client";

import Footer from "@/components/Footer";
import MyBackground from "@/components/MyBackground";
import Navbar from "@/components/Navbar";
import { API_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  scheduledStartTime: string;
  channelTitle: string;
  status?: "live" | "upcoming" | "completed";
  channelId: string;
  duration: string;
  tags: string[];
  viewers: number;
}

// Fallback static videos (you can customize these)
const FALLBACK_VIDEOS: Video[] = [
  {
    id: "jmPcXCzNUmw",
    title: "Guided Meditation for Inner Peace",
    description:
      "A calming meditation session to help you connect with your inner self.",
    thumbnailUrl: "https://i.ytimg.com/vi/jmPcXCzNUmw/hqdefault.jpg",
    scheduledStartTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago → treated as "live"
    channelTitle: "Sahaja Yoga Karnataka",
    channelId: "UCxyz123",
    status: "live",
    duration: "45:22",
    tags: ["meditation", "peace"],
    viewers: 5000,
  },
  {
    id: "fJ4hWW36ij8", // replace with your real upcoming video
    title: "The Supreme Source Of Love",
    description:
      "A documentary about the dedicative life of Shri Mataji Nirmala Devi – The Founder of Sahaja Yoga Meditati",
    thumbnailUrl: "https://i.ytimg.com/vi/fJ4hWW36ij8/hqdefault.jpg",
    scheduledStartTime: new Date(Date.now() + 24 * 3600000).toISOString(), // tomorrow
    channelTitle: "Sahaja Yoga Karnataka",
    channelId: "UCxyz123",
    duration: "00:00",
    tags: ["upcoming"],
    viewers: 0,
  },
  {
    id: "1j1O0lGRIPM", // another fallback
    title: "Sahaja Yoga bhajans and meditation session",
    description: "Learn the basics of Sahaja Yoga and self-realization.",
    thumbnailUrl: "https://i.ytimg.com/vi/1j1O0lGRIPM/hqdefault.jpg",
    scheduledStartTime: new Date(Date.now() + 3 * 24 * 3600000).toISOString(), // in 3 days
    channelTitle: "Sahaja Yoga Karnataka",
    channelId: "UCxyz123",
    duration: "32:10",
    tags: ["intro", "yoga"],
    viewers: 12000,
  },
];

function Broadcast() {
  const [streams, setStreams] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch(`${API_URL}/youtube/live`);
        if (!res.ok) throw new Error("Failed to fetch streams");

        const rawData = await res.json();

        // ✅ Extract the actual array from rawData.data
        let data: Video[] = [];

        if (rawData?.success && Array.isArray(rawData.data)) {
          data = rawData.data;
        } else if (Array.isArray(rawData)) {
          // Fallback in case API ever changes to return array directly
          data = rawData;
        } else {
          throw new Error("Invalid API response format");
        }

        // Use fallback only if no streams
        if (data.length === 0) {
          console.log(true);
          setStreams(FALLBACK_VIDEOS);
          setCurrentVideo(FALLBACK_VIDEOS[0]);
        } else {
          // ✅ Map API fields to your expected Video interface
          const normalizedStreams: Video[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: "", // API doesn't provide description → use empty or default
            thumbnailUrl: item.thumbnailUrl.trim(), // fix extra spaces
            scheduledStartTime: item.scheduledStartTime, // use this as the reference time
            channelTitle: item.channelTitle,
            status: item.status,
            channelId: item.channelId,
            duration: "00:00", // not provided → you can omit or estimate
            tags: [],
            viewers: item.viewers || 0,
          }));

          setStreams(normalizedStreams);
          setCurrentVideo(normalizedStreams[0]);
        }
      } catch (err) {
        console.error("Error fetching streams, using fallback:", err);
        setStreams(FALLBACK_VIDEOS);
        setCurrentVideo(FALLBACK_VIDEOS[0]);
        setError("Live stream data unavailable. Showing recent sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  // Function to handle video selection
  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    // Scroll to top of page smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Split into live and upcoming
  const now = new Date();
  const liveStreams = streams.filter((stream) => stream.status === "live");
  const upcomingStreams = streams.filter(
    (stream) => stream.status === "upcoming"
  );

  const isLive = liveStreams.length > 0;
  const youtubeVideoId = currentVideo?.id || FALLBACK_VIDEOS[0].id;

  // All other streams (excluding the current selected one)
  const otherStreams = streams.filter(
    (stream) => stream.id !== currentVideo?.id
  );

  if (loading) {
    return (
      <MyBackground>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading broadcast...
        </div>
        <Footer />
      </MyBackground>
    );
  }

  return (
    <MyBackground>
      <Navbar />
      <div className="min-h-screen text-white py-6 px-4 sm:px-6 lg:px-8">
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
          {error && (
            <p className="text-sm text-orange-400 mt-2 max-w-lg mx-auto">
              {error}
            </p>
          )}
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Video Player and Streams List */}
          <section className="lg:col-span-2">
            {/* Main Video Player */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/10 mb-6">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  key={youtubeVideoId} // Key forces re-render when video changes
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0`}
                  title={currentVideo?.title || "Live Broadcast"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">
                      {currentVideo?.title || "Welcome to Our Live Stream!"}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {currentVideo?.description ||
                        "Watch a recent session while you wait for the next live broadcast."}
                    </p>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaYoutube size={14} />
                    {currentVideo?.channelTitle || "Sahaja Yoga Karnataka"}
                  </span>
                  {isLive &&
                    currentVideo &&
                    new Date(currentVideo.scheduledStartTime) <= now && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {currentVideo?.viewers > 100
                          ? currentVideo?.viewers?.toLocaleString()
                          : "1000"}{" "}
                        watching
                      </span>
                    )}
                  {currentVideo &&
                    new Date(currentVideo.scheduledStartTime) > now && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Scheduled for{" "}
                        {new Date(
                          currentVideo.scheduledStartTime
                        ).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* Other Streams (Scrollable List) */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4">
                {isLive ? "More Streams" : "Upcoming & Recent Streams"}
              </h2>

              {otherStreams.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max">
                    {otherStreams.map((stream) => {
                      const isStreamLive =
                        new Date(stream.scheduledStartTime) <= now;
                      const isUpcoming =
                        new Date(stream.scheduledStartTime) > now;

                      return (
                        <div
                          key={stream.id}
                          className="w-64 flex-shrink-0 bg-black/30 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                          onClick={() => handleVideoSelect(stream)}
                        >
                          <div className="relative">
                            <img
                              src={stream.thumbnailUrl.trim()}
                              alt={stream.title}
                              className="w-full h-36 object-cover group-hover:brightness-110 transition"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2">
                              {isStreamLive ? (
                                <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                  LIVE
                                </div>
                              ) : isUpcoming ? (
                                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">
                                  UPCOMING
                                </div>
                              ) : (
                                <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded font-bold">
                                  RECENT
                                </div>
                              )}
                            </div>
                            {stream.duration && stream.duration !== "00:00" && (
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {stream.duration}
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-purple-300 transition">
                              {stream.title}
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">
                              {stream.channelTitle}
                            </p>
                            <div className="flex justify-between items-center text-xs text-gray-300">
                              <span>
                                {isUpcoming &&
                                  new Date(
                                    stream.scheduledStartTime
                                  ).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </span>
                              <button
                                className="text-purple-400 hover:text-purple-300 font-medium transition"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent double trigger
                                  handleVideoSelect(stream);
                                }}
                              >
                                Select to Watch →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No other streams available at the moment.
                </p>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Upcoming Streams List */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Upcoming Schedule</h3>
              {upcomingStreams.length > 0 ? (
                <div className="space-y-4">
                  {upcomingStreams.map((stream) => (
                    <div
                      key={stream.id}
                      className="bg-black/30 p-3 rounded-lg border border-white/5 hover:border-purple-500/30 transition cursor-pointer"
                      onClick={() => handleVideoSelect(stream)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={stream.thumbnailUrl.trim()}
                          alt={stream.title}
                          className="w-16 h-16 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1 hover:text-purple-300 transition">
                            {stream.title}
                          </h4>
                          <div className="text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <span className="text-blue-400 font-bold">●</span>
                              {new Date(
                                stream.scheduledStartTime
                              ).toLocaleDateString([], {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-300 mt-1">
                              {new Date(
                                stream.scheduledStartTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No upcoming live streams scheduled.
                </p>
              )}
            </div>

            {/* Current Video Info
            {currentVideo && (
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
                <h3 className="text-lg font-bold mb-3">Now Playing</h3>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={currentVideo.thumbnailUrl.trim()}
                    alt={currentVideo.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {currentVideo.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {currentVideo.channelTitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={
                        new Date(currentVideo.scheduledStartTime) <= now
                          ? "text-red-400 font-semibold"
                          : "text-blue-400"
                      }
                    >
                      {new Date(currentVideo.scheduledStartTime) <= now
                        ? "Live Now"
                        : "Upcoming"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Views:</span>
                    <span>{currentVideo.viewers?.toLocaleString() || "0"}</span>
                  </div>
                </div>
              </div>
            )} */}

            {/* Social & YouTube CTA */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Join the Conversation</h3>
              <p className="text-sm text-gray-300 mb-4">
                Interact with us on YouTube and social media.
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-red-600 hover:bg-red-700 py-2.5 rounded-lg font-medium transition-colors mb-3"
              >
                Watch on YouTube ↗
              </a>
              <a
                href="https://www.youtube.com/@SahajaYogaKarnatakaOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg font-medium transition-colors"
              >
                Subscribe to Channel
              </a>
            </div>

            {/* Follow Us */}
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-center">Follow Us</h3>
              <div className="flex gap-3 justify-center flex-wrap">
                <a
                  href="https://www.facebook.com/profile.php?id=61571190040367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-blue-600 transition-colors"
                >
                  <FaFacebookF size={20} />
                </a>
                <a
                  href="https://x.com/SSocials153546"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-black transition-colors"
                >
                  <FaXTwitter size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/sahaja-yoga-karnataka-64a340348"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-blue-700 transition-colors"
                >
                  <FaLinkedinIn size={20} />
                </a>
                <a
                  href="https://www.instagram.com/sahajayogakarnatakaofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-pink-600 transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.youtube.com/@SahajaYogaKarnatakaOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-red-600 transition-colors"
                >
                  <FaYoutube size={20} />
                </a>
                <a
                  href="https://in.pinterest.com/SahajaYogaKar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg hover:bg-red-500 transition-colors"
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
