(function () {
  "use strict";

  /* ---------- i18n ---------- */
  var LANG_KEY = "srinuan_lang";
  var i18n = {
    en: {
      "nav.products": "Beers",
      "nav.story": "Our Story",
      "nav.events": "Events",
      "nav.contact": "Contact",
      "nav.track": "Track Order",
      "hero.eyebrow": "EST. 2023 · CRAFT BREWERY",
      "hero.tagline": "Small-batch craft beer with a feline soul.<br>Brewed with heart, in every can.",
      "hero.cta1": "See All Beers",
      "hero.cta2": "Where to Buy",
      "hero.scroll": "Scroll to explore ↓",
      "products.eyebrow": "OUR BEERS",
      "products.title": "Our Craft Beer Lineup",
      "promo.freeShipping": "🚚 Buy {n}+ cans, get FREE shipping!",
      "filter.all": "All",
      "story.eyebrow": "OUR STORY",
      "story.title": "The Srinuan Story",
      "story.p1": "Srinuan Brewing was founded in 2023 out of a shared love for craft beer and cats. Every can pairs a carefully built recipe with artwork that tells its own story through a cat character — from bold IPAs to rich stouts and refreshing ciders.",
      "story.p2": "We believe great beer needs more than good taste — it needs a story and a character worth remembering. That's why every cat on our cans has its own personality and world.",
      "story.stat1": "Beers",
      "story.stat2": "Founded",
      "story.stat3": "Craft Brewed",
      "events.eyebrow": "EVENTS & PRIVATE PARTIES",
      "events.title": "Bring Srinuan to Your Event",
      "events.desc": "Hosting a private party, wedding, or corporate event?<br>We bring our draft beer tap setup to you, fully stocked and ready to pour.",
      "events.kegLabel": "Keg (20L)",
      "events.kegPrice": "Starting from 4,000 THB / keg",
      "events.kegServings": "🥤 ~60 servings (300ml glass)",
      "events.note": "Flavors available: same lineup as our canned beers. Looking for something specific? Contact us to discuss.",
      "events.cta": "Contact Us to Book",
      "contact.eyebrow": "GET IN TOUCH",
      "contact.title": "Where to Buy & Contact",
      "contact.desc": "Interested in ordering, an event collab, or stocking our beer? Reach us through any channel below.",
      "footer.rights": '&copy; <span id="year"></span> Srinuan Brewing. All rights reserved.',
      "footer.warn": "Drink responsibly · Not for sale to persons under 20 years of age",
      "modal.aroma": "Aroma",
      "modal.taste": "Tasting Notes",
      "modal.abv": "ABV",
      "modal.ibu": "IBU",
      "modal.color": "Color",
      "order.button": "Order Now",
      "order.soldOut": "Sold Out",
      "order.inStock": "In stock",
      "order.title": "Place an Order",
      "order.name": "Full Name",
      "order.phone": "Phone Number",
      "order.email": "Email (for tracking updates)",
      "order.emailPlaceholder": "you@example.com",
      "order.errorNoSlip": "Please attach your payment slip before submitting.",
      "order.errorSlipProcessing": "Your slip is still uploading — please wait a moment.",
      "order.errorSlipRead": "Could not read that image. Please try another file.",
      "order.slipProcessing": "Processing slip...",
      "cart.stockChanged": "Some items were adjusted — stock changed while you were shopping. Please check the total before paying.",
      "cart.allSoldOut": "Sorry, those items just sold out.",
      "order.deliveryEms": "Delivery (Thailand Post EMS)",
      "order.pickup": "Self Pickup",
      "order.pickupHint": "Pick up in person at Tham Phanna, Nakhon Si Thammarat — no shipping cost. We'll confirm a pickup time with you.",
      "order.address": "Delivery Address",
      "order.addressLine": "House No. / Village",
      "order.addressLinePlaceholder": "e.g. 55 Moo 3",
      "order.subdistrict": "Sub-district",
      "order.district": "District",
      "order.province": "Province",
      "order.postalCode": "Postal Code",
      "order.quantity": "Quantity",
      "order.submit": "Send Order",
      "order.sending": "Sending...",
      "order.success": "Order sent! We'll contact you shortly to confirm.",
      "order.errorInsufficient": "Sorry, only {n} left in stock.",
      "order.errorGeneric": "Something went wrong. Please try again.",
      "order.close": "Close",
      "cart.items": "{n} in cart",
      "cart.confirm": "Confirm Order",
      "cart.free": "Free",
      "cart.baht": "THB",
      "cart.subtotal": "Items",
      "cart.total": "Total",
      "cart.weight": "Est. weight",
      "cart.shipping": "Est. shipping (Thailand Post EMS)",
      "cart.freeHint": "Free shipping on orders of {n}+ cans",
      "cart.shipContactUs": "Contact us for a quote",
      "cart.payTitle": "Scan to Pay via PromptPay",
      "cart.payHint": "Amount is pre-filled in the QR — just scan with your banking app.",
      "cart.attachSlip": "📎 Attach Payment Slip (required)",
      "cart.shippingPickup": "Shipping",
      "cart.kg": "kg",
      "cart.pickupFree": "Free (self pickup)"
    },
    th: {
      "nav.products": "สินค้า",
      "nav.story": "เรื่องราว",
      "nav.events": "งานอีเวนต์",
      "nav.contact": "ติดต่อ",
      "nav.track": "เช็คสถานะออเดอร์",
      "hero.eyebrow": "ก่อตั้ง 2023 · คราฟต์เบียร์รี",
      "hero.tagline": "คราฟต์เบียร์โฮมเมด กลิ่นอายแมวเหมียว<br>บ่มด้วยใจ ต้มด้วยความตั้งใจ",
      "hero.cta1": "ดูสินค้าทั้งหมด",
      "hero.cta2": "ช่องทางสั่งซื้อ",
      "hero.scroll": "เลื่อนลงเพื่อดูเพิ่มเติม ↓",
      "products.eyebrow": "สินค้าของเรา",
      "products.title": "สินค้าคราฟต์เบียร์ของเรา",
      "promo.freeShipping": "🚚 ซื้อครบ {n} กระป๋องขึ้นไป ส่งฟรีทันที!",
      "filter.all": "ทั้งหมด",
      "story.eyebrow": "เรื่องราวของเรา",
      "story.title": "เรื่องราวของศรีนวล",
      "story.p1": "ศรีนวล บริววิ่ง ก่อตั้งขึ้นในปี 2023 จากความหลงใหลในคราฟต์เบียร์และแมว ทุกกระป๋องของเราคือการผสมผสานระหว่างสูตรเบียร์ที่พิถีพิถัน กับงานศิลปะที่เล่าเรื่องราวผ่านตัวละครแมวประจำแต่ละรสชาติ ตั้งแต่ IPA รสจัดจ้าน ไปจนถึงสเตาต์เข้มข้น และไซเดอร์สดชื่น",
      "story.p2": "เราเชื่อว่าเบียร์ที่ดีไม่ได้มีดีแค่รสชาติ แต่ต้องมีเรื่องราวและคาแรกเตอร์ที่จดจำได้ นี่คือเหตุผลที่แมวแต่ละตัวบนกระป๋องของเรา มีบุคลิกและโลกของตัวเองที่ไม่เหมือนใคร",
      "story.stat1": "รสชาติ",
      "story.stat2": "ก่อตั้ง",
      "story.stat3": "คราฟต์แท้",
      "events.eyebrow": "งานอีเวนต์ & ปาร์ตี้ส่วนตัว",
      "events.title": "พาศรีนวลไปงานของคุณ",
      "events.desc": "จัดปาร์ตี้ส่วนตัว งานแต่ง หรืองานอีเวนต์บริษัท?<br>เรายกชุดก๊อกเบียร์สดพร้อมเบียร์ไปให้ถึงหน้างาน",
      "events.kegLabel": "ถังเคก (20 ลิตร)",
      "events.kegPrice": "เริ่มต้น 4,000 บาท/ถัง",
      "events.kegServings": "🥤 เสิร์ฟได้ประมาณ 60 แก้ว (แก้วขนาด 300 มล.)",
      "events.note": "รสชาติมีให้เลือกตามไลน์เบียร์กระป๋องของเรา หากต้องการรสชาติอื่นเพิ่มเติม ติดต่อสอบถามได้เลย",
      "events.cta": "ติดต่อจองคิวงาน",
      "contact.eyebrow": "ติดต่อเรา",
      "contact.title": "ช่องทางสั่งซื้อ & ติดต่อเรา",
      "contact.desc": "สนใจสั่งซื้อ ร่วมงานอีเวนต์ หรือนำเบียร์ของเราไปวางจำหน่าย ทักหาเราได้ทุกช่องทาง",
      "footer.rights": '&copy; <span id="year"></span> Srinuan Brewing สงวนลิขสิทธิ์',
      "footer.warn": "ดื่มไม่ขับ · ดื่มอย่างมีสติ · ห้ามจำหน่ายแก่ผู้มีอายุต่ำกว่า 20 ปี",
      "modal.aroma": "กลิ่น",
      "modal.taste": "รสชาติ",
      "modal.abv": "แอลกอฮอล์",
      "modal.ibu": "ความขม (IBU)",
      "modal.color": "สี",
      "order.button": "สั่งซื้อ",
      "order.soldOut": "สินค้าหมด",
      "order.inStock": "คงเหลือ",
      "order.title": "สั่งซื้อสินค้า",
      "order.name": "ชื่อ-นามสกุล",
      "order.phone": "เบอร์โทรศัพท์",
      "order.email": "อีเมล (สำหรับแจ้งเลขพัสดุ)",
      "order.emailPlaceholder": "you@example.com",
      "order.errorNoSlip": "กรุณาแนบสลิปโอนเงินก่อนส่งคำสั่งซื้อ",
      "order.errorSlipProcessing": "กำลังอัปโหลดสลิป กรุณารอสักครู่",
      "order.errorSlipRead": "อ่านไฟล์รูปไม่ได้ กรุณาเลือกไฟล์อื่น",
      "order.slipProcessing": "กำลังประมวลผลสลิป...",
      "cart.stockChanged": "มีบางรายการถูกปรับจำนวน เนื่องจากสต็อกเปลี่ยนระหว่างที่คุณเลือกซื้อ กรุณาตรวจสอบยอดรวมก่อนชำระเงิน",
      "cart.allSoldOut": "ขออภัย สินค้าที่เลือกเพิ่งหมดพอดี",
      "order.deliveryEms": "จัดส่งทางไปรษณีย์ (EMS)",
      "order.pickup": "มารับด้วยตนเอง",
      "order.pickupHint": "มารับสินค้าด้วยตนเองที่ถ้ำพรรณรา จ.นครศรีธรรมราช ไม่เสียค่าส่ง ทางร้านจะติดต่อนัดเวลารับสินค้า",
      "order.address": "ที่อยู่จัดส่ง",
      "order.addressLine": "เลขที่/หมู่บ้าน",
      "order.addressLinePlaceholder": "เช่น 55 หมู่ 3",
      "order.subdistrict": "ตำบล/แขวง",
      "order.district": "อำเภอ/เขต",
      "order.province": "จังหวัด",
      "order.postalCode": "รหัสไปรษณีย์",
      "order.quantity": "จำนวน",
      "order.submit": "ส่งคำสั่งซื้อ",
      "order.sending": "กำลังส่ง...",
      "order.success": "ส่งคำสั่งซื้อแล้ว! ทางร้านจะติดต่อกลับเพื่อยืนยันเร็วๆ นี้",
      "order.errorInsufficient": "ขออภัย เหลือสินค้าเพียง {n} ชิ้น",
      "order.errorGeneric": "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      "order.close": "ปิด",
      "cart.items": "ในตะกร้า {n} ชิ้น",
      "cart.confirm": "ยืนยันการสั่งซื้อ",
      "cart.free": "ฟรี",
      "cart.baht": "บาท",
      "cart.subtotal": "ค่าสินค้า",
      "cart.total": "ยอดรวมทั้งหมด",
      "cart.weight": "น้ำหนักโดยประมาณ",
      "cart.shipping": "ค่าจัดส่งโดยประมาณ (ไปรษณีย์ไทย EMS)",
      "cart.freeHint": "ส่งฟรีเมื่อสั่งตั้งแต่ {n} กระป๋องขึ้นไป",
      "cart.shipContactUs": "ติดต่อร้านเพื่อสอบถามค่าส่ง",
      "cart.payTitle": "สแกนจ่ายผ่าน PromptPay",
      "cart.payHint": "ระบบใส่ยอดเงินให้อัตโนมัติแล้ว สแกนด้วยแอปธนาคารได้เลย",
      "cart.attachSlip": "📎 แนบสลิปโอนเงิน (จำเป็นต้องแนบ)",
      "cart.shippingPickup": "ค่าจัดส่ง",
      "cart.kg": "กก.",
      "cart.pickupFree": "ฟรี (มารับเอง)"
    }
  };

  var currentLang = localStorage.getItem(LANG_KEY) || "en";

  function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en[key] || key);
  }

  // The checkout screen always renders in Thai, whatever the site toggle says:
  // buyers are filling in a Thai name and address, so Thai labels are easier to
  // read and fill in. Site chrome still follows the EN/TH switch.
  function tTh(key) {
    return (i18n.th && i18n.th[key]) || t(key);
  }

  function applyStaticText() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    document.querySelectorAll(".lang-switch__opt").forEach(function (el) {
      el.classList.toggle("active", el.dataset.lang === currentLang);
    });
  }

  function renderPromoBanner() {
    var el = document.getElementById("promo-banner");
    if (el) el.textContent = t("promo.freeShipping").replace("{n}", FREE_SHIPPING_QTY);
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyStaticText();
    renderPromoBanner();
    renderFilters();
    renderGrid(currentFilter);
    renderCartBar();
  }

  /* ---------- Age Gate ---------- */
  var ageGate = document.getElementById("age-gate");
  var ageBlock = document.getElementById("age-block");
  var siteContent = document.getElementById("site-content");
  var AGE_KEY = "srinuan_age_verified";

  function unlockSite() {
    ageGate.classList.add("hidden");
    ageBlock.classList.add("hidden");
    siteContent.classList.remove("hidden");
  }

  if (sessionStorage.getItem(AGE_KEY) === "yes") {
    unlockSite();
  } else {
    ageGate.classList.remove("hidden");
  }

  document.getElementById("age-yes").addEventListener("click", function () {
    sessionStorage.setItem(AGE_KEY, "yes");
    unlockSite();
  });
  document.getElementById("age-no").addEventListener("click", function () {
    ageGate.classList.add("hidden");
    ageBlock.classList.remove("hidden");
  });

  /* ---------- Language switch ---------- */
  document.getElementById("lang-switch").addEventListener("click", function () {
    setLang(currentLang === "en" ? "th" : "en");
  });

  /* ---------- Nav toggle (mobile) ---------- */
  var navToggle = document.getElementById("nav-toggle");
  navToggle.addEventListener("click", function () {
    navToggle.closest(".site-header__inner").classList.toggle("nav-open");
  });
  document.querySelectorAll(".nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.closest(".site-header__inner").classList.remove("nav-open");
    });
  });

  /* ---------- Products ---------- */
  var grid = document.getElementById("product-grid");
  var filterBar = document.getElementById("filter-bar");
  var currentFilter = "all";

  function usedCategories() {
    var set = [];
    PRODUCTS.forEach(function (p) {
      if (set.indexOf(p.tags[0]) === -1) set.push(p.tags[0]);
    });
    return set;
  }

  function renderFilters() {
    var cats = usedCategories();
    var chips = ['<button class="filter-chip' + (currentFilter === "all" ? " active" : "") + '" data-filter="all">' + t("filter.all") + "</button>"];
    cats.forEach(function (key) {
      var label = (STYLE_LABELS[key] && STYLE_LABELS[key][currentLang]) || key;
      chips.push('<button class="filter-chip' + (currentFilter === key ? " active" : "") + '" data-filter="' + key + '">' + label + "</button>");
    });
    filterBar.innerHTML = chips.join("");
    filterBar.querySelectorAll(".filter-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentFilter = btn.dataset.filter;
        renderFilters();
        renderGrid(currentFilter);
      });
    });
  }

  function abvIbuColorRow(p) {
    var parts = [];
    if (p.abv != null) parts.push('<span class="spec-chip">' + p.abv + "% " + t("modal.abv") + "</span>");
    if (p.ibu != null) parts.push('<span class="spec-chip">' + p.ibu + " " + t("modal.ibu") + "</span>");
    return parts.join("");
  }

  /* ---------- Stock ---------- */
  var STOCK = {};
  var stockLoaded = false;

  function fetchStock() {
    return fetch("/api/stock?t=" + Date.now(), { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : {}; })
      .then(function (data) { STOCK = data || {}; stockLoaded = true; })
      .catch(function () { stockLoaded = false; });
  }

  function stockOf(id) {
    return STOCK[id] != null ? STOCK[id] : null;
  }

  /* ---------- Cart ---------- */
  var CART = {};

  function cartQtyOf(id) { return CART[id] || 0; }

  function cartTotalQty() {
    return Object.keys(CART).reduce(function (sum, id) { return sum + CART[id]; }, 0);
  }

  function setCartQty(id, qty) {
    var stock = stockOf(id);
    var max = stock != null ? stock : 99;
    qty = Math.max(0, Math.min(qty, max));
    if (qty <= 0) { delete CART[id]; } else { CART[id] = qty; }
    renderCartBar();
  }

  function clampCartToStock() {
    var changed = false;
    Object.keys(CART).forEach(function (id) {
      var stock = stockOf(id);
      if (stock == null) return;
      if (CART[id] > stock) {
        changed = true;
        if (stock <= 0) { delete CART[id]; } else { CART[id] = stock; }
      }
    });
    return changed;
  }

  // Re-check stock right before checkout: the customer is about to scan the QR
  // and pay, so the amount must reflect stock as it is now, not at page load.
  function openCheckoutFlow() {
    if (!cartTotalQty()) return;
    fetchStock().then(function () {
      var changed = clampCartToStock();
      renderCartBar();
      renderGrid(currentFilter);
      if (!cartTotalQty()) { alert(tTh("cart.allSoldOut")); return; }
      openCheckoutModal();
      if (changed) {
        var msgEl = document.getElementById("order-form-msg");
        if (msgEl) {
          msgEl.className = "order-form__msg order-form__msg--err";
          msgEl.textContent = tTh("cart.stockChanged");
        }
      }
    });
  }

  function stockLineHtml(p) {
    var stock = stockOf(p.id);
    if (!stockLoaded || stock == null || stock <= 0) return "";
    return '<p class="product-card__stock">' + t("order.inStock") + ": " + stock + "</p>";
  }

  function stepperHtml(p) {
    var stock = stockOf(p.id);
    var soldOut = stockLoaded && stock != null && stock <= 0;
    if (soldOut) {
      return '<div class="stepper stepper--soldout">' + t("order.soldOut") + "</div>";
    }
    var qty = cartQtyOf(p.id);
    return (
      '<div class="stepper" data-id="' + p.id + '">' +
        '<button class="stepper__btn" data-step="-1" ' + (qty <= 0 ? "disabled" : "") + '>&minus;</button>' +
        '<span class="stepper__qty">' + qty + "</span>" +
        '<button class="stepper__btn" data-step="1">+</button>' +
      "</div>"
    );
  }

  function refreshSteppers() {
    document.querySelectorAll(".stepper[data-id]").forEach(function (el) {
      var id = el.dataset.id;
      var qty = cartQtyOf(id);
      var qtyEl = el.querySelector(".stepper__qty");
      if (qtyEl) qtyEl.textContent = qty;
      var decBtn = el.querySelector('[data-step="-1"]');
      if (decBtn) decBtn.disabled = qty <= 0;
    });
  }

  /* ---------- Cart bar ---------- */
  var cartBar = document.getElementById("cart-bar");

  function renderCartBar() {
    var total = cartTotalQty();
    if (total <= 0) {
      cartBar.classList.add("hidden");
      cartBar.innerHTML = "";
      refreshSteppers();
      return;
    }
    cartBar.classList.remove("hidden");
    cartBar.innerHTML =
      '<span class="cart-bar__count">' + t("cart.items").replace("{n}", "<strong>" + total + "</strong>") + "</span>" +
      '<button class="cart-bar__btn" id="cart-confirm-btn">' + t("cart.confirm") + "</button>";
    document.getElementById("cart-confirm-btn").addEventListener("click", openCheckoutFlow);
    refreshSteppers();
  }

  var BADGE_ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.05 6.6.86-4.85 4.62 1.27 6.57L12 17.6l-5.92 3-1.27-6.57-4.85-4.62 6.6-.86z"/></svg>',
    seal: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.1 3.1-.6.9 3 2.9 1.2-.6 3.1L22.8 13l-2.1 2.4.6 3.1-3.1.9-1.2 2.9-3.1-.6L12 24l-2.4-2.1-3.1.6-1.2-2.9-3.1-.9.6-3.1L.6 13l2.1-2.4-.6-3.1 3.1-.9 1.2-3 3.1.6z"/></svg>'
  };

  function badgeRow(p) {
    if (!p.badges || !p.badges.length) return "";
    var items = p.badges.map(function (key) {
      var b = BADGE_LABELS[key];
      if (!b) return "";
      var label = b[currentLang] || b.en;
      return '<span class="badge badge--' + key + '">' + (BADGE_ICONS[b.icon] || "") + "<em>" + label + "</em></span>";
    }).join("");
    return '<div class="product-card__badges">' + items + "</div>";
  }

  function isSoldOut(p) {
    var stock = stockOf(p.id);
    return stockLoaded && stock != null && stock <= 0;
  }

  function soldOutRibbonHtml(p) {
    if (!isSoldOut(p)) return "";
    return '<div class="soldout-ribbon">' + t("order.soldOut") + "</div>";
  }

  function priceTagHtml(p) {
    var price = priceOf(p.id);
    if (!price) return "";
    return '<div class="price-tag">' + price + " " + t("cart.baht") + "</div>";
  }

  function cardTemplate(p) {
    var name = p.name[currentLang] || p.name.en;
    var style = p.style[currentLang] || p.style.en;
    return (
      '<article class="product-card' + (isSoldOut(p) ? " product-card--soldout" : "") + '" data-id="' + p.id + '">' +
        badgeRow(p) +
        priceTagHtml(p) +
        '<div class="product-card__img-wrap"><img src="' + p.image + '" alt="' + name + '" loading="lazy">' + soldOutRibbonHtml(p) + "</div>" +
        '<p class="product-card__style">' + style + "</p>" +
        '<h3 class="product-card__name">' + name + "</h3>" +
        '<div class="product-card__specs">' + abvIbuColorRow(p) + "</div>" +
        stockLineHtml(p) +
        '<div class="product-card__order">' + stepperHtml(p) + "</div>" +
      "</article>"
    );
  }

  function bindSteppers(root) {
    root.querySelectorAll(".stepper[data-id]").forEach(function (el) {
      el.querySelectorAll("[data-step]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var id = el.dataset.id;
          setCartQty(id, cartQtyOf(id) + parseInt(btn.dataset.step, 10));
        });
      });
    });
  }

  function renderGrid(filter) {
    var items = PRODUCTS;
    if (filter && filter !== "all") {
      items = PRODUCTS.filter(function (p) { return p.tags[0] === filter; });
    }
    grid.innerHTML = items.map(cardTemplate).join("");
    grid.querySelectorAll(".product-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".stepper")) return;
        openModal(card.dataset.id);
      });
    });
    bindSteppers(grid);
  }

  /* ---------- Modal ---------- */
  var modal = document.getElementById("product-modal");
  var modalCard = document.getElementById("modal-card");
  var modalBackdrop = document.getElementById("modal-backdrop");

  function openModal(id) {
    var p = PRODUCTS.find(function (x) { return x.id === id; });
    if (!p) return;
    var name = p.name[currentLang] || p.name.en;
    var style = p.style[currentLang] || p.style.en;
    var aroma = p.aroma[currentLang] || p.aroma.en;
    var taste = p.taste[currentLang] || p.taste.en;
    var colorName = p.colorName ? (p.colorName[currentLang] || p.colorName.en) : null;
    var srm = ebcToSrm(p.ebc);
    var swatch = p.ebc != null ? '<span class="swatch" style="background:' + srmToColor(srm) + '"></span>' : "";

    var specRows = "";
    if (p.abv != null) specRows += '<div class="modal__spec"><span>' + t("modal.abv") + '</span><strong>' + p.abv + '%</strong></div>';
    if (p.ibu != null) specRows += '<div class="modal__spec"><span>' + t("modal.ibu") + '</span><strong>' + p.ibu + '</strong></div>';
    if (colorName) specRows += '<div class="modal__spec"><span>' + t("modal.color") + '</span><strong>' + swatch + colorName + '</strong></div>';

    modalCard.innerHTML =
      '<button class="modal__close" id="modal-close">&times;</button>' +
      '<div class="modal__body">' +
        '<div class="modal__img"><img src="' + p.image + '" alt="' + name + '">' + soldOutRibbonHtml(p) + "</div>" +
        "<div>" +
          badgeRow(p) +
          '<p class="modal__style">' + style + "</p>" +
          '<h3 class="modal__name">' + name + "</h3>" +
          (specRows ? '<div class="modal__specs">' + specRows + "</div>" : "") +
          '<p class="modal__section-label">' + t("modal.aroma") + '</p>' +
          '<div class="modal__tags">' + aroma.map(function (a) { return '<span class="modal__tag">' + a + "</span>"; }).join("") + "</div>" +
          '<p class="modal__section-label">' + t("modal.taste") + '</p>' +
          '<p class="modal__desc">' + taste + "</p>" +
          '<div class="modal__order">' + stepperHtml(p) + stockLineHtml(p) + "</div>" +
        "</div>" +
      "</div>";
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").addEventListener("click", closeModal);
    bindSteppers(modalCard);
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeOrderModal(); }
  });

  /* ---------- Checkout Modal (cart) ---------- */
  var orderModal = document.getElementById("order-modal");
  var orderModalCard = document.getElementById("order-modal-card");
  var orderModalBackdrop = document.getElementById("order-modal-backdrop");

  function cartLineItems() {
    return Object.keys(CART).map(function (id) {
      var p = PRODUCTS.find(function (x) { return x.id === id; });
      return { product: p, qty: CART[id] };
    }).filter(function (line) { return line.product; });
  }

  function cartSubtotal(lines) {
    return lines.reduce(function (sum, line) { return sum + priceOf(line.product.id) * line.qty; }, 0);
  }

  function cartSummaryHtml(lines, deliveryMethod) {
    var totalQty = lines.reduce(function (s, l) { return s + l.qty; }, 0);
    var est = estimateShipping(totalQty);
    var subtotal = cartSubtotal(lines);
    var isPickup = deliveryMethod === "pickup";
    var shipCost = isPickup ? 0 : (est.free ? 0 : (est.cost || 0));
    var grandTotal = subtotal + shipCost;
    var shipText = isPickup
      ? tTh("cart.pickupFree")
      : (est.free ? tTh("cart.free") : (est.cost != null ? est.cost + " " + tTh("cart.baht") : tTh("cart.shipContactUs")));
    return (
      '<div class="cart-summary__row"><span>' + tTh("cart.subtotal") + "</span><span>" + subtotal + " " + tTh("cart.baht") + "</span></div>" +
      (!isPickup ? '<div class="cart-summary__row"><span>' + tTh("cart.weight") + "</span><span>" + est.weightKg + " " + tTh("cart.kg") + "</span></div>" : "") +
      '<div class="cart-summary__row"><span>' + (isPickup ? tTh("cart.shippingPickup") : tTh("cart.shipping")) + "</span><span>" + shipText + "</span></div>" +
      '<div class="cart-summary__row cart-summary__row--total"><span>' + tTh("cart.total") + "</span><span>" + grandTotal + " " + tTh("cart.baht") + "</span></div>" +
      (!isPickup && !est.free ? '<p class="cart-summary__hint">' + tTh("cart.freeHint").replace("{n}", FREE_SHIPPING_QTY) + "</p>" : "")
    );
  }

  function renderPromptPayQr(amountBaht) {
    var container = document.getElementById("promptpay-qr");
    if (!container) return;
    if (amountBaht <= 0) { container.innerHTML = ""; return; }
    var payload = buildPromptPayPayload(amountBaht);
    var qr = qrcode(0, "M");
    qr.addData(payload);
    qr.make();
    container.innerHTML = qr.createSvgTag(5, 0);
  }

  var checkoutDeliveryMethod = "delivery";

  function openCheckoutModal() {
    var lines = cartLineItems();
    if (!lines.length) return;
    var totalQty = cartTotalQty();
    checkoutDeliveryMethod = "delivery";
    // Never carry a previously attached slip into a new checkout - it may be for
    // a different (smaller) amount, and the customer sees an empty upload box.
    slipDataUrl = null;
    slipEncoding = false;

    var itemsHtml = lines.map(function (line) {
      var name = line.product.name.th || line.product.name.en;
      var style = line.product.style.th || line.product.style.en;
      var price = priceOf(line.product.id);
      return (
        '<div class="cart-item" data-id="' + line.product.id + '">' +
          '<img src="' + line.product.image + '" alt="' + name + '">' +
          '<div class="cart-item__info"><h4>' + name + " (" + style + ")</h4>" +
            '<span class="cart-item__price">' + price + " " + tTh("cart.baht") + " &middot; " + line.product.abv + "% ABV</span></div>" +
          '<div class="stepper stepper--sm" data-id="' + line.product.id + '">' +
            '<button class="stepper__btn" data-step="-1">&minus;</button>' +
            '<span class="stepper__qty">' + line.qty + "</span>" +
            '<button class="stepper__btn" data-step="1">+</button>' +
          "</div>" +
        "</div>"
      );
    }).join("");

    orderModalCard.innerHTML =
      '<button class="modal__close" id="order-modal-close">&times;</button>' +
      '<div class="order-form">' +
        '<h4 class="order-form__title">' + tTh("order.title") + "</h4>" +
        '<div class="cart-list" id="cart-list">' + itemsHtml + "</div>" +
        '<div class="cart-summary" id="cart-summary">' + cartSummaryHtml(lines, checkoutDeliveryMethod) + "</div>" +
        '<div class="qr-pay">' +
          '<p class="qr-pay__label">' + tTh("cart.payTitle") + "</p>" +
          '<div id="promptpay-qr" class="qr-pay__code"></div>' +
          '<p class="qr-pay__hint">' + tTh("cart.payHint") + "</p>" +
          '<label class="qr-pay__upload">' +
            tTh("cart.attachSlip") +
            '<input type="file" accept="image/*" id="slip-input">' +
          "</label>" +
          '<div id="slip-preview" class="qr-pay__preview"></div>' +
        "</div>" +
        '<form id="order-form">' +
          '<label>' + tTh("order.name") + '<input type="text" name="name" required></label>' +
          '<label>' + tTh("order.phone") + '<input type="tel" name="phone" required></label>' +
          '<label>' + tTh("order.email") + '<input type="email" name="email" placeholder="' + tTh("order.emailPlaceholder") + '" required></label>' +
          '<div class="delivery-method">' +
            '<label class="delivery-method__option">' +
              '<input type="radio" name="deliveryMethod" value="delivery" checked>' +
              '<span>' + tTh("order.deliveryEms") + "</span>" +
            "</label>" +
            '<label class="delivery-method__option">' +
              '<input type="radio" name="deliveryMethod" value="pickup">' +
              '<span>' + tTh("order.pickup") + "</span>" +
            "</label>" +
          "</div>" +
          '<p class="delivery-method__hint" id="pickup-hint" style="display:none">' + tTh("order.pickupHint") + "</p>" +
          '<div class="order-form__address-group" id="address-group">' +
            '<p class="order-form__address-title">' + tTh("order.address") + '</p>' +
            '<label>' + tTh("order.addressLine") + '<input type="text" name="addressLine" placeholder="' + tTh("order.addressLinePlaceholder") + '" required></label>' +
            '<div class="order-form__address-row">' +
              '<label>' + tTh("order.subdistrict") + '<input type="text" name="subdistrict" required></label>' +
              '<label>' + tTh("order.district") + '<input type="text" name="district" required></label>' +
            "</div>" +
            '<div class="order-form__address-row">' +
              '<label>' + tTh("order.province") + '<input type="text" name="province" required></label>' +
              '<label>' + tTh("order.postalCode") + '<input type="text" name="postalCode" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required></label>' +
            "</div>" +
          "</div>" +
          '<button type="submit" class="btn btn--primary order-form__submit">' + tTh("order.submit") + "</button>" +
          '<p class="order-form__msg" id="order-form-msg"></p>' +
        "</form>" +
      "</div>";

    orderModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.getElementById("order-modal-close").addEventListener("click", closeOrderModal);

    var cartListEl = document.getElementById("cart-list");
    cartListEl.querySelectorAll(".stepper[data-id]").forEach(function (el) {
      el.querySelectorAll("[data-step]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = el.dataset.id;
          setCartQty(id, cartQtyOf(id) + parseInt(btn.dataset.step, 10));
          refreshCheckoutModal();
        });
      });
    });

    document.getElementById("slip-input").addEventListener("change", handleSlipSelect);

    document.querySelectorAll('input[name="deliveryMethod"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        checkoutDeliveryMethod = radio.value;
        updateDeliveryUI();
        refreshCheckoutModal();
      });
    });

    document.getElementById("order-form").addEventListener("submit", function (e) {
      e.preventDefault();
      submitOrder(e.target);
    });

    renderPromptPayQr(cartSubtotal(lines) + (estimateShipping(totalQty).free ? 0 : (estimateShipping(totalQty).cost || 0)));
  }

  function updateDeliveryUI() {
    var isPickup = checkoutDeliveryMethod === "pickup";
    var group = document.getElementById("address-group");
    var hint = document.getElementById("pickup-hint");
    if (group) {
      group.style.display = isPickup ? "none" : "";
      group.querySelectorAll("input").forEach(function (inp) { inp.required = !isPickup; });
    }
    if (hint) hint.style.display = isPickup ? "" : "none";
  }

  function refreshCheckoutModal() {
    var lines = cartLineItems();
    if (!lines.length) { closeOrderModal(); return; }
    orderModalCard.querySelectorAll(".cart-item[data-id]").forEach(function (el) {
      if (!CART[el.dataset.id]) el.remove();
    });
    lines.forEach(function (line) {
      var row = orderModalCard.querySelector('.cart-item[data-id="' + line.product.id + '"] .stepper__qty');
      if (row) row.textContent = line.qty;
    });
    var summaryEl = document.getElementById("cart-summary");
    if (summaryEl) summaryEl.innerHTML = cartSummaryHtml(lines, checkoutDeliveryMethod);
    var totalQty = lines.reduce(function (s, l) { return s + l.qty; }, 0);
    var est = estimateShipping(totalQty);
    var isPickup = checkoutDeliveryMethod === "pickup";
    var shipCost = isPickup ? 0 : (est.free ? 0 : (est.cost || 0));
    renderPromptPayQr(cartSubtotal(lines) + shipCost);
  }

  /* ---------- Slip upload ---------- */
  var slipDataUrl = null;
  var slipEncoding = false;

  // Resizing a phone photo takes a moment; lock the submit button while it runs
  // so a fast tap can't be rejected as "no slip attached".
  function setSlipEncoding(on) {
    slipEncoding = on;
    var btn = document.querySelector(".order-form__submit");
    if (!btn) return;
    btn.disabled = on;
    btn.textContent = on ? tTh("order.slipProcessing") : tTh("order.submit");
  }

  function handleSlipSelect(e) {
    var file = e.target.files[0];
    var previewEl = document.getElementById("slip-preview");
    var uploadEl = document.querySelector(".qr-pay__upload");
    if (uploadEl) uploadEl.classList.remove("qr-pay__upload--error");
    slipDataUrl = null;
    if (!file) { previewEl.innerHTML = ""; setSlipEncoding(false); return; }

    setSlipEncoding(true);
    previewEl.innerHTML = "";

    function fail() {
      slipDataUrl = null;
      setSlipEncoding(false);
      var msgEl = document.getElementById("order-form-msg");
      if (msgEl) {
        msgEl.className = "order-form__msg order-form__msg--err";
        msgEl.textContent = tTh("order.errorSlipRead");
      }
      if (uploadEl) uploadEl.classList.add("qr-pay__upload--error");
    }

    var img = new Image();
    var reader = new FileReader();
    reader.onerror = fail;
    img.onerror = fail;
    reader.onload = function (ev) {
      img.onload = function () {
        try {
          var maxW = 900;
          var scale = Math.min(1, maxW / img.width);
          var canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          slipDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          previewEl.innerHTML = '<img src="' + slipDataUrl + '" alt="slip">';
          setSlipEncoding(false);
        } catch (err) { fail(); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function closeOrderModal() {
    orderModal.classList.add("hidden");
    document.body.style.overflow = "";
    slipDataUrl = null;
    slipEncoding = false;
  }

  function submitOrder(formEl) {
    var lines = cartLineItems();
    if (!lines.length) return;
    var msgEl = document.getElementById("order-form-msg");
    var submitBtn = formEl.querySelector(".order-form__submit");
    var uploadEl = document.querySelector(".qr-pay__upload");

    if (slipEncoding) {
      msgEl.className = "order-form__msg order-form__msg--err";
      msgEl.textContent = tTh("order.errorSlipProcessing");
      return;
    }
    if (!slipDataUrl) {
      msgEl.className = "order-form__msg order-form__msg--err";
      msgEl.textContent = tTh("order.errorNoSlip");
      if (uploadEl) uploadEl.classList.add("qr-pay__upload--error");
      return;
    }
    if (uploadEl) uploadEl.classList.remove("qr-pay__upload--error");

    var items = lines.map(function (line) {
      // Records keep the canonical English name so Telegram, the admin list and
      // the best-seller totals stay consistent with older orders.
      var name = line.product.name.en || line.product.name.th;
      return { productId: line.product.id, productName: name, quantity: line.qty };
    });

    var isPickup = formEl.deliveryMethod.value === "pickup";
    var address = isPickup ? "" : [
      formEl.addressLine.value.trim(),
      "ต." + formEl.subdistrict.value.trim(),
      "อ." + formEl.district.value.trim(),
      "จ." + formEl.province.value.trim(),
      formEl.postalCode.value.trim()
    ].join(" ");

    var payload = {
      items: items,
      name: formEl.name.value,
      phone: formEl.phone.value,
      email: formEl.email.value,
      address: address,
      deliveryMethod: formEl.deliveryMethod.value,
      slipImage: slipDataUrl || null
    };

    submitBtn.disabled = true;
    submitBtn.textContent = tTh("order.sending");
    msgEl.className = "order-form__msg";
    msgEl.textContent = "";

    fetch("/api/order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
      .then(function (result) {
        if (result.status === 200 && result.data.ok) {
          Object.keys(result.data.remaining || {}).forEach(function (id) { STOCK[id] = result.data.remaining[id]; });
          msgEl.className = "order-form__msg order-form__msg--ok";
          msgEl.textContent = tTh("order.success");
          formEl.reset();
          formEl.querySelectorAll("input,textarea,button").forEach(function (el) { el.disabled = true; });
          CART = {};
          slipDataUrl = null;
          renderCartBar();
          renderGrid(currentFilter);
        } else if (result.status === 409) {
          msgEl.className = "order-form__msg order-form__msg--err";
          var shortfall = (result.data.shortfalls || [])[0];
          msgEl.textContent = shortfall
            ? tTh("order.errorInsufficient").replace("{n}", shortfall.available)
            : tTh("order.errorGeneric");
          submitBtn.disabled = false;
          submitBtn.textContent = tTh("order.submit");
          fetchStock().then(function () {
            clampCartToStock();
            renderCartBar();
            renderGrid(currentFilter);
            refreshCheckoutModal();
          });
        } else {
          throw new Error("order_failed");
        }
      })
      .catch(function () {
        msgEl.className = "order-form__msg order-form__msg--err";
        msgEl.textContent = tTh("order.errorGeneric");
        submitBtn.disabled = false;
        submitBtn.textContent = tTh("order.submit");
      });
  }

  orderModalBackdrop.addEventListener("click", closeOrderModal);

  /* ---------- Init ---------- */
  applyStaticText();
  renderPromoBanner();
  renderFilters();
  renderGrid("all");
  renderCartBar();
  fetchStock().then(function () {
    clampCartToStock();
    renderCartBar();
    renderGrid(currentFilter);
  });
})();
