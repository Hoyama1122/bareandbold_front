import React from "react";
import Image from "next/image";
import { StarIcon } from "hugeicons-react";
import Link from "next/link";

export default function ProductCard({ product }) {
  // Extract values with fallbacks to support both mock and backend API models
  const imageUrl = product.imageUrl || (product.images && product.images[0]?.url) || "https://images.unsplash.com/photo-1611085583191-a3b1a20fdb44?q=80&w=600&auto=format&fit=crop";
  const name = product.name;
  const brand = product.brand || "Bare & Bold";
  const rating = product.rating || 5;

  const displayPrice = typeof product.price === "string" 
    ? product.price 
    : `฿${parseFloat(product.price).toLocaleString()}`;

  const displayOldPrice = product.oldPrice 
    ? product.oldPrice 
    : product.originalPrice 
      ? `฿${parseFloat(product.originalPrice).toLocaleString()}` 
      : null;

  // Show "มาใหม่" badge if it's new (or let's say MADE_TO_ORDER has custom badge)
  const badge = product.badge || (product.type === "MADE_TO_ORDER" ? "สั่งทำพิเศษ" : null);

  return (
    <div className="group flex flex-col bg-white border border-earth-beige rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product preview image container */}
      <div className="relative aspect-square w-full bg-earth-cream flex items-center justify-center overflow-hidden border-b border-earth-beige">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />

        {badge && (
          <span className="absolute top-4 left-4 px-2 py-0.5 rounded bg-earth-olive text-earth-cream text-[9px] font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      {/* Product info details */}
      <div className="p-5 flex flex-col flex-1 gap-1 bg-white">
        <span className="text-[12px] font-bold text-earth-olive uppercase tracking-wider">
          {brand}
        </span>
        <h4 className="text-[14px] font-anuphan font-bold text-earth-dark hover:text-earth-walnut transition-colors leading-snug">
          {name}
        </h4>

        {/* Rating stars */}
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              size={14}
              strokeWidth={2}
              className={
                i < rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-zinc-200"
              }
            />
          ))}
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-extrabold text-earth-walnut">
            {displayPrice}
          </span>
          {displayOldPrice && (
            <span className="text-[11px] text-zinc-400 line-through">
              {displayOldPrice}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button className="w-full font-anuphan text-[14px] mt-4 py-2 border border-earth-walnut hover:bg-earth-walnut hover:text-earth-cream text-earth-walnut font-bold uppercase tracking-wider rounded-lg transition duration-300 cursor-pointer">
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
}
