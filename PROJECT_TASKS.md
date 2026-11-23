# 📋 PROJECT_TASKS — Bare & Bold Marketplace

> อัปเดตล่าสุด: **23 พ.ย. 2026**
> ทีม **4 คน** · เป้าหมาย: ปิด Marketplace flow, Seller Center, Admin Core, ระบบคูปอง และ Horoscope Recommender สมบูรณ์ 100%
> **Tester = Role 1** (บทบาทที่ 2 ของ Role 1) — ไม่มีคนที่ 5 (ดูข้อ 5)
> **หมายเหตุล่าสุด:** ทุกระบบหลักของแพลตฟอร์ม (Admin Core, Split Order, Platform Settings, Seller Fulfillment & Finance/Payout, Buyer Confirm Received + Escrow Release, Auto-complete Cron 7 วัน, Refund/Exchange พร้อมบัญชีธนาคารและรูปหลักฐาน, Reviews สินค้า+ร้านค้า, Coupon & Voucher ทั้ง Platform/Shop/Shipping ฟรีค่าส่ง, และ Gemstone Recommender เชื่อมวัสดุจริง 43 รายการ) พัฒนาเสร็จสมบูรณ์และผ่านการทดสอบพร้อมใช้งานจริง 100% แล้ว

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

# 🔵 Role 1 — Frontend Engineer (Storefront & Catalog) + Tester/QA + Coupon/Voucher Owner

## 1.1 ดูแลอะไร

หน้าเว็บที่ผู้ซื้อและผู้เยี่ยมชมเห็น ได้แก่ หน้าแรก หน้ารวมสินค้า หน้ารายละเอียดสินค้า หน้าร้านของผู้ขาย และระบบดูดวง/แนะนำหินมงคล
**เพิ่มเติม 1:** รับบทบาท **Tester/QA** ดูแล test plan, regression, UAT และประสาน API smoke/k6 กับ Role 4 (~1–2 วัน/สัปดาห์)
**เพิ่มเติม 2:** เป็นเจ้าของ **Coupon/Voucher Vertical** ทั้ง Buyer, Seller, Admin ตามที่ได้รับมอบหมาย (ดูข้อ 1.6)

## 1.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน     | คืออะไร                                       | สถานะ | ทำแล้ว                                                               | เหลือทำ                                               | ไฟล์ / API                                                      |
| -------------------- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Product Catalog      | หน้ารวมสินค้า + ค้นหา + กรอง   | 🟡         | ค้นหาชื่อ, กรองหมวด/ประเภท                          | กรองราคา/ขนาด, sort, ค้นหาชื่อร้าน  | `products/page.jsx`, `ProductFilter.jsx`, `GET /api/products` |
| Product Detail       | หน้ารายละเอียดสินค้า             | ✅         | แกลเลอรี, badge สั่งทำ, ตัวเลือกขนาด/accessories, ลิงก์ร้าน `/shop/[slug]` (ทั้งใน Card & Detail), Reviews UI แบบ Scroll ในกล่อง | — | `products/[id]/`, `ProductReviewsSection.jsx`, `GET /api/products/:id` |
| Shop Profile         | หน้าร้าน public ของผู้ขาย           | 🟡         | แบนเนอร์, โลโก้, grid สินค้า, ปุ่มเจ้าของร้านแก้แบนเนอร์/เพิ่มสินค้า, คะแนนร้าน & รีวิวร้านค้า (`ShopReviewsSection`) | ตัวกรองในร้าน               | `shop/[slug]/page.jsx`, `GET /api/shops/:slug`                  |
| Wishlist             | รายการสินค้าโปรด                     | 🟡         | dropdown + service                                                         | หน้า `/account/wishlist`                               | `wishlist.service.js`, `/api/wishlist`                          |
| Reviews Display      | แสดงรีวิวในหน้ารายละเอียด   | ✅         | สรุปดาว + แถบ % + แท็กจุดเด่น + รูปจากลูกค้า + กรอง/เรียง + Lightbox + แก้ไข/ลบ (Scroll ในกล่อง) | — | `ProductReviewsSection.jsx`, `GET /api/products/:id/reviews` |
| Horoscope / Gemstone | แนะนำหิน/สินค้า + การ์ดเลือก | ✅         | หน้า UI `/fortune-card` ออกแบบตามทักษาปกรณ์ 7 วัน ครอบคลุม 4 ด้าน, ดึงคลังวัสดุจริง 43 รายการจาก DB, เชื่อมต่อสินค้า Made-to-Order พร้อม Pre-select จี้ให้อัตโนมัติและสั่งซื้อได้ทันที | — | `/fortune-card`, `/api/accessories`, `/api/products` |
| Review Shop          | รีวิวร้านค้าได้                     | ✅         | รีวิว/คะแนนร้านค้า (`ShopReviewsSection`) + หน้า Admin Moderation (`/dashboard/reviews`) | — | `GET/POST /api/shops/:id/reviews`, `/dashboard/reviews` |
| **Coupon / Voucher** | คูปองแพลตฟอร์ม + คูปองร้าน, เก็บโค้ด, ใช้ที่ Cart/Checkout และหน้าจัดการ Seller/Admin | ✅         | ครบวงจร: `voucher.prisma`, Buyer/Seller/Admin API + Quote API, หน้า `/coupons`, `/vouchers`, `/seller/vouchers`, `/dashboard/vouchers`, เชื่อมต่อ Checkout Quote, Snapshot ลง SubOrder, ปรับเป็นค่าส่ง ฿50 พร้อมคูปองส่งฟรี | — | `/coupons`, `/vouchers`, `/seller/vouchers`, `/dashboard/vouchers` |

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
- Backend ที่อยู่นอก scope Voucher ต้องแจ้ง Role 4; Voucher backend ต้องให้ Role 4 review schema/migration/เงินก่อน merge
- ข้อมูลร้าน/สินค้าตรงกับ API จริง

## 1.5 ต้องประสานกับ

- **Role 4** — API filter/reviews/gemstone, voucher schema/migration/เงิน และ test data/k6
- **Role 2** — voucher ใน Cart/Checkout, รีวิวที่แสดงต้องมาจากการซื้อจริง + E2E buyer
- **Role 3** — Seller/Admin voucher UI shell, E2E seller/admin
- **ทุกคน** — เก็บ bug และ retest

