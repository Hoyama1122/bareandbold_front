"use client";

import React from "react";
import Link from "next/link";
import { Search01Icon, FavouriteIcon, ShoppingBag01Icon, UserIcon } from "hugeicons-react";

export default function Header({ isLoggedIn }) {
  return (
    <>
      {/* Main Navigation Bar */}
      <header className="w-full py-5 bg-earth-cream border-b border-earth-beige sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-earth-dark hover:text-earth-olive transition"
          >
            Destry
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold text-earth-dark">
            <Link
              href="/"
              className="text-earth-olive hover:opacity-80 transition"
            >
              หน้าแรก
            </Link>
            <a href="#shop" className="hover:text-earth-olive transition">
              ร้านค้า
            </a>
            <a href="#pages" className="hover:text-earth-olive transition">
              หน้าเพจ
            </a>
            <a href="#blog" className="hover:text-earth-olive transition">
              บทความ
            </a>
            <a href="#contact" className="hover:text-earth-olive transition">
              ติดต่อเรา
            </a>
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

            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-earth-beige hover:bg-earth-border border border-earth-border transition text-xs font-bold text-earth-dark"
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
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
