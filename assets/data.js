/* KopiKonek — shared catalog, vendors & cart store (used by index.html and checkout.html) */
(function () {
  'use strict';

  /* The prototype pretends "today" is this date so roast-date labels stay consistent. */
  var PROTOTYPE_TODAY = new Date(2026, 9, 14);
  var PLATFORM_FEE = 2500;
  var CART_KEY = 'kopikonek_cart_v1';

  var FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#EFE6DA"/><stop offset="1" stop-color="#C9B49F"/></linearGradient></defs>' +
    '<rect width="400" height="300" fill="url(#g)"/><g fill="none" stroke="#2C1E16" stroke-opacity=".35" stroke-width="6" stroke-linecap="round">' +
    '<path d="M140 130h120v40a60 60 0 0 1-120 0z"/><path d="M260 140h18a20 20 0 0 1 0 40h-22"/><path d="M165 100c-8 10 8 14 0 24M200 95c-8 10 8 14 0 24"/></g></svg>'
  );

  function img(id, w) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&q=80&w=' + (w || 800);
  }

  /* ---------- Vendors ---------- */
  var vendors = {
    kala:     { id: 'kala',     name: 'Kala Roastery',   city: 'Bandung',   region: 'Bandung, West Java',       initials: 'KR', color: ['#CC5500', '#7A3A12'], roastery: true,
                shipping: [{ id: 'regular', label: 'Regular (2-3 days)', price: 15000 }, { id: 'nextday', label: 'Next Day', price: 25000 }] },
    brewgear: { id: 'brewgear', name: 'BrewGear',        city: 'Jakarta',   region: 'Jakarta',                  initials: 'BG', color: ['#2C1E16', '#5B4636'], roastery: false,
                shipping: [{ id: 'sameday', label: 'Same Day Delivery', price: 35000 }, { id: 'regular', label: 'Regular', price: 10000 }] },
    tanah:    { id: 'tanah',    name: 'Tanah Roast',     city: 'Yogyakarta', region: 'Yogyakarta, DI Yogyakarta', initials: 'TR', color: ['#7C9082', '#4E6254'], roastery: true,
                shipping: [{ id: 'regular', label: 'Regular (3-4 days)', price: 18000 }, { id: 'express', label: 'Express (1-2 days)', price: 28000 }] },
    gayo:     { id: 'gayo',     name: 'Gayo Hill Coffee', city: 'Takengon', region: 'Takengon, Aceh',           initials: 'GH', color: ['#8C6A4A', '#4A3524'], roastery: true,
                shipping: [{ id: 'regular', label: 'Regular (4-6 days)', price: 22000 }, { id: 'express', label: 'Express (2-3 days)', price: 38000 }] },
    pour:     { id: 'pour',     name: 'Pour & Co',       city: 'Surabaya',  region: 'Surabaya, East Java',      initials: 'P&C', color: ['#B7791F', '#6B4510'], roastery: false,
                shipping: [{ id: 'regular', label: 'Regular (2-3 days)', price: 12000 }, { id: 'nextday', label: 'Next Day', price: 27000 }] },
    rimba:    { id: 'rimba',    name: 'Rimba Roasters',  city: 'Ubud',      region: 'Ubud, Bali',               initials: 'RR', color: ['#5E7B5A', '#33472F'], roastery: true, shipping: [] },
    senja:    { id: 'senja',    name: 'Senja Coffee Lab', city: 'Jakarta',  region: 'Jakarta Selatan',          initials: 'SC', color: ['#A8553A', '#5C2A1B'], roastery: true, shipping: [] },
    bajawa:   { id: 'bajawa',   name: 'Bajawa Atelier',  city: 'Bajawa',    region: 'Bajawa, Flores',           initials: 'BA', color: ['#6B6F7A', '#34363D'], roastery: true, shipping: [] }
  };

  /* ---------- Products ---------- */
  var products = [
    { id: 'kamojang', type: 'bean', cat: 'single', vendor: 'kala', name: 'West Java Kamojang', price: 95000, weight: '250g',
      origin: 'West Java', roast: 'Light', notes: ['Fruity', 'Caramel'], roastDate: '2026-10-01',
      profile: { acidity: 80, body: 55, sweetness: 70 }, image: img('1559056199-641a0ac8b55e'),
      desc: 'Volcanic-soil Arabica from the Kamojang highlands. Bright citrus acidity up front, finishing with a soft caramel sweetness.' },
    { id: 'gayo', type: 'bean', cat: 'single', vendor: 'gayo', name: 'Gayo Highland Washed', price: 110000, weight: '250g',
      origin: 'Aceh Gayo', roast: 'Medium', notes: ['Dark Chocolate', 'Spice'], roastDate: '2026-10-08',
      profile: { acidity: 50, body: 85, sweetness: 60 }, image: img('1447933601403-0c6688de566e'),
      desc: 'A full-bodied, syrupy cup from Takengon. Cocoa-forward with a gentle spice finish that holds beautifully with milk.' },
    { id: 'flores', type: 'bean', cat: 'single', vendor: 'tanah', name: 'Flores Bajawa Natural', price: 105000, weight: '250g',
      origin: 'Flores', roast: 'Medium', notes: ['Caramel', 'Nutty'], roastDate: '2026-10-10',
      profile: { acidity: 55, body: 70, sweetness: 80 }, image: img('1587734195503-904fca47e0e9'),
      desc: 'Naturally processed beans from the Bajawa highlands — round, sweet and nutty, with a clean brown-sugar finish.' },
    { id: 'toraja', type: 'bean', cat: 'single', vendor: 'tanah', name: 'Toraja Sapan Honey', price: 135000, weight: '200g',
      origin: 'Toraja', roast: 'Light', notes: ['Floral', 'Berry'], roastDate: '2026-10-12',
      profile: { acidity: 85, body: 45, sweetness: 75 }, image: img('1514432324607-a09d9b4aefdd'),
      desc: 'A delicate honey-processed lot with jasmine aromatics and ripe berry sweetness. Best brewed as a slow pour-over.' },
    { id: 'midnight', type: 'bean', cat: 'blend', vendor: 'kala', name: 'Midnight Crema Blend', price: 125000, weight: '500g',
      origin: 'Java + Sumatra', roast: 'Dark', notes: ['Cocoa', 'Roasted Almond'], roastDate: '2026-10-09',
      profile: { acidity: 30, body: 90, sweetness: 55 }, image: img('1610889556528-9a770e32642f'),
      desc: 'Our espresso workhorse: thick crema, bittersweet cocoa and a lingering roasted-almond finish. Built for milk drinks.' },
    { id: 'sunrise', type: 'bean', cat: 'blend', vendor: 'tanah', name: 'Sunrise Espresso Blend', price: 115000, weight: '250g',
      origin: 'Flores + Toraja', roast: 'Medium', notes: ['Brown Sugar', 'Orange Zest'], roastDate: '2026-10-11',
      profile: { acidity: 65, body: 70, sweetness: 78 }, image: img('1511920170033-f8396924c348'),
      desc: 'A brighter, sweeter espresso with orange-zest lift and brown-sugar depth. Stunning straight or with a splash of milk.' },
    { id: 'coldbrew', type: 'bean', cat: 'blend', vendor: 'gayo', name: 'Cold Brew House Blend', price: 98000, weight: '500g',
      origin: 'Aceh + Bali', roast: 'Medium', notes: ['Chocolate', 'Cherry'], roastDate: '2026-10-06',
      profile: { acidity: 40, body: 75, sweetness: 85 }, image: img('1461023058943-07fcbe16d735'),
      desc: 'Coarse-ground friendly and naturally sweet. Steep for 16 hours for a smooth, chocolate-cherry concentrate.' },

    { id: 'hand-grinder', type: 'gear', cat: 'grinder', vendor: 'brewgear', name: 'Premium Hand Grinder', price: 580000,
      material: 'Stainless Steel', capacity: '30g', brand: 'BrewGear Pro', image: img('1611854779393-1b2da9d400fe'), pos: 'center',
      desc: 'CNC-machined steel burrs and a precision dial with 36 click settings, from Turkish to French press.' },
    { id: 'v60', type: 'gear', cat: 'manual', vendor: 'brewgear', name: 'Hario V60 Ceramic Dripper', price: 165000,
      material: 'Ceramic', capacity: '1-4 cups', brand: 'Hario', image: img('1522992319-0365e5f11656'), pos: 'center',
      desc: 'The icon of pour-over. Spiral ribs and a large single hole put you in control of every brew.' },
    { id: 'kettle', type: 'gear', cat: 'manual', vendor: 'pour', name: 'Gooseneck Pour Kettle', price: 420000,
      material: 'Stainless Steel', capacity: '900ml', brand: 'Pourfect', image: img('1442512595331-e89e73853f31'), pos: '85% 15%',
      desc: 'A balanced gooseneck spout for a calm, controlled pour. Matte finish with a heat-safe handle.' },
    { id: 'server', type: 'gear', cat: 'manual', vendor: 'brewgear', name: 'Glass Coffee Server', price: 145000,
      material: 'Borosilicate Glass', capacity: '600ml', brand: 'Hario', image: img('1521302080334-4bebac2763a6'), pos: 'center',
      desc: 'Heat-resistant borosilicate server with measurement marks and a no-drip spout.' },
    { id: 'electric-grinder', type: 'gear', cat: 'grinder', vendor: 'pour', name: 'Electric Burr Grinder', price: 1250000,
      material: 'Steel + ABS', capacity: '250g hopper', brand: 'Moka Lab', image: img('1497935586351-b67a49e012bf'), pos: 'center',
      desc: 'Flat 54mm burrs and 40 stepped settings. Consistent, quiet and fast — for espresso to French press.' }
  ];

  var productMap = {};
  products.forEach(function (p) { productMap[p.id] = p; });

  /* ---------- Helpers ---------- */
  function fmt(n) { return 'Rp ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function daysSince(iso) {
    var d = new Date(iso + 'T00:00:00');
    return Math.max(0, Math.round((PROTOTYPE_TODAY - d) / 86400000));
  }

  /* ---------- Cart store (localStorage) ---------- */
  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      if (raw === null) {
        /* First visit: seed a split-cart so the multi-vendor logic is visible straight away. */
        var seed = [{ id: 'kamojang', qty: 2, grind: 'Medium / V60' }, { id: 'hand-grinder', qty: 1, grind: '' }];
        localStorage.setItem(CART_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw) || [];
    } catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
    document.dispatchEvent(new CustomEvent('cart:change'));
  }
  function keyOf(i) { return i.id + '|' + (i.grind || ''); }

  var cart = {
    items: readCart,
    count: function () { return readCart().reduce(function (s, i) { return s + i.qty; }, 0); },
    add: function (id, qty, grind) {
      var items = readCart(), g = grind || '';
      var found = items.filter(function (i) { return i.id === id && (i.grind || '') === g; })[0];
      if (found) found.qty += qty; else items.push({ id: id, qty: qty, grind: g });
      writeCart(items);
    },
    setQty: function (key, qty) {
      var items = readCart().map(function (i) { if (keyOf(i) === key) i.qty = qty; return i; }).filter(function (i) { return i.qty > 0; });
      writeCart(items);
    },
    remove: function (key) { writeCart(readCart().filter(function (i) { return keyOf(i) !== key; })); },
    clear: function () { writeCart([]); },
    /* Items grouped per vendor (one "package" each) with default shipping = first option. */
    grouped: function () {
      var order = [], map = {};
      readCart().forEach(function (i) {
        var p = productMap[i.id]; if (!p) return;
        if (!map[p.vendor]) { map[p.vendor] = { vendor: vendors[p.vendor], items: [], subtotal: 0 }; order.push(p.vendor); }
        var line = { product: p, qty: i.qty, grind: i.grind || '', key: keyOf(i), total: p.price * i.qty };
        map[p.vendor].items.push(line);
        map[p.vendor].subtotal += line.total;
      });
      return order.map(function (v) {
        var g = map[v]; g.shippingOption = g.vendor.shipping[0] || { id: 'regular', label: 'Regular', price: 15000 }; return g;
      });
    }
  };

  window.BM = {
    PLATFORM_FEE: PLATFORM_FEE, CART_KEY: CART_KEY, vendors: vendors, products: products, productMap: productMap,
    fmt: fmt, formatDate: formatDate, daysSince: daysSince, cart: cart, img: img, fallback: FALLBACK_IMG
  };
})();