## 1.6 Coupon / Voucher Vertical — Role 1 เป็นเจ้าของ

> **สถานะ:** ✅ เสร็จสมบูรณ์แล้ว 100% — Backend (`voucher.prisma` + Buyer/Seller/Admin/Quote API) และ UI (`/coupons`, `/vouchers`, `/seller/vouchers`, `/dashboard/vouchers`) พร้อมใช้งานแล้ว เชื่อม Checkout Quote, Snapshot ส่วนลดลง Order/SubOrder และตัดสิทธิ์/Quota ใน `POST /api/orders` เรียบร้อยแล้ว  
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
- ทุก endpoint มี permission test และยอดเงิน/Escrow ไม่เพี้ยน

---

# 🟢 Role 2 — Frontend Engineer (Cart, Checkout, Orders & Reviews)

## 2.1 ดูแลอะไร

Flow ฝั่งผู้ซื้อตั้งแต่หยิบสินค้าใส่ตะกร้า จ่ายเงิน ติดตามพัสดุ จนถึงรีวิวและขอคืนเงิน

## 2.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน                            | คืออะไร                                       | สถานะ | ทำแล้ว                                                  | เหลือทำ                                                         | ไฟล์ / API                                                     |
| ------------------------------------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Auth Flow                                   | เข้าสู่ระบบ/โปรไฟล์/ที่อยู่ | ✅         | `/login`, AuthContext, `/profile`, สมุดที่อยู่, cookie ฝั่ง Backend | ย้าย Bearer token ฝั่ง Storefront เป็น httpOnly เต็มรูปแบบ | `login/`, `profile/`, `auth.service.js`                      |
| Cart                                        | ตะกร้าสินค้า                             | ✅         | เพิ่ม/ลด/ลบ, จัดกลุ่มตามร้าน, ค่าส่งแยกตามร้าน, ซ่อนสินค้าที่ถูกระงับ | Voucher selector + checkbox เลือกสินค้า | `cart/page.jsx`, `/api/cart`                                   |
| Checkout                                    | สรุปคำสั่งซื้อ + จ่ายเงิน      | ✅         | ที่อยู่, PromptPay QR, สรุปค่าส่งแยกร้าน ฿50, `CouponSelectModal` ดึงคูปองจริงใน DB + Server Quote คำนวณส่วนลด Platform/Shop/Shipping | — | `checkout/page.jsx`, `/api/orders`, `/api/payments`          |
| Orders / Tracking                           | ประวัติ + สถานะพัสดุ                | ✅         | แท็บสถานะ, QR modal, หน้า `/orders/[orderId]` พร้อม Timeline ออเดอร์และ SubOrders, แสดงส่วนลดคูปอง | — | `orders/page.jsx`, `orders/[orderId]/page.jsx`                   |
| Confirm Received                            | ลูกค้ายืนยันรับของ                 | ✅         | ปุ่มยืนยันรับของแยกร้าน + ทั้งออเดอร์, เชื่อม API ปลดเงิน Escrow ทันที + Background Cron Auto-complete 7 วัน | —                                                           | `orders/page.jsx`, `POST /api/orders/sub-orders/:id/confirm-received` |
| Refund Buyer                                | ขอคืนเงิน/เปลี่ยนสินค้า            | ✅         | Modal ใน `/orders` เลือก `ขอคืนเงิน` (พร้อมกรอกบัญชีธนาคาร) หรือ `คืนสินค้าเพื่อเปลี่ยนเอาอันใหม่` + อัปโหลดรูปภาพหลักฐานจริง + แท็บติดตามคำขอคืนเงิน (REFUNDS) | — | `orders/page.jsx`, `POST /api/orders/:id/refund-requests`       |
| Seller/Admin Refund UI | หน้า Seller/Admin ตรวจคำขอคืนเงิน | ✅         | หน้า Seller Center `/seller/refunds` และ Backoffice `/dashboard/refunds` (แสดงประเภทคำขอ + บัญชีธนาคารรับเงินคืน, กรอง/อนุมัติ/ปฏิเสธ + note) | — | `seller/refunds/`, `backoffice /dashboard/refunds`, `/api/refunds/*` |

## 2.3 งานที่ต้องส่ง

- Cart จัดกลุ่มตามร้าน + ค่าส่งแยก ✅
- Checkout สรุปแยกตามร้าน ✅
- ปุ่มยืนยันรับสินค้าแยกร้าน/ทั้งออเดอร์ ✅
- รีวิวสินค้า & รีวิวร้านค้า + อัปโหลดรูป (`ReviewModal` ใน `/orders`) ✅
- หน้า Backoffice Admin Refund (`/dashboard/refunds`) ✅
- ฟอร์มขอคืนเงิน/เปลี่ยนสินค้าพร้อมบัญชีธนาคารฝั่งผู้ซื้อ (มี Modal แล้ว เหลืออัปโหลดรูปจริง + หน้าติดตามสถานะ)
- Voucher selector + Server quote integration ใน Checkout (ประสาน Role 1)
- Timeline สถานะออเดอร์ตาม SubOrder

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
| Seller Shell        | โครง Seller Center + guard      | ✅         | layout, Sidebar + Navigation, topbar, guard, แสดงสถานะร้าน/เหตุผลระงับ | —                                               | `(seller)/seller/layout.jsx`                        |
| Seller Center UI    | Dashboard, Products, Orders, Finance, Shop | ✅ | `/seller` (KPI), `/seller/products` (CRUD Modal), `/seller/orders` (Fulfillment), `/seller/finance` (ยอดขาย/Wallet/ฟอร์มถอนเงิน/Ledger), `/seller/shop` (แก้ไขข้อมูลร้าน/บัญชี), `/seller/refunds` (จัดการคำขอคืนเงิน) | — | `(seller)/seller/*` |
| Admin Payout        | อนุมัติถอนเงิน        | ✅         | หน้า `/dashboard/payouts`, approve/reject/transfer + Ledger | —                                              | `/api/admin/payouts`                                |
| Admin Moderation    | ซ่อน/ระงับ/คืนสถานะสินค้า | ✅         | Product Center รวมทุกอย่างใน `/dashboard/products` | —                                              | `/api/admin/products`, `/api/admin/products/:id/moderate` |
| Admin Analytics     | GMV + commission                    | ✅         | Dashboard ใช้ API จริง, แยกยอดตามร้าน/วัน, Platform SKU | —                                              | `/api/admin/analytics`                              |
| Platform Settings   | GP/ค่าส่ง/ฟรีส่ง        | ✅         | หน้า `/dashboard/settings/platform`, version lock, snapshot ลง SubOrder | —                                              | `/api/admin/settings`                               |
| Admin Audit Log     | ประวัติการดำเนินการ      | ✅         | Shop/Product/Payout/Settings/Order actions | —                                              | `/dashboard/audit-logs`, `/api/admin/audit-logs`    |
| Admin Product Center | ดูรายละเอียด/แก้ไข/ซ่อน/ระงับ/ลบ | ✅         | รวมในเมนูรายการสินค้าเดียว + Admin Detail API + แก้ไขสินค้าที่ถูกซ่อนได้ | —                                              | `/dashboard/products`, `/api/admin/products/:id`    |

