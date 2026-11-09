# 📋 แผนงานและรายการสิ่งที่ต้องทำ (Project Task Breakdown)

## โปรเจกต์: Bracelet & Jewelry Marketplace (เว็บตัวกลางขายกำไลข้อมือ ข้อเท้า และเครื่องประดับ)

> **Tech Stack:**
>
> - **Frontend:** Next.js (App Router) + Tailwind CSS + Ant Design / Lucide Icons
> - **Backend:** Hono รันบน Bun Runtime (หรือ Node.js Express ตามโครงสร้างปัจจุบัน) + Prisma ORM
> - **Database:** PostgreSQL (Neon)
> - **Cloud Storage:** Cloudflare R2
> - **Payment Gateway:** Omise API (พร้อมระบบ Webhook)

---

## 📊 สรุปความคืบหน้าภาพรวม (Progress Overview)

- [X] **Phase 1:** Database Schema & Architecture Redesign (เสร็จแล้ว ✅)
- [X] **Phase 2:** Authentication & Seller Onboarding (เสร็จแล้ว ✅)
- [ ] **Phase 3:** Product Catalog & Customization Management (บางส่วน — catalog/shop page/API พร้อม, ตัวกรองขั้นสูง/review ยังเหลือ)
- [ ] **Phase 3.5:** 🔮 Gemstone & Astrology Recommender (ยังไม่เริ่ม)
- [ ] **Phase 4:** Cart, Split Order & Escrow Payment (Split Order/Escrow ยังไม่เริ่ม)
- [ ] **Phase 5:** Fulfillment & Order Tracking (ยังไม่เริ่ม)
- [ ] **Phase 6:** Seller Center & Wallet (API พร้อม, UI Seller Center ถูกลบเพื่อให้ทีมอื่นทำ)
- [ ] **Phase 7:** Admin Backoffice (อนุมัติร้านเสร็จ, payout/moderation/analytics ยังเหลือ)
- [ ] **Phase 8:** Testing & Deployment (ทดสอบ role/seller flow แล้ว, E2E เต็มระบบ/Deploy ยังเหลือ)
- [ ] **Phase 9:** Extended Scope (Coupon, Platform Settings, SEO, Seller Analytics, Audit Log, Invoice, Notifications)

> **อัปเดตล่าสุด — Seller Role Foundation (ดูรายละเอียดใน `PLAN_SELLER_ROLE.md`)**
>
> - ✅ Backend: role middleware, shop onboarding APIs, seller product APIs, admin approval APIs
> - ✅ Frontend: AuthContext, `/login`, `/become-seller`, public `/shop/[slug]`
> - 🧹 UI Seller Center (`/seller/*`) ถูกนำออกเพื่อให้เพื่อนทำต่อ — API ฝั่ง seller ยังพร้อมใช้งาน
> - ✅ Backoffice: หน้า `/dashboard/shops` สำหรับอนุมัติ/ปฏิเสธร้าน
> - ✅ Security: backoffice register ต้องเป็น Admin, staff ไม่เห็น KYC เต็ม, upload/delete ตรวจเจ้าของ
> - ✅ Test: backend 52/52, smoke 17/17, security 9/9, UI E2E ผ่าน, frontend build ผ่าน
> - ⚖️ ปรับสมดุลงาน 4 คนแล้ว — ดูหัวข้อ **“แผนปรับสมดุลงานเทอมนี้”** ด้านล่าง
> - 🗓️ แผนใหม่: **4 คน / งาน開発เสร็จใน 1 เดือน (~20 วัน/คน)** และใช้เดือนที่ 2–4 เป็น buffer สำหรับ UAT, รายงาน, นำเสนอ, deploy
> - 🚀 เพิ่ม **Extended Scope**: Coupon, Platform Settings, SEO, Seller Analytics, Audit Log, Invoice, Notification (ดู Phase 9)
> - ⏳ ยังไม่ทำ: seller orders/wallet จริง (รอ Phase 4–5), product detail shop card, ตัวกรองราคา/ขนาด

---

## ✅ สรุปงานเสร็จ / งานที่เหลือรายคน

### 🔵 Role 1 — Frontend Storefront & Catalog

**เสร็จแล้ว**

- หน้า `/products` + ค้นหาชื่อ + กรองหมวดหมู่ (ข้อมือ/ข้อเท้า) + กรองประเภท (พร้อมส่ง/สั่งทำ)
- หน้า `/products/[id]` มีแกลเลอรี, badge สั่งทำ, ตัวเลือกขนาด/accessories
- หน้า `/shop/[slug]` แสดงแบนเนอร์, โลโก้, รายละเอียดร้าน และ grid สินค้า
- Product Card แสดงดาว 5 ดวง (ดวงที่ได้คะแนนสีทอง, ที่เหลือสีเทา)
- API public ส่งข้อมูลร้านมาพร้อมสินค้าแล้ว

**เหลือทำ**

- ตัวกรองช่วงราคา, ขนาดรอบข้อมือ/ข้อเท้า และระบบเรียงลำดับ (ล่าสุด/ราคา/เรตติ้ง)
- การ์ดร้านในหน้ารายละเอียดสินค้า + ลิงก์ไป `/shop/[slug]`
- Reviews & Ratings UI ในหน้ารายละเอียดสินค้า
- หน้า Wishlist เต็มรูปแบบ (`/account/wishlist`)
- **Gemstone Knowledge Base + `POST /api/recommend/gemstones`** (Role 4 review ให้)
- หน้า Horoscope / Gemstone Guide + Matched Products
- Responsive + Shop page filter

---

### 🟢 Role 2 — Frontend Cart, Checkout, Orders & Reviews

**เสร็จแล้ว (โค้ดเดิมที่มีอยู่)**

- `/login` + Auth Modal + AuthContext
- `/cart` เพิ่ม/ลด/ลบสินค้า + ค่าจัดส่ง + promo
- `/checkout` + Payment UI (PromptPay QR / Mock)
- `/orders` + แท็บสถานะ + ขยายดูรายละเอียด + QR Modal
- `/profile` + จัดการสมุดที่อยู่
- Backend payment มี Omise charge + webhook (มี mock fallback)

**เหลือทำ**

- Cart จัดกลุ่มตามร้าน (Group by Shop) + checkbox เลือกทีละร้าน + ค่าส่งแยกร้าน
- Checkout สรุปแยกตามร้าน + รองรับบัตรเครดิต/เดบิตเต็มรูปแบบ
- Timeline สถานะออเดอร์ให้ตรงกับ SubOrder
- ปุ่ม “ยืนยันรับสินค้า” + ปลดล็อก Escrow
- Modal/หน้ารีวิว + อัปโหลดรูป
- หน้าขอคืนเงิน/ข้อพิพาท (Buyer)
- **Admin Refund/Dispute UI** (`/dashboard/refunds`) — ใช้ API จาก Role 4
- E2E test flow สั่งซื้อ → จ่ายเงิน → ติดตาม → รีวิว

---

### 🟠 Role 3 — Fullstack Seller Center & Admin

**เสร็จแล้ว**

- `/become-seller` ฟอร์มสมัคร + KYC + โลโก้/แบนเนอร์ + สถานะ PENDING/REJECTED/APPROVED
- Backoffice `/dashboard/shops` อนุมัติ/ปฏิเสธร้าน + ดูข้อมูล KYC
- Backend Seller API พร้อมใช้งาน: dashboard, products CRUD, เปิด-ปิดขาย
- Backend Shop API: apply / my-shop / update
- Admin/Staff แยกสิทธิ์ + mask ข้อมูล KYC สำหรับ staff

**ถูกลบ / ส่งต่อให้เพื่อน**

- UI Seller Center ทั้งหมด: `/seller/dashboard`, `/seller/products`, `/seller/shop`
- `components/seller/*` และ `services/seller.service.js`

**เหลือทำ**

- Seller Center UI — ต่อ API ที่พร้อมแล้ว
- Seller Orders (`/seller/orders`) — รอ Split Order
- Seller Wallet / Payout UI
- Admin Product Moderation (UI + API)
- Admin Payout Approvals (UI + API)
- Admin Platform Analytics (UI + API, GMV / Commission)

---

### 🟣 Role 4 — Backend & Database

**เสร็จแล้ว**

- JWT + Role Middleware (`requireAuth`, `requireSeller`, `requireApprovedSeller`, `requireAdmin`, `requireRole`)
- Shop APIs + Seller Product APIs + Admin Approval APIs
- Upload ของ seller + บังคับ folder ตามร้าน + ตรวจเจ้าของตอนลบ
- Public catalog: search/category/type/shop + แนบ shop info + `isActive`
- Product ownership isolation + security fix (backoffice register / KYC masking)
- Payment: Omise charge + webhook (พร้อม mock fallback)

**เหลือทำ**

