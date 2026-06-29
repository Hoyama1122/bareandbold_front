import React from "react";
import Image from "next/image";

export default function PromoBanners() {
  return (
    <section className="max-w-[1440px] font-anuphan  mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Banner A */}
      <div className="bg-earth-beige border border-earth-border p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition duration-300">
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-earth-olive uppercase tracking-widest block">หมวกปีกกว้าง</span>
          <h4 className="text-base font-bold text-earth-dark leading-tight">ข้อเสนอพิเศษ <br /> รับซัมเมอร์</h4>
          <button className="py-1.5 px-3 bg-earth-walnut hover:opacity-90 text-earth-cream text-[12px] font-bold uppercase rounded transition">ช้อปเลย</button>
        </div>
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group-hover:scale-110 group-hover:rotate-6 transition duration-500 shadow-md">
          <Image src="https://images.unsplash.com/photo-1521369909029-2afed882ba28?q=80&w=600&auto=format&fit=crop" alt="Sun Hat" fill className="object-cover" />
        </div>
      </div>

      {/* Banner B */}
      <div className="bg-earth-beige border border-earth-border p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition duration-300">
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-earth-olive uppercase tracking-widest block">กระเป๋าสตรี</span>
          <h4 className="text-base font-bold text-earth-dark leading-tight">โปรโมชั่น <br /> ซื้อ 1 แถม 1</h4>
          <button className="py-1.5 px-3 bg-earth-walnut hover:opacity-90 text-earth-cream text-[12px] font-bold uppercase rounded transition">ช้อปเลย</button>
        </div>
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition duration-500 shadow-md">
          <Image src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" alt="Ladies Bag" fill className="object-cover" />
        </div>
      </div>

      {/* Banner C */}
      <div className="bg-earth-beige border border-earth-border p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition duration-300">
        <div className="space-y-3">
          <span className="text-[12px] font-bold text-earth-olive uppercase tracking-widest block">สมาร์ทวอทช์</span>
          <h4 className="text-base font-bold text-earth-dark leading-tight">ลดพิเศษ 20% <br /> สมาร์ทวอทช์</h4>
          <button className="py-1.5 px-3 bg-earth-walnut hover:opacity-90 text-earth-cream text-[12px] font-bold uppercase rounded transition">ช้อปเลย</button>
        </div>
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group-hover:scale-110 group-hover:rotate-6 transition duration-500 shadow-md">
          <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" alt="Smart Watch" fill className="object-cover" />
        </div>
      </div>

    </section>
  );
}