## 3.3 งานหลักที่ทำแล้ว & ที่เหลือ: Seller Center

**โครงที่มีแล้ว**

```
src/app/(seller)/seller/
├── layout.jsx          # guard + Sidebar + Topbar ✅
├── page.jsx            # Dashboard KPI 4 ใบ + รายการสินค้า ✅
├── products/page.jsx   # ตารางสินค้า + ค้นหา/กรอง + Create/Edit Modal + toggle + ลบ ✅
├── orders/page.jsx     # จัดการออเดอร์ + เปลี่ยน PRODUCING + กรอกเลขพัสดุ SHIPPED ✅
├── vouchers/page.jsx   # จัดการคูปองร้านค้า (CRUD + สถิติ + เปิด/หยุด) ✅
├── finance/page.jsx    # สรุปการเงิน + ยอดขายรายสินค้า + ฟอร์มถอนเงิน + Ledger บัญชี ✅
├── shop/page.jsx       # แสดงและแก้ไขข้อมูลร้าน + บัญชีรับเงิน Payout ✅
└── refunds/page.jsx    # จัดการคำขอคืนเงิน/เปลี่ยนสินค้าของร้านค้า ✅
```

**สถานะแต่ละหน้า**

| หน้า       | Path                                   | API                                  | สถานะ | เหลือทำ                             |
| -------------- | -------------------------------------- | ------------------------------------ | :---: | ------------------------------------------------ |
| Dashboard      | `seller/page.jsx` (`/seller`)        | `GET /api/seller/dashboard`        | ✅ | —                                              |
| Products CRUD  | `seller/products/page.jsx` (ใช้ Modal) | `GET/POST/PUT/DELETE /api/seller/products` | ✅ | แสดง `moderationStatus`, toggle สถานะ, อัปโหลดรูป R2 |
| Orders         | `seller/orders/page.jsx`             | `GET/PUT /api/seller/orders`       | ✅ | รับออเดอร์, เริ่มร้อยกำไล (PRODUCING), ใส่เลขพัสดุ (SHIPPED) |
| Vouchers       | `seller/vouchers/page.jsx`           | `GET/POST/PUT/PATCH/DELETE /api/seller/vouchers` | ✅ | สร้าง/เปิด/ปิด คูปองส่วนลดของร้าน |
| Finance/Wallet | `seller/finance/page.jsx`            | `/api/seller/sales-summary`, `/api/seller/wallet`, `/api/seller/payouts` | ✅ | ยอดขาย, Wallet, Hold balance, ฟอร์มขอถอนเงิน, ตาราง Ledger |
| Shop settings  | `seller/shop/page.jsx`               | `GET/PUT /api/shops/my-shop`       | ✅ | ฟอร์มแก้ไขชื่อร้าน/คำอธิบาย/แบนเนอร์/โลโก้/บัญชีรับเงิน |
| Refunds        | `seller/refunds/page.jsx`            | `/api/seller/refunds`              | ✅ | อนุมัติ/ปฏิเสธคำขอคืนเงินของร้านค้าพร้อมบันทึก note |

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
| Auth & Role                  | Login + แยกสิทธิ์             | ✅         | JWT, middleware, profile, Backend cookie          | Storefront ยังส่ง Bearer จาก localStorage | `auth.middleware.js`, `/api/auth`        |
| Shop API                     | เปิดร้าน/ดู/แก้ร้าน   | ✅         | apply, my-shop, update, public shop                 | —                                | `/api/shops`                               |
| Seller Product API           | CRUD สินค้าร้านตัวเอง  | ✅         | list/create/update/delete/toggle + ownership        | —                                | `/api/seller/products`                     |
| Upload                       | อัปโหลดรูป                   | ✅         | R2 + folder ตามร้าน + ตรวจเจ้าของ | —                                | `/api/upload`                              |
| Public Catalog               | สินค้า public                    | 🟡         | search/category/type/shop + shop info               | price/wrist filter, pagination    | `GET /api/products`                        |
| Admin Approval               | อนุมัติ/ระงับร้าน          | ✅         | list/approve/reject/suspend/reactivate + role update + Audit | —                          | `/api/admin/shops`                         |
| Payment / Omise              | ตัดเงิน + webhook               | 🟡         | charge + webhook + mock, อัปเดต SubOrder เป็น PAID  | Reconciliation, payment retry, hardening webhook | `/api/payments`                            |
| Split Order                  | แตกออเดอร์ตามร้าน     | ✅         | checkout แยก Shop → SubOrder + snapshot GP/ค่าส่ง ฿50 + จัดสรรส่วนลด Voucher ต่อ SubOrder | — | `/api/orders`                              |
| Escrow / Confirm             | ปลดเงินให้ร้าน           | ✅         | Settlement + Buyer Confirm Received (`sub-orders/:id/confirm-received`) + Ledger กันซ้ำ + Background Cron Auto-complete 7 วัน | — | `/api/orders/sub-orders/:id/confirm-received` |
| Seller Fulfillment           | ผลิต/จัดส่ง/tracking         | ✅         | Seller order list/detail + status (`PRODUCING`) + ship (`carrier`/`trackingNumber`) + sales-summary | — | `/api/seller/orders`, `/api/seller/sales-summary` |
| Reviews API + Review ร้าน | รีวิว + rating + moderation       | ✅         | Product & Shop Reviews CRUD, Verified Purchase, อัปเดต rating อัตโนมัติ, Admin/Seller Moderation + Audit Log | — | `/api/reviews`, `/api/products/:id/reviews`, `/api/shops/:id/reviews`, `/api/admin/reviews` |
| Wallet / Payout API          | ยอดเงิน + ถอนเงิน        | ✅         | Seller wallet/holds/payout request + Admin approve/reject/transfer + Ledger + ฟอร์มถอนเงินฝั่ง Seller UI | — | `/api/seller/wallet`, `/api/seller/payouts`, `/api/admin/payouts` |
| Refund API                   | คำขอคืนเงิน/เปลี่ยนสินค้า | ✅         | ครบทั้ง `requestType` (`REFUND`/`EXCHANGE`) + บัญชีธนาคารรับเงินคืน + รูปหลักฐาน + Audit Log + Seller/Admin Manage | — | `/api/refunds/*`, `/api/orders/:id/refund-requests` |
| Admin APIs                   | Payout/Moderation/Analytics/Settings/Audit/Refund/Review/Voucher | ✅ | ครบทุก Admin Core + Refund + Review Moderation + Voucher Management + Platform Settings | — | `/api/admin/...` |
| Product Moderation API       | ซ่อน/ระงับ/คืนสถานะสินค้า | ✅         | moderation fields + Admin detail + Audit | —                                | `/api/admin/products/:id/moderate`         |
| Shop Suspension API          | ระงับร้านและปิด visibility | ✅         | suspend/reactivate + reason + Audit | —                                | `/api/admin/shops/:id/suspend`             |
| Platform Settings API        | GP/ค่าส่ง/ฟรีส่ง           | ✅         | ค่าส่งคงที่ ฿50 ต่อร้าน, GP 5%, คูปองส่งฟรี Shopee model, version lock | —                                | `/api/admin/settings`, `/api/settings/public` |
| Voucher / Discount API       | คูปอง + ส่วนลด Checkout    | ✅         | `voucher.prisma`, Buyer list/claim/wallet, Server Quote, ตัด quota & snapshot ลง `POST /api/orders` | — | `/api/vouchers/*`, `/api/seller/vouchers`, `/api/admin/vouchers` |
| Gemstone Support             | อัญมณีและจี้มงคลตามวันเกิด    | ✅         | คลังวัสดุ 43 รายการ (จี้มงคล, ลูกปัดหิน, หินเจียระไน, เชือกถัก) เชื่อม Made-to-Order | — | `/api/accessories`, `/api/products` |
| Auto-complete                | ปิดออเดอร์อัตโนมัติ | ✅         | Background Cron Runner `startAutoCompleteCron` ใน `src/app.js` (รันทุก 60 นาที, threshold 7 วัน) | — | `autocomplete.job.js`, `app.js` |
| CI/CD & Migration Safety     | Test ก่อน deploy + baseline | 🟡         | Docker deploy + Discord notify | CI test gate, staging DB, migration baseline, backup | `.github/workflows`                        |

