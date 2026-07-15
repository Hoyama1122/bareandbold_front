"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search01Icon, FavouriteIcon, ShoppingBag01Icon, UserIcon } from "hugeicons-react";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "ร้านค้า", href: "/products" },
  { label: "หน้าเพจ", href: "/#pages" },
  { label: "บทความ", href: "/#blog" },
  { label: "ติดต่อเรา", href: "/#contact" },
  { label: "เอกสารระบบ", href: "/docs" },
];

export default function Header({ isLoggedIn: initialIsLoggedIn = false, onAuthStatusChange }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setIsLoggedIn(initialIsLoggedIn);
  }, [initialIsLoggedIn]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bare_auth_token") : null;
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const updateCartCount = () => {
    if (typeof window !== "undefined") {
      const localCart = localStorage.getItem("bare_cart");
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          if (Array.isArray(parsed)) {
            const count = parsed.reduce((acc, item) => acc + (item.quantity || 1), 0);
            setCartCount(count);
            return;
          }
        } catch (e) {}
      }
      // If no cart found, set default count to 0
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
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
            prefetch={false}
          >
            Bare & Bold
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
                  prefetch={false}
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
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-earth-olive transition cursor-pointer"
            >
              <ShoppingBag01Icon size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-earth-walnut text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
