"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import {
  Sparkles,
  Compass,
  ShieldAlert,
  Heart,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Sun,
  Moon,
  Flame,
  Wind,
  Droplets,
  Mountain,
  CheckCircle2,
  Gem,
  Award,
} from "lucide-react";

// ฐานข้อมูลหินมงคล จี้มงคล และสีกาลกิณีตามหลักทักษาปกรณ์ไทย (Authentic Thai Astrology KB)
export const DAY_ASTROLOGY = {
  sunday: {
    name: "วันอาทิตย์",
    element: "ธาตุไฟ (พลังสุริยเทพ)",
    rulingDeity: "พระอาทิตย์ (เทพแห่งเกียรติยศ ความเป็นผู้นำ และความรุ่งโรจน์)",
    luckyColors: ["สีแดงมงคล", "สีส้มแสด", "สีทองสว่าง"],
    tabooColor: "สีน้ำเงิน / สีกรมท่า / สีคราม (สีกาลกิณี - ธาตุน้ำดับธาตุไฟ)",
    aspects: {
      wealth: {
        title: "เปิดประตูทรัพย์ มั่งคั่งรับพลังสุริยะ",
        charmKeyword: "ปี่เซียะ",
        beadKeyword: "ไหมทอง",
        prediction:
          "คนเกิดวันอาทิตย์มีพลังธาตุไฟในตัวสูง เปี่ยมด้วยความทะเยอทะยานและวิสัยทัศน์กว้างไกล การสวมจี้ปี่เซียะทองคำคู่กับหินไหมทองจะช่วยดักจับโอกาสทางการเงินที่หมุนเวียนรอบตัว กักเก็บทรัพย์สินไม่ให้รั่วไหล ค้าขายได้กำไรทวีคูณ",
        advice: "ควรเลือกร้อยกับเชือกเทียนสีทองสว่าง หรือสีแดงมงคล เพื่อเสริมพลังโชคลาภให้เปล่งประกายสูงสุด",
      },
      work: {
        title: "เสริมอำนาจบารมี ชัยชนะในการบริหาร",
        charmKeyword: "สุริยะ",
        beadKeyword: "ทับทิม",
        prediction:
          "พลังแห่งสุริยะเทวะจะช่วยหนุนดวงการงาน เสริมสร้างความน่าเชื่อถือและความเป็นผู้นำ บริวารและผู้ร่วมงานให้ความเคารพยำเกรง ชนะการแข่งขันในสายงาน และได้รับความไว้วางใจจากผู้ใหญ่",
        advice: "เหมาะอย่างยิ่งสำหรับหัวหน้างาน เจ้าของกิจการ หรือผู้ที่ต้องการเลื่อนขั้นเลื่อนตำแหน่ง",
      },
      love: {
        title: "เมตตามหานิยม เสน่ห์อันอบอุ่นตรึงใจ",
        charmKeyword: "อินฟินิตี้",
        beadKeyword: "โรสควอตซ์",
        prediction:
          "ธาตุไฟมักทำให้อารมณ์ร้อนหรือพูดจาตรงไปตรงมา จี้อินฟินิตี้ผูกรักร่วมกับหินโรสควอตซ์จะช่วยปรับสมดุลธาตุ เติมความนุ่มนวลอ่อนหวาน ดึงดูดคนดีๆ เข้ามาในชีวิตและผูกจิตใจคนรักให้มั่นคง",
        advice: "ช่วยสมานรอยร้าวในความสัมพันธ์ เสริมความรักที่ยืนยาวไร้ความขัดแย้ง",
      },
      peace: {
        title: "ปัดเป่าพลังลบ คลายความตึงเครียด",
        charmKeyword: "ต้นไม้แห่งชีวิต",
        beadKeyword: "อเมทิสต์",
        prediction:
          "อเมทิสต์ช่วยลดความเร่าร้อนในจิตใจ ช่วยให้มีสมาธิ สติ และการตัดสินใจที่เฉียบแหลม ปัดเป่าอุบัติเหตุและภยันตราย ช่วยให้นอนหลับสบาย คลายความเหนื่อยล้าสะสม",
        advice: "ช่วยฟื้นฟูพลังชีวิตและจิตวิญญาณให้สงบเยือกเย็น",
      },
    },
  },
  monday: {
    name: "วันจันทร์",
    element: "ธาตุดินนวล / น้ำนวล (พลังจันทรา)",
    rulingDeity: "พระจันทร์ (เทพีแห่งเสน่ห์ วาทศิลป์ และจินตนาการ)",
    luckyColors: ["สีขาวบริสุทธิ์", "สีครีม", "สีเหลืองอ่อน", "สีน้ำตาลเอิร์ธโทน"],
    tabooColor: "สีแดงสด (สีกาลกิณี - ธาตุไฟเผาทำลายความสงบเย็น)",
    aspects: {
      wealth: {
        title: "ถุงเงินดูดทรัพย์ ค้าขายเงินทองไม่ขาดมือ",
        charmKeyword: "ถุงเงิน",
        beadKeyword: "ซิทริน",
        prediction:
          "คนเกิดวันจันทร์มีวาทศิลป์ดี ช่างเอาอกเอาใจและมีเสน่ห์ การสวมจี้ถุงเงินถุงทองคู่กับหินซิทรินสีน้ำผึ้งช่วยเปิดทิศทางโชคลาภ ดึงดูดลูกค้าและเงินทองให้เข้ามาสม่ำเสมอ ค้าขายคล่องตัวตลอดปี",
        advice: "แนะนำให้ใช้เชือกถักสีเหลืองอ่อน หรือสีน้ำตาลเอิร์ธโทน เพื่อเสริมความมั่นคงทางการเงิน",
      },
      work: {
        title: "สติปัญญาเฉียบแหลม เจรจาปิดดีลสำเร็จ",
        charmKeyword: "ลูกศร",
        beadKeyword: "ลาพิส",
        prediction:
          "ช่วยขจัดความโลเลไม่มั่นใจ เพิ่มความเด็ดเดี่ยวในการตัดสินใจ หินลาพิส ลาซูลีเป็นหินแห่งภูมิปัญญา ช่วยให้การติดต่อประสานงานราบรื่นไร้อุปสรรค ได้รับคำชื่นชมในความสามารถ",
        advice: "เหมาะสำหรับสายงานเจรจา การตลาด และงานที่ต้องใช้ความละเอียดรอบคอบ",
      },
      love: {
        title: "มหาเสน่ห์จันทรา ตรึงใจคู่ครอง",
        charmKeyword: "พระจันทร์เสี้ยว",
        beadKeyword: "มูนสโตน",
        prediction:
          "มูนสโตนคืออัญมณีคู่บารมีคนเกิดวันจันทร์อย่างแท้จริง เสริมพลังเสน่ห์ดึงดูดขั้นสูงสุด คนเห็นคนรัก ใครพบก็เมตตาเอ็นดู คู่ครองรักหลงและคอยดูแลเอาใจใส่",
        advice: "ช่วยเติมเต็มความโรแมนติกและความเข้าใจอันลึกซึ้งในครอบครัว",
      },
      peace: {
        title: "ชำระล้างจิตใจ สุขภาพแข็งแรง สงบสุข",
        charmKeyword: "ต้นไม้แห่งชีวิต",
        beadKeyword: "หยกขาว",
        prediction:
          "หยกขาวช่วยปรับพลังงานธาตุดินและน้ำให้สมดุล ปกป้องสุขภาพ ขจัดความวิตกกังวล และนำพาความสงบร่มเย็นสู่ชีวิต ครอบครัวร่มเย็นเป็นสุข",
        advice: "ช่วยฟื้นฟูสภาพจิตใจ ลดความเครียดสะสมจากการทำงาน",
      },
    },
  },
  tuesday: {
    name: "วันอังคาร",
    element: "ธาตุลม / ไฟกร้าว (พลังนักรบ)",
    rulingDeity: "พระอังคาร (เทพแห่งความกล้าหาญ ความรวดเร็ว และชัยชนะ)",
    luckyColors: ["สีชมพู", "สีโอลด์โรส", "สีดำสนิท", "สีม่วง"],
    tabooColor: "สีขาว / สีเหลืองนวล (สีกาลกิณี - บั่นทอนพลังขับเคลื่อน)",
    aspects: {
      wealth: {
        title: "กบสามขาคาบเหรียญ ปิดช่องโหว่เงินรั่วไหล",
        charmKeyword: "กบคาบเหรียญ",
        beadKeyword: "ไทเกอร์อาย",
        prediction:
          "คนเกิดวันอังคารมีความกล้าเสี่ยง กล้าได้กล้าเสีย จี้กบคาบเหรียญและหินไทเกอร์อายตาเสือจะช่วยให้มองเห็นโอกาสทางการเงินชัดเจน ป้องกันเงินทองรั่วไหล มีโชคลาภจากการแข่งขันหรือเสี่ยงดวง",
        advice: "ร้อยคู่กับเชือกเทียนสีดำสนิท หรือสีชมพูเข้ม เพื่อกระตุ้นพลังรับทรัพย์",
      },
      work: {
        title: "เด็ดเดี่ยวไม่ย่อท้อ สะกดคู่แข่ง ควบคุมบริวาร",
        charmKeyword: "ลูกศร",
        beadKeyword: "นิลดำ",
        prediction:
          "นิลดำแท้เสริมความมุ่งมั่น หนักแน่น ไม่หวั่นไหวต่อแรงกดดัน ช่วยให้ควบคุมบริวารได้อยู่หมัด และสร้างผลงานโดดเด่นแซงหน้าคู่แข่ง ฟันฝ่าอุปสรรคได้อย่างงดงาม",
        advice: "เหมาะสำหรับผู้นำโปรเจกต์ วิศวกร หรือสายงานที่ต้องลุยและใช้ความอดทนสูง",
      },
      love: {
        title: "สมานรอยร้าว เติมความหวาน ละลายความดุดัน",
        charmKeyword: "หัวใจ",
        beadKeyword: "โรสควอตซ์",
        prediction:
          "ช่วยบรรเทาอารมณ์ใจร้อนของคนเกิดวันอังคาร เปลี่ยนความแข็งกร้าวให้เป็นความเข้าใจและความอ่อนโยน เสริมความผูกพันให้แนบแน่น ผูกใจคู่ครองให้รักเดียวใจเดียว",
        advice: "ช่วยให้คู่ครองเข้าใจในความหวังดีและลดการปะทะอารมณ์",
      },
      peace: {
        title: "เกราะคุ้มภัยอีวิลอาย แคล้วคลาดอุบัติเหตุ",
        charmKeyword: "ดวงตาปีศาจ",
        beadKeyword: "อเมทิสต์",
        prediction:
          "คนวันอังคารมักใช้ชีวิตรวดเร็วและลุยเต็มที่ จี้อีวิลอายช่วยสะท้อนพลังลบและสิ่งไม่ดี ขณะที่อเมทิสต์ช่วยให้มีสติรอบคอบ คุ้มครองความปลอดภัยในการเดินทางและชีวิตประจำวัน",
        advice: "ควรสวมใส่เป็นประจำเพื่อคุ้มครองดวงชะตาให้แคล้วคลาด",
      },
    },
  },
  wednesday: {
    name: "วันพุธ",
    element: "ธาตุน้ำ / ธาตุไม้ (พลังนักปราชญ์และการเจรจา)",
    rulingDeity: "พระพุธ (เทพแห่งการค้าขาย ปฏิภาณไหวพริบ และการทูต)",
    luckyColors: ["สีเขียวมรกต", "สีดำ", "สีเทอร์ควอยซ์", "สีส้มแสด"],
    tabooColor: "สีชมพูสด (สีกาลกิณี - ขัดโชคลาภ การเงินสะดุด)",
    aspects: {
      wealth: {
        title: "โคลเวอร์ 4 แฉกเปิดโชค หยกเขียวเหนี่ยวทรัพย์",
        charmKeyword: "ใบโคลเวอร์",
        beadKeyword: "หยก",
        prediction:
          "คนเกิดวันพุธหัวไว ปรับตัวเก่ง มีไหวพริบ จี้ใบโคลเวอร์ 4 แฉกและหยกพม่าแท้คือตัวแทนแห่งความอุดมสมบูรณ์ เสริมโชคลาภ 4 ทิศ เงินทองไหลเข้าต่อเนื่อง ค้าขายมีกำไรยั่งยืน",
        advice: "ร้อยคู่กับเชือกเทียนสีเขียวมรกต จะส่งเสริมพลังเหนี่ยวทรัพย์ให้แรงยิ่งขึ้น",
      },
      work: {
        title: "คทายู่อี่สมปรารถนา ปิดดีลการค้าผ่านฉลุย",
        charmKeyword: "คทาสมปรารถนา",
        beadKeyword: "มาลาไคต์",
        prediction:
          "หินมาลาไคต์เสริมวาทศิลป์ในการเจรจาธุรกิจ คทายู่อี่ช่วยให้การลงนามสัญญาหรือโครงการใหญ่ได้รับความเห็นชอบอย่างราบรื่น ผู้ใหญ่ให้ความไว้วางใจและเกื้อหนุน",
        advice: "เหมาะอย่างยิ่งสำหรับเซลส์ นักการตลาด ที่ปรึกษา และนักเจรจาต่อรอง",
      },
      love: {
        title: "วาจาตรึงใจ เสน่ห์อันน่าค้นหา",
        charmKeyword: "อินฟินิตี้",
        beadKeyword: "มูนสโตน",
        prediction:
          "ช่วยเพิ่มเสน่ห์จากคำพูดและการแสดงออก ทำให้คนคุยด้วยรู้สึกสบายใจ ดึงดูดมิตรภาพดีๆ และความรักที่เข้าใจกันโดยไม่ต้องเอ่ยคำ เสริมรักให้ยั่งยืน",
        advice: "ช่วยสร้างความสัมพันธ์ที่อบอุ่นและมั่นคงทางอารมณ์",
      },
      peace: {
        title: "จิตใจสงบดุจสายน้ำ อายุยืนยาว",
        charmKeyword: "ต้นไม้แห่งชีวิต",
        beadKeyword: "อความารีน",
        prediction:
          "พลังแห่งสายน้ำของอความารีนช่วยชำระล้างความคิดที่ฟุ้งซ่าน ช่วยให้ผ่อนคลาย หลับสบาย ร่างกายและจิตใจสมดุล สุขภาพแข็งแรงอายุยืน",
        advice: "ช่วยบรรเทาอาการเครียดจากการคิดและวางแผนตลอดเวลา",
      },
    },
  },
  thursday: {
    name: "วันพฤหัสบดี",
    element: "ธาตุดินใหญ่ / ธาตุไม้ใหญ่ (ดาวครูและปัญญา)",
    rulingDeity: "พระพฤหัสบดี (มหาคุรุเทพ ผู้เปี่ยมด้วยความรู้และสัจจะ)",
    luckyColors: ["สีส้มแสด", "สีทองสว่าง", "สีน้ำตาลเอิร์ธโทน", "สีแดงอิฐ"],
    tabooColor: "สีดำสนิท / สีม่วงเข้ม (สีกาลกิณี - บดบังรัศมีปัญญา)",
    aspects: {
      wealth: {
        title: "เหรียญจักรพรรดิดูดทรัพย์ ขุมทรัพย์มหาศาล",
        charmKeyword: "เหรียญ",
        beadKeyword: "ไหมทอง",
        prediction:
          "คนเกิดวันพฤหัสบดีเป็นคนมีคุณธรรม ซื่อสัตย์ การพกพาเหรียญจักรพรรดินำโชคและไหมทองจะช่วยดึงดูดเงินก้อนใหญ่ โชคลาภจากผู้ใหญ่และการลงทุนที่มั่นคง ทรัพย์สินเพิ่มพูน",
        advice: "ร้อยคู่กับเชือกเทียนสีทองสว่าง หรือสีน้ำตาลเอิร์ธโทน เพื่อเสริมฐานะการเงินให้แข็งแกร่ง",
      },
      work: {
        title: "วิสัยทัศน์กว้างไกล เลื่อนขั้นเลื่อนตำแหน่ง",
        charmKeyword: "สุริยะ",
        beadKeyword: "ซิทริน",
        prediction:
          "ช่วยจุดประกายความคิดสร้างสรรค์ เสริมบารมีทางวิชาการและวิชาชีพ เป็นที่ยอมรับนับถือ ได้รับมอบหมายงานสำคัญที่มีเกียรติยศและส่งผลต่อความก้าวหน้า",
        advice: "เหมาะสำหรับครูบาอาจารย์ แพทย์ ผู้พิพากษา และผู้บริหารระดับสูง",
      },
      love: {
        title: "รักแท้ที่มั่นคง ครอบครัวอบอุ่นสุขสันต์",
        charmKeyword: "พระจันทร์เสี้ยว",
        beadKeyword: "มูนสโตน",
        prediction:
          "ช่วยเชื่อมโยงความรู้สึกระหว่างคู่รักให้แน่นแฟ้น มีความเข้าอกเข้าใจและให้อภัยกัน ความรักอบอุ่นมั่นคงดั่งขุนเขา ไร้เรื่องระหองระแหง",
        advice: "เสริมความสัมพันธ์ในครอบครัวให้สงบสุข ไร้ความขัดแย้ง",
      },
      peace: {
        title: "พระพิฆเนศปางปัญญา ขจัดอุปสรรคทั้งปวง",
        charmKeyword: "พระพิฆเนศ",
        beadKeyword: "โกเมน",
        prediction:
          "องค์พระพิฆเนศทรงประทานพรให้มีสติปัญญาเฉียบคม ปัดเป่าอุปสรรคและโรคภัยไข้เจ็บ ร่างกายแข็งแรง มีชีวิตชีวาตลอดวัน",
        advice: "ช่วยเสริมสร้างพลังงานบวกและจิตใจที่เบิกบาน",
      },
    },
  },
  friday: {
    name: "วันศุกร์",
    element: "ธาตุน้ำบริสุทธิ์ (พลังความงาม ศิลปะ และความรื่นรมย์)",
    rulingDeity: "พระศุกร์ (เทพีแห่งความรัก ศิลปวิทยา และความมั่งคั่ง)",
    luckyColors: ["สีฟ้าอ่อน", "สีน้ำเงินสด", "สีขาวบริสุทธิ์", "สีทอง"],
    tabooColor: "สีดำด้าน / สีเทาเข้ม (สีกาลกิณี - ดับรัศมีความสดใส)",
    aspects: {
      wealth: {
        title: "แร่ไพไรต์ดูดเงินทอง ทรัพย์สินงอกเงย",
        charmKeyword: "ถุงเงิน",
        beadKeyword: "ไพไรต์",
        prediction:
          "คนเกิดวันศุกร์มีเซนส์เรื่องความงามและรสนิยมดี แร่ไพไรต์ (หินนางกวัก) คู่กับจี้ถุงทองจะช่วยดึงดูดเงินทองจากการค้าขายของสวยงาม งานศิลปะ แฟชั่น และการบริการอย่างล้นหลาม",
        advice: "ร้อยคู่กับเชือกเทียนสีกรมท่า หรือสีขาว เพื่อเปิดรับพลังความมั่งคั่ง",
      },
      work: {
        title: "มงกุฎราชินีเกียรติยศ โดดเด่นในวงการ",
        charmKeyword: "มงกุฎ",
        beadKeyword: "ลาพิส",
        prediction:
          "เสริมภาพลักษณ์ให้สง่างาม มีเสน่ห์ในที่ทำงาน มีชื่อเสียงเป็นที่ประจักษ์ และได้รับโอกาสทองในการแสดงความสามารถอย่างเต็มภาคภูมิ",
        advice: "เหมาะสำหรับอินฟลูเอนเซอร์ ดีไซเนอร์ และนักสื่อสารมวลชน",
      },
      love: {
        title: "ปีกนางฟ้าโอบล้อมรัก ดึงดูดคู่แท้",
        charmKeyword: "ปีกนางฟ้า",
        beadKeyword: "โรสควอตซ์",
        prediction:
          "เพิ่มออร่าความรักอันอ่อนหวาน ใครเห็นก็ตกหลุมรัก ผู้คนพร้อมยื่นมือเข้ามาช่วยเหลือและปกป้องดูแล ดึงดูดความสัมพันธ์ที่จริงใจและคู่แท้",
        advice: "ช่วยเติมเต็มความหวานและรักษาหัวใจให้เบิกบานอยู่เสมอ",
      },
      peace: {
        title: "สายน้ำอันสงบ ผ่อนคลายกายใจ",
        charmKeyword: "ต้นไม้แห่งชีวิต",
        beadKeyword: "อความารีน",
        prediction:
          "นำพาความสงบ ผ่อนคลายจากความกังวล ชะล้างพลังงานด้านลบ ช่วยให้จิตใจปลอดโปร่งและมีทัศนคติที่ดีต่อชีวิต ร่างกายผ่อนคลาย",
        advice: "ช่วยฟื้นฟูสุขภาพและเสริมความสุขในทุกๆ วัน",
      },
    },
  },
  saturday: {
    name: "วันเสาร์",
    element: "ธาตุไฟสุมขอน / ธาตุดินแข็งแกร่ง (มหาอำนาจบารมี)",
    rulingDeity: "พระเสาร์ (เทพแห่งความอดทน ความหนักแน่น และความยิ่งใหญ่)",
    luckyColors: ["สีดำสนิท", "สีม่วงเข้ม", "สีน้ำเงินเข้ม", "สีกรมท่า"],
    tabooColor: "สีเขียวสด (สีกาลกิณี - ขัดพลังธาตุ ทำลายความหนักแน่น)",
    aspects: {
      wealth: {
        title: "กังหันแชกงหมิว 4 ทิศ พัดพาโชคลาภเงินล้าน",
        charmKeyword: "กังหัน",
        beadKeyword: "ไหมทอง",
        prediction:
          "คนเกิดวันเสาร์มีความอดทนสูง สู้ไม่ถอย กังหันแชกงหมิวช่วยพัดพาสิ่งไม่ดีหรืออุปสรรคทางการเงินออกไป แล้วหมุนเงินทอง โชคลาภ และความมั่งคั่งเข้ามาสู่ชีวิตอย่างมั่นคง",
        advice: "ร้อยคู่กับเชือกเทียนสีดำสนิท หรือสีกรมท่า เพื่อเสริมรากฐานการเงินให้คงกระพัน",
      },
      work: {
        title: "นิลดำคุ้มครองบารมี สะกดทุกอุปสรรค",
        charmKeyword: "ลูกศร",
        beadKeyword: "นิลดำ",
        prediction:
          "นิลดำช่วยปกป้องพลังงานลบและการปองร้ายจากศัตรูในที่ทำงาน เสริมความน่าเกรงขาม ความอดทน และความมั่นคงในตำแหน่งหน้าที่ ชนะทุกอุปสรรค",
        advice: "เหมาะสำหรับผู้บริหาร เจ้าของธุรกิจอสังหาริมทรัพย์ โรงงาน และงานอุตสาหกรรม",
      },
      love: {
        title: "รักเดียวใจเดียว มั่นคงดั่งศิลา",
        charmKeyword: "อินฟินิตี้",
        beadKeyword: "โกเมน",
        prediction:
          "คนวันเสาร์รักใครรักจริง ไม่โลเล โกเมนแดงช่วยเสริมความซื่อสัตย์ ความรักที่ยั่งยืน และขจัดความหวาดระแวงในจิตใจ ผูกรักมั่นคง",
        advice: "ช่วยเสริมสร้างความเชื่อมั่นระหว่างคู่ครองให้มั่นคงเหนือกาลเวลา",
      },
      peace: {
        title: "อีวิลอายปัดเป่าเคราะห์ สโมกกี้ควอตซ์คุ้มภัย",
        charmKeyword: "ดวงตาปีศาจ",
        beadKeyword: "สโมกกี้",
        prediction:
          "สโมกกี้ควอตซ์และอีวิลอายช่วยสลายพลังงานลบ ป้องกันวิญญาณร้ายและเคราะห์ร้ายต่างๆ เสริมความแข็งแกร่งให้แก่จิตวิญญาณ ปลอดภัยในทุกย่างก้าว",
        advice: "ช่วยให้นอนหลับลึก ไม่ฝันร้าย จิตใจสงบและผ่อนคลาย",
      },
    },
  },
};

