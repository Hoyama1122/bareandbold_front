const products = [
  // BRACELETS (15 items)
  {
    id: 1,
    name: "Classic Black Onyx Bracelet",
    description: "สร้อยข้อมือหินนิลดำผิวมันวาว ช่วยเสริมความมุ่งมั่นและป้องกันพลังงานลบ เหมาะสำหรับใส่ได้ในทุกๆ วัน",
    price: 890,
    originalPrice: 1290,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Turquoise Bead Bracelet",
    description: "สร้อยข้อมือหินเทอร์ควอยส์สีฟ้าสดใส เสริมพลังด้านการเจรจา การปกป้องคุ้มครองระหว่างการเดินทาง",
    price: 950,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Custom Minimalist Wax Cord",
    description: "สร้อยข้อมือเชือกเทียนถักสไตล์มินิมอล สามารถเลือกสีเชือกและจี้ตกแต่งในแบบที่คุณต้องการได้เอง",
    price: 350,
    originalPrice: 450,
    type: "MADE_TO_ORDER",
    category: "bracelet",
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Rose Quartz Love Bracelet",
    description: "หินโรสควอตซ์สีชมพูพาสเทล หินแห่งความรักและการให้อภัย ช่วยปลอบประโลมจิตใจและเสริมเสน่ห์",
    price: 790,
    originalPrice: 990,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Lava Stone Aromatherapy Bracelet",
    description: "สร้อยข้อมือหินลาวาผิวด้านสีดำเข้มขรึม สามารถหยดน้ำมันหอมระเหยเพื่อให้กลิ่นหอมผ่อนคลายตลอดวัน",
    price: 690,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Tiger's Eye Protection Bracelet",
    description: "หินไทเกอร์อายลายไม้สวยงาม เสริมความกล้าหาญ ป้องกันภัยอันตราย และช่วยกระตุ้นการตัดสินใจที่เฉียบคม",
    price: 890,
    originalPrice: 1190,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Amethyst Spiritual Charm",
    description: "หินอเมทิสต์สีม่วงเข้ม นำพาความสงบในจิตใจ ช่วยลดความเครียดและเพิ่มสมาธิในการทำงาน",
    price: 990,
    originalPrice: 1390,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Custom double-row Leather Bracelet",
    description: "สร้อยข้อมือหนังแท้ถักสองเส้นคู่ลุคเท่ๆ สไตล์โบฮีเมียน สามารถเลือกสลักชื่อหรือคำพิเศษบนแผ่นโลหะได้",
    price: 1290,
    originalPrice: 1590,
    type: "MADE_TO_ORDER",
    category: "bracelet",
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Hematite Grounding Bracelet",
    description: "หินเฮมาไทต์สีเงินวาวเมทัลลิก ช่วยปรับสมดุลพลังงานในร่างกาย เพิ่มความมั่นคงทางอารมณ์และลดความเหนื่อยล้า",
    price: 590,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "Lapis Lazuli Wisdom Bracelet",
    description: "หินลาพิสลาซูลีสีน้ำเงินเข้มปนทอง เสริมสร้างสติปัญญา ความคิดสร้างสรรค์ และความจริงใจในการสื่อสาร",
    price: 1150,
    originalPrice: 1450,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Malachite Growth Bracelet",
    description: "หินมาลาไคต์สีเขียวลายริ้วสวยแปลกตา หินแห่งการเปลี่ยนผ่านและการเติบโต ช่วยขจัดพลังงานด้านลบ",
    price: 1390,
    originalPrice: 1890,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 12,
    name: "Custom Macrame Bead Bracelet",
    description: "สร้อยข้อมือเชือกถักสไตล์ถักปมโบราณ ผสมผสานหินมงคลที่คุณชื่นชอบ เลือกจำนวนเม็ดหินและสีเชือกได้ตามใจ",
    price: 490,
    originalPrice: null,
    type: "MADE_TO_ORDER",
    category: "bracelet",
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 13,
    name: "White Howlite Peace Bracelet",
    description: "หินฮาวไลต์สีขาวลายเทา ช่วยระงับความโกรธ ความฟุ้งซ่าน ทำให้จิตใจสงบเยือกเย็นและหลับสนิทขึ้น",
    price: 750,
    originalPrice: 950,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 14,
    name: "Citrine Wealth Bracelet",
    description: "หินซิทรินสีเหลืองน้ำผึ้งใสสะอาด หินแห่งความมั่งคั่งและโชคลาภ ช่วยดึงดูดความสำเร็จและพลังบวก",
    price: 1250,
    originalPrice: 1650,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 15,
    name: "Carnelian Vitality Bracelet",
    description: "หินคาร์เนเลียนสีส้มแสดประกายแสงแดด ช่วยเพิ่มพูนความมั่นใจ พลังกาย พลังใจ และแรงผลักดันในการทำงาน",
    price: 850,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "bracelet",
    stock: 19,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"
  },

  // ANKLETS (10 items)
  {
    id: 16,
    name: "Minimalist Silver Anklet",
    description: "สร้อยข้อเท้าเงินแท้ดีไซน์มินิมอล เส้นเรียบหรูทนทาน ใส่ลุยน้ำลุยทะเลได้สบายๆ",
    price: 490,
    originalPrice: 690,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 17,
    name: "Freshwater Pearl Anklet",
    description: "สร้อยข้อเท้าไข่มุกน้ำจืดแท้ เสริมลุคหวานละมุนสายธรรมชาติ มุกกลมเงางาม",
    price: 790,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 18,
    name: "Custom Shell Anklet",
    description: "สร้อยข้อเท้าเชือกถักตกแต่งด้วยเปลือกหอยเปลือกหอยธรรมชาติสไตล์โบฮีเมียน สามารถปรับขนาดได้เอง",
    price: 320,
    originalPrice: 420,
    type: "MADE_TO_ORDER",
    category: "anklet",
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 19,
    name: "Lucky Turquoise Anklet",
    description: "สร้อยข้อเท้าหินนำโชคเทอร์ควอยส์สีฟ้าคราม สลับลูกปัดเงินแท้ เสริมพลังบวกความโชคดีและมั่นใจ",
    price: 650,
    originalPrice: 850,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 20,
    name: "Red Coral Protection Anklet",
    description: "สร้อยข้อเท้าหินปะการังสีแดงสดสะดุดตา ช่วยปกป้องภัยอันตรายและเสริมการไหลเวียนพลังงานที่ดี",
    price: 720,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 21,
    name: "Gold Plated Bell Anklet",
    description: "สร้อยข้อเท้าชุบทองคำแท้ประดับกระดิ่งจิ๋วเสียงใสมีเสน่ห์ ลายสร้อยละเอียดเรียบร้อย",
    price: 890,
    originalPrice: 1190,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 22,
    name: "Hematite Energy Anklet",
    description: "สร้อยข้อเท้าหินเฮมาไทต์ ช่วยฟื้นฟูความเหนื่อยล้าของเรียวขาและปรับสมดุลธาตุในร่างกาย",
    price: 550,
    originalPrice: 750,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 23,
    name: "Custom Leather Cord Anklet",
    description: "สร้อยข้อเท้าสายหนังถักสองชั้นสีน้ำตาลเข้ม ลุคเท่สไตล์สปอร์ต เลือกใส่จี้สลักแผ่นเงินได้",
    price: 450,
    originalPrice: null,
    type: "MADE_TO_ORDER",
    category: "anklet",
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 24,
    name: "Rose Quartz Romance Anklet",
    description: "สร้อยข้อเท้าหินโรสควอตซ์สีชมพูละมุน ช่วยเยียวยาอารมณ์และเสริมเสน่ห์ความรักอันอ่อนโยน",
    price: 690,
    originalPrice: 890,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 25,
    name: "Sodalite Clarity Anklet",
    description: "สร้อยข้อเท้าหินโซดาไลต์สีน้ำเงินลายเมฆขาว นำพาความคิดสร้างสรรค์และความคิดที่เป็นระเบียบสงบ",
    price: 590,
    originalPrice: null,
    type: "READY_TO_SHIP",
    category: "anklet",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
  }
];

export default products;