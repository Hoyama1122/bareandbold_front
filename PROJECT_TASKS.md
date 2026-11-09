# 📋 แผนงานและรายการสิ่งที่ต้องทำ (Project Task Breakdown)
## โปรเจกต์: Bracelet & Jewelry Marketplace (เว็บตัวกลางขายกำไลข้อมือ ข้อเท้า และเครื่องประดับ)

> **Tech Stack:**
> - **Frontend:** Next.js (App Router) + Tailwind CSS + Ant Design / Lucide Icons
> - **Backend:** Hono รันบน Bun Runtime (หรือ Node.js Express ตามโครงสร้างปัจจุบัน) + Prisma ORM
> - **Database:** PostgreSQL (Neon)
> - **Cloud Storage:** Cloudflare R2
> - **Payment Gateway:** Omise API (พร้อมระบบ Webhook)

---

## 📊 สรุปความคืบหน้าภาพรวม (Progress Overview)
- [x] **Phase 1:** Database Schema & Architecture Redesign (เสร็จแล้ว ✅)
- [ ] **Phase 2:** Authentication & Seller Onboarding (ระบบเปิดร้าน)
- [ ] **Phase 3:** Product Catalog & Customization Management
- [ ] **Phase 3.5:** 🔮 Gemstone & Astrology Recommender (ระบบจับคู่หินมงคลและราศี)
- [ ] **Phase 4:** Cart, Split Order & Escrow Payment
- [ ] **Phase 5:** Fulfillment & Order Tracking (จัดส่งและติดตามพัสดุ)
- [ ] **Phase 6:** Seller Center & Wallet (แดชบอร์ดร้านค้าและการถอนเงิน)
- [ ] **Phase 7:** Admin Backoffice (ระบบควบคุมและอนุมัติตัวกลาง)
- [ ] **Phase 8:** Testing & Deployment

---

## 👥 การแบ่งหน้าที่รับผิดชอบตามตำแหน่งและบทบาท (Role-Based Task Division)

| Role / ตำแหน่งงาน | ขอบเขตรับผิดชอบหลัก (Domain) | กลุ่มผู้ใช้ที่ดูแล (Actors) | โฟลเดอร์ที่รับผิดชอบ |
| :--- | :--- | :--- | :--- |
| **🔵 Role 1: Frontend Engineer**<br>*(Storefront & Catalog)* | หน้าร้านค้า, แคตตาล็อกสินค้า, ค้นหา/กรอง, หน้าร้านผู้ขาย, ระบบดูดวงหินมงคล | Guest, Buyer | `bareandbold_front/` |
| **🟢 Role 2: Frontend Engineer**<br>*(Transaction & Orders)* | ตะกร้าสินค้าแยกตามร้าน, Checkout, ชำระเงิน Omise, ไทม์ไลน์ติดตามพัสดุ, รีวิว | Buyer | `bareandbold_front/` |
| **🟠 Role 3: Fullstack / Portal Engineer**<br>*(Seller Center & Admin)* | ระบบสมัครเปิดร้าน, แดชบอร์ดผู้ขาย, จัดการสินค้า/ออเดอร์ร้านค้า, ระบบแอดมินอนุมัติ | Seller, Admin, Staff | `bareandbold_front/src/app/seller/`<br>`bareandbold_backoffice/` |
| **🟣 Role 4: Backend & Database Engineer**<br>*(API & Financial Escrow)* | REST APIs ทั้งหมด, ฐานข้อมูล Prisma, ระบบพักเงิน Escrow, Omise Webhook, Wallet | System, DB, Payment | `bareandbold_backend/` |

