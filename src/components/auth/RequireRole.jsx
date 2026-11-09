"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * ป้องกันหน้าเฉพาะ role ฝั่ง client
 * (backend ยังเป็นด่านตรวจสิทธิ์จริงเสมอ)
 */
export default function RequireRole({ role, children }) {
  const { user, role: currentRole, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm font-bold text-neutral-400">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  if (!user) return null;

  if (role && currentRole !== role) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="text-2xl font-bold text-earth-dark">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้
        </h1>
        <p className="text-sm text-neutral-500">
          หน้านี้สำหรับผู้ขายที่ได้รับอนุมัติแล้วเท่านั้น
        </p>
        <Link
          href="/"
          className="rounded-full bg-earth-dark px-6 py-2.5 text-sm font-bold text-white transition hover:bg-earth-olive"
        >
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  return children;
}