- **Split Order Engine**: checkout → SubOrder แยกตามร้าน
- Escrow: confirm received → หัก GP 5% → เข้า `Shop.balance` → `ShopTransaction`
- Reviews & Rating APIs + อัปเดต `rating`/`reviewCount`
- Wallet & Payout APIs (seller side)
- Refund APIs (buyer + admin)
- Auto-complete หลังส่งถึง 7 วัน
- Deployment / Environment
- Review งาน Gemstone API ของ Role 1 + งาน Admin API ของ Role 3

---

## 🚧 งานที่เหลือและลำดับความสำคัญ (Next Up)

### 🔴 Blockers หลัก

1. **Split Order Engine** — checkout ต้องแตก `SubOrder` ตามร้าน ก่อนที่ Seller Orders / Wallet จะทำงานได้จริง
2. **Escrow + Confirm Received** — ปลดล็อกเงินหลังลูกค้ายืนยันรับของ + หัก GP 5% + บันทึก `ShopTransaction`
3. **Seller Center UI** — API พร้อมแล้ว แต่ UI ถูกลบเพื่อให้ทีมอื่นพัฒนา

### 📋 ลำดับที่แนะนำ

| ลำดับ | งาน                                                       | เจ้าของ             | ต้องรอ           |
| :--------: | :----------------------------------------------------------- | :------------------------- | :--------------------- |
|     1     | Split Order Engine (`checkout` → `SubOrder`)            | Role 4                     | —                     |
|     2     | Seller Center UI (dashboard / products / shop)               | Role 3                    | API พร้อมแล้ว |
|     3     | Seller Orders + Fulfillment (ผลิต/จัดส่ง/tracking) | Role 3 + 4                 | ข้อ 1               |
|     4     | Escrow + Confirm Received + Wallet                           | Role 4                     | ข้อ 1               |
|     5     | Admin Payout / Moderation / Analytics (UI + API)             | Role 3                     | ข้อ 4               |
|     6     | Refund: Buyer form + Admin UI + APIs                         | Role 2 (UI) + Role 4 (API) | ข้อ 1               |
|     7     | Reviews & Ratings (API + UI)                                 | Role 4 (API) + Role 1 (UI) | ข้อ 1               |
|     8     | Horoscope / Gemstone (KB + API + UI)                         | Role 1 (Role 4 review)     | —                     |
|     9     | E2E Testing & Deployment                                     | ทุกคน                 | ข้อ 1–8            |

### 🔌 API ที่พร้อมให้เพื่อนทำ Seller Center

- `GET /api/seller/dashboard` — KPI สินค้า/ยอดเงิน
- `GET/POST /api/seller/products` — รายการ/สร้างสินค้า
- `GET/PUT/DELETE /api/seller/products/:id` — ดู/แก้ไข/ลบ
- `PATCH /api/seller/products/:id/status` — เปิด-ปิดขาย
- `GET/PUT /api/shops/my-shop` — ข้อมูลร้าน
- `POST /api/upload?folder=products` — อัปโหลดรูปสินค้า
- Auth: `GET /api/auth/profile` คืน `role`, `shop`, `accountType`
- Guard ที่ backend บังคับแล้ว: seller ต้องมีร้าน APPROVED, แก้ได้เฉพาะสินค้าของตัวเอง

### 🖥️ สถานะการรันล่าสุด

- Backend: `http://localhost:8000`
- Storefront: `http://localhost:3000`
- Backoffice: `http://localhost:3001`
- บัญชีทดสอบ (password: `password`): `buyer@bareandbold.test`, `seller@bareandbold.test`, `pending@bareandbold.test`, `admin@gmail.com`, `staff@gmail.com`

---

## ⚖️ แผนปรับสมดุลงานเทอมนี้ (Workload Balance)

> **สมมติฐาน:** ทีม 4 คน (Role 1–4), **ยัดงานให้เสร็จใน 1 เดือน** (4 สัปดาห์ / ~20 วันทำงานต่อคน = 80 person-days)
> เดือนที่ 2–4 ของเทอมใช้เป็น **buffer** สำหรับ UAT, แก้บั๊ก, ทำรายงาน/นำเสนอ, deploy จริง และกันไฟไหม้
> เป้าหมาย: ทุกคนมีงาน ~19–20 วัน และไม่มีใครเป็นคอขวดคนเดียว

### 📊 สรุปภาระงาน 1 เดือน (ประมาณการ)

| Role      | งานพัฒนา                                                                                 | งานวิชาการ/ร่วม                      |        รวม        |
| :-------- | :----------------------------------------------------------------------------------------------- | :------------------------------------------------- | :------------------: |
| 🔵 Role 1 | Filter, Shop card, Wishlist, Shop page, **Gemstone KB+API+UI**                             | รายงาน/UML 1 วัน, Demo 0.5, Buffer 0.5    | **~20 วัน** |
| 🟢 Role 2 | Cart group by shop, Checkout, Timeline, Reviews, Refund Buyer + **Admin Refund UI**        | UAT 1 วัน, Demo 0.5, Buffer 0.5                 | **~20 วัน** |
| 🟠 Role 3 | Seller Center UI, Seller Orders/Wallet, Admin Payout/Moderation/Analytics + **Admin APIs** | UAT 0.5, Demo 0.5                                  | **~20 วัน** |
| 🟣 Role 4 | Split Order, Escrow, Wallet/Payout API, Reviews API, Refund API, Auto-complete                   | Deploy 1, API docs 0.5, รายงาน 0.5, Demo 0.5 | **~20 วัน** |

### 🎓 งานวิชาการที่ต้องส่งในเทอมนี้ (Year 3 Deliverables)

| งาน                             | รายละเอียด                                               | เจ้าของ  | วัน |
| :--------------------------------- | :----------------------------------------------------------------- | :-------------- | :----: |
| รายงานโปรเจกต์ + UML | SRS, use case, sequence/class diagram, สรุปผล                | Role 1 + Role 4 |  1.5  |
| API Documentation                  | Postman collection + endpoint docs                                 | Role 4          |  0.5  |
| UAT Test Cases + Report            | ทดสอบ buyer/seller/admin + ผลลัพธ์                     | Role 2 + Role 3 |  1.5  |
| Demo Video + Slides                | สคริปต์เดโม, อัดวิดีโอ, สไลด์นำเสนอ | ทุกคน      |  2.0  |
| Deployment                         | ตั้งค่า env จริง + deploy front/backoffice/backend      | Role 4          |  1.0  |
| Buffer / Bug Fix                   | เผื่อแก้บั๊กและงานฉุกเฉิน                 | ทุกคน      |  2.0  |

### 🔄 งานที่ย้ายเจ้าของ (เพื่อลดคอขวด)

| งาน                                                      | เดิม |                  ใหม่                  | เหตุผล                                                                      |
| :---------------------------------------------------------- | :------: | :-----------------------------------------: | :-------------------------------------------------------------------------------- |
| Gemstone Knowledge Base + `POST /api/recommend/gemstones` |  Role 4  | **Role 1** (Role 4 review 0.5 วัน) | เป็น feature-specific logic ที่Role 1 ต้องออกแบบ UI คู่กัน |
| Admin Payout / Moderation / Analytics APIs                  |  Role 4  |              **Role 3**              | Role 3 ทำ UI อยู่แล้ว จะออกแบบ API ให้ตรงกันง่าย   |
| Admin Refund/Dispute UI                                     |  Role 3  |              **Role 2**              | Role 2 ดูแล flow คืนเงินฝั่ง buyer อยู่แล้ว                |
| Seller Wallet UI                                            |  Role 3  |            Role 3 (คงเดิม)            | ต้องใช้ API จาก Role 4 — pair กัน                                   |
| Refund APIs                                                 |  Role 4  |            Role 4 (คงเดิม)            | เป็น financial core ต้องคุม transaction                                |

### 🗓️ แผน 4 สัปดาห์ (ทำขนานกัน — จบงาน開発ในเดือนแรก)

|           สัปดาห์           | Role 1                                                             | Role 2                                        | Role 3                                           | Role 4                                         |
| :--------------------------------: | :----------------------------------------------------------------- | :-------------------------------------------- | :----------------------------------------------- | :--------------------------------------------- |
|            **1**            | Filter ราคา/ขนาด + Sort                                    | Cart Group by Shop                            | Seller Center shell + Dashboard                  | **Split Order Engine**                   |
|            **2**            | Shop card + Reviews display                                        | Checkout แยกตามร้าน + Timeline      | Seller Products list/form                        | Escrow + Confirm Received                      |
|            **3**            | Wishlist + Gemstone API/UI                                         | Review modal + Refund Buyer + Admin Refund UI | Seller Orders + Wallet + Admin Payout/Moderation | Wallet/Payout API + Reviews API                |
|            **4**            | Shop page filter + Responsive                                      | E2E Buyer + UAT                               | Admin Analytics + E2E Seller/Admin + UAT         | Refund API + Auto-complete + Deploy + API docs |
| **ปลายสัปดาห์ 4** | รวมงานทั้งหมด → Demo Video → Slides → ส่งมอบ |                                               |                                                  |                                                |