---

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Marketplace Ecosystem Architecture                              │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│ 🔵 Role 1: Frontend        │ 🟢 Role 2: Frontend         │ 🟠 Role 3: Fullstack        │
│ Storefront, Catalog &      │ Cart, Checkout, Tracking,   │ Seller Portal (Dashboard) & │
│ AI Gemstone Recommender    │ Omise UI, Reviews & Refund  │ Admin Backoffice Approval   │
├────────────────────────────┴─────────────────────────────┴─────────────────────────────┤
│ 🟣 Role 4: Backend & Database Engineer                                                 │
│ REST API (Hono/Bun), Prisma Multi-file ORM, Split Order Engine, Omise Escrow & Wallet │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 🔵 Role 1: Frontend Engineer — Storefront, Product Experience & AI Recommender
* **บทบาท / ตำแหน่ง:** Frontend Developer (Customer Discovery & Experience)
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** ผู้เยี่ยมชมทั่วไป (Guest) และ ผู้ซื้อ (Buyer)
* **โฟลเดอร์หลัก:** `bareandbold_front/`
* **เทคโนโลยี:** Next.js (App Router), Tailwind CSS, Lucide Icons, Fetch API
* **ความรับผิดชอบหลัก (Core Duties):**
  - [ ] **Homepage (`/`)**:
    - [ ] เชื่อมต่อ API ดึงสินค้าแนะนำและสินค้ามาใหม่
    - [ ] แสดงหมวดหมู่สินค้าหลัก (กำไลข้อมือ BRACELET, กำไลข้อเท้า ANKLET)
    - [ ] แสดงการ์ดร้านค้ายอดนิยมใน Marketplace พร้อมลิงก์ไปหน้าร้าน
    - [ ] Hero Banner & Promotional Campaigns
  - [ ] **Product Catalog & Search (`/products`)**:
    - [ ] แถบค้นหาแบบ Realtime (Search by Name / Shop)
    - [ ] ระบบตัวกรองละเอียด (Filter Panel):
      - กรองตามหมวดหมู่ (ข้อมือ, ข้อเท้า)
      - กรองตามประเภท (สินค้าพร้อมส่ง READY_TO_SHIP vs สินค้าสั่งทำ MADE_TO_ORDER)
      - กรองตามช่วงราคา (Price Range Slider)
      - กรองตามขนาดความยาวรอบข้อมือ/ข้อเท้า (ซม.)
    - [ ] ระบบเรียงลำดับ (Sort by: ล่าสุด, ราคาต่ำ-สูง, ราคาสูง-ต่ำ, เรตติ้งดาว)
  - [ ] **Product Detail Page (`/products/[id]`)**:
    - [ ] แกลเลอรีรูปภาพสินค้า (รองรับ Thumbnail และรูปขนาดใหญ่จาก Cloudflare R2)
    - [ ] แสดง Badge ชนิดสินค้า: "พร้อมส่ง" หรือ "สั่งทำพิเศษ (Made-to-Order: ใช้เวลาผลิต X วัน)"
    - [ ] Interactive Customizer Selector: เลือกขนาดรอบข้อมือ (14-20 cm), สีเชือก, จี้/ชาร์ม
    - [ ] Seller Profile Card: แสดงชื่อร้าน, โลโก้, คะแนนดาวร้าน, และปุ่ม "ไปที่หน้าร้าน"
    - [ ] Customer Reviews & Ratings: แสดงคะแนนดาวเฉลี่ย ⭐, กราฟสรุปคะแนน, และรายการคอมเมนต์พร้อมรูปถ่ายสินค้าจริง
  - [ ] **Shop Profile Page (`/shop/[slug]`)**:
    - [ ] หน้าร้านค้าเฉพาะของผู้ขายแต่ละราย แสดงแบนเนอร์, โลโก้, รายละเอียดร้าน, คะแนนรีวิวเฉลี่ย
    - [ ] Grid แสดงรายการสินค้าทั้งหมดเฉพาะของร้านนี้ พร้อมตัวกรองหมวดหมู่ภายในร้าน
  - [ ] **Wishlist Page (`/account/wishlist`)**: หน้ารายการสินค้าโปรดของลูกค้า (บันทึก/ลบ/ย้ายไปตะกร้า)
  - [ ] **🔮 หน้าระบบจับคู่หินมงคลและราศี (`/horoscope` หรือ `/gemstone-guide`) (Feature Highlight)**:
    - [ ] Interactive Form: เลือกวันเกิด (จันทร์-อาทิตย์), ราศี (12 ราศี), และด้านที่ต้องการเสริมดวง (การงาน, การเงิน, ความรัก, สุขภาพ)
    - [ ] Result Card: แสดงการ์ดผลการทำนาย (หินมงคลหลัก-รอง, โทนสีมงคล, สีกาลกิณีที่ควรหลีกเลี่ยง)
    - [ ] Matched Products Carousel: แสดงรายการกำไล/ข้อเท้าในระบบที่มีหินและสีตรงกับคำทำนาย พร้อมปุ่มคลิกสั่งซื้อทันที
* **API Endpoints ที่ต้องประสานงานกับ Role 4:**
  - `GET /api/products` (query: search, category, type, minPrice, maxPrice, minWrist, maxWrist)
  - `GET /api/products/:id`
  - `GET /api/products/:id/reviews`
  - `POST /api/recommend/gemstones`
  - `GET /api/shops/:slug`
  - `GET/POST/DELETE /api/wishlist`

---

### 🟢 Role 2: Frontend Engineer — Cart, Checkout, Order Tracking & Reviews
* **บทบาท / ตำแหน่ง:** Frontend Developer (Transaction, Post-Purchase & Customer Portal)
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** ผู้ซื้อ (Buyer / Customer)
* **โฟลเดอร์หลัก:** `bareandbold_front/`
* **เทคโนโลยี:** Next.js (App Router), Tailwind CSS, Omise.js SDK, Cookie Management
* **ความรับผิดชอบหลัก (Core Duties):**
  - [ ] **Customer Authentication Flow**:
    - [ ] หน้าเข้าสู่ระบบ (`/auth/login`) และหน้าสมัครสมาชิก (`/auth/register`)
    - [ ] จัดการ Auth State, HTTP-only Cookie, JWT Session
    - [ ] หน้าจัดการข้อมูลส่วนตัว (`/account/profile`) และจัดการสมุดที่อยู่ (`/account/addresses`)
  - [ ] **Multi-Vendor Shopping Cart (`/cart`)**:
    - [ ] แสดงรายการสินค้า **จัดกลุ่มแยกตามร้านค้า (Group by Shop)** แบบเดียวกับ Shopee
    - [ ] ปรับเพิ่ม/ลดจำนวน, เลือกลบสินค้า, และแสดงตัวเลือกขนาด Custom ที่ลูกค้าเลือกไว้
    - [ ] Checkbox เลือกสั่งซื้อเฉพาะบางร้านค้า หรือเลือกทั้งหมด
    - [ ] คำนวณสรุปราคาสินค้ารวมและค่าจัดส่งแยกรายร้านค้าแบบ Dynamic
  - [ ] **Checkout Page (`/checkout`)**:
    - [ ] ฟอร์มเลือกที่อยู่จัดส่งจากสมุดที่อยู่ หรือเพิ่มที่อยู่ใหม่
    - [ ] สรุปคำสั่งซื้อแยกตามร้านค้าก่อนชำระเงิน
    - [ ] Integration กับ Omise Payment Gateway UI:
      - ชำระเงินด้วย PromptPay QR Code (แสดงตัวจับเวลานับถอยหลัง และปุ่มบันทึกรูป QR)
      - ชำระเงินด้วยบัตรเครดิต/เดบิต (Omise Tokenization)
  - [ ] **Order Tracking & History (`/account/orders`)**:
    - [ ] หน้าประวัติคำสั่งซื้อทั้งหมด พร้อมแท็บแยกสถานะ: `ทั้งหมด`, `รอชำระ`, `กำลังผลิต`, `จัดส่งแล้ว`, `สำเร็จ`, `ยกเลิก`
    - [ ] แสดง **Timeline สถานะออเดอร์** ชัดเจน:
      `รอชำระเงิน` ➔ `ชำระเงินแล้ว` ➔ `ร้านกำลังผลิต (สำหรับ Custom)` ➔ `จัดส่งแล้ว (แสดงเลขพัสดุ + ลิงก์เช็คขนส่ง)` ➔ `สำเร็จ`
  - [ ] **Order Confirmation & Review Modal**:
    - [ ] ปุ่ม **"ยืนยันการรับสินค้า (Confirm Received)"** เพื่อส่งสัญญาณปลดล็อกเงินให้ร้านค้า
    - [ ] **Modal / หน้ารีวิวสินค้า (`/account/orders/[id]/review`)**:
      - ให้คะแนนดาว 1-5 ดาว ⭐⭐⭐⭐⭐
      - กล่องข้อความคอมเมนต์แสดงความคิดเห็น
      - อัปโหลดรูปภาพสินค้าจริงที่ได้รับ (Review Images)
  - [ ] **Refund / Dispute System (`/account/orders/[id]/refund`)**:
    - [ ] ฟอร์มยื่นขอคืนเงิน/คืนสินค้า กรณีสินค้าแตกหัก หรือร้านไม่ส่งตามกำหนด (แนบรูปภาพหลักฐาน)