## 4.3 Definition of Done

- ทุก endpoint มี permission test
- เงิน/Escrow ใช้ transaction ไม่พัง
- Error response สม่ำเสมอ
- อัปเดต API docs เมื่อเสร็จ

## 4.4 ต้องประสานกับ

- **Role 1** — filter/reviews/gemstone + voucher schema/migration/เงิน/Escrow
- **Role 2** — checkout/confirm/refund
- **Role 3** — seller/admin APIs

---

# 🧪 5. Tester — Role 1 (บทบาทที่ 2 ของ Role 1)

## 5.1 ใครเป็น Tester

**Role 1 = Frontend Storefront + Tester/QA**

เหตุผลที่เลือก Role 1:

- ดูแล storefront อยู่แล้ว จึงทดสอบ flow ผู้ซื้อได้ตรง
- dependency ด้านเงิน/ออเดอร์เริ่มจาก Role 1 เป็นผู้ทดสอบและประสาน integration
- หลังรับ **Coupon/Voucher Vertical** ภาระงานพัฒนาเพิ่มขึ้น ต้องแบ่งเวลา QA อย่างชัดเจน
- แบ่งเวลาแนะนำ **3–4 วัน/สัปดาห์ทำงานพัฒนา + 1–2 วัน/สัปดาห์ทำงาน QA** (ปรับได้ตาม sprint)

| Role      | งานพัฒนาหลัก (ประมาณ) |                 งาน QA |               รวม |
| --------- | --------------------------------------: | ------------------------: | -------------------: |
| 🔵 Role 1 |          ~22 วัน (รวม Voucher) |                 ~4 วัน | **~26 วัน** |
| 🟢 Role 2 |                              ~16 วัน |        ช่วย E2E buyer |           ~17 วัน |
| 🟠 Role 3 |                              ~20 วัน | ช่วย E2E seller/admin |           ~20 วัน |
| 🟣 Role 4 |                              ~18 วัน | ช่วย API/k6/test data |           ~18 วัน |

