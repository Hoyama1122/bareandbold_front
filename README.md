# แบบฟอร์มขออนุมัติโครงงานกลุ่ม 
**รายวิชา CSI204 ดิจิทัลแพลตฟอร์มสำหรับพัฒนาซอฟต์แวร์**
**ภาคการศึกษา:** 3 (Summer) **ปีการศึกษา:** 2568 
**Domain:** e-Commerce

---

### 1. ข้อมูลกลุ่ม (Group Information) 
**ชื่อกลุ่ม:** Bracelet Marketplace
**จำนวนสมาชิก:** 4 / 5 คน

| ลำดับ | รหัสนักศึกษา | ชื่อ-สกุล | หน้าที่รับผิดชอบ (Roles) |
| :---: | :--- | :--- | :--- |
| 1 | 67095025 | ณภัทร พลดงนอก | Project Manager / System Analyst |
| 2 | 67136081 | ภาณุพัฒน์ อ่อนตา | Frontend Developer |
| 3 | 67150301 | สุพิชญาณ์ ชื่นชม | Backend Developer |
| 4 | 67146201 | ธราธร พัฒนพวงสิทธิ์ | Database Admin / Software Tester |
*(หมายเหตุ: หน้าที่รับผิดชอบสามารถปรับเปลี่ยนได้ตามความเหมาะสมของกลุ่ม)*

---

### 2. ชื่อโครงงาน (Project Title)
**ชื่อโครงงาน (ภาษาไทย):** ระบบตลาดซื้อขายกำไลข้อมือและกำไลข้อเท้าแบบมัลติเวนเดอร์
**ชื่อโครงงาน (ภาษาอังกฤษ):** Bracelet Marketplace (Multi-Vendor E-Commerce Website)

---

### 3. หลักการและเหตุผล (Rationale)
เพื่อเพิ่มช่องทางขายสินค้าให้กับผู้ผลิตกำไลและรองรับธุรกิจขนาดเล็ก รวมถึงช่วยให้ลูกค้าสามารถสั่งสินค้าคัสตอม (Made-to-Order) เฉพาะบุคคลได้ง่ายขึ้น พร้อมทั้งมีระบบช่วยลดขั้นตอนการจัดการคำสั่งซื้อและการจัดส่งของผู้ขายให้เป็นระบบมากยิ่งขึ้น

---

### 4. วัตถุประสงค์ของโครงงาน (Objectives)
1. สร้างแพลตฟอร์ม e-Commerce เฉพาะกลุ่มสำหรับซื้อขายกำไลข้อมือและกำไลข้อเท้า
2. รองรับผู้ขายหลายร้านภายในระบบเดียว (Multi-Vendor) และรองรับสินค้าสั่งทำ (Custom)
3. จัดการคำสั่งซื้อ การจัดส่งสินค้า และการชำระเงินอย่างเป็นระบบ
4. แสดงรายได้และยอดขายของผู้ขายในรูปแบบ Dashboard แบบเรียลไทม์

---

### 5. ขอบเขตของระบบ (System Scope)
**ผู้ใช้งาน (Actors):**
- [x] ลูกค้า (Customer) - *ผู้ซื้อ*
- [x] พนักงาน (Staff) - *ผู้ขาย / ร้านค้า*
- [x] ผู้จัดการ (Manager) - *ผู้ดูแลระบบ / Admin*

**ความสามารถหลักของระบบ (Main Functions):**
1. ระบบสมาชิก (Register / Login) สำหรับผู้ซื้อและผู้ขาย
2. ระบบจัดการข้อมูลสินค้า (รองรับสินค้าพร้อมส่ง และ สินค้า Made-to-Order)
3. ระบบค้นหาสินค้า ตะกร้าสินค้า และการชำระเงิน
4. ระบบจัดการคำสั่งซื้อและอัปเดตสถานะการจัดส่งพัสดุ
5. ระบบรายงานยอดขาย (Revenue Dashboard)

---

### 6. แนวทางการพัฒนาตาม SDLC (System Development Life Cycle) [1, 4]
1. **Planning:** วิเคราะห์ความต้องการและกำหนดขอบเขตของ Bracelet Marketplace
2. **Analysis:** วิเคราะห์กระบวนการทำงานและจำลองระบบ (Use Case, ER-Diagram)
3. **Design:** ออกแบบสถาปัตยกรรมระบบ ฐานข้อมูล และหน้าจอผู้ใช้งาน (UI/UX)
4. **Development:** เขียนโปรแกรมส่วน Frontend และ Backend
5. **Testing:** ทดสอบการทำงานของฟังก์ชันต่างๆ และแก้ไขข้อผิดพลาด
6. **Deployment:** นำระบบขึ้นเผยแพร่ (Deploy) ให้ใช้งานได้จริง
7. **Maintenance:** บำรุงรักษาและปรับปรุงระบบตามข้อเสนอแนะ

---

