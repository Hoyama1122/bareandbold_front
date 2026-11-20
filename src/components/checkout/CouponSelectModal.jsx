"use client";

import React, { useState } from "react";
import { Tag, Check, X, ArrowRight, AlertCircle, Sparkles, Percent, Truck } from "lucide-react";
import { INITIAL_COUPONS, calculateCouponDiscount } from "@/data/coupons";
import { INK, CREAM, OLIVE, WHITE, BORDER, MUTED } from "./constants";

export default function CouponSelectModal({
  isOpen,
  onClose,
  subtotal = 0,
  baseShipping = 50,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  collectedCoupons = [],
}) {
  const [typedCode, setTypedCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(appliedCoupon);

  if (!isOpen) return null;

  // Merge INITIAL_COUPONS with collectedCoupons to ensure latest data
  const allAvailableCoupons = [...INITIAL_COUPONS];

  // Evaluate each coupon against current subtotal
  const evaluatedCoupons = allAvailableCoupons.map((cp) => {
    const isCollected = collectedCoupons.some(
      (c) => (c.couponId === cp.id || c.coupon?.id === cp.id || c.coupon?.code === cp.code)
    );
    const evaluation = calculateCouponDiscount(cp, subtotal, baseShipping);
    return {
      ...cp,
      isCollected,
      isEligible: evaluation.valid,
      evaluation,
    };
  });

  const eligibleCoupons = evaluatedCoupons.filter((c) => c.isEligible && c.status !== "out_of_stock" && c.status !== "expired");
  const ineligibleCoupons = evaluatedCoupons.filter((c) => !c.isEligible || c.status === "out_of_stock" || c.status === "expired");

  const handleApplyTypedCode = (e) => {
    e.preventDefault();
    setCodeError("");
    const cleanCode = typedCode.trim().toUpperCase();
    if (!cleanCode) return;

    const matched = allAvailableCoupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!matched) {
      setCodeError("ไม่พบโค้ดส่วนลดนี้ หรือโค้ดอาจหมดอายุแล้ว");
      return;
    }

    const evalRes = calculateCouponDiscount(matched, subtotal, baseShipping);
    if (!evalRes.valid) {
      setCodeError(evalRes.reason || "ยอดสั่งซื้อไม่ตรงตามเงื่อนไขของคูปองนี้");
      return;
    }

    setSelectedCoupon(matched);
    onApplyCoupon(matched);
    setTypedCode("");
    onClose();
  };

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    onApplyCoupon(coupon);
    onClose();
  };

  const handleClearCoupon = () => {
    setSelectedCoupon(null);
    onRemoveCoupon();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-anuphan animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-scaleUp flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-earth-olive/10 text-earth-olive">
              <Tag size={18} />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-earth-dark">
                เลือกคูปองส่วนลด BARE &amp; BOLD
              </h3>
              <p className="text-xs text-neutral-400">
                ยอดสินค้าของคุณ ฿{subtotal.toLocaleString()} · เลือกคูปองที่ต้องการใช้งาน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Enter Code Input Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <label className="block text-xs font-bold text-neutral-700">
              มีโค้ดส่วนลดพิเศษหรือไม่?
            </label>
            <form onSubmit={handleApplyTypedCode} className="flex gap-2">
              <input
                type="text"
                placeholder="กรอกโค้ดส่วนลด เช่น WELCOME100"
                value={typedCode}
                onChange={(e) => setTypedCode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 uppercase focus:outline-hidden focus:border-earth-dark font-mono font-bold"
              />
              <button
                type="submit"
                disabled={!typedCode.trim()}
                className="px-5 py-2.5 rounded-xl bg-earth-dark hover:bg-earth-olive disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
              >
                ใช้งาน
              </button>
            </form>
            {codeError && (
              <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                <span>{codeError}</span>
              </p>
            )}
          </div>

          {/* Currently Applied Banner */}
          {appliedCoupon && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#556B2F]/10 border border-[#556B2F]/20 text-[#556B2F]">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎟️</span>
                <div>
                  <p className="text-xs font-extrabold">
                    กำลังใช้งาน: {appliedCoupon.title}
                  </p>
                  <p className="text-[11px] opacity-80">
                    โค้ด: <span className="font-mono font-bold">{appliedCoupon.code}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearCoupon}
                className="px-3 py-1.5 rounded-full bg-white text-rose-600 border border-rose-200 text-[11px] font-bold hover:bg-rose-50 transition cursor-pointer"
              >
                เลิกใช้คูปอง
              </button>
            </div>
          )}

          {/* 2. Eligible Coupons List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-earth-dark flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span>คูปองที่สามารถใช้ได้กับคำสั่งซื้อนี้ ({eligibleCoupons.length})</span>
              </h4>
            </div>

            {eligibleCoupons.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-neutral-300 text-center text-xs text-neutral-400">
                ไม่มีคูปองที่ตรงตามยอดสั่งซื้อในขณะนี้
              </div>
            ) : (
              <div className="space-y-2.5">
                {eligibleCoupons.map((cp) => {
                  const isSelected = selectedCoupon?.code === cp.code;
                  return (
                    <div
                      key={cp.id}
                      onClick={() => handleSelectCoupon(cp)}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer select-none ${
                        isSelected
                          ? "border-[#556B2F] ring-2 ring-[#556B2F]/20 bg-[#556B2F]/5"
                          : "border-neutral-200 hover:border-neutral-300 bg-white shadow-xs"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1 pr-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 text-earth-dark">
                          {cp.category === "shipping" ? (
                            <Truck size={18} className="text-emerald-700" />
                          ) : (
                            <Percent size={18} className="text-amber-700" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800">
                              {cp.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {cp.discountDisplay}
                            </span>
                            {cp.isCollected && (
                              <span className="text-[10px] font-bold text-[#556B2F]">
                                ✓ ในกระเป๋าคุณ
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-neutral-900 mt-1 truncate">
                            {cp.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                            {cp.terms || cp.subtitle}
                          </p>
                          <p className="text-[10px] font-semibold text-emerald-700 mt-1">
                            ✓ {cp.evaluation.displayText} · ขั้นต่ำ ฿{cp.minSpend.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#556B2F] text-white flex items-center justify-center text-xs font-bold">
                            <Check size={14} />
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition"
                          >
                            เลือกใช้
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Ineligible Coupons List */}
          {ineligibleCoupons.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                คูปองที่ไม่ตรงตามเงื่อนไขยอดซื้อ ({ineligibleCoupons.length})
              </h4>
              <div className="space-y-2.5 opacity-60">
                {ineligibleCoupons.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/70"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-500">
                          {cp.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
                          {cp.discountDisplay}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-neutral-700 mt-1">
                        {cp.title}
                      </p>
                      <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                        {cp.evaluation.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex-shrink-0">
          <div>
            {appliedCoupon ? (
              <span className="text-xs font-bold text-[#556B2F]">
                ✓ กำลังใช้คูปอง: {appliedCoupon.code}
              </span>
            ) : (
              <span className="text-xs text-neutral-400">
                ยังไม่ได้เลือกคูปองส่วนลด
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {appliedCoupon && (
              <button
                type="button"
                onClick={handleClearCoupon}
                className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition cursor-pointer"
              >
                ยกเลิกคูปอง
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-earth-dark text-white hover:bg-earth-olive text-xs font-bold transition cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
