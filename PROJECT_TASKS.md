# 📋 PROJECT_TASKS — Bare & Bold Marketplace

> อัปเดตล่าสุด: **12 พ.ย. 2026**
> ทีม **4 คน** · เป้าหมาย: ปิด Marketplace flow, Seller Center, Admin Core และระบบคูปอง
> **Tester = Role 1** (บทบาทที่ 2 ของ Role 1) — ไม่มีคนที่ 5 (ดูข้อ 5)
> **หมายเหตุล่าสุด:** Admin Core, Split Order, Platform Settings, Payout API และ Seller Wallet API พร้อมใช้งานแล้ว · Seller Center UI และ Voucher/Coupon ยังเป็นงานหลักที่เหลือ

**สัญลักษณ์:** ✅ เสร็จแล้ว · 🟡 ทำบางส่วน/API พร้อมแต่ UI ยังไม่ทำ · ❌ ยังไม่เริ่ม

---

## 0. ทีม 4 คน — ใครทำอะไร (ภาพรวม)

| Role                | ตำแหน่ง                                                 | ดูแลอะไร                                                                                                        | โฟลเดอร์หลัก                                                  | สถานะรวม |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------- |
| 🔵 **Role 1** | Frontend Engineer (Storefront & Catalog) + **Tester/QA** + **เจ้าของ Coupon/Voucher Vertical** | หน้าร้านผู้ซื้อ, ค้นหา/กรอง, หน้าร้าน public, ดูดวง/หินมงคล, คูปองทั้งฝั่ง Buyer/Seller/Admin + test plan/UAT | `bareandbold_front/src/app/(storefront)/` + voucher APIs/schema ที่ได้รับมอบหมาย + `bareandbold_backend/k6/` | 🟡               |
| 🟢 **Role 2** | Frontend Engineer (Cart, Checkout & Orders)                    | ตะกร้า, ชำระเงิน, ประวัติออเดอร์, ยืนยันรับของ, รีวิว, คืนเงิน                      | `bareandbold_front/src/app/(storefront)/`                               | 🟡               |
| 🟠 **Role 3** | Fullstack Engineer (Seller Center & Admin)                     | เปิดร้าน, Seller Center, หลังบ้านแอดมิน                                                           | `bareandbold_front/src/app/(seller)/` + `bareandbold_backoffice/`     | 🟡               |
| 🟣 **Role 4** | Backend & Database Engineer                                    | API, ฐานข้อมูล, เงิน/Escrow, Payment, CI/CD, Deploy                                                               | `bareandbold_backend/`                                                  | 🟡               |

> **Tester ไม่ใช่คนที่ 5:** Role 1 รับบทบาท Tester/QA เพิ่มจากงาน Storefront (ดูข้อ 5)
> **ทุกคนยังต้องเขียน test case ของฟีเจอร์ตัวเอง** — Role 1 เป็นคนรวบรวม/regression/UAT

---

# 🔵 Role 1 — Frontend Engineer (Storefront & Catalog) + Tester/QA

## 1.1 ดูแลอะไร

หน้าเว็บที่ผู้ซื้อและผู้เยี่ยมชมเห็น ได้แก่ หน้าแรก หน้ารวมสินค้า หน้ารายละเอียดสินค้า หน้าร้านของผู้ขาย และระบบดูดวง/แนะนำหินมงคล
**เพิ่มเติม:** รับบทบาท **Tester/QA** ดูแล test plan, regression, UAT และประสาน API smoke/k6 กับ Role 4 (~1–2 วัน/สัปดาห์)

## 1.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน     | คืออะไร                                       | สถานะ | ทำแล้ว                                                               | เหลือทำ                                               | ไฟล์ / API                                                      |
| -------------------- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Product Catalog      | หน้ารวมสินค้า + ค้นหา + กรอง   | 🟡         | ค้นหาชื่อ, กรองหมวด/ประเภท                          | กรองราคา/ขนาด, sort, ค้นหาชื่อร้าน  | `products/page.jsx`, `ProductFilter.jsx`, `GET /api/products` |
| Product Detail       | หน้ารายละเอียดสินค้า             | 🟡         | แกลเลอรี, badge สั่งทำ, ตัวเลือกขนาด/accessories | การ์ดร้าน + ลิงก์ `/shop/[slug]`, reviews UI | `products/[id]/`, `GET /api/products/:id`                       |
| Shop Profile         | หน้าร้าน public ของผู้ขาย           | 🟡         | แบนเนอร์, โลโก้, grid สินค้า                            | คะแนนร้าน, ตัวกรองในร้าน               | `shop/[slug]/page.jsx`, `GET /api/shops/:slug`                  |
| Wishlist             | รายการสินค้าโปรด                     | 🟡         | dropdown + service                                                         | หน้า `/account/wishlist`                               | `wishlist.service.js`, `/api/wishlist`                          |
| Reviews Display      | แสดงรีวิวในหน้ารายละเอียด   | ❌         | —                                                                         | สรุปดาว + คอมเมนต์ + รูป                   | `GET /api/products/:id/reviews`                                   |
| Horoscope / Gemstone | แนะนำหิน/สินค้า + การ์ดเลือก | ❌         | —                                                                         | KB + API + หน้า UI                                       | `/gemstone-guide`, `POST /api/recommend/gemstones`              |
| review shop          | รีวิวรา้านค้าได้                     | ❌         |                                                                            |                                                              |                                                                     |
| **Coupon / Voucher** | คูปองแพลตฟอร์ม + คูปองร้าน, เก็บโค้ด, ใช้ที่ Cart/Checkout และหน้าจัดการ Seller/Admin | ❌         | —                                                                         | ทั้ง Vertical ตามข้อ 1.6                     | `/vouchers`, `/account/vouchers`, `/seller/vouchers`, `/dashboard/vouchers` |

