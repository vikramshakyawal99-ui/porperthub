"use client";

import { useState } from "react";

type Props = {
  images?: string[];
};

export default function ImageGallery({ images = [] }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  if (images.length === 0) {
    return (
      <div className="mb-10 rounded-2xl bg-gray-100 p-10 text-center text-xl font-semibold">
        No Images Available
      </div>
    );
  }

  return (
    <div className="mb-10">
      {/* Main Image */}
      <img
        src={selectedImage}
        alt="Property"
        className="h-[500px] w-full rounded-2xl object-cover shadow-xl"
      />

      {/* Thumbnails */}
      <div className="mt-5 grid grid-cols-5 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Property ${index + 1}`}
            onClick={() => setSelectedImage(image)}
            className={`h-24 w-full cursor-pointer rounded-xl object-cover transition-all duration-300 hover:scale-105 ${
              selectedImage === image ? "ring-4 ring-blue-600" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}   