import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "BARE & BOLD | ร้านค้าออนไลน์สไตล์มินิมอล",
  description: "พบกับสินค้าแฟชั่น เครื่องประดับ และสร้อยข้อมือแฮนด์เมดพรีเมียมจาก BARE & BOLD",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="th"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#3C322A] font-anuphan antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
