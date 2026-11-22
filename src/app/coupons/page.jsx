"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Ticket,
  Truck,
  Store,
  Sparkles,
  Check,
  Tag,
  Search,
  Copy,
  RefreshCw,
} from "lucide-react";
import { voucherService } from "@/services/voucher.service";
import { useAuth } from "@/context/AuthContext";

function baht(n) {
  return Number(n || 0).toLocaleString("th-TH");
}

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function CouponGiftIllustration({ type = "PLATFORM" }) {
  const symbol = type === "SHIPPING" ? "🚚" : type === "SHOP" ? "★" : "%";
  return (
    <svg
      viewBox="0 0 120 76"
      className="w-24 h-16 mx-auto mt-1 select-none"
      aria-hidden="true"
    >
      {/* Confetti sparkles */}
      <circle cx="24" cy="24" r="2.2" fill="#E39B3E" />
      <circle cx="96" cy="20" r="2.2" fill="#D64550" />
      <circle cx="88" cy="36" r="1.8" fill="#4BA39B" />
      <path d="M30 12 Q34 18 31 24" stroke="#E39B3E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M90 10 Q86 16 89 22" stroke="#E39B3E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M18 34 Q23 32 26 36" stroke="#D64550" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Gift box back/inside */}
      <polygon points="32,54 88,54 96,74 24,74" fill="#3B8E86" />
      {/* Open lid left */}
      <polygon points="14,50 48,44 58,58 26,64" fill="#9EDAD1" />
      <polygon points="26,64 58,58 55,66 24,72" fill="#5CB5AA" />
      {/* Open lid right */}
      <polygon points="106,50 72,44 62,58 94,64" fill="#7AC8BE" />
      <polygon points="94,64 62,58 65,66 96,72" fill="#489E94" />
      {/* Box front */}
      <rect x="34" y="58" width="52" height="18" rx="2" fill="#2D7872" />
      <rect x="55" y="58" width="10" height="18" fill="#52ABA0" />

      {/* Scalloped starburst badge */}
      <g transform="translate(60, 32)">
        <polygon
          points="0,-22 5,-16 12,-19 13,-12 20,-11 17,-4 22,1 16,6 19,13 12,14 10,21 3,17 -2,22 -7,16 -14,19 -14,12 -21,10 -17,3 -22,-2 -16,-7 -19,-14 -12,-14 -9,-21 -3,-16"
          fill="#D2434F"
        />
        <circle cx="0" cy="0" r="13.5" fill="#E35D67" />
        <text
          x="0"
          y="5.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={type === "SHIPPING" ? "13" : "16"}
          fontWeight="800"
          fontFamily="sans-serif"
        >
          {symbol}
        </text>
      </g>
    </svg>
  );
}

