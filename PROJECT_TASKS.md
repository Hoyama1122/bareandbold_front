# 📋 PROJECT_TASKS — Bare & Bold Marketplace

> อัปเดตล่าสุด: **10 พ.ย. 2026**
> ทีม 4 คน · เป้าหมายเทอมนี้: ปิด core flow + Seller Center + Admin approval ให้ครบ

---

## 0. อ่านตรงนี้ก่อน (30 วินาที)

| ส่วน | สถานะ | หมายเหตุ |
|---|---|---|
| Backend API (auth, shop, seller, admin) | ✅ พร้อมใช้ | มี test ผ่าน 52/52 |
| Storefront (buyer) | ✅ พร้อมใช้ | `/`, `/products`, `/shop/[slug]`, `/cart`, `/checkout`, `/orders` |
| สมัครเปิดร้าน + Admin อนุมัติ | ✅ พร้อมใช้ | `/become-seller` + Backoffice `/dashboard/shops` |
| **Seller Center UI** | 🟡 **มี layout/guard แล้ว แต่ยังไม่มีหน้าใช้งาน** | **งานหลักของเพื่อน → ดูข้อ 2** |
| Split Order + Escrow + Wallet | ❌ ยังไม่ทำ | ต้องทำก่อน Seller Orders/Wallet จริง |
| Reviews / Refund / Horoscope | ❌ ยังไม่ทำ | อยู่ใน Phase 3.5, 5, 9 |

**สรุปสั้น:** เพื่อนสามารถเริ่มทำ Seller Center ได้ทันที เพราะ layout/guard/API พร้อมแล้ว — เหลือสร้างหน้า dashboard, products, shop, orders, wallet

---

## 1. สถานะงานตอนนี้ (Done / Doing / Todo)

### ✅ ทำเสร็จแล้ว

- Role Buyer / Seller / Admin + middleware ตรวจสิทธิ์จาก DB
- Login/Profile คืน `role`, `shop`, `accountType`
- สมัครเปิดร้าน + สถานะ PENDING / REJECTED / APPROVED
- Admin อนุมัติ/ปฏิเสธร้าน + staff เห็น KYC แบบ mask
- Backend Seller API: dashboard, products CRUD, เปิด-ปิดขาย
- Upload รูป seller + บังคับ folder ตามร้าน + ตรวจเจ้าของไฟล์
- Public catalog แสดงเฉพาะร้าน APPROVED + แนบข้อมูลร้าน
- รีวิวดาว 5 ดวงบน Product Card (ทอง/เทา)
- แยก layout Storefront / Seller Center ด้วย route groups
- k6: smoke 18/18, public load ผ่าน, auth load ผ่าน

### 🟡 กำลังทำ / พร้อมให้ทำต่อ

- Seller Center UI (layout + guard + placeholder page มีแล้ว)
- Backoffice อนุมัติร้าน (มีแล้ว)
- Storefront filter ราคา/ขนาด + sort (ยังไม่มี)

### ❌ ยังไม่ได้ทำ

- Split Order (checkout → SubOrder)
- Escrow + Confirm Received + Wallet
- Reviews & Ratings
- Refund / Dispute
- Admin Payout / Moderation / Analytics
- Horoscope / Gemstone
- E2E เต็มระบบ + Deploy

---

## 2. งานของเพื่อน: Seller Center (ทำต่อจากนี้)

### 2.1 โครงที่มีอยู่แล้ว

```
bareandbold_front/src/app/
├── (storefront)/              # Buyer: มี Header + Footer
│   ├── page.jsx
│   ├── products/
│   ├── shop/[slug]/
│   ├── cart/  checkout/  orders/
│   ├── become-seller/  login/
│   └── layout.jsx
└── (seller)/
    └── seller/
        ├── layout.jsx         # ✅ guard + topbar + ไม่มี Header/Footer ร้าน
        └── page.jsx           # ✅ placeholder
```

> **เพิ่มหน้าใหม่ที่ไหน?** ใส่ใต้ `src/app/(seller)/seller/...` แล้ว layout/guard จะทำงานอัตโนมัติ