### 🛡️ Scope Guard (กันงานบานปลาย)

- **Feature Freeze:** หมดสัปดาห์ที่ 3 ห้ามเพิ่มฟีเจอร์ใหม่
- สัปดาห์ที่ 4 เน้น integration, bug fix, UAT, docs, demo เท่านั้น
- ถ้างานไม่ทัน ให้ตัดตามลำดับนี้: Shared Backlog → Shop page filter → Admin Analytics → Wishlist → Horoscope polish
- ฟีเจอร์ที่ห้ามตัด: Split Order, Escrow, Seller Product CRUD, Admin Approval, Checkout

### 🗓️ แผนสำรอง เดือนที่ 2–4 (Buffer Phase)

| เดือน | เป้าหมาย                                                                             |
| :---------: | :------------------------------------------------------------------------------------------- |
| **2** | UAT เต็มระบบ + แก้บั๊ก + performance + security hardening                     |
| **3** | ทำรายงาน/เอกสารส่งอาจารย์ + ซ้อมนำเสนอ + เก็บ feedback |
| **4** | Deploy จริง + Demo Day + เผื่อเหตุฉุกเฉิน/แก้รอบสุดท้าย     |

### 🚀 Extended Scope (เพิ่มขอบเขตงาน)

> งาน core 20 วัน/คนต้องจบในเดือนแรก ส่วนด้านล่างนี้เป็น **scope เพิ่ม** ที่ทำในเดือน 2–3 หรือหยิบมาทำก่อนได้ถ้าทีมเร็ว

#### Tier 1 — Recommended (เพิ่ม ~3–6 วัน/คน)

| ฟีเจอร์                        | รายละเอียด                                                                                   | เจ้าของ                                      | วัน | ต้องรอ       |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------- | :----: | :----------------- |
| **Coupon & Promotion**          | ส่วนลดท้ายตะกร้า, โค้ดส่วนลด, เงื่อนไขขั้นต่ำ, หมดอายุ | Role 2 (UI) + Role 4 (API)                          |   4   | Cart group by shop |
| **Admin Coupon Management**     | หน้า create/edit/disable coupon ใน Backoffice                                                    | Role 3                                              |  1.5  | Coupon API         |
| **Platform Settings**           | ตั้งค่า GP %, ค่าส่ง, ยอดฟรีส่ง, เงื่อนไขการจัดส่ง              | Role 3 (UI+API) + Role 4 (wire checkout/escrow 0.5) |   2   | —                 |
| **SEO & Accessibility**         | Meta/OG tags, Product structured data, sitemap, alt text, keyboard nav                                 | Role 1                                              |   2   | —                 |
| **Seller Shop Analytics**       | กราฟยอดขาย, top products, conversion, ช่วงวันที่                                   | Role 3 (UI) + Role 4 (query)                        |   3   | Split Order        |
| **Admin Audit Log**             | บันทึก approve/reject/payout/moderation + หน้าดูย้อนหลัง                           | Role 3 (UI) + Role 4 (model/API)                    |   2   | Admin APIs         |
| **Invoice / Printable Receipt** | ใบเสร็จสั่งซื้อ + ปริ้น/ดาวน์โหลด PDF                                     | Role 2 (UI) + Role 4 (PDF API)                      |   2   | Checkout           |

#### Tier 2 — Stretch (เดือน 3 / ถ้ามีเวลา)

| ฟีเจอร์                      | รายละเอียด                                                                        | เจ้าของ                   | วัน |
| :---------------------------------- | :------------------------------------------------------------------------------------------ | :------------------------------- | :----: |
| **Notification System**       | แจ้งเตือน in-app + email: สถานะออเดอร์, อนุมัติร้าน, payout | Role 4 (service) + Role 1/3 (UI) |   4   |
| **Seller Reply Reviews**      | ร้านตอบรีวิวลูกค้าได้                                                  | Role 3 (UI) + Role 4 (API)       |   2   |
| **Recently Viewed + Share**   | สินค้าดูRecently + ปุ่มแชร์ลิงก์สินค้า/ร้าน                  | Role 1                           |  1.5  |
| **Rate Limiting & Hardening** | จำกัด request, validation, httpOnly cookie                                             | Role 4                           |   2   |
| **CI/CD Pipeline**            | GitHub Actions + auto deploy front/backoffice/backend                                       | Role 4 + Role 3                  |   2   |
| **Loyalty Points (Stretch)**  | สะสมแต้มจากการซื้อ + แลกส่วนลด                                   | Role 2 + Role 4                  |   3   |

### 📈 ผลกระทบต่อภาระงาน (Core + Extended)

| Role      | Core (เดือน 1) | Tier 1 | Tier 2 | รวมทั้งเทอม |
| :-------- | :-----------------: | :----: | :----: | :--------------------: |
| 🔵 Role 1 |         20         |  3.5  |  3.5  |  **~27 วัน**  |
| 🟢 Role 2 |         20         |   4   |   3   |  **~27 วัน**  |
| 🟠 Role 3 |         20         |  6.5  |   3   | **~29.5 วัน** |
| 🟣 Role 4 |         20         |   5   |   5   |  **~30 วัน**  |

> Role 3/4 หนักกว่า Role 1/2 อยู่ ~2–3 วัน — ถ้าต้องการสมดุลเป๊ะ ให้ย้าย **Admin Coupon Management UI** ไป Role 2 และ **Notification service** ไป Role 3

### 🤝 งานร่วมที่ทุกคนต้องทำ

- **Code Review:** หมุนเวียนสัปดาห์ละ 0.5 วัน (ห้าม merge งานตัวเองโดยไม่มีคน review)
- **Daily Sync:** 15 นาที เช้า / อัปเดต blocker
- **Integration Checkpoint:** ทุกสิ้นสัปดาห์รวม branch และรัน E2E ร่วมกัน
- **Definition of Done ของทุกงาน:**
  - API/UI ตรง contract + มี loading/empty/error state
  - ผ่าน permission test (buyer/seller/admin)
  - Responsive อย่างน้อย mobile + desktop
  - อัปเดต `PROJECT_TASKS.md` / API docs เมื่อเสร็จ

### 🎯 หลักการแบ่งงาน

1. **1 feature = 1 owner** (ยกเว้น Gemstone ที่ Role 1 ทำ logic/UI และ Role 4 review)
2. งานที่แตะเงิน (Escrow/Wallet/Refund) ต้องมี Role 4 review เสมอ
3. งาน UI ที่ต้องใช้ API ให้ owner คุย contract กับ Role 4 ก่อนเริ่ม
4. ถ้าคนใดว่างก่อน ให้หยิบงานใน **Shared Backlog** ด้านล่าง

### 📥 Shared Backlog (หยิบทำเมื่อว่าง)

- [ ] ปรับ `ProductCard` ให้แสดงชื่อร้าน
- [ ] เพิ่ม pagination ให้ `/api/products`
- [ ] เพิ่ม index ให้ตาราง Product/Order ที่ query บ่อย
- [ ] ปรับ accessibility (aria-label, keyboard navigation)
- [ ] เพิ่ม seed data สำหรับ demo
- [ ] เขียน API docs / Postman collection
- [ ] ตรวจ responsive หน้า `/products`, `/cart`, `/checkout`

---

## 👥 การแบ่งหน้าที่รับผิดชอบตามตำแหน่งและบทบาท (Role-Based Task Division)

| Role / ตำแหน่งงาน                                                  | ขอบเขตรับผิดชอบหลัก (Domain)                                                                                                             | กลุ่มผู้ใช้ที่ดูแล (Actors) | โฟลเดอร์ที่รับผิดชอบ                                                                                               |
| :--------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **🔵 Role 1: Frontend Engineer***(Storefront & Catalog)*             | หน้าร้านค้า, แคตตาล็อกสินค้า, ค้นหา/กรอง, หน้าร้านผู้ขาย, ระบบดูดวงหินมงคล                 | Guest, Buyer                                  | `bareandbold_front/`                                                                                                                 |
| **🟢 Role 2: Frontend Engineer***(Transaction & Orders)*             | ตะกร้าสินค้าแยกตามร้าน, Checkout, ชำระเงิน Omise, ไทม์ไลน์ติดตามพัสดุ, รีวิว                          | Buyer                                         | `bareandbold_front/`                                                                                                                 |
| **🟠 Role 3: Fullstack / Portal Engineer***(Seller Center & Admin)*  | ระบบสมัครเปิดร้าน, แดชบอร์ดผู้ขาย, จัดการสินค้า/ออเดอร์ร้านค้า, ระบบแอดมินอนุมัติ | Seller, Admin, Staff                          | `bareandbold_backoffice/`*(Seller UI: `bareandbold_front/src/app/seller/` — ถูกลบชั่วคราว รอทีมทำใหม่)* |
| **🟣 Role 4: Backend & Database Engineer***(API & Financial Escrow)* | REST APIs ทั้งหมด, ฐานข้อมูล Prisma, ระบบพักเงิน Escrow, Omise Webhook, Wallet                                                   | System, DB, Payment                           | `bareandbold_backend/`                                                                                                               |

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

