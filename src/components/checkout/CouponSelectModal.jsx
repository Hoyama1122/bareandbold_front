"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Tag, Check, X, ArrowRight, AlertCircle, Sparkles, Percent, Truck, Loader2, Ticket } from "lucide-react";
import { voucherService } from "@/services/voucher.service";

export default function CouponSelectModal({
  isOpen,
  onClose,
  subtotal = 0,
  baseShipping = 50,
  orderItems = [],
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const [typedCode, setTypedCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(appliedCoupon);

  const quoteItems = useMemo(() => {
    return (orderItems || []).map((it) => ({
      productId: it.productId || it.id,
      quantity: it.quantity || 1,
      accessories: Array.isArray(it.accessories) ? it.accessories : [],
    }));
  }, [orderItems]);

  useEffect(() => {
    setSelectedCoupon(appliedCoupon);
  }, [appliedCoupon]);

  const loadVouchers = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      // ดึงคูปองของผู้ใช้ หรือคูปอง Public ทั้งหมด
      const [myRes, pubRes] = await Promise.allSettled([
        voucherService.getMyVouchers("ACTIVE"),
        voucherService.getPublicVouchers(),
      ]);

      const list = [];
      const seen = new Set();

      if (myRes.status === "fulfilled" && myRes.value?.success && Array.isArray(myRes.value.vouchers)) {
        for (const uv of myRes.value.vouchers) {
          const v = uv.voucher || uv;
          if (v && !seen.has(v.code)) {
            seen.add(v.code);
            list.push({ ...v, isCollected: true });
          }
        }
      }

      if (pubRes.status === "fulfilled" && pubRes.value?.success && Array.isArray(pubRes.value.vouchers)) {
        for (const v of pubRes.value.vouchers) {
          if (v && !seen.has(v.code)) {
            seen.add(v.code);
            list.push(v);
          }
        }
      }

      setVouchers(list);
    } catch (err) {
      console.error("Load vouchers modal error:", err);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  if (!isOpen) return null;

  // ตรวจสอบความถูกต้องตามประเภทร้านค้า และ minSpend
  const evaluatedVouchers = vouchers.map((v) => {
    const minSpend = Number(v.minSpend || 0);
    let isEligible = true;
    let ineligibleReason = "";
    let targetSubtotal = subtotal;

    if (v.type === "SHOP") {
      // คูปองร้านค้า: ต้องมีสินค้าจากร้านนี้ในคำสั่งซื้อ
      const shopItems = (orderItems || []).filter((it) => {
        const itemShopId = it.shopId || it.product?.shopId || it.product?.shop?.id;
        return itemShopId && v.shopId && String(itemShopId) === String(v.shopId);
      });

      if (shopItems.length === 0) {
        isEligible = false;
        ineligibleReason = `ใช้ได้เฉพาะสินค้าจากร้าน "${v.shop?.name || "ที่กำหนด"}" (ไม่มีสินค้าจากร้านนี้ในคำสั่งซื้อ)`;
      } else {
        const shopSubtotal = shopItems.reduce(
          (sum, it) => sum + Number(it.price || 0) * (it.quantity || 1),
          0,
        );
        targetSubtotal = shopSubtotal;
        if (shopSubtotal < minSpend) {
          isEligible = false;
          ineligibleReason = `ยอดสินค้าของร้าน "${v.shop?.name || ""}" ยังไม่ถึงขั้นต่ำ ฿${minSpend.toLocaleString()} (ขาดอีก ฿${(minSpend - shopSubtotal).toLocaleString()})`;
        }
      }
    } else {
      // คูปองส่วนลดแพลตฟอร์ม หรือ คูปองส่งฟรี
      if (subtotal < minSpend) {
        isEligible = false;
        ineligibleReason = `ยอดซื้อยังไม่ถึงขั้นต่ำ ฿${minSpend.toLocaleString()} (ขาดอีก ฿${(minSpend - subtotal).toLocaleString()})`;
      }
    }

    let discountPreview = 0;
    if (v.discountType === "PERCENT") {
      const calc = (targetSubtotal * Number(v.discountValue)) / 100;
      discountPreview = v.maxDiscount ? Math.min(calc, Number(v.maxDiscount)) : calc;
    } else {
      discountPreview = Number(v.discountValue);
    }

    return {
      ...v,
      isEligible,
      ineligibleReason,
      discountPreview,
    };
  });

  const eligibleCoupons = evaluatedVouchers.filter((v) => v.isEligible && v.status === "ACTIVE");
  const ineligibleCoupons = evaluatedVouchers.filter((v) => !v.isEligible || v.status !== "ACTIVE");

  const handleApplyTypedCode = async (e) => {
    e.preventDefault();
    setCodeError("");
    const cleanCode = typedCode.trim().toUpperCase();
    if (!cleanCode) return;

    try {
      setQuoting(true);
      const matched = vouchers.find((v) => v.code === cleanCode);
      const res = await voucherService.quoteVouchers({
        items: quoteItems,
        code: cleanCode,
        platformCode: !matched || matched.type === "PLATFORM" ? cleanCode : undefined,
        shippingCode: matched?.type === "SHIPPING" ? cleanCode : undefined,
        shopCodes: matched?.type === "SHOP" ? [cleanCode] : undefined,
      });

      if (!res.success) {
        throw new Error(res.error || "ไม่สามารถใช้งานโค้ดนี้ได้");
      }

      if (res.quote?.rejectedVouchers?.length > 0) {
        throw new Error(res.quote.rejectedVouchers[0].reason || "โค้ดไม่ตรงตามเงื่อนไข");
      }

      const applied = res.quote?.appliedVouchers?.[0];
      if (!applied) {
        throw new Error("ยอดคำสั่งซื้อไม่ตรงตามเงื่อนไขของคูปองนี้");
      }

      const matchedVoucher = {
        ...(vouchers.find((v) => v.code === cleanCode) || {}),
        id: applied.id,
        code: applied.code,
        title: applied.title,
        type: applied.type,
        discountAmount: applied.discountAmount,
        discountDisplay: `ลด ฿${Number(applied.discountAmount).toLocaleString()}`,
      };

      setSelectedCoupon(matchedVoucher);
      onApplyCoupon(matchedVoucher, res.quote);
      setTypedCode("");
      onClose();
    } catch (err) {
      setCodeError(err.message || "ไม่พบโค้ดส่วนลดนี้ หรือโค้ดอาจหมดอายุแล้ว");
    } finally {
      setQuoting(false);
    }
  };

  const handleSelectCoupon = async (v) => {
    try {
      setQuoting(true);
      const res = await voucherService.quoteVouchers({
        items: quoteItems,
        code: v.code,
        platformCode: v.type === "PLATFORM" ? v.code : undefined,
        shippingCode: v.type === "SHIPPING" ? v.code : undefined,
        shopCodes: v.type === "SHOP" ? [v.code] : undefined,
      });

      if (res.success && res.quote?.appliedVouchers?.length > 0) {
        const applied = res.quote.appliedVouchers[0];
        const selected = {
          ...v,
          discountAmount: applied.discountAmount,
          discountDisplay: `ลด ฿${Number(applied.discountAmount).toLocaleString()}`,
        };
        setSelectedCoupon(selected);
        onApplyCoupon(selected, res.quote);
        onClose();
      } else {
        const reason = res.quote?.rejectedVouchers?.[0]?.reason || "ไม่สามารถใช้คูปองนี้ได้";
        alert(reason);
      }
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการคำนวณส่วนลดคูปอง");
    } finally {
      setQuoting(false);
    }
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
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition cursor-pointer"
            title="ปิด"
          >
            <X size={16} />
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
                placeholder="กรอกโค้ดส่วนลด เช่น WELCOME50, BB150"
                value={typedCode}
                onChange={(e) => setTypedCode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 uppercase focus:outline-hidden focus:border-earth-dark font-mono font-bold"
              />
              <button
                type="submit"
                disabled={!typedCode.trim() || quoting}
                className="px-5 py-2.5 rounded-xl bg-earth-dark hover:bg-earth-olive disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                {quoting ? <Loader2 size={13} className="animate-spin" /> : "ใช้งาน"}
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
                <Ticket size={18} className="shrink-0 text-[#556B2F]" />
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

            {loading ? (
              <div className="p-8 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-earth-olive" />
                <span>กำลังโหลดรายการคูปองจากระบบ...</span>
              </div>
            ) : eligibleCoupons.length === 0 ? (
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
                          {cp.type === "SHIPPING" ? (
                            <Truck size={18} className="text-emerald-700" />
                          ) : (
                            <Percent size={18} className="text-amber-700" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-extrabold text-earth-dark px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200">
                              {cp.code}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ลด ฿{Number(cp.discountPreview || 0).toLocaleString()}
                            </span>
                            {cp.type === "SHOP" && (
                              <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                ร้าน: {cp.shop?.name || "ร้านค้า"}
                              </span>
                            )}
                            {cp.type === "PLATFORM" && (
                              <span className="text-[10px] font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                ส่วนลดแพลตฟอร์ม
                              </span>
                            )}
                            {cp.type === "SHIPPING" && (
                              <span className="text-[10px] font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                ส่งฟรี
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-neutral-800 mt-1 truncate">
                            {cp.title}
                          </h5>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {Number(cp.minSpend || 0) > 0
                              ? `ขั้นต่ำ ฿${Number(cp.minSpend).toLocaleString()}`
                              : "ไม่มีขั้นต่ำ"}
                            {cp.endsAt ? ` · หมดเขต ${new Date(cp.endsAt).toLocaleDateString("th-TH")}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isSelected ? (
                          <span className="w-7 h-7 rounded-full bg-[#556B2F] text-white flex items-center justify-center">
                            <Check size={14} />
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                          >
                            ใช้คูปอง
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Ineligible Coupons */}
          {ineligibleCoupons.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                คูปองที่ไม่ตรงตามเงื่อนไข ({ineligibleCoupons.length})
              </h4>
              <div className="space-y-2 opacity-60">
                {ineligibleCoupons.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-neutral-500">
                          {cp.code}
                        </span>
                        <span className="text-[11px] text-neutral-400 truncate">
                          {cp.title}
                        </span>
                        {cp.type === "SHOP" && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            ร้าน: {cp.shop?.name || "ร้านค้า"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-rose-500 mt-0.5">
                        {cp.ineligibleReason ||
                          (subtotal < Number(cp.minSpend || 0)
                            ? `ยอดซื้อยังไม่ถึงขั้นต่ำ ฿${Number(cp.minSpend).toLocaleString()} (ขาดอีก ฿${(Number(cp.minSpend) - subtotal).toLocaleString()})`
                            : "คูปองไม่ร่วมรายการในขณะนี้")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
