# 📋 PROJECT_TASKS — Bare & Bold Marketplace

> อัปเดตล่าสุด: **10 พ.ย. 2026**
> ทีม 4 คน · เป้าหมายเทอมนี้: ปิด core flow + Seller Center + Admin approval ให้ครบ

---

## 0. อ่านตรงนี้ก่อน (30 วินาที)

| ส่วน | สถานะ | หมายเหตุ |
|---|---|---|
| Backend API (auth, shop, seller, admin) | ✅ พร้อมใช้ | test ผ่าน 52/52 |
| Storefront (buyer) | ✅ พร้อมใช้ | `/`, `/products`, `/shop/[slug]`, `/cart`, `/checkout`, `/orders` |
| สมัครเปิดร้าน + Admin อนุมัติ | ✅ พร้อมใช้ | `/become-seller` + Backoffice `/dashboard/shops` |
| **Seller Center UI** | 🟡 **มี layout/guard แล้ว แต่ยังไม่มีหน้าใช้งาน** | **งานหลักของเพื่อน → ดูข้อ 2** |
| Split Order + Escrow + Wallet | ❌ ยังไม่ทำ | ต้องทำก่อน Seller Orders/Wallet จริง |
| Reviews / Refund / Horoscope | ❌ ยังไม่ทำ | อยู่ใน Phase 3.5, 5, 9 |

**สรุปสั้น:** เพื่อนเริ่มทำ Seller Center ได้ทันที เพราะ layout/guard/API พร้อมแล้ว — เหลือสร้างหน้า dashboard, products, shop, orders, wallet

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

## 3. รายละเอียดแต่ละฟังก์ชัน (Function Breakdown)

> อ่านแนวตั้ง: ฟังก์ชัน → คืออะไร → ทำแล้ว → เหลืออะไร → ใครทำ

### 3.1 Auth & Shop

| ฟังก์ชัน | คืออะไร | สถานะ | ทำแล้ว | เหลือทำ | เจ้าของ |
|---|---|---|---|---|---|
| Login / Role | เข้าสู่ระบบและแยกว่าคนนี้เป็น buyer/seller/admin | ✅ | JWT, AuthContext, middleware, profile | ย้าย token เป็น httpOnly cookie | R4 + R2 |
| Seller Onboarding | ผู้ซื้อสมัครเปิดร้าน + ส่ง KYC | ✅ | ฟอร์ม, apply, สถานะ PENDING/REJECTED/APPROVED | — | R3 + R4 |
| Admin Shop Approval | แอดมินตรวจและอนุมัติ/ปฏิเสธร้าน | ✅ | หน้า `/dashboard/shops`, API approve/reject, mask KYC สำหรับ staff | Audit log | R3 + R4 |
| Shop Settings | ร้านแก้ข้อมูลตัวเอง | ✅ API / ❌ UI | `GET/PUT /api/shops/my-shop` | หน้า `seller/shop/page.jsx` | R3 |

### 3.2 Storefront (Buyer)

| ฟังก์ชัน | คืออะไร | สถานะ | ทำแล้ว | เหลือทำ | เจ้าของ |
|---|---|---|---|---|---|
| Product Catalog | หน้ารวมสินค้า + ค้นหา + กรอง | 🟡 | ค้นหาชื่อ, กรองหมวด/ประเภท | กรองราคา/ขนาด, sort, ค้นหาชื่อร้าน | R1 |
| Product Detail | หน้ารายละเอียดสินค้า | 🟡 | แกลเลอรี, badge สั่งทำ, ตัวเลือกขนาด/accessories | การ์ดร้าน, reviews UI | R1 |
| Shop Profile | หน้าร้าน public | 🟡 | แบนเนอร์, โลโก้, grid สินค้า | คะแนนร้าน, ตัวกรองในร้าน | R1 |
| Wishlist | รายการสินค้าโปรด | 🟡 | dropdown + service | หน้า `/account/wishlist` | R1 |
| Reviews Display | แสดงรีวิวในหน้ารายละเอียด | ❌ | — | การ์ดสรุปดาว + คอมเมนต์ + รูป | R1 + R4 |
| Horoscope / Gemstone | ดูดวง + แนะนำหิน/สินค้า | ❌ | — | KB + API + หน้า UI | R1 (R4 review) |
| SEO / Accessibility | ทำเว็บให้ค้นเจอและใช้งานง่าย | ❌ | — | meta/OG, sitemap, alt text | R1 |

### 3.3 Seller Center

