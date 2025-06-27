import { HeroBackgroundLineDesgin } from "@/components/HeroBackgroundLineDesgin";
import Image from "next/image";
import MyBackground from "@/components/MyBackground";
import Button from "@/components/Button";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <MyBackground>
      <Navbar />
      <HeroBackgroundLineDesgin className="bg-transparent z-0">
        <div className="flex flex-col items-center gap-2 justify-center h-full text-slate-50">
          <div className="relative w-32 sm:w-40 md:w-44 lg:w-48 aspect-square z-10 mb-2">
            <Image
              className="rounded-full object-cover"
              src="/heroImage.jpg"
              alt="Hero Image"
              fill
              sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, (max-width: 1024px) 13rem, 13rem"
              priority
            />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 md:mb-4">
            Sahaja Yoga
          </h1>

          <p className="text-lg opacity-90 text-wrap max-w-xl align-middle text-center">
            AI chatbot inspired by Sahaja Yoga, guiding users to clarity, peace,
            and spiritual self-realization.
          </p>

          <div className="flex gap-4 items-center align-middle justify-center my-2">
            <Button className="z-10">Download</Button>
            <Link
              className="flex z-10 gap-2 items-center align-middle bg-transparent text-gray-100 font-semibold py-2 px-4 hover:scale-105 rounded-lg shadow-sm duration-100 md:px-6 md:py-3 md:text-md"
              href={"/newChat"}
            >
              Chat us
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                data-rtl-flip=""
                className="icon-md -top-[50%]"
              >
                <path d="M11.3349 10.3301V5.60547L4.47065 12.4707C4.21095 12.7304 3.78895 12.7304 3.52925 12.4707C3.26955 12.211 3.26955 11.789 3.52925 11.5293L10.3945 4.66504H5.66011C5.29284 4.66504 4.99507 4.36727 4.99507 4C4.99507 3.63273 5.29284 3.33496 5.66011 3.33496H11.9999L12.1337 3.34863C12.4369 3.41057 12.665 3.67857 12.665 4V10.3301C12.6649 10.6973 12.3672 10.9951 11.9999 10.9951C11.6327 10.9951 11.335 10.6973 11.3349 10.3301ZM11.333 4.66699L11.3349 4.66797L11.332 4.66504H11.331L11.333 4.66699Z"></path>
              </svg>
            </Link>
          </div>
        </div>
      </HeroBackgroundLineDesgin>
    </MyBackground>
  );
}
