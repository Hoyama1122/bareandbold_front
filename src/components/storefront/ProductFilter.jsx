"use client";

import React from "react";

const categories = [
  {
    value: "all",
    label: "ทั้งหมด",
  },
  {
    value: "bracelet",
    label: "กำไลข้อมือ",
  },
  {
    value: "anklet",
    label: "กำไลข้อเท้า",
  },
];
const productTypes = [
  {
    value: "all",
    label: "ทุกประเภท",
  },
  {
    value: "READY_TO_SHIP",
    label: "พร้อมส่ง",
  },
  {
    value: "MADE_TO_ORDER",
    label: "Made To Order",
  },
];

export default function ProductFilter({
  search,
  setSearch,

  category,
  setCategory,

  type,
  setType,
}) {
  return (
    <div className="bg-white rounded-2xl border border-earth-border p-6 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-lg font-extrabold text-earth-dark">
            ค้นหาสินค้า
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            เลือกหมวดหมู่และประเภทสินค้า
          </p>
        </div>

        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
            setType("all");
          }}
          className="text-xs px-4 py-2 rounded-lg bg-earth-beige hover:bg-earth-border font-bold transition"
        >
          รีเซ็ต
        </button>

      </div>

      {/* Search */}

      <div className="mb-6">

        <label className="block text-xs font-bold uppercase tracking-wider text-earth-olive mb-2">
          ค้นหาสินค้า
        </label>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า..."
          className="w-full rounded-xl border border-earth-border bg-white px-4 py-3 outline-none focus:border-earth-walnut transition"
        />

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Category */}

        <div>

          <label className="block text-xs font-bold uppercase tracking-wider text-earth-olive mb-3">
            หมวดหมู่
          </label>

          <div className="flex flex-wrap gap-3">

            {categories.map((item) => (

              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition

                ${
                  category === item.value
                    ? "bg-earth-walnut text-white"
                    : "bg-earth-beige hover:bg-earth-border text-earth-dark"
                }`}
              >
                {item.label}
              </button>

            ))}

          </div>

        </div>

        {/* Product Type */}

        <div>

          <label className="block text-xs font-bold uppercase tracking-wider text-earth-olive mb-3">
            ประเภทสินค้า
          </label>

          <div className="flex flex-wrap gap-3">

            {productTypes.map((item) => (

              <button
                key={item.value}
                onClick={() => setType(item.value)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition

                ${
                  type === item.value
                    ? "bg-earth-olive text-white"
                    : "bg-earth-beige hover:bg-earth-border text-earth-dark"
                }`}
              >
                {item.label}
              </button>

            ))}

          </div>

        </div>

      </div>
    </div>
  );
}