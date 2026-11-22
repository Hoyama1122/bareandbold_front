"use client";

import React from "react";
import { Lock, Tag, X, ChevronRight, Check, Ticket } from "lucide-react";
import { INK, CREAM, BORDER, MUTED, OLIVE, WHITE } from "./constants";

const FALLBACK_IMAGE = "/images/placeholder.jpg";

export default function OrderSummary({
  orderItems,
  itemCount,
  subtotal,
  baseShipping = 50,
  shipping = 0,
  total,
  discountAmount = 0,
  shippingDiscount = 0,
  appliedCoupon = null,
  onOpenCouponModal,
  onRemoveCoupon,
  baht,
  loading,
  disabled = false,
}) {
  return (
    <div
      className="rounded-xl p-6 sticky top-6 flex flex-col gap-5 font-anuphan"
      style={{ background: WHITE, border: `1px solid ${BORDER}` }}
    >
      <h2 className="kanit text-lg font-semibold">คำสั่งซื้อของคุณ</h2>

      {/* Items list */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {orderItems.map((it, idx) => {
          const itemImg =
            it.image && typeof it.image === "string" && it.image.trim() !== ""
              ? it.image
              : it.imageUrl && typeof it.imageUrl === "string" && it.imageUrl.trim() !== ""
              ? it.imageUrl
              : FALLBACK_IMAGE;

          return (
            <div key={it.id || `order-item-${idx}`} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src={itemImg}
                  alt={it.name || "Item image"}
                  className="w-12 h-14 rounded-md object-cover"
                />
                <span
                  className="absolute -top-1.5 -right-1.5 text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: OLIVE, color: WHITE }}
                >
                  {it.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#556B2F] mb-0.5 truncate">
                  {it.shopName || it.product?.shop?.name || "Bare & Bold"}
                </p>
                <p className="text-sm truncate font-semibold">{it.name}</p>
                {(it.size || it.material) && (
                  <p className="text-[11px] font-medium" style={{ color: MUTED }}>
                    {it.size ? `ขนาด: ${it.size}` : ""}
                    {it.size && it.material ? " | " : ""}
                    {it.material ? `วัสดุ: ${it.material}` : ""}
                  </p>
                )}
                {it.accessories && it.accessories.length > 0 && (
                  <p className="text-[10px] italic font-medium mt-0.5 truncate" style={{ color: MUTED }}>
                    ของตกแต่ง: {it.accessories.join(", ")}
                  </p>
                )}
              </div>
              <p className="text-sm font-medium flex-shrink-0">฿{baht(it.price * it.quantity)}</p>
            </div>
          );
        })}
      </div>

      {/* Coupon Selection Card */}
      <div className="pt-2">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#556B2F]/30 bg-[#556B2F]/10 text-[#556B2F]">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Ticket size={18} className="shrink-0 text-[#556B2F]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold bg-[#556B2F] text-white px-2 py-0.5 rounded-md">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-xs font-bold truncate">
                    {appliedCoupon.discountDisplay}
                  </span>
                </div>
                <p className="text-[11px] text-[#556B2F]/80 mt-0.5 truncate">
                  {appliedCoupon.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <button
                type="button"
                onClick={onOpenCouponModal}
                className="text-xs font-bold text-[#556B2F] underline hover:opacity-80 cursor-pointer"
              >
                เปลี่ยน
              </button>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="w-6 h-6 rounded-full bg-white text-rose-600 border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                title="ยกเลิกการใช้คูปอง"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenCouponModal}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-dashed border-[#7a5b46]/50 bg-[#7a5b46]/5 hover:bg-[#7a5b46]/10 text-left transition cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Ticket size={20} className="shrink-0 text-[#7a5b46]" />
              <div>
                <p className="text-xs font-bold text-[#7a5b46] group-hover:underline">
                  เลือกคูปองส่วนลด / โค้ดส่งฟรี
                </p>
                <p className="text-[11px] text-neutral-500">
                  คลิกเพื่อดูและเลือกคูปองที่ใช้ได้
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#7a5b46] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              เลือกคูปอง &gt;
            </span>
          </button>
        )}
      </div>

      {/* Order Pricing Breakdown */}
      <div className="flex flex-col gap-2.5 text-sm pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        {/* Subtotal */}
        <div className="flex justify-between">
          <span style={{ color: MUTED }}>ยอดรวมสินค้า ({itemCount} ชิ้น)</span>
          <span className="font-medium">฿{baht(subtotal)}</span>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between items-center">
          <span style={{ color: MUTED }}>ค่าจัดส่ง</span>
          <span>
            {shippingDiscount > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="line-through text-neutral-400 text-xs">฿{baht(baseShipping)}</span>
                <span className="text-emerald-700 font-bold">ฟรี</span>
              </span>
            ) : shipping === 0 ? (
              <span className="text-emerald-700 font-bold">ฟรี</span>
            ) : (
              `฿${baht(shipping)}`
            )}
          </span>
        </div>

        {/* Coupon Discount on Items */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-[#556B2F] font-bold">
            <span className="flex items-center gap-1">
              <span>ส่วนลดคูปอง</span>
              {appliedCoupon && (
                <span className="font-mono text-xs font-normal">({appliedCoupon.code})</span>
              )}
            </span>
            <span>-฿{baht(discountAmount)}</span>
          </div>
        )}

        {/* Shipping Coupon Discount Line */}
        {shippingDiscount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold">
            <span className="flex items-center gap-1">
              <span>ส่วนลดค่าจัดส่ง</span>
              {appliedCoupon?.category === "shipping" && (
                <span className="font-mono text-xs font-normal">({appliedCoupon.code})</span>
              )}
            </span>
            <span>-฿{baht(shippingDiscount)}</span>
          </div>
        )}
      </div>

      {/* Total Amount to Pay */}
      <div className="flex justify-between items-end pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div>
          <span className="kanit font-semibold block text-base">ยอดชำระทั้งหมด</span>
          {appliedCoupon && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#556B2F] font-bold block mt-0.5">
              <Check size={12} /> ประหยัดได้ ฿{baht(discountAmount + shippingDiscount)}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="kanit text-2xl font-bold text-earth-dark">
            ฿{baht(total)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full py-3.5 rounded-xl font-bold kanit disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] select-none text-sm cursor-pointer shadow-sm hover:opacity-95"
        style={{ background: INK, color: CREAM }}
      >
        {disabled ? "ไม่สามารถสั่งซื้อสินค้าของร้านตนเองได้" : (loading ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ")}
      </button>

      <p className="text-xs text-center -mt-2 flex items-center justify-center gap-1.5" style={{ color: MUTED }}>
        <Lock size={11} />
        ข้อมูลของคุณได้รับการเข้ารหัสอย่างปลอดภัย
      </p>
    </div>
  );
}
