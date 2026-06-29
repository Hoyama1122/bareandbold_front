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
3. จัดการคำสั่งซื้อ การจัดส่งสินค้า (ผ่าน Mock Shipping) และการชำระเงินอย่างเป็นระบบด้วย Omise
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
3. ระบบค้นหาสินค้า ตะกร้าสินค้า และการชำระเงินออนไลน์ผ่าน Omise Payment Gateway
4. ระบบจัดการคำสั่งซื้อและจำลองการอัปเดตสถานะการจัดส่งพัสดุ (Mock Shipping API)
5. ระบบรายงานยอดขาย (Revenue Dashboard)

---

### 6. แนวทางการพัฒนาตาม SDLC (System Development Life Cycle)
1. **Planning:** วิเคราะห์ความต้องการและกำหนดขอบเขตของ Bracelet Marketplace
2. **Analysis:** วิเคราะห์กระบวนการทำงานและจำลองระบบ (Use Case, ER-Diagram)
3. **Design:** ออกแบบสถาปัตยกรรมระบบ ฐานข้อมูล และหน้าจอผู้ใช้งาน (UI/UX)
4. **Development:** เขียนโปรแกรมส่วน Frontend และ Backend รวมถึงเชื่อมต่อ API
5. **Testing:** ทดสอบการทำงานของฟังก์ชันต่างๆ และแก้ไขข้อผิดพลาด
6. **Deployment:** นำระบบขึ้นเผยแพร่ (Deploy) ให้ใช้งานได้จริง
7. **Maintenance:** บำรุงรักษาและปรับปรุงระบบตามข้อเสนอแนะ

---

### 7. เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Technologies)
**Frontend:**
- [x] React / Next.js
- [x] Tailwind CSS
**Backend:**
- [x] Node.js (รวมถึง Bun, Hono)
**Database:**
- [x] PostgreSQL (Neon) / Cloudflare R2
**External Services / APIs:**
- [x] Omise (แพลตฟอร์มรับชำระเงิน / Payment Gateway)
- [x] Mock Shipping API (การทำ Stub เพื่อจำลองระบบขนส่ง)
**Design Tool:**
- [x] Figma
- [x] อื่นๆ: Mermaid Diagram
**Version Control:**
- [x] Git
- [x] GitHub
- [x] SourceTree

---

### 8. แนวทางการทดสอบระบบ (Testing Approach)
**ประเภทการทดสอบ (Test Types):**
- [x] Functional Testing
- [x] User Acceptance Testing (UAT)

**เครื่องมือที่ใช้ (Tools):**
- [x] Postman (สำหรับทดสอบ API)
- [x] Manual Testing (ทดสอบการทำงานของระบบด้วยตนเองตามฟังก์ชันที่พัฒนา)

**รายละเอียดการทดสอบ:** 
ทดสอบระบบตะกร้าสินค้า การสั่งซื้อ การทำงานของการชำระเงิน (ทดสอบการเรียกใช้งาน API ของ Omise) และการจัดการสถานะออเดอร์ (ทดสอบผ่าน Mock Shipping) รวมถึงทดสอบการเรียกใช้งาน API ฝั่ง Backend ผ่าน Postman เพื่อตรวจสอบความถูกต้องของข้อมูล (Response Status) [2, 3]

---

### 9. ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes)
1. ได้ระบบ Marketplace ที่ใช้งานได้จริงสำหรับซื้อขายกำไลข้อมือและข้อเท้า
2. ผู้ขายมีระบบจัดการหน้าร้าน สินค้าคัสตอม และติดตามออเดอร์ที่ครบวงจร
3. ผู้ซื้อสามารถค้นหาสินค้า ชำระเงินได้อย่างปลอดภัย และติดตามสถานะการจัดส่งได้สะดวก
4. ได้เอกสารวิเคราะห์และออกแบบระบบที่ถูกต้องตามมาตรฐานการพัฒนาซอฟต์แวร์

---

