import React from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/images/placeholder.jpg";

export default function ProductImageGallery({
  images,
  currentImage,
  setCurrentImage,
  setIsZoomOpen,
  productName
}) {
  const validImages = Array.isArray(images)
    ? images
        .map((img) => (typeof img === "object" && img !== null ? img.url || img.src : img))
        .filter((img) => typeof img === "string" && img.trim() !== "")
    : [];

  const rawDisplay =
    typeof currentImage === "object" && currentImage !== null
      ? currentImage.url || currentImage.src
      : currentImage;

  const displayImage =
    typeof rawDisplay === "string" && rawDisplay.trim() !== ""
      ? rawDisplay
      : validImages.length > 0
      ? validImages[0]
      : FALLBACK_IMAGE;

  return (
    <div>
      <div
        onClick={() => setIsZoomOpen(true)}
        className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group bg-[#FDFBF7]"
      >
        <Image
          src={displayImage}
          alt={productName || "Product image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority
        />
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-sm gap-2 select-none font-sans">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
            />
          </svg>
          คลิกเพื่อขยายรูปภาพ
        </div>
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-4 mt-5 overflow-x-auto py-1">
          {validImages.map((img, idx) => (
            <button
              key={`gallery-thumb-${idx}-${img}`}
              onClick={() => setCurrentImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                displayImage === img
                  ? "border-[#7a5b46] scale-105"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
