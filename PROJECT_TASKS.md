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

## 👥 การแบ่งหน้าที่รับผิดชอบสำหรับทีม 4 คน (Team Task Division)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Marketplace Ecosystem                           │
├────────────────────────────┬─────────────────────────────┬─────────────┤
│   🔵 คนที่ 1 (Frontend)    │    🟢 คนที่ 2 (Frontend)    │ 🟠 คนที่ 3  │
│  Storefront, Catalog &     │  Cart, Checkout & Order     │ Seller &    │
│     Customizer Pages       │     Tracking & Reviews      │ Backoffice  │
├────────────────────────────┴─────────────────────────────┴─────────────┤
│                          🟣 คนที่ 4 (Backend API)                       │
│    Auth, Multi-Vendor APIs, Split Order, Omise Escrow & Wallet DB       │
└────────────────────────────────────────────────────────────────────────┘
```

### 🔵 คนที่ 1 — Frontend: ฝั่งผู้ซื้อ (Storefront, Catalog & Customizer)
* **โฟลเดอร์หลัก:** `bareandbold_front/`
* **ขอบเขต:** พัฒนาประสบการณ์การเลือกซื้อสินค้าเครื่องประดับ, หน้ารวมสินค้า, ระบบค้นหา/กรอง, หน้ารายละเอียดสินค้า และหน้าร้านค้าเฉพาะผู้ขาย
* **งานที่ต้องทำ:**
  - [ ] **Homepage (`/`)**: เชื่อมต่อ API สินค้าแนะนำ, หมวดหมู่กำไลข้อมือ/ข้อเท้า, แบนเนอร์โปรโมต, ลิสต์ร้านค้ายอดนิยม
  - [ ] **Product Catalog & Search (`/products`)**:
    - [ ] ระบบ Search ค้นหาตามชื่อสินค้า / ชื่อร้านค้า
    - [ ] ระบบตัวกรอง (Filter): หมวดหมู่ (BRACELET, ANKLET), ประเภท (พร้อมส่ง vs สั่งทำ), ช่วงราคา
    - [ ] ตัวกรองเฉพาะเครื่องประดับ: ขนาดความยาวรอบข้อมือ/ข้อเท้า (ซม.)
  - [ ] **Product Detail (`/products/[id]`)**:
    - [ ] Gallery รูปภาพสินค้า (ดึงจาก Cloudflare R2)
    - [ ] แสดงป้ายบอกระยะเวลาผลิต (เช่น "สินค้าสั่งทำ: ใช้เวลาทำ 5-7 วัน")
    - [ ] Custom Options Selector: เลือกขนาดรอบข้อมือ (14-20 cm), สีเชือก, จี้/ชาร์ม
    - [ ] การ์ดข้อมูลร้านค้า (Seller Card) พร้อมปุ่มคลิกไปหน้าร้าน
    - [ ] **ส่วนแสดงรีวิวและคะแนนดาว (Customer Reviews & Ratings)**:
      - [ ] แสดงคะแนนดาวเฉลี่ย (เช่น ⭐ 4.8 / 5) และจำนวนรีวิวทั้งหมด
      - [ ] รายการคอมเมนต์จากลูกค้าผู้ซื้อจริง (Verified Purchase) พร้อมรูปถ่ายสินค้าจริง
  - [ ] **Shop Profile Page (`/shop/[slug]`)**: หน้าร้านค้าของผู้ขาย แสดงโลโก้, แบนเนอร์, รายละเอียดร้าน, คะแนนรีวิวเฉลี่ยของร้าน, และ Grid สินค้าเฉพาะของร้านนั้น
  - [ ] **Wishlist Page (`/account/wishlist`)**: หน้ารายการสินค้าโปรดของลูกค้า
  - [ ] **🔮 หน้าระบบจับคู่หินมงคลและราศี (`/horoscope` หรือ `/gemstone-guide`) (Feature Highlight)**:
    - [ ] แบบฟอร์มกรอกข้อมูล: วันเกิด (จันทร์ - อาทิตย์), ราศี, และเรื่องที่ต้องการเสริม (การงาน, การเงิน, ความรัก, สุขภาพ)
    - [ ] การ์ดแสดงผลคำทำนาย: แนะนำหินมงคลที่เหมาะสม (เช่น ลาพิส ลาซูลี, โรสควอตซ์, ซิทริน), โทนสีเชือกมงคลเสริมดวง, และสีกาลกิณีที่ควรเลี่ยง
    - [ ] Carousel/Grid แนะนำสินค้ากำไลข้อมือและข้อเท้าในระบบที่ตรงกับหิน/สีมงคลของผลทำนาย พร้อมปุ่มคลิกดูสินค้า/เพิ่มลงตะกร้า
* **API ที่ต้องใช้ (ประสานกับคนที่ 4):**
  - `GET /api/products` (พร้อม query: search, category, type, minWrist, maxWrist)
  - `GET /api/products/:id`
  - `GET /api/products/:id/reviews` (ดึงรายการรีวิวและคะแนนดาว)
  - `POST /api/recommend/gemstones` (ส่งวันเกิด/ราศี/ด้านที่ต้องการเสริม ➔ รับผลคำทำนายและลิสต์สินค้าแนะนำ)
  - `GET /api/shops/:slug`
  - `GET/POST/DELETE /api/wishlist`

---

### 🟢 คนที่ 2 — Frontend: ตะกร้า, การสั่งซื้อ & ติดตามพัสดุ (Cart, Checkout & Order Tracking)
* **โฟลเดอร์หลัก:** `bareandbold_front/`
* **ขอบเขต:** พัฒนาหน้าการทำธุรกรรมฝั่งผู้ซื้อ, ระบบสมาชิก, ตะกร้าแยกตามร้าน, การชำระเงิน, ไทม์ไลน์ติดตามพัสดุ และการยืนยันรับของ
* **งานที่ต้องทำ:**
  - [ ] **Auth Flow สำหรับผู้ซื้อ (`/auth/login`, `/auth/register`)**: เชื่อม API จริง, จัดเก็บ Cookie/JWT Token
  - [ ] **Shopping Cart (`/cart`)**:
    - [ ] แสดงรายการสินค้า **จัดกลุ่มแยกตามร้านค้า (Group by Shop)** เหมือน Shopee
    - [ ] ปรับลด/เพิ่มจำนวน, เลือกลบสินค้า, แสดงรายละเอียดขนาด Custom ที่เลือกไว้
    - [ ] คำนวณสรุปราคาสินค้ารวมและค่าจัดส่งแยกรายร้าน
  - [ ] **Checkout Page (`/checkout`)**:
    - [ ] ฟอร์มเลือก/ระบุที่อยู่จัดส่ง, ชื่อและเบอร์โทรผู้รับ
    - [ ] หน้าชำระเงินรองรับ Omise (แสดง PromptPay QR Code หรือฟอร์มกรอกบัตร)
  - [ ] **Order Tracking & History (`/account/orders`)**:
    - [ ] แสดงประวัติคำสั่งซื้อทั้งหมด
    - [ ] แสดง **Timeline สถานะคำสั่งซื้อ** แบบละเอียด:
      `รอชำระเงิน` ➔ `ชำระเงินแล้ว` ➔ `ร้านกำลังผลิต (สำหรับ Custom)` ➔ `จัดส่งแล้ว (มีเลข Tracking + ขนส่ง)` ➔ `สำเร็จ`
  - [ ] **Order Confirmation, Review & Dispute**:
    - [ ] ปุ่ม **"ยืนยันการรับสินค้า (Confirm Received)"** เพื่อส่งสัญญาณปลดล็อกเงินให้ร้านค้า
    - [ ] **Modal / หน้ารีวิวสินค้า (`/account/orders/[id]/review`)**:
      - [ ] ให้คะแนนดาว (1 - 5 ดาว) ⭐⭐⭐⭐⭐
      - [ ] กล่องข้อความแสดงความคิดเห็น (Comment Text)
      - [ ] อัปโหลดรูปภาพสินค้าจริงที่ได้รับ (Review Images)
    - [ ] ฟอร์มยื่นคำร้องขอคืนเงิน/แจ้งปัญหา (`/account/orders/[id]/refund`)
* **API ที่ต้องใช้ (ประสานกับคนที่ 4):**
  - `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`
  - `GET/POST/PUT/DELETE /api/cart`
  - `POST /api/orders/checkout`
  - `GET /api/orders/my-orders`, `GET /api/orders/:id`
  - `POST /api/orders/:subOrderId/confirm-received`
  - `POST /api/reviews` (ส่งคะแนนดาว, คอมเมนต์, รูปภาพรีวิว)

---

### 🟠 คนที่ 3 — Seller Portal & Admin Backoffice (ระบบร้านค้า & ผู้ดูแลตัวกลาง)
* **โฟลเดอร์หลัก:** `bareandbold_front/src/app/seller/` (พอร์ทัลร้านค้า) & `bareandbold_backoffice/` (หลังบ้านแอดมิน)
* **ขอบเขต:** พัฒนาระบบให้ร้านค้าจัดการของตนเองได้ (Seller Center) และพัฒนาระบบผู้ดูแลตัวกลางในการอนุมัติร้านค้า/เงิน (Admin Backoffice)
* **งานที่ต้องทำ:**
  - [ ] **ระบบสมัครเปิดร้านค้า (`/become-seller`)**:
    - [ ] ฟอร์มกรอกชื่อร้าน, Slug, รายละเอียดร้าน, อัปโหลดโลโก้
    - [ ] ฟิลด์บังคับยืนยันตัวตน: **เลขประจำตัวผู้เสียภาษี (Tax ID)**, บัญชีธนาคารสำหรับรับเงิน
    - [ ] หน้าแสดงสถานะ "รอการตรวจสอบจากแอดมิน (Pending)"
  - [ ] **Seller Center Dashboard (`/seller/dashboard`)**:
    - [ ] สรุปภาพรวมยอดขาย, ออเดอร์ที่ต้องทำ, สินค้าพร้อมส่ง
  - [ ] **Seller Product Management (`/seller/products`)**:
    - [ ] ตารางแสดงสินค้าทั้งหมดของร้านตนเอง
    - [ ] ฟอร์มเพิ่ม/แก้ไขสินค้า: อัปโหลดรูปขึ้น Cloudflare R2, กำหนดเป็น "พร้อมส่ง" หรือ "สั่งทำ (Made-to-Order)" พร้อมระบุจำนวนวันผลิต
    - [ ] ตั้งค่าตัวเลือกขนาดรอบข้อมือ/ข้อเท้าที่ร้านรับทำ
  - [ ] **Seller Order Fulfillment (`/seller/orders`)**:
    - [ ] รายการคำสั่งซื้อที่เข้ามายังร้าน (SubOrders)
    - [ ] ปุ่มอัปเดตสถานะเป็น "กำลังผลิต (In Production)"
    - [ ] ฟอร์มระบุการจัดส่ง: เลือกบริษัทขนส่ง (ไปรษณีย์ไทย, Flash, Kerry) และกรอกเลขพัสดุ (Tracking Number)
  - [ ] **Seller Wallet & Payout (`/seller/wallet`)**:
    - [ ] แสดงยอดเงินคงเหลือที่ถอนได้ (Available Balance)
    - [ ] ประวัติเงินเข้า/ออก (ยอดขาย, หักค่าคอมมิชชัน 5%)
    - [ ] ฟอร์มกดยื่นขอถอนเงินเข้าบัญชีธนาคาร (Request Payout)
  - [ ] **Admin Backoffice (`bareandbold_backoffice/`)**:
    - [ ] **หน้าอนุมัติร้านค้า (`/backoffice/shops`)**: ตรวจสอบข้อมูลร้านและเลข Tax ID กด Approve หรือ Reject
    - [ ] **หน้าอนุมัติการถอนเงิน (`/backoffice/payouts`)**: ดูรายการขอถอนเงิน, แนบสลิปโอนเงิน และกดยืนยันการโอนเงิน (Transferred)
    - [ ] **หน้าตรวจสอบสินค้า (Product Moderation)**: ซ่อนหรือระงับสินค้าที่ผิดกฎ
* **API ที่ต้องใช้ (ประสานกับคนที่ 4):**
  - `POST /api/shops/apply`, `GET /api/shops/my-shop`
  - `GET/POST/PUT/DELETE /api/seller/products`
  - `GET/PUT /api/seller/orders` & `POST /api/seller/orders/:id/ship`
  - `GET /api/seller/wallet` & `POST /api/seller/payouts/request`
  - `GET/PUT /api/admin/shops/:id/approve` & `GET/PUT /api/admin/payouts/:id`

---

### 🟣 คนที่ 4 — Backend API & Architecture (ระบบหลังบ้าน, ธุรกรรม & ฐานข้อมูล)
* **โฟลเดอร์หลัก:** `bareandbold_backend/`
* **ขอบเขต:** สร้าง REST API ด้วย Hono/Bun + Prisma ดูแลความปลอดภัย, เชื่อมต่อ Payment Gateway (Omise) และระบบการเงินตัวกลาง (Escrow & Split Order)
* **งานที่ต้องทำ:**
  - [ ] **Auth & Role Authorization**:
    - [ ] ปรับปรุง JWT Middleware ให้ตรวจสอบสิทธิ์ `isSeller`, `isApprovedSeller`, `isAdmin`
  - [ ] **Shop & Seller APIs**:
    - [ ] `POST /api/shops/apply`: รับสมัครร้านค้า บันทึกสถานะเป็น `PENDING`
    - [ ] `GET /api/shops/my-shop`: ดึงข้อมูลร้านค้าของ User ปัจจุบัน
    - [ ] `PUT /api/shops/my-shop`: แก้ไขโปรไฟล์ร้านค้า/โลโก้
  - [ ] **Product Catalog APIs (Multi-Vendor)**:
    - [ ] `GET /api/products`: รองรับ Search, Filter ตามหมวดหมู่ (ข้อมือ/ข้อเท้า/ขนาด/ประเภทสินค้า/ร้านค้า)
    - [ ] `GET /api/products/:id`: ดึงรายละเอียดสินค้าพร้อม Options และข้อมูลร้านค้า
    - [ ] `POST/PUT/DELETE /api/seller/products`: API จัดการสินค้าโดยเช็กว่าแก้ไขได้เฉพาะสินค้าของร้านตนเอง
    - [ ] `POST /api/upload`: อัปโหลดรูปภาพเข้า Cloudflare R2
  - [ ] **Cart & Split Order APIs (หัวใจของระบบตัวกลาง)**:
    - [ ] `GET/POST/PUT/DELETE /api/cart`: จัดการตะกร้าสินค้า (รองรับ Custom Options)
    - [ ] `POST /api/orders/checkout`: สร้าง `Order` (Master) และแตกย่อยเป็น `SubOrder` ตามแต่ละร้านค้าที่อยู่ในตะกร้า
  - [ ] **Payment & Escrow System (Omise API)**:
    - [ ] `POST /api/payments/create-charge`: สร้างรายการชำระเงินกับ Omise (PromptPay QR / Card)
    - [ ] `POST /api/payments/webhook`: ดักฟังสถานะชำระเงิน เมื่อสำเร็จ ➔ เปลี่ยนสถานะ `Order` & `SubOrders` เป็น `PAID`
  - [ ] **Fulfillment & Confirmation APIs**:
    - [ ] `PUT /api/seller/orders/:subOrderId/status`: ร้านค้าเปลี่ยนสถานะเป็นกำลังผลิต
    - [ ] `POST /api/seller/orders/:subOrderId/ship`: ร้านค้าบันทึกชื่อขนส่งและเลข Tracking
    - [ ] `POST /api/orders/:subOrderId/confirm-received`: ลูกค้ายืนยันรับของ ➔ คำนวณหักคอมมิชชัน ➔ โอนยอด Net Amount เข้า `Shop.balance` และบันทึก `ShopTransaction`
  - [ ] **Reviews & Ratings APIs**:
    - [ ] `POST /api/reviews`: ส่งรีวิว (ตรวจสอบว่าเป็นผู้ซื้อจริง `orderItemId`, ให้คะแนน 1-5 ดาว, บันทึกข้อความและรูปภาพ)
    - [ ] คำนวณคะแนนเฉลี่ย (`rating`) และจำนวนรีวิว (`reviewCount`) อัปเดตกลับไปยัง `Product` อัตโนมัติ
    - [ ] `GET /api/products/:id/reviews`: ดึงรายการรีวิวทั้งหมดของสินค้านั้น
    - [ ] `GET /api/shops/:id/reviews`: ดึงคะแนนรีวิวเฉลี่ยและคอมเมนต์ของร้านค้านั้น
  - [ ] **🔮 Gemstone & Astrology Recommender API (AI / Algorithmic)**:
    - [ ] `POST /api/recommend/gemstones`: Endpoint รับข้อมูล `{ dayOfWeek, zodiacSign, focusArea }`
    - [ ] ตารางจับคู่ความเชื่อ (Gemstone Knowledge Base / Algorithm หรือเชื่อมต่อ Gemini API):
      - คำนวณหินมงคลที่ช่วยเสริมดวงด้านที่เลือก
      - ระบุสีเชือกมงคลและสีกาลกิณีห้ามใช้ประจำวันเกิด
    - [ ] Query ค้นหาสินค้ากำไล/ข้อเท้าในระบบที่มีหินหรือสีตรงกับผลทำนาย แล้วส่งกลับพร้อมคำอธิบายความหมาย
  - [ ] **Wallet, Payout & Admin APIs**:
    - [ ] `GET /api/seller/wallet`: ดึงยอดคงเหลือและประวัติธุรกรรม
    - [ ] `POST /api/seller/payouts/request`: ร้านค้ายื่นขอถอนเงิน
    - [ ] `GET/PUT /api/admin/shops`: ดึงรายชื่อร้านและกดยอมรับ/ปฏิเสธร้านค้า
    - [ ] `GET/PUT /api/admin/payouts`: ดึงรายการคำขอถอนเงินและอัปเดตสถานะการโอนเงิน
* **เครื่องมือและบริการที่ต้องดูแล:**
  - Neon PostgreSQL, Cloudflare R2, Omise Payment Sandbox

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

