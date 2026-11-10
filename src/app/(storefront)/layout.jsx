import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Layout ของฝั่ง Buyer / Storefront
 * - มี Header + Footer ของหน้าร้าน
 * - ไม่ใช้ร่วมกับ Seller Center (แยกที่ src/app/(seller))
 */
export default function StorefrontLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