## 1.3 งานที่ต้องส่ง

- ตัวกรองราคา/ขนาด + sort ใช้งานได้จริง
- การ์ดร้านในหน้ารายละเอียดสินค้า
- หน้า Wishlist เต็มรูปแบบ
- หน้า Horoscope + ผลทำนาย + สินค้าที่ตรง
- Reviews UI ในหน้ารายละเอียด
- **Coupon / Voucher Vertical:** Platform voucher, Shop voucher, Shipping voucher, เก็บโค้ด, My Vouchers, Cart/Checkout selector, Seller/Admin management (รายละเอียดข้อ 1.6)
- **งาน QA:** test plan, permission matrix, regression, UAT report (รายละเอียดข้อ 5)

## 1.4 Definition of Done

- มี loading / empty / error state
- ใช้งานได้บนมือถือและเดสก์ท็อป
- ไม่แก้ backend เองโดยไม่แจ้ง Role 4
- ข้อมูลร้าน/สินค้าตรงกับ API จริง

## 1.5 ต้องประสานกับ

- **Role 4** — API filter/reviews/gemstone, voucher schema/migration/เงิน และ test data/k6
- **Role 2** — voucher ใน Cart/Checkout, รีวิวที่แสดงต้องมาจากการซื้อจริง + E2E buyer
- **Role 3** — Seller/Admin voucher UI shell, E2E seller/admin
- **ทุกคน** — เก็บ bug และ retest

## 1.6 Coupon / Voucher Vertical — Role 1 เป็นเจ้าของ

> **สถานะ:** ❌ ยังไม่เริ่ม  
> **Scope:** Role 1 รับผิดชอบ End-to-End ทั้ง Buyer, Seller และ Admin ตามที่ได้รับมอบหมาย  
> **ต้องประสาน:** Role 2 (Cart/Checkout), Role 3 (Seller/Admin shell), Role 4 (Schema/Migration/GP/Settlement review)

### ประเภทคูปอง
- Platform Voucher — Admin สร้าง ใช้ทั่วแพลตฟอร์มหรือตามหมวด/ร้าน/สินค้า
- Shop Voucher — Seller สร้างเอง ใช้เฉพาะร้านตนเอง
- Shipping Voucher — ฟรีค่าส่งหรือลดค่าส่ง
- Public Collectible Voucher — แสดงให้เก็บโค้ด
- Private Code — ต้องกรอกโค้ดเอง
- Product/Category Voucher — จำกัดขอบเขตสินค้า/หมวด

### Buyer Functions
- `/vouchers` หน้ารวมคูปอง พร้อม tabs Platform / ร้านค้า / ค่าส่ง
- ปุ่ม `เก็บโค้ด`, สถานะเก็บแล้ว/หมด/หมดอายุ
- `/account/vouchers` กระเป๋าคูปอง: ใช้ได้ / ใช้แล้ว / หมดอายุ
- Voucher section ใน Shop Profile และ Product Detail
- Voucher selector ใน Cart และ Checkout
- Auto-select voucher ที่ให้ส่วนลดดีที่สุด
- แสดงส่วนลดแยก Platform / Shop / Shipping
- Snapshot ส่วนลดลง Order และ SubOrder

### Seller Functions
- `/seller/vouchers` รายการคูปองของร้าน
- สร้าง/แก้ไข/หยุดใช้งานคูปอง
- กำหนดจำนวนสิทธิ์รวมและต่อคน
- กำหนดวันเริ่ม/สิ้นสุด, ยอดขั้นต่ำ, เพดานส่วนลด
- เลือกขอบเขตทั้งร้าน/สินค้า/หมวด
- ดูสถิติการใช้และยอดขายจากคูปอง

### Admin Functions
- `/dashboard/vouchers` จัดการ Platform Voucher
- สร้าง/แก้ไข/ระงับคูปอง
- กำหนดงบประมาณและขอบเขต
- ดูคูปองของ Seller และระงับเมื่อผิดเงื่อนไข
- Audit Log ทุกการเปลี่ยนแปลง
- สถิติ: เก็บ/ใช้/มูลค่าส่วนลด/GMV จากคูปอง

