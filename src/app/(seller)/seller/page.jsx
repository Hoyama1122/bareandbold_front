import Link from "next/link";

/**
 * หน้าแรกของ Seller Center (placeholder)
 * โครง layout/guard พร้อมแล้ว — ทีมสามารถเพิ่ม dashboard/products/orders/wallet ต่อได้
 */
export default function SellerHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth-olive">
          Seller Center
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-earth-dark">
          พร้อมให้พัฒนาต่อ 🚀
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-500">
          โครง layout นี้แยกจาก Storefront แล้ว ไม่มี Header/Footer ของหน้าร้าน
          และมี guard ตรวจสอบ role/สถานะร้านให้เรียบร้อย
          เหลือเพียงเพิ่มหน้า dashboard, products, orders และ wallet ตาม API ที่พร้อมอยู่
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-earth-dark px-5 py-2.5 text-xs font-bold text-white transition hover:bg-earth-olive"
          >
            กลับ Storefront
          </Link>
          <Link
            href="/become-seller"
            className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-600 transition hover:bg-neutral-50"
          >
            จัดการข้อมูลร้าน
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            title: "Dashboard",
            desc: "KPI สินค้า/ยอดเงิน พร้อม API /api/seller/dashboard",
          },
          {
            title: "Products",
            desc: "CRUD สินค้า + รูป + custom options ผ่าน /api/seller/products",
          },
          {
            title: "Orders & Wallet",
            desc: "รอระบบ Split Order/Escrow ก่อนเปิดใช้งานจริง",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-extrabold text-earth-dark">
              {item.title}
            </h2>
            <p className="mt-2 text-xs leading-6 text-neutral-500">
              {item.desc}
            </p>
            <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
              อยู่ระหว่างพัฒนา
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
