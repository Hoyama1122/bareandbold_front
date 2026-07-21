import React, { useState, useEffect } from "react";
import { INK, CREAM, BORDER, MUTED, OLIVE, OLIVE_DEEP, WHITE, PROVINCES } from "./constants";

const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

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

function SearchableSelect({
  label,
  required,
  value,
  name,
  onChange,
  options = [],
  placeholder,
  disabled
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = React.useRef(null);

  // Sync search input with outer value when not typing
  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  // Filter options based on search text
  const filteredOptions = options.filter(opt =>
    (opt || "").toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 text-sm relative">
      <span style={{ color: INK }}>
        {label}
        {required && <span style={{ color: OLIVE_DEEP }}> *</span>}
      </span>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={search}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            setIsOpen(true);
            onChange(val);
          }}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all disabled:opacity-60"
          style={{
            border: `1px solid ${isOpen ? OLIVE : BORDER}`,
            background: CREAM,
            color: INK
          }}
          autoComplete="off"
          required={required}
        />
        {/* Toggle Arrow */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Custom Dropdown Menu */}
      {isOpen && !disabled && options.length > 0 && (
        <ul
          className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] max-h-60 overflow-y-auto rounded-xl shadow-lg border text-sm transition-all duration-200"
          style={{
            background: WHITE,
            borderColor: BORDER,
            boxShadow: "0 10px 25px -5px rgba(43, 33, 24, 0.08), 0 8px 10px -6px rgba(43, 33, 24, 0.08)"
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setSearch(opt);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 cursor-pointer transition-colors text-left flex items-center justify-between"
                style={{
                  color: INK,
                  background: value === opt ? `${CREAM}80` : "transparent"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = CREAM;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = value === opt ? `${CREAM}80` : "transparent";
                }}
              >
                <span className={value === opt ? "font-semibold" : ""}>{opt}</span>
                {value === opt && (
                  <span style={{ color: OLIVE }}>✓</span>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-zinc-400 text-center font-medium italic">
              ไม่พบข้อมูลที่ค้นหา
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function ShippingForm({
  profile,
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhone(profile.phone ? formatPhoneNumber(profile.phone) : "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
      <h2 className="kanit text-lg font-semibold mb-1">ที่อยู่สำหรับจัดส่ง</h2>
      <p className="text-sm mb-5" style={{ color: MUTED }}>
        กรอกข้อมูลผู้รับให้ครบถ้วนเพื่อความรวดเร็วในการจัดส่ง
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field 
          name="firstName" 
          required 
          label="ชื่อ" 
          placeholder="กรอกชื่อจริง" 
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Field 
          name="lastName" 
          required 
          label="นามสกุล" 
          placeholder="กรอกนามสกุล" 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Field 
          name="phone" 
          required 
          label="เบอร์โทรศัพท์" 
          placeholder="08X-XXX-XXXX" 
          value={phone}
          onChange={handlePhoneChange}
        />
        <Field 
          name="email" 
          required 
          label="อีเมล" 
          placeholder="name@email.com" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field name="address" span2 required label="ที่อยู่" placeholder="บ้านเลขที่ ซอย ถนน" />
        
        <SearchableSelect
          label="จังหวัด"
          required
          name="province"
          value={province}
          onChange={handleProvinceChange}
          options={PROVINCES}
          placeholder="พิมพ์หรือเลือกจังหวัด"
        />

        <SearchableSelect
          label="เขต / อำเภอ"
          required
          name="district"
          value={district}
          onChange={handleDistrictChange}
          options={availableDistricts}
          placeholder={province ? "พิมพ์หรือเลือกเขต/อำเภอ" : "กรุณาเลือกจังหวัดก่อน"}
          disabled={!province}
        />

        <SearchableSelect
          label="แขวง / ตำบล"
          required
          name="subDistrict"
          value={subDistrict}
          onChange={handleSubDistrictChange}
          options={availableSubDistricts}
          placeholder={district ? "พิมพ์หรือเลือกแขวง/ตำบล" : "กรุณาเลือกอำเภอก่อน"}
          disabled={!district}
        />

        <SearchableSelect
          label="รหัสไปรษณีย์"
          required
          name="zipCode"
          value={zipCode}
          onChange={handleZipCodeChange}
          options={availableZipCodes}
          placeholder="พิมพ์หรือเลือกรหัสไปรษณีย์"
        />

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
