/* =========================================================
   RAVIKUMAR HOUSE MATERIALS — Complete Application Logic
   app.js | Single-Page Application
   ========================================================= */

'use strict';

// ===== CONFIG =====
const CONFIG = {
  PHONE: '9121861110',
  WHATSAPP: '919121861110',
  MAPS_LINK: 'https://maps.app.goo.gl/tsiRvrTot2k88WBp7',
  ADDRESS: 'Sagar Road, FCI, opposite Sonalika Showroom, Miryalaguda',
  ADMIN_EMAIL: 'admin@ravikumar.com',
  ADMIN_PASS: 'admin123',
  DELIVERY_CHARGE: 200,
  // Supabase Cloud Backend Configuration
  SUPABASE_URL: 'https://gngzblgyiifyhrcplsdt.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ3pibGd5aWlmeWhyY3Bsc2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODUwNDYsImV4cCI6MjEwMjM2MTA0Nn0.YpVK4uIslEBn-pleXdCvtLnhqYoe8xSinys4Th3eGAM',
};

// Initialize Supabase Client (falls back gracefully to localStorage)
let supabaseClient = null;
if (typeof window.supabase !== 'undefined' && CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
  try {
    supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected successfully');
  } catch (e) {
    console.warn('Supabase init fallback to localStorage:', e);
  }
}

// ===== PRODUCTS DATA =====
const PRODUCTS = [
  {
    id: 'sand',
    name: 'Sand (ఇసుక)',
    nameEn: 'Sand',
    emoji: '🏔️',
    image: 'sand.jpg',
    category: 'sand',
    desc: 'Premium construction sand / river sand for plastering, concrete, and building foundation work.',
    price: 2500,
    unit: 'Load',
    stock: 50,
    available: true,
    popular: true,
    delivery: '🚛 Same-day / Next-day delivery',
    minQty: 1,
  },
  {
    id: 'dust',
    name: 'Dust',
    nameEn: 'Dust',
    emoji: '💨',
    image: 'dust.jpg',
    category: 'sand',
    desc: 'Fine construction dust material used for brick laying, leveling, and finishing work.',
    price: 1800,
    unit: 'Load',
    stock: 30,
    available: true,
    popular: false,
    delivery: '🚛 Same-day delivery available',
    minQty: 1,
  },
  {
    id: '20mm-kankara',
    name: '20 MM Kankara',
    nameEn: '20MM Kankara',
    emoji: '🔩',
    image: '20mm-kankara.jpg',
    category: 'aggregate',
    desc: 'Medium aggregate stone — 20mm gravel/kankara for RCC concrete columns, beams and slabs.',
    price: 3000,
    unit: 'Load',
    stock: 35,
    available: true,
    popular: true,
    delivery: '🚛 Next-day delivery',
    minQty: 1,
  },
  {
    id: '40mm-kankara',
    name: '40 MM Kankara',
    nameEn: '40MM Kankara',
    emoji: '🪨',
    image: '40mm-kankara.jpg',
    category: 'aggregate',
    desc: 'Large aggregate stone — 40mm gravel/kankara ideal for concrete foundation and road base.',
    price: 3200,
    unit: 'Load',
    stock: 40,
    available: true,
    popular: true,
    delivery: '🚛 Delivered to your site',
    minQty: 1,
  },
  {
    id: 'water-tanker',
    name: 'Water Tanker Service',
    nameEn: 'Water Tanker',
    emoji: '🚰',
    image: 'water-tanker.jpg',
    category: 'service',
    desc: 'Prompt water tanker delivery for construction work, dust suppression, and site preparation.',
    price: 1200,
    unit: 'Trip',
    stock: 20,
    available: true,
    popular: true,
    delivery: '🚰 Delivered directly to site',
    minQty: 1,
  },
  {
    id: 'red-bricks',
    name: 'Red Bricks',
    nameEn: 'Red Bricks',
    emoji: '🧱',
    image: 'red-bricks.jpg',
    category: 'brick',
    desc: 'High-quality red clay bricks for wall construction, durable and perfectly sized for building.',
    price: 8,
    unit: 'Piece',
    stock: 5000,
    available: true,
    popular: true,
    delivery: '🚛 Bulk delivery available',
    minQty: 100,
  },
  {
    id: 'cement-bricks',
    name: 'Cement Bricks',
    nameEn: 'Cement Bricks',
    emoji: '🔲',
    image: 'cement-bricks.jpg',
    category: 'brick',
    desc: 'Strong cement concrete blocks for load-bearing walls and boundary construction.',
    price: 35,
    unit: 'Piece',
    stock: 2000,
    available: true,
    popular: false,
    delivery: '🚛 Bulk orders delivered',
    minQty: 50,
  },
];

// ===== APP STATE =====
let state = {
  currentPage: 'home',
  cart: [],
  orders: [],
  serviceBookings: [],
  user: null,
  adminLoggedIn: false,
  lastOrderId: null,
  selectedPayment: 'upi',
  sliderIndex: 0,
  taglineIndex: 0,
};

// Load from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem('rhm_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.cart = parsed.cart || [];
      state.orders = parsed.orders || [];
      state.serviceBookings = parsed.serviceBookings || [];
      state.user = parsed.user || null;
      state.adminLoggedIn = parsed.adminLoggedIn || false;
    }
  } catch (e) {}
}

function saveState() {
  try {
    localStorage.setItem('rhm_state', JSON.stringify({
      cart: state.cart,
      orders: state.orders,
      serviceBookings: state.serviceBookings,
      user: state.user,
      adminLoggedIn: state.adminLoggedIn,
    }));
  } catch (e) {}
}

// ===== SPLASH SCREEN =====
function initSplash() {
  const canvas = document.getElementById('splashCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      alpha: Math.random(),
      color: Math.random() > 0.5 ? '#d4a017' : '#e8650a',
    });
  }

  let frame = 0;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d0e12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      p.alpha = Math.sin(frame * 0.02 + p.r) * 0.4 + 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
    frame++;
  }

  const prog = document.querySelector('.splash-progress');
  let progress = 0;
  const interval = setInterval(animateParticles, 16);

  const progInterval = setInterval(() => {
    progress += 2;
    if (prog) prog.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(progInterval);
      clearInterval(interval);
      setTimeout(hideSplash, 300);
    }
  }, 30);
}

function hideSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  splash.style.opacity = '0';
  splash.style.transform = 'scale(1.05)';
  setTimeout(() => {
    splash.remove();
    initHeroCanvas();
  }, 700);
}