* **ภาระงานเทอมนี้:** ~20 วัน (Storefront + Gemstone KB/API/UI + งานรายงาน/demo)
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
    - [X] แถบค้นหาแบบ Realtime (Search by Name) — ยังไม่รองรับค้นหาตามชื่อร้าน
    - [X] ระบบตัวกรองละเอียด (Filter Panel):
      - [X] กรองตามหมวดหมู่ (ข้อมือ, ข้อเท้า)
      - [X] กรองตามประเภท (สินค้าพร้อมส่ง READY_TO_SHIP vs สินค้าสั่งทำ MADE_TO_ORDER)
      - [ ] กรองตามช่วงราคา (Price Range Slider)
      - [ ] กรองตามขนาดความยาวรอบข้อมือ/ข้อเท้า (ซม.)
    - [ ] ระบบเรียงลำดับ (Sort by: ล่าสุด, ราคาต่ำ-สูง, ราคาสูง-ต่ำ, เรตติ้งดาว)
  - [ ] **Product Detail Page (`/products/[id]`)**:
    - [X] แกลเลอรีรูปภาพสินค้า (รองรับ Thumbnail และรูปขนาดใหญ่จาก Cloudflare R2)
    - [X] แสดง Badge ชนิดสินค้า: "พร้อมส่ง" หรือ "สั่งทำพิเศษ (Made-to-Order: ใช้เวลาผลิต X วัน)"
    - [X] Interactive Customizer Selector: เลือกขนาดรอบข้อมือ (14-20 cm), สีเชือก, จี้/ชาร์ม (ขนาด + accessories)
    - [X] ดาวรีวิว 5 ดวงบน Product Card — ดวงที่ได้คะแนนสีทอง ดวงที่เหลือสีเทา
    - [ ] Seller Profile Card: แสดงชื่อร้าน, โลโก้, คะแนนดาวร้าน, และปุ่ม "ไปที่หน้าร้าน" (API ส่งข้อมูลร้านมาแล้ว)
    - [ ] Customer Reviews & Ratings: แสดงคะแนนดาวเฉลี่ย ⭐, กราฟสรุปคะแนน, และรายการคอมเมนต์พร้อมรูปถ่ายสินค้าจริง
  - [ ] **Shop Profile Page (`/shop/[slug]`)**:
    - [X] หน้าร้านค้าเฉพาะของผู้ขายแต่ละราย แสดงแบนเนอร์, โลโก้, รายละเอียดร้าน (ยังไม่แสดงคะแนนรีวิวเฉลี่ย)
    - [X] Grid แสดงรายการสินค้าทั้งหมดเฉพาะของร้านนี้ (ยังไม่มีตัวกรองหมวดหมู่ภายในร้าน)
  - [ ] **Wishlist Page (`/account/wishlist`)**: หน้ารายการสินค้าโปรดของลูกค้า (บันทึก/ลบ/ย้ายไปตะกร้า)
  - [ ] **🔮 ระบบจับคู่หินมงคลและราศี (Feature Highlight)**:
    - [ ] **Gemstone Knowledge Base + Logic** (Role 1 ดูแล data/logic, Role 4 review route):
      - ฐานข้อมูลวันเกิด, ราศี, ด้านที่เสริมดวง, หินมงคล, สีมงคล/สีกาลกิณี
      - API `POST /api/recommend/gemstones` + query สินค้าที่ตรงกับผลทำนาย
    - [ ] Interactive Form: เลือกวันเกิด (จันทร์-อาทิตย์), ราศี (12 ราศี), และด้านที่ต้องการเสริมดวง (การงาน, การเงิน, ความรัก, สุขภาพ)
    - [ ] Result Card: แสดงการ์ดผลการทำนาย (หินมงคลหลัก-รอง, โทนสีมงคล, สีกาลกิณีที่ควรหลีกเลี่ยง)
    - [ ] Matched Products Carousel: แสดงรายการกำไล/ข้อเท้าในระบบที่มีหินและสีตรงกับคำทำนาย พร้อมปุ่มคลิกสั่งซื้อทันที
* **API Endpoints ที่ต้องประสานงานกับ Role 4:**
  - `GET /api/products` (query: search, category, type, minPrice, maxPrice, minWrist, maxWrist)
  - `GET /api/products/:id`
  - `GET /api/products/:id/reviews`
  - `POST /api/recommend/gemstones` *(Role 1 ดูแล knowledge base/logic, Role 4 review)*
  - `GET /api/shops/:slug`
  - `GET/POST/DELETE /api/wishlist`

---

### 🟢 Role 2: Frontend Engineer — Cart, Checkout, Order Tracking & Reviews

* **ภาระงานเทอมนี้:** ~20 วัน (Buyer flow + Reviews + Refund UI ทั้ง buyer/admin + UAT)
* **บทบาท / ตำแหน่ง:** Frontend Developer (Transaction, Post-Purchase & Customer Portal)
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** ผู้ซื้อ (Buyer / Customer)
* **โฟลเดอร์หลัก:** `bareandbold_front/`
* **เทคโนโลยี:** Next.js (App Router), Tailwind CSS, Omise.js SDK, Cookie Management
* **ความรับผิดชอบหลัก (Core Duties):**
  - [X] **Customer Authentication Flow**:
    - [X] หน้าเข้าสู่ระบบ (`/login`) และสมัครสมาชิกผ่าน Auth Modal
    - [ ] จัดการ Auth State, HTTP-only Cookie, JWT Session (ตอนนี้ใช้ Bearer token ใน localStorage; ยังไม่ย้ายเป็น httpOnly cookie)
    - [X] หน้าจัดการข้อมูลส่วนตัว (`/profile`) และจัดการสมุดที่อยู่
  - [ ] **Multi-Vendor Shopping Cart (`/cart`)**:
    - [ ] แสดงรายการสินค้า **จัดกลุ่มแยกตามร้านค้า (Group by Shop)** แบบเดียวกับ Shopee
    - [X] ปรับเพิ่ม/ลดจำนวน, เลือกลบสินค้า, และแสดงตัวเลือกขนาด Custom ที่ลูกค้าเลือกไว้
    - [ ] Checkbox เลือกสั่งซื้อเฉพาะบางร้านค้า หรือเลือกทั้งหมด
    - [ ] คำนวณสรุปราคาสินค้ารวมและค่าจัดส่งแยกรายร้านค้าแบบ Dynamic
  - [ ] **Checkout Page (`/checkout`)**:
    - [X] ฟอร์มเลือกที่อยู่จัดส่งจากสมุดที่อยู่ หรือเพิ่มที่อยู่ใหม่
    - [ ] สรุปคำสั่งซื้อแยกตามร้านค้าก่อนชำระเงิน
    - [X] Integration กับ Omise Payment Gateway UI:
      - [X] ชำระเงินด้วย PromptPay QR Code (มี mock fallback เมื่อไม่มี OMISE_SECRET_KEY)
      - [ ] ชำระเงินด้วยบัตรเครดิต/เดบิต (Omise Tokenization)
  - [ ] **Order Tracking & History (`/orders`)**:
    - [X] หน้าประวัติคำสั่งซื้อทั้งหมด พร้อมแท็บแยกสถานะ: `ทั้งหมด`, `รอชำระ`, `กำลังผลิต`, `จัดส่งแล้ว`, `สำเร็จ`, `ยกเลิก`
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
  - [ ] **Admin Refund / Dispute UI (`bareandbold_backoffice/` → `/dashboard/refunds`)**:
    - [ ] ตารางคำขอคืนเงิน + ตัวกรองสถานะ
    - [ ] หน้ารายละเอียดคำขอ + รูปหลักฐาน
    - [ ] ปุ่มอนุมัติ/ปฏิเสธ + กรอกหมายเหตุ (ใช้ API จาก Role 4)
* **API Endpoints ที่ต้องประสานงานกับ Role 4:**
  - `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`
  - `GET/POST/PUT/DELETE /api/addresses`
  - `GET/POST/PUT/DELETE /api/cart`
  - `POST /api/orders/checkout`
  - `GET /api/orders/my-orders`, `GET /api/orders/:id`
  - `POST /api/orders/:subOrderId/confirm-received`
  - `POST /api/reviews`
  - `POST /api/refunds/request`
  - `GET/PUT /api/admin/refunds` *(Role 2 ใช้ UI, Role 4 ทำ API)*

---

### 🟠 Role 3: Fullstack / Portal Engineer — Seller Center & Admin Backoffice

