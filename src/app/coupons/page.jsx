"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";

import {
  Ticket,
  Truck,
  Store,
  Sparkles,
  Check,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Info,
  Gift,
  Search,
  X,
  Copy,
  Tag,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  Filter,
  Calendar,
  Percent,
  Coins,
  ChevronRight,
  HelpCircle,
  Timer
} from "lucide-react";

// =========================================================================
// ฐานข้อมูลจำลองคูปอง (ครอบคลุมทั้ง 3 ประเภท และ 3 สถานะ)
// 1. คูปองส่วนลดค่าจัดส่งฟรี (SHIPPING)
// 2. คูปองส่วนลดเมื่อซื้อครบขั้นต่ำ: ลดเป็นบาท (DISCOUNT_FIXED)
// 3. คูปองส่วนลดเมื่อซื้อครบขั้นต่ำ: ลดเป็น % (DISCOUNT_PERCENT)
// และมีสถานะ: available (เปิดให้เก็บ), out_of_stock (สิทธิ์เต็ม), expired (หมดอายุ)
// =========================================================================
const INITIAL_COUPONS = [
  // --- 1. คูปองส่งฟรี ---
  {
    id: "cp-ship-1",
    code: "FREESHIP0",
    title: "ส่งฟรีทั่วไทย ไม่มีขั้นต่ำ",
    subtitle: "ส่วนลดค่าจัดส่งสูงสุด ฿45 สำหรับทุกคำสั่งซื้อในระบบ",
    category: "shipping",
    categoryLabel: "คูปองส่งฟรี",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "shipping",
    discountDisplay: "ส่งฟรี",
    discountAmount: 45,
    minSpend: 0,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 62,
    status: "available",
    terms: "ใช้ได้กับสินค้าทุกหมวดหมู่บนเว็บไซต์ BARE & BOLD ไม่มียอดสั่งซื้อขั้นต่ำ รับส่วนลดค่าจัดส่งสูงสุด 45 บาท ระบบจะหักส่วนลดค่าจัดส่งอัตโนมัติในหน้าชำระเงิน จำกัด 1 สิทธิ์ต่อ 1 บัญชีผู้ใช้",
  },
  {
    id: "cp-ship-2",
    code: "FREESHIP500",
    title: "ส่งฟรีด่วนพิเศษ เมื่อช้อปครบ ฿500",
    subtitle: "ครอบคลุมค่าจัดส่งด่วนพิเศษมูลค่าสูงสุด ฿60",
    category: "shipping",
    categoryLabel: "คูปองส่งฟรี",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "shipping",
    discountDisplay: "ส่งฟรี ฿60",
    discountAmount: 60,
    minSpend: 500,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 84,
    status: "available",
    terms: "เมื่อมียอดสั่งซื้อสินค้ารวมตั้งแต่ 500 บาทขึ้นไป ส่วนลดค่าจัดส่งมูลค่าสูงสุด 60 บาท สามารถใช้ควบคู่กับคูปองส่วนลดราคาสินค้าได้",
  },
  {
    id: "cp-ship-stone",
    code: "STONESHIP40",
    title: "ส่งฟรีร้าน Stone & Soul เมื่อช้อปครบ ฿400",
    subtitle: "สนับสนุนค่าจัดส่ง ฿40 สำหรับเครื่องประดับและหินมงคล",
    category: "shipping",
    categoryLabel: "คูปองส่งฟรี",
    sourceType: "store",
    sourceName: "ร้าน Stone & Soul Jewelry",
    badgeText: "คูปองร้านค้า",
    discountType: "shipping",
    discountDisplay: "ส่งฟรี ฿40",
    discountAmount: 40,
    minSpend: 400,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 45,
    status: "available",
    terms: "ใช้ได้เฉพาะสินค้าในร้าน Stone & Soul Jewelry (กำไลหินมงคล, สร้อยข้อมือหินแท้) ยอดซื้อขั้นต่ำ 400 บาท หักค่าจัดส่งอัตโนมัติในขั้นตอน Checkout",
  },
  {
    id: "cp-ship-flash",
    code: "FLASHFREE",
    title: "ส่งฟรีแฟลชเดย์ จำกัด 100 สิทธิ์แรก",
    subtitle: "สิทธิ์เต็มแล้วสำหรับรอบนี้",
    category: "shipping",
    categoryLabel: "คูปองส่งฟรี",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "shipping",
    discountDisplay: "ส่งฟรี ฿50",
    discountAmount: 50,
    minSpend: 250,
    validityDays: 3,
    validityText: "ใช้ได้ภายใน 3 วันนับจากวันที่กดรับ",
    remainingPercent: 0,
    status: "out_of_stock",
    terms: "คูปองจัดส่งฟรี Flash Sale จำกัด 100 สิทธิ์ สิทธิ์ถูกเก็บเต็มจำนวนแล้ว โปรดติดตามแคมเปญรอบถัดไป",
  },

  // --- 2. คูปองส่วนลดเมื่อซื้อครบขั้นต่ำ: ลดเป็นบาท (฿) ---
  {
    id: "cp-fix-150",
    code: "BB150SPECIAL",
    title: "ส่วนลดเงินสด ฿150 จากเว็บ",
    subtitle: "ลดทันที 150 บาท เมื่อช้อปครบ ฿1,500 ทุกหมวดหมู่",
    category: "discount_fixed",
    categoryLabel: "ลดเป็นบาท",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "fixed",
    discountDisplay: "ลด ฿150",
    discountAmount: 150,
    minSpend: 1500,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 32,
    status: "available",
    terms: "ใช้เป็นส่วนลดท้ายบิลทันที 150 บาท เมื่อช้อปสินค้าบนเว็บไซต์ BARE & BOLD ครบ 1,500 บาทขึ้นไป สามารถใช้ร่วมกับคูปองจัดส่งฟรีได้ จำกัด 1 สิทธิ์ต่อบัญชี",
  },
  {
    id: "cp-fix-100",
    code: "WELCOME100",
    title: "ต้อนรับสมาชิกใหม่ ลดทันที ฿100",
    subtitle: "ลด 100 บาท เมื่อช้อปสินค้าครบ ฿600",
    category: "discount_fixed",
    categoryLabel: "ลดเป็นบาท",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "fixed",
    discountDisplay: "ลด ฿100",
    discountAmount: 100,
    minSpend: 600,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 78,
    status: "available",
    terms: "สิทธิพิเศษสำหรับสมาชิก BARE & BOLD เมื่อสั่งซื้อสินค้าตั้งแต่ 600 บาทขึ้นไป ส่วนลดหักทันทีก่อนชำระเงิน",
  },
  {
    id: "cp-fix-craft",
    code: "CRAFT80",
    title: "ส่วนลดร้านค้าแฮนด์เมด ฿80",
    subtitle: "สำหรับงานถักเชือกแฮนด์เมดและสร้อยข้อมือสั่งทำ",
    category: "discount_fixed",
    categoryLabel: "ลดเป็นบาท",
    sourceType: "store",
    sourceName: "ร้าน Handmade Craft Studio",
    badgeText: "คูปองร้านค้า",
    discountType: "fixed",
    discountDisplay: "ลด ฿80",
    discountAmount: 80,
    minSpend: 550,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 65,
    status: "available",
    terms: "ใช้ได้เมื่อสั่งซื้อสินค้าจากร้าน Handmade Craft Studio ครบ 550 บาทขึ้นไป ใช้ได้กับสินค้าในร้านทุกรายการ",
  },
  {
    id: "cp-fix-300",
    code: "PREMIUM300",
    title: "ส่วนลดพรีเมียมท้ายบิล ฿300",
    subtitle: "ลดจัดเต็ม 300 บาท เมื่อช้อปครบ ฿2,500",
    category: "discount_fixed",
    categoryLabel: "ลดเป็นบาท",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "fixed",
    discountDisplay: "ลด ฿300",
    discountAmount: 300,
    minSpend: 2500,
    validityDays: 30,
    validityText: "ใช้ได้ภายใน 30 วันนับจากวันที่กดรับ",
    remainingPercent: 50,
    status: "available",
    terms: "ส่วนลดมูลค่า 300 บาท เมื่อซื้อสินค้าสะสมครบ 2,500 บาท มีอายุการใช้งาน 30 วันนับตั้งแต่วันที่กดรับคูปอง",
  },
  {
    id: "cp-fix-midmonth",
    code: "MIDMONTH200",
    title: "ส่วนลดกลางเดือน ฿200 (หมดเขต)",
    subtitle: "แคมเปญพิเศษกลางเดือน ช้อปครบ ฿1,800",
    category: "discount_fixed",
    categoryLabel: "ลดเป็นบาท",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "fixed",
    discountDisplay: "ลด ฿200",
    discountAmount: 200,
    minSpend: 1800,
    validityDays: 7,
    validityText: "หมดเขตโปรโมชั่นแล้ว",
    remainingPercent: 0,
    status: "expired",
    terms: "แคมเปญพิเศษลดกลางเดือนสิ้นสุดระยะเวลาจัดกิจกรรมแล้ว ขออภัยในความไม่สะดวก",
  },

  // --- 3. คูปองส่วนลดเมื่อซื้อครบขั้นต่ำ: ลดเป็น % (%) ---
  {
    id: "cp-pct-stone15",
    code: "STONESOUL15",
    title: "ลด 15% กำไลและหินมงคลนำโชค",
    subtitle: "ลดสูงสุด ฿300 เมื่อช้อปในร้านครบ ฿800",
    category: "discount_percent",
    categoryLabel: "ลดเป็น %",
    sourceType: "store",
    sourceName: "ร้าน Stone & Soul Jewelry",
    badgeText: "คูปองร้านค้า",
    discountType: "percent",
    discountDisplay: "ลด 15%",
    discountAmount: 15,
    maxDiscountText: "ลดสูงสุด ฿300",
    minSpend: 800,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 58,
    status: "available",
    terms: "รับส่วนลด 15% (ลดได้สูงสุด 300 บาท) เมื่อช้อปสินค้าในร้าน Stone & Soul Jewelry ครบ 800 บาท ใช้ได้กับสินค้าทุกชิ้นในร้าน",
  },
  {
    id: "cp-pct-aroma20",
    code: "AROMA20PCT",
    title: "ลด 20% เครื่องหอมและเทียนอโรมา",
    subtitle: "ลดสูงสุด ฿250 เมื่อช้อปสินค้าครบ ฿700",
    category: "discount_percent",
    categoryLabel: "ลดเป็น %",
    sourceType: "store",
    sourceName: "ร้าน Aroma Glow Organic",
    badgeText: "คูปองร้านค้า",
    discountType: "percent",
    discountDisplay: "ลด 20%",
    discountAmount: 20,
    maxDiscountText: "ลดสูงสุด ฿250",
    minSpend: 700,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 42,
    status: "available",
    terms: "ส่วนลด 20% สูงสุด 250 บาท เมื่อช้อปสินค้าในร้าน Aroma Glow Organic ครบ 700 บาท เฉพาะหมวดเทียนหอมและน้ำมันหอมระเหยออร์แกนิก",
  },
  {
    id: "cp-pct-vip10",
    code: "MEMBER10",
    title: "ลด 10% สินค้าทั้งเว็บสำหรับสมาชิก",
    subtitle: "ลดสูงสุด ฿500 เมื่อช้อปครบ ฿1,200",
    category: "discount_percent",
    categoryLabel: "ลดเป็น %",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "percent",
    discountDisplay: "ลด 10%",
    discountAmount: 10,
    maxDiscountText: "ลดสูงสุด ฿500",
    minSpend: 1200,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 88,
    status: "available",
    terms: "สิทธิพิเศษส่วนลด 10% สูงสุด 500 บาท สำหรับสมาชิก BARE & BOLD เมื่อมียอดซื้อตั้งแต่ 1,200 บาทขึ้นไป ใช้ร่วมกับคูปองส่งฟรีได้",
  },
  {
    id: "cp-pct-flash25",
    code: "SUPER25",
    title: "ลด 25% Mega Brand Day",
    subtitle: "ลดสูงสุด ฿600 เมื่อช้อปครบ ฿2,000",
    category: "discount_percent",
    categoryLabel: "ลดเป็น %",
    sourceType: "platform",
    sourceName: "BARE & BOLD Official",
    badgeText: "คูปองจากเว็บ",
    discountType: "percent",
    discountDisplay: "ลด 25%",
    discountAmount: 25,
    maxDiscountText: "ลดสูงสุด ฿600",
    minSpend: 2000,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 0,
    status: "out_of_stock",
    terms: "คูปองโปรโมชั่น 25% สิทธิ์ถูกเก็บครบเต็มจำนวนแล้ว โปรดติดตามรอบใหม่",
  }
];

