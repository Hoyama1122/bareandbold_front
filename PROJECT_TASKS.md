# 📋 PROJECT_TASKS — Bare & Bold Marketplace

> อัปเดตล่าสุด: **10 พ.ย. 2026**
> ทีม **4 คน** · เป้าหมายเทอมนี้: ปิด core flow + Seller Center + Admin approval
> **Tester = Role 1** (บทบาทที่ 2 ของ Role 1) — ไม่มีคนที่ 5 (ดูข้อ 5)

**สัญลักษณ์:** ✅ เสร็จแล้ว · 🟡 ทำบางส่วน/API พร้อมแต่ UI ยังไม่ทำ · ❌ ยังไม่เริ่ม

---

## 0. ทีม 4 คน — ใครทำอะไร (ภาพรวม)

| Role                | ตำแหน่ง                                                 | ดูแลอะไร                                                                                                        | โฟลเดอร์หลัก                                                  | สถานะรวม |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------- |
| 🔵 **Role 1** | Frontend Engineer (Storefront & Catalog) + **Tester/QA** | หน้าร้านผู้ซื้อ, ค้นหา/กรอง, หน้าร้าน public, ดูดวง/หินมงคล + test plan/UAT | `bareandbold_front/src/app/(storefront)/` + `bareandbold_backend/k6/` | 🟡               |
| 🟢 **Role 2** | Frontend Engineer (Cart, Checkout & Orders)                    | ตะกร้า, ชำระเงิน, ประวัติออเดอร์, รีวิว, คืนเงิน                                | `bareandbold_front/src/app/(storefront)/`                               | 🟡               |
| 🟠 **Role 3** | Fullstack Engineer (Seller Center & Admin)                     | เปิดร้าน, Seller Center, หลังบ้านแอดมิน                                                           | `bareandbold_front/src/app/(seller)/` + `bareandbold_backoffice/`     | 🟡               |
| 🟣 **Role 4** | Backend & Database Engineer                                    | API, ฐานข้อมูล, เงิน/Escrow, Payment, Deploy                                                               | `bareandbold_backend/`                                                  | 🟡               |

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

## 1.3 งานที่ต้องส่ง

- ตัวกรองราคา/ขนาด + sort ใช้งานได้จริง
- การ์ดร้านในหน้ารายละเอียดสินค้า
- หน้า Wishlist เต็มรูปแบบ
- หน้า Horoscope + ผลทำนาย + สินค้าที่ตรง
- Reviews UI ในหน้ารายละเอียด
- **งาน QA:** test plan, permission matrix, regression, UAT report (รายละเอียดข้อ 5)

## 1.4 Definition of Done

- มี loading / empty / error state
- ใช้งานได้บนมือถือและเดสก์ท็อป
- ไม่แก้ backend เองโดยไม่แจ้ง Role 4
- ข้อมูลร้าน/สินค้าตรงกับ API จริง

## 1.5 ต้องประสานกับ

- **Role 4** — API filter/reviews/gemstone + test data/k6
- **Role 2** — รีวิวที่แสดงต้องมาจากการซื้อจริง + E2E buyer
- **Role 3** — E2E seller/admin
- **ทุกคน** — เก็บ bug และ retest

---

# 🟢 Role 2 — Frontend Engineer (Cart, Checkout, Orders & Reviews)

## 2.1 ดูแลอะไร

-flow ฝั่งผู้ซื้อตั้งแต่หยิบสินค้าใส่ตะกร้า จ่ายเงิน ติดตามพัสดุ จนถึงรีวิวและขอคืนเงิน

## 2.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน                            | คืออะไร                                       | สถานะ | ทำแล้ว                                                  | เหลือทำ                                                         | ไฟล์ / API                                                     |
| ------------------------------------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Auth Flow                                   | เข้าสู่ระบบ/โปรไฟล์/ที่อยู่ | ✅         | `/login`, AuthContext, `/profile`, สมุดที่อยู่ | ย้าย token เป็น httpOnly cookie                                | `login/`, `profile/`, `auth.service.js`                      |
| Cart                                        | ตะกร้าสินค้า                             | 🟡         | เพิ่ม/ลด/ลบ, ค่าส่ง, promo                     | จัดกลุ่มตามร้าน + checkbox + ค่าส่งแยกร้าน | `cart/page.jsx`, `/api/cart`                                   |
| Checkout                                    | สรุปคำสั่งซื้อ + จ่ายเงิน      | 🟡         | ที่อยู่, PromptPay QR                                  | สรุปแยกตามร้าน                                           | `checkout/page.jsx`, `/api/orders`, `/api/payments`          |
| Orders / Tracking                           | ประวัติ + สถานะพัสดุ                | 🟡         | แท็บสถานะ, QR modal                                  | Timeline ตรงกับ SubOrder                                         | `orders/page.jsx`                                                |
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

