import React from "react";
import Image from "next/image";
import { StarIcon } from "hugeicons-react";

export default function ProductCard({ product }) {
  return (
    <div className="group flex flex-col bg-white border border-earth-beige rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Product preview image container */}
      <div className="relative aspect-square w-full bg-earth-cream flex items-center justify-center overflow-hidden border-b border-earth-beige">
        <Image 
          src={product.imageUrl} 
          alt={product.name}
          fill
          className="object-cover "
        />

        {product.badge && (
          <span className="absolute top-4 left-4 px-2 py-0.5 rounded bg-earth-olive text-earth-cream text-[9px] font-bold uppercase tracking-wider">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product info details */}
      <div className="p-5 flex flex-col flex-1 gap-1 bg-white">
        <span className="text-[10px] font-bold text-earth-olive uppercase tracking-wider">{product.brand}</span>
        <h4 className="text-xs font-bold text-earth-dark hover:text-earth-walnut transition-colors leading-snug">
          {product.name}
        </h4>
        
        {/* Rating stars */}
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon 
              key={i} 
              size={12} 
              strokeWidth={2}
              className={i < product.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"} 
            />
          ))}
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-extrabold text-earth-walnut">{product.price}</span>
          {product.oldPrice && (
            <span className="text-[11px] text-zinc-400 line-through">{product.oldPrice}</span>
          )}
        </div>

        {/* Add to Cart button */}
        <button className="w-full mt-4 py-2 border border-earth-walnut hover:bg-earth-walnut hover:text-earth-cream text-earth-walnut text-[10px] font-bold uppercase tracking-wider rounded-lg transition duration-300 cursor-pointer">
          เพิ่มลงตะกร้า
        </button>
      </div>

    </div>
  );
}
