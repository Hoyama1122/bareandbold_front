"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";

// Web3Forms Configuration for clean styled email delivery
const WEB3FORMS_ACCESS_KEY = "88b8fd6b-7615-4101-b456-9b981cbb264e";

// Clean icons
const MailIcon = () => (
  <svg
    className="w-5 h-5 text-[#556B2F]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5 text-[#556B2F]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-5 h-5 text-[#556B2F]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const SuccessCheckIcon = () => (
  <svg
    className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          "ชื่อผู้ติดต่อ": formData.name,
          "อีเมลติดต่อกลับ": formData.email,
          "เบอร์โทรศัพท์": formData.phone || "ไม่ได้ระบุ",
          "หัวข้อข้อความ": formData.subject || "มีข้อความใหม่จากระบบ Bare & Bold",
          "รายละเอียดข้อความ": formData.message
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitting(false);
        setIsSent(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert(data.message || "เกิดข้อผิดพลาดในการส่งข้อความ");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting Web3Forms:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan antialiased flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#F5F0E6]/50 py-16 px-6 border-b border-[#EADECC]/40 text-center">
        <div className="max-w-[800px] mx-auto space-y-4">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#556B2F]">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#3C322A]">
            ติดต่อเรา / ส่งข้อความหาเรา
          </h1>
          <p className="text-sm font-bold text-[#6A5242] leading-relaxed max-w-lg mx-auto">
            มีข้อสงสัยเกี่ยวกับสร้อยข้อมือคัสตอม สต็อกหินมงคล
            หรือต้องการสั่งซื้อชิ้นงานพิเศษ? ส่งข้อความหาเราได้เลย
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="max-w-[1200px] mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center items-center">
        {/* Contact Container Box */}
        <div className="w-full max-w-[1000px] bg-white rounded-3xl border border-[#EADECC]/60 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Form Panel */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
            {isSent ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <SuccessCheckIcon />
                <h3 className="text-2xl font-black text-[#3C322A]">
                  ส่งข้อความสำเร็จแล้ว!
                </h3>
                <p className="text-sm font-bold text-[#6A5242] leading-relaxed max-w-sm mx-auto">
                  ข้อความของคุณถูกส่งไปยังกล่องเมลของทีมงานระบบ Bare & Bold แล้ว
                  เราจะติดต่อคุณกลับผ่านอีเมลโดยเร็วที่สุด
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-6 px-6 py-2.5 bg-[#3C322A] hover:bg-[#556B2F] text-white text-sm font-black uppercase tracking-widest transition rounded-lg cursor-pointer"
                >
                  ส่งข้อความเพิ่มเติม
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-[#3C322A] tracking-tight">
                    ส่งเมลหรือข้อความ
                  </h2>
                  <p className="text-sm text-[#6A5242]/80 font-bold mt-1">
                    กรอกฟอร์มเพื่อติดต่อทีมงานโดยตรง
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-[#6A5242] uppercase tracking-wider block">
                        ชื่อของคุณ *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="ชื่อจริง / นามสกุล"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#FDFBF7] border border-[#EADECC]/80 rounded-lg px-3 py-2 text-sm font-bold text-[#3C322A] focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]/30 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-[#6A5242] uppercase tracking-wider block">
                        อีเมลติดต่อกลับ *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#FDFBF7] border border-[#EADECC]/80 rounded-lg px-3 py-2 text-sm font-bold text-[#3C322A] focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]/30 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-[#6A5242] uppercase tracking-wider block">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="000-000-0000"
                        maxLength="12"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#FDFBF7] border border-[#EADECC]/80 rounded-lg px-3 py-2 text-sm font-bold text-[#3C322A] focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]/30 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-[#6A5242] uppercase tracking-wider block">
                        หัวข้อติดต่อ
                      </label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="สอบถามคัสตอม / ขนส่ง / อื่นๆ"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-[#FDFBF7] border border-[#EADECC]/80 rounded-lg px-3 py-2 text-sm font-bold text-[#3C322A] focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]/30 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-[#6A5242] uppercase tracking-wider block">
                      ข้อความ / รายละเอียดที่ต้องการส่ง *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows="4"
                      placeholder="เขียนรายละเอียดข้อความสอบถามของท่านที่นี่..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-[#FDFBF7] border border-[#EADECC]/80 rounded-lg px-3 py-2 text-sm font-bold text-[#3C322A] focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]/30 transition resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#3C322A] hover:bg-[#556B2F] text-white text-sm font-black uppercase tracking-widest transition rounded-lg shadow-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    <span>
                      {isSubmitting
                        ? "กำลังส่งข้อความ..."
                        : "ส่งข้อความ (Send Message)"}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Info Panel */}
          <div className="md:col-span-5 bg-[#3C322A] text-[#FDFBF7] p-8 md:p-12 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  ข้อมูลการติดต่อ
                </h3>
                <p className="text-xs text-[#EADECC]/70 font-bold mt-1">
                  สามารถติดต่อหรือพบพวกเราได้ที่นี่
                </p>
              </div>

              <div className="space-y-5 text-sm font-bold">
                <div className="flex items-start gap-3">
                  <div className="bg-[#EADECC]/10 p-2 rounded-lg mt-0.5">
                    <LocationIcon />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">
                      สถานที่ตั้งสำนักงาน
                    </h5>
                    <p className="text-[#EADECC]/90 leading-relaxed mt-1">
                      โครงการ Bare & Bold (CSI204)
                      <br />
                      มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต
                      <br />
                      ปทุมธานี, ประเทศไทย 12120
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#EADECC]/10 p-2 rounded-lg mt-0.5">
                    <PhoneIcon />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">สายด่วนติดต่อ</h5>
                    <p className="text-[#EADECC]/90 leading-relaxed mt-1">
                      02-564-4440 ต่อ 204
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#EADECC]/10 p-2 rounded-lg mt-0.5">
                    <MailIcon />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">อีเมลกลางระบบ</h5>
                    <p className="text-[#EADECC]/90 leading-relaxed mt-1">
                      contact@bareandbold.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EADECC]/15 pt-6 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#EADECC]/60 block">
                BARE & BOLD BRAND
              </span>
              <p className="text-xs text-[#EADECC]/80 font-bold leading-relaxed">
                ผลิตภัณฑ์กำไลหินมงคลและข้อเท้าแฮนด์เมด
                ถ่ายทอดเอกลักษณ์ของตัวตนที่เป็นธรรมชาติผ่านรูปแบบสร้อยข้อมือคัสตอม
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
