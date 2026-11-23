"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";
import { authService } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";

/**
 * AuthContext — แหล่งความจริงเดียวของ session ฝั่ง storefront
 * เก็บ user, role (BUYER/SELLER), shop และ loading
 * โดยดึงข้อมูลล่าสุดจาก /auth/profile ทุกครั้งที่ refresh
 * เพื่อให้สถานะร้านที่เพิ่งอนุมัติมีผลโดยไม่ต้องรอ token หมดอายุ
 */
const AuthContext = createContext(null);

const CLEAR_KEYS = [
  "bare_auth_token",
  "bare_user",
  "bare_user_email",
  "profile",
  "avatar",
];

const clearLocalAuth = () => {
  if (typeof window === "undefined") return;
  CLEAR_KEYS.forEach((key) => localStorage.removeItem(key));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return null;

    try {
      const data = await apiFetch("/auth/profile");
      if (data && data.user) {
        setUser(data.user);
        setRole(data.role || data.user?.role || "BUYER");
        setAccountType(data.accountType || "USER");
        setShop(data.shop || null);
        return data;
      } else {
        setUser(null);
        setRole(null);
        setShop(null);
        setAccountType(null);
        return null;
      }
    } catch {
      clearLocalAuth();
      setUser(null);
      setRole(null);
      setShop(null);
      setAccountType(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Purge legacy auth tokens from localStorage for pure cookie session
    clearLocalAuth();
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    clearLocalAuth();

    setUser(data.user);
    setRole(data.user.role || "BUYER");
    setShop(data.user.shop || null);

    // รวมตะกร้า local storage เข้ากับ user cart ในฐานข้อมูล
    try {
      await cartService.mergeCart();
    } catch (e) {
      console.error("Cart merge error:", e);
    }

    // ดึงข้อมูลเต็ม (shop, สิทธิ์ล่าสุด) จาก DB ผ่าน cookie session
    await refresh();
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearLocalAuth();
      setUser(null);
      setRole(null);
      setShop(null);
      setAccountType(null);
    }
  };

  const isSeller = role === "SELLER";
  const isApprovedSeller = shop?.status === "APPROVED";
  const hasShop = !!shop;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        accountType,
        shop,
        loading,
        isLoggedIn: !!user,
        isSeller,
        isApprovedSeller,
        hasShop,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