const TAROT_CARDS = [
  { id: 1, title: "ไพ่สุริยเทพ", subtitle: "พลังแห่งความสำเร็จและเกียรติยศ", icon: Sun },
  { id: 2, title: "ไพ่ดวงดารา", subtitle: "เข็มทิศนำทางแห่งโชคชะตา", icon: Sparkles },
  { id: 3, title: "ไพ่เนตรโชคลาภ", subtitle: "สายตาแห่งปัญญาและขุมทรัพย์", icon: Gem },
  { id: 4, title: "ไพ่จักรวาลมงคล", subtitle: "ความสมดุลและความแคล้วคลาด", icon: Award },
];

export default function FortuneCardPage() {
  const [step, setStep] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState("sunday");
  const [aspect, setAspect] = useState("wealth");

  // Real Database Data
  const [accessories, setAccessories] = useState([]);
  const [customizableProduct, setCustomizableProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Card Draw State
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [matchedCharm, setMatchedCharm] = useState(null);
  const [matchedBead, setMatchedBead] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Load accessories and customizable products from Backend API
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        // 1. Fetch Accessories from API
        const accRes = await fetch("http://localhost:8000/api/accessories");
        const accData = await accRes.json();
        if (accData.success && Array.isArray(accData.accessories)) {
          setAccessories(accData.accessories);
        }

        // 2. Fetch Made-to-order Products
        const prodData = await productService.getProducts({ type: "MADE_TO_ORDER" });
        if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
          // Prefer "Custom Minimalist Wax Cord Bracelet" or the first available made-to-order
          const customBracelet =
            prodData.products.find(
              (p) =>
                p.name.includes("Custom") ||
                p.name.includes("สั่งทำ") ||
                p.category === "BRACELET"
            ) || prodData.products[0];
          setCustomizableProduct(customBracelet);
        } else {
          // Fallback to all products
          const fallbackProds = await productService.getProducts();
          if (fallbackProds.success && fallbackProds.products?.length > 0) {
            setCustomizableProduct(fallbackProds.products[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load fortune data:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const currentAstro = DAY_ASTROLOGY[dayOfWeek] || DAY_ASTROLOGY.sunday;
  const currentAspect = currentAstro.aspects[aspect] || currentAstro.aspects.wealth;

  const handleStartDraw = (e) => {
    e.preventDefault();
    setSelectedCardIdx(null);
    setStep(2);
  };

  const handleSelectCard = (cardIdx) => {
    setSelectedCardIdx(cardIdx);

    // Find the real charm and gemstone bead in the database accessories
    const charmMatch =
      accessories.find(
        (a) =>
          a.category?.name === "CHARM" &&
          a.name.toLowerCase().includes(currentAspect.charmKeyword.toLowerCase())
      ) ||
      accessories.find((a) => a.category?.name === "CHARM") ||
      null;

    const beadMatch =
      accessories.find(
        (a) =>
          (a.category?.name === "BEAD" || a.category?.name === "STONE") &&
          a.name.toLowerCase().includes(currentAspect.beadKeyword.toLowerCase())
      ) ||
      accessories.find((a) => a.category?.name === "BEAD") ||
      null;

    setMatchedCharm(charmMatch);
    setMatchedBead(beadMatch);

    // Card flip transition
    setTimeout(() => {
      setStep(3);
    }, 700);
  };

  // Add customized bracelet with this charm to cart
  const handleAddToCart = async () => {
    if (!customizableProduct) return;
    try {
      setIsAddingToCart(true);

      const chosenAccs = [];
      if (matchedCharm) chosenAccs.push(matchedCharm);
      if (matchedBead) chosenAccs.push(matchedBead);

      const thumb =
        customizableProduct.images?.[0]?.url ||
        customizableProduct.imageUrl ||
        "/images/placeholder.jpg";

      await cartService.addToCart(
        customizableProduct.id,
        1,
        "วัสดุมาตรฐาน",
        "16 cm",
        chosenAccs,
        {
          name: `${customizableProduct.name} (ร้อย${matchedCharm ? matchedCharm.name : "จี้มงคล"})`,
          price: Number(customizableProduct.price) + (matchedCharm ? Number(matchedCharm.price) : 0),
          image: thumb,
          shopId: customizableProduct.shopId,
        }
      );

      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("เกิดข้อผิดพลาดในการใส่ตะกร้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan flex flex-col justify-between selection:bg-[#EADECC]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full my-8">
        {/* Step 1: เลือกวันเกิด + ด้านที่ต้องการเสริม */}
        {step === 1 && (
          <div className="w-full max-w-lg bg-white border border-[#EADECC] p-7 sm:p-9 rounded-3xl shadow-sm animate-fadeIn">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#556B2F]/10 text-[#556B2F] mb-3">
                <Sparkles size={14} />
                ศาสตร์ทักษาปกรณ์ &amp; จี้หินมงคลประจำวันเกิด
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#3C322A]">
                ทำนายและเปิดไพ่สุ่มจี้มงคล
              </h1>
              <p className="text-xs sm:text-sm text-[#8C8577] mt-1.5">
                เลือกวันเกิดและเรื่องที่คุณต้องการเสริมดวง ระบบจะจับคู่กับจี้เงินแท้และหินมงคลจริงจากคลังสตูดิโอ
              </p>
            </div>

            <form onSubmit={handleStartDraw} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-[#6A5242] uppercase tracking-wider mb-2">
                  1. เลือกวันเกิดของคุณ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "sunday", label: "วันอาทิตย์", element: "ธาตุไฟ" },
                    { id: "monday", label: "วันจันทร์", element: "ธาตุดิน" },
                    { id: "tuesday", label: "วันอังคาร", element: "ธาตุลม" },
                    { id: "wednesday", label: "วันพุธ", element: "ธาตุน้ำ" },
                    { id: "thursday", label: "วันพฤหัสบดี", element: "ธาตุดินใหญ่" },
                    { id: "friday", label: "วันศุกร์", element: "ธาตุน้ำบริสุทธิ์" },
                    { id: "saturday", label: "วันเสาร์", element: "ธาตุไฟ/ดินแข็ง" },
                  ].map((d) => {
                    const isSelected = dayOfWeek === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDayOfWeek(d.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#6A5242] bg-[#6A5242] text-white shadow-xs"
                            : "border-[#EADECC] bg-[#FDFBF7] text-[#3C322A] hover:border-[#6A5242]/50 hover:bg-white"
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight">{d.label}</p>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? "text-amber-200" : "text-[#8C8577]"
                          }`}
                        >
                          {d.element}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6A5242] uppercase tracking-wider mb-2">
                  2. ด้านที่ต้องการเปิดดวงมากที่สุดในตอนนี้
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: "wealth",
                      title: "โชคลาภ & การเงิน",
                      desc: "ค้าขายร่ำรวย เงินทองไม่รั่วไหล",
                      icon: Gem,
                    },
                    {
                      id: "work",
                      title: "การงาน & บารมี",
                      desc: "เลื่อนตำแหน่ง ชนะคู่แข่ง เจรจาสำเร็จ",
                      icon: Award,
                    },
                    {
                      id: "love",
                      title: "ความรัก & มหาเสน่ห์",
                      desc: "เมตตามหานิยม คนรักใคร่เอ็นดู",
                      icon: Heart,
                    },
                    {
                      id: "peace",
                      title: "สุขภาพ & ปัดเป่าเคราะห์",
                      desc: "จิตใจสงบ แคล้วคลาดปลอดภัย",
                      icon: ShieldAlert,
                    },
                  ].map((a) => {
                    const isSelected = aspect === a.id;
                    const IconComp = a.icon;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAspect(a.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? "border-[#556B2F] bg-[#556B2F]/10 ring-2 ring-[#556B2F] text-[#3C322A]"
                            : "border-[#EADECC] bg-[#FDFBF7] text-[#3C322A] hover:border-[#6A5242]/50 hover:bg-white"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#556B2F] text-white"
                              : "bg-[#EADECC]/40 text-[#6A5242]"
                          }`}
                        >
                          <IconComp size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold">{a.title}</p>
                          <p className="text-[11px] text-[#8C8577] truncate">{a.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Compass size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  ระบบเชื่อมต่อกับ <strong>คลังวัสดุจริง 43 รายการ</strong>{" "}
                  เมื่อเปิดไพ่คุณจะได้รับจี้และหินมงคลที่ตรงกับดวงชะตา พร้อมนำไปสั่งทำกำไลข้อมือได้ทันที
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#6A5242] hover:bg-[#556B2F] text-white font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} />
                ไปสู่ขั้นตอนเปิดไพ่ชะตา →
              </button>
            </form>
          </div>
        )}

        {/* Step 2: เลือกไพ่ 1 ใน 4 ใบ */}
        {step === 2 && (
          <div className="w-full text-center animate-fadeIn max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#556B2F]/10 text-[#556B2F] mb-2">
              <Sparkles size={14} />
              คนเกิด{currentAstro.name} ({currentAstro.element})
            </span>
            <h2 className="text-2xl font-extrabold text-[#3C322A]">
              เลือกไพ่แห่งพลังงาน 1 ใบ เพื่อเปิดดวงชะตา
            </h2>
            <p className="text-xs text-[#8C8577] mt-1 mb-8 max-w-md mx-auto">
              ทำสมาธิ ตั้งจิตนิ่งๆ แล้วคลิกเลือกไพ่ใบที่คุณรู้สึกมีแรงดึงดูดมากที่สุด
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TAROT_CARDS.map((card, idx) => {
                const IconComp = card.icon;
                const isFlipping = selectedCardIdx === idx;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(idx)}
                    disabled={selectedCardIdx !== null}
                    className={`h-72 rounded-3xl border-2 p-5 flex flex-col items-center justify-between transition-all duration-500 cursor-pointer text-center relative overflow-hidden group shadow-sm hover:shadow-lg ${
                      isFlipping
                        ? "bg-[#556B2F] border-[#556B2F] text-white scale-105"
                        : "bg-white border-[#EADECC] text-[#6A5242] hover:-translate-y-2 hover:border-[#6A5242]"
                    }`}
                  >
                    {/* Pattern Accent */}
                    <div className="absolute inset-0 border border-dashed border-[#EADECC]/60 m-2 rounded-2xl pointer-events-none" />

                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#8C8577]">
                      BARE &amp; BOLD
                    </div>

                    <div className="my-auto flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:rotate-12 ${
                          isFlipping
                            ? "bg-white/20 text-white"
                            : "bg-[#FDFBF7] text-[#6A5242] border border-[#EADECC]"
                        }`}
                      >
                        <IconComp size={26} />
                      </div>
                      <span className="font-extrabold text-sm tracking-wide">{card.title}</span>
                      <span
                        className={`text-[10px] mt-1 max-w-[110px] leading-snug ${
                          isFlipping ? "text-white/80" : "text-[#8C8577]"
                        }`}
                      >
                        {card.subtitle}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-[#556B2F] flex items-center gap-1">
                      <Sparkles size={12} />
                      คลิกเพื่อเปิดไพ่
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: ผลการทำนาย + จี้มงคลจริง + หินมงคลจริง + สินค้าสั่งทำใน DB */}
        {step === 3 && (
          <div className="w-full max-w-2xl bg-white border border-[#EADECC] rounded-3xl p-6 sm:p-8 shadow-sm animate-fadeIn space-y-6">
            {/* Header Result */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADECC]/60 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#556B2F]/10 text-[#556B2F]">
                    ดวงชะตาคนเกิด{currentAstro.name} ({currentAstro.element})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                    {currentAspect.title}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#3C322A] mt-2">
                  ผลการจับคู่จี้และหินมงคลประจำตัว
                </h2>
                <p className="text-xs text-[#8C8577] mt-0.5">
                  เทพประจำวัน: {currentAstro.rulingDeity}
                </p>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setSelectedCardIdx(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EADECC] text-xs font-bold text-[#6A5242] hover:bg-[#FDFBF7] transition cursor-pointer"
              >
                <RotateCcw size={13} />
                ดูดวงใหม่
              </button>
            </div>

            {/* Prediction text */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EADECC] text-xs sm:text-sm text-[#3C322A] leading-relaxed">
              <p className="font-bold text-[#6A5242] mb-1 flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#556B2F]" />
                คำพยากรณ์และพลังธาตุ:
              </p>
              <p className="text-[#55473A]">{currentAspect.prediction}</p>
              <p className="text-xs text-[#556B2F] font-semibold mt-2">
                💡 ข้อแนะนำ: {currentAspect.advice}
              </p>
            </div>

            {/* Matched Real Accessories (Charm + Bead from Database) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Charm */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3.5">
                {matchedCharm?.imageUrl ? (
                  <img
                    src={matchedCharm.imageUrl}
                    alt={matchedCharm.name}
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                    <Sparkles size={24} />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                    จี้มงคลประจำตัว
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#3C322A] mt-1 line-clamp-1">
                    {matchedCharm ? matchedCharm.name : "จี้มงคลเสริมชะตา"}
                  </h4>
                  <p className="text-[11px] text-[#8C8577] line-clamp-1 mt-0.5">
                    {matchedCharm?.description || "จี้เสริมพลังบารมีเฉพาะวันเกิด"}
                  </p>
                  <p className="text-xs font-extrabold text-[#556B2F] mt-1">
                    +฿{matchedCharm ? Number(matchedCharm.price).toLocaleString() : 0}
                  </p>
                </div>
              </div>

              {/* Bead */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center gap-3.5">
                {matchedBead?.imageUrl ? (
                  <img
                    src={matchedBead.imageUrl}
                    alt={matchedBead.name}
                    className="w-16 h-16 rounded-xl object-cover border border-amber-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                    <Gem size={24} />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-600 text-white">
                    หินมงคลคู่บารมี
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#3C322A] mt-1 line-clamp-1">
                    {matchedBead ? matchedBead.name : "หินนำโชคประจำราศี"}
                  </h4>
                  <p className="text-[11px] text-[#8C8577] line-clamp-1 mt-0.5">
                    {matchedBead?.description || "ลูกปัดหินนำโชคธรรมชาติคัดเกรด"}
                  </p>
                  <p className="text-xs font-extrabold text-amber-800 mt-1">
                    +฿{matchedBead ? Number(matchedBead.price).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Auspicious Colors vs Taboo Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={15} /> โทนสีเชือกมงคลที่แนะนำ:
                </p>
                <p className="font-medium text-emerald-700">
                  {currentAstro.luckyColors.join(" · ")}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-rose-800">
                  <ShieldAlert size={15} /> สีกาลกิณีที่ห้ามใช้เด็ดขาด:
                </p>
                <p className="font-semibold text-rose-700">{currentAstro.tabooColor}</p>
              </div>
            </div>

            {/* Matched Customizable Product from DB */}
            {customizableProduct && (
              <div className="rounded-2xl border-2 border-[#EADECC] p-4 sm:p-5 bg-[#FAF8F5] flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={
                    customizableProduct.images?.[0]?.url ||
                    customizableProduct.imageUrl ||
                    "/images/placeholder.jpg"
                  }
                  alt={customizableProduct.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#EADECC] shrink-0"
                />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#6A5242]/10 text-[#6A5242] text-[10px] font-bold">
                      สินค้าสั่งทำ Made-to-Order ในระบบ
                    </span>
                    <span className="text-[11px] text-[#8C8577]">
                      สตูดิโอ {customizableProduct.shop?.name || "Bare & Bold"}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#3C322A] mt-1 truncate">
                    {customizableProduct.name}
                  </h3>
                  <p className="text-xs text-[#8C8577] mt-0.5 line-clamp-1">
                    สามารถปรับแต่งขนาดข้อมือ สีเชือก และร้อยจี้{" "}
                    <strong>{matchedCharm ? matchedCharm.name : "จี้มงคล"}</strong> ได้ทันที
                  </p>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-2">
                    <span className="text-lg font-extrabold text-[#556B2F]">
                      ฿
                      {(
                        Number(customizableProduct.price) +
                        (matchedCharm ? Number(matchedCharm.price) : 0)
                      ).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#8C8577]">
                      (ราคากำไล ฿{Number(customizableProduct.price).toLocaleString()} + จี้ ฿
                      {matchedCharm ? Number(matchedCharm.price).toLocaleString() : 0})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions: Link to customize OR 1-click Add to Cart */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              {customizableProduct && (
                <>
                  <Link
                    href={`/products/${customizableProduct.id}${
                      matchedCharm ? `?accessoryId=${matchedCharm.id}` : ""
                    }`}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-[#6A5242] text-xs font-bold text-[#6A5242] hover:bg-[#F5F0E6] transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>สั่งทำกำไลร้อยจี้ชิ้นนี้</span>
                    <ArrowRight size={14} />
                  </Link>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#556B2F] hover:bg-[#435524] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBag size={15} />
                    {isAddingToCart ? "กำลังเพิ่มลงตะกร้า..." : "ใส่ตะกร้าพร้อมจี้มงคลทันที"}
                  </button>
                </>
              )}
            </div>

            {addSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 text-center animate-fadeIn">
                เพิ่มกำไลพร้อมจี้มงคลลงในตะกร้าสินค้าเรียบร้อยแล้ว! สามารถเปิดดูในตะกร้าได้ทันที
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