// ===== HERO CANVAS =====
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.8 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      color: ['#d4a017', '#e8650a', '#c9a96e', '#ffffff'][Math.floor(Math.random() * 4)],
    });
  }

  // Grid lines
  function drawGrid() {
    ctx.strokeStyle = 'rgba(212,160,23,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  // Construction elements
  const constructionEmojis = [
    { emoji: '🏗️', x: null, y: null, size: 60 },
    { emoji: '🧱', x: null, y: null, size: 40 },
    { emoji: '🚛', x: null, y: null, size: 50 },
    { emoji: '🚜', x: null, y: null, size: 45 },
    { emoji: '🪨', x: null, y: null, size: 35 },
  ];

  function positionEmojis() {
    const positions = [
      [0.1, 0.7], [0.85, 0.6], [0.75, 0.15], [0.05, 0.2], [0.9, 0.85]
    ];
    constructionEmojis.forEach((e, i) => {
      e.x = positions[i][0] * canvas.width;
      e.y = positions[i][1] * canvas.height;
    });
  }
  positionEmojis();
  window.addEventListener('resize', positionEmojis);

  let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  let frame = 0;
  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    grad.addColorStop(0, '#1a1d27');
    grad.addColorStop(1, '#0d0e12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      if (p.x < -5) p.x = canvas.width + 5;
      if (p.x > canvas.width + 5) p.x = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    // Parallax emojis
    const pX = (mouseX - canvas.width / 2) * 0.02;
    const pY = (mouseY - canvas.height / 2) * 0.02;
    constructionEmojis.forEach((e, i) => {
      const ox = pX * (i * 0.5 + 1);
      const oy = pY * (i * 0.3 + 1);
      const bounce = Math.sin(frame * 0.03 + i) * 10;
      ctx.font = `${e.size}px serif`;
      ctx.globalAlpha = 0.15;
      ctx.fillText(e.emoji, e.x + ox, e.y + oy + bounce);
      ctx.globalAlpha = 1;
    });

    frame++;
  }
  draw();
}

// ===== ROUTER =====
function navigate(page, extra) {
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    state.currentPage = page;
  } else {
    document.getElementById('page-404').classList.add('active');
    state.currentPage = '404';
  }

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.getElementById('nl-' + page);
  if (activeLink) activeLink.classList.add('active');

  // Update bottom nav
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bnavMap = { home: 'bn-home', shop: 'bn-shop', cart: 'bn-cart', orders: 'bn-orders', account: 'bn-account' };
  const bn = document.getElementById(bnavMap[page]);
  if (bn) bn.classList.add('active');

  // Page-specific init
  if (page === 'home') {
    renderProductSlider();
    if (window.scrollY === 0) initRevealObserver();
  } else if (page === 'shop') {
    renderShopGrid();
  } else if (page === 'cart') {
    renderCart();
  } else if (page === 'checkout') {
    renderCheckoutSummary();
    // Set today as min date
    const dateInput = document.getElementById('co-date');
    if (dateInput) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      dateInput.min = today.toISOString().split('T')[0];
      dateInput.value = today.toISOString().split('T')[0];
    }
  } else if (page === 'orders') {
    renderOrders();
  } else if (page === 'track') {
    renderMyOrders();
  } else if (page === 'account') {
    renderAccount();
    if (!state.user) {
      const wModal = document.getElementById('welcomeAuthModal');
      if (wModal) wModal.classList.add('active');
    }
  } else if (page === 'admin') {
    renderAdmin();
  } else if (page === 'success') {
    renderSuccess(extra);
    launchConfetti();
  }

  updateCartBadge();
}

// ===== HASH ROUTING =====
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash.split('/')[0]);
});

// ===== CART =====
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (!product.available) { showToast('Product is out of stock', 'error'); return; }

  const existing = state.cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ id: productId, qty });
  }
  saveState();
  updateCartBadge();
  showToast(`${product.nameEn} added to cart ✓`, 'success');

  // Close modal if open
  const modal = document.getElementById('productModal');
  if (modal && modal.classList.contains('active')) {
    setTimeout(() => closeProductModal(null, true), 800);
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveState();
  updateCartBadge();
  renderCart();
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveState();
  renderCart();
  updateCartBadge();
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function updateCartBadge() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  const bnBadge = document.getElementById('bnCartBadge');
  if (badge) { badge.textContent = count; badge.style.transform = count > 0 ? 'scale(1)' : 'scale(0)'; }
  if (bnBadge) { bnBadge.textContent = count; bnBadge.style.display = count > 0 ? 'flex' : 'none'; }
}

function renderCart() {
  const el = document.getElementById('cartContent');
  if (!el) return;

  if (state.cart.length === 0) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h2>Your Material Cart Is Empty</h2>
        <p>Add construction materials to get started</p>
        <button class="btn btn-primary" onclick="navigate('shop')">🏗️ SHOP MATERIALS</button>
      </div>`;
    return;
  }

  const subtotal = getCartTotal();
  const delivery = CONFIG.DELIVERY_CHARGE;
  const total = subtotal + delivery;

  const itemsHtml = state.cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
    <div class="cart-item">
      <div class="ci-icon">${p.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${p.name}</div>
        <div class="ci-unit">per ${p.unit}</div>
        <div class="ci-qty-row">
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="updateCartQty('${p.id}',-1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty('${p.id}',1)">+</button>
          </div>
          <span class="ci-price">₹${(p.price * item.qty).toLocaleString('en-IN')}</span>
        </div>
      </div>
      <span class="ci-remove" onclick="removeFromCart('${p.id}')" title="Remove">✕</span>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="cart-grid">
      <div class="cart-items">${itemsHtml}</div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-val">₹${subtotal.toLocaleString('en-IN')}</span></div>
        <div class="summary-row"><span class="summary-label">Delivery Charge</span><span class="summary-val">₹${delivery}</span></div>
        <div class="summary-row summary-total"><span class="summary-label">Total</span><span class="summary-val">₹${total.toLocaleString('en-IN')}</span></div>
        <button class="btn btn-primary btn-full" style="margin-top:1.5rem" onclick="navigate('checkout')">Proceed to Checkout →</button>
        <button class="btn btn-outline btn-full" style="margin-top:0.75rem" onclick="navigate('shop')">← Continue Shopping</button>
      </div>
    </div>`;
}

