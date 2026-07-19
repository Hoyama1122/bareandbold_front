"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart.service";
import thailandAddresses from "../data/thailand-address.json";
import {
  ChevronLeft,
  ShoppingBag,
  Check,
  CreditCard,
  Landmark,
  QrCode,
  Truck,
  Lock,
  CheckCircle2,
  Package,
} from "lucide-react";

const INK = "#2B2118";
const CREAM = "#F2ECDD";
const CREAM_DEEP = "#EAE2CC";
const OLIVE = "#6B7A4E";
const OLIVE_DEEP = "#4F5B38";
const BORDER = "#E1D8C0";
const MUTED = "#8C8577";
const WHITE = "#FFFFFF";



const PROVINCES = ["กระบี่","กรุงเทพมหานคร","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครปฐม","นครพนม","นครราชสีมา",
"นครศรีธรรมราช","นครสวรรค์","นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่","พะเยา","ภูเก็ต","มหาสารคาม",
"มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย",
"สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์","หนองคาย","หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี"];

const PAYMENT_METHODS = [
  { id: "card", label: "บัตรเครดิต / เดบิต", desc: "Visa, Mastercard, JCB", icon: CreditCard },
  { id: "transfer", label: "โอนผ่านธนาคาร", desc: "แนบสลิปหลังชำระเงิน", icon: Landmark },
  { id: "promptpay", label: "พร้อมเพย์", desc: "สแกน QR เพื่อชำระเงิน", icon: QrCode },
  { id: "cod", label: "เก็บเงินปลายทาง", desc: "ชำระเงินเมื่อได้รับสินค้า", icon: Truck },
];

function baht(n) {
  return n.toLocaleString("th-TH");
}

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(10000 + Math.random() * 89999);
  return `BB${y}${m}-${rand}`;
}

