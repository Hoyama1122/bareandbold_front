const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper สำหรับยิง API ทั่วไป (ใช้ Cookie อัตโนมัติด้วย credentials: "include")
const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // ให้ส่งและรับ Cookie (token) เสมอ
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

export const authService = {
  // สมัครสมาชิกลูกค้าทั่วไป
  register: async (email, password, firstName, lastName) => {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  },

  // เข้าสู่ระบบลูกค้าทั่วไป
  login: async (email, password) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // สมัครสมาชิกพนักงานหลังบ้าน
  registerBackoffice: async (email, password, firstName, lastName) => {
    return apiFetch("/auth/backoffice/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  },

  // เข้าสู่ระบบพนักงานหลังบ้าน
  loginBackoffice: async (email, password) => {
    return apiFetch("/auth/backoffice/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // ดึงโปรไฟล์ผู้ใช้งานปัจจุบัน (เช็คจาก Cookie หรือ Authorization Header)
  getProfile: async (token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return apiFetch("/auth/profile", {
      method: "GET",
      headers,
    });
  },

  // ออกจากระบบ
  logout: async () => {
    return apiFetch("/auth/logout", {
      method: "POST",
    });
  },
};
