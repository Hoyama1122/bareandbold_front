"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Simple custom SVG icons
const SearchIcon = () => (
  <svg className="w-5 h-5 text-[#3C322A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  // Load Mermaid dynamically from CDN
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.mermaid) {
      setMermaidLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        themeVariables: {
          primaryColor: "#EADECC",
          edgeLabelBackground: "#FDFBF7",
          lineColor: "#6A5242"
        }
      });
      setMermaidLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Trigger rendering when mermaid is loaded
  useEffect(() => {
    if (mermaidLoaded && window.mermaid) {
      try {
        setTimeout(() => {
          window.mermaid.run();
        }, 50);
      } catch (e) {
        console.error("Mermaid render error:", e);
      }
    }
  }, [mermaidLoaded, searchQuery]); // Re-render Mermaid if search changes and diagram is shown

  // Search Helper
  const matchesSearch = (textArray) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return textArray.some(text => 
      text && text.toLowerCase().includes(query)
    );
  };

  // Define section match conditions
  const showProjectInfo = matchesSearch([
    "บทนำโครงการ", "01",
    "ข้อมูลโครงการ",
    "ชื่ออย่างเป็นทางการ",
    "ระบบร้านค้าออนไลน์และคัสตอมสร้อยข้อมือ Bare & Bold",
    "Bare & Bold (Custom Bracelet E-Commerce Platform)",
    "หลักการและเหตุผล", "RATIONALE",
    "ระบบที่รองรับการสั่งซื้อสินค้าออนไลน์และการคัสตอมสร้อยข้อมือเฉพาะบุคคล (Made-to-Order)"
  ]);

  const showGroupInfo = matchesSearch([
    "ผู้รับผิดชอบ", "02",
    "รายชื่อสมาชิกและบทบาท",
    "รหัสนักศึกษา",
    "ชื่อ-นามสกุล",
    "บทบาทหน้าที่รับผิดชอบ",
    "ณภัทร พลดงนอก", "67095025", "Project Manager", "System Analyst", "หัวหน้ากลุ่ม",
    "ภาณุพัฒน์ อ่อนตา", "67136081", "Frontend Developer", "นักพัฒนา",
    "สุพิชญาณ์ ชื่นชม", "67150301", "Backend Developer", "นักพัฒนา",
    "ธราธร พัฒนพวงสิทธิ์", "67146201", "Database Admin", "Software Tester", "นักทดสอบ", "DBA"
  ]);

  const showObjectives = matchesSearch([
    "เป้าหมายโครงการ", "03",
    "วัตถุประสงค์โครงการ",
    "Requirement Analysis & Planning", "วิเคราะห์ความต้องการและกำหนดขอบเขตระบบ",
    "System & Database Design", "ออกแบบสถาปัตยกรรมระบบ",
    "System Development", "พัฒนาระบบด้วย Next.js และ Hono API",
    "System Testing", "ดำเนินการทดสอบฟังก์ชันการทำงานหลัก",
    "Deployment & Maintenance", "ติดตั้งระบบซอฟต์แวร์บนสภาพแวดล้อมจริง"
  ]);

  const showScopeActors = matchesSearch([
    "ผู้ใช้ระบบ", "04",
    "ผู้ใช้งานในระบบ", "Actors",
    "Customer", "ลูกค้า", "สมัครสมาชิก", "เข้าสู่ระบบ", "ตะกร้าสินค้า", "สั่งซื้อสินค้า", "ชำระเงิน", "ติดตามคำสั่งซื้อ", "รายการโปรด",
    "Staff", "พนักงาน", "จัดการสินค้า", "จัดการหมวดหมู่", "จัดการคำสั่งซื้อ", "จัดการการจัดส่ง",
    "Manager", "ผู้จัดการ", "สิทธิ์การทำงาน", "จัดการลูกค้า", "รายงานและสถิติ", "ตั้งค่าระบบ"
  ]);

  const showScopeFunctions = matchesSearch([
    "ขอบเขตฟังก์ชัน", "05",
    "ความสามารถหลักของระบบ",
    "ระบบสมาชิก", "Register", "Login",
    "ระบบจัดการสินค้า", "Product Inventory",
    "ระบบค้นหาและซื้อขาย", "Catalog", "Cart", "Payment",
    "ระบบจัดการสถานะคำสั่งซื้อ", "Order Fulfillment",
    "ระบบรายงานยอดขาย", "Revenue Dashboard"
  ]);

  const showTechnologies = matchesSearch([
    "เครื่องมือ", "06",
    "เครื่องมือและเทคโนโลยี",
    "Frontend Layer", "React.js", "Next.js", "Tailwind CSS",
    "Backend & Database", "Node.js", "Bun", "PostgreSQL", "Neon DB", "Cloudflare R2",
    "Utilities", "Figma", "Git", "GitHub", "Mermaid Diagram",
    "System Architecture Diagram", "สถาปัตยกรรมระบบ"
  ]);

  const showTesting = matchesSearch([
    "การรับประกัน", "07",
    "แนวทางการทดสอบระบบ",
    "Functional Testing", "Postman",
    "User Acceptance Testing", "UAT", "Manual Testing"
  ]);

  const showOutcomes = matchesSearch([
    "คาดหวัง", "08",
    "ผลลัพธ์ที่คาดว่าจะได้รับ",
    "ระบบตลาดซื้อขายกำไลข้อมือ",
    "อัปเดตรายการสินค้าแบบสั่งตัด",
    "ตรวจรับสถานะขนส่งพัสดุ",
    "เอกสารข้อมูลจำเพาะระบบ"
  ]);

  const showTimeline = matchesSearch([
    "กำหนดส่ง", "09",
    "แผนการดำเนินงาน", "Timeline",
    "WEEK 01", "SYSTEM ANALYSIS & DESIGN",
    "WEEK 02", "FRONTEND FRAMEWORK DEVELOPMENT",
    "WEEK 03", "BACKEND SERVICES & DB INTEGRATION",
    "WEEK 04", "SYSTEM TESTING & DEPLOYMENT"
  ]);

  const hasAnyMatch = showProjectInfo || showGroupInfo || showObjectives || showScopeActors || showScopeFunctions || showTechnologies || showTesting || showOutcomes || showTimeline;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan antialiased flex flex-col">
      {/* Nike-Style Minimal Hero */}
      <section className="bg-[#FDFBF7] pt-14 pb-8 px-6 border-b border-[#EADECC]/60">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#556B2F] mb-3">
            CSI204 // SYSTEM SPECIFICATION
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[#3C322A]">
              REQUIREMENT<br />SPECIFICATION
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="ค้นหาข้อมูล..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base text-[#3C322A] py-1.5 pl-2 pr-10 border-b-2 border-[#3C322A] focus:outline-none focus:border-[#556B2F] transition duration-200"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
              </div>
              <span className="hidden sm:inline text-sm font-bold text-[#6A5242]/70">เวอร์ชัน 1.1</span>
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
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-[#FDFBF7] p-6 border-r border-[#EADECC]/60 transition-transform duration-300 transform 
          md:translate-x-0 md:static md:w-64 md:p-0 md:border-r-0 md:bg-transparent
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="sticky top-28 space-y-6">
            <div>
              <h3 className="text-xs font-black tracking-[0.2em] text-[#3C322A] mb-4">
                เอกสารระบบ
              </h3>
              <nav className="space-y-3.5">
                <Link
                  href="/docs"
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#556B2F] translate-x-1 transition-all duration-200"
                >
                  <span>ข้อมูลโครงการ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F] scale-125" />
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
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#6A5242]/70 hover:text-[#3C322A] hover:translate-x-0.5 transition-all duration-200"
                >
                  <span>ผลทดสอบ UAT Checklist</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </Link>
              </nav>
            </div>

            <div className="border-t border-[#EADECC]/60 pt-6 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#6A5242]">BARE & BOLD</span>
              <p className="text-xs text-[#6A5242]/90 leading-relaxed font-bold">
                ระบบร้านค้าออนไลน์และคัสตอมสร้อยข้อมือเฉพาะบุคคลแบบสั่งตัด (Made-to-Order)
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

        {/* Document Sections */}
        <main className="flex-1 space-y-16 pb-24">
          {!hasAnyMatch && (
            <div className="text-center py-20 border border-dashed border-[#EADECC] rounded-2xl">
              <span className="text-sm font-bold text-[#6A5242]/50 italic">ไม่พบข้อมูลที่ค้นหา ลองใช้คำค้นหาอื่น</span>
            </div>
          )}

          {/* Section: Project Title */}
          {showProjectInfo && (
            <section id="project-info" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">01 // บทนำโครงการ</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">ข้อมูลโครงการ</h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-[#6A5242] tracking-wider mb-1.5">ชื่ออย่างเป็นทางการ</h4>
                  <p className="text-xl md:text-2xl font-black text-[#3C322A] leading-tight">
                    ระบบร้านค้าออนไลน์และคัสตอมสร้อยข้อมือ Bare & Bold
                  </p>
                  <p className="text-lg font-bold text-[#556B2F] mt-1">
                    Bare & Bold (Custom Bracelet E-Commerce Platform)
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EADECC]/40">
                  <h4 className="text-xs font-black text-[#6A5242] tracking-wider mb-2.5">หลักการและเหตุผล (RATIONALE)</h4>
                  <p className="text-sm md:text-base text-[#3C322A] leading-relaxed font-bold max-w-3xl">
                    ระบบที่รองรับการสั่งซื้อสินค้าออนไลน์และการคัสตอมสร้อยข้อมือเฉพาะบุคคล (Made-to-Order) โดยสามารถเลือกวัสดุชิ้นส่วนตกแต่งได้ตามความต้องการ พร้อมทั้งระบบหลังบ้านสำหรับพนักงานและผู้จัดการเพื่อความเป็นระเบียบและประสิทธิภาพในการดำเนินงาน
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section: Group Info */}
          {showGroupInfo && (
            <section id="group-info" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">02 // ผู้รับผิดชอบ</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">รายชื่อสมาชิกและบทบาท</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#3C322A] text-[#3C322A] font-black tracking-wider">
                      <th className="pb-3 pl-1 w-12">ลำดับ</th>
                      <th className="pb-3 w-32">รหัสนักศึกษา</th>
                      <th className="pb-3 w-56">ชื่อ-นามสกุล</th>
                      <th className="pb-3">บทบาทหน้าที่รับผิดชอบ</th>
                      <th className="pb-3 text-right pr-1 w-28">สถานะทีม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADECC]/40 text-[#3C322A] font-bold text-sm">
                    <tr className="hover:bg-[#F5F0E6]/30 transition duration-150">
                      <td className="py-3.5 pl-1 font-black">1</td>
                      <td className="py-3.5">67095025</td>
                      <td className="py-3.5 font-black">ณภัทร พลดงนอก</td>
                      <td className="py-3.5">Project Manager / System Analyst</td>
                      <td className="py-3.5 text-right pr-1">
                        <span className="text-[11px] font-black px-2.5 py-1 bg-[#3C322A] text-white">หัวหน้ากลุ่ม</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F5F0E6]/30 transition duration-150">
                      <td className="py-3.5 pl-1 font-black">2</td>
                      <td className="py-3.5">67136081</td>
                      <td className="py-3.5 font-black">ภาณุพัฒน์ อ่อนตา</td>
                      <td className="py-3.5">Frontend Developer</td>
                      <td className="py-3.5 text-right pr-1">
                        <span className="text-[11px] font-black px-2.5 py-1 bg-[#556B2F] text-white">นักพัฒนา</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F5F0E6]/30 transition duration-150">
                      <td className="py-3.5 pl-1 font-black">3</td>
                      <td className="py-3.5">67150301</td>
                      <td className="py-3.5 font-black">สุพิชญาณ์ ชื่นชม</td>
                      <td className="py-3.5">Backend Developer</td>
                      <td className="py-3.5 text-right pr-1">
                        <span className="text-[11px] font-black px-2.5 py-1 bg-[#556B2F] text-white">นักพัฒนา</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F5F0E6]/30 transition duration-150">
                      <td className="py-3.5 pl-1 font-black">4</td>
                      <td className="py-3.5">67146201</td>
                      <td className="py-3.5 font-black">ธราธร พัฒนพวงสิทธิ์</td>
                      <td className="py-3.5">Database Admin / Software Tester</td>
                      <td className="py-3.5 text-right pr-1">
                        <span className="text-[11px] font-black px-2.5 py-1 bg-[#6A5242] text-white">นักทดสอบ/DBA</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Section: Objectives */}
          {showObjectives && (
            <section id="objectives" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">03 // เป้าหมายโครงการ</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">วัตถุประสงค์โครงการ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    label: "01 / Requirement Analysis & Planning",
                    desc: "วิเคราะห์ความต้องการและกำหนดขอบเขตระบบร้านค้าออนไลน์และการคัสตอมสร้อยข้อมือเฉพาะบุคคลของแบรนด์ Bare & Bold เพื่อตอบสนองความต้องการของผู้ใช้ในระบบได้ครบถ้วน",
                  },
                  {
                    label: "02 / System & Database Design",
                    desc: "ออกแบบสถาปัตยกรรมระบบ โครงสร้างฐานข้อมูลเชิงสัมพันธ์ (PostgreSQL) และออกแบบประสบการณ์ผู้ใช้งาน (UI/UX) ทั้งส่วนหน้าร้าน (Storefront) และระบบหลังบ้าน (Backoffice)",
                  },
                  {
                    label: "03 / System Development",
                    desc: "พัฒนาระบบด้วย Next.js และ Hono API ที่มีประสิทธิภาพ เชื่อมต่อระบบชำระเงิน Omise Payment Gateway และจำลองระบบขนส่งพัสดุด้วย Mock Shipping API ได้อย่างถูกต้องปลอดภัย",
                  },
                  {
                    label: "04 / System Testing",
                    desc: "ดำเนินการทดสอบฟังก์ชันการทำงานหลัก (Functional Testing) และทดสอบ UAT ร่วมกับผู้ใช้งาน เพื่อป้องกันข้อผิดพลาดและความไม่ปลอดภัยของข้อมูลธุรกรรมการซื้อขาย",
                  },
                  {
                    label: "05 / Deployment & Maintenance",
                    desc: "ติดตั้งระบบซอฟต์แวร์บนสภาพแวดล้อมจริงเพื่อเปิดบริการ และทำเอกสารข้อมูลจำเพาะเชิงเทคนิค (System Specification Doc) สำหรับนำมาใช้อ้างอิงเพื่อบำรุงรักษาและพัฒนาต่อยอดได้ง่าย",
                  }
                ].map((obj, i) => (
                  <div key={i} className="border-l-2 border-[#3C322A] pl-4 space-y-1">
                    <h4 className="text-xs font-black tracking-wider text-[#556B2F]">{obj.label}</h4>
                    <p className="text-sm font-bold text-[#3C322A] leading-relaxed">{obj.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Actors */}
          {showScopeActors && (
            <section id="scope-actors" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">04 // ผู้ใช้ระบบ</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">ผู้ใช้งานในระบบ (Actors)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#3C322A] text-white tracking-widest inline-block">CUSTOMER</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3C322A]" />
                  </div>
                  <h4 className="text-base font-black text-[#3C322A]">1. ลูกค้า</h4>
                  <ul className="space-y-2.5 text-xs text-[#6A5242] font-bold list-disc pl-4">
                    <li>สมัครสมาชิก (Register)</li>
                    <li>เข้าสู่ระบบ (Login)</li>
                    <li>จัดการข้อมูลส่วนตัว (Profile Management)</li>
                    <li>ค้นหาสินค้า และดูรายละเอียดสินค้า (สินค้าพร้อมส่ง และสินค้า Made-to-Order)</li>
                    <li>เพิ่มสินค้าลงตะกร้า (Add to Cart)</li>
                    <li>จัดการตะกร้าสินค้า (Cart Management)</li>
                    <li>สั่งซื้อสินค้า (Place Order)</li>
                    <li>ชำระเงิน (Payment)</li>
                    <li>ติดตามคำสั่งซื้อ (Order Tracking)</li>
                    <li>รายการโปรด (Wishlist)</li>
                    <li>ติดต่อสอบถาม</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#556B2F] text-white tracking-widest inline-block">STAFF</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F]" />
                  </div>
                  <h4 className="text-base font-black text-[#3C322A]">2. พนักงาน (Staff)</h4>
                  <ul className="space-y-2.5 text-xs text-[#6A5242] font-bold list-disc pl-4">
                    <li>จัดการสินค้า (Product Management)</li>
                    <li>จัดการหมวดหมู่สินค้า (Category Management)</li>
                    <li>จัดการคำสั่งซื้อ (Order Management)</li>
                    <li>จัดการการจัดส่ง (Shipping Management)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#6A5242] text-white tracking-widest inline-block">MANAGER</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6A5242]" />
                  </div>
                  <h4 className="text-base font-black text-[#3C322A]">3. ผู้จัดการ (Manager / Admin)</h4>
                  <ul className="space-y-2.5 text-xs text-[#6A5242] font-bold list-disc pl-4">
                    <li className="list-none -ml-4 text-[#556B2F] font-black">★ ครอบคลุมสิทธิ์การทำงานทั้งหมดของพนักงาน (Staff)</li>
                    <li>จัดการลูกค้า (Customer Management)</li>
                    <li>ดูรายงานและสถิติ (Reports & Analytics Dashboard)</li>
                    <li>ตั้งค่าระบบ (System Settings)</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Section: Main Functions */}
          {showScopeFunctions && (
            <section id="scope-functions" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">05 // ขอบเขตฟังก์ชัน</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">ความสามารถหลักของระบบ</h2>
              
              <div className="divide-y divide-[#EADECC]/40">
                {[
                  { title: "ระบบสมาชิก (Register / Login)", desc: "ระบบลงทะเบียนและเข้าใช้สำหรับ ลูกค้า ผู้ขาย และผู้ควบคุมแพลตฟอร์ม" },
                  { title: "ระบบจัดการสินค้า (Product Inventory)", desc: "อัปโหลดและอัปเดตข้อมูลรายการสินค้าปกติและสินค้าแบบคัสตอม (Made-to-Order)" },
                  { title: "ระบบค้นหาและซื้อขาย (Catalog, Cart & Payment)", desc: "ระบบกรองสินค้า ค้นหาด้วยคีย์เวิร์ด ตะกร้าสินค้า และหน้าชำระเงินที่สะดวกสบาย" },
                  { title: "ระบบจัดการสถานะคำสั่งซื้อ (Order Fulfillment)", desc: "อัปเดตกระบวนการทำรายการสั่งซื้อ ยืนยันคำสั่งซื้อคัสตอม และจำลองสถานะการขนส่งพัสดุ" },
                  { title: "ระบบรายงานยอดขาย (Revenue Dashboard)", desc: "สรุปยอดการขาย รายรับ และสถิติต่างๆ แบบกราฟกราฟฟิกเพื่อให้ร้านค้าวางแผนการผลิต" }
                ].map((func, i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#556B2F]">0{i + 1}</span>
                      <h4 className="text-sm font-black text-[#3C322A]">{func.title}</h4>
                    </div>
                    <p className="text-xs text-[#6A5242] sm:text-right max-w-lg font-bold">{func.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Technologies */}
          {showTechnologies && (
            <section id="technologies" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">06 // เครื่องมือ</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">เครื่องมือและเทคโนโลยี</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold mb-8">
                <div className="space-y-3">
                  <h4 className="font-black text-[#3C322A] uppercase tracking-wider border-b-2 border-[#3C322A] pb-1.5 text-sm">FRONTEND LAYER</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span>React.js / Next.js</span><span className="text-[#6A5242]/70 font-black">App Router</span></li>
                    <li className="flex justify-between"><span>Tailwind CSS v4</span><span className="text-[#6A5242]/70 font-black">Styling</span></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-[#3C322A] uppercase tracking-wider border-b-2 border-[#3C322A] pb-1.5 text-sm">BACKEND & DATABASE</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span>Node.js / Bun</span><span className="text-[#6A5242]/70 font-black">Runtime</span></li>
                    <li className="flex justify-between"><span>PostgreSQL</span><span className="text-[#6A5242]/70 font-black">Neon DB</span></li>
                    <li className="flex justify-between"><span>Cloudflare R2</span><span className="text-[#6A5242]/70 font-black">Object Storage</span></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-[#3C322A] uppercase tracking-wider border-b-2 border-[#3C322A] pb-1.5 text-sm">UTILITIES</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span>Figma</span><span className="text-[#6A5242]/70 font-black">UI Design</span></li>
                    <li className="flex justify-between"><span>Git / GitHub</span><span className="text-[#6A5242]/70 font-black">Version Control</span></li>
                    <li className="flex justify-between"><span>Mermaid Diagram</span><span className="text-[#6A5242]/70 font-black">Visualization</span></li>
                  </ul>
                </div>
              </div>

              {/* System Architecture Diagram */}
              <div className="border-t border-[#EADECC]/45 pt-8 space-y-4">
                <h3 className="text-base font-black text-[#3C322A] uppercase tracking-tight">System Architecture Diagram</h3>
                <p className="text-xs text-[#6A5242] font-bold">
                  แผนผังสถาปัตยกรรมระบบ (System Architecture) ของ Bare & Bold แสดงการเชื่อมต่อและการทำงานระหว่าง Frontend, Backend API และ Database
                </p>
                
                <div className="border border-[#EADECC]/30 rounded-xl bg-[#FDFBF7]/30 p-6 overflow-auto flex items-center justify-start min-h-[300px]">
                  {!mermaidLoaded ? (
                    <div className="text-xs font-bold text-gray-400 animate-pulse">กำลังโหลดระบบวาดแผนผัง...</div>
                  ) : (
                    <div className="mermaid min-w-[800px] lg:min-w-[1000px] origin-left">
                      {`graph LR
    %% Actors
    Customer["Customer / Buyer"]
    Admin["Admin / Manager"]
    Staff["Staff"]

    %% Frontend Layer
    subgraph Frontend ["Frontend Layer"]
        Storefront["Storefront Interface (:3000)"]
        Backoffice["Backoffice Dashboard (:3001)"]
    end

    %% Backend API Services
    subgraph Backend ["Backend API Layer (:8000)"]
        AuthService["Auth Service"]
        ProductService["Product Service"]
        OrderService["Order & Cart Service"]
        CategoryService["Category Service"]
        UploadService["Upload Service"]
        PaymentService["Payment Service"]
        ShippingService["Shipping Service (Mock)"]
    end

    %% Database & External Gateways
    subgraph Storage ["Data & Gateways Layer"]
        Postgres[(PostgreSQL Neon)]
        R2[(Cloudflare R2)]
        Omise["Omise Gateway"]
    end

    %% Connections - Users to UI
    Customer --> Storefront
    Admin --> Backoffice
    Staff --> Backoffice

    %% Connections - UI to API Services
    Storefront --> AuthService
    Storefront --> ProductService
    Storefront --> OrderService
    Storefront --> PaymentService

    Backoffice --> ProductService
    Backoffice --> CategoryService
    Backoffice --> OrderService
    Backoffice --> UploadService

    %% Connections - API Services to Databases
    AuthService --> Postgres
    ProductService --> Postgres
    CategoryService --> Postgres
    OrderService --> Postgres
    PaymentService --> Postgres

    UploadService --> R2
    PaymentService --> Omise
    OrderService --> ShippingService`}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section: Testing */}
          {showTesting && (
            <section id="testing" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">07 // การรับประกัน</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">แนวทางการทดสอบระบบ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold leading-relaxed">
                <div className="space-y-1.5">
                  <span className="text-xs font-black text-[#556B2F] tracking-wider block">01 // FUNCTIONAL TESTING</span>
                  <p className="text-[#3C322A] font-bold">
                    ทำการทดสอบระบบหยิบกำไลข้อมือใส่ตะกร้า คีย์ป้อนตัวเลือกแบบสั่งตัด ยืนยันการสั่งซื้อ การตรวจสอบค่า Request/Response ของ API โดยตรง และทดสอบฝั่ง Endpoint หลังบ้านร่วมกับ <strong>Postman</strong> เพื่อให้ส่งกลับข้อมูลที่ถูกต้องครบถ้วน
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-black text-[#556B2F] tracking-wider block">02 // USER ACCEPTANCE TESTING (UAT)</span>
                  <p className="text-[#3C322A] font-bold">
                    ให้ผู้ใช้งานจำลองสถานะบทบาทเพื่อสั่งซื้อและเปิดรับออเดอร์ร้านค้า (Manual Testing) ตรวจสอบความถูกต้องของแดชบอร์ดสรุปรายรับ การทำงานของปุ่ม ป้ายแจ้งสถานะ การแสดงผลหน้าสินค้า เพื่อการรับมอบงานและมอบหมายขั้นตอนการทำงานอย่างมีมาตรฐาน
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section: Outcomes */}
          {showOutcomes && (
            <section id="outcomes" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">08 // คาดหวัง</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">ผลลัพธ์ที่คาดว่าจะได้รับ</h2>
              
              <div className="space-y-3.5 text-sm font-bold text-[#3C322A]">
                {[
                  "ได้รับระบบตลาดซื้อขายกำไลข้อมือและข้อเท้าที่ครบวงจรและพร้อมเปิดให้บริการแก่ร้านค้าและลูกค้า",
                  "ฝั่งผู้ขายสามารถอัปโหลด อัปเดตรายการสินค้าแบบสั่งตัด (Made-to-Order) และตรวจสอบกราฟรายรับรวมอย่างสะดวก",
                  "ฝั่งผู้ซื้อได้รับประสบการณ์เข้าสู่ระบบ ออกแบบสีกำไล ขนาดข้อเท้า ส่งคำสั่งซื้อ และตรวจรับสถานะขนส่งพัสดุได้อย่างรวดเร็ว",
                  "จัดเตรียมเอกสารข้อมูลจำเพาะระบบ (SRS Specifications) ครบถ้วนเสร็จสมบูรณ์ถูกต้องตามกระบวนการซอฟต์แวร์วิศวกรรม"
                ].map((outcome, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-[#556B2F] font-black">{idx + 1}.</span>
                    <p className="font-bold">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Timeline */}
          {showTimeline && (
            <section id="timeline" className="scroll-mt-24 pb-12">
              <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">09 // กำหนดส่ง</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">แผนการดำเนินงาน (Timeline)</h2>

              <div className="space-y-4">
                {[
                  { week: "WEEK 01", title: "SYSTEM ANALYSIS & DESIGN", desc: "วิเคราะห์ฟังก์ชันระบบ ออกแบบโครงร่างความต้องการ เขียน ER-Diagram ตารางความสัมพันธ์ฐานข้อมูล และจัดทำ UI Prototype (Figma)" },
                  { week: "WEEK 02", title: "FRONTEND FRAMEWORK DEVELOPMENT", desc: "ประกอบโครงร่างฝั่งไคลเอนต์ (Next.js) เขียนหน้าแสดงสินค้า ตะกร้าสะสม สั่งซื้อกำไลคัสตอม และหน้าแสดงรายงานผู้ขาย (Seller Dashboard)" },
                  { week: "WEEK 03", title: "BACKEND SERVICES & DB INTEGRATION", desc: "พัฒนาฝั่งหลังบ้านเชื่อมต่อ Node.js สร้าง API จัดเก็บลง Neon PostgreSQL บริหารจัดการอัปโหลดสลิปและรูปภาพผ่าน Cloudflare R2" },
                  { week: "WEEK 04", title: "SYSTEM TESTING & DEPLOYMENT", desc: "ทดสอบการทำงานของระบบ (UAT / Functional Testing) ทั้งฝั่ง API ด้วย Postman และ Manual UI Test แก้บัค และส่งโปรเจกต์รายวิชา" }
                ].map((step, idx) => (
                  <div key={idx} className="py-3 border-b border-[#EADECC]/40 flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-24 shrink-0">
                      <span className="text-xs font-black text-[#556B2F]">{step.week}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-[#3C322A]">{step.title}</h4>
                      <p className="text-xs text-[#6A5242] leading-relaxed font-bold">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
