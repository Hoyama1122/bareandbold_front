import React, { useState, useEffect } from "react";
import { INK, CREAM, BORDER, MUTED, OLIVE, OLIVE_DEEP, WHITE, PROVINCES } from "./constants";
import { addressService } from "@/services/address.service";
import { Home, Briefcase, Plus, Check, X, MapPin, Phone, User as UserIcon } from "lucide-react";

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
      <span style={{ color: INK }} className="font-semibold text-xs text-zinc-700">
        {label}
        {required && <span style={{ color: OLIVE_DEEP }}> *</span>}
      </span>
      <input
        {...props}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all shadow-2xs"
        style={{ border: `1px solid ${BORDER}`, background: WHITE }}
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

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  const filteredOptions = options.filter(opt =>
    (opt || "").toLowerCase().includes(search.toLowerCase())
  );

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
      <span style={{ color: INK }} className="font-semibold text-xs text-zinc-700">
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
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-60 shadow-2xs"
          style={{
            border: `1px solid ${isOpen ? OLIVE : BORDER}`,
            background: WHITE,
            color: INK
          }}
          autoComplete="off"
          required={required}
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && options.length > 0 && (
        <ul
          className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] max-h-60 overflow-y-auto rounded-xl shadow-lg border text-sm transition-all duration-200"
          style={{
            background: WHITE,
            borderColor: BORDER,
            boxShadow: "0 10px 25px -5px rgba(43, 33, 24, 0.08)"
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
  onAddressSelect,
  setCustomAddressString,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLineVal, setAddressLineVal] = useState("");
  const [notesVal, setNotesVal] = useState("");

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // New Address Form State (matches mockup)
  const [newLabel, setNewLabel] = useState("ที่บ้าน");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProvince, setNewProvince] = useState("");
  const [newAmphoe, setNewAmphoe] = useState("");
  const [newTambon, setNewTambon] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newNote, setNewNote] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  // Fetch Saved Addresses on Mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const addresses = await addressService.getAddresses();
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        applySavedAddress(defaultAddr);
      } else {
        setShowAddModal(true);
      }
    } catch (err) {
      console.error("Failed to load saved addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhone(profile.phone ? formatPhoneNumber(profile.phone) : "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const applySavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShowAddModal(false);

    // Split name if possible
    const nameParts = (addr.recipientName || "").trim().split(" ");
    const fName = nameParts[0] || "";
    const lName = nameParts.slice(1).join(" ") || "";

    setFirstName(fName);
    setLastName(lName);
    setPhone(formatPhoneNumber(addr.phone || ""));
    setAddressLineVal(addr.addressLine || "");
    setNotesVal(addr.note || "");

    // Set cascading location
    if (addr.province) handleProvinceChange(addr.province);
    if (addr.amphoe) handleDistrictChange(addr.amphoe);
    if (addr.tambon) handleSubDistrictChange(addr.tambon);
    if (addr.postalCode) handleZipCodeChange(addr.postalCode);

    if (onAddressSelect) {
      onAddressSelect(addr);
    }
  };

  // Cascading Address Filtering for New Address Form
  const [newAvailableDistricts, setNewAvailableDistricts] = useState([]);
  const [newAvailableSubDistricts, setNewAvailableSubDistricts] = useState([]);
  const [newAvailableZipCodes, setNewAvailableZipCodes] = useState([]);

  const handleNewProvinceChange = (provVal) => {
    setNewProvince(provVal);
    setNewAmphoe("");
    setNewTambon("");
    setNewPostalCode("");
    setNewAvailableSubDistricts([]);
    setNewAvailableZipCodes([]);

    if (!provVal) {
      setNewAvailableDistricts([]);
      return;
    }

    import("../../data/thailand-address.json").then((mod) => {
      const thailandAddresses = mod.default;
      const districts = [];
      const districtIds = new Set();
      thailandAddresses.forEach((item) => {
        const hasProv = item.provinceList?.some((p) => p.provinceName === provVal);
        if (hasProv) {
          item.districtList?.forEach((d) => {
            if (!districtIds.has(d.districtId)) {
              districtIds.add(d.districtId);
              districts.push(d.districtName);
            }
          });
        }
      });
      districts.sort();
      setNewAvailableDistricts(districts);
    });
  };

  const handleNewAmphoeChange = (amphoeVal) => {
    setNewAmphoe(amphoeVal);
    setNewTambon("");
    setNewPostalCode("");
    setNewAvailableZipCodes([]);

    if (!amphoeVal) {
      setNewAvailableSubDistricts([]);
      return;
    }

    import("../../data/thailand-address.json").then((mod) => {
      const thailandAddresses = mod.default;
      const subdistricts = [];
      const subdistrictIds = new Set();
      thailandAddresses.forEach((item) => {
        const hasProv = item.provinceList?.some((p) => p.provinceName === newProvince);
        const hasDist = item.districtList?.some((d) => d.districtName === amphoeVal);
        if (hasProv && hasDist) {
          const distMatch = item.districtList?.find((d) => d.districtName === amphoeVal);
          item.subDistrictList?.forEach((sd) => {
            if (distMatch && sd.districtId === distMatch.districtId) {
              if (!subdistrictIds.has(sd.subDistrictId)) {
                subdistrictIds.add(sd.subDistrictId);
                subdistricts.push(sd.subDistrictName);
              }
            }
          });
        }
      });
      subdistricts.sort();
      setNewAvailableSubDistricts(subdistricts);
    });
  };

  const handleNewTambonChange = (tambonVal) => {
    setNewTambon(tambonVal);
    setNewPostalCode("");

    if (!tambonVal) {
      setNewAvailableZipCodes([]);
      return;
    }

    import("../../data/thailand-address.json").then((mod) => {
      const thailandAddresses = mod.default;
      const zipcodes = [];
      thailandAddresses.forEach((item) => {
        const hasProv = item.provinceList?.some((p) => p.provinceName === newProvince);
        const hasDist = item.districtList?.some((d) => d.districtName === newAmphoe);
        const hasSub = item.subDistrictList?.some((sd) => sd.subDistrictName === tambonVal);
        if (hasProv && hasDist && hasSub) {
          if (!zipcodes.includes(item.zipCode)) {
            zipcodes.push(item.zipCode);
          }
        }
      });
      setNewAvailableZipCodes(zipcodes);
      if (zipcodes.length === 1) {
        setNewPostalCode(zipcodes[0]);
      }
    });
  };

  const handleNewPostalCodeChange = (zipVal) => {
    setNewPostalCode(zipVal);
    if (zipVal && zipVal.length === 5) {
      import("../../data/thailand-address.json").then((mod) => {
        const thailandAddresses = mod.default;
        const matches = thailandAddresses.filter(item => item.zipCode === zipVal);
        if (matches.length > 0) {
          const match = matches[0];
          const prov = match.provinceList?.[0]?.provinceName || "";
          if (prov && !newProvince) {
            handleNewProvinceChange(prov);
          }
        }
      });
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newRecipientName || !newPhone || !newProvince || !newAddressLine || !newPostalCode) {
      alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }

    setSavingAddress(true);
    try {
      const created = await addressService.createAddress({
        label: newLabel,
        recipientName: newRecipientName,
        phone: newPhone,
        province: newProvince,
        amphoe: newAmphoe,
        tambon: newTambon,
        addressLine: newAddressLine,
        postalCode: newPostalCode,
        note: newNote,
        isDefault: savedAddresses.length === 0
      });

      // Reload addresses and select newly created one
      const updatedList = await addressService.getAddresses();
      setSavedAddresses(updatedList);
      applySavedAddress(created);

      // Reset form
      setNewRecipientName("");
      setNewPhone("");
      setNewProvince("");
      setNewAmphoe("");
      setNewTambon("");
      setNewAddressLine("");
      setNewPostalCode("");
      setNewNote("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Save address error:", err);
      alert(err.message || "ไม่สามารถบันทึกที่อยู่ได้");
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <section className="rounded-2xl p-6 shadow-xs transition-all" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="kanit text-lg font-bold" style={{ color: INK }}>ที่อยู่สำหรับจัดส่ง</h2>
          <p className="text-xs" style={{ color: MUTED }}>
            เลือกที่อยู่จัดส่งที่บันทึกไว้ หรือเพิ่มที่อยู่ใหม่
          </p>
        </div>
        {savedAddresses.length > 0 && !showAddModal && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 cursor-pointer shadow-2xs"
            style={{ background: "#7a5b46" }}
          >
            <Plus size={14} />
            <span>เพิ่มที่อยู่ใหม่</span>
          </button>
        )}
      </div>

      {/* 1. Saved Address Selector Cards */}
      {savedAddresses.length > 0 && !showAddModal && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {savedAddresses.map((addr, idx) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => applySavedAddress(addr)}
                className={`p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7a5b46] bg-[#7a5b46]/5 shadow-sm ring-1 ring-[#7a5b46]"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-[#7a5b46] bg-[#7a5b46]/10 border border-[#7a5b46]/20">
                      {addr.label === "ที่ทำงาน" ? <Briefcase size={12} /> : <Home size={12} />}
                      {addr.label || `ที่อยู่ ${idx + 1}`}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#7a5b46] text-white flex items-center justify-center text-xs">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                    <UserIcon size={13} className="text-zinc-400" />
                    {addr.recipientName}
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                    <Phone size={11} className="text-zinc-400" />
                    {formatPhoneNumber(addr.phone)}
                  </p>
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-anuphan flex items-start gap-1">
                    <MapPin size={13} className="text-zinc-400 shrink-0 mt-0.5" />
                    <span>
                      {addr.addressLine} {addr.tambon ? `ต.${addr.tambon}` : ""} {addr.amphoe ? `อ.${addr.amphoe}` : ""} {addr.province} {addr.postalCode}
                    </span>
                  </p>
                  {addr.note && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/50 mt-2 italic">
                      หมายเหตุ: {addr.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Add New Address Form Modal / Box (Exact Mockup Design) */}
      {showAddModal && (
        <div className="rounded-2xl p-6 mb-6 transition-all shadow-xs border" style={{ background: "#FAF7F2", borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="kanit text-base font-bold text-zinc-800">เพิ่มที่อยู่จัดส่งใหม่</h3>
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* บันทึกเป็น */}
            <div>
              <span className="block font-semibold text-xs text-zinc-700 mb-2">บันทึกเป็น</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewLabel("ที่บ้าน")}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    newLabel === "ที่บ้าน"
                      ? "bg-[#5c4033] text-white border-[#5c4033]"
                      : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <Home size={15} />
                  <span>ที่บ้าน</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewLabel("ที่ทำงาน")}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    newLabel === "ที่ทำงาน"
                      ? "bg-[#5c4033] text-white border-[#5c4033]"
                      : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <Briefcase size={15} />
                  <span>ที่ทำงาน</span>
                </button>
              </div>
            </div>

            {/* ชื่อผู้รับ + เบอร์โทรศัพท์ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="ชื่อผู้รับ"
                required
                placeholder="ชื่อ-นามสกุลผู้รับพัสดุ"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
              />
              <Field
                label="เบอร์โทรศัพท์"
                required
                placeholder="0XX-XXX-XXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(formatPhoneNumber(e.target.value))}
              />
            </div>

            {/* จังหวัด */}
            <SearchableSelect
              label="จังหวัด"
              required
              name="newProvince"
              value={newProvince}
              onChange={handleNewProvinceChange}
              options={PROVINCES}
              placeholder="เลือกจังหวัด"
            />

            {/* เขต / อำเภอ */}
            <SearchableSelect
              label="เขต / อำเภอ"
              required
              name="newAmphoe"
              value={newAmphoe}
              onChange={handleNewAmphoeChange}
              options={newAvailableDistricts}
              placeholder={newProvince ? "พิมพ์หรือเลือกเขต/อำเภอ" : "กรุณาเลือกจังหวัดก่อน"}
              disabled={!newProvince}
            />

            {/* แขวง / ตำบล */}
            <SearchableSelect
              label="แขวง / ตำบล"
              required
              name="newTambon"
              value={newTambon}
              onChange={handleNewTambonChange}
              options={newAvailableSubDistricts}
              placeholder={newAmphoe ? "พิมพ์หรือเลือกแขวง/ตำบล" : "กรุณาเลือกอำเภอก่อน"}
              disabled={!newAmphoe}
            />

            {/* ที่อยู่ */}
            <Field
              label="ที่อยู่"
              required
              placeholder="บ้านเลขที่ ซอย ถนน"
              value={newAddressLine}
              onChange={(e) => setNewAddressLine(e.target.value)}
            />

            {/* รหัสไปรษณีย์ */}
            <SearchableSelect
              label="รหัสไปรษณีย์"
              required
              name="newPostalCode"
              value={newPostalCode}
              onChange={handleNewPostalCodeChange}
              options={newAvailableZipCodes}
              placeholder="พิมพ์หรือเลือกรหัสไปรษณีย์"
            />

            {/* หมายเหตุผู้จัดส่ง */}
            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-xs text-zinc-700">หมายเหตุผู้จัดส่ง</span>
              <textarea
                rows={2}
                placeholder="เช่น ฝากไว้กับ รปภ. หรือโทรก่อนส่ง"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all shadow-2xs resize-none"
                style={{ border: `1px solid ${BORDER}`, background: WHITE }}
              />
            </div>

            {/* Action Buttons (✕ ยกเลิก , ✓ บันทึกที่อยู่นี้) */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200/60">
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-700 border border-zinc-300 bg-white hover:bg-zinc-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  <X size={14} />
                  <span>ยกเลิก</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveNewAddress}
                disabled={savingAddress}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                style={{ background: "#5c4033" }}
              >
                <Check size={14} />
                <span>{savingAddress ? "กำลังบันทึก..." : "บันทึกที่อยู่นี้"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields display for current order (hidden or sync) */}
      <div className="hidden">
        <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input name="address" value={addressLineVal} onChange={(e) => setAddressLineVal(e.target.value)} />
      </div>
    </section>
  );
}