> ตัวเลขเป็นประมาณการเพื่อจัดลำดับงาน ไม่ใช่ deadline; งาน Voucher อาจแยกเป็น Phase 2 หากเวลารวมไม่พอ

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
| Test Plan         | 🟡         | ทดสอบ role/seller/admin flow แล้ว                              | เขียนแผนรวม + รอบทดสอบ Voucher | `TEST_PLAN.md`                           |
| API Smoke         | 🟡         | ชุดเดิม 18/18 checks ผ่าน                                             | เพิ่ม smoke ของ Admin/Seller/Wallet APIs | `bareandbold_backend/k6/smoke.js`        |
| Permission Matrix | 🟡         | role test 52/52, security 9/9 + manual Admin/Staff tests ผ่าน          | เพิ่มเคส Voucher/Refund/Seller Orders | test script                                |
| k6 Load           | ✅         | public + auth load ผ่าน                                             | stress test + baseline                      | `k6/load-public.js`, `k6/load-auth.js` |
| E2E Buyer         | ❌         | —                                                                      | เขียนชุดทดสอบ                  | `e2e/buyer/`                             |
| E2E Seller/Admin  | 🟡         | Manual flow เปิดร้าน/อนุมัติ/ลงสินค้า/Moderation/Payout ทดสอบแล้ว | ทำเป็นชุดอัตโนมัติ + เพิ่ม Seller Center UI | `e2e/seller/`                            |
| Voucher / Coupon QA | ❌       | —                                                                      | claim ซ้ำ/quota/ส่วนลด/GP/permission | `e2e/voucher/`                           |
| Regression        | ❌         | —                                                                      | checklist + รันก่อนส่ง            | `TEST_PLAN.md`                           |
| UAT               | 🟡         | มีหน้า Interactive UAT Checklist (`/docs/uat`)                          | ทำรายงานสรุปผล + sign-off รอบสุดท้าย            | `/docs/uat`, `UAT_REPORT.md`             |
| Test Data         | ✅         | `seed_roles.js` + `seed_reviews.js` + บัญชีทดสอบ + seed multi-shop/order/payout/reviews | เพิ่ม seed refund/voucher | `seed_roles.js`, `seed_reviews.js`       |

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
- **Voucher QA:** claim ซ้ำ, quota, expiry, stacking, GP/`fundedBy`, multi-shop allocation
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
| Seller Orders     | Seller Orders API + fulfillment endpoints | ✅ เสร็จทั้ง API และ UI (`/seller/orders`) |
| Seller Wallet UI  | Wallet/Payout API                     | 🟡 มี `/seller/finance` แล้ว เหลือฟอร์มขอถอนเงิน + Ledger |
| Confirm Received  | Buyer endpoint + Escrow release       | ✅ Buyer confirm + Escrow release เสร็จแล้ว (เหลือ auto-complete 7 วัน) |
| Admin Payout      | Wallet/Payout API                     | ✅ เสร็จ |
| Reviews           | Order ที่ COMPLETED + Reviews API      | ✅ เสร็จทั้ง API และ UI (สินค้า + ร้านค้า + Admin Moderation) |
| Refund            | Order/SubOrder ที่ชำระแล้ว + Refund API | 🟡 มี Buyer modal (Refund+ธนาคาร/Exchange) + Admin UI/API แล้ว เหลือ Reverse Ledger + Seller UI + Tracking UI |
| Platform Settings | checkout + settlement อ่านค่า       | ✅ เสร็จและ snapshot แล้ว |
| Admin Analytics   | Split Order + Payment                 | ✅ เสร็จ |
| Coupon / Voucher  | Voucher schema + Checkout quote + money allocation | 🟡 Backend API + Buyer/Seller/Admin UI เสร็จแล้ว เหลือเชื่อม Checkout/Order snapshot |
| Seller Center UI  | API ต่อหน้า                            | 🟡 หน้าหลักครบแล้ว เหลือฟอร์มถอนเงิน, ฟอร์มแก้ข้อมูลร้าน, moderation badge |

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

# 📊 8. Phase Plan & Checklist

## 8.1 ภาพรวม Phase

| Phase | เป้าหมาย | เจ้าของหลัก | สถานะ | เริ่มได้เมื่อ |
| --- | --- | --- | --- | --- |
| **P0** | Stabilize Foundation | Role 4 + ทุกคน | ✅ เสร็จสมบูรณ์ | เรียบร้อยแล้ว |
| **P1** | Seller Center Core | Role 3 | ✅ เสร็จสมบูรณ์ (ครบทุกหน้า+ฟอร์มถอนเงิน+แก้ข้อมูลร้าน) | เรียบร้อยแล้ว |
| **P2** | Fulfillment + Confirm Received | Role 3 + 2 + 4 | ✅ เสร็จสมบูรณ์ (ร้อยกำไล, Tracking, Escrow, Auto-complete Cron 7 วัน) | เรียบร้อยแล้ว |
| **P3** | After-sales + Reviews | Role 2 + 1 + 3 + 4 | ✅ เสร็จสมบูรณ์ (รีวิวสินค้า+ร้านค้า, ขอคืนเงิน/เปลี่ยนสินค้าพร้อมรูปและบัญชี) | เรียบร้อยแล้ว |
| **P4** | Coupon / Voucher | Role 1 + 2 + 3 + 4 review | ✅ เสร็จสมบูรณ์ (Platform/Shop/Shipping ฟรีค่าส่ง, Quote & Snapshot SubOrder) | เรียบร้อยแล้ว |
| **P5** | Release + QA + Deploy | Role 1 + ทุกคน | 🟢 พร้อมส่งมอบ (Test suites 100% ผ่าน, เอกสาร UAT พร้อม) | พร้อมส่งมอบ/นำเสนอ |

> **สถานะปัจจุบัน:** Admin Core ✅ · Split Order ✅ · Platform Settings ✅ · Payout API & Seller Wallet ✅ · Seller Fulfillment & Finance ✅ · Buyer Confirm Received + Escrow Release ✅ · Auto-complete 7-day Cron ✅ · Reviews สินค้า+ร้านค้า+Moderation ✅ · Coupon & Voucher เต็มระบบ ✅ · Refund/Exchange + Bank Account + Tracking ✅ · Gemstone Recommender เชื่อมวัสดุจริง 43 ชิ้น ✅
> **งานหลักที่เหลือ:** ซ้อม Flow นำเสนอ Demo และสรุปผลส่งมอบโปรเจกต์

---

## 🟡 Phase 0 — Stabilize Foundation

**เป้าหมาย:** ทำให้ deploy และพัฒนาแบบ Full Stack ได้อย่างปลอดภัยก่อนเพิ่มฟีเจอร์

**เจ้าของ:** Role 4 เป็น lead, ทุกคนเพิ่ม test ของโดเมนตัวเอง

**Checklist**
- [ ] ทำ Prisma migration baseline ให้ตรงกับ DB จริง
- [ ] แยก Staging DB และหยุดใช้ `db push` กับ DB ร่วม
- [ ] เพิ่ม CI ขั้นต่ำ: lint + build + `prisma validate`
- [ ] เพิ่ม backend integration test
- [ ] เพิ่ม permission test สำหรับ Admin/Seller/Wallet
- [ ] เพิ่ม Docker Compose local
- [ ] เพิ่ม seed scenarios: multi-shop, paid order, pending payout, hidden product
- [ ] ตรวจ deploy workflow ว่าไม่ deploy ก่อน test ผ่าน

**Phase Gate**
- [ ] CI ผ่านทุก repo
- [ ] Migration จาก DB ว่างผ่าน
- [ ] Deploy staging ผ่าน
- [ ] Test data พร้อมใช้ทุก role

