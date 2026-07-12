import "./globals.css";

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
      <body className="min-h-full flex flex-col ">{children}</body>
    </html>
  );
}
