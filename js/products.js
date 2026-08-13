// Product data sourced from Brewfather recipe sheets where available.
// Beers without a matching recipe sheet (Honey & Lime Mead, Apple Cider)
// intentionally omit ABV/IBU/color numbers rather than guessing.
// Approximate SRM->RGB swatch, based on the common homebrew color approximation.
function srmToColor(srm) {
  if (srm == null) return "#c9a86a";
  var r = Math.round(255 * Math.pow(0.975, srm));
  var g = Math.round(255 * Math.pow(0.88, srm));
  var b = Math.round(255 * Math.pow(0.7, srm));
  return "rgb(" + r + "," + g + "," + b + ")";
}
function ebcToSrm(ebc) {
  return ebc == null ? null : Math.round((ebc / 1.97) * 10) / 10;
}

// Shipping estimate, based on Thailand Post's published domestic EMS rate
// table (flat nationwide by weight, not zone-based). Mirrored in
// functions/api/order.js as the server-side source of truth — keep both in sync.
var CAN_WEIGHT_KG = 0.34;
var PACKAGING_KG = 0.15;
var FREE_SHIPPING_QTY = 10;
var EMS_RATE_TIERS = [
  [0.02, 32], [0.10, 37], [0.25, 42], [0.50, 52], [1.00, 67],
  [1.50, 82], [2.00, 97], [5.00, 120], [10.00, 220], [20.00, 320], [30.00, 480]
];

function cartWeightKg(totalQty) {
  return totalQty > 0 ? Math.round((totalQty * CAN_WEIGHT_KG + PACKAGING_KG) * 100) / 100 : 0;
}

function emsRateForWeight(weightKg) {
  for (var i = 0; i < EMS_RATE_TIERS.length; i++) {
    if (weightKg <= EMS_RATE_TIERS[i][0]) return EMS_RATE_TIERS[i][1];
  }
  return null; // over 30kg - contact shop directly
}

function estimateShipping(totalQty) {
  if (totalQty <= 0) return { free: false, cost: 0, weightKg: 0 };
  if (totalQty >= FREE_SHIPPING_QTY) {
    return { free: true, cost: 0, weightKg: cartWeightKg(totalQty) };
  }
  var weightKg = cartWeightKg(totalQty);
  return { free: false, cost: emsRateForWeight(weightKg), weightKg: weightKg };
}

// Prices in THB per can. Mirrored server-side in functions/api/order.js,
// which is the authoritative source used to compute the amount actually
// charged - never trust a client-submitted price.
var PRICES = {
  ipa: 120,
  "ddh-ipa": 130,
  moonlight: 110,
  "som-som": 110,
  "nual-gaarden": 110,
  "honey-lime": 110,
  "apple-cider": 110,
  "blue-moon-pastry": 110,
  midnight: 110
};
function priceOf(id) { return PRICES[id] != null ? PRICES[id] : 0; }

// PromptPay dynamic QR payload builder (EMV QR Code spec / PromptPay).
// The merchant account block below was extracted from the shop's own static
// PromptPay QR - swapping the point-of-initiation method to "12" (dynamic)
// and adding a transaction-amount field produces a QR that pre-fills the
// exact order amount when scanned. No third-party service is involved.
var PROMPTPAY_MERCHANT_BLOCK = "0016A0000006770101110315004999074338343";
// ^ tag 29 inner value (AID + proxy/reference subfields), fixed length 39.

