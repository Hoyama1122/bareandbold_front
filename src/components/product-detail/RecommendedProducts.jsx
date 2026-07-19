import React from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";

export default function RecommendedProducts({
  recommendedProducts,
  emblaRef,
  scrollPrev,
  scrollNext
}) {
  return (
    <div className="mt-24 border-t border-earth-beige pt-16 font-anuphan">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-earth-dark">
          สินค้าแนะนำสำหรับคุณ
        </h3>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 rounded-full border border-earth-border flex items-center justify-center hover:bg-earth-beige/40 transition active:scale-95 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-zinc-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="w-10 h-10 rounded-full border border-earth-border flex items-center justify-center hover:bg-earth-beige/40 transition active:scale-95 cursor-pointer"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-zinc-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-7">
          {recommendedProducts.map((prod) => (
            <div
              key={prod.id}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_23%]"
            >
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
