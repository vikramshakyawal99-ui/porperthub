"use client";

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

        <img
          src={images[selectedIndex]}
          alt="Property"
          onClick={() => setFullscreen(true)}
          className="h-[500px] w-full cursor-zoom-in rounded-2xl object-cover shadow-xl transition hover:opacity-95"
        />

        <div className="mt-5 grid grid-cols-5 gap-4">

          {images.map((image, index) => (

            <img
              key={index}
              src={image}
              alt={`Property ${index + 1}`}
              onClick={() => setSelectedIndex(index)}
              className={`h-24 w-full cursor-pointer rounded-xl object-cover transition hover:scale-105 ${
                selectedIndex === index
                  ? "ring-4 ring-blue-600"
                  : ""
              }`}
            />

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

          <img
            src={images[selectedIndex]}
            alt="Fullscreen"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl"
          />

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