import "./globals.css";

export const metadata = {
  title: "DESTRY | ร้านค้าออนไลน์สไตล์มินิมอล",
  description: "พบกับสินค้าแฟชั่นและเครื่องประดับพรีเมียม สไตล์ Earth Tone และมินิมอล",
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
