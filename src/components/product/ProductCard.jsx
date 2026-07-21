import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { wishlistService } from "@/services/wishlist.service";

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(wishlistService.isWishlisted(product.id));
    const handleUpdate = () => {
      setIsLiked(wishlistService.isWishlisted(product.id));
    };
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, [product.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      wishlistService.removeFromWishlist(product.id);
    } else {
      wishlistService.addToWishlist(product);
    }
  };

  // 📸 ดึงรูปภาพแรกจาก Array (images[0].url) 
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : "/images/placeholder.jpg"; 

  // 🏷️ เช็คประเภทสินค้าเพื่อแสดงป้าย Made to Order
  const isMadeToOrder = product.type === "MADE_TO_ORDER";

  // 💰 ฟังก์ชันแปลงราคาส่งกลับเป็นตัวเลขอย่างปลอดภัย รองรับทั้งแบบ String, Number และ null
  const formatPrice = (priceValue) => {
    if (priceValue === null || priceValue === undefined) return 0;
    const parsed = Number(priceValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <Link
      href={`/products/${product.name.replace(/\s+/g, "-")}`}
      className="bg-white border border-[#EFE9DC] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group block"
    >
      
      {/* 🖼️ ส่วนรูปภาพหน้าปกสินค้า */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F5F0E6]/30">
        
        {/* 🟢 ป้ายแท็กสั่งทำพิเศษ (แสดงเฉพาะสินค้าที่เป็น MADE_TO_ORDER) */}
        {isMadeToOrder && (
          <div className="absolute top-4 left-4 bg-[#6A5242] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg z-10 shadow-sm font-anuphan">
            สั่งทำพิเศษ
          </div>
        )}

        {/* Heart Icon Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 w-9 h-9 bg-white/95 backdrop-blur-sm shadow hover:bg-white rounded-full flex items-center justify-center z-10 transition duration-200 cursor-pointer active:scale-95 group/heart"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-[#6A5242] group-hover/heart:text-red-500"
            }`}
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <Image
          src={mainImage}
          alt={product.name || "Product Image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* 📝 ส่วนข้อมูลรายละเอียดสินค้า */}
      <div className="p-5 flex flex-col flex-grow justify-between font-anuphan">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            {product.brand || "BARE & BOLD"}
          </span>
          
          <h3 className="text-base font-extrabold text-[#3C322A] line-clamp-2 min-h-[3rem] leading-snug">
            {product.name}
          </h3>

          {/* 🌟 แสดงดาวรีวิวคงที่ตามโครงสร้างแบรนด์ */}
          <div className="flex text-amber-500 text-xs">
            {"★".repeat(product.rating || 5)}
          </div>
        </div>

        {/* 💰 ราคาสินค้าและปุ่มแอคชัน */}
        <div className="mt-4 pt-3 border-t border-[#F5F0E6] flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            {/* 🛠️ เปลี่ยนมาเรียกใช้ฟังก์ชันแปลงราคาอย่างปลอดภัย */}
            <span className="text-lg font-black text-[#3C322A]">
              {formatPrice(product.price).toLocaleString()} บาท
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>

          <div
            className="w-full text-center py-2.5 bg-white border-2 border-[#6A5242] text-[#6A5242] group-hover:bg-[#6A5242] group-hover:text-white font-bold text-xs rounded-xl transition duration-300 inline-block cursor-pointer shadow-sm"
          >
            ดูรายละเอียดสินค้า
          </div>
        </div>
      </div>
    </Link>
  );
}
