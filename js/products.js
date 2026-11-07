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

const STYLE_LABELS = {
  ipa:        { en: "IPA",            th: "ไอพีเอ" },
  "pale-ale": { en: "Pale Ale",       th: "เพล เอล" },
  weizen:     { en: "Weizen",         th: "ไวเซน" },
  lager:      { en: "Lager",          th: "ลาเกอร์" },
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
    tags: ["ipa"],
    name: { en: "India Pale Ale", th: "อินเดีย เพล เอล" },
    style: { en: "American IPA", th: "อเมริกัน ไอพีเอ" },
    abv: 7.5,
    ibu: 15,
    ebc: 6,
    colorName: { en: "Pale Gold", th: "สีทองอ่อน" },
    aroma: {
      en: ["Tropical fruit", "Citrus", "Passionfruit"],
      th: ["ผลไม้เมืองร้อน", "ส้ม/เลมอน", "เสาวรส"]
    },
    taste: {
      en: "American IPA on a pilsner and wheat malt base, whirlpooled with Citra, Mosaic and Nectaron, then dry-hopped with Citra, Mosaic and Amarillo. Bitterness around 15 IBU.",
      th: "อเมริกันไอพีเอ ใช้มอลต์พิลสเนอร์และข้าวสาลีเป็นฐาน ฮ็อปสแตนด์ด้วย Citra, Mosaic และ Nectaron แล้วดราย-ฮอปด้วย Citra, Mosaic และ Amarillo ความขมประมาณ 15 IBU"
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
      en: ["Guava & peach", "Citrus & passionfruit", "Tropical hops"],
      th: ["ฝรั่งและพีช", "ส้มและเสาวรส", "ฮ็อปเขตร้อน"]
    },
    taste: {
      en: "Double dry-hopped with Citra, Mosaic, Amarillo and Galaxy Cryo hops. Hazy body, bitterness around 35 IBU.",
      th: "ดับเบิลดราย-ฮอปด้วย Citra, Mosaic, Amarillo และ Galaxy แบบ Cryo เนื้อเบียร์ขุ่น ความขมประมาณ 35 IBU"
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
      en: "American pale ale built on Munich and caramel malts, hopped with Citra, Mosaic and Riwaka.",
      th: "อเมริกันเพลเอล ใช้มอลต์มิวนิกและคาราเมลเป็นฐาน ฮ็อปด้วย Citra, Mosaic และ Riwaka"
    }
  },
  {
    id: "corona-khon",
    image: "images/corona-khon-mexican-lager.png",
    tags: ["lager"],
    name: { en: "Corona-Khon", th: "โคโรน่า-คอน" },
    style: { en: "Mexican Lager", th: "เม็กซิกัน ลาเกอร์" },
    abv: 6.0,
    ibu: 13,
    ebc: 7,
    colorName: { en: "Pale Straw", th: "สีฟางอ่อน" },
    aroma: {
      en: ["Light grain", "Sweet corn", "Soft herbal hops"],
      th: ["ธัญพืชอ่อนๆ", "ข้าวโพดหวาน", "ฮ็อปกลิ่นสมุนไพรเบาๆ"]
    },
    taste: {
      en: "Crisp Mexican-style lager on pilsner malt with flaked maize, hopped with Saaz and Hallertauer Mittelfrüh, fermented cold and lagered for two weeks. Bitterness around 13 IBU.",
      th: "ลาเกอร์สไตล์เม็กซิกัน สดชื่น ใช้มอลต์พิลสเนอร์และข้าวโพดเกล็ด ฮ็อปด้วย Saaz และ Hallertauer Mittelfrüh หมักเย็นแล้วบ่มอีกสองสัปดาห์ ความขมประมาณ 13 IBU"
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
      en: ["Banana", "Clove", "Bread crust"],
      th: ["กล้วย", "กานพลู", "ขนมปัง"]
    },
    taste: {
      en: "Bavarian-style wheat beer fermented with a banana-and-clove yeast strain, with Hallertauer hops. Hazy body.",
      th: "วีทเบียร์สไตล์บาวาเรีย หมักด้วยยีสต์สายพันธุ์กล้วย-กานพลู ใช้ฮ็อป Hallertauer เนื้อเบียร์ขุ่น"
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
      en: ["Coriander & orange peel", "Citrus", "Spice"],
      th: ["ผักชีและเปลือกส้ม", "ส้ม", "เครื่องเทศ"]
    },
    taste: {
      en: "Belgian-style wheat beer brewed with coriander seed and sweet orange peel, using flaked oats and pale wheat.",
      th: "วิทเบียร์สไตล์เบลเยียม ใส่เมล็ดผักชีและเปลือกส้มหวาน ใช้ข้าวโอ๊ตเกล็ดและข้าวสาลี"
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
      en: ["Honey", "Lime zest"],
      th: ["น้ำผึ้ง", "ผิวมะนาว"]
    },
    taste: {
      en: "Honey mead made with fresh lime.",
      th: "มี้ดจากน้ำผึ้งแท้ ใส่มะนาวสด"
    }
  },
  {
    id: "cali-mead",
    image: "images/cali-mead.png",
    tags: ["mead"],
    name: { en: "Cali Mead", th: "คาลิ มี้ด" },
    style: { en: "Calamansi & Honey Mead", th: "มี้ดส้มจี๊ดผสมน้ำผึ้ง" },
    abv: 4.0,
    ibu: 0,
    ebc: null,
    colorName: { en: null, th: null },
    aroma: {
      en: ["Calamansi zest", "Honey"],
      th: ["ผิวส้มจี๊ด", "น้ำผึ้ง"]
    },
    taste: {
      en: "Honey mead made with calamansi, a small Southeast Asian citrus.",
      th: "มี้ดจากน้ำผึ้งแท้ ผสมน้ำส้มจี๊ด"
    }
  },
  {
    id: "mangosteen-mead",
    image: "images/mangosteen-mead.png",
    tags: ["mead"],
    name: { en: "Mangosteen Mead", th: "มังคุด มี้ด" },
    style: { en: "Mangosteen & Honey Mead", th: "มี้ดมังคุดผสมน้ำผึ้ง" },
    abv: 4.0,
    ibu: 0,
    ebc: null,
    colorName: { en: null, th: null },
    aroma: {
      en: ["Mangosteen", "Honey", "Floral"],
      th: ["มังคุด", "น้ำผึ้ง", "กลิ่นดอกไม้"]
    },
    taste: {
      en: "Honey mead made with mangosteen from Young Tam Farm in Phrom Khiri, a collaboration with the farm.",
      th: "มี้ดจากน้ำผึ้งแท้ ใส่มังคุดจากยังทำฟาร์ม อ.พรหมคีรี ทำร่วมกับทางฟาร์ม"
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
      en: ["Apple", "Light caramel"],
      th: ["แอปเปิ้ล", "คาราเมลอ่อนๆ"]
    },
    taste: {
      en: "Cider fermented from apple juice.",
      th: "ไซเดอร์หมักจากน้ำแอปเปิ้ล"
    }
  },
  {
    id: "blue-moon-pastry",
    image: "images/blue-moon-pastry.png",
    tags: ["sour"],
    name: { en: "Blue Moon Pastry", th: "บลูมูน เพสตรี้" },
    style: { en: "Black Sour (Pastry Sour)", th: "แบล็กซาวร์ (เพสตรี้ซาวร์)" },
    abv: 4.5,
    ibu: 0,
    ebc: 65,
    colorName: { en: "Deep Black-Brown", th: "สีดำน้ำตาลเข้ม" },
    aroma: {
      en: ["Dark chocolate & coffee", "Blueberry", "Lactic tartness"],
      th: ["ดาร์กช็อกโกแลตและกาแฟ", "บลูเบอร์รี่", "เปรี้ยวแลคติก"]
    },
    taste: {
      en: "Black sour brewed with chocolate malt, roasted barley and lactose, kettle-soured, with coffee and blueberry added.",
      th: "แบล็กซาวร์ ใช้มอลต์ช็อกโกแลต ข้าวบาร์เลย์คั่ว และแลคโตส หมักเปรี้ยวแบบ kettle sour เติมกาแฟและบลูเบอร์รี่"
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
      en: "Oatmeal stout built on roasted barley and chocolate malt with flaked oats, hopped with Saaz. Bitterness around 13 IBU.",
      th: "โอ๊ตมีลสเตาต์ ใช้ข้าวบาร์เลย์คั่วและมอลต์ช็อกโกแลต เติมข้าวโอ๊ตเกล็ด ใช้ฮ็อป Saaz ความขมประมาณ 13 IBU"
    }
  }
];