### 10. แผนการดำเนินงาน 4 สัปดาห์ (Work Plan: 4 Weeks)
| สัปดาห์ (Week) | กิจกรรม (Activities) | รายละเอียดโดยย่อ (Brief Description) |
| :---: | :--- | :--- |
| **1** | วิเคราะห์และออกแบบระบบ (Analysis & Design) | รวบรวมความต้องการ ออกแบบ Use Case, ER-Diagram และ UI/UX |
| **2** | พัฒนา Frontend (Frontend Development) | พัฒนาหน้าจอผู้ใช้ (Buyer) และหน้าจัดการร้านค้า (Seller Dashboard) |
| **3** | พัฒนา Backend และฐานข้อมูล (Backend & Database Development) | สร้าง API จัดการสินค้า, เชื่อมต่อ Omise API สำหรับชำระเงิน และทำ Mock Shipping |
| **4** | ทดสอบระบบและนำเสนอผลงาน (Testing & Presentation) | ทำ Manual Testing/UAT ตรวจสอบบัค และเตรียมพรีเซนต์โปรเจกต์ |
## 3. System Architecture Diagram
ด้านล่างนี้คือแผนผังสถาปัตยกรรมระบบ (System Architecture) ของ Bracelet Marketplace ที่แสดงการเชื่อมต่อระหว่าง Frontend, Backend และ Database

---
# 📊 Analysis & Design Document: Bracelet Marketplace

เอกสารฉบับนี้จัดทำขึ้นเพื่อแสดงการวิเคราะห์และออกแบบสถาปัตยกรรมระบบ (System Architecture) สำหรับโครงงาน "Bracelet Marketplace" ซึ่งเป็นระบบ e-Commerce แบบ Multi-Vendor 

---

## 1. ขอบเขตของระบบ (System Scope)
ระบบได้รับการออกแบบเพื่อรองรับกลุ่มผู้ใช้งาน (Actors) 3 กลุ่มหลัก ได้แก่:
1. **ลูกค้า (Customer / Buyer):** ค้นหาสินค้า เพิ่มลงตะกร้า ชำระเงิน และติดตามสถานะพัสดุ
2. **พนักงาน (Staff / Seller):** จัดการข้อมูลสินค้า (พร้อมส่งและ Made-to-Order) จัดการออเดอร์ และอัปเดตสถานะการจัดส่ง
3. **ผู้จัดการ (Manager / Admin):** ดูแลระบบโดยรวม จัดการผู้ใช้งาน และดูรายงานสรุปยอดขายผ่าน Dashboard

---

## 2. หลักการออกแบบสถาปัตยกรรมซอฟต์แวร์ (Software Architectural Design Principles)
การออกแบบระบบยึดหลักการสำคัญเพื่อรองรับการขยายตัว (Scalability) และการบำรุงรักษา (Maintainability) ดังนี้:
* **Separation of Concerns (SoC):** แบ่งแยกหน้าที่ความรับผิดชอบของระบบออกเป็นเลเยอร์อย่างชัดเจน ได้แก่ สวนหน้า (Frontend), ส่วนประมวลผลหลัก (Backend) และระบบฐานข้อมูล (Database) เพื่อไม่ให้โค้ดผูกติดกันจนเกินไป
* **Loose Coupling:** การเชื่อมต่อระหว่าง Frontend และ Backend จะทำผ่าน RESTful API 
* **Testability:** ระบบออกแบบให้ทดสอบได้ง่าย โดยเฉพาะระบบขนส่งที่มีการใช้ **Mock Objects (Stub)** เข้ามาจำลองการทำงานของระบบขนส่งภายนอก เพื่อให้สามารถทดสอบระบบอัปเดตสถานะพัสดุได้โดยไม่ต้องพึ่งพาระบบขนส่งจริง

---

## 3. การออกแบบสถาปัตยกรรมระบบ (System Architecture Design)
ระบบแบ่งออกเป็น 4 ส่วนหลัก ดังนี้:

