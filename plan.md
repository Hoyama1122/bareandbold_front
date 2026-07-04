# 📋 Bare & Bold — Project Plan & Team Task Division

> ระบบ e-commerce สร้อยข้อมือแบบ custom / ready-to-ship  
> Tech Stack: **Next.js** (Frontend + Backoffice) · **Hono + Bun** (Backend) · **PostgreSQL / Neon** (DB) · **Cloudflare R2** (Storage) · **Prisma ORM**

---

## 🏗️ Architecture Overview

```
bareandbold_front/      ← หน้าร้านค้า (ลูกค้า)       :3000
bareandbold_backoffice/ ← หลังบ้าน (Staff/Admin)     :3001
bareandbold_backend/    ← REST API (Hono/Bun)         :8000
```

---

## 📦 Database Models (Prisma Schema)

| Model | ความหมาย |
|---|---|
| `User` | ลูกค้า — สมัครสมาชิก / เข้าสู่ระบบ |
| `Employee` | พนักงาน — Staff / Admin |
| `Product` | สินค้า (สร้อยข้อมือ) |
| `ProductImage` | รูปสินค้า (position 0 = หน้าปก) |
| `CustomOption` | ตัวเลือกสินค้า custom เช่น "ขนาดข้อมือ" |
| `CustomOptionValue` | ค่าของตัวเลือก เช่น "15cm", "16cm" |
| `Category` | หมวดหมู่วัสดุ เช่น CHARM, BEAD, CORD |
| `Accessory` | วัสดุตกแต่ง (ชิ้นส่วนสร้อย) |
| `ProductAccessory` | many-to-many: สินค้า ↔ วัสดุที่ใช้ได้ |
| `Cart` / `CartItem` | ตะกร้าสินค้าของลูกค้า |
| `CartItemAccessory` | วัสดุที่เลือกในตะกร้า |
| `Order` / `OrderItem` | ออเดอร์ที่ซื้อแล้ว |
| `OrderItemAccessory` | วัสดุที่ซื้อพร้อมสินค้า (ราคา snapshot) |
| `Payment` | การชำระเงิน (รองรับ Omise) |
| `Shipping` | การจัดส่ง + tracking number |

---

## 🔌 Backend API Endpoints (สำเร็จแล้ว ✅)

### Auth
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/auth/register` | สมัครสมาชิก (ลูกค้า) |
| POST | `/api/auth/login` | เข้าสู่ระบบ (ลูกค้า) |
| POST | `/api/auth/logout` | ออกจากระบบ |
| GET | `/api/auth/profile` | ดึงข้อมูลโปรไฟล์ |
| POST | `/api/auth/backoffice/login` | เข้าสู่ระบบ (Employee) |
| POST | `/api/auth/backoffice/register` | สร้างบัญชีพนักงาน (Admin only) |

### Products
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/api/products` | ดึงสินค้าทั้งหมด (public) |
| GET | `/api/products/:id` | ดึงสินค้าตาม ID (public) |
| POST | `/api/products` | สร้างสินค้า (Employee) |
| PUT | `/api/products/:id` | แก้ไขสินค้า (Employee) |
| DELETE | `/api/products/:id` | ลบสินค้า (Employee) |

### Categories
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/api/categories` | ดึงหมวดหมู่ทั้งหมด (public) |
| GET | `/api/categories/:id` | ดึงหมวดหมู่ตาม ID |
| POST | `/api/categories` | สร้างหมวดหมู่ (Employee) |
| PUT | `/api/categories/:id` | แก้ไขหมวดหมู่ (Employee) |
| DELETE | `/api/categories/:id` | ลบหมวดหมู่ (Employee) |

### Accessories
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/api/accessories` | ดึงวัสดุทั้งหมด (public) |
| GET | `/api/accessories/:id` | ดึงวัสดุตาม ID |
| POST | `/api/accessories` | สร้างวัสดุ (Employee) |
| PUT | `/api/accessories/:id` | แก้ไขวัสดุ (Employee) |
| DELETE | `/api/accessories/:id` | ลบวัสดุ (Employee) |

### Upload
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/upload?folder=products` | อัปโหลดรูปภาพ → Cloudflare R2 |

### ⏳ ยังไม่มี (ต้องสร้าง)
- `GET/POST /api/cart` — ตะกร้าสินค้า
- `GET/POST /api/orders` — ออเดอร์
- `POST /api/payments/checkout` — ชำระเงิน (Omise)
- `PUT /api/shipping/:orderId` — อัปเดตการจัดส่ง

---

## 👥 Team Task Division (4 คน)

---

### 🔵 คนที่ 1 — Frontend: หน้าร้านค้า (Product & Homepage)

**รับผิดชอบ:** `bareandbold_front/`

#### งานที่ต้องทำ:
- [ ] เชื่อมต่อ **Homepage** (`/`) กับ API จริง — แสดงสินค้าจาก `/api/products`
- [ ] สร้างหน้า **รายการสินค้า** (`/products`) — grid + filter ตามประเภท
- [ ] สร้างหน้า **รายละเอียดสินค้า** (`/products/[id]`) — รูป gallery, ราคา, ปุ่มเพิ่มตะกร้า
- [ ] ทำ **Custom Builder** — ถ้าสินค้าเป็น MADE_TO_ORDER ให้เลือกวัสดุ + ขนาดข้อมือได้
- [ ] ทำให้ Product Card ดึงรูปจาก `images[0].url` เป็น cover

#### API ที่ใช้:
```
GET /api/products
GET /api/products/:id
GET /api/categories
GET /api/accessories
```

---

### 🟢 คนที่ 2 — Frontend: Auth, Cart & Checkout

**รับผิดชอบ:** `bareandbold_front/` (ส่วน auth + cart)

#### งานที่ต้องทำ:
- [ ] สร้างหน้า **Login / Register** (`/auth/login`, `/auth/register`) — เชื่อม API จริง
- [ ] ระบบ **ตะกร้าสินค้า** — เพิ่ม/ลด/ลบ สินค้า + เลือก accessory
- [ ] หน้า **Cart** (`/cart`) — สรุปรายการก่อนชำระ
- [ ] หน้า **Checkout** (`/checkout`) — กรอกที่อยู่ + เลือกวิธีชำระเงิน
- [ ] หน้า **Order History** (`/account/orders`) — ประวัติคำสั่งซื้อ

#### API ที่ใช้:
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
GET/POST /api/cart          ← ต้องสร้าง backend ด้วย
POST /api/orders            ← ต้องสร้าง backend ด้วย
POST /api/payments/checkout ← ต้องสร้าง backend ด้วย
```

