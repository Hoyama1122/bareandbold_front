"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Ticket, Check, Copy } from "lucide-react";
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

export default function ShopVouchersSection({ shopSlug, shopName, isOwner }) {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });

  const loadShopVouchers = useCallback(async () => {
    if (!shopSlug) return;
    try {
      setLoading(true);
      const res = await voucherService.getPublicVouchers({
        shopSlug,
        type: "SHOP",
      });
      if (res.success) {
        setVouchers(res.vouchers || []);
      }
    } catch {
      // ignore initial load error
    } finally {
      setLoading(false);
    }
  }, [shopSlug]);

  useEffect(() => {
    loadShopVouchers();
  }, [loadShopVouchers]);

  const handleClaim = async (voucherId) => {
    if (!user) {
      setNotice({ type: "error", text: "กรุณาเข้าสู่ระบบก่อนเก็บคูปองร้านค้า" });
      return;
    }
    try {
      setClaimingId(voucherId);
      setNotice({ type: "", text: "" });
      const res = await voucherService.claimVoucher(voucherId);
      setNotice({
        type: "success",
        text: res.message || "เก็บคูปองร้านค้าเรียบร้อยแล้ว",
      });
      await loadShopVouchers();
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "ไม่สามารถเก็บคูปองได้",
      });
    } finally {
      setClaimingId(null);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 1800);
  };

  if (isOwner || loading || vouchers.length === 0) return null;

  return (
    <section className="mt-8 rounded-3xl border border-[#EDE5D7] bg-[#FAF6F0] p-5 sm:p-6 font-anuphan">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-[#C23B43]" />
          <h2 className="text-base sm:text-lg font-extrabold text-[#241E19]">
            คูปองส่วนลดของร้าน {shopName}
          </h2>
          {vouchers.length > 0 && (
            <span className="rounded-full bg-[#FBEBD5] px-2.5 py-0.5 text-[11px] font-bold text-[#BA3D44]">
              {vouchers.length} คูปอง
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <Link
              href="/seller/vouchers"
              className="rounded-full bg-[#1F1B18] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#3A312A] transition"
            >
              + จัดการคูปองร้าน
            </Link>
          )}
          <Link
            href="/coupons"
            className="text-xs font-bold text-[#6A5242] hover:underline"
          >
            ดูคูปองทั้งหมด →
          </Link>
        </div>
      </div>

      {notice.text && (
        <div
          className={`mb-4 rounded-xl px-4 py-2.5 text-xs font-bold ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-[#F5F0E6] text-[#6A5242] border border-[#EADECC]"
          }`}
        >
          {notice.text}
        </div>
      )}

      {vouchers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2D8C7] bg-white/70 py-6 text-center text-xs text-[#8A7D6B]">
          ร้านนี้ยังไม่มีคูปองสาธารณะที่เปิดให้เก็บ — กด “+ จัดการคูปองร้าน” เพื่อสร้างคูปองแรกได้เลย
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vouchers.map((v) => {
            const discountHeadline =
              v.discountType === "PERCENT"
                ? `${v.discountValue}% OFF`
                : `฿${baht(v.discountValue)} OFF`;
            const disabled = v.isClaimed || v.isOutOfStock || v.isExpired;

            return (
              <div
                key={v.id}
                className="relative flex items-stretch rounded-2xl bg-white p-2 shadow-xs border border-[#EFE4D2]"
              >
                {/* Ticket notches */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[36%] -top-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-[#FAF6F0] border-b border-[#EFE4D2]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[36%] -bottom-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-[#FAF6F0] border-t border-[#EFE4D2]"
                />

                {/* Left Stub */}
                <div className="flex w-[36%] shrink-0 flex-col items-center justify-center rounded-xl bg-[#FBEBD5] px-2 py-3 text-center">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#C88835]">
                    PROMO
                  </span>
                  <p className="mt-1 text-base font-black text-[#C23B43] leading-tight">
                    {discountHeadline}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(v.code)}
                    className="mt-1.5 inline-flex items-center gap-0.5 rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#7A4B23] cursor-pointer hover:bg-white"
                  >
                    <span>{v.code}</span>
                    <Copy size={9} />
                  </button>
                  {copiedCode === v.code && (
                    <span className="mt-0.5 text-[9px] font-bold text-[#556B2F]">
                      คัดลอกแล้ว
                    </span>
                  )}
                </div>

                {/* Perforation */}
                <div className="mx-1.5 my-2 border-l-2 border-dashed border-[#E6D3B3]" />

                {/* Right Info */}
                <div className="flex flex-1 flex-col justify-between rounded-xl bg-[#FBEBD5] px-3 py-2.5">
                  <div>
                    <p className="text-xs font-extrabold text-[#7A4B23] line-clamp-1">
                      {v.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#A87539]">
                      ขั้นต่ำ ฿{baht(v.minSpend)}
                      {v.maxDiscount ? ` · สูงสุด ฿${baht(v.maxDiscount)}` : ""}
                    </p>
                    <p className="text-[10px] text-[#A87539]">
                      ถึง {formatDate(v.endsAt)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="text-[10px] text-[#A87539]">
                      {v.remainingQuota != null
                        ? `เหลือ ${v.remainingQuota}`
                        : "ไม่จำกัด"}
                    </span>
                    <button
                      type="button"
                      disabled={disabled || claimingId === v.id}
                      onClick={() => handleClaim(v.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold transition cursor-pointer ${
                        v.isClaimed
                          ? "bg-[#556B2F]/15 text-[#556B2F] cursor-default"
                          : disabled
                            ? "bg-white/70 text-[#B4A38C] cursor-not-allowed"
                            : "bg-[#C23B43] text-white hover:bg-[#A62E36]"
                      }`}
                    >
                      {v.isClaimed ? (
                        <>
                          <Check size={11} /> เก็บแล้ว
                        </>
                      ) : v.isOutOfStock ? (
                        "เต็ม"
                      ) : v.isExpired ? (
                        "หมดอายุ"
                      ) : claimingId === v.id ? (
                        "..."
                      ) : (
                        "เก็บโค้ด"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