// ===== CHECKOUT =====
function renderCheckoutSummary() {
  const el = document.getElementById('checkoutSummary');
  if (!el) return;

  if (state.cart.length === 0) { navigate('cart'); return; }

  const subtotal = getCartTotal();
  const total = subtotal + CONFIG.DELIVERY_CHARGE;

  const itemRows = state.cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `<div class="summary-row"><span class="summary-label">${p.nameEn} × ${item.qty} ${p.unit}</span><span class="summary-val">₹${(p.price * item.qty).toLocaleString('en-IN')}</span></div>`;
  }).join('');

  el.innerHTML = `
    <h3>Order Summary</h3>
    ${itemRows}
    <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-val">₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div class="summary-row"><span class="summary-label">Delivery</span><span class="summary-val">₹${CONFIG.DELIVERY_CHARGE}</span></div>
    <div class="summary-row summary-total"><span class="summary-label">Total</span><span class="summary-val">₹${total.toLocaleString('en-IN')}</span></div>`;
}

function selectPayment(type) {
  state.selectedPayment = type;
  document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('active'));
  const el = document.getElementById('pay-' + type);
  if (el) el.classList.add('active');
}

function placeOrder(e) {
  e.preventDefault();

  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const city = document.getElementById('co-city').value.trim();
  const pin = document.getElementById('co-pin').value.trim();
  const date = document.getElementById('co-date').value;
  const time = document.getElementById('co-time').value;
  const landmark = document.getElementById('co-landmark').value.trim();
  const notes = document.getElementById('co-notes').value.trim();

  if (!name || !phone || !address || !city || !pin || !date) {
    showToast('Please fill all required fields', 'error'); return;
  }
  if (phone.length < 10) { showToast('Enter a valid mobile number', 'error'); return; }

  const subtotal = getCartTotal();
  const total = subtotal + CONFIG.DELIVERY_CHARGE;
  const orderId = 'RHM-' + new Date().getFullYear() + '-' + String(state.orders.length + 1).padStart(3, '0');
  const products = state.cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return { id: item.id, name: p.name, qty: item.qty, unit: p.unit, price: p.price };
  });

  const order = {
    id: orderId,
    customer: { name, phone, address: `${address}${landmark ? ', ' + landmark : ''}, ${city} - ${pin}`, notes },
    products,
    subtotal,
    deliveryCharge: CONFIG.DELIVERY_CHARGE,
    total,
    payment: state.selectedPayment,
    paymentStatus: state.selectedPayment === 'cod' ? 'Pending' : 'Paid',
    status: 'Order Placed',
    deliveryDate: date,
    deliveryTime: time,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [{ status: 'Order Placed', time: new Date().toISOString() }],
  };

  state.orders.unshift(order);
  state.lastOrderId = orderId;
  state.cart = [];
  saveState();
  updateCartBadge();

  // Async insert to Supabase if connected
  if (supabaseClient) {
    supabaseClient.from('orders').insert([{
      id: orderId,
      customer_name: name,
      customer_phone: phone,
      customer_address: `${address}${landmark ? ', ' + landmark : ''}, ${city} - ${pin}`,
      landmark, city, pincode: pin,
      delivery_date: date,
      delivery_time: time,
      notes,
      products,
      subtotal,
      delivery_charge: CONFIG.DELIVERY_CHARGE,
      total,
      payment_method: state.selectedPayment,
      payment_status: state.selectedPayment === 'cod' ? 'Pending' : 'Paid',
      order_status: 'Order Placed',
      status_history: [{ status: 'Order Placed', time: new Date().toISOString() }],
    }]).then(({ error }) => {
      if (error) console.error('Supabase order insert error:', error);
      else console.log('✅ Order saved to Supabase cloud!');
    });
  }

  navigate('success', order);
}

// ===== SUCCESS =====
function renderSuccess(order) {
  if (!order) {
    if (state.lastOrderId) {
      order = state.orders.find(o => o.id === state.lastOrderId);
    }
    if (!order) { navigate('home'); return; }
  }

  const el = document.getElementById('successDetails');
  if (!el) return;

  const productList = order.products.map(p => `${p.qty} ${p.unit} × ${p.name}`).join(', ');
  el.innerHTML = `
    <div class="sd-row"><span class="sd-label">Order ID</span><span class="sd-val">${order.id}</span></div>
    <div class="sd-row"><span class="sd-label">Amount Paid</span><span class="sd-val" style="color:var(--gold)">₹${order.total.toLocaleString('en-IN')}</span></div>
    <div class="sd-row"><span class="sd-label">Materials</span><span class="sd-val">${productList}</span></div>
    <div class="sd-row"><span class="sd-label">Delivery To</span><span class="sd-val">${order.customer.address}</span></div>
    <div class="sd-row"><span class="sd-label">Expected Delivery</span><span class="sd-val">${order.deliveryDate}</span></div>
    <div class="sd-row"><span class="sd-label">Payment</span><span class="sd-val">${order.paymentStatus}</span></div>`;
}

