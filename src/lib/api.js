/**
 * API Client กลางของ storefront / seller
 * - แนบ Bearer token จาก localStorage อัตโนมัติ
 * - รองรับทั้ง JSON และ FormData (multipart)
 * - แปลง error จาก backend ให้เป็น Error ที่มี status ติดมาด้วย
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "X-App-Client": "storefront",
    ...options.headers,
  };

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_URL}${path}`, {
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
    const error = new Error(
      data.error || `HTTP ${response.status}: Failed to process request`,
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
