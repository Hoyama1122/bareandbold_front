"use client";

import { useMemo, useState } from "react";

import ProductFilter from "@/components/storefront/ProductFilter";
import ProductGrid from "@/components/storefront/ProductGrid";

import productsData from "@/data/products";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");

  const [type, setType] = useState("all");

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all"
          ? true
          : product.category === category;

      const matchType =
        type === "all"
          ? true
          : product.type === type;

      return (
        matchSearch &&
        matchCategory &&
        matchType
      );
    });
  }, [search, category, type]);

  return (
    <main className="min-h-screen bg-[#FDFBF7]">

      {/* Hero */}

      <section className="bg-earth-beige border-b border-earth-border">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <p className="uppercase tracking-[5px] text-earth-olive font-bold text-xs">
            Bare & Bold
          </p>

          <h1 className="text-5xl font-black mt-4 text-earth-dark">
            ร้านค้า
          </h1>

          <p className="mt-4 text-zinc-600 max-w-2xl leading-7">
            เลือกชมกำไลข้อมือและกำไลข้อเท้าจากคอลเลกชันของเรา
            ทั้งสินค้า Ready to Ship และ Made to Order
            ที่สามารถออกแบบได้ตามสไตล์ของคุณ
          </p>

        </div>

      </section>

      {/* Breadcrumb */}

      <div className="max-w-7xl mx-auto px-6 pt-8 text-sm text-zinc-500">

        หน้าแรก

        <span className="mx-2">/</span>

        <span className="text-earth-dark font-bold">
          ร้านค้า
        </span>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Filter */}

        <ProductFilter
          search={search}
          setSearch={setSearch}

          category={category}
          setCategory={setCategory}

          type={type}
          setType={setType}
        />

        <div className="mt-10">

          <ProductGrid
            products={filteredProducts}
          />

        </div>

      </div>

    </main>
  );
}