function launchConfetti() {
  const wrap = document.getElementById('confettiWrap');
  if (!wrap) return;
  const colors = ['#d4a017', '#e8650a', '#22c55e', '#3b82f6', '#ef4444', '#f0c040'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '0';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = Math.random() * 10 + 5 + 'px';
    piece.style.height = piece.style.width;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = Math.random() * 2 + 1.5 + 's';
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    wrap.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

// ===== ORDERS =====
function renderOrders() {
  const el = document.getElementById('ordersContent');
  if (!el) return;

  const myOrders = state.user
    ? state.orders.filter(o => o.customer.phone === state.user.phone)
    : state.orders;

  if (myOrders.length === 0) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">📦</div>
        <h2>No Orders Yet</h2>
        <p>Your orders will appear here after you place them</p>
        <button class="btn btn-primary" onclick="navigate('shop')">🏗️ Shop Materials</button>
      </div>`;
    return;
  }

  el.innerHTML = myOrders.map(o => `
    <div class="order-card" onclick="trackOrderById('${o.id}')">
      <div class="oc-header">
        <span class="oc-id">📦 ${o.id}</span>
        <span class="oc-status ${getStatusClass(o.status)}">${o.status}</span>
      </div>
      <div class="oc-products">${o.products.map(p => `${p.qty} ${p.unit} × ${p.name}`).join(' | ')}</div>
      <div class="oc-footer">
        <span class="oc-total">₹${o.total.toLocaleString('en-IN')}</span>
        <span class="oc-date">${formatDate(o.createdAt)}</span>
      </div>
    </div>`).join('');
}

function renderMyOrders() {
  const el = document.getElementById('myOrders');
  if (!el) return;

  const myOrders = state.orders.slice(0, 5);
  if (myOrders.length === 0) {
    el.innerHTML = '<p style="color:var(--white-60);text-align:center;padding:2rem">No orders yet. <a href="#shop" onclick="navigate(\'shop\')" style="color:var(--gold)">Shop now →</a></p>';
    return;
  }

  el.innerHTML = `<h2 style="margin-bottom:1rem;font-family:var(--font-head);font-size:1.3rem;font-weight:700">Recent Orders</h2>` +
    myOrders.map(o => `
    <div class="order-card" onclick="trackOrderById('${o.id}')">
      <div class="oc-header">
        <span class="oc-id">📦 ${o.id}</span>
        <span class="oc-status ${getStatusClass(o.status)}">${o.status}</span>
      </div>
      <div class="oc-products">${o.products.map(p => `${p.qty} ${p.unit} × ${p.name}`).join(' | ')}</div>
      <div class="oc-footer">
        <span class="oc-total">₹${o.total.toLocaleString('en-IN')}</span>
        <span class="oc-date">${formatDate(o.createdAt)}</span>
      </div>
    </div>`).join('');
}

function getStatusClass(status) {
  const map = {
    'Order Placed': 'status-pending',
    'Order Confirmed': 'status-confirmed',
    'Material Preparing': 'status-preparing',
    'Loading': 'status-loading',
    'Out for Delivery': 'status-out',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled',
  };
  return map[status] || 'status-pending';
}

// ===== TRACK ORDER =====
const ORDER_STATUSES = ['Order Placed', 'Order Confirmed', 'Material Preparing', 'Loading', 'Out for Delivery', 'Delivered'];
const STATUS_ICONS = ['📱', '✅', '⚙️', '📦', '🚛', '🏠'];

function trackOrder() {
  const input = document.getElementById('trackInput');
  if (!input) return;
  trackOrderById(input.value.trim());
}

function trackOrderById(orderId) {
  if (!orderId) { showToast('Enter an order ID', 'error'); return; }

  navigate('track');

  const order = state.orders.find(o => o.id === orderId);
  const el = document.getElementById('trackResult');
  if (!el) return;

  if (!order) {
    el.innerHTML = `
      <div class="track-result">
        <div style="text-align:center;padding:2rem">
          <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
          <h3>Order Not Found</h3>
          <p style="color:var(--white-60)">Order ID "${orderId}" not found. Please check the ID.</p>
        </div>
      </div>`;
    return;
  }

  const currentIdx = order.status === 'Cancelled' ? -1 : ORDER_STATUSES.indexOf(order.status);

  const stepsHtml = ORDER_STATUSES.map((s, i) => {
    const isDone = order.status !== 'Cancelled' && i < currentIdx;
    const isCurrent = i === currentIdx;
    const hist = order.statusHistory && order.statusHistory.find(h => h.status === s);
    return `
    ${i > 0 ? `<div class="ts-line ${isDone ? 'done' : ''}"></div>` : ''}
    <div class="track-step">
      <div class="ts-dot ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}">${isDone ? '✓' : STATUS_ICONS[i]}</div>
      <div class="ts-info">
        <div class="ts-name" style="${isCurrent ? 'color:var(--gold);font-weight:700' : isDone ? 'color:var(--green)' : 'color:var(--white-60)'}">${s}</div>
        ${hist ? `<div class="ts-time">${formatDate(hist.time)}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  const productList = order.products.map(p => `${p.qty} ${p.unit} × ${p.name}`).join(', ');

  el.innerHTML = `
    <div class="track-result">
      <div class="track-order-id">
        <span class="tr-id">📦 ${order.id}</span>
        <span class="oc-status ${getStatusClass(order.status)}">${order.status}</span>
      </div>
      ${order.status === 'Cancelled' ? '<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:1rem;margin-bottom:1rem;color:#ef4444;font-weight:600;text-align:center">❌ This order has been cancelled</div>' : ''}
      <div class="track-steps">${stepsHtml}</div>
      <hr style="border:1px solid var(--glass-border);margin:1.5rem 0">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:0.9rem">
        <div><span style="color:var(--white-60)">Materials:</span><br><strong>${productList}</strong></div>
        <div><span style="color:var(--white-60)">Total Amount:</span><br><strong style="color:var(--gold)">₹${order.total.toLocaleString('en-IN')}</strong></div>
        <div><span style="color:var(--white-60)">Delivery To:</span><br><strong>${order.customer.address}</strong></div>
        <div><span style="color:var(--white-60)">Expected Date:</span><br><strong>${order.deliveryDate}</strong></div>
      </div>
    </div>`;

  const input = document.getElementById('trackInput');
  if (input) input.value = orderId;
}

// ===== PRODUCT SLIDER =====
function renderProductSlider() {
  const slider = document.getElementById('productSlider');
  const dots = document.getElementById('sliderDots');
  if (!slider) return;

  slider.innerHTML = PRODUCTS.map(p => createProductCard(p)).join('');
  if (dots) {
    dots.innerHTML = PRODUCTS.map((_, i) =>
      `<div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
    ).join('');
  }
  addTiltEffect();
}

function createProductCard(p, isGrid = false) {
  const imgContent = p.image
    ? `<img src="${p.image}" alt="${p.nameEn}" class="pc-img-real" />`
    : p.emoji;

  return `
    <div class="product-card ${isGrid ? '' : ''}" onclick="openProduct('${p.id}')">
      <div class="product-card-image">
        ${imgContent}
        <div class="pc-badge ${p.available ? '' : 'out'}">${p.available ? 'In Stock' : 'Out of Stock'}</div>
      </div>
      <div class="product-card-body">
        <div class="pc-name">${p.name}</div>
        <div class="pc-desc">${p.desc}</div>
        <div class="pc-price-row">
          <span class="pc-price">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="pc-unit">/ ${p.unit}</span>
        </div>
        <div class="pc-delivery">${p.delivery}</div>
        <div class="pc-actions">
          <button class="btn btn-secondary" onclick="event.stopPropagation();addToCart('${p.id}')">+ Cart</button>
          <button class="btn btn-primary" onclick="event.stopPropagation();buyNow('${p.id}')">Order Now</button>
        </div>
      </div>
    </div>`;
}

function slideProducts(dir) {
  const slider = document.getElementById('productSlider');
  if (!slider) return;
  const card = slider.querySelector('.product-card');
  if (!card) return;
  const cardW = card.offsetWidth + 24; // + gap
  slider.scrollBy({ left: dir * cardW, behavior: 'smooth' });
  updateSliderDots();
}

function goToSlide(i) {
  const slider = document.getElementById('productSlider');
  if (!slider) return;
  const card = slider.querySelector('.product-card');
  if (!card) return;
  const cardW = card.offsetWidth + 24;
  slider.scrollTo({ left: i * cardW, behavior: 'smooth' });
  state.sliderIndex = i;
  updateSliderDots();
}

function updateSliderDots() {
  const slider = document.getElementById('productSlider');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slider || !dots.length) return;
  const card = slider.querySelector('.product-card');
  if (!card) return;
  const cardW = card.offsetWidth + 24;
  const idx = Math.round(slider.scrollLeft / cardW);
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

// ===== SHOP GRID =====
function renderShopGrid() {
  const el = document.getElementById('shopGrid');
  if (!el) return;

  let filtered = [...PRODUCTS];
  const cat = document.getElementById('filterCategory')?.value || 'all';
  const sort = document.getElementById('filterSort')?.value || 'default';
  const avail = document.getElementById('filterAvail')?.value || 'all';

  if (cat !== 'all') filtered = filtered.filter(p => p.category === cat);
  if (avail === 'available') filtered = filtered.filter(p => p.available);
  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'popular') filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

  el.innerHTML = filtered.length
    ? filtered.map(p => createProductCard(p, true)).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--white-60)">No products found for selected filters.</div>`;

  addTiltEffect();
}

