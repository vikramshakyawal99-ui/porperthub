"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images?: string[];
};

export default function ImageGallery({
  images = [],
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-xl font-semibold text-slate-700 shadow-sm">
        No Images Available
      </div>
    );
  }

  function previousImage() {
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function nextImage() {
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <>
      <div className="mb-8">

        <div className="relative h-[500px] w-full">
          <Image
            src={images[selectedIndex]}
            alt="Property image"
            fill
            priority
            sizes="(max-width:768px) 100vw, 100vw"
            className="cursor-zoom-in rounded-3xl object-cover shadow-2xl transition duration-300 hover:scale-[1.01]"
            onClick={() => setFullscreen(true)}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-5">

          {images.map((image, index) => (

            <div
              key={index}
              className="relative h-24 w-full"
            >
              <Image
                src={image}
                alt={`Property ${index + 1}`}
                fill
                sizes="(max-width:768px) 33vw, 20vw"
                onClick={() => setSelectedIndex(index)}
                className={`cursor-pointer rounded-xl object-cover transition hover:scale-105 ${
                  selectedIndex === index
                    ? "ring-4 ring-blue-500 shadow-lg"
                    : "opacity-80 hover:opacity-100"
                }`}
              />
            </div>

          ))}

        </div>

      </div>


      {fullscreen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95">

          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 font-bold text-slate-900 shadow-lg"
          >
            ✕
          </button>


          <button
            onClick={previousImage}
            className="absolute left-6 rounded-full bg-white p-4 text-2xl text-slate-900 shadow-lg"
          >
            ←
          </button>


          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={images[selectedIndex]}
              alt="Fullscreen property image"
              fill
              className="rounded-2xl object-contain"
            />
          </div>


          <button
            onClick={nextImage}
            className="absolute right-6 rounded-full bg-white p-4 text-2xl text-slate-900 shadow-lg"
          >
            →
          </button>

        </div>

      )}

    </>
  );
}