export default function CouponsPage() {
  const { user } = useAuth();
  const [view, setView] = useState("discover"); // "discover" | "my"
  const [typeTab, setTypeTab] = useState("ALL"); // ALL | PLATFORM | SHOP | SHIPPING
  const [walletTab, setWalletTab] = useState("AVAILABLE"); // AVAILABLE | USED | EXPIRED
  const [search, setSearch] = useState("");

  const [vouchers, setVouchers] = useState([]);
  const [walletCounts, setWalletCounts] = useState({
    all: 0,
    available: 0,
    used: 0,
    expired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  // Private code claim
  const [privateCode, setPrivateCode] = useState("");
  const [claimingCode, setClaimingCode] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (view === "discover") {
        const res = await voucherService.getPublicVouchers({
          type: typeTab,
        });
        if (res.success) {
          setVouchers(res.vouchers || []);
        }
      } else {
        if (!user) {
          setVouchers([]);
          return;
        }
        const res = await voucherService.getMyVouchers(walletTab);
        if (res.success) {
          setVouchers(res.vouchers || []);
          if (res.counts) setWalletCounts(res.counts);
        }
      }

      // โหลดจำนวนคูปองในกระเป๋าเมื่อผู้ใช้ล็อกอิน
      if (user && view === "discover") {
        voucherService
          .getMyVouchers("ALL")
          .then((myRes) => {
            if (myRes.success && myRes.counts) setWalletCounts(myRes.counts);
          })
          .catch(() => {});
      }
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "ไม่สามารถโหลดข้อมูลคูปองจากระบบได้",
      });
    } finally {
      setLoading(false);
    }
  }, [view, typeTab, walletTab, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredVouchers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vouchers;
    return vouchers.filter(
      (v) =>
        v.code?.toLowerCase().includes(q) ||
        v.title?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.shop?.name?.toLowerCase().includes(q),
    );
  }, [vouchers, search]);

  const handleClaim = async (voucherId) => {
    if (!user) {
      setNotice({ type: "error", text: "กรุณาเข้าสู่ระบบก่อนกดเก็บคูปอง" });
      return;
    }
    try {
      setClaimingId(voucherId);
      setNotice({ type: "", text: "" });
      const res = await voucherService.claimVoucher(voucherId);
      setNotice({
        type: "success",
        text: res.message || "เก็บคูปองเข้ากระเป๋าเรียบร้อยแล้ว",
      });
      await loadData();
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "ไม่สามารถเก็บคูปองได้",
      });
    } finally {
      setClaimingId(null);
    }
  };

  const handleClaimByCode = async (e) => {
    e.preventDefault();
    const code = privateCode.trim().toUpperCase();
    if (!code) return;
    if (!user) {
      setNotice({ type: "error", text: "กรุณาเข้าสู่ระบบก่อนเก็บโค้ดส่วนลด" });
      return;
    }
    try {
      setClaimingCode(true);
      setNotice({ type: "", text: "" });
      const res = await voucherService.claimByCode(code);
      setNotice({
        type: "success",
        text: res.message || `เก็บโค้ด ${code} เรียบร้อยแล้ว`,
      });
      setPrivateCode("");
      await loadData();
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "ไม่พบรหัสคูปองนี้ หรือไม่สามารถเก็บได้",
      });
    } finally {
      setClaimingCode(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-anuphan">
      <Header />

      <main className="flex-1 pb-20">
        {/* Hero Banner */}
        <section className="bg-[#F5F0E6] border-b border-[#EADECC]">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#556B2F]">
                  Bare &amp; Bold Vouchers
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[#3C322A]">
                  ศูนย์รวมคูปองส่วนลด
                </h1>
                <p className="mt-2 text-sm text-[#8C8577] max-w-xl">
                  เก็บคูปองจากแพลตฟอร์ม คูปองร้านค้า และคูปองส่งฟรีที่เปิดใช้งานจริงในระบบ
                </p>
              </div>

              {/* Private Code Claim Form */}
              <form
                onSubmit={handleClaimByCode}
                className="flex w-full sm:w-auto flex-wrap gap-2"
              >
                <input
                  type="text"
                  value={privateCode}
                  onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
                  placeholder="กรอกรหัสโค้ดลับ เช่น BB100"
                  className="flex-1 sm:w-56 rounded-xl border border-[#EADECC] bg-white px-4 py-2.5 font-mono text-sm uppercase text-[#3C322A] outline-none focus:border-[#6A5242]"
                />
                <button
                  type="submit"
                  disabled={claimingCode}
                  className="rounded-xl bg-[#6A5242] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#556B2F] transition disabled:opacity-60 cursor-pointer"
                >
                  {claimingCode ? "กำลังเก็บ..." : "เก็บโค้ด"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Controls & List */}
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Switch Discover / My Vouchers */}
            <div className="inline-flex rounded-xl bg-[#F5F0E6] p-1 border border-[#EADECC]">
              <button
                type="button"
                onClick={() => {
                  setView("discover");
                  setNotice({ type: "", text: "" });
                }}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  view === "discover"
                    ? "bg-white text-[#3C322A] shadow-2xs"
                    : "text-[#8C8577] hover:text-[#3C322A]"
                }`}
              >
                คูปองทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("my");
                  setNotice({ type: "", text: "" });
                }}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  view === "my"
                    ? "bg-white text-[#3C322A] shadow-2xs"
                    : "text-[#8C8577] hover:text-[#3C322A]"
                }`}
              >
                คูปองของฉัน{" "}
                {walletCounts.available > 0 ? `(${walletCounts.available})` : ""}
              </button>
            </div>

            {/* Search + Refresh */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8577]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาโค้ด, ชื่อคูปอง หรือร้านค้า..."
                  className="w-60 rounded-xl border border-[#EADECC] bg-white pl-9 pr-3.5 py-2 text-xs text-[#3C322A] outline-none focus:border-[#6A5242]"
                />
              </div>
              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#EADECC] bg-white px-3.5 py-2 text-xs font-bold text-[#6A5242] hover:bg-[#F5F0E6] cursor-pointer"
              >
                <RefreshCw size={13} /> รีเฟรช
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {view === "discover"
              ? [
                  { id: "ALL", label: "ทั้งหมด" },
                  { id: "PLATFORM", label: "คูปองแพลตฟอร์ม" },
                  { id: "SHOP", label: "คูปองร้านค้า" },
                  { id: "SHIPPING", label: "คูปองส่งฟรี" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeTab(t.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      typeTab === t.id
                        ? "bg-[#556B2F] text-white"
                        : "bg-white border border-[#EADECC] text-[#3C322A] hover:bg-[#F5F0E6]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))
              : [
                  { id: "AVAILABLE", label: `ใช้ได้ (${walletCounts.available})` },
                  { id: "USED", label: `ใช้แล้ว (${walletCounts.used})` },
                  { id: "EXPIRED", label: `หมดอายุ (${walletCounts.expired})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setWalletTab(t.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                      walletTab === t.id
                        ? "bg-[#6A5242] text-white"
                        : "bg-white border border-[#EADECC] text-[#3C322A] hover:bg-[#F5F0E6]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
          </div>

          {/* Notice */}
          {notice.text && (
            <div
              className={`mb-6 rounded-xl px-4 py-3 text-xs font-bold ${
                notice.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-[#F5F0E6] text-[#6A5242] border border-[#EADECC]"
              }`}
            >
              {notice.text}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="py-16 text-center text-sm text-[#8C8577]">
              กำลังโหลดคูปองจากระบบ...
            </div>
          ) : view === "my" && !user ? (
            <div className="rounded-3xl border border-[#EADECC] bg-white p-12 text-center">
              <p className="text-base font-bold text-[#3C322A]">
                กรุณาเข้าสู่ระบบเพื่อดูกระเป๋าคูปองของคุณ
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block rounded-full bg-[#6A5242] px-6 py-2.5 text-xs font-bold text-white"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#EADECC] bg-white py-16 text-center">
              <Ticket size={34} className="mx-auto text-[#8C8577] mb-3" />
              <p className="text-base font-bold text-[#3C322A]">
                {search
                  ? "ไม่พบคูปองที่ตรงกับคำค้นหา"
                  : "ยังไม่มีคูปองในหมวดนี้"}
              </p>
              <p className="mt-1 text-xs text-[#8C8577]">
                คูปองที่สร้างโดยร้านค้าหรือแอดมินจะแสดงที่นี่โดยอัตโนมัติ
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredVouchers.map((v) => {
                const discountHeadline =
                  v.type === "SHIPPING"
                    ? v.discountType === "PERCENT"
                      ? `ลดค่าส่ง ${v.discountValue}%`
                      : `ส่งฟรี ฿${baht(v.discountValue)}`
                    : v.discountType === "PERCENT"
                      ? `${v.discountValue}% OFF`
                      : `฿${baht(v.discountValue)} OFF`;

                const couponCategoryLabel =
                  v.type === "SHIPPING"
                    ? "SHIPPING COUPON"
                    : v.type === "SHOP"
                      ? "SHOP COUPON"
                      : "DISCOUNT COUPON";

                const disabled = v.isClaimed || v.isOutOfStock || v.isExpired;

                return (
                  <div
                    key={v.id}
                    className="relative flex items-stretch rounded-2xl bg-white p-2.5 shadow-[0_6px_24px_rgba(60,50,42,0.08)] border border-[#EFE4D2] hover:shadow-[0_10px_28px_rgba(60,50,42,0.12)] transition"
                  >
                    {/* Top & Bottom Semicircle Ticket Notches */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[37%] -top-2.5 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-[#FDFBF7] border-b border-[#EFE4D2]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[37%] -bottom-2.5 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-[#FDFBF7] border-t border-[#EFE4D2]"
                    />

                    {/* LEFT STUB PANEL */}
                    <div className="relative flex w-[37%] shrink-0 flex-col justify-between rounded-xl bg-[#FBEBD5] px-2.5 pt-3 pb-1.5 text-center overflow-hidden">
                      {/* Thin inner amber border like the reference */}
                      <div className="pointer-events-none absolute inset-2.5 rounded-lg border border-[#E2A957]/75" />

                      <div className="relative z-10 pt-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C88835]">
                          PROMO CODE
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(v.code)}
                          title="คลิกเพื่อคัดลอกโค้ด"
                          className="mt-1 inline-flex max-w-full items-center justify-center gap-1 font-mono text-sm sm:text-base font-extrabold tracking-wide text-[#BA3D44] hover:opacity-80 cursor-pointer truncate"
                        >
                          <span className="truncate">{v.code}</span>
                          <Copy size={11} className="shrink-0 opacity-70" />
                        </button>
                        {copiedCode === v.code && (
                          <p className="text-[10px] font-bold text-[#556B2F]">
                            คัดลอกแล้ว!
                          </p>
                        )}
                      </div>

                      <div className="relative z-10 -mb-1.5">
                        <CouponGiftIllustration type={v.type} />
                      </div>
                    </div>

                    {/* VERTICAL PERFORATION DIVIDER */}
                    <div className="mx-2 my-3 border-l-2 border-dashed border-[#E6D3B3]" />

                    {/* RIGHT MAIN DISCOUNT PANEL */}
                    <div className="flex flex-1 flex-col justify-between rounded-xl bg-[#FBEBD5] px-4 py-3.5 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C88835]">
                            {couponCategoryLabel}
                          </span>
                        </div>

                        {v.shop?.name && (
                          <Link
                            href={`/shop/${v.shop.slug}`}
                            className="mt-0.5 inline-block text-[11px] font-bold text-[#556B2F] hover:underline"
                          >
                            ร้าน {v.shop.name}
                          </Link>
                        )}

                        <p className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-[#C23B43] leading-none">
                          {discountHeadline}
                        </p>

                        <h3 className="mt-2 text-xs sm:text-sm font-bold text-[#7A4B23] line-clamp-1">
                          {v.title}
                        </h3>

                        <p className="mt-1 text-[11px] leading-relaxed text-[#A87539]">
                          ขั้นต่ำ ฿{baht(v.minSpend)}
                          {v.maxDiscount ? ` · สูงสุด ฿${baht(v.maxDiscount)}` : ""}
                          <br />
                          ใช้ได้ถึง {formatDate(v.endsAt)}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#E6CEAA]/70 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-[#A87539]">
                          {v.remainingQuota != null
                            ? `เหลือ ${v.remainingQuota} สิทธิ์`
                            : "ไม่จำกัดสิทธิ์"}
                        </span>

                        {view === "discover" ? (
                          <button
                            type="button"
                            disabled={disabled || claimingId === v.id}
                            onClick={() => handleClaim(v.id)}
                            className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                              v.isClaimed
                                ? "bg-[#556B2F]/15 text-[#556B2F] cursor-default"
                                : disabled
                                  ? "bg-white/70 text-[#B4A38C] cursor-not-allowed"
                                  : "bg-[#C23B43] text-white shadow-xs hover:bg-[#A62E36]"
                            }`}
                          >
                            {v.isClaimed ? (
                              <>
                                <Check size={13} /> เก็บแล้ว
                              </>
                            ) : v.isOutOfStock ? (
                              "สิทธิ์เต็ม"
                            ) : v.isExpired ? (
                              "หมดอายุ"
                            ) : claimingId === v.id ? (
                              "กำลังเก็บ..."
                            ) : (
                              "เก็บโค้ด"
                            )}
                          </button>
                        ) : (
                          <Link
                            href="/checkout"
                            className="rounded-full bg-[#C23B43] px-4 py-1.5 text-xs font-extrabold text-white shadow-xs hover:bg-[#A62E36]"
                          >
                            ใช้เลย
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