function filterProducts() { renderShopGrid(); }

// ===== PRODUCT DETAIL MODAL =====
function openProduct(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  if (!p) return;

  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');
  if (!modal || !content) return;

  const waLink = `https://wa.me/${CONFIG.WHATSAPP}?text=Hello%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}%20from%20Ravikumar%20House%20Materials.`;

  const imgModalContent = p.image
    ? `<img src="${p.image}" alt="${p.nameEn}" class="pm-img-real" />`
    : p.emoji;

  content.innerHTML = `
    <div style="position:relative">
      <div class="pm-close" onclick="closeProductModal(null,true)">✕</div>
      <div class="pm-image">${imgModalContent}</div>
      <div class="pm-name">${p.name}</div>
      <div class="pm-desc">${p.desc}</div>
      <div class="pm-price-row">
        <span class="pm-price">₹${p.price.toLocaleString('en-IN')}</span>
        <span class="pm-unit">/ ${p.unit}</span>
      </div>
      <div class="pm-avail">
        <div class="pm-avail-dot" style="background:${p.available ? 'var(--green)' : 'var(--red)'}"></div>
        <span>${p.available ? `In Stock (${p.stock} ${p.unit}s available)` : 'Out of Stock'}</span>
      </div>
      <div class="pm-qty-row">
        <label>Quantity (${p.unit}s):</label>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeModalQty(-1,'${p.id}')">-</button>
          <input class="qty-val" type="number" id="modal-qty-${p.id}" value="${p.minQty}" min="${p.minQty}" />
          <button class="qty-btn" onclick="changeModalQty(1,'${p.id}')">+</button>
        </div>
      </div>
      <div class="pm-delivery">${p.delivery}</div>
      <div class="pm-actions">
        <button class="btn btn-secondary" onclick="addToCartFromModal('${p.id}')">🛒 Add to Cart</button>
        <button class="btn btn-primary" onclick="buyNowFromModal('${p.id}')">⚡ Order Now</button>
      </div>
      <div style="margin-top:1rem">
        <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-full">💬 Enquire on WhatsApp</a>
      </div>
    </div>`;

  modal.classList.add('active');
}

function changeModalQty(delta, productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  if (!p) return;
  const input = document.getElementById('modal-qty-' + productId);
  if (!input) return;
  const current = parseInt(input.value) || p.minQty;
  input.value = Math.max(p.minQty, current + delta);
}

function addToCartFromModal(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  const input = document.getElementById('modal-qty-' + productId);
  const qty = input ? parseInt(input.value) : 1;
  addToCart(productId, qty);
}

function buyNowFromModal(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  const input = document.getElementById('modal-qty-' + productId);
  const qty = input ? parseInt(input.value) : 1;
  addToCart(productId, qty);
  closeProductModal(null, true);
  navigate('checkout');
}

function buyNow(productId) {
  addToCart(productId);
  navigate('checkout');
}

function closeProductModal(e, force) {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  if (force || (e && e.target === modal)) {
    modal.classList.remove('active');
  }
}

// ===== ACCOUNT =====
function renderAccount() {
  const el = document.getElementById('accountContent');
  if (!el) return;

  if (!state.user) {
    el.innerHTML = `
      <div class="account-login-wrap">
        <div class="account-login-logo">
          <span>👤</span>
          <h2>Customer Account Login</h2>
          <p>Sign in or create account to view your orders & bookings</p>
        </div>
        <form onsubmit="loginUser(event)">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="login-name" placeholder="Enter your full name" required />
          </div>
          <div class="form-group">
            <label>Phone Number *</label>
            <input type="tel" id="login-phone" placeholder="10-digit mobile number" required />
          </div>
          <div class="form-group">
            <label>Email Address (Gmail)</label>
            <input type="email" id="login-email" placeholder="your.email@gmail.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-pass" placeholder="Enter your password" minlength="6" />
          </div>
          <button type="submit" class="btn btn-primary btn-full">Sign In / Register</button>
        </form>
      </div>`;
    return;
  }

  const myOrders = state.orders.filter(o => o.customer.phone === state.user.phone);
  const myBookings = state.serviceBookings.filter(b => b.phone === state.user.phone);

  el.innerHTML = `
    <div class="account-dashboard">
      <div class="account-profile-card glass">
        <div class="apc-avatar">👤</div>
        <div class="apc-info">
          <h2>${state.user.name}</h2>
          <p>📞 ${state.user.phone}</p>
          ${state.user.email ? `<p>✉️ ${state.user.email}</p>` : ''}
          <p>Member since ${formatDate(state.user.joinedAt)}</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="logoutUser()" style="margin-left:auto">Logout</button>
      </div>
      <div class="account-section glass">
        <h3>📦 My Orders (${myOrders.length})</h3>
        ${myOrders.length === 0
          ? '<p style="color:var(--white-60)">No orders yet. <a href="#shop" onclick="navigate(\'shop\')" style="color:var(--gold)">Shop now →</a></p>'
          : myOrders.slice(0, 5).map(o => `
          <div class="order-card" onclick="trackOrderById('${o.id}')">
            <div class="oc-header"><span class="oc-id">📦 ${o.id}</span><span class="oc-status ${getStatusClass(o.status)}">${o.status}</span></div>
            <div class="oc-products">${o.products.map(p => `${p.qty} × ${p.name}`).join(', ')}</div>
            <div class="oc-footer"><span class="oc-total">₹${o.total.toLocaleString('en-IN')}</span><span class="oc-date">${formatDate(o.createdAt)}</span></div>
          </div>`).join('')}
      </div>
      ${myBookings.length > 0 ? `
      <div class="account-section glass">
        <h3>🔧 My Service Bookings (${myBookings.length})</h3>
        ${myBookings.map(b => `
          <div class="order-card">
            <div class="oc-header"><span class="oc-id">${b.type === 'tractor' ? '🚜' : '🚰'} ${b.id}</span><span class="oc-status ${getStatusClass(b.status)}">${b.status}</span></div>
            <div class="oc-products">${b.type === 'tractor' ? 'Tractor Service' : 'Water Tanker'} • ${b.date} ${b.time}</div>
            <div class="oc-footer"><span class="oc-date">Booked: ${formatDate(b.createdAt)}</span></div>
          </div>`).join('')}
      </div>` : ''}
    </div>`;
}

