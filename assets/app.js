/* BrewMarket homepage logic */
(function () {
  'use strict';
  var BM = window.BM;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = BM.fmt;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'single', label: 'Single Origin Beans' },
    { id: 'blend', label: 'Espresso Blends' },
    { id: 'manual', label: 'Manual Brew Gear' },
    { id: 'grinder', label: 'Grinders' }
  ];
  var GRINDS = [
    { v: 'Whole Bean', sub: 'Grind it fresh yourself' },
    { v: 'Coarse / French Press', sub: 'Chunky, 4 min steep' },
    { v: 'Medium / V60', sub: 'Pour-over & drip' },
    { v: 'Fine / Espresso', sub: 'Machine-ready' }
  ];
  var ROAST_DOT = { Light: '#D9A441', Medium: '#A0643A', Dark: '#2C1E16' };

  var state = { cat: 'all', q: '', vendor: null, sort: 'featured' };

  /* ---------- Toasts ---------- */
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<svg class="h-4 w-4 text-[#9DB5A3]" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg><span>' + esc(msg) + '</span>';
    $('#toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, 2400);
  }

  /* ---------- Filters ---------- */
  function renderFilters() {
    $('#filters').innerHTML = CATEGORIES.map(function (c) {
      return '<button role="tab" class="pill" data-cat="' + c.id + '" aria-selected="' + (state.cat === c.id) + '">' + c.label + '</button>';
    }).join('');
  }
  function setCat(cat) {
    state.cat = cat; renderFilters(); renderGrid();
  }

  function visibleProducts() {
    var q = state.q.trim().toLowerCase();
    var list = BM.products.filter(function (p) {
      if (state.cat !== 'all' && p.cat !== state.cat) return false;
      if (state.vendor && p.vendor !== state.vendor) return false;
      if (!q) return true;
      var v = BM.vendors[p.vendor];
      var hay = [p.name, v.name, v.city, p.origin, p.roast, (p.notes || []).join(' '), p.material, p.brand, p.capacity].join(' ').toLowerCase();
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    });
    if (state.sort === 'low') list.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === 'high') list.sort(function (a, b) { return b.price - a.price; });
    return list;
  }

  /* ---------- Product cards ---------- */
  function addIcon() { return '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>'; }

  function cardImage(p, badge) {
    return '<div class="relative aspect-[4/3] cursor-pointer overflow-hidden bg-taupe" data-action="open" data-id="' + p.id + '">' +
      '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.onerror=null;this.src=BM.fallback" class="h-full w-full object-cover" style="object-position:' + (p.pos || 'center') + '" />' +
      badge +
      '<span class="qv-hint absolute inset-x-4 bottom-4 rounded-full bg-white/95 py-2 text-center text-xs font-semibold shadow">' + (p.type === 'bean' ? 'Quick view' : 'View details') + '</span></div>';
  }

  function beanCard(p) {
    var v = BM.vendors[p.vendor], days = BM.daysSince(p.roastDate);
    var badge = '<span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm"><span class="h-2 w-2 rounded-full" style="background:' + ROAST_DOT[p.roast] + '"></span>' + p.roast + ' roast</span>';
    return '<article class="product-card" data-id="' + p.id + '">' + cardImage(p, badge) +
      '<div class="flex flex-1 flex-col p-5">' +
        '<p class="text-xs font-semibold uppercase tracking-wider text-sage" style="color:#55695B">' + esc(v.name) + '</p>' +
        '<h3 class="mt-1 cursor-pointer font-serif text-xl font-semibold leading-snug hover:text-terracotta" data-action="open" data-id="' + p.id + '">' + esc(p.name) + '</h3>' +
        '<div class="mt-3 flex flex-wrap gap-1.5">' +
          '<span class="chip"><b>Origin</b>' + esc(p.origin) + '</span>' +
          '<span class="chip"><b>Roast</b>' + p.roast + '</span>' +
        '</div>' +
        '<div class="mt-2 flex flex-wrap gap-1.5">' + p.notes.map(function (n) { return '<span class="chip chip-note">' + esc(n) + '</span>'; }).join('') + '</div>' +
        '<div class="mt-4 flex items-center gap-2 rounded-xl bg-[#F2F5F2] px-3 py-2 text-xs text-[#3E5445]">' +
          '<span class="fresh-dot"></span><span><b>Roasted ' + BM.formatDate(p.roastDate).replace(/, \d{4}/, '') + '</b> · ' + (days === 0 ? 'today' : days + ' days ago') + '</span></div>' +
        '<div class="mt-auto flex items-end justify-between gap-3 pt-5">' +
          '<div><p class="whitespace-nowrap text-lg font-semibold">' + fmt(p.price) + '</p><p class="text-xs text-espresso/50">' + p.weight + '</p></div>' +
          '<button class="add-btn" data-action="add" data-id="' + p.id + '">' + addIcon() + 'Add to Cart</button>' +
        '</div></div></article>';
  }

  function gearCard(p) {
    var v = BM.vendors[p.vendor];
    var badge = '<span class="absolute left-4 top-4 rounded-full bg-espresso/90 px-3 py-1 text-xs font-semibold text-cream shadow-sm">' + esc(p.brand) + '</span>';
    return '<article class="product-card" data-id="' + p.id + '">' + cardImage(p, badge) +
      '<div class="flex flex-1 flex-col p-5">' +
        '<p class="text-xs font-semibold uppercase tracking-wider" style="color:#55695B">' + esc(v.name) + '</p>' +
        '<h3 class="mt-1 cursor-pointer font-serif text-xl font-semibold leading-snug hover:text-terracotta" data-action="open" data-id="' + p.id + '">' + esc(p.name) + '</h3>' +
        '<div class="mt-3 flex flex-wrap gap-1.5">' +
          '<span class="chip"><b>Material</b>' + esc(p.material) + '</span>' +
          '<span class="chip"><b>Capacity</b>' + esc(p.capacity) + '</span>' +
          '<span class="chip"><b>Brand</b>' + esc(p.brand) + '</span>' +
        '</div>' +
        '<p class="mt-4 line-clamp-2 text-sm leading-relaxed text-espresso/60">' + esc(p.desc) + '</p>' +
        '<div class="mt-auto flex items-end justify-between gap-3 pt-5">' +
          '<div><p class="whitespace-nowrap text-lg font-semibold">' + fmt(p.price) + '</p><p class="text-xs text-espresso/50">Ships from ' + esc(v.city) + '</p></div>' +
          '<button class="add-btn" data-action="add" data-id="' + p.id + '">' + addIcon() + 'Add to Cart</button>' +
        '</div></div></article>';
  }

  function renderGrid() {
    var list = visibleProducts();
    var grid = $('#grid');
    grid.innerHTML = list.map(function (p) { return p.type === 'bean' ? beanCard(p) : gearCard(p); }).join('');
    $$('.product-card', grid).forEach(function (c, i) { c.style.animationDelay = (i * 60) + 'ms'; });
    $('#empty').classList.toggle('hidden', list.length > 0);
    $('#result-count').textContent = 'Showing ' + list.length + (list.length === 1 ? ' product' : ' products');

    var av = $('#active-vendor');
    if (state.vendor) {
      av.classList.remove('hidden');
      av.innerHTML = '<span class="inline-flex items-center gap-2 rounded-full bg-sage/15 py-1.5 pl-4 pr-2 text-sm font-medium text-[#3E5445]">Store: ' + esc(BM.vendors[state.vendor].name) +
        '<button data-action="clear-vendor" class="grid h-6 w-6 place-items-center rounded-full bg-white/70 transition hover:bg-white" aria-label="Clear store filter">✕</button></span>';
    } else av.classList.add('hidden');
  }

  /* ---------- Product detail (quick view) ---------- */
  var uid = 0;
  function detailHTML(p, defaultGrind) {
    uid++;
    var v = BM.vendors[p.vendor];
    var left = '<div class="relative min-h-[18rem] bg-taupe lg:min-h-full">' +
      '<img src="' + p.image + '" alt="' + esc(p.name) + '" onerror="this.onerror=null;this.src=BM.fallback" class="absolute inset-0 h-full w-full object-cover" style="object-position:' + (p.pos || 'center') + '" />' +
      '<span class="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm">' + (p.type === 'bean' ? p.roast + ' roast · ' + p.weight : esc(p.brand)) + '</span></div>';

    var info = '<p class="text-xs font-semibold uppercase tracking-wider" style="color:#55695B">' + esc(v.name) + ' · ' + esc(v.region) + '</p>' +
      '<h3 class="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-4xl">' + esc(p.name) + '</h3>' +
      '<p class="mt-3 text-2xl font-semibold">' + fmt(p.price) + '</p>' +
      '<p class="mt-4 leading-relaxed text-espresso/70">' + esc(p.desc) + '</p>';

    var body = '';
    if (p.type === 'bean') {
      var days = BM.daysSince(p.roastDate);
      body += '<div class="mt-6 flex items-start gap-3 rounded-2xl border border-sage/40 bg-sage/10 p-4">' +
        '<span class="fresh-dot mt-1.5"></span><div><p class="text-sm font-semibold text-[#2F4A38]">Freshly roasted on: ' + BM.formatDate(p.roastDate) + ' — Ready to rest!</p>' +
        '<p class="mt-0.5 text-xs text-[#3E5445]/80">Roasted ' + days + ' days ago · packed on demand by ' + esc(v.name) + '</p></div></div>';

      body += '<fieldset class="mt-7"><legend class="text-sm font-semibold">Grind size</legend>' +
        '<div class="mt-3 grid grid-cols-2 gap-2.5">' + GRINDS.map(function (g) {
          return '<label class="grind-pill"><input type="radio" class="peer sr-only" name="grind-' + uid + '" value="' + g.v + '"' + (g.v === defaultGrind ? ' checked' : '') + ' /><span>' + g.v + '<small>' + g.sub + '</small></span></label>';
        }).join('') + '</div></fieldset>';

      var bars = [['Acidity', p.profile.acidity, 'Bright'], ['Body', p.profile.body, 'Full'], ['Sweetness', p.profile.sweetness, 'Sweet']];
      body += '<div class="mt-7"><p class="text-sm font-semibold">Flavor profile</p><div class="mt-3 space-y-3.5">' + bars.map(function (b) {
        return '<div><div class="mb-1.5 flex justify-between text-xs"><span class="font-medium">' + b[0] + '</span><span class="text-espresso/50">' + b[1] + '%</span></div>' +
          '<div class="h-2 overflow-hidden rounded-full bg-espresso/10"><div class="bar-fill h-full rounded-full bg-gradient-to-r from-sage to-terracotta" style="width:0" data-w="' + b[1] + '"></div></div></div>';
      }).join('') + '</div>' +
        '<div class="mt-4 flex flex-wrap gap-1.5"><span class="chip"><b>Origin</b>' + esc(p.origin) + '</span>' + p.notes.map(function (n) { return '<span class="chip chip-note">' + esc(n) + '</span>'; }).join('') + '</div></div>';
    } else {
      body += '<div class="mt-6 flex flex-wrap gap-2"><span class="chip"><b>Material</b>' + esc(p.material) + '</span><span class="chip"><b>Capacity</b>' + esc(p.capacity) + '</span><span class="chip"><b>Brand</b>' + esc(p.brand) + '</span></div>';
    }

    var buy = '<div class="mt-8 flex flex-col gap-4 border-t border-espresso/10 pt-6 sm:flex-row sm:items-center">' +
      '<div class="inline-flex items-center self-start overflow-hidden rounded-full border border-espresso/20" role="group" aria-label="Quantity">' +
        '<button class="qty-btn" data-d="dec" aria-label="Decrease quantity">−</button>' +
        '<output class="w-10 text-center text-sm font-semibold" data-qty>1</output>' +
        '<button class="qty-btn" data-d="inc" aria-label="Increase quantity">+</button></div>' +
      '<button class="add-btn flex-1 justify-center !py-3.5 !text-sm" data-action="add-detail" data-id="' + p.id + '">Add to Cart · <span data-total>' + fmt(p.price) + '</span></button></div>' +
      '<p class="mt-3 text-xs text-espresso/50">Ships directly from ' + esc(v.city) + ' · separate shipping per roastery · escrow protected</p>';

    return '<div class="pdp grid lg:grid-cols-2" data-id="' + p.id + '">' + left + '<div class="p-6 sm:p-9 lg:p-12">' + info + body + buy + '</div></div>';
  }

  function animateBars(root) {
    $$('[data-w]', root).forEach(function (b) { requestAnimationFrame(function () { setTimeout(function () { b.style.width = b.dataset.w + '%'; }, 80); }); });
  }

  /* Modal */
  var lastFocus = null;
  function openQuickView(id) {
    var p = BM.productMap[id]; if (!p) return;
    lastFocus = document.activeElement;
    $('#qv-content').innerHTML = detailHTML(p, 'Whole Bean');
    var m = $('#qv'); m.classList.remove('hidden'); m.classList.add('flex');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () {
      $('#qv-overlay').classList.remove('opacity-0');
      $('#qv-panel').classList.remove('opacity-0', 'translate-y-4', 'scale-95');
      animateBars($('#qv-content'));
    });
    $('#qv-close').focus();
  }
  function closeQuickView() {
    $('#qv-overlay').classList.add('opacity-0');
    $('#qv-panel').classList.add('opacity-0', 'translate-y-4', 'scale-95');
    setTimeout(function () { var m = $('#qv'); m.classList.add('hidden'); m.classList.remove('flex'); document.body.classList.remove('no-scroll'); }, 280);
    if (lastFocus) lastFocus.focus();
  }

  /* detail interactions (works for both modal & spotlight) */
  function detailQty(root) { return parseInt($('[data-qty]', root).textContent, 10) || 1; }
  function updateDetailTotal(root) {
    var p = BM.productMap[root.dataset.id];
    $('[data-total]', root).textContent = fmt(p.price * detailQty(root));
  }

  /* ---------- Add to cart ---------- */
  function flashAdded(btn) {
    if (!btn) return;
    var orig = btn.innerHTML;
    btn.classList.add('is-added'); btn.innerHTML = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>Added';
    setTimeout(function () { btn.classList.remove('is-added'); btn.innerHTML = orig; }, 1300);
  }
  function addToCart(id, qty, grind, btn) {
    BM.cart.add(id, qty, grind);
    flashAdded(btn);
    toast(qty + ' × ' + BM.productMap[id].name + ' added to cart');
    var b = $('#cart-badge'); b.classList.remove('cart-badge-bump'); void b.offsetWidth; b.classList.add('cart-badge-bump');
  }

  /* ---------- Cart drawer ---------- */
  function openCart() {
    $('#cart-drawer').classList.remove('translate-x-full'); $('#cart-drawer').setAttribute('aria-hidden', 'false');
    $('#cart-overlay').classList.remove('opacity-0', 'pointer-events-none'); document.body.classList.add('no-scroll');
  }
  function closeCart() {
    $('#cart-drawer').classList.add('translate-x-full'); $('#cart-drawer').setAttribute('aria-hidden', 'true');
    $('#cart-overlay').classList.add('opacity-0', 'pointer-events-none'); document.body.classList.remove('no-scroll');
  }

  function renderCart() {
    var groups = BM.cart.grouped();
    var count = BM.cart.count();
    var badge = $('#cart-badge');
    badge.textContent = count; badge.classList.toggle('scale-0', count === 0);
    $('#cart-sub').textContent = count ? count + (count === 1 ? ' item' : ' items') + ' · ' + groups.length + (groups.length === 1 ? ' package' : ' packages') + ' from separate vendors' : '';

    if (!groups.length) {
      $('#cart-body').innerHTML = '<div class="flex h-full flex-col items-center justify-center text-center">' +
        '<span class="grid h-20 w-20 place-items-center rounded-full bg-espresso/5 text-espresso/40"><svg class="h-9 w-9" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.200 11.200a2 2 0 0 0 2 1.600h7.600a2 2 0 0 0 2-1.500L20.500 8H6.200"/></svg></span>' +
        '<p class="mt-5 font-serif text-xl">Your cart is empty</p><p class="mt-1 text-sm text-espresso/55">Fresh beans are waiting for you.</p>' +
        '<button data-action="close-cart-shop" class="mt-6 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B34A00] active:scale-95">Browse catalog</button></div>';
      $('#cart-footer').innerHTML = ''; $('#cart-footer').classList.add('hidden'); return;
    }
    $('#cart-footer').classList.remove('hidden');

    var subtotal = 0, shipping = 0;
    $('#cart-body').innerHTML = groups.map(function (g, i) {
      subtotal += g.subtotal; shipping += g.shippingOption.price;
      return '<section class="overflow-hidden rounded-2xl border border-espresso/10 bg-white">' +
        '<header class="flex items-center gap-3 border-b border-espresso/10 bg-taupe/60 px-4 py-3">' +
          '<span class="grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold text-white" style="background:linear-gradient(135deg,' + g.vendor.color[0] + ',' + g.vendor.color[1] + ')">' + esc(g.vendor.initials) + '</span>' +
          '<div class="min-w-0"><p class="truncate text-sm font-semibold">Vendor: ' + esc(g.vendor.name) + '</p><p class="text-xs text-espresso/55">Package ' + (i + 1) + ' · ' + esc(g.vendor.city) + '</p></div></header>' +
        '<ul class="divide-y divide-espresso/5">' + g.items.map(function (l) {
          return '<li class="flex gap-3 p-4"><img src="' + l.product.image.replace('w=800', 'w=200') + '" alt="" onerror="this.onerror=null;this.src=BM.fallback" class="h-16 w-16 flex-shrink-0 rounded-xl object-cover" style="object-position:' + (l.product.pos || 'center') + '" />' +
            '<div class="min-w-0 flex-1"><div class="flex justify-between gap-2"><p class="text-sm font-semibold leading-snug">' + esc(l.product.name) + '</p>' +
            '<button data-action="remove" data-key="' + esc(l.key) + '" class="text-espresso/35 transition hover:text-terracotta" aria-label="Remove ' + esc(l.product.name) + '"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
            (l.grind ? '<p class="text-xs text-espresso/55">' + esc(l.grind) + ' · ' + l.product.weight + '</p>' : '<p class="text-xs text-espresso/55">' + esc(l.product.material || '') + '</p>') +
            '<div class="mt-2 flex items-center justify-between"><div class="inline-flex items-center rounded-full border border-espresso/15 text-sm">' +
              '<button class="grid h-7 w-7 place-items-center rounded-full transition hover:bg-espresso/5" data-action="qty" data-key="' + esc(l.key) + '" data-q="' + (l.qty - 1) + '" aria-label="Decrease">−</button>' +
              '<span class="w-6 text-center text-xs font-semibold">' + l.qty + '</span>' +
              '<button class="grid h-7 w-7 place-items-center rounded-full transition hover:bg-espresso/5" data-action="qty" data-key="' + esc(l.key) + '" data-q="' + (l.qty + 1) + '" aria-label="Increase">+</button></div>' +
              '<p class="text-sm font-semibold">' + fmt(l.total) + '</p></div></div></li>';
        }).join('') + '</ul>' +
        '<footer class="flex items-center justify-between gap-3 border-t border-dashed border-espresso/15 bg-[#F4F7F4] px-4 py-3 text-xs">' +
          '<span class="flex items-center gap-2 text-[#3E5445]"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3Zm10 0a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3Z"/></svg>Shipping · ' + esc(g.shippingOption.label) + '</span>' +
          '<span class="font-semibold text-[#2F4A38]">' + fmt(g.shippingOption.price) + '</span></footer></section>';
    }).join('') +
      '<p class="px-1 text-xs leading-relaxed text-espresso/50">Each vendor ships separately, so every package has its own shipping fee. You can change delivery speed at checkout.</p>';

    var total = subtotal + shipping + BM.PLATFORM_FEE;
    $('#cart-footer').innerHTML =
      '<dl class="space-y-2 text-sm"><div class="flex justify-between"><dt class="text-espresso/65">Subtotal</dt><dd>' + fmt(subtotal) + '</dd></div>' +
      '<div class="flex justify-between"><dt class="text-espresso/65">Shipping (' + groups.length + (groups.length > 1 ? ' packages' : ' package') + ')</dt><dd>' + fmt(shipping) + '</dd></div>' +
      '<div class="flex justify-between"><dt class="text-espresso/65">Platform fee</dt><dd>' + fmt(BM.PLATFORM_FEE) + '</dd></div>' +
      '<div class="flex items-baseline justify-between border-t border-espresso/10 pt-3"><dt class="font-semibold">Estimated total</dt><dd class="font-serif text-2xl font-semibold">' + fmt(total) + '</dd></div></dl>' +
      '<a href="checkout.html" class="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-4 text-sm font-semibold text-white shadow-lg shadow-terracotta/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#B34A00] active:scale-[.98]">' +
      '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Proceed to Checkout</a>';
  }

  /* ---------- Roasteries ---------- */
  function renderRoasteries() {
    var list = Object.keys(BM.vendors).map(function (k) { return BM.vendors[k]; }).filter(function (v) { return v.roastery; });
    $('#roastery-row').innerHTML = list.map(function (v) {
      var n = BM.products.filter(function (p) { return p.vendor === v.id; }).length;
      return '<article class="roastery-card">' +
        '<div class="roastery-logo" style="background:linear-gradient(135deg,' + v.color[0] + ',' + v.color[1] + ')" aria-hidden="true">' + esc(v.initials) + '</div>' +
        '<h3 class="mt-5 font-serif text-xl font-semibold">' + esc(v.name) + '</h3>' +
        '<p class="mt-1 flex items-center justify-center gap-1.5 text-sm text-espresso/60"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-6.100 7-11a7 7 0 1 0-14 0c0 4.900 7 11 7 11Z"/><circle cx="12" cy="10" r="2.500"/></svg>' + esc(v.region) + '</p>' +
        '<p class="mb-6 mt-3 text-xs text-espresso/45">' + (n ? n + (n === 1 ? ' product' : ' products') + ' listed' : 'Opening soon') + '</p>' +
        '<button class="btn-secondary" data-action="visit" data-vendor="' + v.id + '">Visit Store</button></article>';
    }).join('');
  }

  /* ---------- Brew matchmaker ---------- */
  var MATCHES = {
    espresso: { title: 'Espresso Machine', ids: ['midnight', 'sunrise', 'electric-grinder'], cat: 'blend' },
    manual: { title: 'Manual Brew', ids: ['kamojang', 'toraja', 'v60'], cat: 'single' },
    cold: { title: 'Cold Brew', ids: ['coldbrew', 'flores', 'server'], cat: 'all' }
  };
  function showMatches() {
    var sel = $('input[name="brew"]:checked');
    var hint = $('#match-hint');
    if (!sel) {
      hint.textContent = 'Pick how you brew first ☝';
      var o = $('#brew-options'); o.classList.remove('shake'); void o.offsetWidth; o.classList.add('shake'); return;
    }
    hint.textContent = '';
    var m = MATCHES[sel.value];
    var box = $('#match-results');
    box.classList.remove('hidden');
    box.innerHTML = '<p class="mb-5 text-center text-sm text-cream/70">Your top matches for <strong class="text-cream">' + m.title + '</strong></p>' +
      '<div class="grid gap-4 md:grid-cols-3">' + m.ids.map(function (id) {
        var p = BM.productMap[id], v = BM.vendors[p.vendor];
        return '<div class="flex flex-col rounded-2xl bg-cream p-4 text-espresso" style="animation:fadeUp .6s both">' +
          '<div class="flex gap-3"><img src="' + p.image.replace('w=800', 'w=200') + '" alt="" onerror="this.onerror=null;this.src=BM.fallback" class="h-20 w-20 rounded-xl object-cover" style="object-position:' + (p.pos || 'center') + '" />' +
          '<div class="min-w-0 text-left"><p class="text-[11px] font-semibold uppercase tracking-wider" style="color:#55695B">' + esc(v.name) + '</p><p class="font-serif text-lg font-semibold leading-tight">' + esc(p.name) + '</p>' +
          '<p class="mt-1 text-sm font-semibold">' + fmt(p.price) + '</p></div></div>' +
          '<div class="mt-4 flex gap-2"><button class="add-btn flex-1 justify-center" data-action="add" data-id="' + p.id + '">' + addIcon() + 'Add</button>' +
          '<button class="rounded-full border border-espresso/20 px-4 text-xs font-semibold transition hover:bg-espresso hover:text-cream" data-action="open" data-id="' + p.id + '">Details</button></div></div>';
      }).join('') + '</div>' +
      '<div class="mt-6 text-center"><button class="text-sm font-semibold text-[#E8A27A] underline-offset-4 hover:underline" data-action="browse" data-cat="' + m.cat + '">Browse more in the catalog →</button></div>';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- Scroll reveal ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); animateBars(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function initReveal() {
    $$('.reveal').forEach(function (el, i) {
      if (io) io.observe(el); else el.classList.add('is-visible');
    });
  }

  /* ---------- Navigation helpers ---------- */
  function goCatalog(cat) {
    state.vendor = null; state.q = ''; $('#search').value = ''; $('#search-m').value = '';
    setCat(cat);
  }
  function scrollToEl(sel) { var el = $(sel); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  /* ---------- Events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action],[data-cat],[data-nav],[data-d]');
    if (!t) return;

    if (t.dataset.d) { /* qty stepper inside detail */
      var root = t.closest('.pdp'); var out = $('[data-qty]', root);
      var q = detailQty(root) + (t.dataset.d === 'inc' ? 1 : -1);
      out.textContent = Math.min(20, Math.max(1, q)); updateDetailTotal(root); return;
    }
    if (t.dataset.cat && !t.dataset.action) { setCat(t.dataset.cat); return; }
    if (t.dataset.nav) {
      if (t.dataset.nav === 'subscription') { e.preventDefault(); toast('Subscription boxes are coming soon — join the newsletter!'); scrollToEl('#nl-email'); $('#nl-email').focus({ preventScroll: true }); return; }
      goCatalog(t.dataset.nav); $('#mobile-menu').classList.add('hidden'); return;
    }

    var a = t.dataset.action, id = t.dataset.id;
    switch (a) {
      case 'open': openQuickView(id); break;
      case 'add': addToCart(id, 1, BM.productMap[id].type === 'bean' ? 'Whole Bean' : '', t); break;
      case 'add-detail': {
        var r = t.closest('.pdp'); var g = $('input[type=radio]:checked', r);
        addToCart(id, detailQty(r), g ? g.value : '', t); break;
      }
      case 'remove': BM.cart.remove(t.dataset.key); break;
      case 'qty': BM.cart.setQty(t.dataset.key, parseInt(t.dataset.q, 10)); break;
      case 'close-cart-shop': closeCart(); scrollToEl('#catalog'); break;
      case 'clear-vendor': state.vendor = null; renderGrid(); break;
      case 'visit': {
        var v = t.dataset.vendor;
        if (BM.products.some(function (p) { return p.vendor === v; })) {
          state.vendor = v; state.cat = 'all'; state.q = ''; renderFilters(); renderGrid(); scrollToEl('#catalog');
        } else toast(BM.vendors[v].name + ' opens its storefront soon');
        break;
      }
      case 'browse': state.vendor = null; setCat(t.dataset.cat); scrollToEl('#catalog'); break;
    }
  });

  /* Detail: update total when grind changes (no price impact) & modal close */
  $('#qv-overlay').addEventListener('click', closeQuickView);
  $('#qv-close').addEventListener('click', closeQuickView);
  $('#qv').addEventListener('click', function (e) { if (e.target === $('#qv')) closeQuickView(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('#qv').classList.contains('hidden')) closeQuickView(); else closeCart();
  });

  $('#cart-btn').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#cart-overlay').addEventListener('click', closeCart);
  document.addEventListener('cart:change', renderCart);

  $('#menu-btn').addEventListener('click', function () {
    var m = $('#mobile-menu'); var hidden = m.classList.toggle('hidden'); this.setAttribute('aria-expanded', String(!hidden));
  });
  $$('#mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { $('#mobile-menu').classList.add('hidden'); }); });

  function onSearch(val) {
    state.q = val; state.vendor = null; $('#search').value = val; $('#search-m').value = val;
    if (state.cat !== 'all' && val) { state.cat = 'all'; renderFilters(); }
    renderGrid();
  }
  ['search', 'search-m'].forEach(function (id) { $('#' + id).addEventListener('input', function (e) { onSearch(e.target.value); }); });
  ['search-form', 'search-form-m'].forEach(function (id) {
    $('#' + id).addEventListener('submit', function (e) { e.preventDefault(); scrollToEl('#catalog'); $('#mobile-menu').classList.add('hidden'); });
  });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(); });
  $('#reset-filters').addEventListener('click', function () { state = { cat: 'all', q: '', vendor: null, sort: state.sort }; $('#search').value = ''; $('#search-m').value = ''; renderFilters(); renderGrid(); });

  $('#rs-prev').addEventListener('click', function () { $('#roastery-row').scrollBy({ left: -300, behavior: 'smooth' }); });
  $('#rs-next').addEventListener('click', function () { $('#roastery-row').scrollBy({ left: 300, behavior: 'smooth' }); });

  $('#get-matches').addEventListener('click', showMatches);
  $$('input[name="brew"]').forEach(function (r) { r.addEventListener('change', function () { $('#match-hint').textContent = ''; }); });

  $('#newsletter').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#nl-email').value.trim(), msg = $('#nl-msg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.style.color = '#F4B08A'; msg.textContent = 'Please enter a valid email address.'; return; }
    msg.style.color = '#B7CDBD'; msg.textContent = 'You’re in! Look out for our next roast drop.'; $('#nl-email').value = ''; toast('Subscribed to weekly roast drops');
  });

  /* ---------- Init ---------- */
  renderFilters();
  renderGrid();
  renderRoasteries();
  renderCart();
  $('#spotlight-mount').innerHTML = detailHTML(BM.productMap['kamojang'], 'Medium / V60');
  initReveal();
})();
