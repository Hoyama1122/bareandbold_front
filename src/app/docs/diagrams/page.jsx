"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Custom icons
const CopyIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
    />
  </svg>
);

const SECTIONS = [
  { id: "project-info", title: "ข้อมูลโครงการ" },
  { id: "group-info", title: "รายชื่อสมาชิกและบทบาท" },
  { id: "objectives", title: "วัตถุประสงค์โครงการ" },
  { id: "scope-actors", title: "ผู้ใช้งานในระบบ (Actors)" },
  { id: "scope-functions", title: "ความสามารถหลักของระบบ" },
  { id: "technologies", title: "เครื่องมือและเทคโนโลยี" },
  { id: "testing", title: "แนวทางการทดสอบระบบ" },
  { id: "outcomes", title: "ผลลัพธ์ที่คาดว่าจะได้รับ" },
  { id: "timeline", title: "แผนการดำเนินงาน (Timeline)" },
];

const DIAGRAMS_DATA = {
  usecase: `graph LR
    Guest["ผู้ใช้งานทั่วไป (Guest)"]
    Customer["ลูกค้า (Customer)"]
    Staff["พนักงาน (Staff)"]
    Manager["ผู้จัดการ (Manager / Admin)"]

    Customer --> Guest
    Manager --> Staff

    subgraph SystemBoundary [" ระบบร้านค้าออนไลน์และคัสตอมสร้อยข้อมือ Bare & Bold "]
        subgraph GuestUC ["ฟังก์ชันทั่วไป (Guest Features)"]
            UC_Browse["เรียกดูหน้าแรก"]
            UC_Search["ค้นหาสินค้า"]
            UC_ViewDetail["ดูรายละเอียดสินค้า"]
        end

        subgraph CustomerUC ["สำหรับลูกค้า (Customer Features)"]
            UC_Register["สมัครสมาชิก (Register)"]
            UC_Login["เข้าสู่ระบบ (Login)"]
            UC_Profile["จัดการข้อมูลส่วนตัว"]
            UC_EditProfile["แก้ไขข้อมูลส่วนตัว"]
            UC_Custom["ออกแบบสั่งคัสตอมสร้อยข้อมือ"]
            UC_Cart["จัดการตะกร้าสินค้า"]
            UC_Checkout["สั่งซื้อสินค้า (Checkout)"]
            UC_Address["ระบุที่อยู่จัดส่ง"]
            UC_PayMethod["เลือกช่องทางการชำระเงิน"]
            UC_Payment["ชำระเงินออนไลน์ (Payment)"]
            UC_Track["ติดตามคำสั่งซื้อ"]
            UC_Wishlist["จัดการรายการโปรด"]
            UC_Contact["ติดต่อสอบถามร้านค้า"]
        end

        subgraph StaffAdminUC ["สำหรับทีมงานและผู้บริหาร (Staff & Admin Features)"]
            UC_ManageStock["จัดการสต็อกสินค้า"]
            UC_ManageCategory["จัดการหมวดหมู่สินค้า"]
           
          
            UC_ManageShipping["จัดการสถานะจัดส่ง"]
            UC_ManageProduct["จัดการข้อมูลสินค้า (เพิ่ม/แก้ไข/ลบ)"]
            UC_ManageUsers["จัดการผู้ใช้งานและพนักงาน"]
            UC_Dashboard["ดูรายงานสรุปยอดขาย (Dashboard)"]
            UC_Settings["ตั้งค่าระบบ"]
        end
    end

    UC_Profile -.->|"<<include>>"| UC_EditProfile
    UC_Checkout -.->|"<<include>>"| UC_Address
    UC_Checkout -.->|"<<include>>"| UC_PayMethod
    UC_Checkout -.->|"<<include>>"| UC_Payment
    
  

    Guest --- UC_Browse
    Guest --- UC_Search
    Guest --- UC_ViewDetail

    Customer --- UC_Register
    Customer --- UC_Login
    Customer --- UC_Profile
    Customer --- UC_Custom
    Customer --- UC_Cart
    Customer --- UC_Checkout
    Customer --- UC_Track
    Customer --- UC_Wishlist
    Customer --- UC_Contact

    Staff --- UC_ManageStock
    Staff --- UC_ManageCategory
 
    Staff --- UC_ManageShipping

    Manager --- UC_ManageProduct
    Manager --- UC_ManageUsers
    Manager --- UC_Dashboard
    Manager --- UC_Settings

    Omise["ระบบชำระเงิน (Omise Gateway)"]
    ShippingAPI["ระบบขนส่งจำลอง (Mock Shipping API)"]

    UC_Payment --- Omise
    UC_Track --- ShippingAPI
    UC_ManageShipping --- ShippingAPI`,
  class: `classDiagram
    class User {
        +String id
        +String email
        +String password
        +String firstName
        +String lastName
        +String phone
        +String address
    }
    class Product {
        +String id
        +String name
        +String description
        +Decimal price
        +String type
        +Int stock
        +Boolean isDeleted
    }
    class CustomOption {
        +String id
        +String name
        +Boolean isRequired
    }
    class CustomOptionValue {
        +String id
        +String value
        +Decimal priceAdjustment
    }
    class Order {
        +String id
        +String userId
        +String status
        +Decimal totalPrice
        +String shippingAddress
    }
    class OrderItem {
        +String id
        +String orderId
        +String productId
        +Int quantity
        +Decimal price
    }
    Product "1" *--> "*" CustomOption
    CustomOption "1" *--> "*" CustomOptionValue
    Order "1" *--> "*" OrderItem
    User "1" o--> "*" Order`,
  sequence_customer: `sequenceDiagram
    autonumber
    actor Customer as ลูกค้า
    participant UI as หน้าร้าน (Next.js)
    participant API as ระบบ API หลังบ้าน
    participant Omise as Omise Payment Gateway
    participant DB as ฐานข้อมูล Neon

    Customer->>UI: ออกแบบสายกำไล และคลิกเพิ่มลงตะกร้า
    Customer->>UI: ตรวจสอบสรุปยอด และคลิกสั่งซื้อ (Buy Now)
    UI->>API: POST /api/orders (สร้างข้อมูลใบสั่งซื้อ)
    API->>DB: บันทึกใบสั่งซื้อสถานะ "PENDING"
    DB-->>API: ยืนยันการบันทึกข้อมูล
    API-->>UI: ส่งกลับข้อมูล Order ID
    Customer->>UI: ยืนยันชำระเงิน (PromptPay QR)
    UI->>API: POST /api/payments/checkout
    API->>Omise: เรียกใช้ Charge API เพื่อสร้าง QR Code
    Omise-->>API: ส่งข้อมูล QR Code และ Transaction Token
    API-->>UI: แสดง QR Code ให้ลูกค้าสแกนจ่ายเงิน
    Customer->>Omise: ทำรายการโอนเงินสแกนจ่ายสำเร็จ
    Omise->>API: Webhook (Charge Success Event)
    API->>DB: อัปเดตสถานะ Order เป็น "PAID"
    API->>DB: ตัดสต็อกสินค้าในคลัง (Product Stock)
    API-->>UI: แจ้งสถานะการชำระเงินสำเร็จ
    UI-->>Customer: แสดงหน้าจอชำระเงินสำเร็จ`,
  sequence_staff: `sequenceDiagram
    autonumber
    actor Staff as พนักงาน (Staff/Admin)
    participant AdminUI as หลังบ้าน (Backoffice)
    participant API as ระบบ API หลังบ้าน
    participant DB as ฐานข้อมูล Neon
    participant Shipping as Mock Shipping API

    Staff->>AdminUI: ล็อกอิน และเปิดแถบจัดการออเดอร์
    AdminUI->>API: GET /api/orders (ดึงรายการออเดอร์ทั้งหมด)
    API->>DB: ค้นหาออเดอร์สถานะ "PAID"
    DB-->>API: ส่งคืนรายการออเดอร์
    API-->>AdminUI: เรนเดอร์ตารางรายการสั่งซื้อที่ชำระเงินแล้ว
    Staff->>AdminUI: คลิกส่งออกของระบุขนส่งและใส่ Tracking Number
    AdminUI->>API: PUT /api/admin/orders/:id (อัปเดตขนส่ง)
    API->>Shipping: POST /api/mock-shipping/ship (ส่งข้อมูลจำลองขนส่ง)
    Shipping-->>API: ส่งรหัสอ้างอิงและยืนยันการจัดส่งพัสดุ
    API->>DB: อัปเดตสถานะออเดอร์เป็น "SHIPPED" พร้อมบันทึก Tracking ID
    DB-->>API: บันทึกเรียบร้อย
    API-->>AdminUI: แสดงสถานะอัปเดตจัดส่งสำเร็จ
    AdminUI-->>Staff: เปลี่ยนป้ายสถานะจัดส่งเป็น "จัดส่งเรียบร้อย"`,
};

