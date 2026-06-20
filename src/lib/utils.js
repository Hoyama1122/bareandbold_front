// ฟังก์ชันสำหรับจัดรูปแบบตัวเลขให้เป็นเงินบาทไทย (เช่น 1,500.00 บาท)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value);
};

// ฟังก์ชันสำหรับจัดรูปแบบวันที่ให้อ่านง่ายสไตล์ไทย
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// เช็คว่าทำงานอยู่บน Browser หรือไม่
export const isBrowser = typeof window !== "undefined";
