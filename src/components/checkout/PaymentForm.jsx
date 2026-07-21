import React from "react";
import { Check, CreditCard, Landmark, QrCode, Truck } from "lucide-react";
import { INK, CREAM, CREAM_DEEP, BORDER, MUTED, WHITE } from "./constants";
import { Field } from "./ShippingForm";

const PAYMENT_METHODS = [
  { id: "card", label: "บัตรเครดิต / เดบิต", desc: "Visa, Mastercard, JCB", icon: CreditCard },
  { id: "transfer", label: "โอนผ่านธนาคาร", desc: "แนบสลิปหลังชำระเงิน", icon: Landmark },
  { id: "promptpay", label: "พร้อมเพย์", desc: "สแกน QR เพื่อชำระเงิน", icon: QrCode },
  { id: "cod", label: "เก็บเงินปลายทาง", desc: "ชำระเงินเมื่อได้รับสินค้า", icon: Truck },
];

export default function PaymentForm({ payment, setPayment }) {
  return (
    <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
      <h2 className="kanit text-lg font-semibold mb-1">ช่องทางการชำระเงิน</h2>
      <p className="text-sm mb-5" style={{ color: MUTED }}>
        เลือกวิธีที่สะดวกที่สุดสำหรับคุณ
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((m) => {
          const Icon = m.icon;
          const active = payment === m.id;
          return (
            <button
              type="button"
              key={m.id}
              onClick={() => setPayment(m.id)}
              className="flex items-start gap-3 rounded-lg p-4 text-left transition-colors"
              style={{ border: `1.5px solid ${active ? INK : BORDER}`, background: active ? CREAM : WHITE }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: active ? INK : CREAM_DEEP, color: active ? CREAM : MUTED }}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>{m.desc}</p>
              </div>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9999,
                  border: `1.5px solid ${active ? INK : BORDER}`,
                  background: active ? INK : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {active && <Check size={11} color={CREAM} />}
              </div>
            </button>
          );
        })}
      </div>

      {payment === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <Field span2 required label="หมายเลขบัตร" placeholder="0000 0000 0000 0000" />
          <Field required label="วันหมดอายุ" placeholder="MM/YY" />
          <Field required label="CVV" placeholder="XXX" />
        </div>
      )}
      {payment === "promptpay" && (
        <div className="flex items-center gap-4 mt-5 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: CREAM_DEEP }}>
            <QrCode size={36} style={{ color: MUTED }} />
          </div>
          <p className="text-sm" style={{ color: MUTED }}>
            QR โค้ดจะปรากฏขึ้นหลังกดยืนยันคำสั่งซื้อ ใช้แอปธนาคารสแกนเพื่อชำระเงิน
          </p>
        </div>
      )}
    </section>
  );
}
