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
      <div className="mb-10 rounded-2xl bg-zinc-950 p-10 text-center text-xl font-semibold">
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
      <div className="mb-10">

        <div className="relative h-[500px] w-full">
          <Image
            src={images[selectedIndex]}
            alt="Property image"
            fill
            priority
            className="cursor-zoom-in rounded-2xl object-cover shadow-xl transition hover:opacity-95"
            onClick={() => setFullscreen(true)}
          />
        </div>

        <div className="mt-5 grid grid-cols-5 gap-4">

          {images.map((image, index) => (

            <div
              key={index}
              className="relative h-24 w-full"
            >
              <Image
                src={image}
                alt={`Property ${index + 1}`}
                fill
                onClick={() => setSelectedIndex(index)}
                className={`cursor-pointer rounded-xl object-cover transition hover:scale-105 ${
                  selectedIndex === index
                    ? "ring-4 ring-blue-600"
                    : ""
                }`}
              />
            </div>

          ))}

        </div>

      </div>


      {fullscreen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">

          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-6 top-6 rounded-full bg-zinc-900 px-4 py-2 font-bold"
          >
            ✕
          </button>


          <button
            onClick={previousImage}
            className="absolute left-6 rounded-full bg-zinc-900 p-4 text-2xl"
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
            className="absolute right-6 rounded-full bg-zinc-900 p-4 text-2xl"
          >
            →
          </button>

        </div>

      )}

    </>
  );
}
