"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/storefront/Header";
import Hero from "@/components/storefront/Hero";
import PromoBanners from "@/components/storefront/PromoBanners";
import TrustBadges from "@/components/storefront/TrustBadges";
import ProductCard from "@/components/storefront/ProductCard";
import Footer from "@/components/storefront/Footer";
import { productService } from "@/services/product.service";

// Mock products catalog in Destry style
const PRODUCTS = [
  {
    id: 1,
    brand: "Studio Design",
    name: "เสื้อฮู้ดสีเทา",
    rating: 5,
    price: "$35.00",
    oldPrice: "$49.00",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    badge: null,
  },
  {
    id: 2,
    brand: "Studio Design",
    name: "ผ้าพันคอทอลายเรียบหรู",
    rating: 4,
    price: "$45.00",
    oldPrice: "$60.00",
    imageUrl:
      "https://images.unsplash.com/photo-1605050604139-38e91aa795bb?q=80&w=600&auto=format&fit=crop",
    badge: "มาใหม่",
  },
  {
    id: 3,
    brand: "Leather Design",
    name: "รองเท้าสนีกเกอร์หนังสุดเท่",
    rating: 5,
    price: "$85.00",
    oldPrice: null,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    badge: null,
  },
  {
    id: 4,
    brand: "Design Source",
    name: "กระเป๋าสะพายแฮนด์เมด",
    rating: 5,
    price: "$95.00",
    oldPrice: "$120.00",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
    badge: null,
  },
];

export default function Storefront() {
  const [activeTab, setActiveTab] = useState("new"); // new, best, sale
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bare_auth_token");
    if (token) {
      setIsLoggedIn(true);
    }
    fetchProducts();
  }, []);

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

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === "sale") {
      // Products with discount (originalPrice is present)
      return products.filter((p) => p.originalPrice !== null && p.originalPrice !== undefined);
    }
    if (activeTab === "best") {
      // Simulating best sellers (or fallback to showing custom products)
      return products.filter((p) => p.type === "MADE_TO_ORDER");
    }
    // "new" or default list (sorted newest first)
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-sans antialiased">
      {/* 1. Header (Utility & Navigation) */}
      <Header isLoggedIn={isLoggedIn} />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Promo Banners Grid */}
      <PromoBanners />

      {/* 4. Trust Guarantee Badges */}
      <TrustBadges />

      {/* 5. Filter Category Tabs */}
      <section className="font-anuphan max-w-[1440px] mx-auto px-6 pt-16 pb-8 flex justify-center gap-8 border-b border-[#F5F0E6]">
        <button
          onClick={() => setActiveTab("new")}
          className={`pb-2 text-base font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "new"
              ? "text-[#556B2F] border-b-2 border-[#556B2F]"
              : "text-[#777777] hover:text-[#3C322A]"
          }`}
        >
          มาใหม่
        </button>
        <button
          onClick={() => setActiveTab("best")}
          className={`pb-2 text-base font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "best"
              ? "text-[#556B2F] border-b-2 border-[#556B2F]"
              : "text-[#777777] hover:text-[#3C322A]"
          }`}
        >
          สั่งทำพิเศษ
        </button>
        <button
          onClick={() => setActiveTab("sale")}
          className={`pb-2 text-base font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "sale"
              ? "text-[#556B2F] border-b-2 border-[#556B2F]"
              : "text-[#777777] hover:text-[#3C322A]"
          }`}
        >
          ลดราคา
        </button>
      </section>

      {/* 6. Products Catalog Grid */}
      <section className="max-w-[1440px] mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20 text-zinc-400 font-medium font-anuphan">
            <span className="inline-block w-8 h-8 border-4 border-[#556B2F]/20 border-t-[#556B2F] rounded-full animate-spin mb-4" />
            <p>กำลังโหลดสินค้าแนะนำสำหรับคุณ...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 font-medium font-anuphan border border-dashed border-[#F5F0E6] rounded-2xl bg-white/50">
            <span className="text-4xl block mb-3">💎</span>
            <p>ยังไม่มีสินค้าในหมวดหมู่นี้ในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
