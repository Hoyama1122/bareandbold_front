import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
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
    <div className="bg-white border border-[#EFE9DC] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      
      {/* 🖼️ ส่วนรูปภาพหน้าปกสินค้า */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F5F0E6]/30">
        
        {/* 🟢 ป้ายแท็กสั่งทำพิเศษ (แสดงเฉพาะสินค้าที่เป็น MADE_TO_ORDER) */}
        {isMadeToOrder && (
          <div className="absolute top-4 left-4 bg-[#6A5242] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg z-10 shadow-sm font-anuphan">
            สั่งทำพิเศษ
          </div>
        )}

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

          <Link
            href={`/products/${product.name.replace(/\s+/g, "-")}`}
            className="w-full text-center py-2.5 bg-white border-2 border-[#6A5242] text-[#6A5242] hover:bg-[#6A5242] hover:text-white font-bold text-xs rounded-xl transition duration-300 inline-block cursor-pointer shadow-sm"
          >
            ดูรายละเอียดสินค้า
          </Link>
        </div>
      </div>
    </div>
  );
}
