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
      "hero.eyebrow": "EST. 2023",
      "hero.tagline": "Small-batch craft beer with a feline soul.<br>Brewed in Nakhon Si Thammarat since 2023.",
      "hero.cta1": "See All Beers",
      "hero.cta2": "Where to Buy",
      "hero.scroll": "Scroll to explore ↓",
      "products.eyebrow": "OUR BEERS",
      "products.title": "Our Craft Beer Lineup",
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
      "events.desc": "Hosting a private party, wedding, or corporate event?<br>We bring and set up the draft tap system at your venue.",
      "events.kegLabel": "Keg (20L)",
      "events.kegServings": "Includes draft tap setup",
      "events.note": "Flavors available: same lineup as our canned beers.<br>Looking for something specific? Contact us to discuss.",
      "events.cta": "Contact Us to Book",
      "contact.eyebrow": "GET IN TOUCH",
      "contact.title": "Where to Buy & Contact",
      "contact.desc": "Interested in ordering, an event collab, or stocking our beer? Reach us through any channel below.",
      "footer.rights": '&copy; <span id="year"></span> Srinuan Brewing. All rights reserved.',
      "footer.warn": "Drink responsibly · Not for sale to persons under 20 years of age",
      "footer.privacy": "Privacy Policy",
      "modal.aroma": "Aroma",
      "modal.taste": "Tasting Notes",
      "modal.abv": "ABV",
      "modal.ibu": "IBU",
      "modal.color": "Color",
      "order.soldOut": "Sold Out",
      "catalog.contactCta": "Ask about this beer",
      "order.inStock": "In stock",
    },
    th: {
      "nav.products": "สินค้า",
      "nav.story": "เรื่องราว",
      "nav.events": "งานอีเวนต์",
      "nav.contact": "ติดต่อ",
      "hero.eyebrow": "ก่อตั้ง 2023",
      "hero.tagline": "คราฟต์เบียร์โฮมเมด กลิ่นอายแมวเหมียว<br>ผลิตแบบ small-batch ที่นครศรีธรรมราช ตั้งแต่ปี 2023",
      "hero.cta1": "ดูสินค้าทั้งหมด",
      "hero.cta2": "ช่องทางสั่งซื้อ",
      "hero.scroll": "เลื่อนลงเพื่อดูเพิ่มเติม ↓",
      "products.eyebrow": "สินค้าของเรา",
      "products.title": "สินค้าคราฟต์เบียร์ของเรา",
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
      "events.desc": "จัดปาร์ตี้ส่วนตัว งานแต่ง หรืองานอีเวนต์บริษัท?<br>เรายกชุดแท็ปเบียร์สดไปติดตั้งที่หน้างาน",
      "events.kegLabel": "ถังเคก (20 ลิตร)",
      "events.kegServings": "รวมชุดแท็ปเบียร์สดพร้อมติดตั้ง",
      "events.note": "รสชาติมีให้เลือกตามไลน์เบียร์กระป๋องของเรา<br>หากต้องการรสชาติอื่นเพิ่มเติม ติดต่อสอบถามได้เลย",
      "events.cta": "ติดต่อจองคิวงาน",
      "contact.eyebrow": "ติดต่อเรา",
      "contact.title": "ช่องทางสั่งซื้อ & ติดต่อเรา",
      "contact.desc": "สนใจสั่งซื้อ ร่วมงานอีเวนต์ หรือนำเบียร์ของเราไปวางจำหน่าย ทักหาเราได้ทุกช่องทาง",
      "footer.rights": '&copy; <span id="year"></span> Srinuan Brewing สงวนลิขสิทธิ์',
      "footer.warn": "ดื่มไม่ขับ · ดื่มอย่างมีสติ · ห้ามจำหน่ายแก่ผู้มีอายุต่ำกว่า 20 ปี",
      "footer.privacy": "นโยบายความเป็นส่วนตัว",
      "modal.aroma": "กลิ่น",
      "modal.taste": "รสชาติ",
      "modal.abv": "แอลกอฮอล์",
      "modal.ibu": "ความขม (IBU)",
      "modal.color": "สี",
      "order.soldOut": "สินค้าหมด",
      "catalog.contactCta": "สอบถามเกี่ยวกับเบียร์ตัวนี้",
      "order.inStock": "คงเหลือ",
    }
  };

  var currentLang = localStorage.getItem(LANG_KEY) || "en";

  function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en[key] || key);
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

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyStaticText();
    renderFilters();
    renderGrid(currentFilter);
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

  // Beers the shop took off the storefront in admin (ids from /api/hidden).
  var HIDDEN = [];
  function visibleProducts() {
    return PRODUCTS.filter(function (p) { return HIDDEN.indexOf(p.id) === -1; });
  }

  function usedCategories() {
    var set = [];
    visibleProducts().forEach(function (p) {
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

  function stockLineHtml(p) {
    var stock = stockOf(p.id);
    if (!stockLoaded || stock == null || stock <= 0) return "";
    return '<p class="product-card__stock">' + t("order.inStock") + ": " + stock + "</p>";
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

  // A beer with no stock saved yet (e.g. just added) counts as 0, the same
  // number admin shows for it - otherwise it would never read "Sold Out".
  function isSoldOut(p) {
    var stock = stockOf(p.id);
    return stockLoaded && (stock == null || stock <= 0);
  }

  function soldOutRibbonHtml(p) {
    if (!isSoldOut(p)) return "";
    return '<div class="soldout-ribbon">' + t("order.soldOut") + "</div>";
  }

  function cardTemplate(p) {
    var name = p.name[currentLang] || p.name.en;
    var style = p.style[currentLang] || p.style.en;
    return (
      '<article class="product-card' + (isSoldOut(p) ? " product-card--soldout" : "") + '" data-id="' + p.id + '">' +
        badgeRow(p) +
        '<div class="product-card__img-wrap"><img src="' + p.image + '" alt="' + name + '" loading="lazy">' + soldOutRibbonHtml(p) + "</div>" +
        '<p class="product-card__style">' + style + "</p>" +
        '<h3 class="product-card__name">' + name + "</h3>" +
        '<div class="product-card__specs">' + abvIbuColorRow(p) + "</div>" +
        stockLineHtml(p) +
      "</article>"
    );
  }

  function renderGrid(filter) {
    var items = visibleProducts();
    if (filter && filter !== "all") {
      items = items.filter(function (p) { return p.tags[0] === filter; });
    }
    grid.innerHTML = items.map(cardTemplate).join("");
    grid.querySelectorAll(".product-card").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card.dataset.id); });
    });
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
          '<div class="modal__order">' + stockLineHtml(p) +
            '<a class="btn btn--primary modal__contact" href="#contact">' + t("catalog.contactCta") + "</a></div>" +
        "</div>" +
      "</div>";
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").addEventListener("click", closeModal);
    modalCard.querySelector(".modal__contact").addEventListener("click", closeModal);
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Init ---------- */
  function fetchHidden() {
    return fetch("/api/hidden?t=" + Date.now(), { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : []; })
      .then(function (ids) { HIDDEN = Array.isArray(ids) ? ids : []; })
      .catch(function () { HIDDEN = []; });
  }

  // Wait for the hidden list before drawing the grid, so a beer taken off the
  // storefront never flashes up first. If the API is slow, draw everything
  // after 2.5s rather than leave the section empty.
  function paintCatalogue() {
    renderFilters();
    renderGrid(currentFilter);
  }
  applyStaticText();
  var giveUp = setTimeout(paintCatalogue, 2500);
  Promise.all([fetchHidden(), fetchStock()]).then(function () {
    clearTimeout(giveUp);
    // A visitor may have picked a style chip during the fallback paint whose
    // only beers turn out to be hidden; fall back to "All" instead of an empty grid.
    if (currentFilter !== "all" && usedCategories().indexOf(currentFilter) === -1) currentFilter = "all";
    paintCatalogue();
  });
})();