// Helper: Format date in Thai
function formatDateThai(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper: Format datetime in Thai
function formatDateTimeThai(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper: Calculate countdown to expiry
function calculateTimeRemaining(expiresAt) {
  const total = new Date(expiresAt).getTime() - Date.now();
  if (total <= 0) {
    return { expired: true, text: "หมดอายุแล้ว", badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-300" };
  }
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);

  if (days > 3) {
    return {
      expired: false,
      text: `เหลืออีก ${days} วัน ${hours} ชม.`,
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  } else if (days > 0) {
    return {
      expired: false,
      text: `ใกล้หมดอายุ: เหลืออีก ${days} วัน ${hours} ชม.`,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    };
  } else {
    return {
      expired: false,
      text: `หมดอายุใน ${hours} ชม. ${minutes} นาที!`,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
    };
  }
}

// Helper to determine storage key for collected coupons per user
function getUserCouponsStorageKey(user) {
  if (!user) return null;
  const id = user.email || user.id || user._id || "default";
  return `bare_user_collected_coupons_${id}`;
}

// =========================================================================
// Main Page Component
// =========================================================================
function CouponsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, loading: authLoading, login, refresh: refreshAuth } = useAuth();

  // State: Main Tab (Browse All Coupons vs My Coupons)
  const [viewMode, setViewMode] = useState("browse"); // "browse" | "my_coupons"

  // State: Filter Categories for Browse Tab
  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'shipping' | 'discount_fixed' | 'discount_percent'
  const [activeSource, setActiveSource] = useState("all"); // 'all' | 'platform' | 'store'
  const [activeStatusFilter, setActiveStatusFilter] = useState("all"); // 'all' | 'available' | 'unavailable'
  const [searchQuery, setSearchQuery] = useState("");

  // State: Filter inside My Coupons Tab
  const [myCouponsFilter, setMyCouponsFilter] = useState("all"); // 'all' | 'valid' | 'expiring' | 'expired'

  // State: Collected Coupons Array (List of { couponId, collectedAt, expiresAt, validityDays, used, coupon })
  const [collectedCoupons, setCollectedCoupons] = useState([]);

  // State: Auth Check Modal & Pending Coupon Flow
  const [isAuthAlertModalOpen, setIsAuthAlertModalOpen] = useState(false);
  const [isAuthFormModalOpen, setIsAuthFormModalOpen] = useState(false);
  const [pendingCoupon, setPendingCoupon] = useState(null);

  // State: Terms Modal & Drawer
  const [selectedTermsCoupon, setSelectedTermsCoupon] = useState(null);
  const [isMyCouponsDrawerOpen, setIsMyCouponsDrawerOpen] = useState(false);

  // State: Toast & Copied state
  const [toast, setToast] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // State: Form inputs for Inline Auth Modal
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Load user's collected coupons from localStorage when user session loads
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoggedIn && user) {
      const storageKey = getUserCouponsStorageKey(user);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCollectedCoupons(parsed);
            return;
          }
        } catch {
          // ignore parsing error
        }
      }
      setCollectedCoupons([]);
    } else {
      setCollectedCoupons([]);
    }
  }, [isLoggedIn, user]);

  // Handle Auto-Claim when returning from login redirect (via URL ?claim=... or sessionStorage)
  useEffect(() => {
    if (authLoading) return;
    if (typeof window === "undefined") return;

    const claimIdFromUrl = searchParams.get("claim");
    const claimIdFromSession = sessionStorage.getItem("pending_claim_coupon");
    const claimId = claimIdFromUrl || claimIdFromSession;

    if (claimId && isLoggedIn && user) {
      const targetCoupon = INITIAL_COUPONS.find((c) => c.id === claimId);
      if (targetCoupon) {
        // Check if already collected
        const isAlreadyCollected = collectedCoupons.some((c) => c.couponId === claimId);
        if (!isAlreadyCollected && targetCoupon.status === "available") {
          const now = new Date();
          const expiresAt = new Date(now.getTime() + targetCoupon.validityDays * 24 * 60 * 60 * 1000);
          const newItem = {
            couponId: targetCoupon.id,
            collectedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            validityDays: targetCoupon.validityDays,
            used: false,
            coupon: targetCoupon,
          };

          const updated = [newItem, ...collectedCoupons];
          setCollectedCoupons(updated);

          const storageKey = getUserCouponsStorageKey(user);
          if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          }

          showToast(
            `🎉 ยินดีต้อนรับกลับมา! ระบบเก็บคูปอง "${targetCoupon.title}" ลงในกระเป๋าของคุณเรียบร้อยแล้ว (ใช้งานได้ ${targetCoupon.validityDays} วัน)`,
            "success"
          );
        }
      }

      // Clean up session and URL
      sessionStorage.removeItem("pending_claim_coupon");
      if (claimIdFromUrl) {
        router.replace("/coupons", { scroll: false });
      }
    }
  }, [searchParams, isLoggedIn, authLoading, user, collectedCoupons, showToast, router]);

  // Set of collected coupon IDs for fast lookup
  const collectedIdsSet = useMemo(() => {
    return new Set(collectedCoupons.map((c) => c.couponId));
  }, [collectedCoupons]);

  // Filter coupons for the Browse view
  const filteredCoupons = useMemo(() => {
    return INITIAL_COUPONS.filter((coupon) => {
      // Category match
      if (activeCategory !== "all" && coupon.category !== activeCategory) {
        return false;
      }
      // Source match
      if (activeSource !== "all" && coupon.sourceType !== activeSource) {
        return false;
      }
      // Status match
      if (activeStatusFilter === "available" && coupon.status !== "available") {
        return false;
      }
      if (activeStatusFilter === "unavailable" && coupon.status === "available") {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = coupon.title.toLowerCase().includes(query);
        const matchCode = coupon.code.toLowerCase().includes(query);
        const matchSource = coupon.sourceName.toLowerCase().includes(query);
        const matchDiscount = coupon.discountDisplay.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchSource && !matchDiscount) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, activeSource, activeStatusFilter, searchQuery]);

  // Filter collected coupons inside My Coupons view
  const myFilteredCoupons = useMemo(() => {
    return collectedCoupons.filter((item) => {
      const remaining = calculateTimeRemaining(item.expiresAt);
      if (myCouponsFilter === "valid") {
        return !remaining.expired;
      }
      if (myCouponsFilter === "expiring") {
        const total = new Date(item.expiresAt).getTime() - Date.now();
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return !remaining.expired && days <= 3;
      }
      if (myCouponsFilter === "expired") {
        return remaining.expired;
      }
      return true;
    });
  }, [collectedCoupons, myCouponsFilter]);

  // =========================================================================
  // ACTIONS: Collect Coupon & Auth Check Flow
  // =========================================================================
  const handleCollectCoupon = (coupon) => {
    // 1. Status checks
    if (coupon.status === "out_of_stock") {
      showToast(`ขออภัย สิทธิ์คูปอง "${coupon.title}" มีผู้ใช้เก็บเต็มจำนวนแล้ว`, "error");
      return;
    }
    if (coupon.status === "expired") {
      showToast(`คูปอง "${coupon.title}" หมดเขตการใช้งานแล้ว`, "error");
      return;
    }

    // 2. Auth Check: If NOT logged in, show Auth Alert Modal and remember coupon
    if (!isLoggedIn) {
      setPendingCoupon(coupon);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pending_claim_coupon", coupon.id);
      }
      setIsAuthAlertModalOpen(true);
      return;
    }

    // 3. Already collected?
    if (collectedIdsSet.has(coupon.id)) {
      showToast(`คุณได้เก็บคูปอง "${coupon.title}" ไว้ในกระเป๋าของคุณแล้ว`, "info");
      return;
    }

    // 4. Save coupon with timestamp and validity days calculated
    const now = new Date();
    const expiresAt = new Date(now.getTime() + coupon.validityDays * 24 * 60 * 60 * 1000);

    const newItem = {
      couponId: coupon.id,
      collectedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      validityDays: coupon.validityDays,
      used: false,
      coupon: coupon,
    };

    const updated = [newItem, ...collectedCoupons];
    setCollectedCoupons(updated);

    const storageKey = getUserCouponsStorageKey(user);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    showToast(
      `🎉 เก็บสำเร็จ! คูปอง "${coupon.title}" อยู่ในกระเป๋าของคุณแล้ว (มีอายุใช้งาน ${coupon.validityDays} วัน)`,
      "success"
    );
  };

  // Option 1: Redirect to /login?next=... (with pending coupon remembered)
  const handleRedirectToLogin = () => {
    if (pendingCoupon) {
      sessionStorage.setItem("pending_claim_coupon", pendingCoupon.id);
      const nextUrl = `/coupons?claim=${encodeURIComponent(pendingCoupon.id)}`;
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
    } else {
      router.push(`/login?next=${encodeURIComponent("/coupons")}`);
    }
  };

  // Option 2: Open Auth Form Modal directly on page
  const handleOpenAuthModal = (mode = "login") => {
    setIsAuthAlertModalOpen(false);
    setAuthMode(mode);
    setAuthError("");
    setIsAuthFormModalOpen(true);
  };

  // Submission handler for Inline Auth Modal
  const handleInlineAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    try {
      if (authMode === "login") {
        await login(authForm.email.trim(), authForm.password);
      } else {
        // Register flow
        const thaiRegex = /^[ก-๙]+$/;
        if (!authForm.firstName.trim() || !authForm.lastName.trim()) {
          throw new Error("กรุณากรอกชื่อและนามสกุล");
        }
        if (!thaiRegex.test(authForm.firstName.trim()) || !thaiRegex.test(authForm.lastName.trim())) {
          throw new Error("ชื่อและนามสกุลต้องเป็นภาษาไทยเท่านั้น");
        }
        await authService.register(
          authForm.email.trim(),
          authForm.password,
          authForm.firstName.trim(),
          authForm.lastName.trim()
        );
        // Login after register
        await login(authForm.email.trim(), authForm.password);
      }

      await refreshAuth();

      // Collect pending coupon if user had clicked one
      if (pendingCoupon) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + pendingCoupon.validityDays * 24 * 60 * 60 * 1000);
        const newItem = {
          couponId: pendingCoupon.id,
          collectedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          validityDays: pendingCoupon.validityDays,
          used: false,
          coupon: pendingCoupon,
        };

        const targetUserEmail = authForm.email.trim();
        const storageKey = `bare_user_collected_coupons_${targetUserEmail}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (!existing.some((c) => c.couponId === pendingCoupon.id)) {
          const updated = [newItem, ...existing];
          localStorage.setItem(storageKey, JSON.stringify(updated));
          setCollectedCoupons(updated);
        }

        showToast(
          `🎉 เข้าสู่ระบบสำเร็จ! ระบบเก็บคูปอง "${pendingCoupon.title}" ให้คุณเรียบร้อยแล้ว`,
          "success"
        );
        setPendingCoupon(null);
      } else {
        showToast("เข้าสู่ระบบเรียบร้อยแล้ว ยินดีต้อนรับ!", "success");
      }

      setIsAuthFormModalOpen(false);
    } catch (err) {
      setAuthError(err.message || "การเข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Demo Login (Quick 1-Click login for testing/evaluating without backend required)
  const handleQuickDemoLogin = async () => {
    setAuthSubmitting(true);
    setAuthError("");
    try {
      const demoUser = {
        id: "demo-cust-01",
        email: "customer@bareandbold.co.th",
        name: "คุณลูกค้า BARE & BOLD",
        firstName: "ภัทรดนัย",
        lastName: "มั่นคง",
        role: "BUYER",
      };

      localStorage.setItem("bare_auth_token", "demo-token-" + Date.now());
      localStorage.setItem("bare_user", JSON.stringify(demoUser));
      localStorage.setItem("bare_user_email", demoUser.email);

      window.dispatchEvent(new Event("profileUpdated"));
      await refreshAuth();

      if (pendingCoupon) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + pendingCoupon.validityDays * 24 * 60 * 60 * 1000);
        const newItem = {
          couponId: pendingCoupon.id,
          collectedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          validityDays: pendingCoupon.validityDays,
          used: false,
          coupon: pendingCoupon,
        };

        const storageKey = `bare_user_collected_coupons_${demoUser.email}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (!existing.some((c) => c.couponId === pendingCoupon.id)) {
          const updated = [newItem, ...existing];
          localStorage.setItem(storageKey, JSON.stringify(updated));
          setCollectedCoupons(updated);
        }

        showToast(
          `🎉 เข้าสู่ระบบทดสอบสำเร็จ! ระบบเก็บคูปอง "${pendingCoupon.title}" ให้คุณทันที`,
          "success"
        );
        setPendingCoupon(null);
      } else {
        showToast("เข้าสู่ระบบด้วยบัญชีทดสอบเรียบร้อยแล้ว", "success");
      }

      setIsAuthAlertModalOpen(false);
      setIsAuthFormModalOpen(false);
    } catch (err) {
      setAuthError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบทดสอบ");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Copy coupon code to clipboard
  const handleCopyCode = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
      showToast(`คัดลอกโค้ด "${code}" สำเร็จ!`, "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan flex flex-col selection:bg-[#EADECC]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#3C322A] text-[#FDFBF7] px-5 py-4 rounded-2xl shadow-2xl border border-[#6A5242]/30 flex items-start gap-3 animate-bounce-once">
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : toast.type === "info" ? (
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* =====================================================================
            HERO BANNER & QUICK STATS
           ===================================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5F0E6] via-[#FDFBF7] to-[#EADECC]/60 border border-[#EADECC] p-6 sm:p-10 mb-8 shadow-sm">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#EADECC]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#556B2F]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C322A]/10 text-[#3C322A] text-xs font-semibold mb-4 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6A5242]" />
              <span>ศูนย์รวมสิทธิพิเศษและโปรโมชัน BARE &amp; BOLD</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3C322A] tracking-tight leading-tight mb-3">
              ศูนย์รวมคูปองส่วนลด &amp; ส่งฟรี
            </h1>

            <p className="text-sm sm:text-base text-[#6A5242] leading-relaxed mb-6">
              กดเก็บคูปองเข้าบัญชีของคุณได้ทันที ไม่ว่าจะเป็น <strong className="text-[#3C322A]">คูปองส่งฟรี</strong> หรือ{" "}
              <strong className="text-[#3C322A]">คูปองส่วนลดเมื่อซื้อครบขั้นต่ำ (ลดเป็นบาท / ลดเป็น %)</strong>{" "}
              สามารถนำไปใช้เป็นส่วนลดอัตโนมัติในหน้าชำระเงินได้ทันที
            </p>

            {/* Auth Banner & Quick Access to My Coupons */}
            <div className="flex flex-wrap items-center gap-3">
              {!isLoggedIn ? (
                <div className="inline-flex flex-wrap items-center gap-3 bg-white/90 backdrop-blur-sm border border-[#EADECC] rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6A5242]">
                    <Lock className="w-4 h-4 text-[#6A5242]" />
                    <span>เข้าสู่ระบบก่อนกดเก็บ เพื่อบันทึกคูปองลงกระเป๋าของคุณ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAuthModal("login")}
                      className="px-4 py-1.5 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-xs sm:text-sm font-semibold hover:bg-[#556B2F] transition-colors shadow-xs"
                    >
                      เข้าสู่ระบบ
                    </button>
                    <button
                      onClick={handleRedirectToLogin}
                      className="px-3 py-1.5 rounded-xl border border-[#EADECC] bg-white text-[#6A5242] hover:text-[#3C322A] text-xs font-medium transition-colors"
                      title="ไปหน้า Login เต็มรูปแบบ"
                    >
                      ไปหน้า Login →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="inline-flex flex-wrap items-center gap-4 bg-white/95 backdrop-blur-sm border border-[#EADECC] rounded-2xl p-3 sm:px-5 sm:py-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#3C322A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      เข้าสู่ระบบในชื่อ <strong>{user?.name || user?.email}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setViewMode("my_coupons")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#556B2F] hover:text-[#3C322A] underline underline-offset-4"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>กระเป๋าคูปองของฉัน ({collectedCoupons.length} ใบ) →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================================
            MAIN NAVIGATION TABS: [ หน้ารวมคูปองทั้งหมด ] vs [ คูปองของฉัน (My Coupons) ]
           ===================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADECC] pb-4 mb-6">
          <div className="flex items-center gap-2 bg-[#F5F0E6] p-1.5 rounded-2xl border border-[#EADECC]">
            <button
              onClick={() => setViewMode("browse")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                viewMode === "browse"
                  ? "bg-[#3C322A] text-[#FDFBF7] shadow-sm"
                  : "text-[#6A5242] hover:text-[#3C322A] hover:bg-white/60"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>คลังคูปองทั้งหมด</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                {INITIAL_COUPONS.length}
              </span>
            </button>

            <button
              onClick={() => setViewMode("my_coupons")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                viewMode === "my_coupons"
                  ? "bg-[#3C322A] text-[#FDFBF7] shadow-sm"
                  : "text-[#6A5242] hover:text-[#3C322A] hover:bg-white/60"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>คูปองของฉัน (My Coupons)</span>
              {collectedCoupons.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold animate-pulse">
                  {collectedCoupons.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMyCouponsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EADECC] bg-white text-xs sm:text-sm font-semibold text-[#6A5242] hover:text-[#3C322A] hover:border-[#6A5242] shadow-2xs transition-all"
            >
              <Ticket className="w-4 h-4 text-[#556B2F]" />
              <span>เปิดดูแถบข้างคูปองของฉัน</span>
            </button>

            <div className="text-xs text-[#6A5242] hidden md:flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#556B2F]" />
              <span>คูปองที่เก็บแล้วจะไปแสดงอัตโนมัติที่หน้าชำระเงิน</span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            VIEW 1: BROWSE ALL COUPONS (คลังคูปองทั้งหมดที่เปิดให้เก็บ)
           ===================================================================== */}
        {viewMode === "browse" && (
          <div className="space-y-6">
            {/* Filter Bar: Category Tabs & Search */}
            <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#EADECC] shadow-2xs">
              {/* Category Filter Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6A5242] mb-2">
                  ประเภทส่วนลด (Discount Category)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeCategory === "all"
                        ? "bg-[#3C322A] text-[#FDFBF7] shadow-xs"
                        : "bg-[#F5F0E6] text-[#6A5242] hover:bg-[#EADECC]"
                    }`}
                  >
                    ทั้งหมด ({INITIAL_COUPONS.length})
                  </button>

                  <button
                    onClick={() => setActiveCategory("shipping")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeCategory === "shipping"
                        ? "bg-[#556B2F] text-white shadow-xs"
                        : "bg-[#F5F0E6] text-[#6A5242] hover:bg-[#EADECC]"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>คูปองส่งฟรี (Free Shipping)</span>
                  </button>

                  <button
                    onClick={() => setActiveCategory("discount_fixed")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeCategory === "discount_fixed"
                        ? "bg-[#6A5242] text-white shadow-xs"
                        : "bg-[#F5F0E6] text-[#6A5242] hover:bg-[#EADECC]"
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>ลดเป็นบาท (฿ Amount)</span>
                  </button>

                  <button
                    onClick={() => setActiveCategory("discount_percent")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      activeCategory === "discount_percent"
                        ? "bg-[#3C322A] text-white shadow-xs"
                        : "bg-[#F5F0E6] text-[#6A5242] hover:bg-[#EADECC]"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>ลดเป็น % (Percentage)</span>
                  </button>
                </div>
              </div>

              {/* Secondary Filters: Source & Status & Search */}
              <div className="pt-3 border-t border-[#EADECC]/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#6A5242] mr-1">ผู้จัดจำหน่าย:</span>
                  <button
                    onClick={() => setActiveSource("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeSource === "all"
                        ? "bg-[#3C322A] text-white"
                        : "bg-neutral-100 text-[#6A5242] hover:bg-neutral-200"
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    onClick={() => setActiveSource("platform")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeSource === "platform"
                        ? "bg-[#3C322A] text-white"
                        : "bg-neutral-100 text-[#6A5242] hover:bg-neutral-200"
                    }`}
                  >
                    เว็บ BARE &amp; BOLD
                  </button>
                  <button
                    onClick={() => setActiveSource("store")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeSource === "store"
                        ? "bg-[#3C322A] text-white"
                        : "bg-neutral-100 text-[#6A5242] hover:bg-neutral-200"
                    }`}
                  >
                    ร้านค้าพาร์ทเนอร์
                  </button>

                  <span className="text-xs font-bold text-[#6A5242] ml-2 mr-1">สถานะ:</span>
                  <button
                    onClick={() => setActiveStatusFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeStatusFilter === "all"
                        ? "bg-[#3C322A] text-white"
                        : "bg-neutral-100 text-[#6A5242] hover:bg-neutral-200"
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    onClick={() => setActiveStatusFilter("available")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeStatusFilter === "available"
                        ? "bg-emerald-800 text-white"
                        : "bg-neutral-100 text-[#6A5242] hover:bg-neutral-200"
                    }`}
                  >
                    เปิดให้เก็บ
                  </button>
                  <button
                    onClick={() => setActiveStatusFilter("unavailable")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeStatusFilter === "unavailable"
                        ? "bg-neutral-600 text-white"
                        : "bg-neutral-100 text-[#6A5242] hover:bg-neutral-200"
                    }`}
                  >
                    สิทธิ์เต็ม / หมดอายุ
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อคูปอง โค้ด หรือร้าน..."
                    className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-[#EADECC] text-xs focus:outline-none focus:border-[#3C322A] bg-[#FDFBF7]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Coupons Grid */}
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#EADECC] p-8">
                <Ticket className="w-12 h-12 mx-auto text-[#6A5242]/40 mb-3" />
                <h3 className="text-base font-bold text-[#3C322A]">ไม่พบคูปองตามเงื่อนไขที่เลือก</h3>
                <p className="text-xs text-[#6A5242] mt-1">
                  ลองเปลี่ยนตัวกรองหรือล้างคำค้นหาเพื่อดูคูปองส่วนลดอื่นๆ
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveSource("all");
                    setActiveStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#3C322A] text-white text-xs font-semibold"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => {
                  const isCollected = collectedIdsSet.has(coupon.id);
                  const isOutOfStock = coupon.status === "out_of_stock";
                  const isExpired = coupon.status === "expired";
                  const isPlatform = coupon.sourceType === "platform";

                  return (
                    <div
                      key={coupon.id}
                      className={`group relative bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                        isExpired
                          ? "border-neutral-200 bg-neutral-50/60 opacity-75"
                          : isOutOfStock
                          ? "border-neutral-200"
                          : isCollected
                          ? "border-emerald-300 ring-1 ring-emerald-200/50"
                          : "border-[#EADECC] hover:border-[#6A5242]"
                      }`}
                    >
                      {/* Top Content */}
                      <div className="p-5 pb-3">
                        {/* Header Badge & Terms Link */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                                isPlatform
                                  ? "bg-[#3C322A] text-[#FDFBF7]"
                                  : "bg-[#F5F0E6] text-[#6A5242] border border-[#EADECC]"
                              }`}
                            >
                              {isPlatform ? <Truck className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                              <span>{coupon.badgeText}</span>
                            </span>

                            {/* Category Badge */}
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                coupon.category === "shipping"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : coupon.category === "discount_fixed"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-purple-50 text-purple-800 border border-purple-200"
                              }`}
                            >
                              {coupon.categoryLabel}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedTermsCoupon(coupon)}
                            className="text-xs text-[#6A5242] hover:text-[#3C322A] font-medium underline underline-offset-2 flex items-center gap-0.5"
                          >
                            <span>เงื่อนไข</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Source Name */}
                        <p className="text-xs font-semibold text-[#6A5242] mb-1">{coupon.sourceName}</p>

                        {/* Discount Display & Min Spend */}
                        <div className="flex items-baseline gap-2.5 mb-2 flex-wrap">
                          <span className="text-2xl sm:text-3xl font-extrabold text-[#3C322A] tracking-tight">
                            {coupon.discountDisplay}
                          </span>

                          {coupon.maxDiscountText && (
                            <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                              {coupon.maxDiscountText}
                            </span>
                          )}

                          {coupon.minSpend > 0 ? (
                            <span className="text-xs font-semibold text-[#6A5242] bg-[#F5F0E6] px-2.5 py-0.5 rounded-lg border border-[#EADECC]">
                              ขั้นต่ำ ฿{coupon.minSpend.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                              ไม่มีขั้นต่ำ
                            </span>
                          )}
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-base font-bold text-[#3C322A] mb-1 leading-snug">
                          {coupon.title}
                        </h3>
                        <p className="text-xs text-[#6A5242] leading-relaxed line-clamp-2">
                          {coupon.subtitle}
                        </p>

                        {/* Requirement 2: อายุการใช้งานของคูปองหลังจากกดรับ */}
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F5F0E6] border border-[#EADECC] text-xs font-bold text-[#6A5242]">
                          <Timer className="w-3.5 h-3.5 text-[#556B2F]" />
                          <span>อายุการใช้งาน: </span>
                          <span className="text-[#3C322A] underline underline-offset-2">
                            {coupon.validityText}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Perforated Divider with cutouts */}
                      <div className="relative flex items-center justify-between my-1">
                        <div className="w-4 h-4 bg-[#FDFBF7] rounded-r-full -ml-2 border-r border-t border-b border-[#EADECC]" />
                        <div className="flex-1 border-t-2 border-dashed border-[#EADECC] mx-2" />
                        <div className="w-4 h-4 bg-[#FDFBF7] rounded-l-full -mr-2 border-l border-t border-b border-[#EADECC]" />
                      </div>

                      {/* Bottom Footer Section: Remaining / Status / Action */}
                      <div className="p-5 pt-3 bg-[#FDFBF7]/80 flex flex-col gap-3">
                        {/* Progress or Status Label */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#6A5242] mb-1 font-medium">
                            {isOutOfStock ? (
                              <span className="text-rose-600 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> สิทธิ์เต็มแล้ว (100%)
                              </span>
                            ) : isExpired ? (
                              <span className="text-neutral-500 font-bold">หมดเขตโปรโมชั่น</span>
                            ) : (
                              <span>สิทธิ์คงเหลือ {coupon.remainingPercent}%</span>
                            )}

                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-[#6A5242]" />
                              <span>โค้ด: {coupon.code}</span>
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-[#EADECC] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOutOfStock
                                  ? "bg-rose-400"
                                  : isExpired
                                  ? "bg-neutral-300"
                                  : coupon.remainingPercent < 30
                                  ? "bg-amber-600"
                                  : "bg-[#556B2F]"
                              }`}
                              style={{ width: `${coupon.remainingPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons with distinct statuses */}
                        {isCollected ? (
                          <div className="flex items-center gap-2">
                            <button
                              disabled
                              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-sm font-bold flex items-center justify-center gap-1.5 cursor-default shadow-2xs"
                            >
                              <Check className="w-4 h-4 text-emerald-700" />
                              <span>เก็บคูปองแล้ว</span>
                            </button>
                            <button
                              onClick={() => setViewMode("my_coupons")}
                              className="py-2.5 px-3 rounded-xl bg-white border border-[#EADECC] text-xs font-bold text-[#6A5242] hover:text-[#3C322A] hover:bg-[#F5F0E6] transition-colors"
                              title="ดูในกระเป๋าคูปอง"
                            >
                              ดูกระเป๋า →
                            </button>
                          </div>
                        ) : isOutOfStock ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-4 rounded-xl bg-neutral-200 text-neutral-500 text-sm font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <X className="w-4 h-4" />
                            <span>สิทธิ์เต็มแล้ว</span>
                          </button>
                        ) : isExpired ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 text-neutral-400 border border-neutral-200 text-sm font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <Clock className="w-4 h-4" />
                            <span>หมดอายุแล้ว</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCollectCoupon(coupon)}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#3C322A] hover:bg-[#556B2F] text-[#FDFBF7] text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99]"
                          >
                            {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-[#EADECC]" />}
                            <span>เก็บคูปอง</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            VIEW 2: MY COUPONS TAB (คูปองของฉัน)
           ===================================================================== */}
        {viewMode === "my_coupons" && (
          <div className="space-y-6">
            {/* Header of My Coupons */}
            <div className="bg-white p-6 rounded-3xl border border-[#EADECC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Ticket className="w-6 h-6 text-[#556B2F]" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C322A]">
                    กระเป๋าคูปองของฉัน (My Coupons)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#6A5242]">
                  {isLoggedIn
                    ? `คูปองที่เก็บไว้ในบัญชี ${user?.name || user?.email} จะถูกนำไปหักส่วนลดอัตโนมัติในหน้าชำระเงิน`
                    : "กรุณาเข้าสู่ระบบเพื่อดูคูปองที่คุณเคยเก็บไว้"}
                </p>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("browse")}
                    className="px-4 py-2 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-xs sm:text-sm font-semibold hover:bg-[#556B2F] transition-colors"
                  >
                    + เก็บส่วนลดเพิ่ม
                  </button>
                  <Link
                    href="/products"
                    className="px-4 py-2 rounded-xl border border-[#EADECC] bg-[#F5F0E6] text-xs sm:text-sm font-semibold text-[#3C322A] hover:bg-[#EADECC] transition-colors"
                  >
                    ช้อปปิ้งเลย 🛍️
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenAuthModal("login")}
                  className="px-5 py-2.5 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-xs sm:text-sm font-bold hover:bg-[#556B2F]"
                >
                  เข้าสู่ระบบเพื่อดูกระเป๋าคูปอง
                </button>
              )}
            </div>

            {/* Filter Pills inside My Coupons */}
            {isLoggedIn && collectedCoupons.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setMyCouponsFilter("all")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    myCouponsFilter === "all"
                      ? "bg-[#3C322A] text-white"
                      : "bg-white text-[#6A5242] border border-[#EADECC]"
                  }`}
                >
                  ทั้งหมด ({collectedCoupons.length})
                </button>
                <button
                  onClick={() => setMyCouponsFilter("valid")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    myCouponsFilter === "valid"
                      ? "bg-emerald-800 text-white"
                      : "bg-white text-[#6A5242] border border-[#EADECC]"
                  }`}
                >
                  พร้อมใช้งาน
                </button>
                <button
                  onClick={() => setMyCouponsFilter("expiring")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    myCouponsFilter === "expiring"
                      ? "bg-amber-800 text-white"
                      : "bg-white text-[#6A5242] border border-[#EADECC]"
                  }`}
                >
                  ใกล้หมดอายุ (≤ 3 วัน)
                </button>
                <button
                  onClick={() => setMyCouponsFilter("expired")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    myCouponsFilter === "expired"
                      ? "bg-neutral-700 text-white"
                      : "bg-white text-[#6A5242] border border-[#EADECC]"
                  }`}
                >
                  หมดอายุแล้ว
                </button>
              </div>
            )}

            {/* Content List */}
            {!isLoggedIn ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#EADECC] p-8">
                <Lock className="w-12 h-12 mx-auto text-[#6A5242]/40 mb-3" />
                <h3 className="text-lg font-bold text-[#3C322A]">เข้าสู่ระบบเพื่อดูคูปองของฉัน</h3>
                <p className="text-xs sm:text-sm text-[#6A5242] max-w-md mx-auto mt-1 mb-6">
                  เข้าสู่ระบบหรือสมัครสมาชิก BARE &amp; BOLD เพื่อบันทึกและจัดการคูปองส่วนลด คูปองส่งฟรี และสิทธิพิเศษต่างๆ
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenAuthModal("login")}
                    className="px-6 py-2.5 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-sm font-bold hover:bg-[#556B2F] transition-all"
                  >
                    เข้าสู่ระบบทันที
                  </button>
                  <button
                    onClick={handleRedirectToLogin}
                    className="px-5 py-2.5 rounded-xl border border-[#EADECC] bg-[#F5F0E6] text-sm font-semibold text-[#3C322A] hover:bg-[#EADECC]"
                  >
                    ไปหน้าเข้าสู่ระบบ (Redirect)
                  </button>
                </div>
              </div>
            ) : myFilteredCoupons.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#EADECC] p-8">
                <Ticket className="w-14 h-14 mx-auto text-[#6A5242]/30 mb-3" />
                <h3 className="text-lg font-bold text-[#3C322A]">
                  {collectedCoupons.length === 0
                    ? "คุณยังไม่มีคูปองในกระเป๋า"
                    : "ไม่มีคูปองในหมวดที่เลือก"}
                </h3>
                <p className="text-xs sm:text-sm text-[#6A5242] mt-1 mb-6">
                  {collectedCoupons.length === 0
                    ? "เลือกเก็บคูปองส่วนลดส่งฟรีและส่วนลดร้านค้าได้ที่คลังคูปองทันที"
                    : "ลองเปลี่ยนตัวกรองเพื่อดูคูปองอื่นๆ ในกระเป๋าของคุณ"}
                </p>
                <button
                  onClick={() => setViewMode("browse")}
                  className="px-6 py-2.5 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-sm font-bold hover:bg-[#556B2F] transition-colors"
                >
                  ไปเก็บคูปองส่วนลด →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myFilteredCoupons.map((item) => {
                  const coupon = item.coupon;
                  const remaining = calculateTimeRemaining(item.expiresAt);

                  return (
                    <div
                      key={item.couponId}
                      className={`relative bg-white rounded-3xl border p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                        remaining.expired
                          ? "border-neutral-200 bg-neutral-50/70 opacity-70"
                          : "border-[#EADECC]"
                      }`}
                    >
                      <div>
                        {/* Status Pills */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${remaining.badgeColor}`}
                          >
                            <Clock className="w-3 h-3 inline mr-1" />
                            {remaining.text}
                          </span>

                          <span className="text-xs font-semibold text-[#6A5242] bg-[#F5F0E6] px-2.5 py-0.5 rounded-lg border border-[#EADECC]">
                            {coupon.badgeText}
                          </span>
                        </div>

                        {/* Title & Discount */}
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-extrabold text-[#3C322A]">
                            {coupon.discountDisplay}
                          </span>
                          {coupon.minSpend > 0 ? (
                            <span className="text-xs font-semibold text-[#6A5242]">
                              (เมื่อช้อปครบ ฿{coupon.minSpend.toLocaleString()})
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-700">
                              (ไม่มีขั้นต่ำ)
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-[#3C322A] mb-1">{coupon.title}</h4>
                        <p className="text-xs text-[#6A5242] mb-3">{coupon.sourceName}</p>

                        {/* Requirement 2: อายุการใช้งานของคูปองหลังจากกดรับ */}
                        <div className="bg-[#FDFBF7] p-3 rounded-2xl border border-[#EADECC] space-y-1.5 text-xs text-[#6A5242] mb-4">
                          <div className="flex items-center justify-between">
                            <span>วันที่กดรับคูปอง:</span>
                            <span className="font-bold text-[#3C322A]">
                              {formatDateTimeThai(item.collectedAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>อายุการใช้งาน:</span>
                            <span className="font-bold text-[#3C322A]">
                              {item.validityDays} วันนับจากวันที่กดรับ
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-t border-[#EADECC]/60 pt-1.5">
                            <span>หมดอายุวันที่:</span>
                            <span className="font-bold text-[#3C322A]">
                              {formatDateTimeThai(item.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Coupon Code & Action */}
                      <div className="pt-3 border-t border-[#EADECC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6A5242] font-semibold">รหัสคูปอง:</span>
                          <span className="font-mono font-bold text-xs bg-neutral-100 px-2 py-1 rounded-md text-[#3C322A] border border-neutral-200">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1.5 rounded-lg border border-[#EADECC] bg-white hover:bg-[#F5F0E6] text-[#6A5242] text-xs font-medium"
                            title="คัดลอกโค้ด"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTermsCoupon(coupon)}
                            className="text-xs text-[#6A5242] underline underline-offset-2 hover:text-[#3C322A]"
                          >
                            เงื่อนไข
                          </button>
                          <Link
                            href="/products"
                            className="px-4 py-2 rounded-xl bg-[#3C322A] hover:bg-[#556B2F] text-[#FDFBF7] text-xs font-bold transition-colors shadow-2xs"
                          >
                            นำไปช้อปปิ้งเลย 🛍️
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* =====================================================================
          REQUIREMENT 1: MODAL แจ้งเตือนการเข้าสู่ระบบ (Auth Check Modal)
          แสดงเมื่อลูกค้ากดรับคูปองขณะยังไม่ได้เข้าสู่ระบบ
          มีตัวเลือกให้:
          1) เข้าสู่ระบบในหน้านี้ (Modal)
          2) Redirect ไปหน้าเข้าสู่ระบบ พร้อมจำคูปองเดิมไว้
         ===================================================================== */}
      {isAuthAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-3xl border border-[#EADECC] shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-up">
            <button
              onClick={() => {
                setIsAuthAlertModalOpen(false);
                setPendingCoupon(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6A5242] hover:bg-[#F5F0E6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0E6] border border-[#EADECC] flex items-center justify-center text-[#3C322A] mb-4 shadow-2xs">
              <Lock className="w-7 h-7 text-[#556B2F]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C322A] mb-1.5">
              กรุณาเข้าสู่ระบบก่อนเก็บคูปอง
            </h2>

            <p className="text-xs sm:text-sm text-[#6A5242] mb-5 leading-relaxed">
              สิทธิพิเศษเฉพาะสมาชิก BARE &amp; BOLD
              เมื่อเข้าสู่ระบบแล้วระบบจะทำการเก็บคูปองนี้ลงในกระเป๋าของคุณโดยอัตโนมัติทันที
            </p>

            {/* Target Coupon Preview Card */}
            {pendingCoupon && (
              <div className="p-4 rounded-2xl bg-white border border-[#EADECC] mb-6 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#6A5242] mb-1">
                  <span className="font-semibold">{pendingCoupon.sourceName}</span>
                  <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                    {pendingCoupon.code}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-[#3C322A]">
                    {pendingCoupon.discountDisplay}
                  </span>
                  <span className="text-xs text-[#6A5242]">
                    {pendingCoupon.minSpend > 0
                      ? `ขั้นต่ำ ฿${pendingCoupon.minSpend.toLocaleString()}`
                      : "ไม่มีขั้นต่ำ"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#3C322A]">{pendingCoupon.title}</p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{pendingCoupon.validityText}</span>
                </div>
              </div>
            )}

            {/* Action Buttons: Modal vs Redirect */}
            <div className="space-y-3">
              <button
                onClick={() => handleOpenAuthModal("login")}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#3C322A] hover:bg-[#556B2F] text-[#FDFBF7] text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>เข้าสู่ระบบในหน้านี้ (ไม่ต้องสลับหน้า)</span>
              </button>

              <button
                onClick={handleRedirectToLogin}
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-[#F5F0E6] text-[#3C322A] border border-[#EADECC] text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-[#6A5242]" />
                <span>ไปที่หน้าเข้าสู่ระบบ (Redirect พร้อมจำคูปองเดิม)</span>
              </button>

              {/* 1-Click Demo Login for smooth testing */}
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>เข้าสู่ระบบทดสอบด่วน (1-Click Demo Login)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          INLINE AUTH FORM MODAL (Login / Register)
         ===================================================================== */}
      {isAuthFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl border border-[#EADECC] shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-up">
            <button
              onClick={() => {
                setIsAuthFormModalOpen(false);
                setAuthError("");
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6A5242] hover:bg-[#F5F0E6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F5F0E6] border border-[#EADECC] flex items-center justify-center text-[#3C322A] mb-3">
              <Lock className="w-6 h-6 text-[#556B2F]" />
            </div>

            <h2 className="text-xl font-extrabold text-[#3C322A] mb-1">
              {authMode === "login" ? "เข้าสู่ระบบ BARE & BOLD" : "สมัครสมาชิกใหม่"}
            </h2>
            <p className="text-xs text-[#6A5242] mb-5">
              {pendingCoupon
                ? `เข้าสู่ระบบเพื่อเก็บคูปอง "${pendingCoupon.title}" เข้ากระเป๋าของคุณทันที`
                : "สิทธิพิเศษและโปรโมชันเฉพาะสมาชิก BARE & BOLD"}
            </p>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F5F0E6] border border-[#EADECC] mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "login" ? "bg-[#3C322A] text-[#FDFBF7] shadow-xs" : "text-[#6A5242]"
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "register" ? "bg-[#3C322A] text-[#FDFBF7] shadow-xs" : "text-[#6A5242]"
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleInlineAuthSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6A5242] uppercase mb-1">
                      ชื่อ (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="สมชาย"
                      value={authForm.firstName}
                      onChange={(e) => setAuthForm({ ...authForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADECC] bg-white text-xs focus:outline-none focus:border-[#3C322A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6A5242] uppercase mb-1">
                      นามสกุล (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ใจดี"
                      value={authForm.lastName}
                      onChange={(e) => setAuthForm({ ...authForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADECC] bg-white text-xs focus:outline-none focus:border-[#3C322A]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#6A5242] uppercase mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADECC] bg-white text-xs focus:outline-none focus:border-[#3C322A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6A5242] uppercase mb-1">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADECC] bg-white text-xs focus:outline-none focus:border-[#3C322A]"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-[#3C322A] hover:bg-[#556B2F] text-[#FDFBF7] text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {authSubmitting
                  ? "กำลังดำเนินการ..."
                  : authMode === "login"
                  ? "เข้าสู่ระบบและเก็บคูปอง"
                  : "สมัครสมาชิกและรับสิทธิ์"}
              </button>

              {/* Quick Demo Button inside Form */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={authSubmitting}
                  className="w-full py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  ⚡ เข้าสู่ระบบทดสอบทันที (Demo Test)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          REQUIREMENT 2: MODAL ดูเงื่อนไขการใช้งานคูปอง (Terms Modal)
         ===================================================================== */}
      {selectedTermsCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl border border-[#EADECC] shadow-2xl p-6 sm:p-8 animate-scale-up">
            <button
              onClick={() => setSelectedTermsCoupon(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6A5242] hover:bg-[#F5F0E6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#6A5242] mb-1">
              <Store className="w-3.5 h-3.5" />
              <span>{selectedTermsCoupon.sourceName}</span>
            </div>

            <h3 className="text-xl font-extrabold text-[#3C322A] mb-3">
              เงื่อนไข: {selectedTermsCoupon.title}
            </h3>

            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#EADECC]">
                <span className="text-[11px] text-[#6A5242] block">ยอดสั่งซื้อขั้นต่ำ</span>
                <span className="font-bold text-[#3C322A]">
                  {selectedTermsCoupon.minSpend > 0
                    ? `฿${selectedTermsCoupon.minSpend.toLocaleString()}`
                    : "ไม่มีขั้นต่ำ"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EADECC]">
                <span className="text-[11px] text-[#6A5242] block">อายุคูปองหลังกดรับ</span>
                <span className="font-bold text-[#3C322A]">
                  {selectedTermsCoupon.validityDays} วัน
                </span>
              </div>
            </div>

            {/* Detailed Terms */}
            <div className="text-xs text-[#6A5242] bg-white p-4 rounded-2xl border border-[#EADECC] mb-6 leading-relaxed space-y-2">
              <p className="font-bold text-[#3C322A]">รายละเอียดและข้อกำหนด:</p>
              <p>{selectedTermsCoupon.terms}</p>
            </div>

            <button
              onClick={() => setSelectedTermsCoupon(null)}
              className="w-full py-2.5 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-xs font-bold hover:bg-[#556B2F]"
            >
              รับทราบเงื่อนไข
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          REQUIREMENT 4: SLIDE-OVER DRAWER (กระเป๋าคูปองของฉัน)
         ===================================================================== */}
      {isMyCouponsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl border-l border-[#EADECC] flex flex-col justify-between animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#EADECC] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <Ticket className="w-5 h-5 text-[#556B2F]" />
                <h3 className="text-base font-extrabold text-[#3C322A]">
                  กระเป๋าคูปองของฉัน ({collectedCoupons.length})
                </h3>
              </div>
              <button
                onClick={() => setIsMyCouponsDrawerOpen(false)}
                className="p-1.5 rounded-full text-[#6A5242] hover:bg-[#F5F0E6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
              {!isLoggedIn ? (
                <div className="text-center py-12 text-[#6A5242]">
                  <Lock className="w-10 h-10 mx-auto mb-2 text-[#6A5242]/40" />
                  <p className="text-sm font-bold text-[#3C322A]">ยังไม่ได้เข้าสู่ระบบ</p>
                  <p className="text-xs mt-1 mb-4">เข้าสู่ระบบเพื่อดูกระเป๋าคูปองของคุณ</p>
                  <button
                    onClick={() => {
                      setIsMyCouponsDrawerOpen(false);
                      handleOpenAuthModal("login");
                    }}
                    className="px-5 py-2 rounded-xl bg-[#3C322A] text-[#FDFBF7] text-xs font-bold hover:bg-[#556B2F]"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              ) : collectedCoupons.length === 0 ? (
                <div className="text-center py-12 text-[#6A5242]">
                  <Ticket className="w-10 h-10 mx-auto mb-2 text-[#6A5242]/30" />
                  <p className="text-sm font-bold text-[#3C322A]">คุณยังไม่ได้เก็บคูปองใดๆ</p>
                  <p className="text-xs mt-1">เลือกกดเก็บคูปองจากหน้าหลักได้เลยครับ</p>
                </div>
              ) : (
                collectedCoupons.map((item) => {
                  const coupon = item.coupon;
                  const remaining = calculateTimeRemaining(item.expiresAt);

                  return (
                    <div
                      key={item.couponId}
                      className="p-4 rounded-2xl bg-white border border-[#EADECC] shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#6A5242]">{coupon.sourceName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${remaining.badgeColor}`}>
                          {remaining.text}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#3C322A]">{coupon.discountDisplay}</span>
                        <span className="text-xs text-[#6A5242]">
                          {coupon.minSpend > 0 ? `ขั้นต่ำ ฿${coupon.minSpend}` : "ไม่มีขั้นต่ำ"}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#3C322A] line-clamp-1">{coupon.title}</h5>
                      <div className="text-[11px] text-[#6A5242] bg-[#FDFBF7] p-2 rounded-xl border border-[#EADECC] flex items-center justify-between">
                        <span>อายุใช้งาน: {item.validityDays} วัน</span>
                        <span className="font-mono font-bold text-[#3C322A]">{coupon.code}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#EADECC] bg-white text-center">
              <Link
                href="/products"
                onClick={() => setIsMyCouponsDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#3C322A] hover:bg-[#556B2F] text-[#FDFBF7] text-xs font-bold transition-colors inline-block"
              >
                ไปเลือกซื้อสินค้าที่ร้านค้า 🛍️
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap with Suspense boundary for Next.js App Router query parameter support
export default function CouponsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-anuphan">
          <div className="text-center text-[#6A5242]">
            <div className="w-10 h-10 border-3 border-[#3C322A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">กำลังโหลดศูนย์รวมคูปอง BARE &amp; BOLD...</p>
          </div>
        </div>
      }
    >
      <CouponsPageContent />
    </Suspense>
  );
}