- **Role 4** — Split Order, confirm received, reviews, refund API
- **Role 3** — Backoffice refund page

---

# 🟠 Role 3 — Fullstack Engineer (Seller Center & Admin)

## 3.1 ดูแลอะไร

ระบบเปิดร้าน, Seller Center, การจัดการสินค้า/ออเดอร์ของร้าน และ Backoffice สำหรับ Admin/Staff

## 3.2 ฟังก์ชันที่รับผิดชอบ

| ฟังก์ชัน    | คืออะไร                      | สถานะ | ทำแล้ว                                     | เหลือทำ                                  | ไฟล์ / API                                        |
| ------------------- | ----------------------------------- | ---------- | ------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------- |
| Seller Onboarding   | สมัครเปิดร้าน + KYC    | ✅         | ฟอร์ม, สถานะ PENDING/REJECTED/APPROVED | —                                              | `(storefront)/become-seller/`, `/api/shops/apply` |
| Admin Shop Approval | อนุมัติ/ปฏิเสธร้าน | ✅         | หน้า `/dashboard/shops` + API + mask KYC   | Audit log                                       | `backoffice /dashboard/shops`, `/api/admin/shops` |
| Seller Shell        | โครง Seller Center + guard      | ✅         | layout, topbar, guard, placeholder               | —                                              | `(seller)/seller/layout.jsx`                        |
|                     |                                     |            |                                                  |                                                 |                                                       |
| Admin Payout        | อนุมัติถอนเงิน        | ❌         | —                                               | API + หน้า `/dashboard/payouts`           | `/api/admin/payouts`                                |
| Admin Moderation    | ซ่อน/ระงับสินค้า     | ❌         | —                                               | API + หน้า moderation                       | `/api/admin/products/:id/moderate`                  |
| Admin Analytics     | GMV + commission                    | ❌         | —                                               | API + หน้า dashboard                        | `/api/admin/analytics`                              |
| Platform Settings   | GP/ค่าส่ง/ฟรีส่ง        | ❌         | —                                               | API + หน้า `/dashboard/settings/platform` | `/api/admin/settings`                               |

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
| Orders         | `seller/orders/page.jsx`             | ยังไม่มี                     | empty state “รอ Split Order”                 |
| Wallet         | `seller/wallet/page.jsx`             | ยังไม่มี                     | แสดง balance + empty state                   |

**กติกาสำคัญ**

- Seller ต้องมีร้าน APPROVED จึงจะเขียนข้อมูลได้
- ห้ามส่ง `shopId` จาก client — backend ผูกให้
- แก้ได้เฉพาะสินค้าของร้านตัวเอง
- Upload ใช้ `POST /api/upload?folder=products`
- ใช้ `useAuth()` จาก `@/context/AuthContext`
- Layout guard จัดการ redirect ให้แล้ว

**ห้ามแตะ**

- `src/app/(storefront)/*`
- `src/app/layout.jsx`
- `src/context/AuthContext.jsx`
- `bareandbold_backend/*` (แจ้ง Role 4)

## 3.4 Definition of Done

- ใช้ API ที่มีอยู่จริง ไม่ hardcode
- มี loading / empty / error
- Responsive
- ไม่ส่ง `shopId` เอง
- ผ่าน permission test seller/admin

## 3.5 ต้องประสานกับ