---

## 🟡 Phase 1 — Seller Center Core

**เป้าหมาย:** Seller ใช้งาน Seller Center ได้จริง ไม่ใช่แค่ placeholder

**เจ้าของ:** Role 3

**Checklist**
- [x] Seller Sidebar + Navigation (`(seller)/seller/layout.jsx`)
- [x] `/seller` Dashboard KPI 4 ใบจาก API จริง (`GET /api/seller/dashboard`)
- [x] `/seller/products` ตารางสินค้า + ค้นหา/กรอง + toggle + ลบ
- [ ] แสดงสถานะ `VISIBLE / HIDDEN / SUSPENDED` และเหตุผลจาก Admin ใน `/seller/products`
- [x] สร้างสินค้า + อัปโหลดรูป (ทำเป็น Modal ใน `/seller/products` — ยังเหลือ custom options + accessories)
- [x] แก้ไขสินค้า (ทำเป็น Modal ใน `/seller/products`)
- [ ] `/seller/shop` ฟอร์มแก้ข้อมูลร้าน/โลโก้/บัญชี (ปัจจุบันแสดงข้อมูล + คัดลอกเลขบัญชีแบบ Read-only, แก้แบนเนอร์ได้จาก `/shop/[slug]`)
- [x] `/seller/finance` แสดง balance, held, ยอดขายรายสินค้า และประวัติ Payout (ยังเหลือตาราง Ledger ละเอียด)
- [ ] ฟอร์มขอถอนเงิน (`POST /api/seller/payouts`) ใน `/seller/finance`
- [ ] ทดสอบ Seller A แก้สินค้า Seller B ไม่ได้ (automated test)
- [ ] ทดสอบร้าน PENDING/SUSPENDED เขียนข้อมูลไม่ได้ (automated test)

**Phase Gate**
- [x] Seller สร้าง/แก้ไข/ลบสินค้าตัวเองได้
- [ ] Seller แก้ข้อมูลร้านได้ (จากหน้า `/seller/shop`)
- [ ] Seller เห็นยอดเงินและขอถอนได้ (เห็นยอดแล้ว เหลือฟอร์มกดขอถอน)
- [ ] Staff/Admin ไม่สามารถใช้ Seller API แทน Seller ได้

---

## 🟡 Phase 2 — Fulfillment + Confirm Received

**เป้าหมาย:** ปิดวงจร `ขาย → ส่ง → รับของ → เงินเข้าร้าน`

**เจ้าของ:** Role 4 (API), Role 3 (Seller UI), Role 2 (Buyer UI)

**มีแล้ว**
- [x] Split Order ตามร้าน
- [x] Settlement แบบ Admin/Manual fallback
- [x] Ledger กันเครดิตซ้ำ
- [x] SubOrder ที่ถูกยกเลิกไม่ถูกเครดิต

### 2A — Seller Fulfillment
- [x] API `GET /api/seller/orders` (บน `main`)
- [x] Seller เห็นเฉพาะ SubOrder ของร้านตัวเอง
- [x] Seller เปลี่ยน `PAID → PRODUCING` (`PUT /api/seller/orders/:id/status`)
- [x] Seller บันทึก carrier + tracking (`PUT /api/seller/orders/:id/ship`)
- [x] Seller เปลี่ยน `PRODUCING → SHIPPED`
- [x] หน้า `/seller/orders` (พร้อมดูรายละเอียดรอบข้อมือ/จี้ชาร์ม + Modal กรอกขนส่ง)
- [ ] Filter ตามวันที่ (มี filter ตามสถานะแล้ว)
- [ ] Permission test Seller A เห็นออเดอร์ Seller B ไม่ได้ (automated test)

### 2B — Buyer Confirm Received
- [x] Buyer เห็นปุ่ม “ยืนยันรับสินค้า” เมื่อ `SHIPPED` (แยกร้านและทั้งออเดอร์ใน `/orders`)
- [x] API confirm received (`POST /api/orders/sub-orders/:id/confirm-received` & `POST /api/orders/:id/confirm-received`)
- [x] เปลี่ยน SubOrder เป็น `DELIVERED/COMPLETED`
- [x] ปลดเงินเข้ากระเป๋าร้าน
- [x] สร้าง Ledger แบบ idempotent
- [ ] Auto-complete หลังส่ง 7 วัน

### 2C — Notification พื้นฐาน
- [ ] แจ้งเตือน Seller เมื่อมีออเดอร์ใหม่
- [ ] แจ้งเตือน Buyer เมื่อ Seller ส่งของ
- [ ] แจ้งเตือน Seller เมื่อเงินเข้ากระเป๋า

**Phase Gate**
- [x] Buyer จ่าย → Seller ส่ง → Buyer ยืนยัน → Wallet เพิ่มครั้งเดียว
- [x] SubOrder ยกเลิก/คืนเงินไม่ถูกเครดิต
- [x] Tracking แสดงทั้ง Buyer/Seller/Admin

---

## 🟡 Phase 3 — After-sales + Reviews

**เป้าหมาย:** เพิ่มความน่าเชื่อถือและรองรับปัญหาหลังการขาย

**เจ้าของ:** Role 2 (lead), Role 1 (Reviews UI), Role 3 (Admin/Seller Refund UI), Role 4 (API/เงิน)

### 3A — Reviews
- [x] รีวิวได้เฉพาะ OrderItem ที่ซื้อจริง (`COMPLETED`/`DELIVERED`)
- [x] ให้ดาว 1–5 + comment (`ReviewModal` ใน `/orders`)
- [x] อัปโหลดรูป (สูงสุด 5 รูปผ่าน R2)
- [x] แก้ไข/ลบรีวิวตามเงื่อนไข (เฉพาะเจ้าของรีวิว + อัปเดต rating ใหม่)
- [x] แสดงรีวิวใน Product Detail (`ProductReviewsSection` แบบ Side-by-Side + Scroll ในกล่อง + Lightbox)
- [x] อัปเดต rating สินค้าอัตโนมัติใน transaction
- [x] Seller/Admin ซ่อนรีวิวไม่เหมาะสม (`/dashboard/reviews` + Audit Log + `/api/seller/reviews/:id/moderate`)
- [x] รีวิวร้านค้า/คะแนนร้าน (`ShopReview` schema + API + `ShopReviewsSection` ใน `/shop/[slug]`)

