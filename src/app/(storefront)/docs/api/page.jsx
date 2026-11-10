"use client";

import React, { useState } from "react";
import Link from "next/link";

// Custom icons
const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-[#3C322A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
  { id: "timeline", title: "แผนการดำเนินงาน (Timeline)" }
];

const API_GROUPS = [
  {
    title: "Authentication (ระบบสมาชิกและสิทธิ์การเข้าถึง - /api/auth)",
    endpoints: [
      {
        id: "auth-register-cust",
        method: "POST",
        url: "/api/auth/register",
        desc: "ลงทะเบียนสมาชิกสำหรับลูกค้าทั่วไป",
        summary: "สร้างบัญชีลูกค้าใหม่ โดยรหัสผ่านจะถูกเข้ารหัสผ่าน bcrypt ก่อนจัดเก็บลงฐานข้อมูล",
        parameters: [
          { name: "email", type: "String", required: true, desc: "อีเมลสำหรับใช้เข้าสู่ระบบ" },
          { name: "password", type: "String", required: true, desc: "รหัสผ่านความปลอดภัยขั้นต่ำ 6 ตัวอักษร" },
          { name: "firstName", type: "String", required: false, desc: "ชื่อจริง" },
          { name: "lastName", type: "String", required: false, desc: "นามสกุล" }
        ],
        body: '{\n  "email": "customer@example.com",\n  "password": "securepassword123",\n  "firstName": "สมชาย",\n  "lastName": "ใจดี"\n}',
        response: '{\n  "success": true,\n  "message": "User registered successfully",\n  "user": {\n    "id": "c3702a0a-1111-477c-a496-b0b9a957868f",\n    "email": "customer@example.com"\n  }\n}'
      },
      {
        id: "auth-login-cust",
        method: "POST",
        url: "/api/auth/login",
        desc: "เข้าสู่ระบบของลูกค้า",
        summary: "ตรวจสอบความถูกต้องของอีเมลและรหัสผ่าน พร้อมส่งกลับ HTTP-only Cookie เก็บ JWT Token สำหรับยืนยันตัวตน",
        parameters: [
          { name: "email", type: "String", required: true, desc: "อีเมลผู้ใช้งาน" },
          { name: "password", type: "String", required: true, desc: "รหัสผ่าน" }
        ],
        body: '{\n  "email": "customer@example.com",\n  "password": "securepassword123"\n}',
        response: '{\n  "success": true,\n  "message": "Login successful",\n  "user": {\n    "id": "c3702a0a-1111-477c-a496-b0b9a957868f",\n    "email": "customer@example.com"\n  }\n}'
      },
      {
        id: "auth-logout-cust",
        method: "POST",
        url: "/api/auth/logout",
        desc: "ออกจากระบบ (Customer)",
        summary: "ล้างและทำลาย Cookie เก็บสิทธิ์รหัสผ่านฝั่ง Client",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "message": "Logged out successfully"\n}'
      },
      {
        id: "auth-profile-cust",
        method: "GET",
        url: "/api/auth/profile",
        desc: "เรียกดูข้อมูลส่วนตัวของลูกค้า",
        summary: "ดึงรายละเอียดโปรไฟล์ของลูกค้าจากฐานข้อมูลโดยวิเคราะห์สิทธิ์จาก JWT Token ใน Cookie",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "user": {\n    "id": "c3702a0a-1111-477c-a496-b0b9a957868f",\n    "email": "customer@example.com",\n    "firstName": "สมชาย",\n    "lastName": "ใจดี"\n  }\n}'
      },
      {
        id: "auth-register-bo",
        method: "POST",
        url: "/api/auth/backoffice/register",
        desc: "ลงทะเบียนพนักงานหลังบ้าน",
        summary: "ใช้สำหรับสร้างบัญชีพนักงานและแอดมินใหม่ (เฉพาะแอดมินใช้งานเพื่อเพิ่มทีมงาน)",
        parameters: [
          { name: "email", type: "String", required: true, desc: "อีเมลพนักงาน" },
          { name: "password", type: "String", required: true, desc: "รหัสผ่านความปลอดภัย" },
          { name: "firstName", type: "String", required: true, desc: "ชื่อพนักงาน" },
          { name: "lastName", type: "String", required: true, desc: "นามสกุล" },
          { name: "role", type: "String", required: true, desc: "บทบาทหน้าที่ ('admin' | 'staff')" }
        ],
        body: '{\n  "email": "staff@bareandbold.com",\n  "password": "staffpassword123",\n  "firstName": "ภาณุพัฒน์",\n  "lastName": "อ่อนตา",\n  "role": "staff"\n}',
        response: '{\n  "success": true,\n  "message": "Backoffice user registered successfully"\n}'
      },
      {
        id: "auth-login-bo",
        method: "POST",
        url: "/api/auth/backoffice/login",
        desc: "เข้าสู่ระบบของพนักงานหลังบ้าน",
        summary: "ตรวจสอบสิทธิ์พนักงานหลังบ้าน (Staff/Admin) พร้อมส่งกลับสิทธิ์ JWT Token",
        parameters: [
          { name: "email", type: "String", required: true, desc: "อีเมลพนักงาน" },
          { name: "password", type: "String", required: true, desc: "รหัสผ่าน" }
        ],
        body: '{\n  "email": "staff@bareandbold.com",\n  "password": "staffpassword123"\n}',
        response: '{\n  "success": true,\n  "message": "Login successful"\n}'
      },
      {
        id: "auth-logout-bo",
        method: "POST",
        url: "/api/auth/backoffice/logout",
        desc: "ออกจากระบบ (พนักงาน)",
        summary: "ล้างสิทธิ์รหัสผ่านพนักงานจาก Cookie",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "message": "Logged out successfully"\n}'
      },
      {
        id: "auth-profile-bo",
        method: "GET",
        url: "/api/auth/backoffice/profile",
        desc: "เรียกดูโปรไฟล์ของพนักงาน",
        summary: "ดึงรายละเอียดบัญชีพนักงานที่เข้าสู่ระบบจาก JWT token (ต้องมีสิทธิ์เป็นพนักงาน)",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "user": {\n    "id": "staff-uuid",\n    "email": "staff@bareandbold.com",\n    "role": "staff"\n  }\n}'
      }
    ]
  },
  {
    title: "Employee Accounts (จัดการบัญชีพนักงานหลังบ้าน - /api/employees)",
    endpoints: [
      {
        id: "emp-list",
        method: "GET",
        url: "/api/employees",
        desc: "ดึงข้อมูลรายการพนักงานทั้งหมด",
        summary: "แสดงบัญชีพนักงานหลังบ้านทั้งหมด (เฉพาะผู้จัดการ/แอดมิน)",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "employees": [\n    { "id": "emp-1", "email": "staff@bareandbold.com", "role": "staff" }\n  ]\n}'
      },
      {
        id: "emp-create",
        method: "POST",
        url: "/api/employees",
        desc: "สร้างบัญชีพนักงานใหม่",
        summary: "เพิ่มพนักงานใหม่โดยแอดมินระบุข้อมูลและรหัสผ่านเริ่มต้น",
        parameters: [],
        body: '{\n  "email": "newstaff@bareandbold.com",\n  "password": "temp123password",\n  "role": "staff"\n}',
        response: '{\n  "success": true,\n  "message": "Employee created successfully"\n}'
      },
      {
        id: "emp-update",
        method: "PUT",
        url: "/api/employees/:id",
        desc: "อัปเดตข้อมูลบัญชีพนักงาน",
        summary: "แก้ไขบทบาท หน้าที่ หรือรหัสผ่านใหม่ของพนักงาน",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสอ้างอิงของพนักงาน" }
        ],
        body: '{\n  "role": "admin"\n}',
        response: '{\n  "success": true,\n  "message": "Employee updated successfully"\n}'
      },
      {
        id: "emp-delete",
        method: "DELETE",
        url: "/api/employees/:id",
        desc: "ลบบัญชีพนักงาน",
        summary: "ทำ Soft Delete บัญชีพนักงานออกจากระบบ",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสอ้างอิงพนักงานที่ต้องการลบ" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "message": "Employee deleted successfully"\n}'
      }
    ]
  },
  {
    title: "User Management (การเรียกดูข้อมูลสิทธิ์ของลูกค้า - /api/users)",
    endpoints: [
      {
        id: "user-list",
        method: "GET",
        url: "/api/users",
        desc: "ดึงรายการข้อมูลลูกค้าทั้งหมด",
        summary: "แสดงรายชื่อและข้อมูลติดต่อเบื้องต้นของลูกค้าทั้งหมดในระบบ (เฉพาะแอดมิน/ผู้จัดการ)",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "users": [\n    { "id": "cust-uuid", "email": "customer@example.com", "firstName": "สมชาย" }\n  ]\n}'
      },
      {
        id: "user-detail",
        method: "GET",
        url: "/api/users/:id",
        desc: "เรียกดูข้อมูลลูกค้ารายบุคคล",
        summary: "แสดงโปรไฟล์และประวัติการสั่งซื้อเบื้องต้นของลูกค้าเฉพาะตัว",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสอ้างอิงของลูกค้า" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "user": { "id": "cust-uuid", "email": "customer@example.com", "firstName": "สมชาย", "lastName": "ใจดี" }\n}'
      }
    ]
  },
  {
    title: "Product Catalog (ข้อมูลรายการสินค้า - /api/products)",
    endpoints: [
      {
        id: "prod-list",
        method: "GET",
        url: "/api/products",
        desc: "ดึงรายการสินค้าทั้งหมด",
        summary: "ดึงข้อมูลสินค้าทั้งหมด รวมถึงสินค้าพร้อมส่ง (READY_TO_SHIP) และสินค้าสั่งทำ (MADE_TO_ORDER)",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "products": [\n    { "id": "p-1", "name": "กำไล Onyx", "price": 890.00, "type": "READY_TO_SHIP" }\n  ]\n}'
      },
      {
        id: "prod-detail",
        method: "GET",
        url: "/api/products/:id",
        desc: "ดูรายละเอียดสินค้าเฉพาะรายตัว",
        summary: "แสดงรูปภาพ ตัวเลือกคัสตอม (CustomOptions) และการปรับแต่งราคา",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสสินค้า" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "product": { "id": "p-1", "name": "กำไล Onyx", "price": 890.00 }\n}'
      },
      {
        id: "prod-recs",
        method: "GET",
        url: "/api/products/:id/recommendations",
        desc: "ดึงข้อมูลแนะนำสินค้าที่เกี่ยวข้อง",
        summary: "ดึงรายการสินค้าแนะนำหรือมีสไตล์สอดคล้องกันเพื่อเสนอขายเพิ่ม (Upsell)",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสสินค้าที่ลูกค้ากำลังเข้าชม" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "recommendations": []\n}'
      },
      {
        id: "prod-create",
        method: "POST",
        url: "/api/products",
        desc: "สร้างสินค้าชิ้นใหม่",
        summary: "บันทึกข้อมูลสินค้าใหม่ลงสต็อกคลัง (เฉพาะสิทธิ์พนักงาน)",
        parameters: [],
        body: '{\n  "name": "กำไลหินมงคลนำโชค",\n  "price": 1290.00,\n  "type": "MADE_TO_ORDER"\n}',
        response: '{\n  "success": true,\n  "product": { "id": "new-p-uuid", "name": "กำไลหินมงคลนำโชค" }\n}'
      },
      {
        id: "prod-update",
        method: "PUT",
        url: "/api/products/:id",
        desc: "แก้ไขข้อมูลสินค้า",
        summary: "ปรับปรุงชื่อ รายละเอียด ราคา หรือจำนวนสต็อก",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสสินค้า" }
        ],
        body: '{\n  "price": 1190.00\n}',
        response: '{\n  "success": true,\n  "message": "Product updated successfully"\n}'
      },
      {
        id: "prod-delete",
        method: "DELETE",
        url: "/api/products/:id",
        desc: "ลบสินค้าออกจากระบบ",
        summary: "ทำ Soft Delete สินค้าเพื่อไม่ให้แสดงหน้าร้านค้าออนไลน์",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสสินค้า" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "message": "Product deleted successfully"\n}'
      }
    ]
  },
  {
    title: "Categories (การจัดการหมวดหมู่สินค้า - /api/categories)",
    endpoints: [
      {
        id: "cat-list",
        method: "GET",
        url: "/api/categories",
        desc: "ดึงรายการหมวดหมู่สินค้าทั้งหมด",
        summary: "แสดงหมวดหมู่หลัก เช่น กำไลข้อมือ (BRACELET) หรือ กำไลข้อเท้า (ANKLET)",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "categories": [\n    { "id": "cat-1", "name": "BRACELET" }\n  ]\n}'
      },
      {
        id: "cat-create",
        method: "POST",
        url: "/api/categories",
        desc: "สร้างหมวดหมู่ใหม่",
        summary: "เพิ่มหมวดหมู่สินค้าใหม่เข้าสู่ระบบ (สิทธิ์พนักงาน)",
        parameters: [],
        body: '{\n  "name": "NECKLACE"\n}',
        response: '{\n  "success": true,\n  "category": { "id": "cat-2", "name": "NECKLACE" }\n}'
      },
      {
        id: "cat-update",
        method: "PUT",
        url: "/api/categories/:id",
        desc: "แก้ไขชื่อหมวดหมู่",
        summary: "ปรับเปลี่ยนรายละเอียดชื่อหมวดหมู่สินค้าหลัก",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสหมวดหมู่" }
        ],
        body: '{\n  "name": "BRACELETS_NEW"\n}',
        response: '{\n  "success": true,\n  "message": "Category updated successfully"\n}'
      },
      {
        id: "cat-delete",
        method: "DELETE",
        url: "/api/categories/:id",
        desc: "ลบหมวดหมู่สินค้า",
        summary: "ลบหมวดหมู่สินค้าที่ไม่ต้องการออกจากระบบ",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสหมวดหมู่" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "message": "Category deleted successfully"\n}'
      }
    ]
  },
  {
    title: "Accessories (ชิ้นส่วนและเครื่องประดับตกแต่งคัสตอม - /api/accessories)",
    endpoints: [
      {
        id: "acc-list",
        method: "GET",
        url: "/api/accessories",
        desc: "ดึงรายการอุปกรณ์ตกแต่งคัสตอมทั้งหมด",
        summary: "แสดงตัวเลือกอะไหล่ ชิ้นส่วน และหินนำโชคสำหรับคัสตอม",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "accessories": [\n    { "id": "acc-1", "name": "จี้มุกแท้", "price": 150.00, "stock": 50 }\n  ]\n}'
      },
      {
        id: "acc-create",
        method: "POST",
        url: "/api/accessories",
        desc: "เพิ่มชิ้นส่วนอะไหล่ใหม่เข้าร้าน",
        summary: "บันทึกตัวเลือกวัสดุชิ้นใหม่ ระบุชื่อ ราคา และจำนวนสต็อกวัสดุจริง",
        parameters: [],
        body: '{\n  "name": "จี้จดหมายอักษร",\n  "price": 80.00,\n  "stock": 100\n}',
        response: '{\n  "success": true,\n  "message": "Accessory created successfully"\n}'
      },
      {
        id: "acc-update",
        method: "PUT",
        url: "/api/accessories/:id",
        desc: "อัปเดตข้อมูลวัสดุ/คลังชิ้นส่วน",
        summary: "ปรับยอดจำนวนวัสดุในระบบสต็อก หรือแก้ไขราคาอะไหล่",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสอุปกรณ์ตกแต่ง" }
        ],
        body: '{\n  "stock": 120\n}',
        response: '{\n  "success": true,\n  "message": "Accessory updated successfully"\n}'
      },
      {
        id: "acc-delete",
        method: "DELETE",
        url: "/api/accessories/:id",
        desc: "ลบตัวเลือกชิ้นส่วนตกแต่ง",
        summary: "ลบตัวเลือกอะไหล่ออกจากคลังจำลอง",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสอุปกรณ์ตกแต่ง" }
        ],
        body: null,
        response: '{\n  "success": true,\n  "message": "Accessory deleted successfully"\n}'
      }
    ]
  },
  {
    title: "Shopping Cart (ระบบตะกร้าสินค้า - /api/cart)",
    endpoints: [
      {
        id: "cart-get",
        method: "GET",
        url: "/api/cart",
        desc: "เรียกดูตะกร้าของลูกค้าปัจจุบัน",
        summary: "ดึงรายการสร้อยข้อมือสำเร็จรูปและกำไลสั่งผลิตที่ลูกค้าจัดเตรียมสั่งซื้อ",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "cart": {\n    "id": "cart-uuid",\n    "items": [\n      { "productId": "prod-uuid", "quantity": 1, "customDetails": {} }\n    ]\n  }\n}'
      },
      {
        id: "cart-add",
        method: "POST",
        url: "/api/cart",
        desc: "เพิ่มสินค้าลงตะกร้า",
        summary: "บันทึกสินค้าใหม่ หรือกำไลคัสตอมที่จับคู่หินลงตะกร้าของลูกค้า",
        parameters: [],
        body: '{\n  "productId": "p-1",\n  "quantity": 1,\n  "customDetails": { "size": "15cm", "stones": ["onyx", "pearl"] }\n}',
        response: '{\n  "success": true,\n  "message": "Added to cart successfully"\n}'
      },
      {
        id: "cart-update",
        method: "PUT",
        url: "/api/cart",
        desc: "ปรับจำนวนหรือตัวเลือกในตะกร้า",
        summary: "ปรับเพิ่ม/ลดจำนวนชิ้นของสินค้าในตะกร้า",
        parameters: [],
        body: '{\n  "itemId": "item-uuid",\n  "quantity": 3\n}',
        response: '{\n  "success": true,\n  "message": "Cart item updated successfully"\n}'
      },
      {
        id: "cart-remove",
        method: "DELETE",
        url: "/api/cart",
        desc: "ลบสินค้าออกจากตะกร้า",
        summary: "ลบสินค้าชิ้นนั้นๆ ออกจากรายการเตรียมสั่งซื้อ",
        parameters: [],
        body: '{\n  "itemId": "item-uuid"\n}',
        response: '{\n  "success": true,\n  "message": "Item removed from cart"\n}'
      },
      {
        id: "cart-clear",
        method: "POST",
        url: "/api/cart/clear",
        desc: "ล้างข้อมูลในตะกร้าทั้งหมด",
        summary: "ลบข้อมูลไอเทมทั้งหมดในตะกร้าหลังสั่งซื้อเสร็จสิ้น",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "message": "Cart cleared successfully"\n}'
      }
    ]
  },
  {
    title: "Orders (ระบบการสั่งซื้อและจัดการออเดอร์ - /api/orders)",
    endpoints: [
      {
        id: "order-create",
        method: "POST",
        url: "/api/orders",
        desc: "สร้างคำสั่งซื้อใหม่",
        summary: "คำนวณราคาสุทธิ จัดทำใบสั่งซื้อออเดอร์ และล้างสินค้าในตะกร้าทันที",
        parameters: [],
        body: '{\n  "recipientName": "สมชาย ใจดี",\n  "shippingAddress": "456 ถ.รัชดาภิเษก กทม.",\n  "recipientPhone": "0898765432"\n}',
        response: '{\n  "success": true,\n  "order": { "id": "order-uuid-999", "totalPrice": 1490.00, "status": "PENDING" }\n}'
      },
      {
        id: "order-history",
        method: "GET",
        url: "/api/orders",
        desc: "ดึงประวัติการสั่งซื้อของลูกค้า",
        summary: "ลูกค้าเรียกดูประวัติออเดอร์ทั้งหมดของตนเอง เพื่อติดตามสถานะพัสดุและวันส่งมอบงาน",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "orders": [\n    { "id": "order-uuid-999", "totalPrice": 1490.00, "status": "PENDING" }\n  ]\n}'
      },
      {
        id: "order-admin-list",
        method: "GET",
        url: "/api/orders/admin",
        desc: "ดึงประวัติออเดอร์ในระบบ (Backoffice)",
        summary: "พนักงานดึงประวัติออเดอร์ทั้งหมดของร้านค้าเพื่อเตรียมงานแพ็คจัดส่งสินค้า",
        parameters: [],
        body: null,
        response: '{\n  "success": true,\n  "orders": [\n    { "id": "order-uuid-999", "status": "PENDING" }\n  ]\n}'
      },
      {
        id: "order-admin-update",
        method: "PUT",
        url: "/api/orders/admin/:id",
        desc: "จัดการสถานะจัดส่งและรหัสติดตาม",
        summary: "อัปเดตใบสั่งซื้อเป็น CONFIRMED, SHIPPED (พร้อมใส่ Tracking ID) หรือ CANCELLED",
        parameters: [
          { name: "id", type: "String (Path)", required: true, desc: "รหัสออเดอร์" }
        ],
        body: '{\n  "status": "SHIPPED",\n  "trackingNumber": "TH889898234"\n}',
        response: '{\n  "success": true,\n  "message": "Order updated successfully"\n}'
      }
    ]
  },
  {
    title: "Payments (ระบบการชำระเงินออนไลน์ - /api/payments)",
    endpoints: [
      {
        id: "pay-checkout",
        method: "POST",
        url: "/api/payments/checkout",
        desc: "ชำระเงินออเดอร์ผ่าน Omise Gateway",
        summary: "ส่งข้อมูลทำรายการตัดบัตรเครดิตหรือรับ QR Code โอนเงินผ่าน Omise API ความปลอดภัยสูง",
        parameters: [],
        body: '{\n  "orderId": "order-uuid-999",\n  "paymentMethod": "PROMPTPAY"\n}',
        response: '{\n  "success": true,\n  "chargeId": "chg_test_123",\n  "qrCodeUrl": "https://omise.co/pay/qr_image.png"\n}'
      },
      {
        id: "pay-webhook",
        method: "POST",
        url: "/api/payments/webhook",
        desc: "รับข้อมูลประสานงานจาก Omise Webhook",
        summary: "Omise ส่งสถานะการตัดจ่ายจริงผ่านระบบกลับมาเพื่อเปลี่ยนสถานะชำระเงินออเดอร์เป็น PAID อัตโนมัติ",
        parameters: [],
        body: '{\n  "key": "charge.complete",\n  "data": { "id": "chg_test_123", "status": "successful" }\n}',
        response: '{\n  "status": "success"\n}'
      }
    ]
  },
  {
    title: "Storage File Upload (การจัดการฝากไฟล์ขึ้น Cloud - /api/upload)",
    endpoints: [
      {
        id: "up-multiple",
        method: "POST",
        url: "/api/upload",
        desc: "อัปโหลดไฟล์รูปภาพขึ้นคลังเก็บไฟล์",
        summary: "อัปโหลดภาพสินค้าหรือภาพสลิปชำระเงินขึ้นระบบ Cloudflare R2 Object Storage",
        parameters: [],
        body: "[Multipart Form Data - Files]",
        response: '{\n  "success": true,\n  "urls": [\n    "https://pub-r2.url/filename-uuid.jpg"\n  ]\n}'
      },
      {
        id: "up-delete",
        method: "DELETE",
        url: "/api/upload",
        desc: "ลบรูปภาพพ้นจากคลัง R2",
        summary: "นำลิงก์ไฟล์รูปภาพออกไปลบจาก Storage จริงเมื่อไม่มีการใช้งานแล้ว (เช่น ลบภาพสินค้าเพื่อเปลี่ยนภาพใหม่)",
        parameters: [],
        body: '{\n  "fileUrl": "https://pub-r2.url/filename-uuid.jpg"\n}',
        response: '{\n  "success": true,\n  "message": "File deleted successfully"\n}'
      }
    ]
  }
];