### 3.1 Frontend Architecture (ส่วนติดต่อผู้ใช้งาน)
*   **แนวคิดการออกแบบ:** พัฒนาด้วยรูปแบบ Component-Based Architecture (SPA) 
*   **เทคโนโลยีที่ใช้:** Next.js (React) สำหรับโครงสร้างเว็บ และ Tailwind CSS สำหรับการตกแต่ง UI
*   **รายละเอียด:** แบ่งการแสดงผลออกเป็น 3 ส่วนหลัก คือ หน้าเว็บสำหรับผู้ซื้อ (Buyer UI), หน้าจัดการร้านค้าสำหรับผู้ขาย (Seller Dashboard), และหน้าระบบหลังบ้าน (Admin Dashboard)

### 3.2 Backend Architecture (ส่วนประมวลผลหลัก)
*   **แนวคิดการออกแบบ:** ใช้สถาปัตยกรรมแบบให้บริการ API (RESTful API) 
*   **เทคโนโลยีที่ใช้:** Node.js (รันด้วย Bun / Hono) เพื่อประสิทธิภาพและความรวดเร็ว
*   **การแบ่งโมดูล (Services):**
    *   `Auth Service`: จัดการการสมัครสมาชิกและยืนยันตัวตน (JWT)
    *   `Product Service`: จัดการข้อมูลสินค้าและเชื่อมต่อกับ R2 สำหรับรูปภาพ
    *   `Order Service`: ตะกร้าสินค้าและการสร้างใบสั่งซื้อ
    *   `Payment Service`: รับชำระเงินผ่านการเชื่อมต่อ API ของ Omise
    *   `Shipping Service (Mock/Stub)`: จัดการสถานะการจัดส่งแบบจำลอง

### 3.3 Database Architecture (ระบบจัดเก็บข้อมูล)
*   **Relational Database:** ใช้ **PostgreSQL (Neon)** จัดเก็บข้อมูลที่มีความสัมพันธ์กัน เช่น ข้อมูลบัญชีผู้ใช้ ออเดอร์ และรายละเอียดสินค้า
*   **Cloud Storage:** ใช้ **Cloudflare R2** ในการเก็บไฟล์รูปภาพสินค้า เพื่อลดภาระของฐานข้อมูลหลักและเพิ่มความเร็วในการโหลด

### 3.4 External Services (บริการภายนอก)
*   **Payment Gateway:** เชื่อมต่อกับ **Omise API** เพื่อรับชำระเงินผ่านบัตรเครดิตและ PromptPay

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
        Auth["Auth Service"]
        Product["Product Service"]
        Order["Order & Cart Service"]
        Payment["Payment Service"]
        Shipping["Shipping Service <br> (Mock / Stub)"]
    end

    %% 4. Infrastructure & Database Layer
    subgraph Infrastructure ["Data & Storage Layer"]
        DB[("PostgreSQL <br> Neon")]
        Storage[("Cloud Storage <br> R2")]
    end

    %% 5. External Services Layer
    subgraph External ["External Services"]
        Omise["Omise <br> (Payment Gateway)"]
    end

    %% --- Connections ---
    
    Customer -->|เข้าใช้งาน| BuyerUI
    Seller -->|จัดการร้านค้า| SellerUI
    Admin -->|ดูแลระบบ| AdminUI

    BuyerUI -->|HTTP REST| Auth
    BuyerUI -->|HTTP REST| Product
    BuyerUI -->|HTTP REST| Order
    BuyerUI -->|HTTP REST| Payment
    BuyerUI -->|ติดตามพัสดุ| Shipping

    SellerUI -->|อัปเดตสถานะพัสดุ| Shipping
    SellerUI -->|จัดการออเดอร์| Order
    SellerUI -->|จัดการสินค้า| Product

    AdminUI -->|ดูรายงาน| Order
    AdminUI -->|จัดการระบบ| Auth

    Auth -->|Read/Write| DB
    Product -->|Read/Write| DB
    Product -->|Upload/Fetch| Storage
    Order -->|Read/Write| DB
    Payment -->|Verify/Update| DB
    
    %% Gateway & Mock Connections
    Payment -->|API Call| Omise
    Shipping -->|Mock Tracking Data| DB
