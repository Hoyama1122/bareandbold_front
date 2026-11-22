"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function BrandSunburstIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="12" r="7.5" strokeDasharray="2.2 2.4" />
      <path
        strokeLinecap="round"
        d="M12 1.8v2M12 20.2v2M1.8 12h2M20.2 12h2M4.8 4.8l1.4 1.4M17.8 17.8l1.4 1.4M19.2 4.8l-1.4 1.4M6.2 17.8l-1.4 1.4"
      />
    </svg>
  );
}

function NavIcon({ type, className = "h-[18px] w-[18px] shrink-0" }) {
  switch (type) {
    case "dashboard":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
          <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" />
          <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
          <rect x="14" y="14" width="6.5" height="6.5" rx="1.2" />
        </svg>
      );
    case "products":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M4 7.5l8 4.5 8-4.5" />
          <path d="M12 12v9" />
        </svg>
      );
    case "refund":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M3 10h10a5 5 0 0 1 5 5v2" />
          <path d="M7 6L3 10l4 4" />
        </svg>
      );
    case "orders":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
          <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "wallet":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          <path d="M21 12H13a2 2 0 0 0 0 4h8v-4z" />
        </svg>
      );
    case "shop":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M4 9l1.5-5h13L20 9" />
          <path d="M4 9h16v11H4V9z" />
          <path d="M9.5 20v-6h5v6" />
        </svg>
      );
    case "voucher":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z" />
          <path d="M13 5v14" strokeDasharray="2 2" />
        </svg>
      );
    case "globe":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <path d="M12 3.5a13.5 13.5 0 0 1 0 17" />
          <path d="M12 3.5a13.5 13.5 0 0 0 0 17" />
        </svg>
      );
    case "back":
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </svg>
      );
  }
}

/**
 * Layout ของ Seller Center
 * - แถบ Sidebar และ Topbar ปรับขนาดและสัดส่วนให้ใหญ่ชัดตามสไตล์ Portal
 * - ไอคอนเมนูใช้ Line SVG
 */
export default function SellerLayout({ children }) {
  const { user, shop, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/seller")}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-base font-bold text-slate-500">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  if (!user) return null;

  if (!shop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FA] px-6 text-center text-slate-900">
        <div className="text-5xl">🏪</div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          คุณยังไม่มีร้านค้า
        </h1>
        <p className="text-base text-slate-500">
          สมัครเปิดร้านก่อนเข้าใช้ Seller Center
        </p>
        <Link
          href="/become-seller"
          className="rounded-lg bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F766E]"
        >
          สมัครเปิดร้าน
        </Link>
      </div>
    );
  }

  if (shop.status !== "APPROVED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FA] px-6 text-center text-slate-900">
        <div className="text-5xl">⏳</div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          ร้านของคุณยังไม่พร้อมใช้งาน
        </h1>
        <p className="text-base text-slate-500">
          สถานะปัจจุบัน: <span className="font-bold">{shop.status}</span>
          {shop.status === "SUSPENDED" && shop.suspendedReason
            ? ` — ${shop.suspendedReason}`
            : shop.rejectionReason
              ? ` — ${shop.rejectionReason}`
              : ""}
        </p>
        <Link
          href="/become-seller"
          className="rounded-lg bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F766E]"
        >
          ดูสถานะ / แก้ไขข้อมูลร้าน
        </Link>
      </div>
    );
  }

  const navGroups = [
    {
      section: "ภาพรวม",
      items: [
        { href: "/seller", label: "ภาพรวมร้านค้า", iconType: "dashboard" },
      ],
    },
    {
      section: "จัดการร้านค้า",
      items: [
        { href: "/seller/orders", label: "คำสั่งซื้อ / จัดส่ง", iconType: "orders" },
        { href: "/seller/refunds", label: "คำขอคืนเงิน / เคลม", iconType: "refund" },
        { href: "/seller/products", label: "รายการสินค้า", iconType: "products" },
        { href: "/seller/vouchers", label: "คูปองร้านค้า", iconType: "voucher" },
        { href: "/seller/finance", label: "การเงินร้านค้า", iconType: "wallet" },
        { href: "/seller/shop", label: "ข้อมูลร้านและบัญชี", iconType: "shop" },
      ],
    },
    {
      section: "หน้าร้าน",
      items: [
        {
          href: `/shop/${shop.slug}`,
          label: "ดูหน้าร้านของฉัน",
          iconType: "globe",
        },
        { href: "/", label: "กลับหน้า Storefront", iconType: "back" },
      ],
    },
  ];

  const pageTitle = pathname.startsWith("/seller/orders")
    ? "คำสั่งซื้อและการจัดส่ง (Seller Orders & Fulfillment)"
    : pathname.startsWith("/seller/products")
      ? "รายการสินค้า (Products)"
      : pathname.startsWith("/seller/vouchers")
        ? "คูปองส่วนลดร้านค้า (Shop Vouchers)"
        : pathname.startsWith("/seller/shop")
          ? "ข้อมูลร้านค้าและบัญชีรับเงิน (Shop Profile)"
          : pathname.startsWith("/seller/finance")
            ? "การเงินและยอดขายร้านค้า (Seller Finance)"
            : "ภาพรวมร้านค้า (Seller Dashboard)";

  const initialChar = (shop.name || user.name || "S")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-800">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <BrandSunburstIcon className="h-7 w-7 flex-shrink-0 text-slate-900" />
            <div className="leading-tight">
              <div className="text-base font-black tracking-[0.14em] text-slate-900">
                BARE &amp; BOLD
              </div>
              <div className="mt-0.5 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                SELLER PORTAL
              </div>
            </div>
          </div>

          {/* Nav Groups */}
          <nav className="space-y-6 px-4 py-6">
            {navGroups.map((group) => (
              <div key={group.section}>
                <p className="mb-2 px-3 text-xs font-semibold text-slate-400">
                  {group.section}
                </p>
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/seller"
                        ? pathname === "/seller"
                        : item.href.startsWith("/seller") &&
                          pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                          isActive
                            ? "bg-teal-50/90 font-bold text-teal-800"
                            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <NavIcon
                          type={item.iconType}
                          className={`h-[18px] w-[18px] shrink-0 ${
                            isActive ? "text-teal-700" : "text-slate-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Shop / User Badge */}
        <div className="border-t border-slate-100 p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-extrabold text-teal-800">
              {initialChar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {shop.name}
              </p>
              <span className="mt-1 inline-block rounded bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700">
                Seller
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-lg border border-slate-200 p-2 text-sm font-bold text-slate-700 hover:bg-slate-50 lg:hidden cursor-pointer"
              aria-label="เปิดปิดเมนู"
            >
              ☰
            </button>
            <h1 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <span className="hidden sm:inline">ยินดีต้อนรับ,</span>
            <span className="font-bold text-slate-800">{shop.name}</span>
          </div>
        </header>

        {/* Page Body */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}