* **ภาระงานเทอมนี้:** ~20 วัน (Seller Center UI + Admin UI/API + UAT)
* **บทบาท / ตำแหน่ง:** Fullstack & Platform Operations Developer
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** ผู้ขาย (Seller / Artisan) และ ผู้ดูแลระบบกลาง (Admin / Staff)
* **โฟลเดอร์หลัก:** `bareandbold_backoffice/` (ระบบแอดมิน) & `bareandbold_front/src/app/seller/` (พอร์ทัลร้านค้า — **ถูกลบชั่วคราว รอทีมทำใหม่**)
* **เทคโนโลยี:** Next.js, Ant Design / Tailwind CSS, Cloudflare R2 Upload Client, Chart.js / Recharts
* **ความรับผิดชอบหลัก (Core Duties):**
  - [X] **ระบบสมัครเปิดร้านค้าสำหรับผู้ขาย (`/become-seller`)**:
    - [X] ฟอร์มกรอกชื่อร้าน, URL Slug, คำอธิบายร้าน, อัปโหลดโลโก้และภาพแบนเนอร์
    - [X] ฟิลด์บังคับยืนยันตัวตน (KYC): **เลขประจำตัวผู้เสียภาษี (Tax ID)**, ชื่อบัญชีและเลขที่บัญชีธนาคาร
    - [X] หน้าแสดงสถานะ "รอการตรวจสอบและอนุมัติจากแอดมิน (Pending Approval)" + แก้ไขส่งใหม่เมื่อถูกปฏิเสธ
  - [ ] **Seller Center Dashboard (`/seller/dashboard`)** — *UI ถูกลบเพื่อให้เพื่อนทำ; API พร้อมแล้ว*:
    - [ ] KPI Cards: ยอดขายรวมประจำเดือน, จำนวนออเดอร์ใหม่, สินค้าที่ต้องจัดส่ง/ผลิต (API มี product counts + balance)
    - [ ] กราฟแสดงแนวโน้มยอดขายย้อนหลัง
  - [ ] **Seller Product Management (`/seller/products`)** — *UI ถูกลบเพื่อให้เพื่อนทำ; API พร้อมแล้ว*:
    - [ ] ตารางสินค้าของร้านตนเอง (แสดงรูป, ชื่อ, สต็อก, ประเภท, ราคา)
    - [ ] ฟอร์มสร้าง/แก้ไขสินค้า:
      - อัปโหลดรูปภาพสินค้าขึ้น Cloudflare R2 (เลือกรูปหน้าปก + รูปแกลเลอรี) — API พร้อม
      - กำหนดประเภท: พร้อมส่ง (READY_TO_SHIP) หรือ สั่งทำ (MADE_TO_ORDER พร้อมระบุจำนวนวันผลิต เช่น 3, 7, 14 วัน) — API พร้อม
      - กำหนดขนาดรอบข้อมือ/ข้อเท้าที่ร้านรับทำ (Wrist Size Min - Max) — API พร้อม
      - จัดการตัวเลือก Custom Options (ขนาด, สีเชือก, จี้ที่เลือกได้) — API พร้อม
    - [ ] ปุ่มเปิด-ปิดการขายสินค้า และปุ่มลบสินค้า (Soft Delete) — API พร้อม
  - [ ] **Seller Order Fulfillment (`/seller/orders`)**:
    - [ ] หน้ารายการออเดอร์ของร้านตนเอง (SubOrders) แยกแท็บสถานะ (รอ Split Order)
    - [ ] ปุ่มอัปเดตสถานะเป็น "กำลังผลิต (In Production)" สำหรับงาน Made-to-Order
    - [ ] ฟอร์มบันทึกการจัดส่ง: เลือกบริษัทขนส่ง (ไปรษณีย์ไทย, Flash Express, Kerry, J&T) และกรอกเลข Tracking Number
  - [ ] **Seller Wallet & Payout System (`/seller/wallet`)**:
    - [ ] แสดงยอดเงินคงเหลือที่ถอนได้ (Available Balance) และยอดที่รอดำเนินการ (Pending Balance)
    - [ ] ตารางประวัติรายการเดินบัญชี (รายรับจากออเดอร์, การหักค่าธรรมเนียม GP 5%)
    - [ ] ฟอร์มกดยื่นคำขอถอนเงิน (Request Payout) ไปยังบัญชีธนาคารที่ผูกไว้
  - [ ] **Admin Backoffice System (`bareandbold_backoffice/`)**:
    - [X] **หน้าอนุมัติร้านค้าใหม่ (`/dashboard/shops`)**: ตรวจสอบข้อมูลร้านและเลข Tax ID กด Approve หรือ Reject
    - [ ] **หน้าอนุมัติการถอนเงิน (`/dashboard/payouts`)**: ตรวจสอบรายการขอถอนเงินของร้านค้า, แนบสลิปหลักฐานการโอน และกดยืนยันการโอนเงิน (Transferred)
    - [ ] **หน้าตรวจสอบสินค้า (Product Moderation)**: ตรวจสอบและระงับสินค้าที่ไม่เหมาะสม
    - [ ] **หน้าจัดการข้อพิพาท/คืนเงิน (`/dashboard/refunds`)**: **Role 2 รับผิดชอบ UI** (Role 4 ทำ API)
    - [ ] **หน้าตั้งค่าแพลตฟอร์ม (`/dashboard/settings/platform`)**: ตั้งค่า GP %, ค่าส่ง, ยอดฟรีส่ง, เงื่อนไขการจัดส่ง
  - [ ] **Admin Platform APIs (Role 3 รับผิดชอบ ร่วม review กับ Role 4)**:
    - [ ] `GET/PUT /api/admin/payouts`: อนุมัติ/บันทึกสลิปโอน
    - [ ] `GET/PUT /api/admin/products/:id/moderate`: ระงับ/ซ่อนสินค้า
    - [ ] `GET /api/admin/analytics`: GMV + commission summary
* **API Endpoints ที่ต้องประสานงานกับ Role 4:**
  - `POST /api/shops/apply`, `GET /api/shops/my-shop`, `PUT /api/shops/my-shop`
  - `GET/POST/PUT/DELETE /api/seller/products`
  - `GET /api/seller/orders`, `PUT /api/seller/orders/:id/status`, `POST /api/seller/orders/:id/ship`
  - `GET /api/seller/wallet`, `POST /api/seller/payouts/request`
  - `GET/PUT /api/admin/shops/:id/approve`
  - `GET/PUT /api/admin/payouts/:id/approve` *(Role 3)*
  - `GET/PUT /api/admin/products/:id/moderate` *(Role 3)*
  - `GET /api/admin/analytics` *(Role 3)*
  - `GET/PUT /api/admin/settings` *(Role 3 — Platform Settings)*
  - `GET /api/settings/public` *(Role 4 wire เข้า checkout)*
  - `GET/PUT /api/admin/refunds/:id` *(Role 4 ทำ API, Role 2 ทำ UI)*

---

### 🟣 Role 4: Backend & Database Engineer — Architecture, Escrow & REST APIs

