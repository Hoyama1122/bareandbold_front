"use client";

import React, { useState } from "react";
import Link from "next/link";

// Custom icons
const CheckCircleIcon = () => (
  <svg
    className="w-5 h-5 text-emerald-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PendingIcon = () => (
  <svg
    className="w-5 h-5 text-amber-500 animate-pulse"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-[#3C322A]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// UAT items checklist where developer changes true/false and pushes to main
const INITIAL_UAT_ITEMS = [
  // Section 1: Customer Features
  {
    id: "cust-reg",
    section: "ระบบลูกค้า (Customer Features)",
    title: "1. การสมัครสมาชิก (Customer Registration)",
    step: "ป้อนอีเมลที่ยังไม่มีในฐานข้อมูล รหัสผ่าน 6 ตัวขึ้นไป ชื่อ และนามสกุล",
    expected:
      "สร้างบัญชีสำเร็จ บันทึกลงฐานข้อมูล PostgreSQL พร้อมเข้ารหัสรหัสผ่าน",
    category: "customer",
    passed: true,
  },
  {
    id: "cust-login",
    section: "ระบบลูกค้า (Customer Features)",
    title: "2. การเข้าสู่ระบบ (Customer Login)",
    step: "ป้อนอีเมลและรหัสผ่านเพื่อเข้าใช้งาน",
    expected:
      "เข้าสู่ระบบสำเร็จ ระบบส่ง JWT Token เก็บลง HTTP-only Cookie ของ Browser",
    category: "customer",
    passed: true,
  },

  {
    id: "cust-cart",
    section: "ระบบลูกค้า (Customer Features)",
    title: "3. การจัดการตะกร้าสินค้า (Cart & Made-to-Order Items)",
    step: "กดปุ่มเพิ่มสินค้าพร้อมส่ง หรือสินค้าสั่งตัดลงตะกร้า ปรับเพิ่ม/ลดจำนวนชิ้น หรือลบออก",
    expected:
      "สินค้าปรากฏในตะกร้า ข้อมูลสเปกคัสตอมถูกบันทึก และสามารถปรับจำนวนชิ้นได้จริง",
    category: "customer",
    passed: true,
  },
  {
    id: "cust-checkout",
    section: "ระบบลูกค้า (Customer Features)",
    title: "4. การสั่งซื้อและชำระเงินออนไลน์ (Checkout & Omise Gateway)",
    step: "ระบุชื่อ ที่อยู่ เบอร์โทรศัพท์ และทำรายการชำระเงินจำลองผ่าน Omise API",
    expected:
      "สร้างรหัสใบสั่งซื้อออเดอร์ในสถานะ PENDING พร้อมทำรายการชำระสำเร็จจะเปลี่ยนสถานะอัตโนมัติ",
    category: "customer",
    passed: true,
  },
  {
    id: "cust-track",
    section: "ระบบลูกค้า (Customer Features)",
    title: "5. ติดตามและดูประวัติคำสั่งซื้อ (Order History & Tracking)",
    step: "ลูกค้ากดดูประวัติออเดอร์ของตนเองเพื่อตรวจสอบข้อมูลจัดส่ง",
    expected:
      "แสดงรายการออเดอร์ในสถานะปัจจุบัน เช่น PAID หรือ SHIPPED พร้อมเลขติดตามพัสดุ",
    category: "customer",
    passed: true,
  },

  // Section 2: Staff Features
  {
    id: "staff-products",
    section: "ระบบพนักงาน (Staff Features)",
    title: "6. การจัดการรายการสินค้าในร้าน (Product Catalog Management)",
    step: "พนักงานกดเพิ่มสินค้าใหม่ แก้ไขข้อมูล ราคา หรือทำการลบสินค้า (Soft Delete)",
    expected: "ข้อมูลสินค้าอัปเดต และรายการที่ถูกลบจะไม่แสดงที่หน้าร้านหลัก",
    category: "staff",
    passed: true,
  },
  {
    id: "staff-accessories",
    section: "ระบบพนักงาน (Staff Features)",
    title: "7. การจัดการสต็อกวัสดุคัสตอม (Accessories Stock Control)",
    step: "พนักงานจัดการรายการหินมงคล อะไหล่ประดับ ปรับราคาหรือปรับยอดคงคลังวัสดุ",
    expected:
      "วัสดุในระบบสต็อกคัสตอมอัปเดตยอดคงคลังและราคาให้ลูกค้าออกแบบได้ถูกต้อง",
    category: "staff",
    passed: true,
  },
  {
    id: "staff-orders",
    section: "ระบบพนักงาน (Staff Features)",
    title: "8. การจัดการออเดอร์และการขนส่ง (Order & Shipment Fulfillment)",
    step: "พนักงานตรวจเช็คใบสั่งซื้อที่จ่ายเงินแล้ว ทำการอัปเดตรหัสเลขพัสดุและเปลี่ยนสถานะเป็น SHIPPED",
    expected:
      "สถานะออเดอร์เปลี่ยน และรหัสขนส่งถูกบันทึกส่งตรงไปแสดงฝั่งลูกค้าผู้ซื้อ",
    category: "staff",
    passed: true,
  },

  // Section 3: Manager Features
  {
    id: "mgr-staffs",
    section: "ระบบผู้จัดการ (Manager Features)",
    title: "9. จัดการสิทธิ์และบัญชีพนักงาน (Staff Accounts Management)",
    step: "ผู้จัดการ/แอดมินสร้างบัญชีหรือลบบัญชีทีมงานหลังบ้าน รวมถึงกำหนดระดับสิทธิ์",
    expected: "สร้างพนักงานใหม่เข้าสู่ระบบได้ตามสิทธิ์ที่จำกัดไว้สำเร็จ",
    category: "manager",
    passed: true,
  },
  {
    id: "mgr-dashboard",
    section: "ระบบผู้จัดการ (Manager Features)",
    title: "10. ดูรายงานการขายเชิงธุรกิจ (Executive Analytics Dashboard)",
    step: "ผู้จัดการเข้าดูรายงานสรุปยอดสถิติรายรับและประเภทสัดส่วนออเดอร์",
    expected:
      "แสดงกราฟ/ยอดรวมรายได้ของสินค้าพร้อมส่ง และสินค้าแบบคัสตอมแยกหมวดหมู่ชัดเจน",
    category: "manager",
    passed: true,
  },

  // Section 4: Infrastructure
  {
    id: "infra-upload",
    section: "โครงสร้างพื้นฐานระบบ (Infrastructure)",
    title:
      "11. ระบบอัปโหลดรูปภาพใบเสร็จและสินค้า (Cloudflare R2 Object Storage)",
    step: "อัปโหลดภาพประกอบสินค้า หรืออัปโหลดรูปสลิปตอนแจ้งโอนผ่านหน้าเว็บ",
    expected:
      "ไฟล์รูปภาพถูกจัดเก็บแบบไร้รอยต่อบนคลาวด์ R2 และดึงแสดงผลได้เสถียรปลอดภัย",
    category: "infra",
    passed: true,
  },
];

export default function UatPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'passed' | 'pending'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize passedItems state directly from the static array properties
  const [passedItems, setPassedItems] = useState(() => {
    const initial = {};
    INITIAL_UAT_ITEMS.forEach((item) => {
      initial[item.id] = !!item.passed;
    });
    return initial;
  });

  // Toggle locally in browser state
  const togglePass = (id) => {
    setPassedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetToCodeDefaults = () => {
    const initial = {};
    INITIAL_UAT_ITEMS.forEach((item) => {
      initial[item.id] = !!item.passed;
    });
    setPassedItems(initial);
  };

  // Calculate percentages
  const totalCount = INITIAL_UAT_ITEMS.length;
  const passedCount = INITIAL_UAT_ITEMS.filter(
    (item) => !!passedItems[item.id],
  ).length;
  const percentComplete = Math.round((passedCount / totalCount) * 100);

  // Filter items
  const filteredItems = INITIAL_UAT_ITEMS.filter((item) => {
    // 1. Text Search
    const matchesText =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.step.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesText) return false;

    // 2. Status Filter
    const isPassed = !!passedItems[item.id];
    if (filterMode === "passed") return isPassed;
    if (filterMode === "pending") return !isPassed;

    return true;
  });

  // Group items by section for layout
  const sections = Array.from(
    new Set(filteredItems.map((item) => item.section)),
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan antialiased flex flex-col">
      {/* Nike-Style Minimal Hero */}
      <section className="bg-[#FDFBF7] pt-14 pb-8 px-6 border-b border-[#EADECC]/60">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#556B2F] mb-3">
            CSI204 // SYSTEM TEST PLAN
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[#3C322A]">
                USER ACCEPTANCE
                <br />
                TESTING (UAT)
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="ค้นหาข้อทดสอบ UAT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base text-[#3C322A] py-1.5 pl-2 pr-10 border-b-2 border-[#3C322A] focus:outline-none focus:border-[#556B2F] transition duration-200"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
              </div>
              <span className="hidden sm:inline text-sm font-bold text-[#6A5242]/70">
                UAT v1.1
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Docs Workspace */}
      <div className="max-w-[1440px] mx-auto w-full px-6 py-10 flex-1 flex flex-col md:flex-row gap-10 relative">
        {/* Floating Mobile Index Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 right-6 md:hidden z-50 bg-[#3C322A] text-white py-3 px-6 rounded-full shadow-xl text-sm font-black tracking-widest uppercase flex items-center gap-2 cursor-pointer hover:bg-[#556B2F] transition"
        >
          <span>สารบัญ</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        </button>

        {/* Nike-Style Sidebar Index */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-[#FDFBF7] p-6 border-r border-[#EADECC]/60 transition-transform duration-300 transform 
          md:translate-x-0 md:static md:w-64 md:p-0 md:border-r-0 md:bg-transparent
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="sticky top-28 space-y-6">
            <div>
              <h3 className="text-xs font-black tracking-[0.2em] text-[#3C322A] mb-4">
                เอกสารระบบ
              </h3>
              <nav className="space-y-3.5">
                <Link
                  href="/docs"
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#6A5242]/70 hover:text-[#3C322A] hover:translate-x-0.5 transition-all duration-200"
                >
                  <span>ข้อมูลโครงการ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </Link>

                <Link
                  href="/docs/api"
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#6A5242]/70 hover:text-[#3C322A] hover:translate-x-0.5 transition-all duration-200"
                >
                  <span>เอกสาร API References</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </Link>

                <Link
                  href="/docs/diagrams"
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#6A5242]/70 hover:text-[#3C322A] hover:translate-x-0.5 transition-all duration-200"
                >
                  <span>แผนภาพระบบ & Wireframe</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </Link>

                <Link
                  href="/docs/uat"
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#556B2F] translate-x-1 transition-all duration-200"
                >
                  <span>ผลทดสอบ UAT Checklist</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F] scale-125" />
                </Link>
              </nav>
            </div>

            <div className="border-t border-[#EADECC]/60 pt-6 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#6A5242]">
                BARE & BOLD
              </span>
              <p className="text-xs text-[#6A5242]/90 leading-relaxed font-bold">
                ระบบร้านค้าออนไลน์และคัสตอมสร้อยข้อมือเฉพาะบุคคลแบบสั่งตัด
                (Made-to-Order)
              </p>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-xs"
          />
        )}

        {/* UAT Content Area */}
        <main className="flex-1 space-y-8 min-w-0">
          {/* UAT Score Dashboard */}
          <div className="bg-white border border-[#EADECC]/60 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 flex-1 w-full">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase text-[#6A5242] tracking-wider">
                  ภาพรวมผลการทดสอบความถูกต้อง (UAT Completion Rate)
                </span>
                <span className="text-2xl font-black text-[#3C322A]">
                  {percentComplete}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-[#556B2F] transition-all duration-500 ease-out"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-[#6A5242]">
                <span>
                  ผ่านการทดสอบแล้ว {passedCount} จาก {totalCount} รายการ
                </span>
                <span>เป้าหมายขั้นต่ำ: 100% Passed</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={resetToCodeDefaults}
                className="flex-1 md:flex-none px-4 py-2 border border-[#EADECC] hover:bg-[#F5F0E6]/30 text-xs font-black uppercase tracking-wider transition rounded-lg cursor-pointer"
                title="ย้อนกลับไปใช้ค่าตามโค้ดเริ่มต้น"
              >
                Reset to Code Default
              </button>
            </div>
          </div>

          {/* Filtering Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EADECC]/45 pb-4">
            <div className="flex gap-1.5">
              {[
                { id: "all", label: `รายการทั้งหมด (${totalCount})` },
                { id: "passed", label: `ผ่านแล้ว (${passedCount})` },
                {
                  id: "pending",
                  label: `รอดำเนินการ (${totalCount - passedCount})`,
                },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterMode(filter.id)}
                  className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition ${
                    filterMode === filter.id
                      ? "bg-[#3C322A] text-white shadow-xs"
                      : "bg-white border border-[#EADECC]/60 text-[#6A5242] hover:text-[#3C322A]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* UAT List */}
          <div className="space-y-10">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#EADECC] rounded-2xl bg-white/40">
                <span className="text-sm font-bold text-[#6A5242]/50 italic">
                  ไม่พบการทดสอบ UAT ตามที่ระบุฟิลเตอร์ไว้
                </span>
              </div>
            ) : (
              sections.map((section) => {
                const sectionItems = filteredItems.filter(
                  (item) => item.section === section,
                );
                return (
                  <div key={section} className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-[#556B2F] tracking-widest border-l-2 border-[#556B2F] pl-3">
                      {section}
                    </h3>

                    <div className="grid grid-cols-1 gap-3.5">
                      {sectionItems.map((item) => {
                        const isPassed = !!passedItems[item.id];
                        return (
                          <div
                            key={item.id}
                            className={`p-5 rounded-2xl border transition-all bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                              isPassed
                                ? "border-emerald-500/30 bg-emerald-50/5 shadow-xs"
                                : "border-[#EADECC]/65 hover:border-[#EADECC]"
                            }`}
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${isPassed ? "bg-emerald-500" : "bg-amber-400"}`}
                                />
                                <h4 className="text-sm font-black text-[#3C322A]">
                                  {item.title}
                                </h4>
                              </div>
                              <div className="pl-4 space-y-1 text-xs text-[#6A5242] font-semibold leading-relaxed">
                                <p>
                                  <strong className="font-extrabold text-[#3C322A]">
                                    ขั้นตอนทดสอบ:
                                  </strong>{" "}
                                  {item.step}
                                </p>
                                <p>
                                  <strong className="font-extrabold text-[#3C322A]">
                                    ผลลัพธ์ที่คาดหวัง:
                                  </strong>{" "}
                                  {item.expected}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => togglePass(item.id)}
                              className={`w-full sm:w-auto shrink-0 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition cursor-pointer border ${
                                isPassed
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20"
                                  : "bg-white border-[#EADECC] text-[#3C322A] hover:bg-gray-50"
                              }`}
                            >
                              {isPassed ? (
                                <>
                                  <CheckCircleIcon />
                                  <span>ผ่านแล้ว</span>
                                </>
                              ) : (
                                <>
                                  <PendingIcon />
                                  <span>ตั้งสถานะผ่าน</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