### กฎสำคัญ
- Server เป็นผู้คำนวณส่วนลดจริง ห้ามเชื่อราคาจาก Client
- 1 Platform Voucher + 1 Shop Voucher ต่อร้าน + 1 Shipping Voucher
- Claim ซ้ำต้องไม่ได้: unique `(voucherId, userId)`
- ใช้เกิน quota ไม่ได้: atomic conditional update
- ใช้สิทธิ์เมื่อ Payment สำเร็จเท่านั้น
- `fundedBy` ต้องเป็น `PLATFORM` หรือ `SHOP`
- Platform-funded discount ต้องไม่ลดยอดที่ร้านได้รับ
- Shop-funded discount ลดยอดขายและ GP ของร้าน
- Multi-shop: กระจาย Platform discount ตามสัดส่วนยอดสินค้า และ snapshot ลง SubOrder

### Deliverables / Paths
```text
Backend:
prisma/schema/voucher.prisma
src/modules/voucher/*
migration + seed + tests

Storefront:
src/app/(storefront)/vouchers/page.jsx
src/app/(storefront)/account/vouchers/page.jsx
src/components/voucher/*
cart + checkout + shop + product integration

Seller/Admin:
src/app/(seller)/seller/vouchers/*
src/app/dashboard/vouchers/*
```

### Acceptance Criteria
- Buyer เก็บโค้ดได้ครั้งเดียว
- คูปองหมดอายุ/หมด quota ใช้ไม่ได้
- Seller A ใช้คูปอง Seller B ไม่ได้
- Cart/Checkout แสดงยอดส่วนลดตรงกับ Server
- Platform voucher หลายร้านกระจายส่วนลดถูกต้อง
- GP/เงินร้านถูกต้องตาม `fundedBy`
- ใช้คูปองซ้ำไม่ได้
- ทุก endpoint มี permission test และ KEK เงิน/Escrow ไม่เพี้ยน

---

# 🟢 Role 2 — Frontend Engineer (Cart, Checkout, Orders & Reviews)

## 2.1 ดูแลอะไร

-flow ฝั่งผู้ซื้อตั้งแต่หยิบสินค้าใส่ตะกร้า จ่ายเงิน ติดตามพัสดุ จนถึงรีวิวและขอคืนเงิน

## 2.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน                            | คืออะไร                                       | สถานะ | ทำแล้ว                                                  | เหลือทำ                                                         | ไฟล์ / API                                                     |
| ------------------------------------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Auth Flow                                   | เข้าสู่ระบบ/โปรไฟล์/ที่อยู่ | ✅         | `/login`, AuthContext, `/profile`, สมุดที่อยู่, cookie ฝั่ง Backend | ย้าย Bearer token ฝั่ง Storefront เป็น httpOnly เต็มรูปแบบ | `login/`, `profile/`, `auth.service.js`                      |
| Cart                                        | ตะกร้าสินค้า                             | ✅         | เพิ่ม/ลด/ลบ, จัดกลุ่มตามร้าน, ค่าส่งแยกตามร้าน, ซ่อนสินค้าที่ถูกระงับ | Voucher selector + checkbox เลือกสินค้า | `cart/page.jsx`, `/api/cart`                                   |
| Checkout                                    | สรุปคำสั่งซื้อ + จ่ายเงิน      | 🟡         | ที่อยู่, PromptPay QR, สรุปค่าส่งแยกตามร้าน | Voucher selector + server quote, แสดงส่วนลด Platform/Shop | `checkout/page.jsx`, `/api/orders`, `/api/payments`          |
| Orders / Tracking                           | ประวัติ + สถานะพัสดุ                | 🟡         | แท็บสถานะ, QR modal                                  | Timeline ตรงกับ SubOrder, แสดงส่วนลดคูปอง                         | `orders/page.jsx`                                                |
| Confirm Received                            | ลูกค้ายืนยันรับของ                 | ❌         | —                                                            | ปุ่ม + API ปลดเงิน                                          | `orders/[id]`, `POST /api/orders/:subOrderId/confirm-received` |
| Refund Buyer                                | ขอคืนเงิน/แจ้งปัญหา                | ❌         | —                                                            | ฟอร์ม + แนบหลักฐาน                                      | `/account/orders/[id]/refund`, `POST /api/refunds/request`     |
| seller Refund UI<br />card random animation | หน้าsellerตรวจคำขอคืนเงิน         | ❌         | —                                                            | ตาราง + อนุมัติ/ปฏิเสธ                               | `backoffice /dashboard/refunds`, `GET/PUT /api/admin/refunds`  |

## 2.3 งานที่ต้องส่ง

- Cart จัดกลุ่มตามร้าน + ค่าส่งแยก
- Checkout สรุปแยกตามร้าน
- Timeline สถานะออเดอร์
- ปุ่มยืนยันรับสินค้า
- รีวิว + อัปโหลดรูป
- ฟอร์มขอคืนเงิน + หน้า admin refund

## 2.4 Definition of Done

- สถานะออเดอร์/เงินถูกต้อง
- Buyer เห็นเฉพาะออเดอร์ตัวเอง
- มี loading / empty / error
- ทดสอบ flow ซื้อ → จ่าย → ติดตาม → รีวิว ผ่าน

## 2.5 ต้องประสานกับ

- **Role 4** — Confirm received, reviews, refund API และ money allocation ของ voucher
- **Role 3** — Backoffice refund page
- **Role 1** — Voucher Selector ใน Cart/Checkout และ Server-authoritative voucher quote

