import React from "react";
import { Check } from "lucide-react";
import { INK, CREAM, BORDER, MUTED, OLIVE_DEEP } from "./constants";

function StepDone({ label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: OLIVE_DEEP, color: "#fff" }}>
        <Check size={13} />
      </div>
      <span style={{ color: MUTED }}>{label}</span>
    </div>
  );
}

function StepActive({ label, num }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 kanit text-xs font-semibold" style={{ background: INK, color: CREAM }}>
        {num}
      </div>
      <span className="font-medium" style={{ color: INK }}>{label}</span>
    </div>
  );
}

function StepPending({ label, num }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
        {num}
      </div>
      <span style={{ color: MUTED }}>{label}</span>
    </div>
  );
}

function StepLine() {
  return <div className="flex-1 h-px max-w-10" style={{ background: BORDER }} />;
}

export default function CheckoutSteps({ currentStep = 2 }) {
  return (
    <div className="flex items-center gap-3 mb-8 text-sm">
      {currentStep > 1 ? <StepDone label="ตะกร้าสินค้า" /> : <StepActive num={1} label="ตะกร้าสินค้า" />}
      <StepLine />
      {currentStep > 2 ? (
        <StepDone label="ที่อยู่และชำระเงิน" />
      ) : currentStep === 2 ? (
        <StepActive num={2} label="ที่อยู่และชำระเงิน" />
      ) : (
        <StepPending num={2} label="ที่อยู่และชำระเงิน" />
      )}
      <StepLine />
      {currentStep > 3 ? (
        <StepDone label="ยืนยันคำสั่งซื้อ" />
      ) : currentStep === 3 ? (
        <StepActive num={3} label="ยืนยันคำสั่งซื้อ" />
      ) : (
        <StepPending num={3} label="ยืนยันคำสั่งซื้อ" />
      )}
    </div>
  );
}