* **API Endpoints ที่ต้องประสานงานกับ Role 4:**
  - `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`
  - `GET/POST/PUT/DELETE /api/addresses`
  - `GET/POST/PUT/DELETE /api/cart`
  - `POST /api/orders/checkout`
  - `GET /api/orders/my-orders`, `GET /api/orders/:id`
  - `POST /api/orders/:subOrderId/confirm-received`
  - `POST /api/reviews`
  - `POST /api/refunds/request`

---

### 🟠 Role 3: Fullstack / Portal Engineer — Seller Center & Admin Backoffice
* **บทบาท / ตำแหน่ง:** Fullstack & Platform Operations Developer
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** ผู้ขาย (Seller / Artisan) และ ผู้ดูแลระบบกลาง (Admin / Staff)
* **โฟลเดอร์หลัก:** `bareandbold_front/src/app/seller/` (พอร์ทัลร้านค้า) & `bareandbold_backoffice/` (ระบบแอดมิน)
* **เทคโนโลยี:** Next.js, Ant Design / Tailwind CSS, Cloudflare R2 Upload Client, Chart.js / Recharts
* **ความรับผิดชอบหลัก (Core Duties):**
  - [ ] **ระบบสมัครเปิดร้านค้าสำหรับผู้ขาย (`/become-seller`)**:
    - [ ] ฟอร์มกรอกชื่อร้าน, URL Slug, คำอธิบายร้าน, อัปโหลดโลโก้และภาพแบนเนอร์
    - [ ] ฟิลด์บังคับยืนยันตัวตน (KYC): **เลขประจำตัวผู้เสียภาษี (Tax ID)**, ชื่อบัญชีและเลขที่บัญชีธนาคาร
    - [ ] หน้าแสดงสถานะ "รอการตรวจสอบและอนุมัติจากแอดมิน (Pending Approval)"
  - [ ] **Seller Center Dashboard (`/seller/dashboard`)**:
    - [ ] KPI Cards: ยอดขายรวมประจำเดือน, จำนวนออเดอร์ใหม่, สินค้าที่ต้องจัดส่ง/ผลิต
    - [ ] กราฟแสดงแนวโน้มยอดขายย้อนหลัง
  - [ ] **Seller Product Management (`/seller/products`)**:
    - [ ] ตารางสินค้าของร้านตนเอง (แสดงรูป, ชื่อ, สต็อก, ประเภท, ราคา)
    - [ ] ฟอร์มสร้าง/แก้ไขสินค้า:
      - อัปโหลดรูปภาพสินค้าขึ้น Cloudflare R2 (เลือกรูปหน้าปก + รูปแกลเลอรี)
      - กำหนดประเภท: พร้อมส่ง (READY_TO_SHIP) หรือ สั่งทำ (MADE_TO_ORDER พร้อมระบุจำนวนวันผลิต เช่น 3, 7, 14 วัน)
      - กำหนดขนาดรอบข้อมือ/ข้อเท้าที่ร้านรับทำ (Wrist Size Min - Max)
      - จัดการตัวเลือก Custom Options (ขนาด, สีเชือก, จี้ที่เลือกได้)
    - [ ] ปุ่มเปิด-ปิดการขายสินค้า และปุ่มลบสินค้า (Soft Delete)
  - [ ] **Seller Order Fulfillment (`/seller/orders`)**:
    - [ ] หน้ารายการออเดอร์ของร้านตนเอง (SubOrders) แยกแท็บสถานะ
    - [ ] ปุ่มอัปเดตสถานะเป็น "กำลังผลิต (In Production)" สำหรับงาน Made-to-Order
    - [ ] ฟอร์มบันทึกการจัดส่ง: เลือกบริษัทขนส่ง (ไปรษณีย์ไทย, Flash Express, Kerry, J&T) และกรอกเลข Tracking Number
  - [ ] **Seller Wallet & Payout System (`/seller/wallet`)**:
    - [ ] แสดงยอดเงินคงเหลือที่ถอนได้ (Available Balance) และยอดที่รอดำเนินการ (Pending Balance)
    - [ ] ตารางประวัติรายการเดินบัญชี (รายรับจากออเดอร์, การหักค่าธรรมเนียม GP 5%)
    - [ ] ฟอร์มกดยื่นคำขอถอนเงิน (Request Payout) ไปยังบัญชีธนาคารที่ผูกไว้
  - [ ] **Admin Backoffice System (`bareandbold_backoffice/`)**:
    - [ ] **หน้าอนุมัติร้านค้าใหม่ (`/backoffice/shops`)**: ตรวจสอบข้อมูลร้านและเลข Tax ID กด Approve หรือ Reject
    - [ ] **หน้าอนุมัติการถอนเงิน (`/backoffice/payouts`)**: ตรวจสอบรายการขอถอนเงินของร้านค้า, แนบสลิปหลักฐานการโอน และกดยืนยันการโอนเงิน (Transferred)
    - [ ] **หน้าตรวจสอบสินค้า (Product Moderation)**: ตรวจสอบและระงับสินค้าที่ไม่เหมาะสม
    - [ ] **หน้าจัดการข้อพิพาท/คืนเงิน (`/backoffice/refunds`)**: ตรวจสอบคำขอคืนเงินของลูกค้าและไกล่เกลี่ย
