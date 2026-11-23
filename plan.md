# 📋 Bare & Bold — Master System Plan & Architecture

> ระบบ Multi-Vendor e-Commerce เครื่องประดับและกำไลสายมู (Custom Made-to-Order & Ready-to-Ship)  
> **Tech Stack:** Next.js 16 (Storefront & Backoffice) · Hono + Bun (Backend REST API) · PostgreSQL / Neon (DB) · Cloudflare R2 (Storage) · Prisma ORM 7

---

## 🏗️ Architecture Overview

```
bareandbold_front/      ← หน้าร้านค้า (ผู้ซื้อ) + ศูนย์ผู้ขาย (Seller Center) :3000
bareandbold_backoffice/ ← หลังบ้านระบบกลางสำหรับ Admin / Staff                 :3001
bareandbold_backend/    ← REST API Server (Hono / Bun)                        :8000
```

---

## 📦 Database Models (Prisma Schema — 26 Models)

| Category | Models | หน้าที่หลัก |
| :--- | :--- | :--- |
| **Auth & Users** | `User`, `Address`, `Employee` | ระบบบัญชีลูกค้า, พนักงาน Admin/Staff, สมุดที่อยู่จัดส่ง |
| **Shop & Vendor** | `Shop`, `ShopTransaction`, `PayoutRequest` | ร้านค้าพาร์ตเนอร์, บัญชี Ledger (SALE, COMMISSION, PAYOUT), คำขอถอนเงิน |
| **Products & Customization** | `Product`, `ProductImage`, `CustomOption`, `CustomOptionValue`, `Category`, `Accessory`, `ProductAccessory` | สินค้าพร้อมส่ง/สั่งทำ, ตัวเลือกขนาดข้อมือ, คลังวัสดุตกแต่ง (จี้มงคล, ลูกปัดหิน, เชือกถัก) |
| **Cart & Ordering** | `Cart`, `CartItem`, `CartItemAccessory`, `Order`, `SubOrder`, `OrderItem`, `OrderItemAccessory` | ตะกร้าสินค้า, Multi-Vendor Split Order, Snapshot ราคาและส่วนลด |
| **Payment & Shipping** | `Payment`, `Shipping` | การชำระเงิน (PromptPay/Omise), การจัดส่งพร้อม Tracking No. |
| **Reviews & Feedback** | `Review`, `ReviewImage`, `ShopReview` | รีวิวสินค้าและร้านค้า (Verified Purchase), ให้คะแนนดาว |
| **Marketing & Vouchers** | `Voucher`, `UserVoucher`, `VoucherRedemption` | คูปองส่วนลด Platform, Shop, Shipping Voucher (ส่งฟรี) |
| **After-Sales & Ops** | `RefundRequest`, `RefundRequestImage`, `PlatformSettings`, `AuditLog`, `Notification` | การคืนเงิน/เปลี่ยนสินค้า, การตั้งค่า GP/ค่าส่ง, บันทึกประวัติการทำงาน, แจ้งเตือน |

---

## 🔌 Backend API Endpoints (สมบูรณ์ 100% ✅)