---

# 🟠 Role 3 — Fullstack Engineer (Seller Center & Admin)

## 3.1 ดูแลอะไร

ระบบเปิดร้าน, Seller Center, การจัดการสินค้า/ออเดอร์ของร้าน และ Backoffice สำหรับ Admin/Staff

## 3.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน    | คืออะไร                      | สถานะ | ทำแล้ว                                     | เหลือทำ                                  | ไฟล์ / API                                        |
| ------------------- | ----------------------------------- | ---------- | ------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------- |
| Seller Onboarding   | สมัครเปิดร้าน + KYC    | ✅         | ฟอร์ม, สถานะ PENDING/REJECTED/APPROVED/SUSPENDED | —                                              | `(storefront)/become-seller/`, `/api/shops/apply` |
| Admin Shop Approval | อนุมัติ/ปฏิเสธ/ระงับร้าน | ✅         | หน้า `/dashboard/shops`, mask KYC, suspend/reactivate + Audit Log | —                                              | `backoffice /dashboard/shops`, `/api/admin/shops` |
| Seller Shell        | โครง Seller Center + guard      | ✅         | layout, topbar, guard, แสดงสถานะร้าน/เหตุผลระงับ | หน้า Dashboard/Products/Shop/Wallet จริง       | `(seller)/seller/layout.jsx`                        |
| Admin Payout        | อนุมัติถอนเงิน        | ✅         | หน้า `/dashboard/payouts`, approve/reject/transfer + Ledger | —                                              | `/api/admin/payouts`                                |
| Admin Moderation    | ซ่อน/ระงับ/คืนสถานะสินค้า | ✅         | Product Center รวมทุกอย่างใน `/dashboard/products` | —                                              | `/api/admin/products`, `/api/admin/products/:id/moderate` |
| Admin Analytics     | GMV + commission                    | ✅         | Dashboard ใช้ API จริง, แยกยอดตามร้าน/วัน, Platform SKU | —                                              | `/api/admin/analytics`                              |
| Platform Settings   | GP/ค่าส่ง/ฟรีส่ง        | ✅         | หน้า `/dashboard/settings/platform`, version lock, snapshot ลง SubOrder | —                                              | `/api/admin/settings`                               |
| Admin Audit Log     | ประวัติการดำเนินการ      | ✅         | Shop/Product/Payout/Settings/Order actions | —                                              | `/dashboard/audit-logs`, `/api/admin/audit-logs`    |
| Admin Product Center | ดูรายละเอียด/แก้ไข/ซ่อน/ระงับ/ลบ | ✅         | รวมในเมนูรายการสินค้าเดียว + Admin Detail API + แก้ไขสินค้าที่ถูกซ่อนได้ | —                                              | `/dashboard/products`, `/api/admin/products/:id`    |

## 3.3 งานด่วนของเพื่อน: Seller Center

**โครงที่มีแล้ว**

```
src/app/(seller)/seller/
├── layout.jsx   # guard + topbar ให้แล้ว
└── page.jsx     # placeholder
```

**หน้าที่ต้องสร้าง**

| หน้า       | Path                                   | API                                  | เสร็จเมื่อ                             |
| -------------- | -------------------------------------- | ------------------------------------ | ------------------------------------------------ |
| Dashboard      | `seller/dashboard/page.jsx`          | `GET /api/seller/dashboard`        | KPI 4 ใบ + loading/error                       |
| Products list  | `seller/products/page.jsx`           | `GET /api/seller/products`         | ตาราง + ค้นหา/กรอง + toggle + ลบ |
| Product create | `seller/products/new/page.jsx`       | `POST /api/seller/products`        | ฟอร์ม + รูป + validation                 |
| Product edit   | `seller/products/[id]/edit/page.jsx` | `GET/PUT /api/seller/products/:id` | โหลดค่าเดิม + บันทึกได้      |
| Shop settings  | `seller/shop/page.jsx`               | `GET/PUT /api/shops/my-shop`       | แก้ชื่อ/โลโก้/บัญชีได้       |
| Orders         | `seller/orders/page.jsx`             | ยังไม่มี API ฝั่ง Seller | ต้องรอ `GET /api/seller/orders` + fulfillment endpoints |
| Wallet         | `seller/wallet/page.jsx`             | พร้อมแล้ว: `/api/seller/wallet`, `/api/seller/payouts` | แสดง balance, held amount, Ledger และฟอร์มขอถอน |
| Vouchers       | `seller/vouchers/page.jsx`           | Role 1 รับผิดชอบ | Seller สร้าง/แก้ไข/หยุดคูปองของร้าน (ประสาน Role 1) |

**กติกาสำคัญ**

- Seller ต้องมีร้าน APPROVED จึงจะเขียนข้อมูลได้
- ห้ามส่ง `shopId` จาก client — backend ผูกให้
- แก้ได้เฉพาะสินค้าของร้านตัวเอง
- Upload ใช้ `POST /api/upload?folder=products`
- ใช้ `useAuth()` จาก `@/context/AuthContext`
- Layout guard จัดการ redirect ให้แล้ว

**ขอบเขตการแก้ไข**

