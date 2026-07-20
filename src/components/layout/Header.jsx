"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Search01Icon,FavouriteIcon,ShoppingBag01Icon,UserCircleIcon,PackageIcon,Logout01Icon,Settings02Icon,} from "hugeicons-react";
import AuthModal from "../auth/AuthModal";
import CartDrawer from "../cart/CartDrawer";

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(initialIsLoggedIn);
  }, [initialIsLoggedIn]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bare_auth_token") : null;
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
  function handleClickOutside(event) {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setIsProfileOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
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
            <button className="w-10 h-10 flex items-center justify-center hover:text-earth-olive transition">
              <Search01Icon size={20} strokeWidth={2} />
            </button>

            <div className="relative" ref={profileMenuRef}>

            <button
  onClick={() => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
    } else {
      setIsProfileOpen(!isProfileOpen);
    }
  }}
  className="w-10 h-10 flex items-center justify-center hover:text-earth-olive transition"
>
              <UserCircleIcon size={21} strokeWidth={2} />
            </button>

  {isLoggedIn && isProfileOpen && (

    <div className="absolute right-0 mt-3 w-60 rounded-xl bg-white border border-[#E7DDC8] shadow-xl overflow-hidden">

      <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5EE]">
        <FavouriteIcon size={18}/>
        รายการโปรด
      </button>
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5EE]"
      >
        <ShoppingBag01Icon size={18}/>
        ตะกร้าสินค้า
      </button>
      <button
        onClick={() => window.location.href="/account/orders"}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5EE]"
      >
        <PackageIcon size={18}/>
        ประวัติคำสั่งซื้อ
      </button>
      <button
  onClick={() => {
    setIsProfileOpen(false); // ปิด Dropdown
    setIsAuthOpen(true);     // เปิด AuthModal
  }}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5EE]"
>
  <Settings02Icon size={18} />
  โปรไฟล์
</button>
     
    </div>
  )}
</div>
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
