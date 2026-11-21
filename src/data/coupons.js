// Shared coupons database and helper utilities

export const INITIAL_COUPONS = [
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
    discountAmount: 50,
    minSpend: 0,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 62,
    status: "available",
    terms: "ใช้ได้กับสินค้าทุกหมวดหมู่บนเว็บไซต์ BARE & BOLD ไม่มียอดสั่งซื้อขั้นต่ำ รับส่วนลดค่าจัดส่งสูงสุด 50 บาท ระบบจะหักส่วนลดค่าจัดส่งอัตโนมัติในหน้าชำระเงิน",
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
    terms: "เมื่อมียอดสั่งซื้อสินค้ารวมตั้งแต่ 500 บาทขึ้นไป ส่วนลดค่าจัดส่งมูลค่าสูงสุด 60 บาท",
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
    terms: "ใช้ได้เฉพาะสินค้าในร้าน Stone & Soul Jewelry ยอดซื้อขั้นต่ำ 400 บาท หักค่าจัดส่งอัตโนมัติในขั้นตอน Checkout",
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
    terms: "ใช้เป็นส่วนลดท้ายบิลทันที 150 บาท เมื่อช้อปสินค้าบนเว็บไซต์ BARE & BOLD ครบ 1,500 บาทขึ้นไป",
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
    terms: "ใช้ได้เมื่อสั่งซื้อสินค้าจากร้าน Handmade Craft Studio ครบ 550 บาทขึ้นไป",
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
    terms: "ส่วนลดมูลค่า 300 บาท เมื่อซื้อสินค้าสะสมครบ 2,500 บาท",
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
    maxDiscountAmount: 300,
    maxDiscountText: "ลดสูงสุด ฿300",
    minSpend: 800,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 58,
    status: "available",
    terms: "รับส่วนลด 15% (ลดได้สูงสุด 300 บาท) เมื่อช้อปสินค้าครบ 800 บาท ใช้ได้กับสินค้าทุกชิ้นในร้าน",
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
    maxDiscountAmount: 250,
    maxDiscountText: "ลดสูงสุด ฿250",
    minSpend: 700,
    validityDays: 7,
    validityText: "ใช้ได้ภายใน 7 วันนับจากวันที่กดรับ",
    remainingPercent: 42,
    status: "available",
    terms: "ส่วนลด 20% สูงสุด 250 บาท เมื่อช้อปสินค้าครบ 700 บาท",
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
    maxDiscountAmount: 500,
    maxDiscountText: "ลดสูงสุด ฿500",
    minSpend: 1200,
    validityDays: 14,
    validityText: "ใช้ได้ภายใน 14 วันนับจากวันที่กดรับ",
    remainingPercent: 88,
    status: "available",
    terms: "สิทธิพิเศษส่วนลด 10% สูงสุด 500 บาท เมื่อมียอดซื้อตั้งแต่ 1,200 บาทขึ้นไป",
  },
];

// Helper to determine storage key for collected coupons per user
export function getUserCouponsStorageKey(user) {
  if (!user) return "bare_user_collected_coupons_default";
  const id = user.email || user.id || user._id || "default";
  return `bare_user_collected_coupons_${id}`;
}

// Helper to read collected coupons from localStorage
export function getCollectedCoupons(user) {
  if (typeof window === "undefined") return [];
  try {
    const key = getUserCouponsStorageKey(user);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Fallback check generic storage key if user-specific is empty
    const defaultSaved = localStorage.getItem("bare_user_collected_coupons_default");
    if (defaultSaved) {
      const parsed = JSON.parse(defaultSaved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read collected coupons:", e);
  }
  return [];
}

// Calculate discount result
export function calculateCouponDiscount(coupon, subtotal, shippingFee = 0) {
  if (!coupon) {
    return {
      valid: false,
      discountAmount: 0,
      shippingDiscount: 0,
      reason: "ไม่มีคูปองที่เลือก",
    };
  }

  const minSpend = Number(coupon.minSpend) || 0;
  if (subtotal < minSpend) {
    const diff = minSpend - subtotal;
    return {
      valid: false,
      discountAmount: 0,
      shippingDiscount: 0,
      minSpend,
      diff,
      reason: `ยอดสั่งซื้อยังไม่ถึงขั้นต่ำ ฿${minSpend.toLocaleString()} (ช้อปเพิ่มอีก ฿${diff.toLocaleString()})`,
    };
  }

  // 1. Shipping Discount
  if (coupon.discountType === "shipping" || coupon.category === "shipping") {
    const maxDiscount = Number(coupon.discountAmount) || shippingFee;
    const effectiveShippingDiscount = Math.min(shippingFee, maxDiscount);
    return {
      valid: true,
      type: "shipping",
      discountAmount: 0,
      shippingDiscount: effectiveShippingDiscount,
      displayText: `ฟรีค่าจัดส่ง (-฿${effectiveShippingDiscount.toLocaleString()})`,
    };
  }

  // 2. Fixed Baht Discount
  if (coupon.discountType === "fixed" || coupon.category === "discount_fixed") {
    const amount = Number(coupon.discountAmount) || 0;
    const effectiveDiscount = Math.min(subtotal, amount);
    return {
      valid: true,
      type: "fixed",
      discountAmount: effectiveDiscount,
      shippingDiscount: 0,
      displayText: `ลดทันที ฿${effectiveDiscount.toLocaleString()}`,
    };
  }

  // 3. Percent Discount
  if (coupon.discountType === "percent" || coupon.category === "discount_percent") {
    const pct = Number(coupon.discountAmount) || 0;
    let rawDiscount = Math.round((subtotal * pct) / 100);
    const maxAmount = Number(coupon.maxDiscountAmount);
    if (!isNaN(maxAmount) && maxAmount > 0 && rawDiscount > maxAmount) {
      rawDiscount = maxAmount;
    }
    const effectiveDiscount = Math.min(subtotal, rawDiscount);
    return {
      valid: true,
      type: "percent",
      discountAmount: effectiveDiscount,
      shippingDiscount: 0,
      displayText: `ลด ${pct}% (-฿${effectiveDiscount.toLocaleString()})`,
    };
  }

  return {
    valid: false,
    discountAmount: 0,
    shippingDiscount: 0,
    reason: "ประเภทคูปองไม่ถูกต้อง",
  };
}