- พื้นที่หลักของ Role 3: `src/app/(seller)/*` และ `bareandbold_backoffice/*`
- ถ้าต้องแก้ `(storefront)` หรือ `bareandbold_backend/*` ให้แจ้งเจ้าของ Role และเปิด PR review ร่วม
- Backend ที่แตะ Schema/Migration/เงิน ต้องให้ Role 4 review ก่อน merge

## 3.4 Definition of Done

- ใช้ API ที่มีอยู่จริง ไม่ hardcode
- มี loading / empty / error
- Responsive
- ไม่ส่ง `shopId` เอง
- ผ่าน permission test seller/admin

## 3.5 ต้องประสานกับ

- **Role 4** — Seller Orders API, Confirm Received, Money/Escrow review
- **Role 2** — Admin refund UI
- **Role 1** — Seller/Admin Voucher UI และ voucher integration

---

# 🟣 Role 4 — Backend & Database Engineer

## 4.1 ดูแลอะไร

REST API ทั้งหมด ฐานข้อมูล Prisma ระบบเงิน/Escrow Payment Gateway และการ deploy

## 4.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน             | คืออะไร                         | สถานะ | ทำแล้ว                                        | เหลือทำ                    | Endpoint / ไฟล์                          |
| ---------------------------- | -------------------------------------- | ---------- | --------------------------------------------------- | --------------------------------- | -------------------------------------------- |
| Auth & Role                  | Login + แยกสิทธิ์             | ✅         | JWT, middleware, profile                            | httpOnly cookie                   | `auth.middleware.js`, `/api/auth`        |
| Shop API                     | เปิดร้าน/ดู/แก้ร้าน   | ✅         | apply, my-shop, update, public shop                 | —                                | `/api/shops`                               |
| Seller Product API           | CRUD สินค้าร้านตัวเอง  | ✅         | list/create/update/delete/toggle + ownership        | —                                | `/api/seller/products`                     |
| Upload                       | อัปโหลดรูป                   | ✅         | R2 + folder ตามร้าน + ตรวจเจ้าของ | —                                | `/api/upload`                              |
| Public Catalog               | สินค้า public                    | 🟡         | search/category/type/shop + shop info               | price/wrist filter, pagination    | `GET /api/products`                        |
| Admin Approval               | อนุมัติร้าน                 | ✅         | list/approve/reject + role update                   | audit log                         | `/api/admin/shops`                         |
| Payment / Omise              | ตัดเงิน + webhook               | 🟡         | charge + webhook + mock, อัปเดต SubOrder เป็น PAID  | Reconciliation, payment retry, hardening webhook | `/api/payments`                            |
| Split Order                  | แตกออเดอร์ตามร้าน     | ✅         | checkout แยก Shop → SubOrder + snapshot GP/ค่าส่ง | จัดสรรส่วนลด Voucher ต่อ SubOrder | `/api/orders`                              |
| Escrow / Confirm             | ปลดเงินให้ร้าน           | 🟡         | Settlement หลัง Admin เปลี่ยนเป็น DELIVERED/COMPLETED + Ledger กันซ้ำ | Buyer Confirm Received + auto-complete | `/api/orders/:subOrderId/confirm-received` |
| Seller Fulfillment           | ผลิต/จัดส่ง/tracking         | ❌         | —                                                  | Seller order list + status + ship APIs | `/api/seller/orders`                       |
| Reviews API + Review ร้าน | รีวิว + rating                    | ❌         | —                                                  | POST + GET + อัปเดต rating  | `/api/reviews`                             |
| Wallet / Payout API          | ยอดเงิน + ถอนเงิน        | ✅         | Seller wallet/holds/payout request + Admin approve/reject/transfer + Ledger | Payout UI ฝั่ง Seller (Role 3) | `/api/seller/wallet`, `/api/seller/payouts`, `/api/admin/payouts` |
| Refund API                   | คำขอคืนเงิน                 | ❌         | —                                                  | buyer + seller + admin resolution | `/api/refunds`                             |
| Admin APIs                   | Payout/Moderation/Analytics/Settings/Audit | ✅         | API ครบตาม Admin Core                          | Refund management                 | `/api/admin/...`                           |
| Product Moderation API       | ซ่อน/ระงับ/คืนสถานะสินค้า | ✅         | moderation fields + Admin detail + Audit | —                                | `/api/admin/products/:id/moderate`         |
| Shop Suspension API          | ระงับร้านและปิด visibility | ✅         | suspend/reactivate + reason + Audit | —                                | `/api/admin/shops/:id/suspend`             |
| Platform Settings API        | GP/ค่าส่ง/ฟรีส่ง           | ✅         | typed settings, public config, version lock | —                                | `/api/admin/settings`, `/api/settings/public` |
| Voucher / Discount API       | คูปอง + ส่วนลด Checkout    | ❌         | —                                                  | **Role 1 เป็นเจ้าของ**; Role 4 review schema/migration/เงิน | `/api/vouchers/*`, `/api/seller/vouchers`, `/api/admin/vouchers` |
| Gemstone Support             | รีวิว API ของ Role 1           | ❌         | —                                                  | review route + query              | `/api/recommend/gemstones`                 |
| Auto-complete                | ปิดออเดอร์อัตโนมัติ | ❌         | —                                                  | job หลังส่ง 7 วัน       | cron/job                                     |
| CI/CD & Migration Safety     | Test ก่อน deploy + baseline | 🟡         | Docker deploy + Discord notify | CI test gate, staging DB, migration baseline, backup | `.github/workflows`                        |