### 2.2 หน้าที่ต้องทำ

| หน้า | Path ที่ต้องสร้าง | API ที่ใช้ | เสร็จเมื่อ |
|---|---|---|---|
| Dashboard | `seller/dashboard/page.jsx` | `GET /api/seller/dashboard` | แสดง KPI 4 ใบ + loading/empty/error |
| Products list | `seller/products/page.jsx` | `GET /api/seller/products` | ตารางสินค้า + ค้นหา/กรอง + เปิด-ปิดขาย + ลบ |
| Product create | `seller/products/new/page.jsx` | `POST /api/seller/products` | สร้างได้ + อัปโหลดรูป + validation |
| Product edit | `seller/products/[id]/edit/page.jsx` | `GET/PUT /api/seller/products/:id` | โหลดค่าเดิม + บันทึกได้ |
| Shop settings | `seller/shop/page.jsx` | `GET/PUT /api/shops/my-shop` | แก้ชื่อ/โลโก้/แบนเนอร์/บัญชีได้ |
| Orders | `seller/orders/page.jsx` | ยังไม่มี API | แสดง empty state “รอ Split Order” |
| Wallet | `seller/wallet/page.jsx` | ยังไม่มี API | แสดง `shop.balance` + empty state |

### 2.3 API ที่พร้อมใช้แล้ว

**Auth**
```http
GET /api/auth/profile
Authorization: Bearer <token>
```
คืน `{ success, accountType, role, user, shop }`

**Seller**
```http
GET   /api/seller/dashboard
GET   /api/seller/products?search=&category=&type=&status=ACTIVE
GET   /api/seller/products/:id
POST  /api/seller/products
PUT   /api/seller/products/:id
DELETE /api/seller/products/:id
PATCH /api/seller/products/:id/status   body: { isActive: true|false }
```

**Shop**
```http
GET /api/shops/my-shop
PUT /api/shops/my-shop
```

**Upload**
```http
POST /api/upload?folder=products
Content-Type: multipart/form-data
field: files (หรือ images)
→ { success, urls: ["https://..."] }
```

**Product body ตัวอย่าง**
```json
{
  "name": "กำไลข้อมือหินโรสควอตซ์",
  "description": "รายละเอียดสินค้า",
  "price": 890,
  "originalPrice": 1290,
  "type": "READY_TO_SHIP",
  "category": "BRACELET",
  "stock": 10,
  "leadTimeDays": 0,
  "wristSizeMin": 14,
  "wristSizeMax": 18,
  "isActive": true,
  "images": ["https://.../1.webp", "https://.../2.webp"],
  "customOptions": [
    {
      "name": "ขนาดข้อมือ",
      "required": true,
      "values": [{ "name": "15 cm", "priceAdjustment": 0 }]
    }
  ],
  "accessories": ["accessory-id-1"]
}
```

### 2.4 กติกาที่ต้องรู้

- **Seller ต้องมีร้าน APPROVED** จึงจะสร้าง/แก้/ลบสินค้าได้ (backend บังคับแล้ว)
- **ห้ามส่ง `shopId` จาก client** — backend ผูกจาก session ให้เอง
- **แก้ได้เฉพาะสินค้าของร้านตัวเอง** — ถ้าแก้ของร้านอื่นจะได้ 404
- **Upload** ต้อง login และมีร้าน; backend บังคับ folder เป็น `products/{shopId}` ให้
- **AuthContext** ใช้ `useAuth()` จาก `@/context/AuthContext`
  - `{ user, role, shop, loading, refresh }`
  - `role === "SELLER"` และ `shop.status === "APPROVED"`
- **Layout guard มีให้แล้ว** — ไม่ต้องเขียน redirect เองในทุกหน้า
- UI ใช้ Tailwind + โทนสีเดิม (`earth-*`) และต้องมี loading / empty / error state

### 2.5 ห้ามแตะ / ต้องประสาน

- `src/app/(storefront)/*` — ฝั่ง buyer
- `src/app/layout.jsx` — root layout
- `src/context/AuthContext.jsx` — ใช้ร่วมทั้งระบบ
- `bareandbold_backend/*` — ถ้าต้องเพิ่ม API ให้แจ้ง Role 4
- ถ้าต้องเพิ่ม field ใน Product หรือเปลี่ยน response → คุย contract กับ Role 4 ก่อน