| ฟังก์ชัน | คืออะไร | สถานะ | ทำแล้ว | เหลือทำ | เจ้าของ |
|---|---|---|---|---|---|
| Seller Shell | โครง Seller Center + ตรวจสิทธิ์ | ✅ | layout, guard, topbar, placeholder | — | R3 |
| Seller Dashboard | สรุปยอด/สินค้า/เงิน | 🟡 API ✅ / UI ❌ | `GET /api/seller/dashboard` | หน้า dashboard + KPI + กราฟ | R3 |
| Seller Products | จัดการสินค้าของร้าน | 🟡 API ✅ / UI ❌ | CRUD + เปิด-ปิดขาย + upload | หน้า list/new/edit | R3 |
| Seller Orders | ดูออเดอร์ของร้าน + อัปเดตสถานะ | ❌ | — | รอ Split Order ก่อน | R3 + R4 |
| Seller Wallet | ยอดเงิน + ถอนเงิน | ❌ | — | API wallet/payout + UI | R3 + R4 |

### 3.4 Buyer Transaction

| ฟังก์ชัน | คืออะไร | สถานะ | ทำแล้ว | เหลือทำ | เจ้าของ |
|---|---|---|---|---|---|
| Cart | ตะกร้าสินค้า | 🟡 | เพิ่ม/ลด/ลบ, ค่าส่ง, promo | จัดกลุ่มตามร้าน + checkbox + ค่าส่งแยกร้าน | R2 |
| Checkout | กรอกที่อยู่ + สรุป + จ่ายเงิน | 🟡 | ที่อยู่, PromptPay QR | สรุปแยกตามร้าน, บัตรเครดิต | R2 |
| Payment / Omise | ตัดเงิน + webhook | 🟡 | charge + webhook + mock | Escrow, SubOrder PAID | R4 |
| Orders / Tracking | ประวัติ + สถานะพัสดุ | 🟡 | แท็บสถานะ, QR modal | Timeline ตรง SubOrder | R2 |
| Confirm Received | ลูกค้ายืนยันรับของ | ❌ | — | ปุ่ม + API ปลดเงิน | R2 UI + R4 API |
| Reviews | ให้ดาว/คอมเมนต์/รูป | ❌ | — | API + modal/หน้า review | R4 + R2 |
| Refund / Dispute | ขอคืนเงิน/แจ้งปัญหา | ❌ | — | ฟอร์ม buyer + หน้า admin | R2 UI + R4 API |

### 3.5 Admin Backoffice

| ฟังก์ชัน | คืออะไร | สถานะ | ทำแล้ว | เหลือทำ | เจ้าของ |
|---|---|---|---|---|---|
| Shop Approval | อนุมัติร้าน | ✅ | หน้า + API | — | R3 + R4 |
| Payout Approval | อนุมัติการถอนเงิน | ❌ | — | API + หน้า `/dashboard/payouts` | R3 + R4 |
| Product Moderation | ซ่อน/ระงับสินค้า | ❌ | — | API + หน้า moderation | R3 + R4 |
| Refund Management | ตรวจคำขอคืนเงิน | ❌ | — | API + หน้า `/dashboard/refunds` | R2 + R4 |
| Platform Analytics | GMV + commission | ❌ | — | API + หน้า dashboard | R3 + R4 |
| Platform Settings | ตั้ง GP/ค่าส่ง/ฟรีส่ง | ❌ | — | API + หน้า settings | R3 + R4 |
| Audit Log | ประวัติการอนุมัติ/แก้ไข | ❌ | — | model + API + หน้า | R3 + R4 |

### 3.6 Extended (ยังไม่เริ่ม)

| ฟังก์ชัน | คืออะไร | เจ้าของ |
|---|---|---|
| Coupon | โค้ดส่วนลด/แคมเปญ | R2 UI + R4 API |
| Invoice | ใบเสร็จ/PDF | R2 UI + R4 API |
| Notification | แจ้งเตือน in-app/email | R4 + R1/R3 |
| Seller Reply Reviews | ร้านตอบรีวิว | R3 + R4 |
| Loyalty Points | สะสมแต้ม | R2 + R4 |
| CI/CD | auto deploy | R4 + R3 |

---

## 4. รายละเอียดงานตาม Role

### 🔵 Role 1 — Storefront & Catalog

**หน้าที่:** หน้าเว็บฝั่งผู้ซื้อ การค้นหา/กรอง หน้าร้าน public และระบบดูดวง

**เสร็จแล้ว**
- หน้า `/products` + ค้นหาชื่อ + กรองหมวด/ประเภท
- หน้า `/products/[id]` + แกลเลอรี + badge สั่งทำ + ตัวเลือกขนาด/accessories
- หน้า `/shop/[slug]` + แบนเนอร์/โลโก้/grid สินค้า
- ดาวรีวิว 5 ดวงบน Product Card

**เหลือทำ**

