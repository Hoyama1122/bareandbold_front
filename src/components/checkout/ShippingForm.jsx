import React from "react";
import { INK, CREAM, BORDER, MUTED, OLIVE, OLIVE_DEEP, WHITE, PROVINCES } from "./constants";

export function Field({ label, span2, required, ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${span2 ? "sm:col-span-2" : ""}`}>
      <span style={{ color: INK }}>
        {label}
        {required && <span style={{ color: OLIVE_DEEP }}> *</span>}
      </span>
      <input
        {...props}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{ border: `1px solid ${BORDER}`, background: CREAM }}
        onFocus={(e) => (e.target.style.borderColor = OLIVE)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </label>
  );
}

export default function ShippingForm({
  province,
  district,
  subDistrict,
  zipCode,
  availableDistricts,
  availableSubDistricts,
  availableZipCodes,
  handleProvinceChange,
  handleDistrictChange,
  handleSubDistrictChange,
  handleZipCodeChange,
  saveInfo,
  setSaveInfo,
}) {
  return (
    <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
      <h2 className="kanit text-lg font-semibold mb-1">ที่อยู่สำหรับจัดส่ง</h2>
      <p className="text-sm mb-5" style={{ color: MUTED }}>
        กรอกข้อมูลผู้รับให้ครบถ้วนเพื่อความรวดเร็วในการจัดส่ง
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="firstName" required label="ชื่อ" placeholder="กรอกชื่อจริง" />
        <Field name="lastName" required label="นามสกุล" placeholder="กรอกนามสกุล" />
        <Field name="phone" required label="เบอร์โทรศัพท์" placeholder="08X-XXX-XXXX" />
        <Field name="email" required label="อีเมล" placeholder="name@email.com" type="email" />
        <Field name="address" span2 required label="ที่อยู่" placeholder="บ้านเลขที่ ซอย ถนน" />
        
        <label className="flex flex-col gap-1.5 text-sm">
          <span>จังหวัด <span style={{ color: OLIVE_DEEP }}> *</span></span>
          <select
            value={province}
            name="province"
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
            required
          >
            <option value="">เลือกจังหวัด</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span>เขต / อำเภอ <span style={{ color: OLIVE_DEEP }}> *</span></span>
          <select
            value={district}
            name="district"
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!province}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none disabled:opacity-60"
            style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
            required
          >
            <option value="">{province ? "เลือกเขตหรืออำเภอ" : "กรุณาเลือกจังหวัดก่อน"}</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span>แขวง / ตำบล <span style={{ color: OLIVE_DEEP }}> *</span></span>
          <select
            value={subDistrict}
            name="subDistrict"
            onChange={(e) => handleSubDistrictChange(e.target.value)}
            disabled={!district}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none disabled:opacity-60"
            style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
            required
          >
            <option value="">{district ? "เลือกแขวงหรือตำบล" : "กรุณาเลือกอำเภอก่อน"}</option>
            {availableSubDistricts.map((sd) => (
              <option key={sd} value={sd}>{sd}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span>รหัสไปรษณีย์ <span style={{ color: OLIVE_DEEP }}> *</span></span>
          <select
            value={zipCode}
            name="zipCode"
            onChange={(e) => handleZipCodeChange(e.target.value)}
            disabled={!subDistrict}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none disabled:opacity-60"
            style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
            required
          >
            <option value="">{subDistrict ? "เลือกรหัสไปรษณีย์" : "กรุณาเลือกตำบลก่อน"}</option>
            {availableZipCodes.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </label>

        <Field name="notes" span2 label="หมายเหตุถึงผู้จัดส่ง (ถ้ามี)" placeholder="เช่น ฝากไว้ที่นิติบุคคล" />
      </div>

      <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={saveInfo}
          onChange={(e) => setSaveInfo(e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: OLIVE }}
        />
        <span style={{ color: MUTED }}>บันทึกข้อมูลนี้สำหรับการสั่งซื้อครั้งถัดไป</span>
      </label>
    </section>
  );
}