---

## 3. งานที่เหลือของแต่ละ Role (แบบสั้น)

| Role | เหลือทำ |
|---|---|
| 🔵 Role 1 — Storefront | Filter ราคา/ขนาด, Sort, Shop card ใน product detail, Reviews UI, Wishlist, Horoscope |
| 🟢 Role 2 — Buyer flow | Cart group by shop, Checkout แยกตามร้าน, Timeline, Confirm Received, Review modal, Refund, Admin Refund UI |
| 🟠 Role 3 — Seller/Admin | Seller Center UI, Seller Orders, Seller Wallet, Admin Payout/Moderation/Analytics |
| 🟣 Role 4 — Backend | Split Order, Escrow, Wallet/Payout API, Reviews API, Refund API, Auto-complete, Deploy |

---

## 4. Phase Summary

| Phase | สถานะ |
|---|---|
| 1. Database Schema | ✅ เสร็จ |
| 2. Auth & Seller Onboarding | ✅ เสร็จ |
| 3. Catalog & Shop | 🟡 บางส่วน (ขาด filter ขั้นสูง/reviews) |
| 3.5 Horoscope | ❌ ยังไม่เริ่ม |
| 4. Cart / Split Order / Escrow | ❌ ยังไม่เริ่ม (Omise PromptPay มีแล้ว) |
| 5. Fulfillment & Tracking | ❌ ยังไม่เริ่ม |
| 6. Seller Center & Wallet | 🟡 มี layout/API, UI ยังไม่ทำ |
| 7. Admin Backoffice | 🟡 อนุมัติร้านเสร็จ, ที่เหลือยังไม่ทำ |
| 8. Testing & Deploy | 🟡 role/seller flow tested, E2E/Deploy ยังไม่ทำ |
| 9. Extended Scope | ❌ ยังไม่เริ่ม |

---

## 5. แผน 4 สัปดาห์ (ทำขนานกัน)

| สัปดาห์ | Role 1 | Role 2 | Role 3 | Role 4 |
|---|---|---|---|---|
| 1 | Filter + Sort | Cart group by shop | Seller Center: dashboard + products | Split Order |
| 2 | Shop card + Reviews UI | Checkout + Timeline | Product form + shop settings | Escrow + Confirm |
| 3 | Wishlist + Gemstone | Review + Refund UI | Orders + Wallet + Admin pages | Wallet + Reviews API |
| 4 | Responsive | E2E Buyer | E2E Seller/Admin | Refund + Deploy |

> Feature Freeze สัปดาห์ที่ 3 · สัปดาห์ที่ 4 เน้น integration / bug fix / UAT / demo

---

## 6. รันโปรเจกต์ & บัญชีทดสอบ

```bash
# Backend :8000
cd bareandbold_backend && bun run src/app.js

# Storefront :3000
cd bareandbold_front && bun run dev

# Backoffice :3001
cd bareandbold_backoffice && bun run dev
```

| Role | Email | Password |
|---|---|---|
| Buyer | `buyer@bareandbold.test` | `password` |
| Seller (APPROVED) | `seller@bareandbold.test` | `password` |
| Seller (PENDING) | `pending@bareandbold.test` | `password` |
| Admin | `admin@gmail.com` | `password` |
| Staff | `staff@gmail.com` | `password` |

---

## 7. ข้อจำกัดที่ต้องรู้

- **Seller Orders / Wallet จริงยังทำไม่ได้** — ต้องรอ Split Order + Escrow
- **Reviews / Refund** ยังไม่มี API
- **Token** ใช้ Bearer ใน localStorage (ยังไม่ใช่ httpOnly cookie)
- **Seller Center** เป็น scaffold — หน้า dashboard/products/orders/wallet ยังว่าง
- **Product detail** ยังไม่มีการ์ดร้าน และยังไม่มี reviews UI
- **Cart** ยังไม่จัดกลุ่มตามร้าน