| งาน | ไฟล์/API | เสร็จเมื่อ |
|---|---|---|
| กรองราคา/ขนาด + sort | `ProductFilter.jsx`, `GET /api/products` | กรองได้จริง + reset ได้ |
| การ์ดร้านใน product detail | `ProductInfo.jsx`, `GET /api/products/:id` | มีชื่อร้าน/โลโก้ + ลิงก์ `/shop/[slug]` |
| Reviews UI | `GET /api/products/:id/reviews` | แสดงดาวเฉลี่ย + คอมเมนต์ + รูป |
| Wishlist page | `/account/wishlist`, `/api/wishlist` | เพิ่ม/ลบ/ย้ายไปตะกร้าได้ |
| Horoscope | `/gemstone-guide`, `POST /api/recommend/gemstones` | ฟอร์ม + ผลทำนาย + สินค้าที่ตรง |
| SEO/A11y | meta, sitemap, alt text | ผ่าน Lighthouse เบื้องต้น |

**Definition of Done:** มี loading/empty/error, ใช้ได้บนมือถือ, ไม่แตะ backend โดยไม่แจ้ง R4

---

### 🟢 Role 2 — Buyer Flow & Reviews

**หน้าที่:** ตะกร้า, checkout, ออเดอร์, รีวิว, คืนเงิน และหน้า admin refund

**เสร็จแล้ว**
- `/login` + Auth Modal + AuthContext
- `/cart` เพิ่ม/ลด/ลบ + ค่าส่ง + promo
- `/checkout` + ที่อยู่ + PromptPay QR
- `/orders` + แท็บสถานะ + QR modal
- `/profile` + สมุดที่อยู่

**เหลือทำ**

| งาน | ไฟล์/API | เสร็จเมื่อ |
|---|---|---|
| Cart group by shop | `cart/page.jsx` | จัดกลุ่มตามร้าน + checkbox + ค่าส่งแยก |
| Checkout split summary | `checkout/page.jsx` | สรุปแยกตามร้านก่อนจ่าย |
| Order timeline | `orders/page.jsx` | ตรงสถานะ SubOrder |
| Confirm received | `orders/[id]`, `POST /api/orders/:subOrderId/confirm-received` | กดแล้วสถานะเปลี่ยน + ปลดเงิน |
| Review modal | `/account/orders/[id]/review`, `POST /api/reviews` | ให้ดาว + คอมเมนต์ + รูป |
| Refund buyer | `/account/orders/[id]/refund`, `POST /api/refunds/request` | ส่งคำขอได้ |
| Admin refund UI | `backoffice /dashboard/refunds`, `GET/PUT /api/admin/refunds` | ดู/อนุมัติ/ปฏิเสธได้ |
| E2E buyer flow | — | ซื้อ→จ่าย→ติดตาม→รีวิว ผ่าน |

**Definition of Done:** เงิน/สถานะถูกต้อง, permission buyer เท่านั้น, มี error state

---

### 🟠 Role 3 — Seller Center & Admin

**หน้าที่:** หน้า Seller Center, งานร้านค้า และหน้า Admin

**เสร็จแล้ว**
- `/become-seller` + KYC + สถานะร้าน
- Backoffice `/dashboard/shops` อนุมัติ/ปฏิเสธร้าน
- Seller Center layout/guard/topbar + placeholder
- Backend Seller/Shop API พร้อมใช้

**เหลือทำ**

| งาน | ไฟล์/API | เสร็จเมื่อ |
|---|---|---|
| Seller Dashboard | `seller/dashboard/page.jsx`, `GET /api/seller/dashboard` | KPI 4 ใบ + loading/error |
| Seller Products list | `seller/products/page.jsx`, `GET /api/seller/products` | ตาราง + ค้นหา/กรอง + toggle + ลบ |
| Product create/edit | `seller/products/new`, `[id]/edit` | ฟอร์ม + รูป + custom options |
| Shop settings | `seller/shop/page.jsx`, `GET/PUT /api/shops/my-shop` | แก้ข้อมูลร้านได้ |
| Seller Orders | `seller/orders/page.jsx` | empty state ก่อน; ต่อ API หลัง Split Order |
| Seller Wallet | `seller/wallet/page.jsx` | แสดง balance + empty state |
| Admin Payout | `/dashboard/payouts` + API | อนุมัติ/แนบสลิป |
| Admin Moderation | `/dashboard/moderation` + API | ซ่อน/ระงับสินค้า |
| Admin Analytics | `/dashboard/analytics` + API | GMV + commission |
| Platform Settings | `/dashboard/settings/platform` + API | GP/ค่าส่ง/ฟรีส่ง |

**Definition of Done:** ใช้ API ที่มีอยู่, ไม่ส่ง `shopId` เอง, มี loading/empty/error, responsive

---

