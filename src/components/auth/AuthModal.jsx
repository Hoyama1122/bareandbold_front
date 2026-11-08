"use client";

import React, { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [authState, setAuthState] = useState("login"); // login, register, dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check login status on open
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("bare_auth_token");
      if (token) {
        fetchUserProfile(token);
      } else {
        setUser(null);
        setAuthState("login");
      }
      // Reset msgs
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  const fetchUserProfile = async (token) => {
    setLoading(true);
    try {
      const data = await authService.getProfile(token);
      setUser(data.user);
      setAuthState("dashboard");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("bare_auth_token");
      setUser(null);
      setAuthState("login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate Thai characters for first name and last name
    const thaiRegex = /^[ก-๙]+$/;
    if (!firstName.trim()) {
      setErrorMsg("กรุณากรอกชื่อ");
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg("กรุณากรอกนามสกุล");
      return;
    }
    if (!thaiRegex.test(firstName.trim())) {
      setErrorMsg("ชื่อต้องเป็นภาษาไทยเท่านั้น");
      return;
    }
    if (!thaiRegex.test(lastName.trim())) {
      setErrorMsg("นามสกุลต้องเป็นภาษาไทยเท่านั้น");
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, password, firstName, lastName);
      setSuccessMsg("สร้างบัญชีสำเร็จ! กำลังเข้าสู่ระบบ...");
      
      // Auto login
      setTimeout(() => {
        handleLogin(e);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "การสมัครสมาชิกล้มเหลว");
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      localStorage.setItem("bare_auth_token", data.token);
      

localStorage.setItem(
  "bare_user",
  JSON.stringify(data.user)
);

localStorage.setItem(
  "bare_user_email",
  data.user.email
);
      setUser(data.user);
      setAuthState("dashboard");
      setPassword("");
      
      // Merge guest cart to user cart
      await cartService.mergeCart();
      
      if (onAuthSuccess) onAuthSuccess(data.user);
    } catch (err) {
      setErrorMsg(err.message || "เข้าสู่ระบบล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
  localStorage.removeItem("bare_auth_token");
  localStorage.removeItem("bare_user");
  localStorage.removeItem("bare_user_email");
  localStorage.removeItem("profile");
  localStorage.removeItem("avatar");
  localStorage.removeItem("addresses");
  localStorage.removeItem("bare_cart");

  window.dispatchEvent(new Event("cartUpdated"));

  setUser(null);
  setEmail("");
  setPassword("");
  setFirstName("");
  setLastName("");
  setErrorMsg("");
  setSuccessMsg("");
  setAuthState("login");

  if (onAuthSuccess) onAuthSuccess(null);
};

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center font-anuphan antialiased transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-[#3C322A]/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative z-10 w-full max-w-md mx-4 p-6 md:p-8 rounded-2xl bg-[#FFFFFF] border border-[#F5F0E6] shadow-2xl transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        } flex flex-col gap-6`}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#3C322A] p-2 rounded-full hover:bg-[#F5F0E6] transition duration-200 cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-black tracking-widest text-[#3C322A] uppercase">
            BARE & BOLD
          </h1>
          <p className="text-xs md:text-sm text-[#556B2F] max-w-xs leading-relaxed font-bold">
            {authState === "dashboard" ? "โปรไฟล์ของคุณ" : "เข้าถึงโปรไฟล์ ประวัติการสั่งซื้อ และสิทธิพิเศษของคุณ"}
          </p>
        </div>

        {/* loading indicator */}
        {loading && !user && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-[#F5F0E6] border-t-[#6A5242] animate-spin" />
            <span className="text-sm text-[#556B2F] font-bold">กำลังเชื่อมต่อระบบอย่างปลอดภัย...</span>
          </div>
        )}

        {/* Form Views */}
        {(!loading || user) && (
          <div className="w-full">
            {/* LOGIN FORM */}
            {authState === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="text-center mb-5">
                  <h2 className="text-base md:text-lg font-extrabold text-[#3C322A] uppercase tracking-wider">เข้าสู่ระบบ</h2>
                  <p className="text-xs md:text-sm text-[#556B2F] mt-1 font-semibold">กรอกข้อมูลของคุณเพื่อดำเนินการต่อ</p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 text-sm bg-rose-50 border border-rose-100 text-rose-600 rounded-lg font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] md:text-xs uppercase font-extrabold tracking-widest text-[#556B2F]">อีเมล</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-sm text-[#3C322A] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] md:text-xs uppercase font-extrabold tracking-widest text-[#556B2F]">รหัสผ่าน</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-sm text-[#3C322A] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-5 py-3 bg-[#6A5242] hover:bg-[#523e31] text-[#FDFBF7] text-sm font-extrabold uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-sm"
                >
                  เข้าสู่ระบบ
                </button>

                <p className="text-center text-sm text-[#556B2F] mt-5 font-semibold">
                  ยังไม่มีบัญชีใช่ไหม?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("register");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[#6A5242] hover:underline font-extrabold cursor-pointer ml-1"
                  >
                    สมัครสมาชิก
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {authState === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-base md:text-lg font-extrabold text-[#3C322A] uppercase tracking-wider">สร้างบัญชีใหม่</h2>
                  <p className="text-xs md:text-sm text-[#556B2F] mt-1 font-semibold">ลงทะเบียนเพื่อสร้างโปรไฟล์ของคุณ</p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 text-sm bg-rose-50 border border-rose-100 text-rose-600 rounded-lg font-medium">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3.5 text-sm bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg font-medium">
                    {successMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] md:text-xs uppercase font-extrabold tracking-widest text-[#556B2F]">ชื่อ</label>
                    <input
                      type="text"
                      required
                      placeholder="สมชาย"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-sm text-[#3C322A] transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] md:text-xs uppercase font-extrabold tracking-widest text-[#556B2F]">นามสกุล</label>
                    <input
                      type="text"
                      required
                      placeholder="ใจดี"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-sm text-[#3C322A] transition"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] md:text-xs uppercase font-extrabold tracking-widest text-[#556B2F]">อีเมล</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-sm text-[#3C322A] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] md:text-xs uppercase font-extrabold tracking-widest text-[#556B2F]">รหัสผ่าน</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-sm text-[#3C322A] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-5 py-3 bg-[#6A5242] hover:bg-[#523e31] text-[#FDFBF7] text-sm font-extrabold uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-sm"
                >
                  สมัครสมาชิก
                </button>

                <p className="text-center text-sm text-[#556B2F] mt-5 font-semibold">
                  มีบัญชีอยู่แล้วใช่ไหม?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("login");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[#6A5242] hover:underline font-extrabold cursor-pointer ml-1"
                  >
                    เข้าสู่ระบบ
                  </button>
                </p>
              </form>
            )}

            {/* AUTHENTICATED DASHBOARD */}
            {authState === "dashboard" && user && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-3 text-center pb-5 border-b border-[#F5F0E6]">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#FDFBF7] text-[#6A5242] text-lg font-extrabold rounded-full border border-[#F5F0E6] shadow-sm">
                    {user.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#3C322A]">
                      {user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "ยินดีต้อนรับ"}
                    </h3>
                    <p className="text-xs md:text-sm text-[#556B2F] font-semibold">{user.email}</p>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#FDFBF7] border border-[#F5F0E6]">
                    <span className="text-xs font-bold text-[#556B2F] uppercase tracking-wider">การเชื่อมต่อฐานข้อมูล</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#6A5242] text-[#FDFBF7] text-[10px] font-bold tracking-widest uppercase">
                      Neon DB Record
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs text-[#556B2F] font-bold uppercase tracking-widest">รหัส Neon DB</span>
                    <code className="text-xs md:text-sm bg-[#FDFBF7] border border-[#F5F0E6] px-3.5 py-2.5 rounded-lg text-[#3C322A] font-mono break-all select-all block shadow-inner">
                      {user.id}
                    </code>
                  </div>
                </div>

                {/* Sign Out Action */}
                <button
                  onClick={handleSignOut}
                  className="w-full mt-6 py-3 bg-[#FFFFFF] hover:bg-[#FDFBF7] text-[#6A5242] hover:text-[#523e31] text-sm font-extrabold uppercase tracking-wider rounded-lg border border-[#F5F0E6] transition duration-200 cursor-pointer shadow-sm"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
