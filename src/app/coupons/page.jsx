"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/layout/Header"; // ดึง Header ตัวจริงของเว็บมาใช้
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";

import {
  Ticket,
  Truck,
  Store,
  Sparkles,
  Check,
  User,
  LogOut,
  ShoppingBag,
  Search,
  X,
  Lock,
  ArrowRight,
  Clock,
  Info,
  Gift,
  CheckCircle2,
  Menu
} from 'lucide-react';

// ข้อมูลจำลองสำหรับคูปองทั้งหมด (แบ่งเป็นคูปองจากเว็บ และ คูปองจากร้านค้า)
const INITIAL_COUPONS = [
  {
    id: 'cp-web-1',
    sourceType: 'platform',
    sourceName: 'BARE & BOLD Official',
    category: 'shipping',
    title: 'ส่งฟรีทั่วไทย ไม่มีขั้นต่ำ',
    subtitle: 'ส่วนลดค่าจัดส่งสูงสุด ฿45 สำหรับทุกคำสั่งซื้อ',
    discountDisplay: 'ส่งฟรี',
    minSpend: 0,
    expiryDate: '31 ธ.ค. 2569',
    remainingPercent: 42,
    code: 'FREESHIP0',
    badgeText: 'คูปองจากเว็บ',
    terms: 'ใช้ได้กับสินค้าทุกหมวดหมู่บนเว็บไซต์ BARE & BOLD ไม่มียอดสั่งซื้อขั้นต่ำ ระบบจะหักค่าจัดส่งอัตโนมัติในหน้าชำระเงิน'
  },
  {
    id: 'cp-web-2',
    sourceType: 'platform',
    sourceName: 'BARE & BOLD Official',
    category: 'shipping',
    title: 'ส่งฟรี! เมื่อช้อปครบ ฿500',
    subtitle: 'ครอบคลุมค่าจัดส่งด่วนพิเศษสูงสุด ฿60',
    discountDisplay: 'ส่งฟรี ฿60',
    minSpend: 500,
    expiryDate: '31 ธ.ค. 2569',
    remainingPercent: 78,
    code: 'FREESHIP500',
    badgeText: 'คูปองจากเว็บ',
    terms: 'เมื่อมียอดสั่งซื้อรวมตั้งแต่ 500 บาทขึ้นไป เลือกใช้ได้ทันทีในหน้าชำระเงินโดยไม่ต้องกรอกโค้ด'
  },
  {
    id: 'cp-web-3',
    sourceType: 'platform',
    sourceName: 'BARE & BOLD Official',
    category: 'discount',
    title: 'ส่วนลดพิเศษจากเว็บ ฿150',
    subtitle: 'ลดทันที 150 บาท เมื่อช้อปครบ ฿1,500',
    discountDisplay: 'ลด ฿150',
    minSpend: 1500,
    expiryDate: '15 ธ.ค. 2569',
    remainingPercent: 25,
    code: 'BB150SPECIAL',
    badgeText: 'คูปองจากเว็บ',
    terms: 'สามารถใช้ร่วมกับคูปองส่งฟรีจากร้านค้าได้ จำกัด 1 สิทธิ์ต่อ 1 บัญชีผู้ใช้'
  },
  {
    id: 'cp-store-1',
    sourceType: 'store',
    sourceName: 'ร้าน Stone & Soul Jewelry',
    category: 'discount',
    title: 'ลด 15% เครื่องประดับหินธรรมชาติ',
    subtitle: 'ลดสูงสุด ฿300 เมื่อช้อปสินค้าในร้านครบ ฿800',
    discountDisplay: 'ลด 15%',
    minSpend: 800,
    expiryDate: '25 ธ.ค. 2569',
    remainingPercent: 65,
    code: 'STONESOUL15',
    badgeText: 'คูปองร้านค้า',
    terms: 'ใช้ได้เฉพาะสินค้าในร้าน Stone & Soul Jewelry เท่านั้น (กำไลหินมงคล, สร้อยข้อเท้า)'
  },
  {
    id: 'cp-store-2',
    sourceType: 'store',
    sourceName: 'ร้าน Handmade Craft Studio',
    category: 'discount',
    title: 'ส่วนลดร้านค้า ฿100',
    subtitle: 'สำหรับงานถักแฮนด์เมดและสร้อยข้อมือสั่งทำพิเศษ',
    discountDisplay: 'ลด ฿100',
    minSpend: 650,
    expiryDate: '20 ธ.ค. 2569',
    remainingPercent: 84,
    code: 'CRAFT100',
    badgeText: 'คูปองร้านค้า',
    terms: 'ใช้ได้เมื่อสั่งซื้อสินค้าจากร้าน Handmade Craft Studio ครบ 650 บาทขึ้นไป'
  },
  {
    id: 'cp-store-3',
    sourceType: 'store',
    sourceName: 'ร้าน Aroma Glow Organic',
    category: 'shipping',
    title: 'ส่งฟรี + ลดเพิ่ม ฿50 จากร้านค้า',
    subtitle: 'เฉพาะหมวดเทียนหอมอโรมาและเครื่องหอมออร์แกนิก',
    discountDisplay: 'ส่งฟรี + ฿50',
    minSpend: 450,
    expiryDate: '30 ธ.ค. 2569',
    remainingPercent: 50,
    code: 'AROMAFREE',
    badgeText: 'คูปองร้านค้า',
    terms: 'รับสิทธิ์ส่งฟรีพร้อมส่วนลดท้ายบิล 50 บาท เมื่อซื้อสินค้าในร้าน Aroma Glow Organic ครบ 450 บาท'
  }
];

