"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-earth-border rounded-2xl py-20 px-6 text-center shadow-sm">
        <div className="w-20 h-20 mx-auto rounded-full bg-earth-beige flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-earth-olive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
            />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold text-earth-dark">
          ไม่พบสินค้า
        </h3>

        <p className="text-zinc-500 mt-2">
          ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Result Count */}

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-earth-dark">
          พบสินค้า {products.length} รายการ
        </h3>
      </div>

      {/* Product Grid */}

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.name.replace(/\s+/g, "-")}`}
            className="group"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </>
  );
}