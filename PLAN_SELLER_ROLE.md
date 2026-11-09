# 🎯 แผนงาน: ระบบแยก Role (Buyer / Seller / Admin) — เริ่มที่ฝั่ง Seller

> **สถานะล่าสุด (Sprint 1–4 เสร็จแล้ว / ทดสอบผ่าน):**
> - ✅ Role foundation (JWT + DB effective role + middleware)
> - ✅ Shop onboarding + Admin อนุมัติร้าน
> - ✅ Seller product management + Public catalog แสดงข้อมูลร้าน
> - ✅ Seller dashboard (KPI จากข้อมูลจริง) — เมนู orders/wallet แสดงเป็น “เร็ว ๆ นี้”
> - ✅ Security fix: `/auth/backoffice/register` ต้องเป็น Admin, staff ไม่เห็น KYC/บัญชีเต็ม, upload/delete ตรวจเจ้าของไฟล์
> - ✅ Test: backend 52/52 assertions, UI E2E (seller + backoffice) ผ่านทุกข้อ, frontend build ผ่าน
> - 🧹 **นำ UI Seller Center (`/seller/*`) ออกแล้ว** ตามคำขอ เพื่อให้เพื่อนทำต่อ — Backend/API ทั้งหมดยังอยู่ครบ
> - ℹ️ งานที่ยังไม่ทำในรอบนี้: Seller Center UI (เพื่อนทำ), seller orders/wallet จริง (รอ Split Order + Escrow), product detail แสดงการ์ดร้าน, ตัวกรองราคา/ขนาด
>
> **บัญชีทดสอบ (รัน `bun run seed_roles.js` ใน backend):** password = `password`
> | Role | Email |
> |---|---|
> | Buyer | buyer@bareandbold.test |
> | Seller (APPROVED) | seller@bareandbold.test |
> | Seller (PENDING) | pending@bareandbold.test |
> | Admin | admin@gmail.com |

> เป้าหมายรอบนี้: ทำให้ระบบ "รู้จัก role จริง" และส่งมอบ **Seller Portal** ที่ใช้งานได้ตั้งแต่สมัครเปิดร้าน → รออนุมัติ → ลงสินค้า → เห็นสินค้าบนหน้าร้าน
> Admin จำเป็นต้องทำ "ขั้นต่ำ" (อนุมัติร้าน) เพื่อให้ flow ทดสอบได้ครบ ส่วน Order/Wallet ของ seller จะทำหลัง Split Order พร้อม

---

## 1. สรุปสิ่งที่พบในโค้ดปัจจุบัน (ต้องรู้ก่อนลงมือ)

| # | สิ่งที่พบ | ผลกระทบ | ไฟล์อ้างอิง |
|---|---|---|---|
| 1 | Login ตั้ง JWT เป็น `role: "customer"` ตายตัว และ profile คืนค่า role จาก token | `User.role` ใน DB ไม่มีผลจริง แยก seller ไม่ได้ | `bareandbold_backend/src/modules/auth/auth.controller.js:119-139, 287` |
| 2 | Admin/Staff ใช้ตาราง `Employee` แยก และ `requireEmployee` เช็คจากตารางนี้ | เป็นฐานที่ดีอยู่แล้ว ไม่ต้องรื้อ | `src/middleware/auth.middleware.js:72-106` |
| 3 | ยังไม่มีโมดูล `shop` เลย (ไม่มีโฟลเดอร์ `src/modules/shop`) | API สมัครเปิดร้าน/ร้านของฉันยังไม่มี | — |
| 4 | Product ทุกตัวถูกสร้างโดย Employee และ `shopId` เป็น `null` เสมอ | สินค้ายังไม่ผูกกับร้าน seller | `src/modules/product/product.route.js:19-22` |
| 5 | Upload อนุญาตเฉพาะ Employee | Seller จะอัปโหลดโลโก้/รูปสินค้าไม่ได้ | `src/modules/upload/upload.route.js:8-9` |
| 6 | Checkout สร้าง `Order` เดียว ไม่ได้แตก `SubOrder` และไม่ผูกร้าน | **Seller Order Fulfillment ยังทำไม่ได้จริง** ต้องรอ Split Order | `src/modules/order/order.controller.js:116-140` |
| 7 | Frontend ไม่มี AuthContext กลาง, Header อ่าน `localStorage` เอง | ต้องเพิ่ม context เพื่อให้ role/เมนูเปลี่ยนตามสถานะ | `bareandbold_front/src/components/layout/Header.jsx:50-76` |
| 8 | เรียก API ด้วย Bearer token จาก `localStorage` (cookie ก็มีแต่ `secure + SameSite=None` ใช้บน localhost ไม่ได้) | ใช้งานได้ แต่ควร hardening ทีหลัง | `auth.service.js:3-18`, `auth.controller.js:6-12` |
| 9 | CORS สะท้อน origin ใดก็ได้พร้อม credentials | ความเสี่ยงความปลอดภัย ควรจำกัด origin | `src/app.js:22-32` |

