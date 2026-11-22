import { apiFetch } from "@/lib/api";

export const notificationService = {
  getMyNotifications: async (options = {}) => {
    const query = new URLSearchParams();
    if (options.unreadOnly) query.set("unreadOnly", "true");
    if (options.limit) query.set("limit", options.limit);
    const qs = query.toString() ? `?${query.toString()}` : "";

    return apiFetch(`/notifications${qs}`, {
      method: "GET",
    });
  },

  markAsRead: async (id) => {
    return apiFetch(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  markAllAsRead: async () => {
    return apiFetch("/notifications/read-all", {
      method: "PATCH",
    });
  },
};
