"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

// Simple custom SVG icons
const SearchIcon = () => (
  <svg className="w-5 h-5 text-[#3C322A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SECTIONS = [
  { id: "project-info", title: "ข้อมูลโครงการ" },
  { id: "group-info", title: "รายชื่อสมาชิกและบทบาท" },
  { id: "objectives", title: "วัตถุประสงค์โครงการ" },
  { id: "scope-actors", title: "ผู้ใช้งานในระบบ (Actors)" },
  { id: "scope-functions", title: "ความสามารถหลักของระบบ" },
  { id: "architecture", title: "สถาปัตยกรรมระบบ" },
  { id: "technologies", title: "เครื่องมือและเทคโนโลยี" },
  { id: "testing", title: "แนวทางการทดสอบระบบ" },
  { id: "outcomes", title: "ผลลัพธ์ที่คาดว่าจะได้รับ" },
  { id: "timeline", title: "แผนการดำเนินงาน (Timeline)" }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("project-info");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedArchNode, setSelectedArchNode] = useState("buyer-ui");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
      setActiveSection(id);
      setIsSidebarOpen(false);
    }
  };

  const filteredSections = SECTIONS.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan antialiased flex flex-col">
      {/* Navigation Header */}
      <Header isLoggedIn={false} />

      {/* Nike-Style Minimal Hero */}
      <section className="bg-[#FDFBF7] pt-14 pb-8 px-6 md:px-12 border-b border-[#EADECC]/60">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#556B2F] mb-3">
            CSI204 // SYSTEM SPECIFICATION
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black uppercase tracking-tight leading-none text-[#3C322A]">
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
              <span className="hidden sm:inline text-sm font-bold text-[#6A5242]/70">เวอร์ชัน 1.0 (อนุมัติแล้ว)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Docs Workspace */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-10 flex-1 flex flex-col md:flex-row gap-10 relative">
        
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
                สารบัญเอกสาร
              </h3>
              <nav className="space-y-3.5">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="group w-full text-left flex items-center justify-between cursor-pointer"
                  >
                    <span className={`text-[13px] font-black tracking-wider transition-all duration-200 ${
                      activeSection === section.id
                        ? "text-[#556B2F] translate-x-1"
                        : "text-[#6A5242]/70 hover:text-[#3C322A] hover:translate-x-0.5"
                    }`}>
                      {section.title}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeSection === section.id ? "bg-[#556B2F] scale-125" : "bg-transparent"
                    }`} />
                  </button>
                ))}
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

          {/* Section: Project Title */}
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

          {/* Section: Group Info */}
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
          {/* Section: Objectives */}
          <section id="objectives" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
            <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">03 // เป้าหมายโครงการ</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">วัตถุประสงค์โครงการ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "01 / ระบบร้านค้าออนไลน์",
                  desc: "สร้างระบบ e-Commerce ของแบรนด์ Bare & Bold สำหรับวางจำหน่ายกำไลข้อมือและกำไลข้อเท้าออนไลน์",
                },
                {
                  label: "02 / การคัสตอมสินค้าพิเศษ",
                  desc: "รองรับการสั่งทำแบบพิเศษ (Custom / Made-to-Order) โดยเปิดให้ลูกค้าเลือกอะไหล่ตกแต่งได้เองตามใจชอบ",
                },
                {
                  label: "03 / การจัดการที่มีประสิทธิภาพ",
                  desc: "มีระบบหลังบ้านสำหรับจัดการสต็อกสินค้า คำสั่งซื้อ ตรวจสอบการจัดส่งสินค้า และจัดการชำระเงินอย่างเป็นระบบ",
                },
                {
                  label: "04 / ระบบรายงานยอดขายเรียลไทม์",
                  desc: "แสดงยอดขาย รายรับรวม และสถิติที่สำคัญต่างๆ ในรูปแบบ Dashboard แบบเรียลไทม์",
                },
              ].map((obj, i) => (
                <div
                  key={i}
                  className="border-l-2 border-[#3C322A] pl-4 space-y-1"
                >
                  <h4 className="text-xs font-black tracking-wider text-[#556B2F]">
                    {obj.label}
                  </h4>
                  <p className="text-sm font-bold text-[#3C322A] leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
          {/* Section: Actors */}
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
                  <li>จัดการการชำระเงิน (Payment Management)</li>
                  <li>ดูรายงานและสถิติ (Reports & Analytics Dashboard)</li>
                  <li>ตั้งค่าระบบ (System Settings)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Main Functions */}
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

          {/* Section: Architecture */}
          <section id="architecture" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
            <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">06 // สถาปัตยกรรม</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-3">สถาปัตยกรรมระบบ</h2>
            <p className="text-xs text-[#6A5242]/70 mb-6 font-bold">
              คลิกเลือกส่วนประกอบสถาปัตยกรรมเพื่อดูบทบาทการรับส่งข้อมูลในเชิงลึก
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-3 gap-3">
                {/* Column: Frontend */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-[#6A5242] tracking-wider mb-1">FRONTEND LAYERS</h4>
                  {["buyer-ui", "backoffice-ui"].map((node) => (
                    <button
                      key={node}
                      onClick={() => setSelectedArchNode(node)}
                      className={`w-full p-3.5 text-left border text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                        selectedArchNode === node
                          ? "bg-[#3C322A] text-[#FDFBF7] border-[#3C322A]"
                          : "bg-transparent border-[#EADECC] text-[#3C322A] hover:border-[#3C322A]"
                      }`}
                    >
                      {node.replace("-", " ")}
                    </button>
                  ))}
                </div>

                {/* Column: Services */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-[#6A5242] tracking-wider mb-1">API SERVICES</h4>
                  {["auth", "product", "order", "payment", "shipping"].map((node) => (
                    <button
                      key={node}
                      onClick={() => setSelectedArchNode(node)}
                      className={`w-full p-2.5 text-left border text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                        selectedArchNode === node
                          ? "bg-[#556B2F] text-[#FDFBF7] border-[#556B2F]"
                          : "bg-transparent border-[#EADECC] text-[#3C322A] hover:border-[#556B2F]"
                      }`}
                    >
                      {node} service
                    </button>
                  ))}
                </div>

                {/* Column: Storage / DB */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-[#6A5242] tracking-wider mb-1">INFRASTRUCTURE</h4>
                  {["db", "storage", "omise"].map((node) => (
                    <button
                      key={node}
                      onClick={() => setSelectedArchNode(node)}
                      className={`w-full p-3.5 text-left border text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                        selectedArchNode === node
                          ? "bg-[#6A5242] text-[#FDFBF7] border-[#6A5242]"
                          : "bg-transparent border-[#EADECC] text-[#3C322A] hover:border-[#6A5242]"
                      }`}
                    >
                      {node === "db" ? "Postgres (Neon)" : node === "storage" ? "R2 Cloud" : "Omise Gateway"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Node explanation panel */}
              <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-[#3C322A] pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-center">
                <h4 className="text-[10px] font-black uppercase text-[#556B2F] tracking-widest mb-1.5">
                  ข้อมูลการทำงานของโหนด
                </h4>
                <div className="min-h-36 text-xs">
                  {selectedArchNode ? (
                    <div className="space-y-2">
                      <h3 className="text-lg font-black uppercase text-[#3C322A]">
                        {selectedArchNode.replace("-", " ")}
                      </h3>
                      <p className="text-xs text-[#6A5242] leading-relaxed font-bold">
                        {selectedArchNode === "buyer-ui" && "หน้าเว็บส่วนของลูกค้า (Storefront) สำหรับเลือกชมสินค้า ค้นหา ออกแบบและสั่งทำกำไลคัสตอม รวมถึงชำระเงินออนไลน์ผ่านระบบ"}
                        {selectedArchNode === "backoffice-ui" && "หน้าเว็บระบบหลังบ้าน (Backoffice) สำหรับพนักงาน (Staff) ในการจัดการคำสั่งซื้อ การจัดส่ง และสต็อกสินค้า และสำหรับผู้จัดการ (Manager) ในการดูแลข้อมูลสินค้าและดูแดชบอร์ดรายงานยอดขาย"}
                        {selectedArchNode === "auth" && "บริการบริหารระบบความปลอดภัยและเข้าสู่ระบบ สมัครสมาชิก ตรวจสอบ Token (JWT/Session) เพื่อแยกบทบาทความรับผิดชอบในการใช้งาน"}
                        {selectedArchNode === "product" && "บริการจัดการคลังสินค้า รับ-ส่งข้อมูลคุณลักษณะ ขนาดสินค้า และตัวเลือกกำไลแบบสำเร็จรูปหรือแบบ Made-to-Order"}
                        {selectedArchNode === "order" && "บริการจัดการตะกร้าสินค้า ดำเนินการออกคำสั่งสินค้าใหม่ และจัดทำข้อมูลสรุปรายการสั่งเพื่อส่งต่อไปยังผู้ขาย"}
                        {selectedArchNode === "payment" && "บริการเชื่อมต่อธุรกรรมทางการเงินภายนอก ในการชำระผ่าน PromptPay QR code และ บัตรเครดิต"}
                        {selectedArchNode === "shipping" && "ระบบจำลองสถานะเลขขนส่งพัสดุ (Mock Data) สำหรับอัปเดตการติดตามการจัดส่งให้แก่ฝั่งลูกค้าได้รับรู้"}
                        {selectedArchNode === "db" && "ฐานข้อมูลแบบคลาวด์ PostgreSQL (Neon) ในการจัดเก็บข้อมูลแบบ Relational เช่น ตารางบัญชีสินค้า รายชื่อลูกค้า และประวัติการทำรายการซื้อขาย"}
                        {selectedArchNode === "storage" && "บริการเก็บข้อมูลรูปภาพไฟล์ขนาดใหญ่แบบ URL (Cloudflare R2 Object Storage) เช่น ภาพหลักฐานการจ่ายเงินและภาพถ่ายตัวอย่างสินค้า"}
                        {selectedArchNode === "omise" && "ตัวกลางธุรกรรมทางกฎหมายการเงิน (Omise Payment Gateway) เชื่อมต่อ API เพื่อยืนยันการตัดบัตรอย่างเป็นสากลและปลอดภัย"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#6A5242] italic">เลือกส่วนประกอบทางซ้ายเพื่อแสดงข้อมูล</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Technologies */}
          <section id="technologies" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
            <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">07 // เครื่องมือ</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#3C322A] uppercase mb-6">เครื่องมือและเทคโนโลยี</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold">
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
          </section>

          {/* Section: Testing */}
          <section id="testing" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
            <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">08 // การรับประกัน</span>
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

          {/* Section: Outcomes */}
          <section id="outcomes" className="scroll-mt-24 border-b border-[#EADECC]/40 pb-12">
            <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">09 // คาดหวัง</span>
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

          {/* Section: Timeline */}
          <section id="timeline" className="scroll-mt-24 pb-12">
            <span className="text-xs font-black tracking-[0.25em] text-[#556B2F] block mb-2">10 // กำหนดส่ง</span>
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

        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