**สรุป:** Schema (Phase 1) พร้อมแล้ว แต่ "ตัวระบบ role" และ "seller" ยังไม่ได้ต่อสายจริงเลย

---

## 2. โมเดล Role ที่จะใช้ (ตัดสินใจแล้ว)

```
Employee table  →  ADMIN / STAFF   (เข้า backoffice เท่านั้น)
User table      →  BUYER / SELLER  (เข้า storefront + seller center)
```

- 1 บัญชีผู้ใช้ซื้อของได้เสมอ และขอเปิดร้านได้ 1 ร้าน (`Shop.ownerId` unique)
- **Role ที่มีผลจริงคำนวณจาก DB ทุก request ไม่เชื่อ role ใน JWT:**
  ```
  ถ้าเป็น Employee        → role = employee.role        (ADMIN/STAFF)
  ถ้าเป็น User + มีร้าน      → role = shop.status === "APPROVED" ? SELLER : BUYER
  ถ้าเป็น User ไม่มีร้าน    → role = BUYER
  ```
- ร้านสถานะ `PENDING` / `REJECTED` ยังเป็น BUYER ในเชิงสิทธิ์ แต่ frontend แสดงสถานะ "รออนุมัติ" ได้
- Admin ไม่ต้องเข้ามาใน storefront (แยก backoffice) แต่ถ้าอนาคตต้องการ ให้เพิ่ม `accountType` ใน JWT
- JWT ใหม่: `{ sub, accountType: "USER" | "EMPLOYEE", role, iat, exp }`
  - `role` เก็บไว้เพื่อ debug/UI เท่านั้น **authorization ใช้ DB เป็นหลัก**

### ตารางสิทธิ์ (Authorization Matrix)

