"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft01Icon } from "hugeicons-react";

export default function AuthPage() {
  const [authState, setAuthState] = useState("login"); // login, register, dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if JWT token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("bare_auth_token");
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  // Fetch user profile from Hono backend using JWT token
  const fetchUserProfile = async (token) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      const data = await res.json();
      setUser(data.user);
      setAuthState("dashboard");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("bare_auth_token");
      setAuthState("login");
    } finally {
      setLoading(false);
    }
  };

  // Handle register submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccessMsg("Account created successfully! Logging in...");
      
      // Auto login after registration
      setTimeout(() => {
        handleLogin(e);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store JWT token in localStorage
      localStorage.setItem("bare_auth_token", data.token);
      setUser(data.user);
      setAuthState("dashboard");
      
      // Clean inputs
      setPassword("");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("bare_auth_token");
    setUser(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setErrorMsg("");
    setSuccessMsg("");
    setAuthState("login");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-[#3C322A] font-sans p-4 antialiased">
      
      {/* Main Container */}
      <main className="relative z-10 w-full max-w-md p-2 flex flex-col items-center gap-6">
        
        {/* Navigation back link */}
        <Link 
          href="/"
          className="flex items-center gap-2 text-[#556B2F] hover:text-[#6A5242] text-xs font-bold uppercase tracking-wider transition duration-200 self-start"
        >
          <ArrowLeft01Icon size={14} strokeWidth={2.5} />
          กลับสู่หน้าร้านค้า
        </Link>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2.5 text-center mb-2">
          <h1 className="text-2xl font-black tracking-widest text-[#3C322A] uppercase">
            BARE & BOLD
          </h1>
          <p className="text-xs text-[#556B2F] max-w-xs leading-relaxed">
            เข้าถึงข้อมูลโปรไฟล์ ประวัติการสั่งซื้อ และสิทธิพิเศษของคุณ
          </p>
        </div>

        {/* Auth Forms / Dashboard Container */}
        <div className="w-full p-6 md:p-8 rounded-xl bg-[#FFFFFF] border border-[#F5F0E6] shadow-sm">
          
          {/* loading indicator */}
          {loading && !user && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#F5F0E6] border-t-[#6A5242] animate-spin" />
              <span className="text-xs text-[#556B2F] font-bold">กำลังเชื่อมต่อระบบอย่างปลอดภัย...</span>
            </div>
          )}

          {/* Form Views */}
          {(!loading || user) && (
            <>
              {/* LOGIN FORM */}
              {authState === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-base font-bold text-[#3C322A] uppercase tracking-wider">เข้าสู่ระบบ</h2>
                    <p className="text-xs text-[#556B2F] mt-1 font-semibold">กรอกข้อมูลของคุณเพื่อดำเนินการต่อ</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#556B2F]">อีเมล</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-xs text-[#3C322A] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#556B2F]">รหัสผ่าน</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-xs text-[#3C322A] transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-[#6A5242] hover:bg-[#523e31] text-[#FDFBF7] text-xs font-bold uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-sm"
                  >
                    เข้าสู่ระบบ
                  </button>

                  <p className="text-center text-xs text-[#556B2F] mt-5 font-semibold">
                    ยังไม่มีบัญชีใช่ไหม?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthState("register");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[#6A5242] hover:underline font-bold cursor-pointer"
                    >
                      สมัครสมาชิก
                    </button>
                  </p>
                </form>
              )}

              {/* REGISTER FORM */}
              {authState === "register" && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="text-center mb-5">
                    <h2 className="text-base font-bold text-[#3C322A] uppercase tracking-wider">สร้างบัญชีใหม่</h2>
                    <p className="text-xs text-[#556B2F] mt-1 font-semibold">ลงทะเบียนเพื่อสร้างโปรไฟล์ของคุณ</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-lg">
                      {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-3.5 text-xs bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg">
                      {successMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#556B2F]">ชื่อ</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-3 py-2 text-xs text-[#3C322A] transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#556B2F]">นามสกุล</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-3 py-2 text-xs text-[#3C322A] transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#556B2F]">อีเมล</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-xs text-[#3C322A] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#556B2F]">รหัสผ่าน</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#F5F0E6] focus:border-[#6A5242] outline-none rounded-lg px-4 py-2.5 text-xs text-[#3C322A] transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-5 py-3 bg-[#6A5242] hover:bg-[#523e31] text-[#FDFBF7] text-xs font-bold uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-sm"
                  >
                    สมัครสมาชิก
                  </button>

                  <p className="text-center text-xs text-[#556B2F] mt-5 font-semibold">
                    มีบัญชีอยู่แล้วใช่ไหม?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthState("login");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[#6A5242] hover:underline font-bold cursor-pointer"
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
                      <p className="text-xs text-[#556B2F] font-semibold">{user.email}</p>
                    </div>
                  </div>

                  {/* Status Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#FDFBF7] border border-[#F5F0E6]">
                      <span className="text-[11px] font-bold text-[#556B2F] uppercase tracking-wider">การเชื่อมต่อฐานข้อมูล</span>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#6A5242] text-[#FDFBF7] text-[9px] font-bold tracking-widest uppercase">
                        Neon DB Record
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-[#556B2F] font-bold uppercase tracking-widest">รหัส Neon DB</span>
                      <code className="text-xs bg-[#FDFBF7] border border-[#F5F0E6] px-3 py-2.5 rounded-lg text-[#3C322A] font-mono break-all select-all block shadow-inner">
                        {user.id}
                      </code>
                    </div>
                  </div>

                  {/* Sign Out Action */}
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-6 py-3 bg-[#FFFFFF] hover:bg-[#FDFBF7] text-[#6A5242] hover:text-[#523e31] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#F5F0E6] transition duration-200 cursor-pointer shadow-sm"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
