"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search01Icon, FavouriteIcon, ShoppingBag01Icon, UserIcon } from "hugeicons-react";
import AuthModal from "./AuthModal";

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "ร้านค้า", href: "/#shop" },
  { label: "หน้าเพจ", href: "/#pages" },
  { label: "บทความ", href: "/#blog" },
  { label: "ติดต่อเรา", href: "/#contact" },
  { label: "เอกสารระบบ", href: "/docs" },
];

export default function Header({ isLoggedIn: initialIsLoggedIn = false, onAuthStatusChange }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(initialIsLoggedIn);
  }, [initialIsLoggedIn]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bare_auth_token") : null;
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthSuccess = (user) => {
    const hasToken = !!localStorage.getItem("bare_auth_token");
    setIsLoggedIn(hasToken);
    if (onAuthStatusChange) {
      onAuthStatusChange(hasToken, user);
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#F5F0E6] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-earth-dark hover:text-earth-olive transition"
          >
            Destry
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-anuphan font-bold">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition ${
                    isActive
                      ? "text-earth-olive border-b-2 border-earth-olive pb-1"
                      : "text-earth-dark hover:text-earth-olive"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & Profile Access */}
          <div className="flex items-center gap-5 text-earth-dark">
            <button className="hover:text-earth-olive transition">
              <Search01Icon size={20} strokeWidth={2} />
            </button>
            <button className="hover:text-earth-olive transition">
              <FavouriteIcon size={20} strokeWidth={2} />
            </button>
            <button className="relative hover:text-earth-olive transition">
              <ShoppingBag01Icon size={20} strokeWidth={2} />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-earth-walnut text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                1
              </span>
            </button>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-earth-beige hover:bg-earth-border border border-earth-border transition text-xs font-bold text-earth-dark cursor-pointer"
            >
              {isLoggedIn ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-earth-olive" />
                  บัญชี
                </>
              ) : (
                <>
                  <UserIcon size={14} strokeWidth={2.5} className="text-zinc-600" />
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