| การกระทำ | Guest | Buyer | Seller (PENDING) | Seller (APPROVED) | Staff | Admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| ดูสินค้า/ร้าน (public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ซื้อของ / ตะกร้า / ที่อยู่ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| สมัครเปิดร้าน | ❌ | ✅ | — | — | ❌ | ❌ |
| แก้ข้อมูลร้านตัวเอง | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| อัปโหลดรูป (โฟลเดอร์ร้านตัวเอง) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| สร้าง/แก้/ลบสินค้าร้านตัวเอง | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ดูออเดอร์ร้านตัวเอง | ❌ | ❌ | ❌ | ✅* | ❌ | ❌ |
| อนุมัติ/ปฏิเสธร้าน | ❌ | ❌ | ❌ | ❌ | อ่าน | ✅ |
| จัดการสินค้า platform (shopId = null) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

\* เปิดใช้หลัง Phase 4 (Split Order) เท่านั้น

---

## 3. ลำดับงาน (Sprint Plan)

### 🟦 Sprint 1 — Role Foundation (Backend + Frontend) · ~2-3 วัน

**เป้าหมาย:** login แล้วรู้ role จริง, menu เปลี่ยนตาม role, มี guard ใช้ซ้ำได้

#### Backend
- [ ] แก้ `login` (User) ให้ sign payload จาก `user.role` + คำนวณ `accountType: "USER"`
- [ ] แก้ `loginBackoffice` ให้ใส่ `accountType: "EMPLOYEE"`
- [ ] เพิ่ม helper `resolveEffectiveRole(user)` (เช็ค shop status)
- [ ] `GET /api/auth/profile` คืนค่า:
  ```json
  {
    "success": true,
    "user": { "id": "...", "email": "...", "firstName": "...", "role": "SELLER" },
    "accountType": "USER",
    "shop": { "id": "...", "name": "...", "slug": "...", "status": "APPROVED", "logoUrl": "..." }
  }
  ```
  (`shop: null` ถ้าไม่มีร้าน)
- [ ] เพิ่ม middleware ใน `auth.middleware.js`:
  - `requireAuth` — login แล้ว (User หรือ Employee)
  - `requireSeller` — User ที่มีร้าน (ทุก status)
  - `requireApprovedSeller` — shop.status === `APPROVED`
  - `requireAdmin` — Employee role === `admin`
  - `requireRole(...roles)` — ใช้ซ้ำทั่วไป
  - คง `requireCustomer` / `requireEmployee` เดิมไว้เพื่อไม่ให้ route อื่นพัง (แก้ข้างในให้ set `currentShop` เพิ่ม)
- [ ] ทุก middleware ที่เป็น User ต้อง set `c.set("currentUser")` และ `c.set("currentShop")`

#### Frontend
- [ ] สร้าง `src/context/AuthContext.jsx`
  - state: `user`, `role`, `shop`, `loading`
  - เรียก `/auth/profile` ครั้งเดียวตอน mount, มี `refresh()`
  - `login()` / `logout()` รวม logic ล้าง localStorage เดิม
- [ ] Wrap ใน `src/app/layout.jsx` (แทนที่การอ่าน localStorage กระจัดกระจายใน Header)
- [ ] สร้าง `src/components/auth/RequireRole.jsx` (client guard)
  - ไม่ login → เปิด AuthModal / redirect กลับมาหน้าเดิม
  - role ไม่พอ → หน้า 403 + ปุ่มกลับหน้าแรก
- [ ] ปรับ `Header.jsx`
  - ผู้ใช้ทั่วไป: เห็น "สมัครเปิดร้าน" (`/become-seller`)
  - มีร้าน PENDING: badge "รออนุมัติ"
  - SELLER: เห็นเมนู "Seller Center" (`/seller/dashboard`) + "ร้านของฉัน"
  - คงเมนูประวัติคำสั่งซื้อ/โปรไฟล์ของ buyer ไว้
- [ ] เพิ่ม `src/lib/api.js` (apiFetch กลาง) แล้วให้ service ใหม่ใช้ร่วม (service เก่าค่อย refactor ทีหลัง)

#### Seed / Test Data
- [ ] `seed_roles.js`: buyer 1 คน, seller approved 1 ร้าน, seller pending 1 ร้าน, admin 1 คน, staff 1 คน
- [ ] เอกสารรหัสทดสอบใน README

**Definition of Done:** login buyer → profile คืน `BUYER`; login seller ที่มีร้าน APPROVED → คืน `SELLER` + shop; Header แสดงเมนูต่างกัน

---

### 🟩 Sprint 2 — Shop Onboarding + Admin อนุมัติ (ขั้นต่ำ) · ~3 วัน

**เป้าหมาย:** ผู้ซื้อสมัครเปิดร้านได้จริง และแอดมินอนุมัติได้จริง

#### Backend — โมดูล `shop`
สร้าง `src/modules/shop/` ตาม pattern เดิม (`*.route.js` + `*.controller.js`)
- [ ] `POST /api/shops/apply` — `requireCustomer`
  - 1 user มีได้ 1 ร้าน (ถ้ามีแล้ว → 409)
  - validate: `name` 3-80, `slug` `^[a-z0-9-]{3,50}$` และไม่ซ้ำ, `taxId` 13 หลัก, `bankAccountNumber` 10-15 หลัก, `bankName`, `bankAccountName`
  - รับ `logoUrl`, `bannerUrl`, `idCardUrl` ที่อัปโหลดมาก่อนแล้ว
  - สร้าง `Shop.status = "PENDING"`
- [ ] `GET /api/shops/my-shop` — `requireCustomer` (คืน `null` ถ้ายังไม่มี)
- [ ] `PUT /api/shops/my-shop` — `requireSeller`
  - แก้ได้เฉพาะ name/slug/description/logo/banner/bank/taxId
  - **ห้ามแก้ `status`, `balance`, `ownerId`**
  - ถ้าเคย `REJECTED` และกดส่งใหม่ → reset เป็น `PENDING` + ล้าง `rejectionReason`
- [ ] `GET /api/shops/:slug` — public
  - แสดงเฉพาะร้าน `APPROVED`
  - แนบ products ที่ยังไม่ลบ + ยังขายอยู่
- [ ] Admin (ขั้นต่ำ)
  - `GET /api/admin/shops?status=PENDING` — `requireEmployee` (staff อ่านได้)
  - `PUT /api/admin/shops/:id/approve` — `requireAdmin`
  - `PUT /api/admin/shops/:id/reject` body `{ reason }` — `requireAdmin`
  - เมื่อ approve → อัปเดต `User.role = "SELLER"` ด้วย (เพื่อ backward compatibility)
- [ ] แก้ `upload.route.js`
  - `POST /api/upload` → `requireAuth`
  - ถ้าเป็น seller: บังคับ folder เป็น `shops/{shopId}` หรือ `products/{shopId}` (รับจาก query แต่ sanitize + ตรวจสิทธิ์)
  - ถ้าเป็น employee: ใช้ folder ได้ตามเดิม
  - `DELETE /api/upload` → ต้องเป็นเจ้าของไฟล์ (ตรวจ prefix path) หรือ admin
- [ ] เพิ่ม `shopRouter` ใน `app.js`

#### Frontend — ฝั่งผู้ขาย
- [ ] `src/app/become-seller/page.jsx`
  - 3 สถานะ: ยังไม่มีร้าน (ฟอร์ม) / PENDING (สถานะ + วันที่สมัคร) / REJECTED (เหตุผล + ปุ่มแก้ไขส่งใหม่)
  - อัปโหลดโลโก้ + แบนเนอร์ + รูปบัตรประชาชน ผ่าน `/api/upload`
  - preview รูป, validate ฝั่ง client
- [ ] `src/services/shop.service.js`
- [ ] `src/app/seller/layout.jsx` + `SellerSidebar`
  - guard ด้วย `RequireRole role="SELLER"` (หรือมีร้านแต่ PENDING → แสดงหน้าแจ้งสถานะ)
  - เมนู: Dashboard, สินค้า, ข้อมูลร้าน, (Orders/Wallet = เร็ว ๆ นี้)
- [ ] `src/app/seller/shop/page.jsx` — แก้ข้อมูลร้าน

#### Frontend — Backoffice (ขั้นต่ำ)
- [ ] เพิ่มเมนู "ร้านค้า" ใน `Sidebar.jsx`
- [ ] `src/app/dashboard/shops/page.jsx` — ตารางร้าน + ตัวกรอง status + ปุ่ม Approve/Reject (modal ใส่เหตุผล)
- [ ] เพิ่ม method ใน `bareandbold_backoffice/src/services/api.js`

**Definition of Done:** buyer สมัครร้าน → เห็น PENDING → admin approve → user กลายเป็น SELLER → เข้า `/seller` ได้

---

### 🟨 Sprint 3 — Seller Product Management · ~3-4 วัน

**เป้าหมาย:** seller ลงสินค้าของตัวเองได้ และสินค้าโผล่หน้าร้านพร้อมชื่อร้าน

#### Backend
- [ ] Refactor `product.controller.js`: แยก helper `parseProductInput`, `syncProductRelations` (images/customOptions/accessories) ให้ admin และ seller ใช้ร่วม
- [ ] `src/modules/seller/` (หรือ `seller-product`)
  - `GET /api/seller/products` — `requireSeller` (เห็นทุกสถานะของร้านตัวเอง)
  - `POST /api/seller/products` — `requireApprovedSeller` → บังคับ `shopId = currentShop.id`
  - `PUT /api/seller/products/:id` — `requireApprovedSeller` + ตรวจ `product.shopId === currentShop.id` (ไม่ใช่ → 404/403)
  - `DELETE /api/seller/products/:id` — soft delete + ตรวจเจ้าของ
  - `PATCH /api/seller/products/:id/status` — เปิด/ปิดขาย (เพิ่ม field `isActive` ใน schema)
- [ ] เพิ่ม `isActive Boolean @default(true)` ใน `Product` + migrate
- [ ] Public catalog
  - `GET /api/products`: `isDeleted=false`, `isActive=true`, และ `(shopId = null OR shop.status = APPROVED)` (รองรับสินค้า legacy ของ platform)
  - `GET /api/products/:id`: include `shop { id, name, slug, logoUrl }`
  - `GET /api/shops/:slug`: ตาม Sprint 2
- [ ] หน้า product detail/การ์ดฝั่ง buyer แสดงชื่อร้าน + ลิงก์ `/shop/[slug]` (ถ้ามี shop)

#### Frontend — Seller Center
- [ ] `src/app/seller/products/page.jsx`
  - ตาราง: รูป, ชื่อ, หมวด, ประเภท, ราคา, สต็อก, สถานะขาย, ปุ่มแก้ไข/ลบ
  - ตัวกรอง: คำค้น, หมวด, ประเภท, สถานะ
- [ ] `src/app/seller/products/new/page.jsx`
- [ ] `src/app/seller/products/[id]/edit/page.jsx`
- [ ] `src/components/seller/product-form/` — port จาก backoffice
  - `ProductInfoSection`, `ImageUploadSection`, `ImageCropperModal`, `CustomOptionsSection`, `AccessoriesSection`
  - เปลี่ยน service ให้ยิง `/api/seller/products` และ upload ลง folder ร้าน
- [ ] หน้า `/shop/[slug]` ฝั่ง buyer (ถ้ายังไม่มี) — header ร้าน + grid สินค้า

**Definition of Done:** seller สร้างสินค้า 2 แบบ (พร้อมส่ง/สั่งทำ) ได้, รูปขึ้น R2, สินค้าแสดงบน `/products` พร้อมชื่อร้าน, seller คนอื่นแก้ไม่ได้

---

### 🟪 Sprint 4 — Seller Dashboard + หน้าโครง (Placeholder ที่ซื่อสัตย์) · ~1-2 วัน

- [ ] `GET /api/seller/dashboard` — คืน `{ productCount, activeProductCount, lowStockCount, shopStatus }`
- [ ] `/seller/dashboard`
  - KPI cards ตามข้อมูลจริง (สินค้าทั้งหมด, เปิดขาย, สต็อกต่ำ, สถานะร้าน)
  - ไม่มีกราฟยอดขาย/ออเดอร์ เพราะยังไม่มี SubOrder — แสดง empty state "จะเปิดใช้หลังระบบ Split Order"
- [ ] `/seller/orders` — หน้า empty state อธิบายว่ารอ Phase 4 (หรือซ่อนเมนูไปก่อน)
- [ ] `/seller/wallet` — แสดง `Shop.balance` + `ShopTransaction` (จะว่างจนกว่าจะมี escrow) + ปุ่ม payout ที่ยัง disabled
- [ ] อัปเดต `PROJECT_TASKS.md` ติ๊กงานที่เสร็จ

**Definition of Done:** seller เห็น dashboard ที่ไม่โกหกข้อมูล, เมนูที่ยังไม่พร้อมถูกอธิบายชัดเจน

---

### 🟥 Sprint 5 — Hardening & QA · ~1-2 วัน

- [ ] Test matrix (manual หรือ script):
  - Buyer ยิง `/api/seller/products` → 403
  - Seller PENDING ยิงสร้างสินค้า → 403
  - Seller A แก้สินค้า Seller B → 403/404
  - Seller อัปโหลดเข้า folder ร้านอื่น → 403
  - Admin/staff ยังจัดการสินค้า platform ได้
  - User ที่ไม่มีร้านเรียก `/api/shops/my-shop` → `{ shop: null }`
- [ ] จำกัด CORS เป็น origin ของ front + backoffice (`env: FRONTEND_URL`, `BACKOFFICE_URL`)
- [ ] ตรวจ cookie options สำหรับ localhost (`secure`/`sameSite`) หรือเอกสารกำกับ
- [ ] (แนะนำแต่ไม่บล็อก) ย้าย token ไป httpOnly cookie + Next.js proxy route เพื่อลด XSS
- [ ] อัปเดตเอกสาร API ใน `plan.md` / `system_documentation.txt`

---

## 4. API Contract สรุป

### Public
| Method | Endpoint | หมายเหตุ |
|---|---|---|
| GET | `/api/products` | เฉพาะร้าน APPROVED + สินค้า active |
| GET | `/api/products/:id` | include shop |
| GET | `/api/shops/:slug` | ร้าน APPROVED + สินค้า |

### Buyer
| Method | Endpoint | Guard |
|---|---|---|
| GET | `/api/auth/profile` | login |
| POST | `/api/shops/apply` | `requireCustomer` |
| GET | `/api/shops/my-shop` | `requireCustomer` |

### Seller
| Method | Endpoint | Guard |
|---|---|---|
| PUT | `/api/shops/my-shop` | `requireSeller` |
| GET | `/api/seller/products` | `requireSeller` |
| POST | `/api/seller/products` | `requireApprovedSeller` |
| PUT | `/api/seller/products/:id` | `requireApprovedSeller` + owner |
| DELETE | `/api/seller/products/:id` | `requireApprovedSeller` + owner |
| PATCH | `/api/seller/products/:id/status` | `requireApprovedSeller` + owner |
| GET | `/api/seller/dashboard` | `requireSeller` |

### Admin (ขั้นต่ำ)
| Method | Endpoint | Guard |
|---|---|---|
| GET | `/api/admin/shops` | `requireEmployee` |
| PUT | `/api/admin/shops/:id/approve` | `requireAdmin` |
| PUT | `/api/admin/shops/:id/reject` | `requireAdmin` |

---

## 5. ไฟล์ที่ต้องสร้าง / แก้ไข

### Backend
```
src/modules/auth/auth.controller.js              [แก้]
src/middleware/auth.middleware.js                [แก้]
src/modules/shop/shop.route.js                   [ใหม่]
src/modules/shop/shop.controller.js              [ใหม่]
src/modules/seller/product.route.js              [ใหม่]
src/modules/seller/product.controller.js         [ใหม่]
src/modules/seller/dashboard.controller.js       [ใหม่]
src/modules/product/product.controller.js        [แก้/refactor]
src/modules/product/product.route.js             [แก้]
src/modules/upload/upload.route.js               [แก้]
src/modules/upload/upload.controller.js          [แก้ folder logic]
src/app.js                                       [แก้ router]
prisma/schema/product.prisma                     [เพิ่ม isActive]
prisma/migrations/...                            [migrate]
seed_roles.js                                    [ใหม่]
```

### Frontend (storefront + seller)
```
src/context/AuthContext.jsx                      [ใหม่]
src/lib/api.js                                   [ใหม่]
src/components/auth/RequireRole.jsx              [ใหม่]
src/components/layout/Header.jsx                 [แก้]
src/app/layout.jsx                               [แก้ wrap provider]
src/app/become-seller/page.jsx                   [ใหม่]
src/app/seller/layout.jsx                        [ใหม่]
src/app/seller/page.jsx                          [ใหม่ redirect]
src/app/seller/dashboard/page.jsx                [ใหม่]
src/app/seller/products/page.jsx                 [ใหม่]
src/app/seller/products/new/page.jsx             [ใหม่]
src/app/seller/products/[id]/edit/page.jsx       [ใหม่]
src/app/seller/shop/page.jsx                     [ใหม่]
src/app/seller/orders/page.jsx                   [ใหม่ - empty state]
src/app/seller/wallet/page.jsx                   [ใหม่ - empty state]
src/components/seller/SellerSidebar.jsx          [ใหม่]
src/components/seller/product-form/*             [ใหม่ - port จาก backoffice]
src/services/shop.service.js                     [ใหม่]
src/services/seller.service.js                   [ใหม่]
```

### Backoffice (ขั้นต่ำ)
```
src/components/Sidebar.jsx                       [แก้]
src/app/dashboard/shops/page.jsx                 [ใหม่]
src/services/api.js                              [แก้]
```

---

## 6. Dependency / สิ่งที่ยังทำไม่ได้ในรอบนี้

```
Sprint 1 (Role)
   └─> Sprint 2 (Onboarding + Admin approve)
          └─> Sprint 3 (Seller products)  ✅ จบ scope "ฝั่ง seller" รอบแรก
                 └─> Sprint 4 (Dashboard + placeholder)

Seller Orders / Wallet จริง
   └─> ต้องรอ Phase 4: Split Order (Order → SubOrder ตามร้าน)
          └─> ต้องรอ Phase 4.3-4.4: Omise + Escrow
                 └─> ต้องรอ Phase 5: Fulfillment / Confirm Received
```

**ถ้าต้องการให้ seller เห็นออเดอร์ได้ในรอบนี้** ต้องดึงงาน Split Order ขึ้นมาทำก่อน (เพิ่ม ~4-6 วัน) — ยังไม่แนะนำ เพราะจะกระทบ checkout/payment ที่มีอยู่

---

## 7. Risks & ข้อควรระวัง

| ความเสี่ยง | แนวทางลด |
|---|---|
| JWT อายุ 24 ชม. ทำให้ role หลังอนุมัติไม่เปลี่ยนทันที | profile อ่าน DB ทุกครั้ง + frontend เรียก `refresh()` หลังกลับจากหน้า admin/รีเฟรช |
| สินค้า legacy `shopId = null` ปนกับสินค้า seller | อนุญาตทั้งสองแบบชั่วคราว + แสดงชื่อร้านเฉพาะที่มี shop |
| Upload folder ถูก manipulate | server บังคับ prefix ตาม role ไม่รับ folder ดิบจาก client |
| Seller เห็นข้อมูลร้านคนอื่น | ทุก query ใช้ `where: { shopId: currentShop.id }` ไม่รับ shopId จาก body |
| Atomic ตอน approve ร้าน | ใช้ `prisma.$transaction` อัปเดต Shop + User.role พร้อมกัน |
| Frontend guard อย่างเดียวไม่ปลอดภัย | backend guard ทุก endpoint เป็นด่านจริง (frontend แค่UX) |

---

## 8. Demo Flow ที่ต้องผ่านเมื่อจบรอบนี้

1. Buyer login → Header แสดง "สมัครเปิดร้าน"
2. กรอกฟอร์ม + อัปโหลดเอกสาร → เห็นสถานะ "รออนุมัติ"
3. Admin login backoffice → เห็นร้าน PENDING → กด Approve
4. Buyer refresh → Header เปลี่ยนเป็น "Seller Center"
5. Seller สร้างสินค้า "กำไลข้อมือหินโรสควอตซ์" แบบ Made-to-Order 7 วัน + รูป 3 รูป
6. เปิด `/products` → เห็นสินค้า + ชื่อร้าน + badge "สั่งทำ 7 วัน"
7. Seller B พยายามแก้สินค้า Seller A ผ่าน API → 403
8. Seller ที่ยัง PENDING พยายามสร้างสินค้า → 403

---

## 9. ประมาณการ

| Sprint | เนื้อหา | ระยะเวลา |
|---|---|---|
| 1 | Role foundation | 2-3 วัน |
| 2 | Shop onboarding + admin approve | 3 วัน |
| 3 | Seller products + public catalog | 3-4 วัน |
| 4 | Dashboard + placeholder | 1-2 วัน |
| 5 | Hardening + QA | 1-2 วัน |
| **รวม** | | **~10-14 วัน** (คนเดียว) |

> ถ้าทำขนานได้ (backend / frontend / backoffice) จะเหลือ ~6-8 วัน
