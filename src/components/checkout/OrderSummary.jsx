import React from "react";
import { Lock } from "lucide-react";
import { INK, CREAM, BORDER, MUTED, OLIVE, WHITE } from "./constants";

export default function OrderSummary({ orderItems, itemCount, subtotal, shipping, total, baht }) {
  return (
    <div className="rounded-xl p-6 sticky top-6 flex flex-col gap-5" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
      <h2 className="kanit text-lg font-semibold">คำสั่งซื้อของคุณ</h2>
      <div className="flex flex-col gap-3">
        {orderItems.map((it) => (
          <div key={it.id} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={it.image}
                alt={it.name}
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
              <p className="text-sm truncate">{it.name}</p>
              <p className="text-xs" style={{ color: MUTED }}>{it.variant || ""}</p>
            </div>
            <p className="text-sm font-medium flex-shrink-0">฿{baht(it.price * it.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 text-sm pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="flex justify-between">
          <span style={{ color: MUTED }}>ยอดรวมสินค้า ({itemCount} ชิ้น)</span>
          <span>฿{baht(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: MUTED }}>ค่าจัดส่ง</span>
          <span>{shipping === 0 ? "ฟรี" : `฿${baht(shipping)}`}</span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
        <span className="kanit font-semibold">ยอดชำระทั้งหมด</span>
        <span className="kanit text-xl font-semibold">฿{baht(total)}</span>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg font-medium kanit" style={{ background: INK, color: CREAM }}>
        ยืนยันคำสั่งซื้อ
      </button>
      <p className="text-xs text-center -mt-2 flex items-center justify-center gap-1.5" style={{ color: MUTED }}>
        <Lock size={11} />
        ข้อมูลของคุณได้รับการเข้ารหัสอย่างปลอดภัย
      </p>
    </div>
  );
}