## 4.3 Definition of Done

- ทุก endpoint มี permission test
- เงิน/Escrow ใช้ transaction ไม่พัง
- Error response สม่ำเสมอ
- อัปเดต API docs เมื่อเสร็จ

## 4.4 ต้องประสานกับ

- **Role 1** — filter/reviews/gemstone
- **Role 2** — checkout/confirm/refund
- **Role 3** — seller/admin APIs

---

# 🧪 5. Tester — Role 1 (บทบาทที่ 2 ของ Role 1)

## 5.1 ใครเป็น Tester

**Role 1 = Frontend Storefront + Tester/QA**

เหตุผลที่เลือก Role 1:

- งานพัฒนาหลักน้อยที่สุด (~14 วัน เทียบกับ Role 2 ~16, Role 3 ~20, Role 4 ~18)
- dependency น้อย ไม่ได้เป็น blocker เรื่องเงิน/ออเดอร์
- ดูแล storefront อยู่แล้ว จึงทดสอบ flow ผู้ซื้อได้ตรง
- แบ่งเวลาได้ประมาณ **3–4 วัน/สัปดาห์ทำงานพัฒนา + 1–2 วัน/สัปดาห์ทำงาน QA**

| Role      | งานพัฒนาหลัก (ประมาณ) |                 งาน QA |               รวม |
| --------- | --------------------------------------: | ------------------------: | -------------------: |
| 🔵 Role 1 |                              ~14 วัน |                 ~4 วัน | **~18 วัน** |
| 🟢 Role 2 |                              ~16 วัน |        ช่วย E2E buyer |           ~17 วัน |
| 🟠 Role 3 |                              ~20 วัน | ช่วย E2E seller/admin |           ~20 วัน |
| 🟣 Role 4 |                              ~18 วัน | ช่วย API/k6/test data |           ~18 วัน |

## 5.2 หน้าที่ QA ของ Role 1

- เขียน test plan + test case
- ประสาน API smoke test กับ Role 4
- ทำ permission matrix (buyer/seller/admin)
- ทดสอบ E2E buyer/storefront และช่วย E2E seller/admin
- ทำ regression checklist + UAT report
- triage bug และติดตามจนปิด
- ทำ release checklist ก่อน deploy

## 5.3 งาน QA ที่ Role 1 ต้องทำ

| งาน            | สถานะ | ทำแล้ว                                                            | เหลือทำ                              | ไฟล์                                   |
| ----------------- | ---------- | ----------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| Test Plan         | 🟡         | ทดสอบ role/seller flow แล้ว                                    | เขียนแผนรวม + รอบทดสอบ   | `TEST_PLAN.md`                           |
| API Smoke         | ✅         | 18/18 checks                                                            | รันก่อน merge ทุกครั้ง       | `bareandbold_backend/k6/smoke.js`        |
| Permission Matrix | ✅         | role test 52/52, security 9/9                                           | เพิ่มเคสเมื่อมี API ใหม่ | test script                                |
| k6 Load           | ✅         | public + auth load ผ่าน                                             | stress test + baseline                      | `k6/load-public.js`, `k6/load-auth.js` |
| E2E Buyer         | ❌         | —                                                                      | เขียนชุดทดสอบ                  | `e2e/buyer/`                             |
| E2E Seller/Admin  | 🟡         | Manual flow เปิดร้าน/อนุมัติ/ลงสินค้า/Moderation/Payout ทดสอบแล้ว | ทำเป็นชุดอัตโนมัติ + เพิ่ม Seller Center UI | `e2e/seller/`                            |
| Voucher / Coupon QA | ❌       | —                                                                      | claim ซ้ำ/quota/ส่วนลด/GP/permission | `e2e/voucher/`                           |
| Regression        | ❌         | —                                                                      | checklist + รันก่อนส่ง            | `TEST_PLAN.md`                           |
| UAT               | ❌         | —                                                                      | UAT cases + report                          | `UAT_REPORT.md`                          |
| Test Data         | ✅         | `seed_roles.js` + บัญชีทดสอบ + seed multi-shop/order/payout | เพิ่ม seed review/refund/voucher | `seed_roles.js`                          |

## 5.4 การแบ่งงาน QA กับคนอื่น

| งาน QA           | Role 1 (Tester)               | ผู้ช่วย |
| ------------------- | ----------------------------- | -------------- |
| Test Plan           | เขียนและดูแล      | ทุกคน     |
| API Smoke           | รัน + สรุปผล         | Role 4         |
| Permission Matrix   | ออกแบบเคส + รัน   | Role 4         |
| k6 Load             | วิเคราะห์ผล        | Role 4         |
| E2E Buyer           | เจ้าของ                | Role 2         |
| E2E Seller/Admin    | ช่วยทดสอบ            | Role 3         |
| Regression          | เจ้าของ                | ทุกคน     |
| UAT                 | เจ้าของ + รายงาน | ทุกคน     |
| Bug Report / Triage | triage + ติดตาม         | ทุกคน     |
| Test Data           | ขอข้อมูล              | Role 4         |