const JSON_TABLES_SCHEMA = {
  User: `{
  "tableName": "User",
  "description": "ตารางเก็บข้อมูลสิทธิ์และโปรไฟล์ของลูกค้า",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "email": "String (Unique) - อีเมลเข้าสู่ระบบ",
    "password": "String (bcrypt hashed) - รหัสผ่านเข้ารหัส",
    "firstName": "String (Optional) - ชื่อจริง",
    "lastName": "String (Optional) - นามสกุล",
    "phone": "String (Optional) - เบอร์โทรศัพท์",
    "address": "String (Optional) - ที่อยู่สำหรับจัดส่งพัสดุเริ่มต้น",
    "createdAt": "DateTime - วันที่สร้างไอดี",
    "updatedAt": "DateTime - วันที่อัปเดตข้อมูลล่าสุด"
  }
}`,
  Employee: `{
  "tableName": "Employee",
  "description": "ตารางเก็บข้อมูลบัญชีผู้ปฏิบัติงานหลังบ้านและแอดมิน",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "email": "String (Unique) - อีเมลทำงาน",
    "password": "String (bcrypt hashed) - รหัสผ่าน",
    "firstName": "String (Optional) - ชื่อพนักงาน",
    "lastName": "String (Optional) - นามสกุล",
    "role": "String - บทบาทหน้าที่ ('admin' | 'staff')",
    "isDeleted": "Boolean - สถานะลบบัญชีแบบ Soft Delete",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  Product: `{
  "tableName": "Product",
  "description": "ตารางข้อมูลสินค้าสร้อยกำไลข้อมือ/ข้อเท้า",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "name": "String - ชื่อสินค้า",
    "description": "String (Optional) - คำอธิบายรายละเอียดสินค้า",
    "price": "Decimal (10,2) - ราคาสินค้าหลัก",
    "originalPrice": "Decimal (10,2, Optional) - ราคาจริงก่อนลดราคา",
    "type": "String - ประเภทสินค้า ('READY_TO_SHIP' | 'MADE_TO_ORDER')",
    "category": "String - หมวดหมู่สินค้า ('BRACELET' | 'ANKLET')",
    "stock": "Int - จำนวนคงค้างในคลัง (MADE_TO_ORDER เป็น 0 เสมอ)",
    "isDeleted": "Boolean - สัญลักษณ์ลบชั่วคราว",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  CustomOption: `{
  "tableName": "CustomOption",
  "description": "ตารางตัวเลือกของสั่งทำ เช่น ขนาดข้อมือ รูปแบบสาย",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "productId": "String (Foreign Key -> Product.id)",
    "name": "String - ชื่อตัวเลือก (เช่น 'ขนาดรอบข้อมือ')",
    "isRequired": "Boolean - บังคับเลือกตัวเลือกนี้หรือไม่",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  CustomOptionValue: `{
  "tableName": "CustomOptionValue",
  "description": "ตารางค่าตัวเลือกย่อยของสเปกสินค้าทำตามสั่ง",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "optionId": "String (Foreign Key -> CustomOption.id)",
    "value": "String - คำค่าตัวเลือก (เช่น '15 ซม.', '16 ซม.')",
    "priceAdjustment": "Decimal (10,2) - ราคาส่วนต่างบวกเพิ่มเมื่อสั่งขนาดนี้",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  Accessory: `{
  "tableName": "Accessory",
  "description": "ตารางคลังอะไหล่หิน จี้มงคล ตัวคล้อง และลูกปัดสำหรับสั่งทำ",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "name": "String - ชื่อวัตถุดิบ/ชิ้นส่วนตกแต่ง",
    "description": "String (Optional)",
    "price": "Decimal (10,2) - ราคาชิ้นส่วนต่อหน่วย",
    "stock": "Int - สต็อกชิ้นส่วนคงเหลือ",
    "imageUrl": "String (Optional) - ที่อยู่ภาพอะไหล่",
    "categoryId": "String (Foreign Key -> Category.id)",
    "isDeleted": "Boolean",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  CartItem: `{
  "tableName": "CartItem",
  "description": "รายการสินค้าในตะกร้าของแต่ละบัญชี",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "cartId": "String (Foreign Key -> Cart.id)",
    "productId": "String (Foreign Key -> Product.id)",
    "quantity": "Int - จำนวนสินค้าที่ต้องการสั่ง",
    "customDetails": "Json (Optional) - ข้อมูลขนาดข้อมือ/สายคัสตอมในตะกร้า",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  Order: `{
  "tableName": "Order",
  "description": "ตารางบันทึกการทำธุรกรรมการจองและซื้อสินค้า",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "userId": "String (Foreign Key -> User.id)",
    "status": "String - สถานะสินค้า ('PENDING'|'PAID'|'SHIPPED'|'DELIVERED'|'CANCELLED')",
    "totalPrice": "Decimal (10,2) - ยอดรวมสุทธิของบิลคำสั่งซื้อนี้",
    "shippingAddress": "String - ที่อยู่จริงที่ระบุจัดส่งของรายการบิลนี้",
    "recipientName": "String - ชื่อผู้รับสินค้าปลายทาง",
    "recipientPhone": "String - เบอร์ติดต่อปลายทาง",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  Payment: `{
  "tableName": "Payment",
  "description": "ตารางเก็บข้อมูลสถานะการโอนเงิน/ชำระเงินออนไลน์",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "orderId": "String (Unique, Foreign Key -> Order.id)",
    "amount": "Decimal (10,2) - ยอดเงินรวมที่ชำระจริง",
    "paymentMethod": "String - วิธีจ่ายเงิน ('CREDIT_CARD' | 'PROMPTPAY')",
    "status": "String - สถานะจ่ายเงิน ('PENDING' | 'SUCCESS' | 'FAILED')",
    "omiseChargeId": "String (Optional) - รหัส Transaction ของ Omise",
    "paidAt": "DateTime (Optional) - วันที่ชำระเงินเสร็จสิ้น",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
  Shipping: `{
  "tableName": "Shipping",
  "description": "ตารางติดตามสถานะการส่งพัสดุและรหัส Tracking",
  "fields": {
    "id": "String (UUID) - Primary Key",
    "orderId": "String (Unique, Foreign Key -> Order.id)",
    "trackingNumber": "String (Optional) - เลขพัสดุสำหรับเช็คขนส่ง",
    "carrier": "String - ผู้ให้บริการขนส่งพัสดุ (เช่น 'MockShipping')",
    "status": "String - สถานะพัสดุ ('PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED')",
    "shippedAt": "DateTime (Optional) - วันที่ส่งของออกไป",
    "deliveredAt": "DateTime (Optional) - วันที่ของถึงมือผู้รับ",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}`,
};

export default function DiagramsPage() {
  const [selectedDiagram, setSelectedDiagram] = useState("usecase"); // "usecase" | "class" | "sequence" | "schema" | "wireframe"
  const [viewMode, setViewMode] = useState("visual"); // "visual" | "code"
  const [selectedJsonTable, setSelectedJsonTable] = useState("User"); // for Database Schema JSON selection
  const [copiedText, setCopiedText] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Load Mermaid dynamically from CDN
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.mermaid) {
      setMermaidLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        themeVariables: {
          primaryColor: "#EADECC",
          edgeLabelBackground: "#FDFBF7",
          lineColor: "#6A5242",
        },
      });
      setMermaidLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Trigger rendering when diagram/mode changes
  useEffect(() => {
    if (mermaidLoaded && window.mermaid && viewMode === "visual") {
      try {
        // Wrap rendering in timeout to make sure React has updated the DOM node
        setTimeout(() => {
          window.mermaid.run();
        }, 50);
      } catch (e) {
        console.error("Mermaid render error:", e);
      }
    }
  }, [selectedDiagram, viewMode, mermaidLoaded]);

  // Reset zoom when diagram changes
  useEffect(() => {
    setZoomScale(1);
  }, [selectedDiagram]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

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
              SYSTEM DIAGRAMS
              <br />& WIREFRAMES
            </h1>

            <span className="text-sm font-bold text-[#6A5242]/70">
              เวอร์ชัน 1.1
            </span>
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
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#556B2F] translate-x-1 transition-all duration-200"
                >
                  <span>แผนภาพระบบ & Wireframe</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F] scale-125" />
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

        {/* Workspace Display */}
        <main className="flex-1 space-y-6 pb-24 min-w-0">
          {/* Diagrams Sub-Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EADECC]/40 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "usecase", label: "Use Case Diagram" },
                { id: "class", label: "Class Diagram" },
                { id: "sequence", label: "Sequence Diagram" },
                { id: "schema", label: "Database Schema" },
                { id: "wireframe", label: "Wireframe" },
                { id: "persona", label: "User Personas" },
              ].map((diag) => (
                <button
                  key={diag.id}
                  onClick={() => {
                    setSelectedDiagram(diag.id);
                    setViewMode("visual"); // reset to visual on tab switch
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedDiagram === diag.id
                      ? "bg-[#3C322A] text-white shadow-xs"
                      : "bg-[#F5F0E6]/30 text-[#6A5242]/85 hover:text-[#3C322A] hover:bg-[#F5F0E6]/80"
                  }`}
                >
                  {diag.label}
                </button>
              ))}
            </div>

            {/* Toggle between Visual and Code for supported diagrams */}
            {["usecase", "class", "sequence"].includes(selectedDiagram) && (
              <div className="flex bg-[#F5F0E6]/50 rounded-lg p-1 border border-[#EADECC]/40">
                <button
                  onClick={() => setViewMode("visual")}
                  className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-md cursor-pointer transition ${
                    viewMode === "visual"
                      ? "bg-white text-[#3C322A] shadow-xs"
                      : "text-[#6A5242]/70 hover:text-[#3C322A]"
                  }`}
                >
                  แผนภาพจริง
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-md cursor-pointer transition ${
                    viewMode === "code"
                      ? "bg-white text-[#3C322A] shadow-xs"
                      : "text-[#6A5242]/70 hover:text-[#3C322A]"
                  }`}
                >
                  Mermaid Code
                </button>
              </div>
            )}
          </div>

          {/* Interactive Zoom Controls Panel */}
          {viewMode === "visual" &&
            ["usecase", "class", "sequence"].includes(selectedDiagram) && (
              <div className="bg-[#F5F0E6]/40 border border-[#EADECC]/50 rounded-xl p-3 flex items-center justify-between gap-4">
                <span className="text-[11px] font-black uppercase text-[#6A5242] tracking-wider">
                  เครื่องมือควบคุมการซูม (Zoom Control)
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setZoomScale((prev) => Math.max(0.1, prev - 0.2))
                    }
                    className="w-7 h-7 bg-white hover:bg-[#3C322A] hover:text-white border border-[#EADECC] rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer select-none"
                    title="ซูมออก"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.1"
                    max="6.0"
                    step="0.1"
                    value={zoomScale}
                    onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                    className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#556B2F]"
                  />
                  <button
                    onClick={() =>
                      setZoomScale((prev) => Math.min(6.0, prev + 0.2))
                    }
                    className="w-7 h-7 bg-white hover:bg-[#3C322A] hover:text-white border border-[#EADECC] rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer select-none"
                    title="ซูมเข้า"
                  >
                    +
                  </button>
                  <span className="text-xs font-mono font-bold text-[#3C322A] w-12 text-center">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomScale(1)}
                    className="px-2.5 py-1 bg-white hover:bg-[#3C322A] hover:text-white border border-[#EADECC] rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer select-none"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

          {/* Main Diagram Area */}
          <div className="bg-white border border-[#EADECC]/60 rounded-2xl p-6 md:p-8 shadow-xs min-h-[500px] flex flex-col justify-between overflow-hidden">
            <div className="space-y-6 flex-1 flex flex-col min-h-0">
              {/* --- 1. USE CASE DIAGRAM --- */}
              {selectedDiagram === "usecase" && (
                <div className="space-y-6 flex-1 flex flex-col min-h-0">
                  <div>
                    <h3 className="text-xl font-black text-[#3C322A]">
                      Use Case Diagram (แผนภาพการใช้งานระบบ)
                    </h3>
                    <p className="text-xs text-[#6A5242] mt-1 font-bold">
                      แสดงบทบาทความรับผิดชอบและการทำรายการต่าง ๆ
                      ของผู้ใช้งานทั้ง 4 กลุ่มหลัก (Guest, Customer, Staff,
                      Manager)
                    </p>
                  </div>

                  {viewMode === "visual" ? (
                    <div className="flex-1 border border-[#EADECC]/30 rounded-xl bg-[#FDFBF7]/30 overflow-auto p-6 relative flex items-center justify-start min-h-[400px]">
                      {!mermaidLoaded ? (
                        <div className="text-sm font-bold text-gray-400 animate-pulse">
                          กำลังโหลดระบบวาดแผนภาพ...
                        </div>
                      ) : (
                        <div
                          key="usecase-vis"
                          className="mermaid min-w-[900px] lg:min-w-[1200px] transition-transform duration-100 ease-out origin-left"
                          style={{ transform: `scale(${zoomScale})` }}
                        >
                          {DIAGRAMS_DATA.usecase}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400">
                          MERMAID CODE
                        </span>
                        <button
                          onClick={() => copyToClipboard(DIAGRAMS_DATA.usecase)}
                          className="text-xs text-[#556B2F] hover:text-[#3C322A] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <CopyIcon />
                          <span className="text-[10px]">
                            {copiedText ? "คัดลอกสำเร็จแล้ว!" : "คัดลอกโค้ด"}
                          </span>
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-gray-155 bg-gray-900 p-4 rounded-lg overflow-x-auto leading-relaxed">
                        {DIAGRAMS_DATA.usecase}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* --- 2. CLASS DIAGRAM --- */}
              {selectedDiagram === "class" && (
                <div className="space-y-6 flex-1 flex flex-col min-h-0">
                  <div>
                    <h3 className="text-xl font-black text-[#3C322A]">
                      Class Diagram (แผนภาพคลาสโครงสร้าง)
                    </h3>
                    <p className="text-xs text-[#6A5242] mt-1 font-bold">
                      โครงสร้างความสัมพันธ์เชิงคลาส (Entities)
                      ของระบบจำหน่ายสร้อยข้อมือ
                    </p>
                  </div>

                  {viewMode === "visual" ? (
                    <div className="flex-1 border border-[#EADECC]/30 rounded-xl bg-[#FDFBF7]/30 overflow-auto p-6 relative flex items-center justify-start min-h-[400px]">
                      {!mermaidLoaded ? (
                        <div className="text-sm font-bold text-gray-400 animate-pulse">
                          กำลังโหลดระบบวาดแผนภาพ...
                        </div>
                      ) : (
                        <div
                          key="class-vis"
                          className="mermaid min-w-[700px] lg:min-w-[900px] transition-transform duration-100 ease-out origin-left"
                          style={{ transform: `scale(${zoomScale})` }}
                        >
                          {DIAGRAMS_DATA.class}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400">
                          MERMAID CODE
                        </span>
                        <button
                          onClick={() => copyToClipboard(DIAGRAMS_DATA.class)}
                          className="text-xs text-[#556B2F] hover:text-[#3C322A] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <CopyIcon />
                          <span className="text-[10px]">
                            {copiedText ? "คัดลอกสำเร็จแล้ว!" : "คัดลอกโค้ด"}
                          </span>
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-gray-155 bg-gray-900 p-4 rounded-lg overflow-x-auto leading-relaxed">
                        {DIAGRAMS_DATA.class}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* --- 3. SEQUENCE DIAGRAMS --- */}
              {selectedDiagram === "sequence" && (
                <div className="space-y-8 flex-1 flex flex-col min-h-0">
                  <div>
                    <h3 className="text-xl font-black text-[#3C322A]">
                      Sequence Diagrams (ขั้นตอนส่งผ่านข้อมูล)
                    </h3>
                    <p className="text-xs text-[#6A5242] mt-1 font-bold">
                      ลำดับกระบวนการรับส่งข้อมูลของระบบแบ่งตามบทบาทสำคัญ
                    </p>
                  </div>

                  {viewMode === "visual" ? (
                    <div className="space-y-8 flex-1 flex flex-col min-h-0">
                      {/* Customer Sequence */}
                      <div className="space-y-4 border-l-2 border-[#556B2F] pl-4 flex-1 flex flex-col min-h-0">
                        <h4 className="text-sm font-black text-[#556B2F]">
                          Role 1: Customer Flow (การสั่งซื้อคัสตอมและชำระเงิน)
                        </h4>
                        <div className="flex-1 border border-[#EADECC]/30 rounded-xl bg-[#FDFBF7]/30 overflow-auto p-6 relative flex items-center justify-start min-h-[300px]">
                          {!mermaidLoaded ? (
                            <div className="text-sm font-bold text-gray-400 animate-pulse">
                              กำลังโหลดระบบวาดแผนภาพ...
                            </div>
                          ) : (
                            <div
                              key="seq-cust-vis"
                              className="mermaid min-w-[800px] lg:min-w-[1000px] transition-transform duration-100 ease-out origin-left"
                              style={{ transform: `scale(${zoomScale})` }}
                            >
                              {DIAGRAMS_DATA.sequence_customer}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Staff Sequence */}
                      <div className="space-y-4 border-l-2 border-[#6A5242] pl-4 flex-1 flex flex-col min-h-0">
                        <h4 className="text-sm font-black text-[#6A5242]">
                          Role 2: Staff / Admin Flow (การจัดการจัดส่งและขนส่ง)
                        </h4>
                        <div className="flex-1 border border-[#EADECC]/30 rounded-xl bg-[#FDFBF7]/30 overflow-auto p-6 relative flex items-center justify-start min-h-[300px]">
                          {!mermaidLoaded ? (
                            <div className="text-sm font-bold text-gray-400 animate-pulse">
                              กำลังโหลดระบบวาดแผนภาพ...
                            </div>
                          ) : (
                            <div
                              key="seq-staff-vis"
                              className="mermaid min-w-[800px] lg:min-w-[1000px] transition-transform duration-100 ease-out origin-left"
                              style={{ transform: `scale(${zoomScale})` }}
                            >
                              {DIAGRAMS_DATA.sequence_staff}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Code */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400">
                            Customer Flow Code
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(DIAGRAMS_DATA.sequence_customer)
                            }
                            className="text-xs text-[#556B2F] hover:text-[#3C322A] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <CopyIcon />
                            <span className="text-[10px]">
                              {copiedText ? "คัดลอกแล้ว!" : "Copy"}
                            </span>
                          </button>
                        </div>
                        <pre className="font-mono text-[10px] text-gray-155 bg-gray-900 p-4 rounded-lg overflow-x-auto leading-relaxed max-h-96">
                          {DIAGRAMS_DATA.sequence_customer}
                        </pre>
                      </div>

                      {/* Staff Code */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400">
                            Staff Flow Code
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(DIAGRAMS_DATA.sequence_staff)
                            }
                            className="text-xs text-[#556B2F] hover:text-[#3C322A] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <CopyIcon />
                            <span className="text-[10px]">
                              {copiedText ? "คัดลอกแล้ว!" : "Copy"}
                            </span>
                          </button>
                        </div>
                        <pre className="font-mono text-[10px] text-gray-155 bg-gray-900 p-4 rounded-lg overflow-x-auto leading-relaxed max-h-96">
                          {DIAGRAMS_DATA.sequence_staff}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- 4. DATABASE SCHEMA --- */}
              {selectedDiagram === "schema" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-[#3C322A]">
                      Database Schema (สกีมาฐานข้อมูลรายตาราง)
                    </h3>
                    <p className="text-xs text-[#6A5242] mt-1 font-bold">
                      คลิกเลือกตารางแต่ละชิ้นเพื่อแสดงสกีมาในรูปแบบ JSON
                      วัตถุอธิบายคีย์และประเภทข้อมูล
                    </p>
                  </div>

                  {/* Horizontal JSON tables selection sub-tab */}
                  <div className="flex flex-wrap gap-1.5 border-b border-[#EADECC]/30 pb-3">
                    {Object.keys(JSON_TABLES_SCHEMA).map((tableName) => (
                      <button
                        key={tableName}
                        onClick={() => setSelectedJsonTable(tableName)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider transition cursor-pointer ${
                          selectedJsonTable === tableName
                            ? "bg-[#556B2F] text-white"
                            : "bg-[#F5F0E6]/40 text-[#6A5242] hover:text-[#3C322A] hover:bg-[#F5F0E6]"
                        }`}
                      >
                        {tableName}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#6A5242]/70 tracking-widest uppercase">
                        ตาราง: {selectedJsonTable} Schema (JSON Format)
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(JSON_TABLES_SCHEMA[selectedJsonTable])
                        }
                        className="text-xs text-[#556B2F] hover:text-[#3C322A] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CopyIcon />
                        <span className="text-[10px]">
                          {copiedText ? "คัดลอก JSON แล้ว!" : "Copy JSON"}
                        </span>
                      </button>
                    </div>

                    <pre className="font-mono text-xs text-emerald-600 bg-gray-900 p-5 rounded-lg overflow-x-auto leading-relaxed">
                      {JSON_TABLES_SCHEMA[selectedJsonTable]}
                    </pre>
                  </div>
                </div>
              )}

              {/* --- 5. WIREFRAMES --- */}
              {selectedDiagram === "wireframe" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-black text-[#3C322A]">
                      Wireframe Design (แบบจำลองโครงร่างหน้าจอ)
                    </h3>
                    <p className="text-xs text-[#6A5242] mt-1 font-bold">
                      แบบจำลองเลย์เอาต์หน้าจอหลักของหน้าร้าน
                      และหน้าจัดการทีมงานหลังบ้าน
                    </p>
                  </div>

                  {/* Real Wireframe Images */}
                  <div className="space-y-6">
                    <div className="border border-[#EADECC]/60 rounded-xl overflow-hidden bg-white p-4">
                      <h4 className="text-xs font-black text-[#556B2F] uppercase tracking-wider mb-3">
                        หน้าจอระบบสั่งซื้อและคัสตอมกำไลข้อมือ (Storefront Store)
                      </h4>
                      <img 
                        src="/wireframe/1.png" 
                        alt="Storefront Wireframe" 
                        className="w-full h-auto rounded-lg shadow-sm border border-[#EADECC]/45"
                      />
                    </div>

                    <div className="border border-[#EADECC]/60 rounded-xl overflow-hidden bg-white p-4">
                      <h4 className="text-xs font-black text-[#6A5242] uppercase tracking-wider mb-3">
                        หน้าจอระบบบริหารจัดการหลังบ้าน (Backoffice Management)
                      </h4>
                      <img 
                        src="/wireframe/2.png" 
                        alt="Backoffice Wireframe" 
                        className="w-full h-auto rounded-lg shadow-sm border border-[#EADECC]/45"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- 6. USER PERSONAS --- */}
              {selectedDiagram === "persona" && (
                <div className="space-y-8 font-anuphan">
                  <div>
                    <h3 className="text-xl font-black text-[#3C322A]">
                      User Persona Design (กลุ่มผู้ใช้งานเป้าหมาย)
                    </h3>
                    <p className="text-xs text-[#6A5242] mt-1 font-bold">
                      การจำลองลักษณะผู้ใช้งานจริงทั้งฝั่งลูกค้า (Customer) และฝั่งเจ้าหน้าที่หลังบ้าน (Staff/Admin) เพื่อใช้ออกแบบฟีเจอร์และประสบการณ์ใช้งาน
                    </p>
                  </div>

                  {/* Persona Cards Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Persona 1: Customer (Nicha) */}
                    <div className="border border-[#EADECC]/60 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
                      <div className="p-6 space-y-4">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#556B2F]/10 border border-[#556B2F]/20 overflow-hidden flex items-center justify-center text-[#556B2F] font-black text-xl">
                            ณ
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-[#3C322A]">คุณณิชา (Nicha)</h4>
                            <span className="bg-[#556B2F]/10 text-[#556B2F] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                              ลูกค้าสายแฟชั่น & มูเตลู
                            </span>
                          </div>
                        </div>

                        {/* Demographic details */}
                        <div className="text-[13px] space-y-3.5 border-t border-[#F5F0E6] pt-4 text-[#3C322A]/85 leading-relaxed font-medium">
                          <p><strong>อายุ:</strong> 25 ปี</p>
                          <p><strong>อาชีพ:</strong> คอนเทนต์ครีเอเตอร์อิสระ</p>
                          <p><strong>พฤติกรรม:</strong> ชื่นชอบแฟชั่นมินิมอลและเครื่องประดับสายมู ชอบคัสตอมรูปแบบและหินสีต่าง ๆ ให้ตรงตามดวงชะตาเพื่อความมั่นใจ</p>
                          <p><strong>เป้าหมาย (Goals):</strong> ต้องการเครื่องประดับที่ออกแบบเองได้ มีคุณค่าทางใจ ขนาดข้อมือพอดีตัว และมีระบบหลังบ้านชำระเงินที่สะดวกสบาย</p>
                          <p><strong>ปัญหา (Pain Points):</strong> ร้านสร้อยหินทั่วไปมักมีขนาดมาตรฐานที่ไม่พอดีกับข้อมือตน และไม่สามารถเห็นรูปจำลองการออกแบบก่อนสั่งทำจริงได้</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#F5F0E6]/30 px-6 py-3 border-t border-[#F5F0E6]/60">
                        <span className="text-[10px] text-[#556B2F] font-black uppercase tracking-wider">ฟีเจอร์ตอบโจทย์: Made-to-Order Customizer</span>
                      </div>
                    </div>

                    {/* Persona 2: Customer (Kongkiat) */}
                    <div className="border border-[#EADECC]/60 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
                      <div className="p-6 space-y-4">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#6A5242]/10 border border-[#6A5242]/20 overflow-hidden flex items-center justify-center text-[#6A5242] font-black text-xl">
                            ก
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-[#3C322A]">คุณก้องเกียรติ (Kong)</h4>
                            <span className="bg-[#6A5242]/10 text-[#6A5242] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                              ลูกค้าเน้นความรวดเร็ว
                            </span>
                          </div>
                        </div>

                        {/* Demographic details */}
                        <div className="text-[13px] space-y-3.5 border-t border-[#F5F0E6] pt-4 text-[#3C322A]/85 leading-relaxed font-medium">
                          <p><strong>อายุ:</strong> 31 ปี</p>
                          <p><strong>อาชีพ:</strong> วิศวกรซอฟต์แวร์</p>
                          <p><strong>พฤติกรรม:</strong> ต้องการซื้อของขวัญชิ้นพิเศษให้แฟนในวันครบรอบ ไม่มีเวลาเลือกนาน และต้องการชำระเงินให้เร็วที่สุดผ่านมือถือ</p>
                          <p><strong>เป้าหมาย (Goals):</strong> อยากซื้อสินค้าแบรนด์ดังที่ออกแบบเสร็จสำเร็จรูป ไม่ต้องการลงทะเบียนหลายขั้นตอนก่อนสั่งซื้อ สะดวกใจจ่ายผ่าน PromptPay QR</p>
                          <p><strong>ปัญหา (Pain Points):</strong> เบื่อขั้นตอนเช็คเอาท์ที่ยาวและต้องเลือกกรอกฟิลด์ที่ไม่จำเป็น รวมถึงหน้าเว็บไม่มีระบบสแกนคิวอาร์ชำระเงินที่รวดเร็ว</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#F5F0E6]/30 px-6 py-3 border-t border-[#F5F0E6]/60">
                        <span className="text-[10px] text-[#6A5242] font-black uppercase tracking-wider">ฟีเจอร์ตอบโจทย์: สั่งซื้อทันที (Buy Now) & QR Payment</span>
                      </div>
                    </div>

                    {/* Persona 3: Staff (Praewa) */}
                    <div className="border border-[#EADECC]/60 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
                      <div className="p-6 space-y-4">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-zinc-800/10 border border-zinc-800/20 overflow-hidden flex items-center justify-center text-zinc-800 font-black text-xl">
                            พ
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-[#3C322A]">คุณแพรวา (Praewa)</h4>
                            <span className="bg-zinc-800/10 text-zinc-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Admin / พนักงานหลังบ้าน
                            </span>
                          </div>
                        </div>

                        {/* Demographic details */}
                        <div className="text-[13px] space-y-3.5 border-t border-[#F5F0E6] pt-4 text-[#3C322A]/85 leading-relaxed font-medium">
                          <p><strong>อายุ:</strong> 27 ปี</p>
                          <p><strong>อาชีพ:</strong> Admin / เจ้าหน้าที่บริหารจัดการหลังบ้าน</p>
                          <p><strong>พฤติกรรม:</strong> ต้องดูแลการเช็คสลิปโอนเงิน อัปเดตคลังของประดับ ตรวจสเปกวัสดุคัสตอม และคีย์เลขพัสดุในแต่ละวัน</p>
                          <p><strong>เป้าหมาย (Goals):</strong> จัดหมวดหมู่วัสดุ ตรวจความต้องการสั่งตัดข้อมือของลูกค้า ปริ้นท์ใบคำสั่งซื้อที่ชำระเงินเรียบร้อย เพื่อส่งสินค้าได้รวดเร็ว</p>
                          <p><strong>ปัญหา (Pain Points):</strong> ข้อมูลวัสดุคัสตอมในระบบแบบเดิมสับสน แยกหมวดหมู่สินค้าไม่ออก และไม่สามารถเปลี่ยนสถานะออเดอร์แจ้งลูกค้าได้ง่าย</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#F5F0E6]/30 px-6 py-3 border-t border-[#F5F0E6]/60">
                        <span className="text-[10px] text-zinc-800 font-black uppercase tracking-wider">ฟีเจอร์ตอบโจทย์: Backoffice Stock & Status Management</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