### 1. Authentication & Users
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`
- `POST /api/auth/backoffice/login`, `POST /api/auth/backoffice/register`
- `GET/POST/PUT/DELETE /api/addresses`

### 2. Products, Categories & Accessories
- `GET /api/products`, `GET /api/products/:id` (Public Catalog & Search)
- `GET /api/categories`, `GET /api/accessories` (คลังวัสดุ 43 รายการ)
- `POST /api/upload?folder=...` (Cloudflare R2 Image Upload)

### 3. Cart, Orders & Multi-Vendor Split Order
- `GET/POST/PUT/DELETE /api/cart` (Cart sync & merge)
- `POST /api/orders` (Multi-Vendor Checkout, Split SubOrders, Voucher Quote snapshot)
- `GET /api/orders`, `GET /api/orders/:id` (Buyer Order History)
- `POST /api/orders/sub-orders/:id/confirm-received` (Escrow release รายร้าน)
- `POST /api/orders/admin/auto-complete` + **Background Cron Runner** (`startAutoCompleteCron`)

### 4. Seller Center APIs
- `GET /api/seller/dashboard` (KPIs, GMV, Orders count)
- `GET/POST/PUT/DELETE /api/seller/products` (CRUD สินค้าร้านตนเอง)
- `GET/PUT /api/seller/orders` (Fulfillment: รับออเดอร์, เริ่มร้อยกำไล PRODUCING, ใส่เลขพัสดุ SHIPPED)
- `GET /api/seller/sales-summary`, `GET /api/seller/wallet`, `GET/POST /api/seller/payouts` (Wallet & Payout)
- `GET/POST/PUT/PATCH/DELETE /api/seller/vouchers` (คูปองของร้านค้า)
- `GET /api/seller/refunds` (จัดการคำขอคืนเงินของร้าน)

### 5. Vouchers & Promotion Engine
- `GET /api/vouchers` (หน้ารวมคูปองและกระเป๋าคูปองผู้ซื้อ)
- `POST /api/vouchers/claim` (เก็บโค้ดส่วนลด)
- `POST /api/vouchers/quote` (Server-authoritative Quote คำนวณส่วนลด Platform/Shop/Shipping)

### 6. Reviews & Ratings
- `POST /api/reviews` (รีวิวสินค้าเฉพาะผู้ที่ซื้อจริง)
- `GET /api/products/:id/reviews` (ดึงรีวิวสินค้าพร้อมรูป)
- `GET/POST /api/shops/:id/reviews` (ดึงและเขียนรีวิวร้านค้า)

### 7. Refunds & Customer Support
- `POST /api/refunds/request` (ยื่นคำขอคืนเงิน/เปลี่ยนสินค้า)
- `GET /api/refunds/my` (ติดตามสถานะคำขอคืนเงิน)
- `PUT /api/refunds/:id/approve`, `PUT /api/refunds/:id/reject`

### 8. Admin & Backoffice Portal
- `GET/PUT /api/admin/shops` (อนุมัติ/ระงับร้านค้า)
- `GET/PUT /api/admin/products/:id/moderate` (ซ่อน/ระงับสินค้า)
- `GET/PUT /api/admin/payouts` (อนุมัติโอนเงิน Payout ร้านค้า)
- `GET/PUT /api/admin/settings` (ตั้งค่า GP 5%, ค่าส่ง ฿50)
- `GET /api/admin/analytics` (GMV, GP, Platform Analytics)
- `GET /api/admin/audit-logs` (ประวัติการกระทำของเจ้าหน้าที่)

---

## 👥 สรุปบทบาทและการส่งมอบงานของทีม (Team Delivery)

1. **Role 1 — Frontend Engineer (Storefront & Catalog) + QA + Voucher Owner:**
   - หน้าร้านค้า, แคตตาล็อก, ตัวกรองสินค้า, หน้าร้านค้าผู้ขาย `/shop/[slug]`
   - ระบบการ์ดสุ่มดวงและจับคู่จี้หินมงคล `/fortune-card` (ทักษาปกรณ์ 7 วัน)
   - ระบบคูปองส่วนลด `/coupons`, `/vouchers`, Voucher Selector ตอน Checkout
   - ดูแล QA Test Plan และการทดสอบระบบร่วมกับทีม

2. **Role 2 — Frontend Engineer (Cart, Checkout & Orders):**
   - ตะกร้าสินค้า Multi-vendor, Checkout สรุปยอดแยกตามร้าน
   - ประวัติคำสั่งซื้อ `/orders`, ปุ่มยืนยันรับสินค้าเพื่อปล่อยเงิน Escrow
   - ระบบรีวิวสินค้าและร้านค้า (`ReviewModal` & `ProductReviewsSection`)
   - ระบบยื่นและติดตามคำขอคืนเงิน/เปลี่ยนสินค้า (แท็บ `REFUNDS`)

3. **Role 3 — Fullstack Engineer (Seller Center & Backoffice):**
   - ระบบ Onboarding สมัครร้านค้า `/become-seller`
   - ศูนย์ผู้ขาย (Seller Center) ครบวงจร: Dashboard, Products, Orders, Vouchers, Finance/Payout, Shop Profile, Refunds
   - หลังบ้านแอดมิน (Backoffice): จัดการร้านค้า, ตรวจสอบสินค้า, อนุมัติ Payout, ตรวจสอบรีวิว, รายงานสถิติ, และ Audit Logs

4. **Role 4 — Backend & Database Engineer:**
   - สถาปัตยกรรม Database Prisma Schema 26 โมเดล
   - Multi-Vendor Split Order Engine, Escrow Settlement & Transaction Ledger
   - Server-Authoritative Voucher Engine & Quote Evaluation
   - Background Cron Runner สำหรับ Auto-complete ออเดอร์เมื่อครบ 7 วัน
   - การรักษาความปลอดภัย Role Middleware, Wash Trading Prevention และ Inventory Deduction
