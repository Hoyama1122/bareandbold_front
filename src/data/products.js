const products = [
  {
    id: 1,
    name: "Silver Bracelet",
    slug: "silver-bracelet",
    category: "bracelet",
    type: "READY_TO_SHIP",
    brand: "Bare & Bold",
    badge: "พร้อมส่ง",
    rating: 5,
    price: 890,
    originalPrice: 1090,

    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",

    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
      },
    ],

    description:
      "กำไลเงินแท้ 925 สไตล์มินิมอล เหมาะสำหรับการใส่ในทุกโอกาส",

    stock: 15,
  },

  {
    id: 2,
    name: "Black Stone Bracelet",
    slug: "black-stone",
    category: "bracelet",
    type: "MADE_TO_ORDER",
    brand: "Bare & Bold",
    badge: "สั่งทำ",
    rating: 5,
    price: 1290,

    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",

    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
      },
    ],

    description:
      "กำไลหินนิลดำ Handmade สามารถเลือกวัสดุตกแต่งและขนาดข้อมือได้",

    stock: 999,
  },

  {
    id: 3,
    name: "Pearl Anklet",
    slug: "pearl-anklet",
    category: "anklet",
    type: "READY_TO_SHIP",
    brand: "Bare & Bold",
    rating: 4,
    price: 690,

    imageUrl:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",

    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
      },
    ],

    description: "กำไลข้อเท้าไข่มุกแท้",

    stock: 8,
  },

  {
    id: 4,
    name: "Gold Anklet",
    slug: "gold-anklet",
    category: "anklet",
    type: "MADE_TO_ORDER",
    brand: "Bare & Bold",
    badge: "สั่งทำ",
    rating: 5,
    price: 1490,

    imageUrl:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",

    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
      },
    ],

    description:
      "กำไลข้อเท้าทอง สามารถเลือกขนาดและวัสดุได้",

    stock: 999,
  },

  {
    id: 5,
    name: "Minimal Bracelet",
    slug: "minimal-bracelet",
    category: "bracelet",
    type: "READY_TO_SHIP",
    brand: "Bare & Bold",
    rating: 5,
    price: 790,

    imageUrl:
      "https://images.unsplash.com/photo-1611085583191-a3b1a20fdb44?q=80&w=900&auto=format&fit=crop",

    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1611085583191-a3b1a20fdb44?q=80&w=900&auto=format&fit=crop",
      },
    ],

    description:
      "กำไลข้อมือดีไซน์เรียบหรู เหมาะกับทุกลุค",

    stock: 12,
  },

  {
    id: 6,
    name: "Rose Gold Bracelet",
    slug: "rose-gold",
    category: "bracelet",
    type: "MADE_TO_ORDER",
    brand: "Bare & Bold",
    badge: "Custom",
    rating: 5,
    price: 1690,

    imageUrl:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=900&auto=format&fit=crop",

    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=900&auto=format&fit=crop",
      },
    ],

    description:
      "Rose Gold Handmade Bracelet",

    stock: 999,
  },
];

export default products;