### 7. เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Technologies) [1]
**Frontend:**
- [x] React / Next.js
- [x] Tailwind CSS
**Backend:**
- [x] Node.js (รวมถึง Bun, Hono)
**Database:**
- [x] PostgreSQL (Neon) / Cloudflare R2
**Design Tool:**
- [x] Figma
- [x] อื่นๆ: Mermaid Diagram
**Version Control:**
- [x] Git
- [x] GitHub
- [x] SourceTree

---

### 8. แนวทางการทดสอบระบบ (Testing Approach) [1]
**ประเภทการทดสอบ (Test Types):**
- [x] Functional Testing
- [x] User Acceptance Testing (UAT)

**เครื่องมือที่ใช้ (Tools):**
- [x] Postman (สำหรับทดสอบ API) [5]
- [x] Manual Testing (ทดสอบการทำงานของระบบด้วยตนเองตามฟังก์ชันที่พัฒนา) [1, 2]

**รายละเอียดการทดสอบ:** 
ทดสอบระบบตะกร้าสินค้า การสั่งซื้อ การชำระเงิน และการจัดการสถานะออเดอร์ รวมถึงทดสอบการเรียกใช้งาน API ฝั่ง Backend ผ่าน Postman เพื่อตรวจสอบความถูกต้องของข้อมูล [2, 5]

---

### 9. ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes) [1]
1. ได้ระบบ Marketplace ที่ใช้งานได้จริงสำหรับซื้อขายกำไลข้อมือและข้อเท้า
2. ผู้ขายมีระบบจัดการหน้าร้าน สินค้าคัสตอม และติดตามออเดอร์ที่ครบวงจร
3. ผู้ซื้อสามารถค้นหาสินค้าและติดตามสถานะการจัดส่งได้อย่างสะดวกรวดเร็ว
4. ได้เอกสารวิเคราะห์และออกแบบระบบที่ถูกต้องตามมาตรฐานการพัฒนาซอฟต์แวร์

---

### 10. แผนการดำเนินงาน 4 สัปดาห์ (Work Plan: 4 Weeks) [1]
| สัปดาห์ (Week) | กิจกรรม (Activities) | รายละเอียดโดยย่อ (Brief Description) |
| :---: | :--- | :--- |
| **1** | วิเคราะห์และออกแบบระบบ (Analysis & Design) | รวบรวมความต้องการ ออกแบบ Use Case, ER-Diagram และ UI/UX |
| **2** | พัฒนา Frontend (Frontend Development) | พัฒนาหน้าจอผู้ใช้ (Buyer) และหน้าจัดการร้านค้า (Seller Dashboard) |
| **3** | พัฒนา Backend และฐานข้อมูล (Backend & Database Development) | สร้าง API จัดการสินค้า ออเดอร์ และเชื่อมต่อกับ PostgreSQL |
| **4** | ทดสอบระบบและนำเสนอผลงาน (Testing & Presentation) | ทำ Manual Testing/UAT ตรวจสอบบัค และเตรียมพรีเซนต์โปรเจกต์ |
## 3. System Architecture Diagram
ด้านล่างนี้คือแผนผังสถาปัตยกรรมระบบ (System Architecture) ของ Bracelet Marketplace ที่แสดงการเชื่อมต่อระหว่าง Frontend, Backend และ Database

---

```mermaid
graph TD
    %% 1. Actors Layer
    Customer(["Customer / Buyer"])
    Seller(["Seller / Vendor"])
    Admin(["Platform Admin"])

    %% 2. Frontend Layer
    subgraph Frontend ["Frontend Layer (Next.js & Tailwind)"]
        BuyerUI["Buyer Interface"]
        SellerUI["Seller Dashboard"]
        AdminUI["Admin Dashboard"]
    end

    %% 3. Backend Layer
    subgraph Backend ["Backend API Layer (Node.js / Bun / Hono)"]
        Auth["Auth Service <br> JWT"]
        Product["Product Service"]
        Order["Order & Cart Service"]
        Payment["Payment Service"]
    end

    %% 4. Infrastructure & Database Layer
    subgraph Infrastructure ["Data & Storage Layer"]
        DB[("PostgreSQL <br> Neon")]
        Storage[("Cloud Storage <br> Cloudflare R2")]
    end

    %% --- Connections ---
    
    %% Users to Frontend
    Customer -->|เข้าใช้งาน| BuyerUI
    Seller -->|จัดการร้านค้า| SellerUI
    Admin -->|ดูแลระบบ| AdminUI

    %% Frontend to Backend (API Calls)
    BuyerUI -->|HTTP REST| Auth
    BuyerUI -->|HTTP REST| Product
    BuyerUI -->|HTTP REST| Order
    BuyerUI -->|HTTP REST| Payment

    SellerUI -->|HTTP REST| Auth
    SellerUI -->|HTTP REST| Product
    SellerUI -->|HTTP REST| Order

    AdminUI -->|HTTP REST| Auth
    AdminUI -->|HTTP REST| Product
    AdminUI -->|HTTP REST| Order
    AdminUI -->|HTTP REST| Payment

    %% Backend to Database & Storage
    Auth -->|Read/Write| DB
    Product -->|Read/Write| DB
    Product -->|Upload/Fetch Images| Storage
    Order -->|Read/Write| DB
    Payment -->|Read/Write| DB