function Field({ label, span2, required, ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${span2 ? "sm:col-span-2" : ""}`}>
      <span style={{ color: INK }}>
        {label}
        {required && <span style={{ color: OLIVE_DEEP }}> *</span>}
      </span>
      <input
        {...props}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{ border: `1px solid ${BORDER}`, background: CREAM }}
        onFocus={(e) => (e.target.style.borderColor = OLIVE)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </label>
  );
}

function StepDone({ label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: OLIVE_DEEP, color: "#fff" }}>
        <Check size={13} />
      </div>
      <span style={{ color: MUTED }}>{label}</span>
    </div>
  );
}

function StepActive({ label, num }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 kanit text-xs font-semibold" style={{ background: INK, color: CREAM }}>
        {num}
      </div>
      <span className="font-medium" style={{ color: INK }}>{label}</span>
    </div>
  );
}

function StepPending({ label, num }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
        {num}
      </div>
      <span style={{ color: MUTED }}>{label}</span>
    </div>
  );
}

function StepLine() {
  return 
  <div className="flex-1 h-px max-w-10" style={{ background: BORDER }} />;
}

function OrderSuccess({ orderNumber, total, router }) {
  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
      `}</style>
      <header style={{ background: WHITE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <button 
          onClick={() => router.push("/")} 
          className="kanit text-xl font-semibold" 
          style={{ color: INK }}>
            Bare &amp; Bold
          </button>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-6 py-16 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: OLIVE_DEEP }}
        >
          <CheckCircle2 size={30} color={WHITE} />
        </div>
        <h1 className="kanit text-2xl font-semibold mb-2">ขอบคุณสำหรับคำสั่งซื้อ</h1>
        <p className="text-sm mb-8" style={{ color: MUTED }}>
          เราได้รับคำสั่งซื้อของคุณแล้ว และกำลังเตรียมจัดส่งโดยเร็วที่สุด
        </p>

        <div className="rounded-xl p-6 text-left mb-8" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
          <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div>
              <p className="text-xs" style={{ color: MUTED }}>หมายเลขคำสั่งซื้อ</p>
              <p className="kanit font-semibold">{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: MUTED }}>ยอดชำระทั้งหมด</p>
              <p className="kanit font-semibold">฿{baht(total)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: CREAM_DEEP }}>
              <Package size={17} style={{ color: OLIVE_DEEP }} />
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              คาดว่าจะจัดส่งถึงภายใน 2-4 วันทำการ เราจะแจ้งเลขพัสดุให้ทางอีเมลอีกครั้ง
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 rounded-lg font-medium kanit"
            style={{ background: INK, color: CREAM }}
          >
            กลับสู่หน้าแรก
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="flex-1 py-3 rounded-lg font-medium kanit"
            style={{ border: `1.5px solid ${INK}`, color: INK }}
          >
            ดูสถานะคำสั่งซื้อ
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [payment, setPayment] = useState("card");
  const [saveInfo, setSaveInfo] = useState(true);
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const [zipCode, setZipCode] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSubDistricts, setAvailableSubDistricts] = useState([]);

  const handleZipCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipCode(val);
    
    if (val.length === 5) {
      const match = thailandAddresses.find(item => item.zipCode === val);
      if (match) {
        const provinces = match.provinceList.map(p => p.provinceName);
        const districts = match.districtList.map(d => d.districtName);
        const subDistricts = match.subDistrictList.map(sd => sd.subDistrictName);
        
        setAvailableDistricts(districts);
        setAvailableSubDistricts(subDistricts);
        
        setProvince(provinces[0] || "");
        setDistrict(districts[0] || "");
        setSubDistrict(subDistricts[0] || "");
      } else {
        setAvailableDistricts([]);
        setAvailableSubDistricts([]);
      }
    } else {
      setAvailableDistricts([]);
      setAvailableSubDistricts([]);
    }
  };

  useEffect(() => {
    const loadCart = () => {
      const cart = localStorage.getItem("bare_cart");
      if (cart) {
        setOrderItems(JSON.parse(cart));
      } else {
        setOrderItems([]);
      }
    };

    loadCart();
    cartService.fetchCart();

    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const subtotal = useMemo(() =>orderItems.reduce((s, it) => s + it.price * it.quantity,0),[orderItems]);
  const shipping = subtotal >= 2000 ? 0 : 90;
  const total = subtotal + shipping;
  const itemCount = orderItems.reduce((s, it) => s + it.quantity,0);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setOrderNumber(generateOrderNumber());
    setPlaced(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      await cartService.clearCart();
    } catch (err) {
      console.error("Failed to clear cart after placing order:", err);
    }
  };

  if (placed) {
    return <OrderSuccess 
    orderNumber={orderNumber} 
    total={total} 
    router={router}
     />;
  }

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
        input::placeholder { color: ${MUTED}; opacity: 0.8; }
      `}</style>


      <main className="max-w-6xl mx-auto px-6 py-10">
        <button 
        onClick={() => 
        router.push("/cart")} 
        className="flex items-center gap-1 text-sm mb-6" 
        style={{ color: MUTED }}>
          <ChevronLeft size={16} />
          กลับไปที่ตะกร้าสินค้า
        </button>

        <div className="flex items-center gap-3 mb-8 text-sm">
          <StepDone label="ตะกร้าสินค้า" />
          <StepLine />
          <StepActive num={2} label="ที่อยู่และชำระเงิน" />
          <StepLine />
          <StepPending num={3} label="ยืนยันคำสั่งซื้อ" />
        </div>

        <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-lg font-semibold mb-1">ที่อยู่สำหรับจัดส่ง</h2>
              <p className="text-sm mb-5" style={{ color: MUTED }}>
                กรอกข้อมูลผู้รับให้ครบถ้วนเพื่อความรวดเร็วในการจัดส่ง
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field required label="ชื่อ" placeholder="กรอกชื่อจริง" />
                <Field required label="นามสกุล" placeholder="กรอกนามสกุล" />
                <Field required label="เบอร์โทรศัพท์" placeholder="08X-XXX-XXXX" />
                <Field required label="อีเมล" placeholder="name@email.com" type="email" />
                <Field span2 required label="ที่อยู่" placeholder="บ้านเลขที่ ซอย ถนน" />
                <label className="flex flex-col gap-1.5 text-sm">
                  <span>จังหวัด <span style={{ color: OLIVE_DEEP }}> *</span></span>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                    style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
                    required
                  >
                    <option value="">เลือกจังหวัด</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
                {availableDistricts.length > 0 ? (
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span>เขต / อำเภอ <span style={{ color: OLIVE_DEEP }}> *</span></span>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
                      required
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <Field
                    required
                    label="เขต / อำเภอ"
                    placeholder="ระบุเขตหรืออำเภอ"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                )}
                {availableSubDistricts.length > 0 ? (
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span>แขวง / ตำบล <span style={{ color: OLIVE_DEEP }}> *</span></span>
                    <select
                      value={subDistrict}
                      onChange={(e) => setSubDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, background: CREAM, color: INK }}
                      required
                    >
                      {availableSubDistricts.map((sd) => (
                        <option key={sd} value={sd}>{sd}</option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <Field
                    required
                    label="แขวง / ตำบล"
                    placeholder="ระบุแขวงหรือตำบล"
                    value={subDistrict}
                    onChange={(e) => setSubDistrict(e.target.value)}
                  />
                )}
                <Field
                  required
                  label="รหัสไปรษณีย์"
                  placeholder="10XXX"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                />
                <Field span2 label="หมายเหตุถึงผู้จัดส่ง (ถ้ามี)" placeholder="เช่น ฝากไว้ที่นิติบุคคล" />
              </div>
              <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: OLIVE }}
                />
                <span style={{ color: MUTED }}>บันทึกข้อมูลนี้สำหรับการสั่งซื้อครั้งถัดไป</span>
              </label>
            </section>

            <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-lg font-semibold mb-1">ช่องทางการชำระเงิน</h2>
              <p className="text-sm mb-5" style={{ color: MUTED }}>
                เลือกวิธีที่สะดวกที่สุดสำหรับคุณ
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = payment === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className="flex items-start gap-3 rounded-lg p-4 text-left transition-colors"
                      style={{ border: `1.5px solid ${active ? INK : BORDER}`, background: active ? CREAM : WHITE }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: active ? INK : CREAM_DEEP, color: active ? CREAM : MUTED }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: MUTED }}>{m.desc}</p>
                      </div>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9999,
                          border: `1.5px solid ${active ? INK : BORDER}`,
                          background: active ? INK : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {active && <Check size={11} color={CREAM} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {payment === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <Field span2 required label="หมายเลขบัตร" placeholder="0000 0000 0000 0000" />
                  <Field required label="วันหมดอายุ" placeholder="MM/YY" />
                  <Field required label="CVV" placeholder="XXX" />
                </div>
              )}
              {payment === "promptpay" && (
                <div className="flex items-center gap-4 mt-5 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: CREAM_DEEP }}>
                    <QrCode size={36} style={{ color: MUTED }} />
                  </div>
                  <p className="text-sm" style={{ color: MUTED }}>
                    QR โค้ดจะปรากฏขึ้นหลังกดยืนยันคำสั่งซื้อ ใช้แอปธนาคารสแกนเพื่อชำระเงิน
                  </p>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 sticky top-6 flex flex-col gap-5" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-lg font-semibold">คำสั่งซื้อของคุณ</h2>
              <div className="flex flex-col gap-3">
                {orderItems.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-14 rounded-md object-cover"/>
                      <span
                        className="absolute -top-1.5 -right-1.5 text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center"
                        style={{ background: OLIVE, color: WHITE }}
                      >
                        {it.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{it.name}</p>
                      <p className="text-xs" style={{ color: MUTED }}>{it.variant || ""}</p>
                    </div>
                    <p className="text-sm font-medium flex-shrink-0">฿{baht(it.price * it.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 text-sm pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="flex justify-between">
                  <span style={{ color: MUTED }}>ยอดรวมสินค้า ({itemCount} ชิ้น)</span>
                  <span>฿{baht(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: MUTED }}>ค่าจัดส่ง</span>
                  <span>{shipping === 0 ? "ฟรี" : `฿${baht(shipping)}`}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <span className="kanit font-semibold">ยอดชำระทั้งหมด</span>
                <span className="kanit text-xl font-semibold">฿{baht(total)}</span>
              </div>
              <button type="submit" className="w-full py-3 rounded-lg font-medium kanit" style={{ background: INK, color: CREAM }}>
                ยืนยันคำสั่งซื้อ
              </button>
              <p className="text-xs text-center -mt-2 flex items-center justify-center gap-1.5" style={{ color: MUTED }}>
                <Lock size={11} />
                ข้อมูลของคุณได้รับการเข้ารหัสอย่างปลอดภัย
              </p>
            </div>  
          </div>
        </form>
      </main>
    </div>
  );
}