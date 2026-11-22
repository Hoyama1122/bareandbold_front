export const DEFAULT_SHIPPING_SETTINGS = {
  shippingFee: 50,
  freeShippingThreshold: 0,
};

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

/**
 * จัดกลุ่มรายการในตะกร้าตามร้าน เพื่อคิดค่าส่งและเกณฑ์ฟรีส่งแยกร้าน
 * สินค้า legacy ที่ไม่มี shopId จะอยู่ในกลุ่ม "__platform__"
 */
export const groupCartItemsByShop = (items = []) => {
  const groups = new Map();

  for (const item of items) {
    const key = item.shopId || "__platform__";
    const group = groups.get(key) || {
      key,
      shopId: item.shopId || null,
      shopName: item.shopName || "Bare & Bold",
      items: [],
      subtotal: 0,
    };
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
    group.items.push(item);
    group.subtotal = roundMoney(group.subtotal + lineTotal);
    groups.set(key, group);
  }

  return [...groups.values()];
};

export const calculateCartPricing = (
  items = [],
  settings = DEFAULT_SHIPPING_SETTINGS,
) => {
  const shippingFee = Number(
    settings?.shippingFee ?? DEFAULT_SHIPPING_SETTINGS.shippingFee,
  );
  const freeShippingThreshold = Number(
    settings?.freeShippingThreshold ??
      DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
  );
  const hasAutoFreeShipping = freeShippingThreshold > 0;

  const groups = groupCartItemsByShop(items).map((group) => {
    const qualifiesForFreeShipping =
      group.subtotal === 0 ||
      (hasAutoFreeShipping && group.subtotal >= freeShippingThreshold);
    return {
      ...group,
      shipping: qualifiesForFreeShipping ? 0 : shippingFee,
      qualifiesForFreeShipping,
      remainingForFreeShipping: hasAutoFreeShipping
        ? Math.max(0, freeShippingThreshold - group.subtotal)
        : 0,
    };
  });

  const subtotal = roundMoney(
    items.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    ),
  );
  const shipping = roundMoney(
    groups.reduce((sum, group) => sum + group.shipping, 0),
  );
  const shippingGroups = groups.filter(
    (group) => !group.qualifiesForFreeShipping && group.subtotal > 0,
  );
  const closestGroup = hasAutoFreeShipping
    ? shippingGroups.sort(
        (a, b) => a.remainingForFreeShipping - b.remainingForFreeShipping,
      )[0]
    : null;

  return {
    groups,
    subtotal,
    shipping,
    total: roundMoney(subtotal + shipping),
    itemCount: items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    ),
    freeShippingThreshold,
    hasAutoFreeShipping,
    remainingForFreeShipping: closestGroup?.remainingForFreeShipping || 0,
    shipProgress:
      hasAutoFreeShipping && closestGroup && freeShippingThreshold > 0
        ? Math.min(
            100,
            Math.round((closestGroup.subtotal / freeShippingThreshold) * 100),
          )
        : 0,
  };
};