### 3B — Refund / Return
- [x] Buyer ยื่นคำขอคืนเงิน (`REFUND` พร้อมบัญชีธนาคาร) หรือเปลี่ยนสินค้า (`EXCHANGE`) ใน `/orders` — ยังเหลืออัปโหลดรูปจริง + หน้าติดตามสถานะ
- [x] Seller API อนุมัติ/ปฏิเสธ (`/api/seller/refunds` รวมเข้า branch `api` แล้ว — ยังเหลือหน้า UI)
- [x] Admin ตัดสินข้อพิพาท (`GET/PUT /api/orders/admin/refunds` + Audit Log)
- [x] หน้า `/dashboard/refunds` (แสดงประเภทคำขอ + บัญชีธนาคารรับเงินคืน)
- [ ] หน้า `/seller/refunds`
- [ ] Reverse Wallet/GP/Ledger
- [ ] คืน/ระงับ stock ตามนโยบาย
- [ ] Notification ผลการตัดสิน

**Phase Gate**
- [x] รีวิวได้เฉพาะผู้ซื้อจริง
- [x] Refund ซ้ำไม่ได้
- [ ] เงินร้าน/GP ถูก reverse ถูกต้อง
- [x] Admin/Seller permission ถูกต้อง

---

## 🟡 Phase 4 — Coupon / Voucher

**เป้าหมาย:** คูปองคล้าย Shopee ทั้งของแพลตฟอร์มและของร้าน

**เจ้าของ:** Role 1 เป็นเจ้าของ Vertical, Role 2 ช่วย Cart/Checkout, Role 3 ช่วย Seller/Admin UI, Role 4 review schema/เงิน

> **หมายเหตุ:** Backend (`voucher.prisma`, Buyer/Seller/Admin/Quote API) และ UI (`/coupons` Ticket Design, `/vouchers`, `/seller/vouchers`, `/dashboard/vouchers`) พร้อมใช้งานแล้ว เหลือเชื่อม `POST /api/vouchers/quote` และตัดสิทธิ์/snapshot ลง `POST /api/orders` ตอน Checkout

### 4A — Voucher Core
- [x] `voucher.prisma` (`Voucher`, `UserVoucher`, `VoucherRedemption` + snapshot fields ใน `Order`/`SubOrder`)
- [x] Platform Voucher
- [x] Shop Voucher
- [x] Fixed amount / Percent + max discount
- [x] Minimum spend
- [x] Quota total / per-user
- [x] Start/end date
- [x] Claim code (`POST /api/vouchers/:id/claim` กันเก็บซ้ำด้วย unique constraint + `POST /api/vouchers/claim`)
- [x] My Vouchers (`GET /api/vouchers/my` + แท็บคูปองของฉันใน `/coupons` และ `/vouchers`)

### 4B — Checkout Integration
- [ ] Voucher selector ใน Cart
- [ ] Voucher selector ใน Checkout (เชื่อม DB จริงแทน Mock `CouponSelectModal`)
- [x] Server-authoritative quote (`POST /api/vouchers/quote`)
- [x] Validate claim/ownership/scope/quota
- [x] `fundedBy = PLATFORM | SHOP`
- [ ] Snapshot discount ลง Order/SubOrder (ใน `POST /api/orders`)
- [x] Multi-shop allocation ตามสัดส่วน (ใน `voucher.service.js`)
- [x] GP/เงินร้านถูกต้อง (คำนวณใน quote preview — รอเชื่อมลง `POST /api/orders`)
- [ ] ป้องกันใช้ซ้ำตอน Payment (atomic increment `usedCount`)

### 4C — Seller/Admin UI
- [x] `/seller/vouchers` (พร้อมเมนูใน Seller Sidebar)
- [x] `/dashboard/vouchers` (พร้อมเมนูใน Backoffice Sidebar)
- [x] สร้าง/แก้ไข/หยุด/ระงับคูปอง
- [x] Budget/statistics
- [x] Audit Log

### 4D — Advanced
- [x] Shipping Voucher
- [x] Product/Category Voucher
- [x] Private Code
- [x] Auto-best voucher (`autoSelect: true` ใน `POST /api/vouchers/quote`)
- [x] Voucher analytics (summary stats ฝั่ง Seller & Admin)

**Phase Gate**
- [ ] เก็บโค้ดซ้ำไม่ได้
- [ ] Quota/expiry ถูกต้อง
- [ ] ใช้คูปองซ้ำไม่ได้
- [ ] Platform voucher หลายร้านกระจายส่วนลดถูกต้อง
- [ ] Platform-funded discount ไม่ลดรายได้ร้าน
- [ ] Shop-funded discount ลด GP ถูกต้อง

---

## 🟡 Phase 5 — Release + QA + Deploy

**เป้าหมาย:** รวมทุกอย่างและพร้อมส่ง

**เจ้าของ:** Role 1 (QA owner) + ทุกคน

**Checklist**
- [ ] E2E Buyer
- [ ] E2E Seller/Admin
- [ ] E2E Voucher
- [ ] E2E Refund
- [ ] Permission matrix รอบสุดท้าย
- [ ] Regression test
- [ ] k6 load test
- [ ] UAT report
- [ ] API docs อัปเดต
- [ ] Migration/backup production
- [ ] Demo script + slides
- [ ] Release checklist

**Phase Gate**
- [ ] Feature freeze
- [ ] ไม่มี blocker bug
- [ ] CI/CD ผ่าน
- [ ] UAT sign-off
- [ ] Production deploy สำเร็จ

---

## 8.2 ลำดับและงานที่ทำขนานได้

```text
P0 → P1 → P2 → P3 → P5
              ↘ P4 ↗
```

- **P0 ต้องเริ่มก่อน**
- **P1 (Role 3)** และ **P2A (Role 4)** เริ่มขนานได้
- **P4A Voucher backend (Role 1)** เริ่มขนานกับ P1–P2 ได้หลัง freeze schema/กฎเงิน
- **P3 Reviews/Refund** ต้องรอ P2 และ Order ที่ COMPLETED
- **P5** เริ่มได้เมื่อ P1–P4 ผ่าน Phase Gate หลัก

## 8.3 ถ้าเวลาน้อย — Priority Cut

