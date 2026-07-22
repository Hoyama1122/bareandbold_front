const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiFetch = async (endpoint, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("bare_auth_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");
  let data = {};
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to process request`);
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

  // อัปเดตโปรไฟล์ผู้ใช้งาน
  updateProfile: async (data) => {
    return apiFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
