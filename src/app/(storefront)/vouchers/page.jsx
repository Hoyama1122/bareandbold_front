"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Ticket, Truck, Store, Sparkles, Check, Tag } from "lucide-react";
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

export default function VouchersPage() {
  const { user } = useAuth();
  const [view, setView] = useState("discover"); // "discover" | "my"
  const [typeTab, setTypeTab] = useState("ALL"); // ALL | PLATFORM | SHOP | SHIPPING
  const [walletTab, setWalletTab] = useState("AVAILABLE"); // AVAILABLE | USED | EXPIRED
  const [vouchers, setVouchers] = useState([]);
  const [walletCounts, setWalletCounts] = useState({ available: 0, used: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [privateCode, setPrivateCode] = useState("");
  const [claimingCode, setClaimingCode] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (view === "discover") {
        const res = await voucherService.getPublicVouchers({ type: typeTab });
        if (res.success) setVouchers(res.vouchers || []);
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
    } catch (err) {
      setNotice({ type: "error", text: err.message || "โหลดรายการคูปองไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  }, [view, typeTab, walletTab, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClaim = async (voucherId) => {
    if (!user) {
      setNotice({ type: "error", text: "กรุณาเข้าสู่ระบบก่อนเก็บคูปอง" });
      return;
    }
    try {
      setClaimingId(voucherId);
      setNotice({ type: "", text: "" });
      const res = await voucherService.claimVoucher(voucherId);
      setNotice({ type: "success", text: res.message || "เก็บคูปองเรียบร้อยแล้ว" });
      await loadData();
    } catch (err) {
      setNotice({ type: "error", text: err.message || "เก็บคูปองไม่สำเร็จ" });
    } finally {
      setClaimingId(null);
    }
  };

  const handleClaimCode = async (e) => {
    e.preventDefault();
    if (!privateCode.trim()) return;
    if (!user) {
      setNotice({ type: "error", text: "กรุณาเข้าสู่ระบบก่อนเก็บโค้ด" });
      return;
    }
    try {
      setClaimingCode(true);
      setNotice({ type: "", text: "" });
      const res = await voucherService.claimByCode(privateCode.trim());
      setNotice({ type: "success", text: res.message || "เก็บโค้ดเรียบร้อยแล้ว" });
      setPrivateCode("");
      await loadData();
    } catch (err) {
      setNotice({ type: "error", text: err.message || "ไม่พบหรือเก็บโค้ดนี้ไม่ได้" });
    } finally {
      setClaimingCode(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-anuphan pb-20">
      {/* Hero */}
      <section className="bg-[#F5F0E6] border-b border-[#EADECC]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#556B2F]">
            Bare &amp; Bold Vouchers
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[#3C322A]">
            ศูนย์รวมคูปองส่วนลด
          </h1>
          <p className="mt-2 text-sm text-[#8C8577] max-w-xl">
            เก็บคูปองจากแพลตฟอร์ม คูปองร้านค้า และคูปองส่งฟรี เพื่อนำไปใช้ลดราคาในหน้าชำระเงิน
          </p>

          {/* Private Code Input */}
          <form onSubmit={handleClaimCode} className="mt-6 flex flex-wrap gap-2.5 max-w-lg">
            <input
              type="text"
              value={privateCode}
              onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
              placeholder="กรอกรหัสโค้ดลับ เช่น BB100..."
              className="flex-1 min-w-[200px] rounded-xl border border-[#EADECC] bg-white px-4 py-2.5 font-mono text-sm uppercase text-[#3C322A] outline-none focus:border-[#6A5242]"
            />
            <button
              type="submit"
              disabled={claimingCode}
              className="rounded-xl bg-[#6A5242] px-5 py-2.5 text-xs font-bold text-white hover:opacity-95 disabled:opacity-60 cursor-pointer"
            >
              {claimingCode ? "กำลังเก็บ..." : "เก็บโค้ด"}
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        {/* Main View Switch */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex rounded-xl bg-[#F5F0E6] p-1 border border-[#EADECC]">
            <button
              type="button"
              onClick={() => setView("discover")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                view === "discover"
                  ? "bg-white text-[#3C322A] shadow-2xs"
                  : "text-[#8C8577]"
              }`}
            >
              เก็บคูปอง
            </button>
            <button
              type="button"
              onClick={() => setView("my")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                view === "my"
                  ? "bg-white text-[#3C322A] shadow-2xs"
                  : "text-[#8C8577]"
              }`}
            >
              คูปองของฉัน {walletCounts.available > 0 ? `(${walletCounts.available})` : ""}
            </button>
          </div>

          {view === "discover" ? (
            <div className="flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "ทั้งหมด" },
                { id: "PLATFORM", label: "คูปองแพลตฟอร์ม" },
                { id: "SHOP", label: "คูปองร้านค้า" },
                { id: "SHIPPING", label: "ส่งฟรี" },
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
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {[
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
          )}
        </div>

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

        {loading ? (
          <div className="py-16 text-center text-sm text-[#8C8577]">
            กำลังโหลดรายการคูปอง...
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
        ) : vouchers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#EADECC] bg-white py-16 text-center">
            <Ticket size={32} className="mx-auto text-[#8C8577] mb-3" />
            <p className="text-base font-bold text-[#3C322A]">ยังไม่มีคูปองในหมวดนี้</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vouchers.map((v) => {
              const Icon =
                v.type === "SHIPPING"
                  ? Truck
                  : v.type === "SHOP"
                    ? Store
                    : Sparkles;
              const discountText =
                v.discountType === "PERCENT"
                  ? `ลด ${v.discountValue}%`
                  : `ลด ฿${baht(v.discountValue)}`;
              const disabled = v.isClaimed || v.isOutOfStock || v.isExpired;

              return (
                <div
                  key={v.id}
                  className="flex overflow-hidden rounded-2xl border border-[#EADECC] bg-white shadow-2xs"
                >
                  {/* Left Stub */}
                  <div className="flex w-32 shrink-0 flex-col items-center justify-center bg-[#F5F0E6] px-3 py-5 text-center border-r border-dashed border-[#D6CCB8]">
                    <Icon size={22} className="text-[#556B2F] mb-1.5" />
                    <p className="text-lg font-black text-[#3C322A] leading-tight">
                      {discountText}
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-[#8C8577]">
                      {v.type === "SHIPPING"
                        ? "ส่งฟรี"
                        : v.type === "SHOP"
                          ? "คูปองร้านค้า"
                          : "แพลตฟอร์ม"}
                    </p>
                  </div>

                  {/* Right Body */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-[#FAF7F0] px-2 py-0.5 font-mono text-[11px] font-bold text-[#6A5242] border border-[#EADECC]">
                          <Tag size={10} /> {v.code}
                        </span>
                        {v.shop?.name && (
                          <Link
                            href={`/shop/${v.shop.slug}`}
                            className="text-[11px] font-bold text-[#556B2F] hover:underline truncate"
                          >
                            {v.shop.name}
                          </Link>
                        )}
                      </div>
                      <h3 className="mt-1.5 text-sm font-extrabold text-[#3C322A]">
                        {v.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#8C8577]">
                        ขั้นต่ำ ฿{baht(v.minSpend)}
                        {v.maxDiscount ? ` · สูงสุด ฿${baht(v.maxDiscount)}` : ""}
                        {" · "}หมดอายุ {formatDate(v.endsAt)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#8C8577]">
                        {v.remainingQuota != null
                          ? `เหลือ ${v.remainingQuota} สิทธิ์`
                          : "ไม่จำกัดสิทธิ์"}
                      </span>

                      {view === "discover" ? (
                        <button
                          type="button"
                          disabled={disabled || claimingId === v.id}
                          onClick={() => handleClaim(v.id)}
                          className={`inline-flex items-center gap-1 rounded-xl px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                            v.isClaimed
                              ? "bg-[#556B2F]/15 text-[#556B2F] cursor-default"
                              : disabled
                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                : "bg-[#6A5242] text-white hover:bg-[#556B2F]"
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
                          className="rounded-xl bg-[#556B2F] px-4 py-1.5 text-xs font-bold text-white hover:opacity-95"
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
  );
}
