"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductFilter from "@/components/storefront/ProductFilter";
import ProductGrid from "@/components/storefront/ProductGrid";
import { productService } from "@/services/product.service";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    // Read category and type from URL parameters if present
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCategory = params.get("category");
      const urlType = params.get("type");
      if (urlCategory) setCategory(urlCategory);
      if (urlType) setType(urlType);
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      // Normalize category comparison (e.g. BRACELET vs bracelet)
      const matchCategory =
        category === "all"
          ? true
          : product.category?.toLowerCase() === category.toLowerCase();

      const matchType = type === "all" ? true : product.type === type;

      return matchSearch && matchCategory && matchType;
    });
  }, [products, search, category, type]);

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="bg-earth-beige border-b border-earth-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="uppercase tracking-[5px] text-earth-olive font-bold text-xs">
            Bare & Bold
          </p>

          <h1 className="text-5xl font-black mt-4 text-earth-dark">ร้านค้า</h1>

          <p className="mt-4 text-zinc-600 max-w-2xl leading-7">
            เลือกชมกำไลข้อมือและกำไลข้อเท้าจากคอลเลกชันของเรา ทั้งสินค้า Ready
            to Ship และ Made to Order ที่สามารถออกแบบได้ตามสไตล์ของคุณ
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 text-sm text-zinc-500">
        <Link href="/" className="text-earth-olive font-bold hover:underline">
          หน้าแรก
        </Link>

        <span className="mx-2">/</span>

        <span className="text-earth-dark font-bold">ร้านค้า</span>
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
          {loading ? (
            <div className="text-center py-20 text-zinc-400 font-medium font-anuphan">
              <span className="inline-block w-8 h-8 border-4 border-[#556B2F]/20 border-t-[#556B2F] rounded-full animate-spin mb-4" />
              <p>กำลังโหลดสินค้า...</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </main>
  );
}