- **Role 4** — Split Order, Wallet, Admin APIs
- **Role 2** — Admin refund UI

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
| Payment / Omise              | ตัดเงิน + webhook               | 🟡         | charge + webhook + mock                             | Escrow + SubOrder PAID            | `/api/payments`                            |
| Split Order                  | แตกออเดอร์ตามร้าน     | ❌         | —                                                  | checkout → SubOrder              | `POST /api/orders/checkout`                |
| Escrow / Confirm             | ปลดเงินให้ร้าน           | ❌         | —                                                  | confirm + GP 5% + ShopTransaction | `/api/orders/:subOrderId/confirm-received` |
| Seller Fulfillment           | ผลิต/จัดส่ง/tracking         | ❌         | —                                                  | status + ship APIs                | `/api/seller/orders`                       |
| Reviews API + Reiew ร้าน | รีวิว + rating                    | ❌         | —                                                  | POST + GET + อัปเดต rating  | `/api/reviews`                             |
| Wallet / Payout API          | ยอดเงิน + ถอนเงิน        | ❌         | —                                                  | wallet + payout request           | `/api/seller/wallet`                       |
| Refund API                   | คำขอคืนเงิน                 | ❌         | —                                                  | buyer + admin                     | `/api/refunds`                             |
| Admin APIs                   | Payout/Moderation/Analytics            | ❌         | —                                                  | APIs สำหรับ Backoffice      | `/api/admin/...`                           |
| Platform Settings API        | GP/ค่าส่ง/ฟรีส่ง           | ❌         | —                                                  | settings + public config          | `/api/admin/settings`                      |
| Gemstone Support             | รีวิว API ของ Role 1           | ❌         | —                                                  | review route + query              | `/api/recommend/gemstones`                 |
| Auto-complete                | ปิดออเดอร์อัตโนมัติ | ❌         | —                                                  | job หลังส่ง 7 วัน       | cron/job                                     |
| Deploy                       | ขึ้นเซิร์ฟเวอร์จริง | ❌         | —                                                  | env + hosting                     | —                                           |

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
| E2E Seller/Admin  | 🟡         | flow เปิดร้าน/อนุมัติ/ลงสินค้าทดสอบแล้ว | ทำเป็นชุดอัตโนมัติ        | `e2e/seller/`                            |
| Regression        | ❌         | —                                                                      | checklist + รันก่อนส่ง            | `TEST_PLAN.md`                           |
| UAT               | ❌         | —                                                                      | UAT cases + report                          | `UAT_REPORT.md`                          |
| Test Data         | ✅         | `seed_roles.js` + บัญชีทดสอบ                                | เพิ่ม seed order/review/refund         | `seed_roles.js`                          |

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

| งาน            | ต้องรอ                          |
| ----------------- | ------------------------------------- |
| Seller Orders     | Split Order                           |
| Seller Wallet     | Escrow + Payout API                   |
| Confirm Received  | Split Order + Escrow                  |
| Admin Payout      | Wallet/Payout API                     |
| Reviews           | Order ที่ COMPLETED                |
| Refund            | Order/SubOrder ที่ชำระแล้ว |
| Platform Settings | checkout + escrow อ่านค่า      |
| Admin Analytics   | Split Order + Payment                 |

> เริ่มได้เลยไม่ต้องรอ: Seller Dashboard, Seller Products, Shop Settings, Storefront filter, Wishlist, Horoscope, SEO

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
| 1. Database Schema             | ✅                                                                  |
| 2. Auth & Seller Onboarding    | ✅                                                                  |
| 3. Catalog & Shop              | 🟡                                                                  |
| 3.5 Horoscope                  | ❌                                                                  |
| 4. Cart / Split Order / Escrow | ❌                                                                  |
| 5. Fulfillment & Tracking      | ❌                                                                  |
| 6. Seller Center & Wallet      | 🟡                                                                  |
| 7. Admin Backoffice            | 🟡                                                                  |
| 8. Testing & Deploy            | 🟡 (Role 1: smoke/permission/k6 ผ่าน; E2E/UAT ยังไม่ทำ) |
| 9. Extended Scope              | ❌                                                                  |

---

# 🗓️ 9. แผน 4 สัปดาห์

| สัปดาห์ | Role 1                 | Role 2              | Role 3                        | Role 4               |
| -------------- | ---------------------- | ------------------- | ----------------------------- | -------------------- |
| 1              | Filter + Sort          | Cart group by shop  | Seller dashboard + products   | Split Order          |
| 2              | Shop card + Reviews UI | Checkout + Timeline | Product form + shop settings  | Escrow + Confirm     |
| 3              | Wishlist + Gemstone    | Review + Refund UI  | Orders + Wallet + Admin pages | Wallet + Reviews API |
| 4              | Responsive             | E2E Buyer           | E2E Seller/Admin              | Refund + Deploy      |

**Tester = Role 1:** ทำงาน QA ควบคู่ทุกสัปดาห์ — Week 1 test plan/API smoke · Week 2 E2E buyer · Week 3 E2E seller/admin · Week 4 regression/UAT

> Feature Freeze สัปดาห์ที่ 3 · สัปดาห์ที่ 4 เน้น integration / bug fix / UAT / demo

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

- Seller Orders / Wallet จริงยังทำไม่ได้ — รอ Split Order + Escrow
- Reviews / Refund ยังไม่มี API
- Token ใช้ Bearer ใน localStorage (ยังไม่ใช่ httpOnly cookie)
- Seller Center เป็น scaffold — หน้า dashboard/products/orders/wallet ยังว่าง
- Product detail ยังไม่มีการ์ดร้าน และยังไม่มี reviews UI
- Cart ยังไม่จัดกลุ่มตามร้าน