---

### 🟡 คนที่ 3 — Backend: Cart, Order & Payment APIs

**รับผิดชอบ:** `bareandbold_backend/`

#### งานที่ต้องทำ:
- [ ] สร้าง **Cart API** — `GET/POST/PUT/DELETE /api/cart`
  - เพิ่มสินค้า + เลือก accessories ลงตะกร้า
  - ตะกร้าผูกกับ User (1 User = 1 Cart)
- [ ] สร้าง **Order API** — `POST /api/orders`
  - สร้างออเดอร์จาก Cart ปัจจุบัน
  - Snapshot ราคา ณ เวลาที่สั่ง
  - ล้าง Cart หลังสร้างออเดอร์
- [ ] สร้าง **Payment API** — `POST /api/payments/checkout`
  - เชื่อมต่อ Omise Payment Gateway
  - รองรับ Credit Card / PromptPay
  - อัปเดต `Payment.status` และ `Order.status`
- [ ] สร้าง **Order History API** — `GET /api/orders` (ของ user ตัวเอง)
- [ ] สร้าง **Admin Orders API** — `GET/PUT /api/admin/orders` (สำหรับ backoffice)

#### Models ที่ใช้:
```
Cart, CartItem, CartItemAccessory
Order, OrderItem, OrderItemAccessory
Payment, Shipping
```

---

### 🟠 คนที่ 4 — Backoffice: Orders, Customers & Accessories

**รับผิดชอบ:** `bareandbold_backoffice/`

#### งานที่ต้องทำ:
- [ ] **หน้าออเดอร์** (`/dashboard/orders`) — ดึงรายการออเดอร์ทั้งหมด, อัปเดตสถานะ, เพิ่ม tracking number
- [ ] **หน้าลูกค้า** (`/dashboard/customers`) — แสดงรายชื่อและข้อมูลลูกค้า
- [ ] **จัดการวัสดุ (Accessories)** ใน Settings — CRUD วัสดุตกแต่ง (ชื่อ, ราคา, หมวดหมู่, รูป)
- [ ] **เชื่อม Accessories กับสินค้า** — ใน ProductForm เพิ่ม multi-select วัสดุที่สินค้านี้ใช้ได้

#### API ที่ใช้:
```
GET /api/admin/orders       ← ต้องสร้างกับคนที่ 3
PUT /api/admin/orders/:id   ← อัปเดตสถานะ + tracking
GET /api/users              ← ดึงลูกค้า (Admin only)
GET/POST/PUT/DELETE /api/accessories
```

---

## ✅ สิ่งที่ทำสำเร็จแล้ว (Done)

### Backend ✅
- [x] Auth system (Customer + Employee) พร้อม JWT + HTTP-only cookie
- [x] Product CRUD API + image relations
- [x] Category CRUD API
- [x] Accessory CRUD API
- [x] Upload API → Cloudflare R2 (พร้อม folder prefix `products/`)
- [x] Prisma Schema ครบทุก model + sync กับ Neon PostgreSQL
- [x] Seed script สำหรับ Admin/Staff

### Backoffice ✅
- [x] Login page + Auth context
- [x] Dashboard overview (KPI cards)
- [x] Product list + สร้าง/แก้ไข/ลบสินค้า
- [x] ProductForm — cover image แยกจาก gallery, Ant Design dropdown, layout 2 column
- [x] Category management (Settings page)
- [x] Upload รูปภาพไปยัง R2 ตาม folder
- [x] Sidebar navigation + role-based menu (Admin/Staff)

### Frontend ✅
- [x] Homepage UI (Hero, Promo, Product cards, Footer)
- [x] Login / Register page (UI เสร็จ)
- [x] Header + language toggle

---

## 🔮 Priority Queue (ลำดับงาน)

```
Priority 1 (สำคัญที่สุด):
  → Backend: Cart API + Order API
  → Frontend: เชื่อม Product API จริงกับ Homepage

Priority 2:
  → Backend: Payment API (Omise)
  → Frontend: Cart + Checkout page

Priority 3:
  → Backoffice: Orders management + Accessories management
  → Frontend: Order history page

Priority 4 (Nice to have):
  → Custom product builder (MADE_TO_ORDER)
  → Accessory linking in ProductForm
  → Membership tiers
  → Promotion campaigns
```

---

## 🔑 Environment Variables ที่ต้องมี

### Backend (`.env`)
```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
NEXT_PUBLIC_R2_PUBLIC_URL=
OMISE_SECRET_KEY=       ← ต้องเพิ่ม
OMISE_PUBLIC_KEY=       ← ต้องเพิ่ม
```

### Frontend / Backoffice (`.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