export default function CouponsPage() {
  const [user, setUser] = useState(null); // null = Guest, { name, email } = ล็อกอินแล้ว
  const [collectedIds, setCollectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'platform' | 'store'
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [pendingCouponId, setPendingCouponId] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [selectedTermsCoupon, setSelectedTermsCoupon] = useState(null);
  const [isMyCouponsOpen, setIsMyCouponsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredCoupons = useMemo(() => {
    if (activeTab === 'all') return INITIAL_COUPONS;
    return INITIAL_COUPONS.filter((item) => item.sourceType === activeTab);
  }, [activeTab]);

  const myCollectedCoupons = useMemo(() => {
    return INITIAL_COUPONS.filter((c) => collectedIds.includes(c.id));
  }, [collectedIds]);

  const handleCollectCoupon = (couponId) => {
    if (!user) {
      setPendingCouponId(couponId);
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (collectedIds.includes(couponId)) return;

    setCollectedIds((prev) => [...prev, couponId]);
    const targetCoupon = INITIAL_COUPONS.find((c) => c.id === couponId);
    showToast(`เก็บคูปอง "${targetCoupon?.title}" สำเร็จ! พร้อมใช้งานในหน้าชำระเงิน`);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const displayName =
      authMode === 'register' && formData.name.trim()
        ? formData.name.trim()
        : formData.email
        ? formData.email.split('@')[0]
        : 'คุณลูกค้า BARE & BOLD';

    const loggedInUser = {
      name: displayName,
      email: formData.email || 'member@bareandbold.co.th'
    };

    setUser(loggedInUser);
    setIsAuthModalOpen(false);
    setFormData({ name: '', email: '', password: '' });

    if (pendingCouponId) {
      if (!collectedIds.includes(pendingCouponId)) {
        setCollectedIds((prev) => [...prev, pendingCouponId]);
        const targetCoupon = INITIAL_COUPONS.find((c) => c.id === pendingCouponId);
        showToast(`ยินดีต้อนรับ ${displayName}! ระบบเก็บคูปอง "${targetCoupon?.title}" ให้คุณเรียบร้อยแล้ว`);
      }
      setPendingCouponId(null);
    } else {
      showToast(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${displayName}`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCollectedIds([]);
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#3D2C23] font-sans flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#3D2C23] text-[#F9F6F0] px-5 py-3.5 rounded-xl shadow-xl border border-[#8C7A6B]/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#D8C3A5] shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">{toast.message}</div>
        </div>
      )}

      {/* Header หลักของเว็บ BARE & BOLD */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EFE8DC] via-[#F5EFE6] to-[#E8DEC9] border border-[#E2D8C8] p-6 sm:p-10 mb-8 shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D2C23]/10 text-[#3D2C23] text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>สิทธิพิเศษเฉพาะสมาชิก BARE &amp; BOLD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#3D2C23] tracking-tight leading-snug mb-3">
              ศูนย์รวมคูปองส่วนลด &amp; ส่งฟรี
            </h1>
            <p className="text-sm sm:text-base text-[#6E5D52] leading-relaxed mb-6">
              กดเก็บคูปองส่งฟรีจากเว็บไซต์และส่วนลดพิเศษจากร้านค้าพาร์ทเนอร์ไว้ในบัญชีของคุณ
              เมื่อถึงหน้าชำระเงินสามารถ<strong className="text-[#3D2C23]">กดเลือกใช้ได้ทันทีโดยไม่ต้องกรอกโค้ด</strong>
            </p>

            {!user ? (
              <div className="inline-flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#DFD5C7] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5C493E]">
                  <Lock className="w-4 h-4 text-[#8C7A6B]" />
                  <span>กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนกดรับคูปอง</span>
                </div>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#3D2C23] text-[#F9F6F0] text-xs sm:text-sm font-medium hover:bg-[#2B1E18] transition-colors"
                >
                  เข้าสู่ระบบ / สมัครสมาชิก
                </button>
              </div>
            ) : (
              <div className="inline-flex flex-wrap items-center gap-4 bg-white/85 backdrop-blur-sm border border-[#DFD5C7] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#3D2C23]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>
                    เข้าสู่ระบบในชื่อ <strong>{user.name}</strong> (เก็บแล้ว {collectedIds.length} ใบ)
                  </span>
                </div>
                <button
                  onClick={() => setIsMyCouponsOpen(true)}
                  className="text-xs sm:text-sm font-semibold text-[#3D2C23] underline underline-offset-4 hover:text-[#8C7A6B]"
                >
                  ดูคูปองในกระเป๋าของฉัน →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-[#3D2C23] text-[#F9F6F0] shadow-sm'
                  : 'bg-white text-[#6E5D52] border border-[#E6DFD3] hover:border-[#8C7A6B]'
              }`}
            >
              ทั้งหมด ({INITIAL_COUPONS.length})
            </button>
            <button
              onClick={() => setActiveTab('platform')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'platform'
                  ? 'bg-[#3D2C23] text-[#F9F6F0] shadow-sm'
                  : 'bg-white text-[#6E5D52] border border-[#E6DFD3] hover:border-[#8C7A6B]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>คูปองจาก BARE &amp; BOLD</span>
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'store'
                  ? 'bg-[#3D2C23] text-[#F9F6F0] shadow-sm'
                  : 'bg-white text-[#6E5D52] border border-[#E6DFD3] hover:border-[#8C7A6B]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>คูปองจากร้านค้า</span>
            </button>
          </div>

          <div className="text-xs text-[#8C7A6B] flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>คูปองที่เก็บแล้วจะไปแสดงอัตโนมัติที่หน้าชำระเงิน</span>
          </div>
        </div>

        {/* Grid Coupons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCoupons.map((coupon) => {
            const isCollected = user && collectedIds.includes(coupon.id);
            const isPlatform = coupon.sourceType === 'platform';

            return (
              <div
                key={coupon.id}
                className="group relative bg-white rounded-2xl border border-[#E6DFD3] hover:border-[#B8A898] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        isPlatform
                          ? 'bg-[#3D2C23] text-[#F9F6F0]'
                          : 'bg-[#EFE8DC] text-[#5C493E] border border-[#DFD4C3]'
                      }`}
                    >
                      {isPlatform ? <Truck className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                      {coupon.badgeText}
                    </span>
                    <button
                      onClick={() => setSelectedTermsCoupon(coupon)}
                      className="text-xs text-[#8C7A6B] hover:text-[#3D2C23] underline underline-offset-2"
                    >
                      เงื่อนไข
                    </button>
                  </div>

                  <p className="text-xs font-medium text-[#8C7A6B] mb-1">{coupon.sourceName}</p>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-2xl font-bold text-[#3D2C23]">{coupon.discountDisplay}</span>
                    {coupon.minSpend > 0 ? (
                      <span className="text-xs text-[#6E5D52] bg-[#F9F6F0] px-2 py-0.5 rounded-md border border-[#EAE2D6]">
                        ขั้นต่ำ ฿{coupon.minSpend.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        ไม่มีขั้นต่ำ
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#3D2C23] mb-1">{coupon.title}</h3>
                  <p className="text-xs text-[#6E5D52] leading-relaxed">{coupon.subtitle}</p>
                </div>

                <div className="px-5">
                  <div className="border-t border-dashed border-[#DFD5C7]" />
                </div>

                <div className="p-5 pt-4 bg-[#FCFBF9] flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] mb-1">
                      <span>สิทธิ์คงเหลือ {coupon.remainingPercent}%</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ใช้ได้ถึง {coupon.expiryDate}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EFE8DC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8C7A6B] rounded-full transition-all duration-500"
                        style={{ width: `${coupon.remainingPercent}%` }}
                      />
                    </div>
                  </div>

                  {isCollected ? (
                    <div className="flex items-center gap-2">
                      <button
                        disabled
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#EFE8DC] text-[#5C493E] border border-[#D8CCB9] text-sm font-semibold flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>เก็บคูปองแล้ว</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCollectCoupon(coupon.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#3D2C23] hover:bg-[#2A1D17] text-[#F9F6F0] text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {!user && <Lock className="w-3.5 h-3.5 text-[#D8C3A5]" />}
                      <span>เก็บคูปอง</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* =====================================================================
          MODAL: เข้าสู่ระบบ / สมัครสมาชิก
         ===================================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#F9F6F0] rounded-3xl border border-[#DFD5C7] shadow-2xl overflow-hidden p-6 sm:p-8">
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setPendingCouponId(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-[#6E5D52] hover:bg-[#EFE8DC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] border border-[#DFD5C7] flex items-center justify-center text-[#3D2C23] mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#3D2C23] mb-1.5">
              {authMode === 'login' ? 'เข้าสู่ระบบเพื่อรับคูปอง' : 'สมัครสมาชิกใหม่'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5D52] mb-6 leading-relaxed">
              {pendingCouponId
                ? 'กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อน ระบบจะทำการเก็บคูปองที่คุณเลือกเข้าบัญชีให้อัตโนมัติทันที'
                : 'สิทธิพิเศษสำหรับสมาชิก BARE & BOLD เข้าสู่ระบบเพื่อเก็บคูปองส่งฟรีและส่วนลดร้านค้า'}
            </p>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#EFE8DC] mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-[#3D2C23] text-[#F9F6F0]' : 'text-[#6E5D52]'
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  authMode === 'register' ? 'bg-[#3D2C23] text-[#F9F6F0]' : 'text-[#6E5D52]'
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-[#3D2C23] mb-1">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    required
                    placeholder="กรอกชื่อของคุณ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD5C7] bg-white text-sm focus:outline-none focus:border-[#3D2C23]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[#3D2C23] mb-1">อีเมล</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD5C7] bg-white text-sm focus:outline-none focus:border-[#3D2C23]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3D2C23] mb-1">รหัสผ่าน</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFD5C7] bg-white text-sm focus:outline-none focus:border-[#3D2C23]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#3D2C23] hover:bg-[#2A1D17] text-[#F9F6F0] text-sm font-semibold transition-all shadow-md"
              >
                {authMode === 'login' ? 'เข้าสู่ระบบและเก็บคูปอง' : 'สมัครสมาชิกและรับสิทธิ์'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ดูเงื่อนไขการใช้คูปอง
         ===================================================================== */}
      {selectedTermsCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#F9F6F0] rounded-3xl border border-[#DFD5C7] shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedTermsCoupon(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#6E5D52] hover:bg-[#EFE8DC]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-[#8C7A6B] mb-2">
              <span>{selectedTermsCoupon.sourceName}</span>
            </div>
            <h3 className="text-lg font-bold text-[#3D2C23] mb-2">{selectedTermsCoupon.title}</h3>
            <p className="text-sm text-[#6E5D52] bg-white p-4 rounded-xl border border-[#E6DFD3] mb-6 leading-relaxed">
              {selectedTermsCoupon.terms}
            </p>
            <button
              onClick={() => setSelectedTermsCoupon(null)}
              className="w-full py-2.5 rounded-xl bg-[#3D2C23] text-[#F9F6F0] text-sm font-medium"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: กระเป๋าคูปองของฉัน (My Collected Coupons)
         ===================================================================== */}
      {isMyCouponsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#F9F6F0] rounded-3xl border border-[#DFD5C7] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-[#E6DFD3] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Ticket className="w-5 h-5 text-[#3D2C23]" />
                <h3 className="text-lg font-bold text-[#3D2C23]">กระเป๋าคูปองของฉัน ({myCollectedCoupons.length})</h3>
              </div>
              <button
                onClick={() => setIsMyCouponsOpen(false)}
                className="p-2 rounded-full text-[#6E5D52] hover:bg-[#EFE8DC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {myCollectedCoupons.length === 0 ? (
                <div className="text-center py-12 text-[#8C7A6B]">
                  <Ticket className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">คุณยังไม่ได้เก็บคูปองใดๆ</p>
                  <p className="text-xs mt-1">เลือกกดเก็บคูปองจากหน้าหลักได้เลยครับ</p>
                </div>
              ) : (
                myCollectedCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-4 rounded-2xl bg-white border border-[#E6DFD3] flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-medium text-[#8C7A6B]">{coupon.sourceName}</span>
                      <h4 className="text-sm font-bold text-[#3D2C23]">{coupon.title}</h4>
                      <p className="text-xs text-[#6E5D52]">หมดอายุ: {coupon.expiryDate}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shrink-0">
                      พร้อมใช้
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#E6DFD3] bg-[#EFE8DC] text-center text-xs text-[#6E5D52]">
              ไปที่หน้าชำระเงินเพื่อกดเลือกใช้คูปองเหล่านี้ได้ทันทีโดยไม่ต้องกรอกโค้ด
            </div>
          </div>
        </div>
      )}
    </div>
  );
}