export default function ApiDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openEndpoints, setOpenEndpoints] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleEndpoint = (id) => {
    setOpenEndpoints(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyCode = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredGroups = API_GROUPS.map(group => {
    const matchedEndpoints = group.endpoints.filter(ep =>
      ep.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, endpoints: matchedEndpoints };
  }).filter(group => group.endpoints.length > 0);

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
              API RESTful<br />SPECIFICATION
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="ค้นหา Endpoint / คำอธิบาย..."
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
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#6A5242]/70 hover:text-[#3C322A] hover:translate-x-0.5 transition-all duration-200"
                >
                  <span>ข้อมูลโครงการ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </Link>

                <Link
                  href="/docs/api"
                  className="group w-full text-left flex items-center justify-between cursor-pointer text-[13px] font-black tracking-wider text-[#556B2F] translate-x-1 transition-all duration-200"
                >
                  <span>เอกสาร API References</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F] scale-125" />
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

        {/* Swagger Style API Explorer */}
        <main className="flex-1 space-y-10 pb-24">
          {filteredGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-4">
              <h2 className="text-lg font-black text-[#556B2F] border-b border-[#EADECC]/45 pb-2">
                {group.title}
              </h2>
              
              <div className="space-y-3">
                {group.endpoints.map((ep) => {
                  const isOpen = !!openEndpoints[ep.id];
                  
                  // Brand earth tones for API Methods instead of generic colors
                  const methodColors = ep.method === "GET" 
                    ? { bg: "bg-[#556B2F]/5 border-[#556B2F]/20 text-[#556B2F]", badge: "bg-[#556B2F]" } 
                    : ep.method === "POST"
                    ? { bg: "bg-[#6A5242]/5 border-[#6A5242]/20 text-[#6A5242]", badge: "bg-[#6A5242]" }
                    : ep.method === "PUT"
                    ? { bg: "bg-[#D4A373]/10 border-[#D4A373]/20 text-[#A27B5C]", badge: "bg-[#A27B5C]" }
                    : { bg: "bg-rose-500/5 border-rose-500/20 text-rose-700", badge: "bg-rose-700" };

                  return (
                    <div 
                      key={ep.id}
                      className={`border rounded-xl overflow-hidden transition-all duration-200 bg-white ${
                        isOpen ? "shadow-sm border-[#EADECC]" : "hover:border-[#EADECC] border-[#EADECC]/60"
                      }`}
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleEndpoint(ep.id)}
                        className={`w-full p-4 flex items-center justify-between text-left cursor-pointer transition ${methodColors.bg}`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <span className={`text-[10px] font-black px-2.5 py-1 text-white rounded-md tracking-wider shadow-xs ${methodColors.badge}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-sm font-black tracking-wide truncate">{ep.url}</span>
                          <span className="hidden md:inline-block text-xs font-bold text-[#6A5242]/80 truncate ml-2">
                            {ep.desc}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 ml-2 shrink-0">
                          <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                            <ChevronDownIcon />
                          </span>
                        </div>
                      </button>

                      {/* Accordion Content (Swagger Collapsible) */}
                      {isOpen && (
                        <div className="border-t border-[#EADECC]/40 p-5 space-y-6 bg-white animate-fadeIn">
                          {/* Desc / Summary */}
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-[#6A5242]/60 uppercase tracking-widest">คำอธิบาย ENDPOINT</h4>
                            <p className="text-sm font-bold text-[#3C322A] leading-relaxed">{ep.summary}</p>
                          </div>

                          {/* Request parameters */}
                          {ep.parameters && ep.parameters.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-black text-[#6A5242]/60 uppercase tracking-widest">ข้อมูลฟิลด์ที่ส่ง (REQUEST PARAMETERS)</h4>
                              <div className="border border-[#EADECC]/50 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="bg-[#FDFBF7] border-b border-[#EADECC]/50 text-[#6A5242] font-black">
                                      <th className="p-2.5 w-1/4">Field / Parameter</th>
                                      <th className="p-2.5 w-1/4">Data Type</th>
                                      <th className="p-2.5 w-1/6">Required</th>
                                      <th className="p-2.5">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#EADECC]/30 text-[#3C322A] font-semibold">
                                    {ep.parameters.map((p, pIdx) => (
                                      <tr key={pIdx} className="hover:bg-[#FDFBF7]/40 transition">
                                        <td className="p-2.5 font-mono text-xs font-black">{p.name}</td>
                                        <td className="p-2.5 text-[#6A5242]/70">{p.type}</td>
                                        <td className="p-2.5">
                                          {p.required ? (
                                            <span className="text-rose-600 text-[10px] font-black px-1.5 py-0.5 bg-rose-50 border border-rose-100 rounded">Yes</span>
                                          ) : (
                                            <span className="text-[#6A5242]/50 text-[10px] font-bold">No</span>
                                          )}
                                        </td>
                                        <td className="p-2.5 text-[#6A5242]">{p.desc}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Request & Response Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Request Body Column */}
                            {ep.body ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-[#6A5242]/60 uppercase tracking-widest">REQUEST PAYLOAD (JSON)</span>
                                  <button
                                    onClick={() => copyCode(ep.id + "-req", ep.body)}
                                    className="text-xs text-[#556B2F] hover:text-[#3C322A] font-black flex items-center gap-1 cursor-pointer"
                                  >
                                    <CopyIcon />
                                    <span className="text-[10px]">{copiedId === (ep.id + "-req") ? "คัดลอกแล้ว!" : "Copy"}</span>
                                  </button>
                                </div>
                                <pre className="font-mono text-[11px] text-gray-200 bg-gray-900 p-4 rounded-lg overflow-x-auto leading-relaxed max-h-56">
                                  {ep.body}
                                </pre>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-[#6A5242]/60 uppercase tracking-widest">REQUEST PAYLOAD</span>
                                <div className="bg-[#FDFBF7] border border-[#EADECC]/40 rounded-lg p-4 text-xs font-bold text-[#6A5242]/50 italic">
                                  ไม่มี Request Payload (ใช้ส่งผ่าน URL หรือ Header)
                                </div>
                              </div>
                            )}

                            {/* Response Column */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-[#6A5242]/60 uppercase tracking-widest">SUCCESS RESPONSE (200 OK)</span>
                                <button
                                  onClick={() => copyCode(ep.id + "-res", ep.response)}
                                  className="text-xs text-[#556B2F] hover:text-[#3C322A] font-black flex items-center gap-1 cursor-pointer"
                                >
                                  <CopyIcon />
                                  <span className="text-[10px]">{copiedId === (ep.id + "-res") ? "คัดลอกแล้ว!" : "Copy"}</span>
                                </button>
                              </div>
                              <pre className="font-mono text-[11px] text-emerald-400 bg-gray-900 p-4 rounded-lg overflow-x-auto leading-relaxed max-h-56">
                                {ep.response}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
