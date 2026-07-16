import React from "react";

export default function ImageZoomModal({
  images,
  currentImage,
  setCurrentImage,
  setIsZoomOpen,
  handlePrevImage,
  handleNextImage,
  productName
}) {
  return (
    <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col items-center justify-center p-4 select-none">
      {/* Close button */}
      <button
        onClick={() => setIsZoomOpen(false)}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Left Navigation Arrow */}
      {images.length > 1 && (
        <button
          onClick={handlePrevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Large Image Viewport */}
      <div className="relative max-w-full max-h-[65vh] aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <img
          src={currentImage}
          alt={productName || "Product Zoomed"}
          className="max-w-full max-h-[65vh] object-contain rounded-xl"
        />
      </div>

      {/* Right Navigation Arrow */}
      {images.length > 1 && (
        <button
          onClick={handleNextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Zoom Modal Thumbnails list */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-8 max-w-full overflow-x-auto py-2 px-4 justify-center">
          {images.map((img) => (
            <button
              key={img}
              onClick={() => setCurrentImage(img)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === img
                  ? "border-white scale-105"
                  : "border-white/20 hover:border-white/50"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