function crc16ccitt(str) {
  var crc = 0xFFFF;
  for (var i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (var b = 0; b < 8; b++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(tag, value) {
  var len = String(value.length).padStart(2, "0");
  return tag + len + value;
}

function buildPromptPayPayload(amountBaht) {
  var amountStr = amountBaht.toFixed(2);
  var payload =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("29", PROMPTPAY_MERCHANT_BLOCK) +
    tlv("53", "764") +
    tlv("54", amountStr) +
    tlv("58", "TH");
  return payload + "6304" + crc16ccitt(payload + "6304");
}

const STYLE_LABELS = {
  ipa:        { en: "IPA",            th: "ไอพีเอ" },
  "pale-ale": { en: "Pale Ale",       th: "เพล เอล" },
  weizen:     { en: "Weizen",         th: "ไวเซน" },
  witbier:    { en: "Witbier",        th: "วิทเบียร์" },
  mead:       { en: "Mead",           th: "มี้ด" },
  cider:      { en: "Cider",          th: "ไซเดอร์" },
  sour:       { en: "Sour",           th: "ซาวร์" },
  stout:      { en: "Stout",          th: "สเตาต์" }
};

const BADGE_LABELS = {
  bestseller: { en: "Best Seller", th: "ขายดีที่สุด", icon: "star" },
  signature:  { en: "Signature",   th: "ซิกเนเจอร์", icon: "seal" }
};

const PRODUCTS = [
  {
    id: "ipa",
    image: "images/ipa.png",
    badges: ["bestseller"],
    tags: ["ipa"],
    name: { en: "India Pale Ale", th: "อินเดีย เพล เอล" },
    style: { en: "American IPA", th: "อเมริกัน ไอพีเอ" },
    abv: 6.0,
    ibu: 30,
    ebc: 14,
    colorName: { en: "Golden Amber", th: "สีทองอำพัน" },
    aroma: {
      en: ["Ripe mango & passionfruit", "Citrus zest", "Light pine resin"],
      th: ["มะม่วงสุกและเสาวรส", "ผิวส้ม/เลมอน", "สนอ่อนๆ"]
    },
    taste: {
      en: "A juicy, dry-hopped IPA loaded with Citra, Mosaic, Simcoe and Nectaron. Ripe mango and passionfruit up front, a light biscuity malt backbone, and a clean, moderately bitter finish.",
      th: "ไอพีเอดราย-ฮอปจัดเต็มด้วย Citra, Mosaic, Simcoe และ Nectaron หอมมะม่วงสุกและเสาวรสนำ ตามด้วยมอลต์รสขนมปังบางๆ ปิดท้ายด้วยความขมสะอาดระดับกลาง"
    }
  },
  {
    id: "ddh-ipa",
    image: "images/ddh-ipa.png",
    tags: ["ipa"],
    name: { en: "DDH IPA", th: "ดีดีเอช ไอพีเอ" },
    style: { en: "Double Dry-Hopped IPA", th: "ดับเบิลดราย-ฮอป ไอพีเอ" },
    abv: 6.7,
    ibu: 35,
    ebc: 7,
    colorName: { en: "Hazy Pale Gold", th: "สีทองอ่อนขุ่น" },
    aroma: {
      en: ["Guava & peach", "Citrus & passionfruit", "Dank tropical punch"],
      th: ["ฝรั่งและพีช", "ส้มและเสาวรส", "หอมฮ็อปเขตร้อนจัดจ้าน"]
    },
    taste: {
      en: "Double dry-hopped with Citra, Mosaic, Amarillo and Galaxy Cryo hops for maximum juice. A soft, pillowy body, low perceived bitterness, and a huge tropical hop punch in every sip.",
      th: "ดับเบิลดราย-ฮอปด้วย Citra, Mosaic, Amarillo และ Galaxy แบบ Cryo เพื่อความจัดจ้านสูงสุด เนื้อเบียร์นุ่มละมุน ความขมต่ำ แต่หอมฮ็อปเขตร้อนแน่นทุกอึก"
    }
  },
  {
    id: "moonlight",
    image: "images/moonlight-pale-ale.png",
    tags: ["pale-ale"],
    name: { en: "Moonlight", th: "มูนไลท์" },
    style: { en: "American Pale Ale", th: "อเมริกัน เพล เอล" },
    abv: 5.4,
    ibu: null,
    ebc: 13,
    colorName: { en: "Golden Amber", th: "สีทองอำพัน" },
    aroma: {
      en: ["Citrus & mixed berry", "Passionfruit", "Light caramel"],
      th: ["ผลไม้ตระกูลเบอร์รี่และส้ม", "เสาวรส", "คาราเมลอ่อนๆ"]
    },
    taste: {
      en: "An easy-drinking pale ale built on Munich and caramel malts, finished with Citra, Mosaic and Riwaka for a soft, fruity hop character and a smooth, low-bitterness finish.",
      th: "เพล เอล ดื่มง่าย ใช้มอลต์มิวนิกและคาราเมลเป็นฐาน ปิดท้ายด้วยฮ็อป Citra, Mosaic และ Riwaka ให้กลิ่นผลไม้นุ่มนวล ความขมต่ำ ดื่มลื่นคอ"
    }
  },
  {
    id: "som-som",
    image: "images/som-som-weizen.png",
    tags: ["weizen"],
    name: { en: "Som-Som", th: "ส้มส้ม" },
    style: { en: "Hefeweizen", th: "ไวเซน" },
    abv: 5.0,
    ibu: 11,
    ebc: 6,
    colorName: { en: "Pale Straw", th: "สีฟางอ่อน" },
    aroma: {
      en: ["Ripe banana", "Clove & bubblegum", "Soft bread crust"],
      th: ["กล้วยสุก", "กานพลูและหมากฝรั่ง", "ขนมปังนุ่มๆ"]
    },
    taste: {
      en: "A traditional Bavarian-style wheat beer fermented with a classic banana-and-clove yeast strain. Soft, hazy and bready with noble Hallertauer hop character in the background.",
      th: "วีทเบียร์สไตล์บาวาเรียแบบดั้งเดิม หมักด้วยยีสต์สายพันธุ์กล้วย-กานพลูคลาสสิก เนื้อนุ่มขุ่นหอมขนมปัง แซมด้วยกลิ่นฮ็อปโนเบิลบางๆ"
    }
  },
  {
    id: "nual-gaarden",
    image: "images/nual-gaarden-witbier.png",
    tags: ["witbier"],
    name: { en: "Nual-Gaarden", th: "นวล-การ์เดน" },
    style: { en: "Belgian Witbier", th: "เบลเจียน วิทเบียร์" },
    abv: 5.0,
    ibu: 7,
    ebc: 6,
    colorName: { en: "Pale Straw", th: "สีฟางอ่อน" },
    aroma: {
      en: ["Coriander & sweet orange peel", "Soft citrus zest", "Delicate spice"],
      th: ["ผักชีและเปลือกส้มหวาน", "ผิวส้มอ่อนๆ", "เครื่องเทศละมุน"]
    },
    taste: {
      en: "A classic Belgian-style wheat beer brewed with coriander seed and sweet orange peel. Silky body from flaked oats and pale wheat, finished crisp, spiced and refreshing.",
      th: "วิทเบียร์สไตล์เบลเยียมแท้ ใส่เมล็ดผักชีและเปลือกส้มหวาน เนื้อเบียร์นุ่มลื่นจากข้าวโอ๊ตเกล็ดและข้าวสาลี ปิดท้ายสดชื่น หอมเครื่องเทศ"
    }
  },
  {
    id: "honey-lime",
    image: "images/honey-lime-mead.png",
    tags: ["mead"],
    name: { en: "Honey & Lime Mead", th: "ฮันนี่ แอนด์ ไลม์ มี้ด" },
    style: { en: "Mead", th: "มี้ด" },
    abv: 4.5,
    ibu: 0,
    ebc: null,
    colorName: { en: null, th: null },
    aroma: {
      en: ["Raw honey", "Fresh lime zest"],
      th: ["น้ำผึ้งแท้", "ผิวมะนาวสด"]
    },
    taste: {
      en: "A honey mead brightened with fresh lime, balancing natural sweetness with citrus acidity for an easy, refreshing sip.",
      th: "มี้ดจากน้ำผึ้งแท้ เติมความสดชื่นด้วยมะนาว บาลานซ์ความหวานธรรมชาติกับความเปรี้ยวจากส้มได้ลงตัว ดื่มง่าย"
    }
  },
  {
    id: "apple-cider",
    image: "images/apple-cider.png",
    tags: ["cider"],
    name: { en: "Apple Cider", th: "แอปเปิ้ล ไซเดอร์" },
    style: { en: "Cider", th: "ไซเดอร์" },
    abv: 5.0,
    ibu: 0,
    ebc: null,
    colorName: { en: null, th: null },
    aroma: {
      en: ["Fresh apple", "Light caramel"],
      th: ["แอปเปิ้ลสด", "คาราเมลอ่อนๆ"]
    },
    taste: {
      en: "A crisp apple cider balancing natural sweetness and tartness for an easy, sessionable drink.",
      th: "ไซเดอร์แอปเปิ้ลสดชื่น บาลานซ์ความหวานธรรมชาติและความเปรี้ยวได้ลงตัว ดื่มง่ายทุกโอกาส"
    }
  },
  {
    id: "blue-moon-pastry",
    image: "images/blue-moon-pastry.png",
    badges: ["bestseller", "signature"],
    tags: ["sour"],
    name: { en: "Blue Moon Pastry", th: "บลูมูน เพสตรี้" },
    style: { en: "Black Sour (Pastry Sour)", th: "แบล็กซาวร์ (เพสตรี้ซาวร์)" },
    abv: 4.5,
    ibu: 0,
    ebc: 65,
    colorName: { en: "Deep Black-Brown", th: "สีดำน้ำตาลเข้ม" },
    aroma: {
      en: ["Dark chocolate & coffee", "Blueberry", "Light lactic tartness"],
      th: ["ดาร์กช็อกโกแลตและกาแฟ", "บลูเบอร์รี่", "เปรี้ยวแลคติกบางๆ"]
    },
    taste: {
      en: "A dessert-inspired black sour brewed with chocolate malt, roasted barley and lactose, kettle-soured for a smooth tartness, then rounded out with coffee and blueberry for a rich, pastry-like finish.",
      th: "แบล็กซาวร์แนวของหวาน ใช้มอลต์ช็อกโกแลต ข้าวบาร์เลย์คั่ว และแลคโตส หมักเปรี้ยวแบบ kettle sour ให้ความเปรี้ยวนุ่มนวล เติมกาแฟและบลูเบอร์รี่ให้รสสัมผัสเข้มข้นแบบของหวาน"
    }
  },
  {
    id: "midnight",
    image: "images/midnight-stout.png",
    tags: ["stout"],
    name: { en: "Midnight", th: "มิดไนท์" },
    style: { en: "Oatmeal Stout", th: "โอ๊ตมีล สเตาต์" },
    abv: 5.5,
    ibu: 13,
    ebc: 78,
    colorName: { en: "Near Black", th: "สีดำเข้ม" },
    aroma: {
      en: ["Dark chocolate & light roast", "Toasted grain"],
      th: ["ดาร์กช็อกโกแลตและกลิ่นคั่วอ่อน", "ธัญพืชคั่ว"]
    },
    taste: {
      en: "A rich oatmeal stout built on roasted barley and chocolate malt with a silky, full body from flaked oats. Noble Saaz hops keep the bitterness restrained, letting the roasted malt lead.",
      th: "โอ๊ตมีลสเตาต์เข้มข้น ใช้ข้าวบาร์เลย์คั่วและมอลต์ช็อกโกแลตเป็นฐาน เนื้อเบียร์นุ่มเต็มคำจากข้าวโอ๊ตเกล็ด ฮ็อป Saaz คุมความขมให้นวล เน้นรสมอลต์คั่วเป็นพระเอก"
    }
  }
];
