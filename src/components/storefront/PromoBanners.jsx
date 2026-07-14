import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PromoBanners() {
  return (
    <section className="max-w-[1440px] font-anuphan  mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Banner A */}
      <Link 
        href="/products?category=bracelet" 
        className="bg-earth-beige border border-earth-border p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition duration-300 block decoration-none"
      >
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-earth-olive uppercase tracking-widest block">หินธรรมชาติ (Stone)</span>
          <h4 className="text-base font-bold text-earth-dark leading-tight">กำไลหินมงคล <br /> เสริมพลังชีวิต</h4>
          <button className="py-1.5 px-3 bg-earth-walnut hover:opacity-90 text-earth-cream text-[12px] font-bold uppercase rounded transition cursor-pointer">ช้อปเลย</button>
        </div>
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group-hover:scale-110 group-hover:rotate-6 transition duration-500 shadow-md">
          <Image src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop" alt="Stone Bracelet" fill className="object-cover" />
        </div>
      </Link>

      {/* Banner B */}
      <Link 
        href="/products?category=anklet" 
        className="bg-earth-beige border border-earth-border p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition duration-300 block decoration-none"
      >
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-earth-olive uppercase tracking-widest block">แฮนด์เมด (Handmade)</span>
          <h4 className="text-base font-bold text-earth-dark leading-tight">สร้อยข้อเท้าถัก <br /> มินิมอลสไตล์</h4>
          <button className="py-1.5 px-3 bg-earth-walnut hover:opacity-90 text-earth-cream text-[12px] font-bold uppercase rounded transition cursor-pointer">ช้อปเลย</button>
        </div>
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition duration-500 shadow-md">
          <Image src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop" alt="Handmade Anklet" fill className="object-cover" />
        </div>
      </Link>

      {/* Banner C */}
      <Link 
        href="/products" 
        className="bg-earth-beige border border-earth-border p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition duration-300 block decoration-none"
      >
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-earth-olive uppercase tracking-widest block">ของขวัญ (Gift Set)</span>
          <h4 className="text-base font-bold text-earth-dark leading-tight">เซ็ตคู่รักสุดชิค <br /> ลดพิเศษ 15%</h4>
          <button className="py-1.5 px-3 bg-earth-walnut hover:opacity-90 text-earth-cream text-[12px] font-bold uppercase rounded transition cursor-pointer">ช้อปเลย</button>
        </div>
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group-hover:scale-110 group-hover:rotate-6 transition duration-500 shadow-md">
          <Image src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop" alt="Couple Gift Set" fill className="object-cover" />
        </div>
      </Link>

    </section>
  );
}