function loginUser(e) {
  e.preventDefault();
  const name = document.getElementById('login-name').value.trim() || 'Customer';
  const phone = document.getElementById('login-phone').value.trim();
  const emailInput = document.getElementById('login-email')?.value.trim();
  const passInput = document.getElementById('login-pass')?.value.trim();

  if (phone.length < 10) { showToast('Enter valid phone number', 'error'); return; }

  const email = emailInput || `${phone}@ravikumar.com`;
  const password = passInput || 'Customer123!';

  // Supabase Auth Integration
  if (supabaseClient) {
    supabaseClient.auth.signInWithPassword({
      email,
      password
    }).then(({ data, error }) => {
      if (error) {
        // Auto register if user doesn't exist yet
        supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { name, phone } }
        }).then(({ data: sData, error: sErr }) => {
          if (sErr) console.warn('Supabase signup notice:', sErr.message);
          else console.log('✅ Registered user in Supabase Auth:', sData);
        });
      } else {
        console.log('✅ Logged in via Supabase Auth:', data);
      }
    });

    // Save profile to users table
    supabaseClient.from('users').upsert([
      { name, phone, email, role: 'customer' }
    ], { onConflict: 'phone' }).then(({ error }) => {
      if (error) console.warn('Supabase user upsert notice:', error);
      else console.log('✅ User profile saved in Supabase DB');
    });
  }

  const existing = state.orders.find(o => o.customer.phone === phone);
  state.user = {
    name: existing ? existing.customer.name : name,
    phone,
    email,
    joinedAt: new Date().toISOString(),
  };
  saveState();
  showToast(`Welcome, ${state.user.name}! ✓`, 'success');
  renderAccount();
}

function loginWithGoogle() {
  if (supabaseClient) {
    supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    }).then(({ data, error }) => {
      if (error) {
        showToast(error.message, 'error');
      }
    });
  } else {
    showToast('Connecting to Google Auth...', 'info');
  }
}

function loginUserFromModal(e) {
  e.preventDefault();
  const name = document.getElementById('w-name').value.trim();
  const phone = document.getElementById('w-phone').value.trim();
  const email = document.getElementById('w-email').value.trim();
  const pass = document.getElementById('w-pass').value.trim();

  if (phone.length < 10) { showToast('Enter valid phone number', 'error'); return; }

  state.user = {
    name,
    phone,
    email,
    joinedAt: new Date().toISOString(),
  };
  saveState();

  if (supabaseClient) {
    supabaseClient.auth.signUp({
      email,
      password: pass,
      options: { data: { name, phone } }
    }).then(({ data: sData, error: sErr }) => {
      if (sErr) console.warn('Supabase auth notice:', sErr.message);
      else console.log('✅ Supabase Auth user created:', sData);
    });

    supabaseClient.from('users').upsert([
      { name, phone, email, role: 'customer' }
    ], { onConflict: 'phone' });
  }

  localStorage.setItem('hasSeenAuthModal', 'true');
  closeModal('welcomeAuthModal');
  showToast(`Welcome, ${name}! ✓`, 'success');
  renderAccount();
}

function closeGuestAuthModal() {
  localStorage.setItem('hasSeenAuthModal', 'true');
  closeModal('welcomeAuthModal');
}

function logoutUser() {
  state.user = null;
  saveState();
  showToast('Logged out successfully', 'success');
  renderAccount();
}

// ===== SERVICE BOOKINGS =====
function bookService(e, type) {
  e.preventDefault();

  const prefix = type === 'tractor' ? 'tr' : 'tk';
  const name = document.getElementById(`${prefix}-name`).value.trim();
  const phone = document.getElementById(`${prefix}-phone`).value.trim();
  const address = document.getElementById(`${prefix}-address`).value.trim();
  const location = document.getElementById(`${prefix}-location`).value.trim();
  const date = document.getElementById(`${prefix}-date`).value;
  const time = document.getElementById(`${prefix}-time`).value;
  const notes = document.getElementById(`${prefix}-notes`).value.trim();

  const bookingId = (type === 'tractor' ? 'TRC' : 'WTR') + '-' + new Date().getFullYear() + '-' + String(state.serviceBookings.length + 1).padStart(3, '0');

  const booking = {
    id: bookingId,
    type,
    name, phone, address,
    location,
    date, time, notes,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  if (type === 'tractor') {
    booking.duration = document.getElementById('tr-duration').value;
    booking.requirements = document.getElementById('tr-req').value;
  } else {
    booking.tankerType = document.getElementById('tk-type').value;
    booking.qty = document.getElementById('tk-qty').value;
  }

  state.serviceBookings.unshift(booking);
  saveState();

  // Async insert to Supabase if connected
  if (supabaseClient) {
    supabaseClient.from('service_bookings').insert([{
      id: bookingId,
      service_type: type,
      customer_name: name,
      customer_phone: phone,
      address,
      location,
      service_date: date,
      service_time: time,
      duration: booking.duration || null,
      requirements: booking.requirements || null,
      tanker_type: booking.tankerType || null,
      quantity: parseInt(booking.qty) || 1,
      notes,
      status: 'Pending',
    }]).then(({ error }) => {
      if (error) console.error('Supabase service booking error:', error);
      else console.log('✅ Service booking saved to Supabase cloud!');
    });
  }

  // Show success modal
  const modal = document.getElementById('bookingSuccessModal');
  const msg = document.getElementById('bookingSuccessMsg');
  if (msg) msg.textContent = `Your ${type === 'tractor' ? 'tractor' : 'water tanker'} service has been booked for ${date}. Booking ID: ${bookingId}. We will confirm shortly.`;
  if (modal) modal.classList.add('active');

  // Reset form
  e.target.reset();

  showToast(`${type === 'tractor' ? '🚜 Tractor' : '🚰 Water Tanker'} booked! ID: ${bookingId}`, 'success');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// ===== CONTACT =====
function sendContactMsg(e) {
  e.preventDefault();
  const name = document.getElementById('ct-name').value.trim();
  const phone = document.getElementById('ct-phone').value.trim();
  const msg = document.getElementById('ct-msg').value.trim();
  const waMsg = `Hello from ${name} (${phone}): ${msg}`;
  window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(waMsg)}`, '_blank');
  showToast('Opening WhatsApp... ✓', 'success');
  e.target.reset();
}

// ===== SEARCH =====
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  if (!bar) return;
  bar.classList.toggle('active');
  if (bar.classList.contains('active')) {
    document.getElementById('searchInput')?.focus();
  } else {
    const results = document.getElementById('searchResults');
    if (results) results.classList.remove('active');
  }
}

function handleSearch(q) {
  const results = document.getElementById('searchResults');
  if (!results) return;
  q = q.toLowerCase().trim();

  if (!q) { results.classList.remove('active'); return; }

  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.category.includes(q)
  );

  if (!matches.length) {
    results.innerHTML = '<div class="search-result-item"><span style="color:var(--white-60)">No materials found</span></div>';
  } else {
    results.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="openProduct('${p.id}');toggleSearch()">
        <div class="sri-icon">${p.emoji}</div>
        <div class="sri-info">
          <div class="sri-name">${p.name}</div>
          <div class="sri-price">₹${p.price.toLocaleString('en-IN')} / ${p.unit}</div>
        </div>
      </div>`).join('');
  }
  results.classList.add('active');
}

