import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-earth-beige border-t border-earth-border py-12 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-earth-olive text-xs font-semibold">
        <p>© {new Date().getFullYear()} DESTRY Storefront. สงวนลิขสิทธิ์</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-earth-walnut transition">นโยบายความเป็นส่วนตัว</a>
          <a href="#" className="hover:text-earth-walnut transition">ข้อกำหนดการใช้งาน</a>
          <a href="#" className="hover:text-earth-walnut transition">สมัครรับข่าวสาร</a>
        </div>
      </div>
    </footer>
  );
}