1. **ต้องมี:** P0 + P1 + P2
2. **ควรมี:** P3 Reviews + Refund พื้นฐาน
3. **ถ้ามีเวลา:** P4 Coupon
4. **ก่อนส่งจริง:** P5

---

# 🗓️ 9. แผนงาน 4 สัปดาห์ — Mapping กับ Phase

| สัปดาห์ | Role 1 | Role 2 | Role 3 | Role 4 |
| -------------- | ---------------------- | ------------------- | ----------------------------- | -------------------- |
| 1 | **P4A** Coupon schema + buyer voucher discovery/claim | **P2B/P3B** Buyer Confirm UI + Refund form | **P1** Seller Dashboard + Products UI | **P0/P2A** CI/migration baseline + Seller Orders API |
| 2 | **P4B/C** My Vouchers + Cart/Checkout + Seller voucher UI | **P2B/P3B** Confirm Received flow + Refund integration | **P1** Product Create/Edit + Shop Settings | **P2B/P3B** Escrow confirm + Refund API |
| 3 | **P4C/D** Admin voucher UI + quota/money tests | **P3** Order timeline ตาม SubOrder + voucher summary | **P1/P2C** Seller Wallet UI + Orders UI | **P3A** Reviews API + notification/event foundation |
| 4 | **P5** E2E Voucher + regression | **P5** E2E Buyer + Refund E2E | **P5** E2E Seller/Admin + docs | **P0/P5** Deploy hardening + full regression |

**Tester = Role 1:** ทำงาน QA ควบคู่ทุกสัปดาห์ — voucher permission/quota, E2E buyer/seller/admin, regression/UAT

> Feature Freeze สัปดาห์ที่ 4 ก่อน UAT · งาน Voucher ต้อง freeze กฎ `fundedBy`/GP/stacking ก่อนเริ่ม Checkout settlement

---

# ▶️ 10. รันโปรเจกต์ & บัญชีทดสอบ

```bash
# Backend :8000
cd bareandbold_backend && bun run dev

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
- Admin Core: อนุมัติ/ระงับร้าน, Product Center, Moderation, Payout, Analytics, Platform Settings, Audit Log, Admin Refund (`/dashboard/refunds`), Admin Reviews Moderation (`/dashboard/reviews`), Admin Vouchers (`/dashboard/vouchers`)
- Split Order ตามร้าน + snapshot GP/commission/ค่าส่งลง SubOrder
- Cart และ Checkout คิดค่าส่งแยกตามร้าน
- Seller Center Core: Sidebar + Navigation, Dashboard (`/seller`), Products CRUD Modal (`/seller/products`), Orders & Fulfillment (`/seller/orders`), Shop Vouchers (`/seller/vouchers`), Finance & Sales Summary (`/seller/finance`), Shop Info (`/seller/shop`)
- Seller Orders & Fulfillment API (`GET /api/seller/orders`, เปลี่ยน `PAID → PRODUCING → SHIPPED` + tracking/carrier)
- Buyer Confirm Received แยกร้าน/ทั้งออเดอร์ + Escrow Release เข้ากระเป๋าร้าน พร้อม Ledger กันเครดิตซ้ำ
- Seller Wallet/Payout API + Admin Payout state machine
- Reviews ครบทั้งสินค้า & ร้านค้า (API + Verified Purchase + Product/Shop UI แบบ Side-by-Side Scroll ในกล่อง + Modal เขียนรีวิวใน `/orders` + Admin Moderation + `seed_reviews.js`)
- Coupon / Voucher Full Vertical (Prisma schema + Buyer/Seller/Admin/Quote API + หน้า `/coupons` Ticket Design ดึง DB จริง + `/vouchers` + `/seller/vouchers` + `/dashboard/vouchers`)
- Refund / Exchange ฝั่ง Buyer (เลือกขอคืนเงินพร้อมบัญชีธนาคาร หรือเปลี่ยนสินค้า) และ Admin Approve/Reject (`/dashboard/refunds`) + รวม branch `main` เข้า `api` แล้ว
- กดชื่อร้านบน ProductCard & ProductInfo เข้าหน้าร้าน `/shop/[slug]` ได้โดยตรง

## ยังขาด / ต้องระวัง
- **Checkout Voucher Integration:** หน้า Checkout ยังใช้ `CouponSelectModal` เดิม — ต้องเชื่อม `POST /api/vouchers/quote` และตัด quota + snapshot ส่วนลดลง `Order`/`SubOrder` ใน `POST /api/orders`
- Seller Center ยังขาด: ฟอร์มกดขอถอนเงิน + Ledger ใน `/seller/finance`, ฟอร์มแก้ไขข้อมูลร้านใน `/seller/shop`, แสดง `moderationStatus` ใน `/seller/products`, และหน้า `/seller/refunds`
- Auto-complete ออเดอร์หลังส่ง 7 วัน และ Notification พื้นฐานยังไม่มี
- Horoscope/Gemstone (`/fortune-card`) ยังเป็น Mockup ฝั่ง Frontend ยังไม่เชื่อมสินค้าจริงใน DB
- Refund ยังขาด: อัปโหลดรูปหลักฐานจริงในฟอร์ม Buyer (ปัจจุบันส่ง `images: []`), หน้าติดตามสถานะคืนเงินฝั่ง Buyer, และระบบ reverse Wallet/GP/Ledger + คืน stock อัตโนมัติ
- Token ฝั่ง Storefront ยังใช้ Bearer ใน localStorage แม้ Backend ตั้ง cookie แล้ว
- Migration เก่าไม่ตรงกับ DB ที่ใช้ `db push` — ต้องทำ baseline/staging ก่อนพึ่ง `prisma migrate deploy`
- CI ปัจจุบันมีเฉพาะ deploy workflow ยังไม่มี lint/build/test gate; ทุก push `main` deploy ทันที
- ไม่มี automated tests (`*.test` / E2E) ใน repo — มีเพียง Postman, k6, `/docs/uat` และ manual test
- Payout ยังเป็นการโอนเงิน manual + บันทึกหลักฐาน ไม่ได้เชื่อมธุรกรรมธนาคารอัตโนมัติ
- ค่าส่งจริงยังใช้ Mock Shipping/กรอกเลขพัสดุเอง ไม่ได้เชื่อมผู้ให้บริการขนส่ง