* **API Endpoints ที่ต้องประสานงานกับ Role 4:**
  - `POST /api/shops/apply`, `GET /api/shops/my-shop`, `PUT /api/shops/my-shop`
  - `GET/POST/PUT/DELETE /api/seller/products`
  - `GET /api/seller/orders`, `PUT /api/seller/orders/:id/status`, `POST /api/seller/orders/:id/ship`
  - `GET /api/seller/wallet`, `POST /api/seller/payouts/request`
  - `GET/PUT /api/admin/shops/:id/approve`
  - `GET/PUT /api/admin/payouts/:id/approve`
  - `GET/PUT /api/admin/refunds/:id`

---

### 🟣 Role 4: Backend & Database Engineer — Architecture, Escrow & REST APIs
* **บทบาท / ตำแหน่ง:** Backend, Database & Payment System Engineer
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** Core Platform, Financial Escrow Engine, Integration Services
* **โฟลเดอร์หลัก:** `bareandbold_backend/`
* **เทคโนโลยี:** Hono Framework, Bun Runtime, PostgreSQL (Neon), Prisma ORM (Multi-File Schema), Omise API, Cloudflare R2 SDK
* **ความรับผิดชอบหลัก (Core Duties):**
  - [ ] **Database Architecture & Multi-File Schema Management**:
    - [ ] ดูแลความสมบูรณ์ของโครงสร้างตาราง 26 โมเดล ในโฟลเดอร์ `prisma/schema/*.prisma`
    - [ ] ควบคุม Data Migration, Indexing, Performance Query และ Seed Data
  - [ ] **Authentication & Role Authorization Middleware**:
    - [ ] ระบบ JWT Authentication (Sign / Verify / HTTP-only Cookie)
    - [ ] Middleware ตรวจสอบสิทธิ์: `isBuyer`, `isSeller`, `isApprovedSeller`, `isAdmin`, `isStaff`
  - [ ] **Multi-Vendor Product Catalog APIs**:
    - [ ] `GET /api/products`: Full-text Search, Filtering (ข้อมือ/ข้อเท้า, พร้อมส่ง/สั่งทำ, ขนาด, ราคา) และ Pagination
    - [ ] `GET /api/products/:id`: ดึงข้อมูลสินค้าพร้อม Images, Custom Options, Accessories และ Shop Info
    - [ ] `POST/PUT/DELETE /api/seller/products`: จัดการสินค้าเฉพาะของร้านค้าตนเอง (Seller Guard)
    - [ ] `POST /api/upload`: อัปโหลดรูปภาพสินค้าขึ้น Cloudflare R2
  - [ ] **Multi-Vendor Cart & Split Order Engine (หัวใจของระบบตัวกลาง)**:
    - [ ] `GET/POST/PUT/DELETE /api/cart`: จัดการตะกร้าสินค้า (รองรับ Custom Options & Accessories)
    - [ ] `POST /api/orders/checkout`: บันทึก Master Order และ**แตก SubOrder ตามแต่ละร้านค้าโดยอัตโนมัติ (Split Order Logic)**
  - [ ] **Omise Payment Gateway & Escrow Webhook**:
    - [ ] `POST /api/payments/checkout`: สร้าง Charge กับ Omise (รองรับ PromptPay QR Code และ Credit Card)
    - [ ] `POST /api/payments/webhook`: Webhook Listener รับสถานะการจ่ายเงินแบบ Realtime ➔ ปรับสถานะเป็น `PAID` ทั้ง Master Order และ SubOrders
    - [ ] ระบบ Escrow (พักเงินไว้ที่ระบบตัวกลาง): ยังไม่โอนเงินเข้าร้านค้าจนกว่าลูกค้าจะยืนยันรับของ
  - [ ] **Fulfillment, Confirmation & Escrow Release APIs**:
    - [ ] `PUT /api/seller/orders/:subOrderId/status`: ร้านค้าเปลี่ยนสถานะเป็นกำลังผลิต
    - [ ] `POST /api/seller/orders/:subOrderId/ship`: ร้านค้าบันทึกชื่อขนส่งและเลข Tracking Number
    - [ ] `POST /api/orders/:subOrderId/confirm-received`: ลูกค้ายืนยันรับของ ➔ **ปลดล็อกเงิน Escrow** (คำนวณหักค่าธรรมเนียม GP 5% ➔ โอนเงิน Net Amount เข้า `Shop.balance` ➔ บันทึกประวัติ `ShopTransaction`)
  - [ ] **Reviews & Ratings APIs**:
    - [ ] `POST /api/reviews`: ส่งรีวิว (ตรวจสอบสิทธิ์ว่าต้องซื้อจริง `orderItemId`, ให้คะแนน 1-5 ดาว, บันทึกรูป)
    - [ ] อัปเดตคำนวณคะแนนเฉลี่ย (`rating`) และจำนวนรีวิว (`reviewCount`) บนตาราง `Product` อัตโนมัติ
    - [ ] `GET /api/products/:id/reviews` & `GET /api/shops/:id/reviews`
  - [ ] **🔮 Gemstone & Astrology Recommendation API (AI / Algorithmic)**:
    - [ ] `POST /api/recommend/gemstones`: รับข้อมูล `{ dayOfWeek, zodiacSign, focusArea }`
    - [ ] Gemstone Knowledge Algorithm: วิเคราะห์หินมงคล + สีเชือกมงคล + สีกาลกิณีประจำวันเกิด
    - [ ] Query ค้นหาสินค้ากำไล/ข้อเท้าในระบบที่มีหินหรือสีตรงกับผลทำนาย แล้วส่งกลับให้หน้าบ้าน
  - [ ] **Wallet, Payouts & Admin Management APIs**:
    - [ ] `GET /api/seller/wallet`: ดึงยอดคงเหลือและประวัติธุรกรรมกระเป๋าเงิน
    - [ ] `POST /api/seller/payouts/request`: ร้านค้ายื่นคำขอถอนเงินเข้าบัญชีธนาคาร
    - [ ] `GET/PUT /api/admin/shops`: ดึงรายชื่อร้านค้าเพื่อกด Approve/Reject
    - [ ] `GET/PUT /api/admin/payouts`: ดึงรายการคำขอถอนเงินเพื่ออนุมัติและบันทึกสลิปโอน
    - [ ] `POST/GET/PUT /api/refunds`: จัดการคำร้องขอคืนเงิน
