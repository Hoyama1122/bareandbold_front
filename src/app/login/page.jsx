"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * หน้า Login ของ storefront
 * ใช้ร่วมกันทั้ง buyer และ seller แล้ว redirect กลับไปยัง ?next=
 * หลัง login สำเร็จ AuthContext จะ refresh profile ให้อัตโนมัติ
 */
function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const rawNext = searchParams.get("next") || "/";
  const next = rawNext.startsWith("/") ? rawNext : "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-earth-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-earth-dark">
            เข้าสู่ระบบ
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            เข้าสู่ระบบเพื่อสั่งซื้อหรือจัดการร้านค้าของคุณ
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
              อีเมล
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-earth-olive focus:ring-1 focus:ring-earth-olive"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-earth-olive focus:ring-1 focus:ring-earth-olive"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-earth-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-earth-olive disabled:bg-neutral-300"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          ยังไม่มีบัญชี?{" "}
          <Link href="/" className="font-bold text-earth-olive hover:underline">
            สมัครสมาชิกจากหน้าแรก
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-neutral-400">
          กำลังโหลด...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
