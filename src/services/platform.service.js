import { apiFetch } from "@/lib/api";

export const DEFAULT_PLATFORM_SETTINGS = {
  shippingFee: 50,
  freeShippingThreshold: 300,
};

export const platformService = {
  getPublicSettings: async () => {
    const data = await apiFetch("/settings/public");
    return {
      ...DEFAULT_PLATFORM_SETTINGS,
      ...(data?.settings || {}),
    };
  },
};