* **ภาระงานเทอมนี้:** ~20 วัน (Core financial/order + review/support + deploy/docs)
* **บทบาท / ตำแหน่ง:** Backend, Database & Payment System Engineer
* **กลุ่มผู้ใช้งานที่ดูแล (Target Actors):** Core Platform, Financial Escrow Engine, Integration Services
* **โฟลเดอร์หลัก:** `bareandbold_backend/`
* **เทคโนโลยี:** Hono Framework, Bun Runtime, PostgreSQL (Neon), Prisma ORM (Multi-File Schema), Omise API, Cloudflare R2 SDK
* **ความรับผิดชอบหลัก (Core Duties):**
  - [X] **Database Architecture & Multi-File Schema Management**:
    - [X] ดูแลความสมบูรณ์ของโครงสร้างตาราง 26 โมเดล ในโฟลเดอร์ `prisma/schema/*.prisma`
    - [X] ควบคุม Data Migration, Indexing, Performance Query และ Seed Data
  - [X] **Authentication & Role Authorization Middleware**:
    - [X] ระบบ JWT Authentication (Sign / Verify / Bearer token; httpOnly cookie ยังต้อง harden เพิ่ม)
    - [X] Middleware ตรวจสอบสิทธิ์: `requireCustomer`, `requireSeller`, `requireApprovedSeller`, `requireAdmin`, `requireRole`
  - [ ] **Multi-Vendor Product Catalog APIs**:
    - [X] `GET /api/products`: Search, Filtering (ข้อมือ/ข้อเท้า, พร้อมส่ง/สั่งทำ, ร้าน) — ยังไม่มี price/wrist range และ Pagination
    - [X] `GET /api/products/:id`: ดึงข้อมูลสินค้าพร้อม Images, Custom Options, Accessories และ Shop Info
    - [X] `POST/PUT/DELETE /api/seller/products`: จัดการสินค้าเฉพาะของร้านค้าตนเอง (Seller Guard + ownership check)
    - [X] `POST /api/upload`: อัปโหลดรูปภาพสินค้าขึ้น Cloudflare R2 (seller ใช้ได้ + ตรวจ folder/เจ้าของ)
  - [ ] **Multi-Vendor Cart & Split Order Engine (หัวใจของระบบตัวกลาง)**:
    - [X] `GET/POST/PUT/DELETE /api/cart`: จัดการตะกร้าสินค้า (รองรับ Custom Options & Accessories)
    - [ ] `POST /api/orders/checkout`: บันทึก Master Order และ**แตก SubOrder ตามแต่ละร้านค้าโดยอัตโนมัติ (Split Order Logic)** — ปัจจุบันยังสร้าง Master Order เดียว
  - [ ] **Omise Payment Gateway & Escrow Webhook**:
    - [X] `POST /api/payments/checkout`: สร้าง Charge กับ Omise (รองรับ PromptPay QR Code; มี mock fallback)
    - [X] `POST /api/payments/webhook`: Webhook Listener รับสถานะการจ่ายเงิน (อัปเดต Payment/Master Order; SubOrder ยังไม่มี)
    - [ ] ระบบ Escrow (พักเงินไว้ที่ระบบตัวกลาง): ยังไม่โอนเงินเข้าร้านค้าจนกว่าลูกค้าจะยืนยันรับของ
  - [ ] **Fulfillment, Confirmation & Escrow Release APIs**:
    - [ ] `PUT /api/seller/orders/:subOrderId/status`: ร้านค้าเปลี่ยนสถานะเป็นกำลังผลิต
    - [ ] `POST /api/seller/orders/:subOrderId/ship`: ร้านค้าบันทึกชื่อขนส่งและเลข Tracking Number
    - [ ] `POST /api/orders/:subOrderId/confirm-received`: ลูกค้ายืนยันรับของ ➔ **ปลดล็อกเงิน Escrow** (คำนวณหักค่าธรรมเนียม GP 5% ➔ โอนเงิน Net Amount เข้า `Shop.balance` ➔ บันทึกประวัติ `ShopTransaction`)
  - [ ] **Reviews & Ratings APIs**:
    - [ ] `POST /api/reviews`: ส่งรีวิว (ตรวจสอบสิทธิ์ว่าต้องซื้อจริง `orderItemId`, ให้คะแนน 1-5 ดาว, บันทึกรูป)
    - [ ] อัปเดตคำนวณคะแนนเฉลี่ย (`rating`) และจำนวนรีวิว (`reviewCount`) บนตาราง `Product` อัตโนมัติ
    - [ ] `GET /api/products/:id/reviews` & `GET /api/shops/:id/reviews`
  - [ ] **🔮 Gemstone & Astrology API — Support & Review (Role 1 เป็นเจ้าของ logic/UI)**:
    - [ ] Review route `POST /api/recommend/gemstones`, query performance และ contract กับหน้าบ้าน
    - [ ] เพิ่ม filter หิน/สีใน public catalog API หาก Role 1 ต้องใช้
  - [ ] **Wallet, Payouts & Admin Management APIs**:
    - [ ] `GET /api/seller/wallet`: ดึงยอดคงเหลือและประวัติธุรกรรมกระเป๋าเงิน
    - [ ] `POST /api/seller/payouts/request`: ร้านค้ายื่นคำขอถอนเงินเข้าบัญชีธนาคาร
    - [X] `GET/PUT /api/admin/shops`: ดึงรายชื่อร้านค้าเพื่อกด Approve/Reject (staff ดูได้, admin อนุมัติ)
    - [ ] `GET/PUT /api/admin/payouts`: **ย้ายไป Role 3** (Role 4 review)
    - [ ] `POST/GET/PUT /api/refunds`: จัดการคำร้องขอคืนเงิน (Role 4 ทำ API, Role 2 ทำ UI)
* **เครื่องมือและบริการที่ต้องดูแล:**
  - Neon PostgreSQL, Cloudflare R2, Omise Payment Sandbox

---

---

---

## 🗄️ Phase 1: การปรับโครงสร้างฐานข้อมูล (Database Schema)

- [X] **1.1 อัปเดต Model `User`**
  - [X] เพิ่มความสัมพันธ์กับ `Shop` (1 User can own 1 Shop)
  - [X] เพิ่ม Role: `BUYER`, `SELLER`, `ADMIN`