### 🟣 Role 4 — Backend & Database

**หน้าที่:** API, ฐานข้อมูล, เงิน, payment, deploy

**เสร็จแล้ว**
- Auth + role middleware
- Shop API + Seller Product API + Admin Approval API
- Upload + ตรวจเจ้าของไฟล์
- Public catalog + shop info
- Omise charge + webhook (mock fallback)

**เหลือทำ**

| งาน | Endpoint/ไฟล์ | เสร็จเมื่อ |
|---|---|---|
| Split Order | `POST /api/orders/checkout` | แตก SubOrder ตามร้าน |
| Escrow + Confirm | `POST /api/orders/:subOrderId/confirm-received` | ปลดเงิน + GP 5% + ShopTransaction |
| Seller ship/status | `/api/seller/orders/...` | เปลี่ยนสถานะ + tracking |
| Wallet/Payout API | `/api/seller/wallet`, `/api/seller/payouts/request` | ยอดคงเหลือ + คำขอถอน |
| Reviews API | `POST /api/reviews`, `GET /api/products/:id/reviews` | รีวิวได้ + อัปเดต rating |
| Refund API | `/api/refunds` | buyer ส่ง + admin อนุมัติ |
| Admin Payout/Moderation/Analytics | `/api/admin/...` | ใช้กับหน้า Backoffice |
| Platform Settings | `/api/admin/settings`, `/api/settings/public` | checkout/escrow ใช้ค่าได้ |
| Auto-complete | job/cron | 7 วันแล้วปิดออเดอร์ |
| Deploy | env + hosting | front/backoffice/backend ออนไลน์ |

**Definition of Done:** มี permission test ทุก endpoint, transaction เงินไม่พัง, docs อัปเดต

---

## 5. Dependencies — อะไรบล็อกอะไร

| งาน | ต้องรอ |
|---|---|
| Seller Orders | Split Order |
| Seller Wallet | Escrow + Payout API |
| Confirm Received | Split Order + Escrow |
| Admin Payout | Wallet/Payout API |
| Reviews | Order ที่ COMPLETED |
| Refund | Order/SubOrder ที่ชำระแล้ว |
| Platform Settings | checkout + escrow ต้องอ่านค่า |
| Admin Analytics | Split Order + Payment |

> งานที่ไม่บล็อกใครและเริ่มได้เลย: Seller Dashboard, Seller Products, Shop Settings, Storefront filter, Wishlist, Horoscope, SEO

---

## 6. Phase Summary

| Phase | สถานะ |
|---|---|
| 1. Database Schema | ✅ เสร็จ |
| 2. Auth & Seller Onboarding | ✅ เสร็จ |
| 3. Catalog & Shop | 🟡 บางส่วน |
| 3.5 Horoscope | ❌ ยังไม่เริ่ม |
| 4. Cart / Split Order / Escrow | ❌ ยังไม่เริ่ม |
| 5. Fulfillment & Tracking | ❌ ยังไม่เริ่ม |
| 6. Seller Center & Wallet | 🟡 มี layout/API, UI ยังไม่ทำ |
| 7. Admin Backoffice | 🟡 อนุมัติร้านเสร็จ |
| 8. Testing & Deploy | 🟡 role/seller flow tested |
| 9. Extended Scope | ❌ ยังไม่เริ่ม |

---

## 7. แผน 4 สัปดาห์

| สัปดาห์ | Role 1 | Role 2 | Role 3 | Role 4 |
|---|---|---|---|---|
| 1 | Filter + Sort | Cart group by shop | Seller dashboard + products | Split Order |
| 2 | Shop card + Reviews UI | Checkout + Timeline | Product form + shop settings | Escrow + Confirm |
| 3 | Wishlist + Gemstone | Review + Refund UI | Orders + Wallet + Admin pages | Wallet + Reviews API |
| 4 | Responsive | E2E Buyer | E2E Seller/Admin | Refund + Deploy |

> Feature Freeze สัปดาห์ที่ 3 · สัปดาห์ที่ 4 เน้น integration / bug fix / UAT / demo

---

## 8. รันโปรเจกต์ & บัญชีทดสอบ

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

## 9. ข้อจำกัดที่ต้องรู้

- **Seller Orders / Wallet จริงยังทำไม่ได้** — ต้องรอ Split Order + Escrow
- **Reviews / Refund** ยังไม่มี API
- **Token** ใช้ Bearer ใน localStorage (ยังไม่ใช่ httpOnly cookie)
- **Seller Center** เป็น scaffold — หน้า dashboard/products/orders/wallet ยังว่าง
- **Product detail** ยังไม่มีการ์ดร้าน และยังไม่มี reviews UI
- **Cart** ยังไม่จัดกลุ่มตามร้าน
