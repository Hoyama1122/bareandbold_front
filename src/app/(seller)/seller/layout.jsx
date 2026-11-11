"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Layout ของ Seller Center (แยกจาก Storefront โดยสิ้นเชิง)
 * - ไม่มี Header/Footer ของหน้าร้าน
 * - guard: ต้อง login + มีร้าน + ร้าน APPROVED
 * - เพื่อนสามารถเอา layout นี้ไปต่อยอด sidebar/dashboard ได้เลย
 */
export default function SellerLayout({ children }) {
  const { user, shop, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/seller")}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm font-bold text-neutral-400">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  if (!user) return null;

  if (!shop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center">
        <div className="text-5xl">🏪</div>
        <h1 className="text-2xl font-extrabold text-earth-dark">
          คุณยังไม่มีร้านค้า
        </h1>
        <p className="text-sm text-neutral-500">
          สมัครเปิดร้านก่อนเข้าใช้ Seller Center
        </p>
        <Link
          href="/become-seller"
          className="rounded-full bg-earth-dark px-6 py-2.5 text-sm font-bold text-white transition hover:bg-earth-olive"
        >
          สมัครเปิดร้าน
        </Link>
      </div>
    );
  }

  if (shop.status !== "APPROVED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center">
        <div className="text-5xl">⏳</div>
        <h1 className="text-2xl font-extrabold text-earth-dark">
          ร้านของคุณยังไม่พร้อมใช้งาน
        </h1>
        <p className="text-sm text-neutral-500">
          สถานะปัจจุบัน: <span className="font-bold">{shop.status}</span>
          {shop.status === "SUSPENDED" && shop.suspendedReason
            ? ` — ${shop.suspendedReason}`
            : shop.rejectionReason
              ? ` — ${shop.rejectionReason}`
              : ""}
        </p>
        <Link
          href="/become-seller"
          className="rounded-full bg-earth-dark px-6 py-2.5 text-sm font-bold text-white transition hover:bg-earth-olive"
        >
          ดูสถานะ / แก้ไขข้อมูลร้าน
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Seller Topbar — แยกจาก Storefront Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/seller" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-earth-dark text-sm font-black text-white">
                B
              </span>
              <span className="text-sm font-extrabold uppercase tracking-[0.12em] text-earth-dark">
                Seller Center
              </span>
            </Link>
            <span className="hidden text-xs text-neutral-400 sm:inline">
              {shop.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/shop/${shop.slug}`}
              className="hidden rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-600 transition hover:bg-neutral-50 sm:inline-flex"
            >
              ดูหน้าร้าน
            </Link>
            <Link
              href="/"
              className="rounded-full bg-earth-beige px-4 py-2 text-xs font-bold text-earth-dark transition hover:bg-earth-border"
            >
              กลับ Storefront
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
}
