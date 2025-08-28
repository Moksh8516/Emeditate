import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa6";
import React from "react";
import Image from "next/image";

function Footer() {
  return (
    <>
      {/* Footer */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12 rounded-t-2xl">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center border-4 border-white/20">
            <div className="w-16 h-16  border-4 border-white rounded-full">
              <Image
                src="/heroImage.jpg"
                alt="Sahaja Yoga Karnataka Logo"
                width={64}
                height={64}
                className="rounded-full items-center align-middle object-cover"
              />
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">SAHAJA YOGA AI</h3>
          <p className="max-w-2xl mx-auto text-purple-200">
            A spiritual movement of global proportions with practitioners in
            over 160 countries, united by their experience of inner joy and
            peace through Self-Realization.
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center gap-4 mt-6">
            <a
              href="https://www.facebook.com/people/Sahaja-Yoga-Karnataka"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://x.com/SSocials153546"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/sahaja-yoga-karnataka-64a340348"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://www.instagram.com/sahajayogakarnatakaofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.youtube.com/@SahajaYogaKarnatakaOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              <FaYoutube size={20} />
            </a>
            <a
              href="https://in.pinterest.com/SahajaYogaKar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              <FaPinterestP size={20} />
            </a>
          </div>

          <div className="mt-8 text-sm text-purple-300">
            © {new Date().getFullYear()} Sahaja Yoga. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
