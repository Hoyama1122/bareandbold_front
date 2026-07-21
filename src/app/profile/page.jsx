"use client";

import React, { useState, useRef, useEffect } from "react";
import {Camera,Mail, Phone,User,MapPin,Lock,LogOut,Home,Briefcase,Eye,EyeOff,Star,Trash2,Pencil,Plus,Check,X,} from "lucide-react";
import SearchDropdown from "@/components/SearchDropdown";
import { provinces } from "@/data/provinces";

const Clover = ({ className = "w-4 h-4", color = "#B8935A" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g fill={color}>
      <circle cx="8" cy="8" r="4.2" />
      <circle cx="16" cy="8" r="4.2" />
      <circle cx="8" cy="16" r="4.2" />
      <circle cx="16" cy="16" r="4.2" />
    </g>
    <rect x="11.2" y="11.2" width="1.6" height="7" rx="0.8" fill={color} opacity="0.6" />
  </svg>
);

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap');";

function Toast({ message, show }) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className="flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm"
        style={{ background: "#402C22", color: "#F1E9DC" }}
      >
        <Check className="w-4 h-4" style={{ color: "#C9A66B" }} />
        {message}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <Clover className="w-5 h-5 mt-1.5 shrink-0" />
      <div>
        <h2
          className="text-2xl"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B231C", fontWeight: 600 }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "#8A7C6C" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#4A3F35" }}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs mt-1" style={{ color: "#A99A87" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  background: "#FFFFFF",
  border: "1px solid #E4D9C7",
  color: "#2B231C",
};

function TextInput(props) {
  return (
    <input
      {...props}
      style={inputStyle}
      className={
        "w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:border-transparent placeholder:text-[#B9AC99] " +
        (props.className || "")
      }
      onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #C9A66B55")}
      onBlur={(e) => (e.target.style.boxShadow = "none")}
    />
  );
}

