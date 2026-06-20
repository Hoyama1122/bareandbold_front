import React from "react";
import { TruckIcon, Clock01Icon, Money01Icon, GiftIcon } from "hugeicons-react";

export default function TrustBadges() {
  return (
    <section className="max-w-[1440px] font-anuphan  mx-auto px-6 py-6 border-t border-b border-earth-beige grid grid-cols-2 md:grid-cols-4 gap-6 items-center text-center md:text-left">
      
      <div className="flex flex-col md:flex-row items-center gap-3">
        <TruckIcon size={32} strokeWidth={1.5} className="text-zinc-700" />
        <div>
          <h5 className="text-[14px] font-extrabold text-earth-dark uppercase tracking-wider">จัดส่งฟรี</h5>
          <p className="text-[12px] text-earth-olive font-bold mt-0.5">จัดส่งฟรีทุกคำสั่งซื้อ</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <Clock01Icon size={32} strokeWidth={1.5} className="text-zinc-700" />
        <div>
          <h5 className="text-[14px]  font-extrabold text-earth-dark uppercase tracking-wider">ซัพพอร์ต 24/7</h5>
          <p className="text-[12px] text-earth-olive font-bold mt-0.5">บริการช่วยเหลือตลอด 24 ชั่วโมง</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <Money01Icon size={32} strokeWidth={1.5} className="text-zinc-700" />
        <div>
          <h5 className="text-[14px]  font-extrabold text-earth-dark uppercase tracking-wider">รับประกันคืนเงิน</h5>
          <p className="text-[12px] text-earth-olive font-bold mt-0.5">คืนเงินเต็มจำนวนภายใน 15 วัน</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <GiftIcon size={32} strokeWidth={1.5} className="text-zinc-700" />
        <div>
          <h5 className="text-[14px]  font-extrabold text-earth-dark uppercase tracking-wider">ส่วนลดพิเศษ</h5>
          <p className="text-[12px] text-earth-olive font-bold mt-0.5">เมื่อสั่งซื้อสินค้าครบ 1,500 บาท</p>
        </div>
      </div>

    </section>
  );
}
