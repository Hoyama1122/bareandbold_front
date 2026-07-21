"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { authService } from "@/services/auth.service";
import { ChevronLeft, QrCode } from "lucide-react";

import { CREAM, INK, MUTED, WHITE, BORDER, OLIVE } from "@/components/checkout/constants";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import OrderSuccess from "@/components/checkout/OrderSuccess";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";

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

export default function CheckoutPage() {
  const router = useRouter();
  const [payment, setPayment] = useState("card");
  const [saveInfo, setSaveInfo] = useState(true);
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [savedTotal, setSavedTotal] = useState(0);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    authService.getProfile()
      .then((res) => {
        if (res.success && res.user) {
          setProfile(res.user);
        }
      })
      .catch((err) => {
        console.error("Failed to load user profile in checkout:", err);
      });
  }, []);

  // Address Selection States
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSubDistricts, setAvailableSubDistricts] = useState([]);
  const [availableZipCodes, setAvailableZipCodes] = useState([]);

  // Payment states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [chargeId, setChargeId] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleProvinceChange = (provinceVal) => {
    setProvince(provinceVal);
    setDistrict("");
    setSubDistrict("");
    setZipCode("");
    setAvailableSubDistricts([]);
    setAvailableZipCodes([]);

    if (!provinceVal) {
      setAvailableDistricts([]);
      return;
    }

    import("../../data/thailand-address.json").then((mod) => {
      const thailandAddresses = mod.default;
      const districts = [];
      const districtIds = new Set();
      thailandAddresses.forEach((item) => {
        const hasProv = item.provinceList?.some((p) => p.provinceName === provinceVal);
        if (hasProv) {
          item.districtList?.forEach((d) => {
            if (!districtIds.has(d.districtId)) {
              districtIds.add(d.districtId);
              districts.push(d.districtName);
            }
          });
        }
      });
      districts.sort();
      setAvailableDistricts(districts);
    });
  };

  const handleDistrictChange = (districtVal) => {
    setDistrict(districtVal);
    setSubDistrict("");
    setZipCode("");
    setAvailableZipCodes([]);

    if (!districtVal) {
      setAvailableSubDistricts([]);
      return;
    }

    import("../../data/thailand-address.json").then((mod) => {
      const thailandAddresses = mod.default;
      const subdistricts = [];
      const subdistrictIds = new Set();
      thailandAddresses.forEach((item) => {
        const hasProv = item.provinceList?.some((p) => p.provinceName === province);
        const hasDist = item.districtList?.some((d) => d.districtName === districtVal);
        if (hasProv && hasDist) {
          const distMatch = item.districtList?.find((d) => d.districtName === districtVal);
          item.subDistrictList?.forEach((sd) => {
            if (distMatch && sd.districtId === distMatch.districtId) {
              if (!subdistrictIds.has(sd.subDistrictId)) {
                subdistrictIds.add(sd.subDistrictId);
                subdistricts.push(sd.subDistrictName);
              }
            }
          });
        }
      });
      subdistricts.sort();
      setAvailableSubDistricts(subdistricts);
    });
  };

  const handleSubDistrictChange = (subDistrictVal) => {
    setSubDistrict(subDistrictVal);
    setZipCode("");

    if (!subDistrictVal) {
      setAvailableZipCodes([]);
      return;
    }

    import("../../data/thailand-address.json").then((mod) => {
      const thailandAddresses = mod.default;
      const zipcodes = [];
      thailandAddresses.forEach((item) => {
        const hasProv = item.provinceList?.some((p) => p.provinceName === province);
        const hasDist = item.districtList?.some((d) => d.districtName === district);
        const hasSub = item.subDistrictList?.some((sd) => sd.subDistrictName === subDistrictVal);
        if (hasProv && hasDist && hasSub) {
          if (!zipcodes.includes(item.zipCode)) {
            zipcodes.push(item.zipCode);
          }
        }
      });
      setAvailableZipCodes(zipcodes);

      if (zipcodes.length === 1) {
        setZipCode(zipcodes[0]);
      }
    });
  };

  const handleZipCodeChange = (zipCodeVal) => {
    setZipCode(zipCodeVal);

    if (zipCodeVal && zipCodeVal.length === 5) {
      import("../../data/thailand-address.json").then((mod) => {
        const thailandAddresses = mod.default;
        const matches = thailandAddresses.filter(item => item.zipCode === zipCodeVal);
        if (matches.length > 0) {
          const match = matches[0];
          const prov = match.provinceList?.[0]?.provinceName || "";
          
          if (prov) {
            setProvince(prov);
            
            // Extract districts
            const districts = [];
            const districtIds = new Set();
            thailandAddresses.forEach((item) => {
              const hasProv = item.provinceList?.some((p) => p.provinceName === prov);
              if (hasProv) {
                item.districtList?.forEach((d) => {
                  if (!districtIds.has(d.districtId)) {
                    districtIds.add(d.districtId);
                    districts.push(d.districtName);
                  }
                });
              }
            });
            districts.sort();
            setAvailableDistricts(districts);

            // Find unique districts matching this zip code
            const matchedDistricts = new Set();
            matches.forEach(m => {
              m.districtList?.forEach(d => matchedDistricts.add(d.districtName));
            });
            
            if (matchedDistricts.size === 1) {
              const dist = Array.from(matchedDistricts)[0];
              setDistrict(dist);

              // Extract subdistricts
              const subdistricts = [];
              const subdistrictIds = new Set();
              thailandAddresses.forEach((item) => {
                const hasProv = item.provinceList?.some((p) => p.provinceName === prov);
                const hasDist = item.districtList?.some((d) => d.districtName === dist);
                if (hasProv && hasDist) {
                  const distMatch = item.districtList?.find((d) => d.districtName === dist);
                  item.subDistrictList?.forEach((sd) => {
                    if (distMatch && sd.districtId === distMatch.districtId) {
                      if (!subdistrictIds.has(sd.subDistrictId)) {
                        subdistrictIds.add(sd.subDistrictId);
                        subdistricts.push(sd.subDistrictName);
                      }
                    }
                  });
                }
              });
              subdistricts.sort();
              setAvailableSubDistricts(subdistricts);

              const matchedSubDistricts = new Set();
              matches.forEach(m => {
                m.subDistrictList?.forEach(sd => matchedSubDistricts.add(sd.subDistrictName));
              });

              if (matchedSubDistricts.size === 1) {
                const subDist = Array.from(matchedSubDistricts)[0];
                setSubDistrict(subDist);
              }
            }
            
            setAvailableZipCodes([zipCodeVal]);
          }
        }
      });
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

  // Poll for payment success status when PromptPay QR is displayed
  useEffect(() => {
    if (!orderId || !showQR) return;

    const interval = setInterval(async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        const order = res?.order || res;
        if (order && order.status === "PAID") {
          setIsPaid(true);
          setPlaced(true);
          clearInterval(interval);
          try {
            await cartService.clearCart();
          } catch (err) {
            console.error("Failed to clear cart:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch order status during polling:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, showQR]);

  const subtotal = useMemo(() => orderItems.reduce((s, it) => s + it.price * it.quantity, 0), [orderItems]);
  const shipping = subtotal >= 300 ? 0 : 50;
  const total = subtotal + shipping;
  const itemCount = orderItems.reduce((s, it) => s + it.quantity, 0);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const recipientName = `${formData.get("firstName")} ${formData.get("lastName")}`;
      const recipientPhone = formData.get("phone");
      const addressDetail = formData.get("address");
      const notes = formData.get("notes") || "";

      const shippingAddress = `${addressDetail}, ${subDistrict}, ${district}, ${province} ${zipCode} ${notes ? `(หมายเหตุ: ${notes})` : ""}`;

      // 1. Create order on backend
      const orderRes = await orderService.createOrder({
        shippingAddress,
        recipientName,
        recipientPhone
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to create order");
      }

      setOrderId(orderRes.orderId);
      setOrderNumber(orderRes.orderId); // Use orderId as order number or custom format
      setSavedTotal(total);

      // 2. Process checkout payment
      const paymentMethodMapped = payment === "promptpay" ? "PROMPTPAY" : (payment === "card" ? "CREDIT_CARD" : payment.toUpperCase());
      const paymentRes = await paymentService.processCheckout({
        orderId: orderRes.orderId,
        method: paymentMethodMapped
      });

      if (payment === "promptpay") {
        setQrImageUrl(paymentRes.qrImageUrl);
        setChargeId(paymentRes.chargeId);
        setShowQR(true);
      } else {
        // Direct transition for COD / other mock payments
        setPlaced(true);
        await cartService.clearCart();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "การทำรายการขัดข้อง กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateWebhook = async () => {
    try {
      await paymentService.simulateWebhook({
        chargeId,
        status: "successful"
      });
    } catch (err) {
      console.error("Failed to simulate webhook:", err);
    }
  };

  if (placed) {
    return <OrderSuccess orderNumber={orderNumber} total={savedTotal || total} router={router} baht={baht} />;
  }

  if (showQR) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
          .kanit { font-family: 'Kanit', sans-serif; }
        `}</style>
        <main className="max-w-lg mx-auto px-6 py-16 text-center">
          <div className="rounded-xl p-6 mb-8" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
            <h1 className="kanit text-2xl font-bold mb-2">สแกนเพื่อชำระเงิน</h1>
            <p className="text-sm mb-6" style={{ color: MUTED }}>
              กรุณาใช้แอปธนาคารสแกน QR Code ด้านล่างเพื่อชำระเงินจำนวน ฿{baht(total)}
            </p>
            
            <div className="flex justify-center mb-6">
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="PromptPay QR Code" className="w-64 h-64 border border-dashed p-2 rounded-lg" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-zinc-100 rounded-lg">
                  <span className="animate-pulse text-sm text-zinc-400">กำลังดาวน์โหลด QR Code...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-[#6B7A4E] font-medium animate-pulse mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B7A4E]" />
              กำลังรอการชำระเงิน... (สถานะจะอัปเดตอัตโนมัติ)
            </div>

            <button
              onClick={handleSimulateWebhook}
              className="w-full py-2.5 rounded-lg text-xs font-semibold hover:bg-zinc-100 transition"
              style={{ border: `1.5px dashed ${INK}`, color: INK }}
            >
              จำลองการชำระเงินสำเร็จ (Simulate Webhook)
            </button>
          </div>
        </main>
      </div>
    );
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
          onClick={() => router.push("/cart")}
          className="flex items-center gap-1 text-sm mb-6"
          style={{ color: MUTED }}
        >
          <ChevronLeft size={16} />
          กลับไปที่ตะกร้าสินค้า
        </button>

        <CheckoutSteps currentStep={2} />

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ShippingForm
              profile={profile}
              province={province}
              district={district}
              subDistrict={subDistrict}
              zipCode={zipCode}
              availableDistricts={availableDistricts}
              availableSubDistricts={availableSubDistricts}
              availableZipCodes={availableZipCodes}
              handleProvinceChange={handleProvinceChange}
              handleDistrictChange={handleDistrictChange}
              handleSubDistrictChange={handleSubDistrictChange}
              handleZipCodeChange={handleZipCodeChange}
              saveInfo={saveInfo}
              setSaveInfo={setSaveInfo}
            />

            <PaymentForm payment={payment} setPayment={setPayment} />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              orderItems={orderItems}
              itemCount={itemCount}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              baht={baht}
              loading={loading}
            />
          </div>
        </form>
      </main>
    </div>
  );
}