// ===== ADMIN PANEL =====
function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const pass = document.getElementById('admin-pass').value.trim();

  if (email === CONFIG.ADMIN_EMAIL && pass === CONFIG.ADMIN_PASS) {
    state.adminLoggedIn = true;
    saveState();
    document.getElementById('adminLoginWrap').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderAdminDashboard();
    showToast('Welcome, Admin! ✓', 'success');
  } else {
    showToast('Invalid credentials', 'error');
  }
}

function renderAdmin() {
  if (state.adminLoggedIn) {
    const loginWrap = document.getElementById('adminLoginWrap');
    const dash = document.getElementById('adminDashboard');
    if (loginWrap) loginWrap.style.display = 'none';
    if (dash) { dash.style.display = 'block'; renderAdminDashboard(); }
  }
}

function renderAdminDashboard() {
  const el = document.getElementById('adminDashboard');
  if (!el) return;

  const orders = state.orders;
  const bookings = state.serviceBookings;
  const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);

  el.innerHTML = `
    <div class="admin-top">
      <h2>🏗️ Admin Dashboard — Ravikumar House Materials</h2>
      <button class="btn btn-outline btn-sm" onclick="adminLogout()">Logout</button>
    </div>
    <div class="admin-stats">
      <div class="admin-stat-card"><div class="asc-num">${orders.length}</div><div class="asc-label">Total Orders</div></div>
      <div class="admin-stat-card"><div class="asc-num">${orders.filter(o=>o.status==='Order Placed').length}</div><div class="asc-label">Pending</div></div>
      <div class="admin-stat-card"><div class="asc-num">${orders.filter(o=>o.status==='Out for Delivery').length}</div><div class="asc-label">Out for Delivery</div></div>
      <div class="admin-stat-card"><div class="asc-num">${orders.filter(o=>o.status==='Delivered').length}</div><div class="asc-label">Delivered</div></div>
      <div class="admin-stat-card"><div class="asc-num">₹${totalSales.toLocaleString('en-IN')}</div><div class="asc-label">Total Sales</div></div>
      <div class="admin-stat-card"><div class="asc-num">${bookings.length}</div><div class="asc-label">Service Bookings</div></div>
    </div>
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="showAdminPanel('orders',this)">📦 Orders</button>
      <button class="admin-tab" onclick="showAdminPanel('products',this)">🏗️ Products</button>
      <button class="admin-tab" onclick="showAdminPanel('services',this)">🔧 Services</button>
      <button class="admin-tab" onclick="showAdminPanel('customers',this)">👥 Customers</button>
    </div>
    <div id="admin-orders" class="admin-panel active">${renderAdminOrders()}</div>
    <div id="admin-products" class="admin-panel">${renderAdminProducts()}</div>
    <div id="admin-services" class="admin-panel">${renderAdminServices()}</div>
    <div id="admin-customers" class="admin-panel">${renderAdminCustomers()}</div>`;
}

function showAdminPanel(name, btn) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('admin-' + name);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

