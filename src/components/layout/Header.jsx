"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search01Icon,
  FavouriteIcon,
  ShoppingBag01Icon,
  UserIcon,
  UserCircleIcon,
  PackageIcon,
  Logout01Icon,
  Settings02Icon
} from "hugeicons-react";
import AuthModal from "../auth/AuthModal";
import CartDrawer from "../cart/CartDrawer";
import { wishlistService } from "@/services/wishlist.service";

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "ร้านค้า", href: "/products" },
  { label: "ติดต่อเรา", href: "/contact" },
  { label: "เอกสารระบบ", href: "/docs" },
];

export default function Header({
  isLoggedIn: initialIsLoggedIn = false,
  onAuthStatusChange,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const profileMenuRef = useRef(null);
  const wishlistMenuRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(initialIsLoggedIn);
  }, [initialIsLoggedIn]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("bare_auth_token")
        : null;
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
      if (
        wishlistMenuRef.current &&
        !wishlistMenuRef.current.contains(event.target)
      ) {
        setIsWishlistOpen(false);
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
            const count = parsed.reduce(
              (acc, item) => acc + (item.quantity || 1),
              0,
            );
            setCartCount(count);
            return;
          }
        } catch (e) {}
      }
      setCartCount(0);
    }
  };

  const updateWishlist = async () => {
    const items = await wishlistService.fetchWishlist();
    setWishlistItems(items);
  };

  useEffect(() => {
    updateCartCount();
    updateWishlist();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("bare_auth_token");
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    if (onAuthStatusChange) {
      onAuthStatusChange(false);
    }
    router.push("/");
    window.dispatchEvent(new Event("cartUpdated"));
  };

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
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
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
            <Link href="/products" className="w-10 h-10 flex items-center justify-center hover:text-earth-olive transition">
              <Search01Icon size={20} strokeWidth={2} />
            </Link>
            
            {/* Wishlist Dropdown */}
            <div className="relative" ref={wishlistMenuRef}>
              <button
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                className="relative w-10 h-10 flex items-center justify-center hover:text-earth-olive transition cursor-pointer"
              >
                <FavouriteIcon size={20} strokeWidth={2} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {isWishlistOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl bg-white border border-[#E7DDC8] shadow-xl overflow-hidden z-50 p-4 font-anuphan">
                  <h3 className="font-extrabold text-sm text-[#3C322A] mb-3 pb-2 border-b border-[#F5F0E6]">รายการโปรดของคุณ ({wishlistItems.length})</h3>
                  
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-400 font-bold">
                      ไม่มีสินค้าในรายการโปรด
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center justify-between group">
                          <Link 
                            href={`/products/${item.name?.toLowerCase().replace(/ /g, "-")}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="flex items-center gap-2 flex-1 min-w-0"
                          >
                            <img 
                              src={item.images?.[0]?.url || item.images?.[0] || item.imageUrl || "/placeholder.jpg"} 
                              alt={item.name} 
                              className="w-10 h-10 object-cover rounded-lg bg-zinc-50 border border-zinc-100 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#3C322A] truncate hover:text-[#556B2F]">{item.name}</p>
                              <p className="text-[10px] text-zinc-400">฿{Number(item.price).toLocaleString()}</p>
                            </div>
                          </Link>
                          <button
                            onClick={() => wishlistService.removeFromWishlist(item.id)}
                            className="text-zinc-300 hover:text-red-500 p-1.5 transition cursor-pointer rounded-full hover:bg-red-50"
                            title="ลบจากรายการโปรด"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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

            <div className="relative" ref={profileMenuRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 flex items-center justify-center hover:text-earth-olive transition cursor-pointer"
                >
                  <UserCircleIcon size={21} strokeWidth={2} />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-earth-beige hover:bg-earth-border border border-earth-border transition text-xs font-bold text-earth-dark cursor-pointer"
                >
                  <UserIcon size={14} strokeWidth={2.5} />
                  <span>เข้าสู่ระบบ</span>
                </button>
              )}

              {isProfileOpen && isLoggedIn && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white border border-earth-border shadow-xl overflow-hidden z-50 py-1 font-anuphan">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-zinc-400">บัญชีผู้ใช้</p>
                    <p className="text-sm font-bold text-earth-dark truncate mt-0.5">
                      {typeof window !== "undefined" && localStorage.getItem("bare_user_email")}
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5EE] text-sm font-bold text-earth-dark transition"
                  >
                    <PackageIcon size={18} />
                    ประวัติคำสั่งซื้อ
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5EE] text-sm font-bold text-earth-dark transition"
                  >
                    <Settings02Icon size={18} />
                    โปรไฟล์
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFF5F5] text-left text-sm font-bold text-red-600 border-t border-gray-100 cursor-pointer"
                  >
                    <Logout01Icon size={18} />
                    ออกจากระบบ
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
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
