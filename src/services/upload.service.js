import { apiFetch } from "@/lib/api";

export const uploadService = {
  uploadFile: async (file, folder = "shops") => {
    const formData = new FormData();
    formData.append("files", file);
    const data = await apiFetch(`/upload?folder=${encodeURIComponent(folder)}`, {
      method: "POST",
      body: formData,
    });
    return data.urls?.[0] || null;
  },

  deleteFile: (url) =>
    apiFetch("/upload", {
      method: "DELETE",
      body: JSON.stringify({ url }),
    }),
};