## 5.5 สิ่งที่ Role 1 ต้องส่ง

- Test plan + test cases
- ผล k6 (smoke/public/auth) + baseline
- Permission matrix
- E2E buyer + ช่วย E2E seller/admin
- UAT report + bug list
- Release checklist ก่อน deploy

## 5.6 Definition of Done ของ QA

- ทุก feature ใหม่มี test case อย่างน้อย 1 เคส
- test ผ่านก่อน merge (หรือมี bug ticket ถ้าไม่ผ่าน)
- bug มี severity + วิธี reproduce + หลักฐาน
- อัปเดตผลทดสอบใน `PROJECT_TASKS.md` / report
- ไม่ปิดงานถ้า regression ยังไม่ผ่าน

---

# 🤝 6. งานกลางที่ทุกคนช่วยกัน

| งาน                 | รายละเอียด                                                               | ความถี่             |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------- |
| Code Review            | ห้าม merge งานตัวเองโดยไม่มีคนreview                        | ทุก PR                  |
| Integration Checkpoint | รวม branch + รัน E2E                                                         | สิ้นสัปดาห์     |
| UAT                    | Role 1 (Tester) เป็นเจ้าของ, ทุกคนช่วยเตรียมข้อมูล | สัปดาห์ที่ 4     |
| Demo / Slides          | ซ้อมเดโม + ทำสไลด์                                                  | ปลายเดือน         |
| เอกสาร           | อัปเดต `PROJECT_TASKS.md` + API docs                                       | เมื่อเสร็จงาน |

---

# 🔗 7. Dependencies — อะไรบล็อกอะไร

| งาน            | ต้องรอ                          | สถานะล่าสุด |
| ----------------- | ------------------------------------- | ------------------------------ |
| Seller Orders     | Seller Orders API + fulfillment endpoints | ❌ ยังไม่มี API |
| Seller Wallet UI  | Wallet/Payout API                     | ✅ API พร้อม เหลือ UI |
| Confirm Received  | Buyer endpoint + Escrow release       | 🟡 Split/Settlement มีแล้ว, Buyer confirm ยังไม่มี |
| Admin Payout      | Wallet/Payout API                     | ✅ เสร็จ |
| Reviews           | Order ที่ COMPLETED + Reviews API      | ❌ |
| Refund            | Order/SubOrder ที่ชำระแล้ว + Refund API | ❌ |
| Platform Settings | checkout + settlement อ่านค่า       | ✅ เสร็จและ snapshot แล้ว |
| Admin Analytics   | Split Order + Payment                 | ✅ เสร็จ |
| Coupon / Voucher  | Voucher schema + Checkout quote + money allocation | ❌ Role 1 เริ่มได้ แต่ต้อง freeze กฎเงินก่อน |
| Seller Center UI  | API ต่อหน้า                            | 🟡 Dashboard/Products/Shop/Wallet พร้อมทำ |

> เริ่มได้เลยไม่ต้องรอ: Seller Dashboard, Seller Products, Shop Settings, Seller Wallet UI, Storefront filter, Wishlist, Horoscope, SEO, Coupon discovery UI (หลัง freeze schema/กฎเงิน)

### QA เริ่มได้เลย / ต้องรอ (เจ้าของ: Role 1)

| งาน QA                     | เจ้าของ  | ผู้ช่วย  | เริ่มได้เมื่อ      |
| ----------------------------- | --------------- | --------------- | ------------------------------- |
| Test plan + permission matrix | Role 1 (Tester) | Role 4          | เริ่มได้เลย          |
| API smoke                     | Role 1 (Tester) | Role 4          | เริ่มได้เลย          |
| k6 public/auth load           | Role 4          | Role 1 (Tester) | เริ่มได้เลย          |
| E2E buyer                     | Role 1 (Tester) | Role 2          | cart/checkout/orders เสร็จ |
| E2E seller/admin              | Role 1 (Tester) | Role 3          | seller/admin pages เสร็จ   |
| Full regression + UAT         | Role 1 (Tester) | ทุกคน      | สัปดาห์ที่ 4          |

---

# 📊 8. Phase Summary

| Phase                          | สถานะ                                                          |
| ------------------------------ | ------------------------------------------------------------------- |
| 1. Database Schema             | ✅ schema / 🟡 migration baseline ต้องทำให้ตรงก่อน deploy |
| 2. Auth & Seller Onboarding    | ✅                                                                  |
| 3. Catalog & Shop              | 🟡 ค้นหา/filter/review UI บางส่วนยังขาด |
| 3.5 Horoscope                  | ❌                                                                  |
| 4. Cart / Split Order / Escrow | 🟡 Split Order ✅ · Buyer Confirm ❌ · Refund ❌ |
| 5. Fulfillment & Tracking      | 🟡 Admin update/settlement ✅ · Seller fulfillment ❌ |
| 6. Seller Center & Wallet      | 🟡 Wallet/Payout API ✅ · Seller Center UI ❌ |
| 7. Admin Backoffice            | ✅ Admin Core · Refund page ❌ |
| 8. Testing & Deploy            | 🟡 smoke/permission/k6 มี · E2E/UAT/CI test gate ยังขาด |
| 9. Extended Scope              | ❌                                                                  |
| 10. Coupon / Voucher           | ❌ Role 1 เริ่มได้หลัง freeze schema + กฎเงิน |