function PrimaryButton({ children, onClick, type = "button", disabled, icon: Icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
      style={{ background: "#5C4033", color: "#FAF6F0" }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, danger }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-[#F1E9DC] active:scale-[0.98]"
      style={{
        borderColor: danger ? "#C4574B55" : "#E4D9C7",
        color: danger ? "#B03B2E" : "#4A3F35",
        background: "transparent",
      }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const notify = (message) => {
    setToast({ show: true, message });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast({ show: false, message: "" }), 2600);
  };

  const [avatar, setAvatar] = useState(
    "https://i.pinimg.com/736x/d7/95/c3/d795c373a0539e64c7ee69bb0af3c5c3.jpg"
  );
  const handleAvatarPick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

reader.onload = () => {
  setAvatar(reader.result);

  localStorage.setItem(
    "avatar",
    reader.result
  );
window.dispatchEvent(new Event("profileUpdated"));
  notify("เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว");
};

reader.readAsDataURL(file);
  };

  const [profileSaved, setProfileSaved] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [profile, setProfile] = useState(profileSaved);
  useEffect(() => {
  const savedProfile = localStorage.getItem("profile");

  if (savedProfile) {
    const data = JSON.parse(savedProfile);

    setProfileSaved(data);
    setProfile(data);
  }

  const savedAvatar = localStorage.getItem("avatar");

  if (savedAvatar) {
    setAvatar(savedAvatar);
  }
}, []);


  const profileChanged = JSON.stringify(profile) !== JSON.stringify(profileSaved);

 const saveProfile = () => {
  setProfileSaved(profile);

  localStorage.setItem(
    "profile",
    JSON.stringify(profile)
  );

  // อัปเดตข้อมูลที่ Header ใช้
  const oldUser = JSON.parse(
    localStorage.getItem("bare_user") || "{}"
  );

  const updatedUser = {
    ...oldUser,
    firstName: profile.fullName.split(" ")[0] || "",
    lastName: profile.fullName.split(" ").slice(1).join(" "),
    email: profile.email,
  };

  localStorage.setItem(
    "bare_user",
    JSON.stringify(updatedUser)
  );

  window.dispatchEvent(new Event("profileUpdated"));

  notify("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
};
  const cancelProfile = () => setProfile(profileSaved);
const updateProfile = (field) => (e) => {
  setProfile((prev) => ({
    ...prev,
    [field]: e.target.value,
  }));
};

  const [addresses, setAddresses] = useState(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("addresses");

    return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
    localStorage.setItem(
        "addresses",
        JSON.stringify(addresses)
    );
}, [addresses]);

  const emptyAddress = {label: "home",recipient: "",phone: "",address: "",province: "",district: "",subDistrict: "",postcode: "",note: "",};
  const [addrForm, setAddrForm] = useState(emptyAddress);

  
  
  const [editingId, setEditingId] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);

  const startAddAddress = () => {
    setAddrForm(emptyAddress);
    setEditingId(null);
    setShowAddrForm(true);
  };
  const startEditAddress = (addr) => {
    setAddrForm(addr);
    setEditingId(addr.id);
    setShowAddrForm(true);
  };
  const saveAddress = () => {
    if (
  !addrForm.recipient ||
  !addrForm.phone ||
  !addrForm.address ||
  !addrForm.province ||
  !addrForm.district ||
  !addrForm.subDistrict ||
  !addrForm.postcode) 
  {
      notify("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    if (editingId) {
      setAddresses((list) => list.map((a) => (a.id === editingId ? { ...addrForm, id: editingId, isDefault: a.isDefault } : a)));
      notify("แก้ไขที่อยู่เรียบร้อยแล้ว");
    } else {
      setAddresses((list) => [...list, { ...addrForm, id: Date.now(), isDefault: list.length === 0 }]);
      notify("บันทึกที่อยู่ใหม่เรียบร้อยแล้ว");
    }
    setShowAddrForm(false);
  };
  const deleteAddress = (id) => {
    setAddresses((list) => list.filter((a) => a.id !== id));
    notify("ลบที่อยู่เรียบร้อยแล้ว");
  };
  const setDefaultAddress = (id) => {
    setAddresses((list) => list.map((a) => ({ ...a, isDefault: a.id === id })));
    notify("ตั้งเป็นที่อยู่หลักเรียบร้อยแล้ว");
  };

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const pwStrength = (() => {
    const v = pw.next;
    if (!v) return 0;
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  })();
  const strengthLabel = ["อ่อนมาก", "อ่อน", "ปานกลาง", "ดี", "ดีมาก"][pwStrength];
  const strengthColor = ["#D9CFC0", "#C4574B", "#C9954F", "#8A9A5B", "#5C7A4A"][pwStrength];

  const savePassword = () => {
    if (!pw.current || !pw.next || !pw.confirm) {
      notify("กรุณากรอกข้อมูลรหัสผ่านให้ครบถ้วน");
      return;
    }
    if (pw.next !== pw.confirm) {
      notify("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }
    if (pw.next.length < 8) {
      notify("รหัสผ่านใหม่ควรมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    setPw({ current: "", next: "", confirm: "" });
    notify("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
  };

  
  return (
    <div style={{ background: "#FAF6F0", minHeight: "100vh" }} className="w-full">
      <style>{`
        ${FONT_IMPORT}
        * { font-family: 'Manrope', sans-serif; }
        .serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      <Toast message={toast.message} show={toast.show} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
        {/* ===== ปกโปรไฟล์ ===== */}
        <div className="flex justify-center mb-8">
  <div className="relative">
    <img
      src={avatar}
      alt="รูปโปรไฟล์"
      className="w-32 h-32 rounded-full object-cover shadow-md"
      style={{ border: "4px solid #FAF6F0" }}
    />

    <button
      onClick={handleAvatarPick}
      className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center"
      style={{ background: "#5C4033" }}
    >
      <Camera className="w-4 h-4 text-white" />
    </button>

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleAvatarChange}
    />
  </div>
</div>

        <div className="mb-10 pl-1">
          <h1 className="serif text-3xl" style={{ color: "#2B231C", fontWeight: 600 }}>
            {profileSaved.fullName || "โปรไฟล์ของฉัน"}
          </h1>
          
        </div>

        <section
          className="rounded-2xl p-6 sm:p-8 mb-8"
          style={{ background: "#FFFFFF", border: "1px solid #EFE6D6" }}
        >
          <SectionHeader title="ข้อมูลส่วนตัว" subtitle="แก้ไขชื่อ ข้อมูลติดต่อ และคำแนะนำตัวของคุณ" />

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="ชื่อ-นามสกุล">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#B9AC99" }} />
                <TextInput className="pl-9" value={profile.fullName} onChange={updateProfile("fullName")}placeholder="กรอกชื่อ-นามสกุล"/>
              </div>
            </Field>
            <Field label="ชื่อผู้ใช้" >
              <TextInput value={profile.username}onChange={updateProfile("username")}placeholder="กรอกชื่อผู้ใช้"/>
            </Field>
            <Field label="อีเมล">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#B9AC99" }} />
                <TextInput className="pl-9" type="email" value={profile.email}onChange={updateProfile("email")}placeholder="example@email.com"/>
              </div>
            </Field>
            <Field label="เบอร์โทรศัพท์">
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#B9AC99" }} />
                <TextInput className="pl-9" value={profile.phone}onChange={updateProfile("phone")}placeholder="08X-XXX-XXXX"/>
              </div>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="แนะนำตัวสั้น ๆ" hint={`${400 - profile.bio.length} ตัวอักษรที่เหลือ`}>
              <textarea
                value={profile.bio}
                onChange={updateProfile("bio")}
                placeholder="กรอกข้อมูลเรื่องที่คุณสนใจ"
                maxLength={400}
                rows={3}
                style={inputStyle}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #C9A66B55")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <GhostButton onClick={cancelProfile} icon={X}>
              ยกเลิกการแก้ไข
            </GhostButton>
            <PrimaryButton onClick={saveProfile} disabled={!profileChanged} icon={Check}>
              บันทึกข้อมูลส่วนตัว
            </PrimaryButton>
          </div>
        </section>

        <section
          className="rounded-2xl p-6 sm:p-8 mb-8"
          style={{ background: "#FFFFFF", border: "1px solid #EFE6D6" }}
        >
          <div className="flex items-start justify-between mb-2">
            <SectionHeader title="ที่อยู่จัดส่ง" subtitle="บันทึกที่อยู่บ้านหรือที่ทำงานไว้ใช้ตอนสั่งซื้อ" />
            {!showAddrForm && (
              <PrimaryButton onClick={startAddAddress} icon={Plus}>
                เพิ่มที่อยู่ใหม่
              </PrimaryButton>
            )}
          </div>

          <div className="space-y-3 mb-2">
            {addresses.length === 0 && !showAddrForm && (
              <p className="text-sm py-6 text-center" style={{ color: "#A99A87" }}>
                ยังไม่มีที่อยู่จัดส่งที่บันทึกไว้ กด “เพิ่มที่อยู่ใหม่” เพื่อเริ่มต้น
              </p>
            )}
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-xl p-4 flex items-start justify-between gap-3"
                style={{ background: "#FBF7F0", border: "1px solid #EFE6D6" }}
              >
                <div className="flex gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#F1E9DC" }}
                  >
                    {addr.label === "home" ? (
                      <Home className="w-4 h-4" style={{ color: "#5C4033" }} />
                    ) : (
                      <Briefcase className="w-4 h-4" style={{ color: "#5C4033" }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: "#2B231C" }}>
                        {addr.recipient}
                      </span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: "#EADFC8", color: "#5C4033" }}
                      >
                        {addr.label === "home" ? "ที่บ้าน" : "ที่ทำงาน"}
                      </span>
                      {addr.isDefault && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: "#5C4033", color: "#F1E9DC" }}
                        >
                          <Star className="w-3 h-3" fill="#F1E9DC" /> ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#8A7C6C" }}>
                      {addr.phone}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#4A3F35" }}>
                      <>
                    {addr.address}<br />
                    {addr.subDistrict} {addr.district}<br />
                    {addr.province} {addr.postcode}</>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!addr.isDefault && (
                    <button
                      title="ตั้งเป็นที่อยู่หลัก"
                      aria-label="ตั้งเป็นที่อยู่หลัก"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1E9DC] transition-all"
                    >
                      <Star className="w-4 h-4" style={{ color: "#B9AC99" }} />
                    </button>
                  )}
                  <button
                    title="แก้ไขที่อยู่นี้"
                    aria-label="แก้ไขที่อยู่นี้"
                    onClick={() => startEditAddress(addr)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1E9DC] transition-all"
                  >
                    <Pencil className="w-4 h-4" style={{ color: "#8A7C6C" }} />
                  </button>
                  <button
                    title="ลบที่อยู่นี้"
                    aria-label="ลบที่อยู่นี้"
                    onClick={() => deleteAddress(addr.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FBEAE7] transition-all"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "#C4574B" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ฟอร์มเพิ่ม/แก้ไขที่อยู่ */}
          {showAddrForm && (
            <div className="mt-4 rounded-xl p-5" style={{ background: "#FBF7F0", border: "1px solid #EFE6D6" }}>
              <p className="text-sm font-semibold mb-4" style={{ color: "#4A3F35" }}>
                {editingId ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่งใหม่"}
              </p>

              <Field label="บันทึกเป็น">
                <div className="flex gap-2">
                  {[
                    { key: "home", label: "ที่บ้าน", Icon: Home },
                    { key: "work", label: "ที่ทำงาน", Icon: Briefcase },
                  ].map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      onClick={() => setAddrForm((f) => ({ ...f, label: key }))}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-all"
                      style={
                        addrForm.label === key
                          ? { background: "#5C4033", color: "#FAF6F0", borderColor: "#5C4033" }
                          : { background: "#FFFFFF", color: "#4A3F35", borderColor: "#E4D9C7" }
                      }
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">

                <Field label="ชื่อผู้รับ">
                  <TextInput
                    value={addrForm.recipient}
                    onChange={(e) => setAddrForm((f) => ({ ...f, recipient: e.target.value }))}
                    placeholder="ชื่อ-นามสกุลผู้รับพัสดุ"
                  />
                </Field>

                <Field label="เบอร์โทรศัพท์">
                  <TextInput
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0XX-XXX-XXXX"
                  />
                </Field>
              </div>

              <div className="mt-4">

                <SearchDropdown
  label="จังหวัด"
  value={addrForm.province}
  options={provinces}
  placeholder="เลือกจังหวัด"
  onChange={(province) =>
    setAddrForm((f) => ({
      ...f,
      province,
    }))
  }
/>


                <Field label="เขต / อำเภอ">
    <TextInput
        value={addrForm.district}
        onChange={(e) =>
            setAddrForm((f) => ({
                ...f,
                district: e.target.value,
            }))
        }
        placeholder="กรอกเขต / อำเภอ"
    />
</Field>


                <Field label="แขวง / ตำบล">
    <TextInput
        value={addrForm.subDistrict}
        onChange={(e) =>
            setAddrForm((f) => ({
                ...f,
                subDistrict: e.target.value,
            }))
        }
        placeholder="กรอกแขวง / ตำบล"
    />
</Field>
                
                <Field label="ที่อยู่">
                <TextInput
                    style={inputStyle}
                    value={addrForm.address}
                    onChange={(e)=>
                setAddrForm(f=>({...f,address:e.target.value}))} placeholder="บ้านเลขที่ ซอย ถนน"/>
                </Field>
                
                <Field label="รหัสไปรษณีย์">
    <TextInput
        value={addrForm.postcode}
        onChange={(e) =>
            setAddrForm((f) => ({
                ...f,
                postcode: e.target.value,
            }))
        }
        placeholder="กรอกรหัสไปรษณีย์"
    />
</Field>

                <Field label="หมายเหตุผู้จัดส่ง">
                    <textarea
                    value={addrForm.note}
                    onChange={(e)=>
                 setAddrForm(f=>({...f,note:e.target.value}))} rows={3}
                    placeholder="เช่น ฝากไว้กับ รปภ. หรือโทรก่อนส่ง"
                    style={inputStyle}
                    className="w-full px-4 py-2.5 rounded-lg outline-none resize-none"/>
                </Field>

              </div>

              <div className="flex items-center justify-end gap-3 mt-5">
                <GhostButton onClick={() => setShowAddrForm(false)} icon={X}>
                  ยกเลิก
                </GhostButton>
                <PrimaryButton onClick={saveAddress} icon={Check}>
                  บันทึกที่อยู่นี้
                </PrimaryButton>
              </div>
            </div>
          )}
        </section>

        <section
          className="rounded-2xl p-6 sm:p-8 mb-8"
          style={{ background: "#FFFFFF", border: "1px solid #EFE6D6" }}
        >
          <SectionHeader title="เปลี่ยนรหัสผ่าน" subtitle="ควรตั้งรหัสผ่านที่คาดเดายากเพื่อความปลอดภัยของบัญชี" />

          <div className="grid sm:grid-cols-1 gap-4 max-w-md">
            {[
              { key: "current", label: "รหัสผ่านปัจจุบัน" },
              { key: "next", label: "รหัสผ่านใหม่" },
              { key: "confirm", label: "ยืนยันรหัสผ่านใหม่" },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#B9AC99" }} />
                  <TextInput
                    className="pl-9 pr-10"
                    type={showPw[key] ? "text" : "password"}
                    value={pw[key]}
                    onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={key === "current" ? "กรอกรหัสผ่านปัจจุบัน" : "อย่างน้อย 8 ตัวอักษร"}
                  />
                  <button
                    type="button"
                    title={showPw[key] ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    aria-label={showPw[key] ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPw[key] ? (
                      <EyeOff className="w-4 h-4" style={{ color: "#B9AC99" }} />
                    ) : (
                      <Eye className="w-4 h-4" style={{ color: "#B9AC99" }} />
                    )}
                  </button>
                </div>
                {key === "next" && pw.next && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#EFE6D6" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(pwStrength / 4) * 100}%`, background: strengthColor }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </Field>
            ))}
          </div>

          <div className="flex items-center justify-end mt-6">
            <PrimaryButton onClick={savePassword} icon={Check}>
              บันทึกรหัสผ่านใหม่
            </PrimaryButton>
          </div>
        </section>

        
      </div>

      
    </div>
  );
}
