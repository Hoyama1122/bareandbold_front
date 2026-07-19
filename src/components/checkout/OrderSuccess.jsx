import React from "react";
import { CheckCircle2, Package } from "lucide-react";
import { CREAM, INK, WHITE, BORDER, MUTED, OLIVE_DEEP, CREAM_DEEP } from "./constants";

export default function OrderSuccess({ orderNumber, total, router, baht }) {
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
            style={{ color: INK }}
          >
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