---

# 🗓️ 9. แผนงาน 4 สัปดาห์ (ปรับตามสถานะล่าสุด)

| สัปดาห์ | Role 1 | Role 2 | Role 3 | Role 4 |
| -------------- | ---------------------- | ------------------- | ----------------------------- | -------------------- |
| 1 | Coupon schema + buyer voucher discovery/claim | Buyer Confirm Received UI + Refund form | Seller Dashboard + Products UI | Seller Orders API + CI/migration baseline |
| 2 | My Vouchers + Cart/Checkout selector + Seller voucher UI | Confirm Received flow + Refund integration | Product Create/Edit + Shop Settings | Refund API + Escrow review |
| 3 | Admin voucher UI + quota/money tests | Order timeline ตาม SubOrder + voucher summary | Seller Wallet UI + Orders UI | Reviews API + notification/event foundation |
| 4 | E2E Voucher + regression | E2E Buyer + Refund E2E | E2E Seller/Admin + docs | Deploy hardening + full regression |

**Tester = Role 1:** ทำงาน QA ควบคู่ทุกสัปดาห์ — voucher permission/quota, E2E buyer/seller/admin, regression/UAT

> Feature Freeze สัปดาห์ที่ 4 ก่อน UAT · งาน Voucher ต้อง freeze กฎ `fundedBy`/GP/stacking ก่อนเริ่ม Checkout settlement

---

# ▶️ 10. รันโปรเจกต์ & บัญชีทดสอบ

```bash
# Backend :8000
cd bareandbold_backend && bun run src/app.js

# Storefront :3000
cd bareandbold_front && bun run dev

# Backoffice :3001
cd bareandbold_backoffice && bun run dev
```

| Role              | Email                        | Password     |
| ----------------- | ---------------------------- | ------------ |
| Buyer             | `buyer@bareandbold.test`   | `password` |
| Seller (APPROVED) | `seller@bareandbold.test`  | `password` |
| Seller (PENDING)  | `pending@bareandbold.test` | `password` |
| Admin             | `admin@gmail.com`          | `password` |
| Staff             | `staff@gmail.com`          | `password` |

---

# ⚠️ 11. ข้อจำกัดที่ต้องรู้

## พร้อมแล้ว
- Admin Core: อนุมัติ/ระงับร้าน, Product Center, Moderation, Payout, Analytics, Platform Settings, Audit Log
- Split Order ตามร้าน + snapshot GP/commission/ค่าส่งลง SubOrder
- Cart และ Checkout คิดค่าส่งแยกตามร้าน
- Seller Wallet/Payout API + Admin Payout state machine
- Settlement หลัง Admin เปลี่ยน SubOrder เป็น DELIVERED/COMPLETED พร้อมกันเครดิตซ้ำ

## ยังขาด / ต้องระวัง
- Seller Center UI ยังเป็น scaffold: dashboard/products/create/edit/shop/wallet/orders ยังไม่มีหน้าใช้งานจริง
- Seller Orders / Fulfillment API ยังไม่มี — Seller อัปเดตสถานะผลิต/จัดส่ง/เลขพัสดุเองไม่ได้
- Buyer Confirm Received และ Auto-complete ยังไม่มี
- Reviews และ Refund ยังไม่มี API/UI
- Coupon/Voucher ยังไม่เริ่ม — Role 1 เป็นเจ้าของ Vertical นี้
- Admin Refund Page ยังไม่มี (Role 2 เจ้าของฟีเจอร์, Role 3 ช่วยฝั่ง Backoffice)
- Token ฝั่ง Storefront ยังใช้ Bearer ใน localStorage แม้ Backend ตั้ง cookie แล้ว
- Product Detail ยังไม่มีการ์ดร้านและ Reviews UI
- Migration เก่าไม่ตรงกับ DB ที่ใช้ `db push` — ต้องทำ baseline/staging ก่อนพึ่ง `prisma migrate deploy`
- CI ปัจจุบันมีเฉพาะ deploy workflow ยังไม่มี lint/build/test gate; ทุก push `main` deploy ทันที
- ไม่มี automated tests (`*.test` / E2E) ใน repo — มีเพียง Postman, k6 และ manual test
- Payout ยังเป็นการโอนเงิน manual + บันทึกหลักฐาน ไม่ได้เชื่อมธุรกรรมธนาคารอัตโนมัติ
- Refund/ยกเลิกหลังชำระเงินยังไม่ reverse Ledger/GP อัตโนมัติ
- ค่าส่งจริงยังใช้ Mock Shipping/กรอกเลขพัสดุเอง ไม่ได้เชื่อมผู้ให้บริการขนส่ง
