import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-earth-beige py-16 md:py-24 px-6 overflow-hidden border-b border-earth-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        
        {/* Left Text details */}
        <div className="space-y-6 max-w-lg">
          <h2 className="text-4xl sm:text-5xl md:text-6xl  tracking-wide font-anuphan font-extrabold text-earth-dark leading-tight">
            แฟชั่นผู้หญิง <br /> คอลเลกชันใหม่
          </h2>
          <p className="text-sm text-earth-olive font-bold font-anuphan ">
            ลดสูงสุด 70% เฉพาะสินค้าที่ร่วมรายการ
          </p>
          <button className="py-3 px-6 bg-earth-walnut hover:opacity-90 text-earth-cream text-xs font-bold uppercase tracking-wider rounded-md transition duration-300 shadow-sm shadow-earth-walnut/25">
            ช้อปเลย
          </button>
        </div>

        {/* Right Product illustration layout */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full bg-earth-border z-0" />
          <div className="relative z-10 w-[260px] h-[340px] rounded-2xl overflow-hidden shadow-lg border border-earth-border">
            <Image
              src="/landing/Fashion.jpg"
              alt="Women New Collection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