function renderAdminOrders() {
  if (!state.orders.length) return '<p style="color:var(--white-60);padding:2rem">No orders yet.</p>';

  const statuses = ['Order Placed', 'Order Confirmed', 'Material Preparing', 'Loading', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Materials</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${state.orders.map(o => `
            <tr>
              <td style="color:var(--gold);font-weight:700">${o.id}</td>
              <td>${o.customer.name}</td>
              <td>${o.customer.phone}</td>
              <td style="font-size:0.82rem">${o.products.map(p => `${p.qty}×${p.name}`).join(', ')}</td>
              <td style="color:var(--gold);font-weight:700">₹${o.total.toLocaleString('en-IN')}</td>
              <td><span style="font-size:0.8rem;background:rgba(34,197,94,0.1);color:var(--green);padding:0.2rem 0.6rem;border-radius:99px">${o.paymentStatus}</span></td>
              <td style="font-size:0.82rem;color:var(--white-60)">${formatDate(o.createdAt)}</td>
              <td>
                <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
                  ${statuses.map(s => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function updateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  if (!order.statusHistory) order.statusHistory = [];
  if (!order.statusHistory.find(h => h.status === newStatus)) {
    order.statusHistory.push({ status: newStatus, time: new Date().toISOString() });
  }
  saveState();

  if (supabaseClient) {
    supabaseClient.from('orders').update({
      order_status: newStatus,
      status_history: order.statusHistory,
      updated_at: new Date().toISOString()
    }).eq('id', orderId).then(({ error }) => {
      if (error) console.error('Supabase status update error:', error);
      else console.log(`✅ Supabase order ${orderId} status synced to cloud`);
    });
  }

  showToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
}

function renderAdminProducts() {
  return `
    <div class="admin-product-grid">
      ${PRODUCTS.map(p => `
        <div class="admin-product-card">
          <div class="apc-image">${p.emoji}</div>
          <div class="apc-body">
            <div class="apc-name">${p.name}</div>
            <div class="apc-price-row">
              <span class="apc-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="apc-unit">/${p.unit}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--white-60);margin-bottom:0.75rem">Stock: ${p.stock} ${p.unit}s</div>
            <div class="admin-price-edit" style="margin-bottom:0.75rem">
              <input type="number" id="price-${p.id}" value="${p.price}" placeholder="New price" />
              <button class="btn btn-primary btn-sm" onclick="updateProductPrice('${p.id}')">Set</button>
            </div>
            <div class="apc-actions">
              <button class="btn btn-success btn-sm" onclick="toggleProductAvail('${p.id}')">${p.available ? '✓ In Stock' : '✗ Out'}</button>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

function updateProductPrice(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  const input = document.getElementById('price-' + productId);
  if (!p || !input) return;
  const newPrice = parseInt(input.value);
  if (isNaN(newPrice) || newPrice < 0) { showToast('Invalid price', 'error'); return; }
  p.price = newPrice;
  showToast(`${p.nameEn} price updated to ₹${newPrice}`, 'success');
  renderAdminDashboard();
}

function toggleProductAvail(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  if (!p) return;
  p.available = !p.available;
  showToast(`${p.nameEn} marked as ${p.available ? 'Available' : 'Out of Stock'}`, 'success');
  renderAdminDashboard();
}

function renderAdminServices() {
  if (!state.serviceBookings.length) return '<p style="color:var(--white-60);padding:2rem">No service bookings yet.</p>';

  const tractorStatuses = ['Pending', 'Confirmed', 'Driver Assigned', 'On the Way', 'Service Started', 'Completed', 'Cancelled'];
  const tankerStatuses = ['Pending', 'Confirmed', 'Vehicle Assigned', 'On the Way', 'Delivered', 'Completed', 'Cancelled'];

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Type</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${state.serviceBookings.map(b => `
            <tr>
              <td style="color:var(--gold);font-weight:700">${b.id}</td>
              <td>${b.type === 'tractor' ? '🚜 Tractor' : '🚰 Tanker'}</td>
              <td>${b.name}</td>
              <td>${b.phone}</td>
              <td>${b.date}</td>
              <td>${b.time}</td>
              <td style="font-size:0.82rem">${b.address}</td>
              <td>
                <select class="status-select" onchange="updateServiceStatus('${b.id}', this.value)">
                  ${(b.type === 'tractor' ? tractorStatuses : tankerStatuses).map(s => `<option value="${s}" ${b.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function updateServiceStatus(bookingId, newStatus) {
  const booking = state.serviceBookings.find(b => b.id === bookingId);
  if (!booking) return;
  booking.status = newStatus;
  saveState();
  showToast(`Booking ${bookingId} updated to "${newStatus}"`, 'success');
}

function renderAdminCustomers() {
  const uniqueCustomers = [];
  const seen = new Set();
  state.orders.forEach(o => {
    if (!seen.has(o.customer.phone)) {
      seen.add(o.customer.phone);
      uniqueCustomers.push({
        name: o.customer.name,
        phone: o.customer.phone,
        orderCount: state.orders.filter(x => x.customer.phone === o.customer.phone).length,
        totalSpent: state.orders.filter(x => x.customer.phone === o.customer.phone).reduce((s, x) => s + x.total, 0),
        lastOrder: o.createdAt,
      });
    }
  });

  if (!uniqueCustomers.length) return '<p style="color:var(--white-60);padding:2rem">No customers yet.</p>';

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Last Order</th>
          </tr>
        </thead>
        <tbody>
          ${uniqueCustomers.map(c => `
            <tr>
              <td style="font-weight:600">${c.name}</td>
              <td>${c.phone}</td>
              <td style="text-align:center">${c.orderCount}</td>
              <td style="color:var(--gold);font-weight:700">₹${c.totalSpent.toLocaleString('en-IN')}</td>
              <td style="font-size:0.82rem;color:var(--white-60)">${formatDate(c.lastOrder)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function adminLogout() {
  state.adminLoggedIn = false;
  saveState();
  const loginWrap = document.getElementById('adminLoginWrap');
  const dash = document.getElementById('adminDashboard');
  if (loginWrap) loginWrap.style.display = 'flex';
  if (dash) dash.style.display = 'none';
  showToast('Logged out from admin', 'success');
}

// ===== TILT EFFECT =====
function addTiltEffect() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(800px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// ===== REVEAL ON SCROLL =====
function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up').forEach(el => {
    observer.observe(el);
  });
}

// ===== TAGLINE ANIMATION =====
function startTaglineAnim() {
  const words = document.querySelectorAll('.tagline-word');
  if (!words.length) return;
  let i = 0;

  function cycle() {
    words.forEach(w => w.classList.remove('active'));
    words[i].classList.add('active');
    i = (i + 1) % words.length;
  }
  cycle();
  setInterval(cycle, 2000);
}

// ===== NAVBAR SCROLL =====
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-msg">${msg}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== UTILITIES =====
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initSplash();
  initNavbarScroll();

  // Initial route
  setTimeout(() => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigate(hash || 'home');
    updateCartBadge();
    startTaglineAnim();
    initRevealObserver();
    addTiltEffect();

    // Set min date for booking forms
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    ['tr-date', 'tk-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.min = minDate; el.value = minDate; }
    });
  }, 3200);

  // Show Sign In Modal IMMEDIATELY on first visit whenever user is not signed in
  if (!state.user) {
    const wModal = document.getElementById('welcomeAuthModal');
    if (wModal) wModal.classList.add('active');
  }

  // Slider scroll listener
  const slider = document.getElementById('productSlider');
  if (slider) slider.addEventListener('scroll', updateSliderDots);

  // Close search on outside click
  document.addEventListener('click', (e) => {
    const bar = document.getElementById('searchBar');
    const btn = document.querySelector('.nav-search-btn');
    if (bar && bar.classList.contains('active') && !bar.contains(e.target) && !btn.contains(e.target)) {
      toggleSearch();
    }
  });

  // Mobile swipe for product slider
  let touchStartX = 0;
  const sliderEl = document.getElementById('productSlider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) slideProducts(diff > 0 ? 1 : -1);
    });
  }
});