- [X] **1.2 สร้าง Model `Shop` (ร้านค้าพาร์ทเนอร์)**
  - [X] ฟิลด์: `id`, `ownerId`, `name`, `slug`, `logoUrl`, `bannerUrl`, `description`
  - [X] ฟิลด์ยืนยันตัวตน: `taxId` (เลขผู้เสียภาษี), `idCardUrl`, `bankName`, `bankAccountNumber`, `bankAccountName`
  - [X] สถานะร้าน: `status` (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`)
  - [X] เวลาและยอดเงินสะสม: `balance`, `createdAt`, `updatedAt`
- [X] **1.3 ปรับปรุง Model `Product` (สินค้าเครื่องประดับ)**
  - [X] เชื่อมโยงกับ `shopId` (`Shop`)
  - [X] เพิ่มประเภท: `type` (`READY_TO_SHIP`, `MADE_TO_ORDER`)
  - [X] สำหรับงานสั่งทำ: เพิ่ม `leadTimeDays` (ระยะเวลาผลิต เช่น 3, 7, 14 วัน)
  - [X] หมวดหมู่เฉพาะ: `category` (`BRACELET`, `ANKLET`, `RING`, `NECKLACE`)
  - [X] สเปกสินค้า: `wristSizeMin`, `wristSizeMax` (ขนาดความยาวข้อมือ/ข้อเท้า)
- [X] **1.4 สร้างโครงสร้าง Multi-Vendor Order (แยกคำสั่งซื้อตามร้าน)**
  - [X] Model `Order` (Master Order): เก็บยอดชำระรวมของผู้ซื้อ, ช่องทางชำระเงิน, สถานะการจ่ายเงิน
  - [X] Model `SubOrder` (คำสั่งซื้อแยกตามร้าน): มีสถานะการผลิต/จัดส่งแยกกัน (`PENDING`, `PAID`, `PRODUCING`, `SHIPPED`, `DELIVERED`, `COMPLETED`)
  - [X] Model `OrderItem`: รองรับการเชื่อมทั้ง Master Order และ SubOrder พร้อม `customDetails`
- [X] **1.5 สร้าง Model ด้านการเงิน (Escrow & Payout)**
  - [X] Model `ShopTransaction`: บันทึกประวัติกระเป๋าเงิน (ยอดขาย, ค่าคอมมิชชัน, ถอนเงิน)
  - [X] Model `PayoutRequest`: คำขอถอนเงินของร้านค้า (`PENDING`, `APPROVED`, `TRANSFERRED`, `REJECTED`)
- [X] **1.6 สร้าง Model รีวิวและคะแนนดาว (Reviews & Ratings)**
  - [X] Model `Review`: ให้คะแนนดาว 1-5 ดาว, ข้อความคอมเมนต์, ผูกกับ `orderItemId` ป้องกันการสแปมรีวิว (Verified Purchase)
  - [X] Model `ReviewImage`: รองรับการแนบรูปภาพสินค้าจริงที่ได้รับ
  - [X] เพิ่ม `rating` (คะแนนเฉลี่ย) และ `reviewCount` บน Model `Product`
- [X] **1.7 ซิงค์ Prisma เข้า Database (Neon) และ Generate Prisma Client**
  - [X] อัปเดต `prisma.config.ts` ให้โหลด `.env` จาก backend อย่างถูกต้อง
  - [X] รัน `prisma db push` ซิงค์ Table ทั้งหมดขึ้นฐานข้อมูล Neon สำเร็จ
  - [X] รัน `prisma generate` สร้าง types สำหรับ Client v7.8.0 เรียบร้อย

---

## 🔐 Phase 2: ระบบสมาชิกและการเปิดร้าน (Auth & Seller Onboarding)

### ฝั่ง Backend

- [X] **2.1 API ตรวจสอบสิทธิ์และโปรไฟล์**
  - [X] ปรับปรุง JWT Payload ให้เก็บ `accountType` และ `role` พร้อม resolve `shop` จาก DB ทุก request (ทดแทนการเก็บ `shopId`/`shopStatus` ใน token)
  - [X] Middleware ตรวจสอบสิทธิ์: `requireSeller`, `requireApprovedSeller`, `requireAdmin`
- [X] **2.2 API สมัครเปิดร้านค้า (Become a Seller)**
  - [X] `POST /api/shops/apply`: ส่งข้อมูลชื่อร้าน, เลขประจำตัวผู้เสียภาษี (Tax ID), ข้อมูลบัญชีธนาคาร
  - [X] `GET /api/shops/my-shop`: ดึงข้อมูลร้านค้าของผู้ใช้ปัจจุบัน
  - [X] `PUT /api/shops/my-shop`: แก้ไขข้อมูลร้านค้า/โลโก้ + ส่งใหม่หลังถูกปฏิเสธ

### ฝั่ง Frontend (Buyer/Seller Web)

- [X] **2.3 หน้าสมัครเปิดร้าน (`/become-seller`)**
  - [X] แบบฟอร์มลงทะเบียนร้านค้า (ชื่อร้าน, คำอธิบายร้าน)
  - [X] ฟิลด์กรอกเลข Tax ID และอัปโหลดหน้าสมุดบัญชีธนาคาร/บัตรประชาชน
  - [X] หน้าแสดงสถานะ "รอการตรวจสอบจากแอดมิน (Pending Approval)" + REJECTED/APPROVED
- [X] **2.4 สวิตช์สลับโหมดผู้ซื้อ / ผู้ขายบนแถบเมนู (Header Navigation)**
  - [X] แสดงเมนูตาม role: สมัครเปิดร้าน / รออนุมัติ / ดูร้านของฉัน (Seller Center UI ถูกนำออกชั่วคราว)

---

## 💍 Phase 3: ระบบจัดการสินค้า & หน้าร้าน (Catalog & Customization)

### ฝั่ง Backend

- [ ] **3.1 API สินค้าสำหรับผู้ซื้อ (Public Catalog)**
  - [X] `GET /api/products`: ค้นหา + ตัวกรอง (กำไลข้อมือ/ข้อเท้า, พร้อมส่ง/สั่งทำ, ร้าน) — ยังไม่มีช่วงราคา/ขนาด/หินมงคล/เรียงลำดับ
  - [X] `GET /api/products/:id`: ดูรายละเอียดสินค้าพร้อมข้อมูลร้านค้า
  - [X] `GET /api/shops/:slug`: ข้อมูลร้านค้าและสินค้าทั้งหมดของร้านนั้น (เฉพาะร้าน APPROVED)
- [X] **3.2 API จัดการสินค้าสำหรับร้านค้า (Seller Product API)**
  - [X] `POST /api/seller/products`: เพิ่มสินค้า (ผูกกับ shopId ของตนเองอัตโนมัติ)
  - [X] `PUT /api/seller/products/:id`: แก้ไขสินค้าของร้านตนเอง
  - [X] `DELETE /api/seller/products/:id`: ลบสินค้า (Soft Delete)
  - [X] `POST /api/upload`: อัปโหลดรูปภาพสินค้าขึ้น Cloudflare R2

### ฝั่ง Frontend

- [ ] **3.3 หน้ารวมสินค้าและตัวกรอง (`/products`)**
  - [X] ระบบค้นหาตามชื่อสินค้า (ยังไม่รองรับค้นหาตามร้านค้า)
  - [X] แถบกรองหมวดหมู่: กำไลข้อมือ (Bracelet), กำไลข้อเท้า (Anklet) — ยังไม่มีแหวน/สร้อยคอใน UI
  - [X] แถบกรองประเภทสินค้า: สินค้าพร้อมส่ง (Ready-to-Ship) vs งานสั่งทำ (Made-to-Order)
- [ ] **3.4 หน้ารายละเอียดสินค้า (`/products/[id]`)**
  - [X] แกลเลอรีรูปภาพสินค้า
  - [X] ป้ายแสดงเวลาผลิต (เช่น "สินค้าสั่งทำ: ผลิตภายใน 5-7 วัน")
  - [X] ตัวเลือกปรับแต่ง: เลือกขนาดความยาวรอบข้อมือ/ข้อเท้า (เช่น 14 ซม., 15 ซม., หรือกำหนดเอง)
  - [ ] การ์ดข้อมูลร้านค้า (ลิงก์ไปยังหน้าร้านของผู้ขาย) — API ส่งข้อมูลร้านมาแล้ว
- [X] **3.5 หน้าร้านค้า (`/shop/[slug]`)**
  - [X] แสดง Header ร้านค้า (โลโก้, แบนเนอร์, รายละเอียด) — ยังไม่แสดงคะแนนรีวิว
  - [X] Grid รายการสินค้าทั้งหมดเฉพาะของร้านนี้ — ยังไม่มีตัวกรองหมวดหมู่ภายในร้าน

---

## 🔮 Phase 3.5 (Feature Highlight): ระบบจับคู่หินมงคลและราศี (AI / Algorithmic Gemstone Recommender)

*จุดเด่นประจำเทอมใหม่: ตอบโจทย์ตลาดกำไล/เครื่องประดับสายมูในไทย ยกระดับโปรเจกต์ด้วยการนำ Logic & AI เข้ามาเชื่อมโยงกับแคตตาล็อกสินค้าจริงในระบบ*

### ฝั่ง Backend

- [ ] **3.5.1 พัฒนา Gemstone Knowledge Base & Recommendation Logic** *(Role 1 รับผิดชอบ, Role 4 review)*
  - [ ] ฐานข้อมูลจับคู่ความเชื่อ: วันเกิด (จันทร์-อาทิตย์), ราศี (12 ราศี), ด้านที่เสริมดวง (การงาน, การเงิน, ความรัก, สุขภาพ, โชคลาภ)
  - [ ] ข้อมูลหินมงคลประจำด้าน: เช่น ลาพิส ลาซูลี (การงาน/สติปัญญา), โรสควอตซ์ (ความรัก), ซิทริน/ไหมทอง (การเงิน), นิลดำ (ป้องกันภัย)
  - [ ] กฎเกณฑ์สีมงคลและสีกาลกิณีประจำวันเกิด
  - [ ] API `POST /api/recommend/gemstones`: รับข้อมูลผู้ใช้ ➔ วิเคราะห์หินมงคล + สีเชือกที่ถูกโฉลก + สีกาลกิณี ➔ Query ค้นหาสินค้ากำไล/ข้อเท้าในระบบที่มีหินหรือสีตรงกัน
  - [ ] (Option เสริม AI): เชื่อมต่อ Gemini API ร่วมวิเคราะห์คำทำนายและแต่งคำแนะนำเฉพาะบุคคลแบบ Personalized

### ฝั่ง Frontend

- [ ] **3.5.2 พัฒนาหน้าระบบดูดวงและแนะนำเครื่องประดับ (`/horoscope` หรือ `/gemstone-guide`)** *(Role 1)*
  - [ ] Interactive Form: เลือกวันเกิด (จันทร์-อาทิตย์), ราศี, และด้านที่ต้องการเสริมดวง
  - [ ] Result Card: แสดงการ์ดผลการทำนาย (หินมงคลที่แนะนำ, โทนสีมงคล, สีกาลกิณีที่ควรหลีกเลี่ยง)
  - [ ] Matched Products Shelf: แสดงรายการกำไลข้อมือ/ข้อเท้าจากร้านค้าต่างๆ ที่มีหินและสีตรงกับคำทำนาย พร้อมปุ่มคลิกสั่งซื้อทันที

---

## 🛒 Phase 4: ระบบตะกร้า, สั่งซื้อ & ชำระเงิน (Cart, Split Order & Escrow)

### ตะกร้าสินค้า (Cart)

- [ ] **4.1 ระบบตะกร้าแยกกลุ่มตามร้านค้า (Group by Shop)**
  - [ ] หน้า `/cart` แสดงสินค้าจัดกลุ่มตามร้านค้าแบบเดียวกับ Shopee/Lazada (ปัจจุบันยังไม่จัดกลุ่ม)
  - [ ] สรุปค่าจัดส่งและยอดรวมแยกแต่ละร้านค้า

### การสั่งซื้อและชำระเงิน (Checkout & Escrow)

- [ ] **4.2 API Checkout & Split Order**
  - [ ] `POST /api/orders/checkout`: บันทึกคำสั่งซื้อหลัก (Master Order) และแตกเป็น SubOrder ตามแต่ละร้านค้า (ปัจจุบันสร้าง Master Order เดียว)
- [ ] **4.3 เชื่อมต่อระบบชำระเงิน Omise Payment Gateway**
  - [X] รองรับ PromptPay QR Code (มี Omise charge + mock fallback เมื่อไม่มี key)
  - [ ] รองรับบัตรเครดิต/เดบิตเต็มรูปแบบ
  - [X] ระบบ Webhook (`POST /api/payments/webhook`) รับสถานะการจ่ายเงิน (อัปเดต Payment/Master Order)
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
- [ ] **5.4 ระบบขอคืนเงิน/คืนสินค้า (Refund / Dispute)** *(Role 2 UI, Role 4 API)*
  - [ ] แบบฟอร์มยื่นขอคืนเงินกรณีสินค้าเสียหายหรือไม่ได้รับสินค้าภายในกำหนด

---

## 💼 Phase 6: พอร์ทัลผู้ขาย & กระเป๋าเงิน (Seller Center & Wallet)

- [ ] **6.1 แดชบอร์ดสรุปภาพรวมร้านค้า (`/seller/dashboard`)** — *UI ถูกลบเพื่อให้เพื่อนทำ; API `GET /api/seller/dashboard` พร้อมแล้ว*
  - [ ] การ์ดยอดขายรวม, จำนวนออเดอร์ใหม่, สินค้าที่ต้องจัดส่ง (API มี product counts + balance แล้ว)
  - [ ] กราฟยอดขายย้อนหลัง
- [ ] **6.2 หน้ารายการสินค้าของร้าน (`/seller/products`)** — *UI ถูกลบเพื่อให้เพื่อนทำ; API พร้อมแล้ว*
  - [ ] ฟอร์มเพิ่ม/แก้ไขสินค้า พร้อมกำหนดเป็นแบบ Made-to-Order หรือ Ready-to-Ship
- [ ] **6.3 ระบบกระเป๋าเงินและถอนเงิน (`/seller/wallet`)**
  - [ ] แสดงยอดเงินคงเหลือที่ถอนได้ (Available Balance)
  - [ ] ประวัติรายการเดินบัญชี (รายรับจากออเดอร์, การหักค่าธรรมเนียมแพลตฟอร์ม)
  - [ ] ฟอร์มกดยื่นคำขอถอนเงิน (Request Payout) ไปยังบัญชีธนาคารที่ลงทะเบียนไว้
  - [ ] API `POST /api/seller/payouts/request`

---

## 🛡️ Phase 7: ระบบหลังบ้านผู้ดูแลระบบ (Admin Backoffice)

- [X] **7.1 ระบบอนุมัติร้านค้า (Shop Approval)**
  - [X] หน้าตรวจสอบรายชื่อร้านค้าใหม่ (`/dashboard/shops`)
  - [X] ตรวจสอบชื่อร้าน, ข้อมูลผู้สมัคร, เลข Tax ID, เอกสารแนบ (staff เห็นข้อมูล KYC แบบ mask)
  - [X] ปุ่มกด "อนุมัติร้านค้า (Approve)" หรือ "ปฏิเสธพร้อมระบุเหตุผล (Reject)"
- [ ] **7.2 ระบบตรวจสอบและควบคุมสินค้า (Product Moderation)**
  - [ ] รายการสินค้าทั้งหมดในแพลตฟอร์ม พร้อมตัวกรองตามร้านค้า
  - [ ] ปุ่มระงับสินค้าที่ไม่เหมาะสม (Take Down / Hide)
- [ ] **7.3 ระบบอนุมัติการถอนเงิน (Payout Approvals)** *(Role 3)*
  - [ ] หน้าตรวจสอบรายการคำขอถอนเงินของร้านค้า (`/dashboard/payouts`)
  - [ ] แสดงยอดเงิน, บัญชีธนาคารปลายทาง, หลักฐานการโอน
  - [ ] ปุ่มกดบันทึกการโอนเงินสำเร็จ (`TRANSFERRED`)
- [ ] **7.4 รายงานสถิติแพลตฟอร์ม (Platform Analytics)** *(Role 3)*
  - [ ] สรุปยอดขายรวมทั้งระบบ (GMV - Gross Merchandise Value)
  - [ ] รายได้ค่าคอมมิชชันของแพลตฟอร์ม (Platform Net Revenue)

---

## 🧪 Phase 8: การทดสอบและการส่งมอบ (Testing & Deployment)

- [ ] **8.1 การทดสอบ End-to-End User Flow**
  - [X] Flow 1: สมัครสมาชิก ➔ ขอเปิดร้านค้า ➔ แอดมินอนุมัติ ➔ ร้านค้าลงขายกำไล (ทดสอบผ่าน 52/52 + UI E2E)
  - [ ] Flow 2: ผู้ซื้อสั่งสินค้าสั่งทำ (Custom) + สินค้าพร้อมส่ง ➔ ชำระเงินผ่าน Omise
  - [ ] Flow 3: ร้านค้ารับออเดอร์ ➔ ผลิต ➔ ส่งพัสดุและกรอก Tracking
  - [ ] Flow 4: ลูกค้ายืนยันรับของ ➔ เงินเข้ากระเป๋าร้าน ➔ ร้านค้ากดยื่นถอนเงิน ➔ แอดมินอนุมัติ
- [ ] **8.2 ปรับแต่ง UI/UX & Responsive**
  - [ ] ตรวจสอบการใช้งานบน Mobile (เพราะลูกค้าซื้อเครื่องประดับผ่านมือถือเป็นหลัก)
- [ ] **8.3 Environment & Deployment**
  - [ ] ตั้งค่า Environment Variables บน Neon, Cloudflare R2, Omise
  - [ ] Deploy Next.js Frontend & Backoffice ขึ้น Vercel
  - [ ] Deploy Hono/Bun Backend ขึ้น Cloud Hosting (Render / Railway / VPS)
- [ ] **8.4 เอกสารและ Demo สำหรับส่งอาจารย์ (Year 3 Deliverables)**
  - [ ] รายงานโปรเจกต์ + UML (use case / sequence / class diagram)
  - [ ] API Documentation + Postman collection
  - [ ] UAT Test Cases + สรุปผลการทดสอบ
  - [ ] Demo Video + Slides นำเสนอ
- [ ] **8.5 Buffer Phase (เดือนที่ 2–4)**
  - [ ] UAT เต็มระบบ + แก้บั๊ก + performance/security hardening
  - [ ] ซ้อมนำเสนอ + เก็บ feedback อาจารย์
  - [ ] Deploy จริง + Demo Day + แผนสำรอง

---

## 🚀 Phase 9: Extended Scope (ฟีเจอร์เพิ่มเติม)

### Tier 1 — Recommended (เดือนที่ 2)

- [ ] **Coupon & Promotion System**
  - [ ] Model/API: coupon code, ส่วนลด %, จำนวนเงิน, ขั้นต่ำ, วันหมดอายุ, จำกัดจำนวนใช้
  - [ ] UI: ช่องกรอกโค้ดใน `/cart` และ `/checkout` + แสดงส่วนลด
  - [ ] Admin: หน้าจัดการ coupon (`/dashboard/coupons`)
- [ ] **Platform Settings (ค่ากลางของแพลตฟอร์ม)** — *Role 3 + Role 4*
  - [ ] Model `PlatformSetting` (key/value หรือ singleton config): `commissionRate`, `defaultShippingFee`, `freeShippingThreshold`, `shippingConditions`
  - [ ] API: `GET/PUT /api/admin/settings` (Admin), `GET /api/settings/public` (checkout ใช้ค่าส่ง/ฟรีส่ง)
  - [ ] UI Backoffice: `/dashboard/settings/platform` — ฟอร์ม GP %, ค่าส่ง, ยอดฟรีส่ง, เงื่อนไข + preview
  - [ ] Validation: GP 0–30%, ค่าส่ง 0–500 บาท, ยอดฟรีส่ง 0–100,000 บาท
  - [ ] Role 4 wire ค่า settings เข้า checkout (ค่าส่ง/ฟรีส่ง) + escrow (GP %) — 0.5 วัน
  - [ ] Acceptance: เปลี่ยนค่าแล้วมีผลกับออเดอร์ใหม่, admin เท่านั้นที่แก้ได้, มี audit log
- [ ] **SEO & Accessibility**
  - [ ] Meta tags / Open Graph / sitemap
  - [ ] Product structured data (JSON-LD)
  - [ ] alt text, aria-label, keyboard navigation
- [ ] **Seller Shop Analytics**
  - [ ] API สรุปยอดขาย/top products/conversion ตามช่วงวันที่
  - [ ] UI กราฟใน Seller Dashboard
- [ ] **Admin Audit Log**
  - [ ] Model `AuditLog` + API
  - [ ] หน้าดูประวัติ approve/reject/payout/moderation
- [ ] **Invoice / Printable Receipt**
  - [ ] API สร้าง PDF/ใบเสร็จ
  - [ ] ปุ่มดาวน์โหลด/ปริ้นในหน้า order

### Tier 2 — Stretch (เดือนที่ 3)

- [ ] **Notification System** (in-app + email)
- [ ] **Seller Reply Reviews**
- [ ] **Recently Viewed + Share**
- [ ] **Rate Limiting & Security Hardening**
- [ ] **CI/CD Pipeline**
- [ ] **Loyalty Points**

---

## 📌 สรุปหน้าที่ตามโปรเจกต์เดิมใน Workspace

1. **`bareandbold_front/`:** ใช้เป็นหน้าร้านค้าหลัก (Storefront) สำหรับผู้ซื้อ และขยายเพิ่มส่วน Seller Portal สำหรับร้านค้า
   - *หมายเหตุ:* UI Seller Center (`src/app/seller/`) ถูกนำออกชั่วคราวเพื่อให้ทีมอื่นพัฒนาใหม่ — Backend Seller API ยังพร้อมใช้งาน
2. **`bareandbold_backoffice/`:** ใช้เป็นระบบ Admin ตัวกลาง (Platform Admin) สำหรับตรวจรับร้านค้า, อนุมัติถอนเงิน และดูสถิติ
3. **`bareandbold_backend/`:** พัฒนา REST API และปรับ Prisma Schema ให้รองรับ Multi-Vendor Architecture