* **เครื่องมือและบริการที่ต้องดูแล:**
  - Neon PostgreSQL, Cloudflare R2, Omise Payment Sandbox

---

---

---

## 🗄️ Phase 1: การปรับโครงสร้างฐานข้อมูล (Database Schema)

- [x] **1.1 อัปเดต Model `User`**
  - [x] เพิ่มความสัมพันธ์กับ `Shop` (1 User can own 1 Shop)
  - [x] เพิ่ม Role: `BUYER`, `SELLER`, `ADMIN`
- [x] **1.2 สร้าง Model `Shop` (ร้านค้าพาร์ทเนอร์)**
  - [x] ฟิลด์: `id`, `ownerId`, `name`, `slug`, `logoUrl`, `bannerUrl`, `description`
  - [x] ฟิลด์ยืนยันตัวตน: `taxId` (เลขผู้เสียภาษี), `idCardUrl`, `bankName`, `bankAccountNumber`, `bankAccountName`
  - [x] สถานะร้าน: `status` (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`)
  - [x] เวลาและยอดเงินสะสม: `balance`, `createdAt`, `updatedAt`
- [x] **1.3 ปรับปรุง Model `Product` (สินค้าเครื่องประดับ)**
  - [x] เชื่อมโยงกับ `shopId` (`Shop`)
  - [x] เพิ่มประเภท: `type` (`READY_TO_SHIP`, `MADE_TO_ORDER`)
  - [x] สำหรับงานสั่งทำ: เพิ่ม `leadTimeDays` (ระยะเวลาผลิต เช่น 3, 7, 14 วัน)
  - [x] หมวดหมู่เฉพาะ: `category` (`BRACELET`, `ANKLET`, `RING`, `NECKLACE`)
  - [x] สเปกสินค้า: `wristSizeMin`, `wristSizeMax` (ขนาดความยาวข้อมือ/ข้อเท้า)
- [x] **1.4 สร้างโครงสร้าง Multi-Vendor Order (แยกคำสั่งซื้อตามร้าน)**
  - [x] Model `Order` (Master Order): เก็บยอดชำระรวมของผู้ซื้อ, ช่องทางชำระเงิน, สถานะการจ่ายเงิน
  - [x] Model `SubOrder` (คำสั่งซื้อแยกตามร้าน): มีสถานะการผลิต/จัดส่งแยกกัน (`PENDING`, `PAID`, `PRODUCING`, `SHIPPED`, `DELIVERED`, `COMPLETED`)
  - [x] Model `OrderItem`: รองรับการเชื่อมทั้ง Master Order และ SubOrder พร้อม `customDetails`
- [x] **1.5 สร้าง Model ด้านการเงิน (Escrow & Payout)**
  - [x] Model `ShopTransaction`: บันทึกประวัติกระเป๋าเงิน (ยอดขาย, ค่าคอมมิชชัน, ถอนเงิน)
  - [x] Model `PayoutRequest`: คำขอถอนเงินของร้านค้า (`PENDING`, `APPROVED`, `TRANSFERRED`, `REJECTED`)
- [x] **1.6 สร้าง Model รีวิวและคะแนนดาว (Reviews & Ratings)**
  - [x] Model `Review`: ให้คะแนนดาว 1-5 ดาว, ข้อความคอมเมนต์, ผูกกับ `orderItemId` ป้องกันการสแปมรีวิว (Verified Purchase)
  - [x] Model `ReviewImage`: รองรับการแนบรูปภาพสินค้าจริงที่ได้รับ
  - [x] เพิ่ม `rating` (คะแนนเฉลี่ย) และ `reviewCount` บน Model `Product`
- [x] **1.7 ซิงค์ Prisma เข้า Database (Neon) และ Generate Prisma Client**
  - [x] อัปเดต `prisma.config.ts` ให้โหลด `.env` จาก backend อย่างถูกต้อง
  - [x] รัน `prisma db push` ซิงค์ Table ทั้งหมดขึ้นฐานข้อมูล Neon สำเร็จ
  - [x] รัน `prisma generate` สร้าง types สำหรับ Client v7.8.0 เรียบร้อย

---

## 🔐 Phase 2: ระบบสมาชิกและการเปิดร้าน (Auth & Seller Onboarding)

### ฝั่ง Backend
- [ ] **2.1 API ตรวจสอบสิทธิ์และโปรไฟล์**
  - [ ] ปรับปรุง JWT Payload ให้เก็บข้อมูล `shopId` และ `shopStatus` (ถ้ามีร้าน)
  - [ ] Middleware ตรวจสอบสิทธิ์: `isSeller`, `isApprovedSeller`, `isAdmin`
- [ ] **2.2 API สมัครเปิดร้านค้า (Become a Seller)**
  - [ ] `POST /api/shops/apply`: ส่งข้อมูลชื่อร้าน, เลขประจำตัวผู้เสียภาษี (Tax ID), ข้อมูลบัญชีธนาคาร
  - [ ] `GET /api/shops/my-shop`: ดึงข้อมูลร้านค้าของผู้ใช้ปัจจุบัน
  - [ ] `PUT /api/shops/my-shop`: แก้ไขข้อมูลร้านค้า/โลโก้

### ฝั่ง Frontend (Buyer/Seller Web)
- [ ] **2.3 หน้าสมัครเปิดร้าน (`/become-seller`)**
  - [ ] แบบฟอร์มลงทะเบียนร้านค้า (ชื่อร้าน, คำอธิบายร้าน)
  - [ ] ฟิลด์กรอกเลข Tax ID และอัปโหลดหน้าสมุดบัญชีธนาคาร
  - [ ] หน้าแสดงสถานะ "รอการตรวจสอบจากแอดมิน (Pending Approval)"
- [ ] **2.4 สวิตช์สลับโหมดผู้ซื้อ / ผู้ขายบนแถบเมนู (Header Navigation)**

---

## 💍 Phase 3: ระบบจัดการสินค้า & หน้าร้าน (Catalog & Customization)

### ฝั่ง Backend
- [ ] **3.1 API สินค้าสำหรับผู้ซื้อ (Public Catalog)**
  - [ ] `GET /api/products`: ค้นหา, เรียงลำดับ, ตัวกรอง (กำไลข้อมือ/ข้อเท้า, พร้อมส่ง/สั่งทำ, ช่วงราคา, หินมงคล)
  - [ ] `GET /api/products/:id`: ดูรายละเอียดสินค้าพร้อมข้อมูลร้านค้า
  - [ ] `GET /api/shops/:slug`: ข้อมูลร้านค้าและสินค้าทั้งหมดของร้านนั้น
- [ ] **3.2 API จัดการสินค้าสำหรับร้านค้า (Seller Product API)**
  - [ ] `POST /api/seller/products`: เพิ่มสินค้า (ผูกกับ shopId ของตนเองอัตโนมัติ)
  - [ ] `PUT /api/seller/products/:id`: แก้ไขสินค้าของร้านตนเอง
  - [ ] `DELETE /api/seller/products/:id`: ลบสินค้า (Soft Delete)
  - [ ] `POST /api/upload`: อัปโหลดรูปภาพสินค้าขึ้น Cloudflare R2

### ฝั่ง Frontend
- [ ] **3.3 หน้ารวมสินค้าและตัวกรอง (`/products`)**
  - [ ] ระบบค้นหาตามชื่อสินค้า / ร้านค้า
  - [ ] แถบกรองหมวดหมู่: กำไลข้อมือ (Bracelet), กำไลข้อเท้า (Anklet), แหวน, สร้อยคอ
  - [ ] แถบกรองประเภทสินค้า: สินค้าพร้อมส่ง (Ready-to-Ship) vs งานสั่งทำ (Made-to-Order)
- [ ] **3.4 หน้ารายละเอียดสินค้า (`/products/[id]`)**
  - [ ] แกลเลอรีรูปภาพสินค้า
  - [ ] ป้ายแสดงเวลาผลิต (เช่น "สินค้าสั่งทำ: ผลิตภายใน 5-7 วัน")
  - [ ] ตัวเลือกปรับแต่ง: เลือกขนาดความยาวรอบข้อมือ/ข้อเท้า (เช่น 14 ซม., 15 ซม., หรือกำหนดเอง)
  - [ ] การ์ดข้อมูลร้านค้า (ลิงก์ไปยังหน้าร้านของผู้ขาย)
- [ ] **3.5 หน้าร้านค้า (`/shop/[slug]`)**
  - [ ] แสดง Header ร้านค้า (โลโก้, แบนเนอร์, รายละเอียด, คะแนนรีวิว)
  - [ ] Grid รายการสินค้าทั้งหมดเฉพาะของร้านนี้

---

## 🔮 Phase 3.5 (Feature Highlight): ระบบจับคู่หินมงคลและราศี (AI / Algorithmic Gemstone Recommender)
*จุดเด่นประจำเทอมใหม่: ตอบโจทย์ตลาดกำไล/เครื่องประดับสายมูในไทย ยกระดับโปรเจกต์ด้วยการนำ Logic & AI เข้ามาเชื่อมโยงกับแคตตาล็อกสินค้าจริงในระบบ*

### ฝั่ง Backend
- [ ] **3.5.1 พัฒนา Gemstone Knowledge Base & Recommendation Logic**
  - [ ] ฐานข้อมูลจับคู่ความเชื่อ: วันเกิด (จันทร์-อาทิตย์), ราศี (12 ราศี), ด้านที่เสริมดวง (การงาน, การเงิน, ความรัก, สุขภาพ, โชคลาภ)
  - [ ] ข้อมูลหินมงคลประจำด้าน: เช่น ลาพิส ลาซูลี (การงาน/สติปัญญา), โรสควอตซ์ (ความรัก), ซิทริน/ไหมทอง (การเงิน), นิลดำ (ป้องกันภัย)
  - [ ] กฎเกณฑ์สีมงคลและสีกาลกิณีประจำวันเกิด
  - [ ] API `POST /api/recommend/gemstones`: รับข้อมูลผู้ใช้ ➔ วิเคราะห์หินมงคล + สีเชือกที่ถูกโฉลก + สีกาลกิณี ➔ Query ค้นหาสินค้ากำไล/ข้อเท้าในระบบที่มีหินหรือสีตรงกัน
  - [ ] (Option เสริม AI): เชื่อมต่อ Gemini API ร่วมวิเคราะห์คำทำนายและแต่งคำแนะนำเฉพาะบุคคลแบบ Personalized

### ฝั่ง Frontend
- [ ] **3.5.2 พัฒนาหน้าระบบดูดวงและแนะนำเครื่องประดับ (`/horoscope` หรือ `/gemstone-guide`)**
  - [ ] Interactive Form: เลือกวันเกิด (จันทร์-อาทิตย์), ราศี, และด้านที่ต้องการเสริมดวง
  - [ ] Result Card: แสดงการ์ดผลการทำนาย (หินมงคลที่แนะนำ, โทนสีมงคล, สีกาลกิณีที่ควรหลีกเลี่ยง)
  - [ ] Matched Products Shelf: แสดงรายการกำไลข้อมือ/ข้อเท้าจากร้านค้าต่างๆ ที่มีหินและสีตรงกับคำทำนาย พร้อมปุ่มคลิกสั่งซื้อทันที

---

## 🛒 Phase 4: ระบบตะกร้า, สั่งซื้อ & ชำระเงิน (Cart, Split Order & Escrow)

### ตะกร้าสินค้า (Cart)
- [ ] **4.1 ระบบตะกร้าแยกกลุ่มตามร้านค้า (Group by Shop)**
  - [ ] หน้า `/cart` แสดงสินค้าจัดกลุ่มตามร้านค้าแบบเดียวกับ Shopee/Lazada
  - [ ] สรุปค่าจัดส่งและยอดรวมแยกแต่ละร้านค้า

### การสั่งซื้อและชำระเงิน (Checkout & Escrow)
- [ ] **4.2 API Checkout & Split Order**
  - [ ] `POST /api/orders/checkout`: บันทึกคำสั่งซื้อหลัก (Master Order) และแตกเป็น SubOrder ตามแต่ละร้านค้า
- [ ] **4.3 เชื่อมต่อระบบชำระเงิน Omise Payment Gateway**
  - [ ] รองรับ PromptPay QR Code และบัตรเครดิต/เดบิต
  - [ ] ระบบ Webhook (`POST /api/payments/webhook`) รับสถานะการจ่ายเงิน
- [ ] **4.4 กลไกการพักเงินตัวกลาง (Escrow Flow)**
  - [ ] เมื่อลูกค้าชำระเงิน ยอดเงินจะเข้าสู่บัญชีกลางของระบบก่อน
  - [ ] สถานะ SubOrder ของแต่ละร้านจะเปลี่ยนเป็น `PAID` / `WAITING_FOR_PRODUCTION`

---

## 🚚 Phase 5: ระบบจัดส่งและติดตามสถานะ (Fulfillment & Tracking)

### ฝั่งร้านค้า (Seller Fulfillment)
- [ ] **5.1 ระบบจัดการคำสั่งซื้อของร้านค้า**
  - [ ] หน้ารายการออเดอร์ของร้าน (`/seller/orders`)
  - [ ] ปุ่มเปลี่ยนสถานะ: `กำลังผลิต (In Production)` สำหรับสินค้า Made-to-Order
  - [ ] ฟอร์มใส่ข้อมูลจัดส่ง: เลือกบริษัทขนส่ง (ไปรษณีย์ไทย, Flash, Kerry) และกรอกเลขพัสดุ (Tracking Number)
  - [ ] API `POST /api/seller/orders/:subOrderId/ship`

### ฝั่งผู้ซื้อ (Buyer Tracking & Confirmation)
- [ ] **5.2 หน้าติดตามคำสั่งซื้อ (`/account/orders`)**
  - [ ] ไทม์ไลน์สถานะออเดอร์:
    `รอชำระเงิน` ➔ `ชำระแล้ว` ➔ `กำลังผลิต` ➔ `จัดส่งแล้ว (แสดงเลขแทร็ก)` ➔ `สำเร็จ`
- [ ] **5.3 ปุ่มยืนยันการรับสินค้า (Order Confirmation)**
  - [ ] เมื่อลูกค้ากด "ยืนยันการรับสินค้า":
    - สถานะเปลี่ยนเป็น `COMPLETED`
    - ปลดล็อกเงินเข้ากระเป๋าเงิน (Wallet) ของร้านค้าโดยอัตโนมัติ
  - [ ] ระบบ Auto-Complete: ยืนยันอัตโนมัติหากพัสดุส่งถึงเกิน 7 วันแล้วผู้ซื้อไม่ได้กดยืนยันหรือเปิดข้อพิพาท
- [ ] **5.4 ระบบขอคืนเงิน/คืนสินค้า (Refund / Dispute)**
  - [ ] แบบฟอร์มยื่นขอคืนเงินกรณีสินค้าเสียหายหรือไม่ได้รับสินค้าภายในกำหนด

---

## 💼 Phase 6: พอร์ทัลผู้ขาย & กระเป๋าเงิน (Seller Center & Wallet)

- [ ] **6.1 แดชบอร์ดสรุปภาพรวมร้านค้า (`/seller/dashboard`)**
  - [ ] การ์ดยอดขายรวม, จำนวนออเดอร์ใหม่, สินค้าที่ต้องจัดส่ง
  - [ ] กราฟยอดขายย้อนหลัง
- [ ] **6.2 หน้ารายการสินค้าของร้าน (`/seller/products`)**
  - [ ] ฟอร์มเพิ่ม/แก้ไขสินค้า พร้อมกำหนดเป็นแบบ Made-to-Order หรือ Ready-to-Ship
- [ ] **6.3 ระบบกระเป๋าเงินและถอนเงิน (`/seller/wallet`)**
  - [ ] แสดงยอดเงินคงเหลือที่ถอนได้ (Available Balance)
  - [ ] ประวัติรายการเดินบัญชี (รายรับจากออเดอร์, การหักค่าธรรมเนียมแพลตฟอร์ม)
  - [ ] ฟอร์มกดยื่นคำขอถอนเงิน (Request Payout) ไปยังบัญชีธนาคารที่ลงทะเบียนไว้
  - [ ] API `POST /api/seller/payouts/request`

---

## 🛡️ Phase 7: ระบบหลังบ้านผู้ดูแลระบบ (Admin Backoffice)

- [ ] **7.1 ระบบอนุมัติร้านค้า (Shop Approval)**
  - [ ] หน้าตรวจสอบรายชื่อร้านค้าใหม่ (`/backoffice/shops`)
  - [ ] ตรวจสอบชื่อร้าน, ข้อมูลผู้สมัคร, เลข Tax ID, เอกสารแนบ
  - [ ] ปุ่มกด "อนุมัติร้านค้า (Approve)" หรือ "ปฏิเสธพร้อมระบุเหตุผล (Reject)"
- [ ] **7.2 ระบบตรวจสอบและควบคุมสินค้า (Product Moderation)**
  - [ ] รายการสินค้าทั้งหมดในแพลตฟอร์ม พร้อมตัวกรองตามร้านค้า
  - [ ] ปุ่มระงับสินค้าที่ไม่เหมาะสม (Take Down / Hide)
- [ ] **7.3 ระบบอนุมัติการถอนเงิน (Payout Approvals)**
  - [ ] หน้าตรวจสอบรายการคำขอถอนเงินของร้านค้า (`/backoffice/payouts`)
  - [ ] แสดงยอดเงิน, บัญชีธนาคารปลายทาง, หลักฐานการโอน
  - [ ] ปุ่มกดบันทึกการโอนเงินสำเร็จ (`TRANSFERRED`)
- [ ] **7.4 รายงานสถิติแพลตฟอร์ม (Platform Analytics)**
  - [ ] สรุปยอดขายรวมทั้งระบบ (GMV - Gross Merchandise Value)
  - [ ] รายได้ค่าคอมมิชชันของแพลตฟอร์ม (Platform Net Revenue)

---

## 🧪 Phase 8: การทดสอบและการส่งมอบ (Testing & Deployment)

- [ ] **8.1 การทดสอบ End-to-End User Flow**
  - [ ] Flow 1: สมัครสมาชิก ➔ ขอเปิดร้านค้า ➔ แอดมินอนุมัติ ➔ ร้านค้าลงขายกำไล
  - [ ] Flow 2: ผู้ซื้อสั่งสินค้าสั่งทำ (Custom) + สินค้าพร้อมส่ง ➔ ชำระเงินผ่าน Omise
  - [ ] Flow 3: ร้านค้ารับออเดอร์ ➔ ผลิต ➔ ส่งพัสดุและกรอก Tracking
  - [ ] Flow 4: ลูกค้ายืนยันรับของ ➔ เงินเข้ากระเป๋าร้าน ➔ ร้านค้ากดยื่นถอนเงิน ➔ แอดมินอนุมัติ
- [ ] **8.2 ปรับแต่ง UI/UX & Responsive**
  - [ ] ตรวจสอบการใช้งานบน Mobile (เพราะลูกค้าซื้อเครื่องประดับผ่านมือถือเป็นหลัก)
- [ ] **8.3 Environment & Deployment**
  - [ ] ตั้งค่า Environment Variables บน Neon, Cloudflare R2, Omise
  - [ ] Deploy Next.js Frontend & Backoffice ขึ้น Vercel
  - [ ] Deploy Hono/Bun Backend ขึ้น Cloud Hosting (Render / Railway / VPS)

---

## 📌 สรุปหน้าที่ตามโปรเจกต์เดิมใน Workspace
1. **`bareandbold_front/`:** ใช้เป็นหน้าร้านค้าหลัก (Storefront) สำหรับผู้ซื้อ และขยายเพิ่มส่วน Seller Portal สำหรับร้านค้า
2. **`bareandbold_backoffice/`:** ใช้เป็นระบบ Admin ตัวกลาง (Platform Admin) สำหรับตรวจรับร้านค้า, อนุมัติถอนเงิน และดูสถิติ
3. **`bareandbold_backend/`:** พัฒนา REST API และปรับ Prisma Schema ให้รองรับ Multi-Vendor Architecture

