/* ═══════════════════════════════════════════════════════════════
   JUMP — JavaScript Principal
   SPA con enrutamiento por hash · Auth · OpenStreetMap · Admin
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── STATE ─── */
  const state = {
    user: null,
    page: '',
    map: null,
    pickup: null,      // { lat, lng }
    destination: null, // { lat, lng }
    mapMode: 'pickup', // 'pickup' | 'destination' | 'view'
    drivers: [],
    pickupMarker: null,
    destMarker: null,
    routeLines: [],
    driverMarkers: [],
    circle: null,
    selectedVehicle: 'moto',
    pageHistory: [],
    adminMap: null,
    adminDrivers: [],
    cart: [],          // { id, restaurantId, restaurantName, name, desc, price, img, qty }
  };

  /* ─── SVG ICONS ─── */
  const icon = (path, size = 24) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  const ICONS = {
    car: icon('<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><polygon points="12 15 17 21 7 21 12 15"/>'),
    package: icon('<path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5.3 8.7-5.3"/><path d="M12 22V12"/>'),
    layout: icon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>'),
    user: icon('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    shield: icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    logout: icon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'),
    mapPin: icon('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
    star: icon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
    arrowRight: icon('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
    check: icon('<polyline points="20 6 9 17 4 12"/>'),
    clock: icon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
    menu: icon('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>'),
    x: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
    chevronDown: icon('<polyline points="6 9 12 15 18 9"/>'),
    search: icon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
    crosshair: icon('<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>'),
    refresh: icon('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'),
    grip: icon('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'),
    bike: icon('<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>'),
    users: icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    dollar: icon('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
    activity: icon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    moreH: icon('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
    shieldCheck: icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>'),
    eye: icon('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
    cart: icon('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),
  };

  /* ─── HELPERS ─── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function htmlToEl(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function randomBetween(min, max) { return min + Math.random() * (max - min); }

  function haversine(a, b) {
    const R = 6371;
    const toRad = v => v * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function generateDrivers(near, count) {
    const names = ['Carlos M.', 'María G.', 'Pedro R.', 'Ana L.', 'Luis F.', 'Sofía T.', 'Jorge H.'];
    const vehicles = ['Nissan Versa', 'Toyota Corolla', 'SUV Premium', 'Moto', 'Van', 'Jetta', 'CX-30'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + randomBetween(-0.3, 0.3);
      const radius = randomBetween(0.008, 0.035);
      return {
        id: `d-${i}`,
        lat: near.lat + Math.cos(angle) * radius,
        lng: near.lng + Math.sin(angle) * radius,
        name: names[i % names.length],
        vehicle: vehicles[i % vehicles.length],
        eta: `${2 + Math.floor(Math.random() * 7)} min`,
      };
    });
  }

  const RATE_KEY = 'pt_exchange_rate';
  const RATE_DATE_KEY = 'pt_exchange_rate_date';

  function isToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date().toISOString().slice(0, 10);
    return dateStr === today;
  }

  function getStoredRate() {
    try {
      const rate = parseFloat(localStorage.getItem(RATE_KEY));
      const date = localStorage.getItem(RATE_DATE_KEY);
      if (!isNaN(rate) && isToday(date)) return rate;
    } catch {}
    return null;
  }

  function storeRate(rate) {
    localStorage.setItem(RATE_KEY, rate);
    localStorage.setItem(RATE_DATE_KEY, new Date().toISOString().slice(0, 10));
  }

  async function fetchExchangeRate() {
    const stored = getStoredRate();
    if (stored !== null) return stored;
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
      const data = await res.json();
      const rate = data.promedio || data.venta || data.compra;
      if (rate) storeRate(rate);
      return rate || getStoredRate() || 62.50;
    } catch { return getStoredRate() || 62.50; }
  }

  async function fetchRoute(p1, p2) {
    const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!data.routes || !data.routes.length) return null;
      const r = data.routes[0];
      return {
        coords: r.geometry.coordinates.map(c => [c[1], c[0]]),
        distance: r.distance / 1000,
        duration: r.duration,
      };
    } catch { return null; }
  }

  function calcDistance(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  let _searchTimeout;
  async function geocode(query) {
    if (!query || query.length < 3) return [];
    try {
      const q = `${query}, Colonia Tovar, Venezuela`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&countrycodes=ve`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map(r => ({
        label: r.display_name.split(',')[0],
        full: r.display_name,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
      }));
    } catch { return []; }
  }

  const COLONIA_TOVAR_STOPS = [
    { name: 'Plaza Bolívar', lat: 10.4078, lng: -67.2890, zoom: 13 },
    { name: 'Mirador El Alemán', lat: 10.4040, lng: -67.2870, zoom: 13 },
    { name: 'Entrada Colonia Tovar', lat: 10.3950, lng: -67.2780, zoom: 13 },
  ];

  const COLONIA_RESTAURANTS = [
    { name: 'Restaurant El Alemán', lat: 10.4072, lng: -67.2888, zoom: 15 },
    { name: 'La Casa de la Abuela', lat: 10.4065, lng: -67.2905, zoom: 15 },
    { name: 'Pizzería Colonia', lat: 10.4080, lng: -67.2875, zoom: 15 },
    { name: 'Restaurant Mirador', lat: 10.4045, lng: -67.2865, zoom: 15 },
    { name: 'El Viejo Molino', lat: 10.4060, lng: -67.2910, zoom: 16 },
  ];

  const COLONIA_HOTELS = [
    { name: 'Hotel Selva Negra', lat: 10.4068, lng: -67.2900, zoom: 15 },
    { name: 'Posada El Encanto', lat: 10.4090, lng: -67.2865, zoom: 15 },
    { name: 'Hotel Montaña', lat: 10.4055, lng: -67.2920, zoom: 15 },
    { name: 'Hospedería Tovar', lat: 10.4048, lng: -67.2895, zoom: 16 },
  ];



  /* ─── AUTH ─── */
  function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('pt_user')); } catch { return null; }
  }

  function saveUser(u) {
    localStorage.setItem('pt_user', JSON.stringify(u));
    state.user = u;
  }

  function clearUser() {
    localStorage.removeItem('pt_user');
    state.user = null;
  }

  const DEMO_USERS = [
    { id: '1', email: 'super@admin.com', password: '123', displayName: 'Super Admin', role: 'super_admin' },
    { id: '2', email: 'admin@admin.com', password: '123', displayName: 'Admin Básico', role: 'admin' },
    { id: '3', email: 'conductor@email.com', password: '123', displayName: 'Carlos López', role: 'driver' },
    { id: '4', email: 'cliente@email.com', password: '123', displayName: 'María García', role: 'client' },
  ];

  function login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = DEMO_USERS.find(u => u.email === email && u.password === password);
        if (!found) { reject(new Error('Credenciales inválidas')); return; }
        const { password: _, ...u } = found;
        u.createdAt = new Date().toISOString();
        saveUser(u);
        resolve(u);
      }, 800);
    });
  }

  function register(email, password, displayName, role) {
    return new Promise(resolve => {
      setTimeout(() => {
        const u = { id: Date.now().toString(), email, displayName, role, createdAt: new Date().toISOString() };
        saveUser(u);
        resolve(u);
      }, 1000);
    });
  }

  function logout() {
    clearUser();
    navigate('login');
  }

  function requireAuth() {
    const u = getStoredUser();
    if (!u) { navigate('login'); return null; }
    state.user = u;
    return u;
  }

  function isAdmin(role) { return role === 'super_admin' || role === 'admin'; }

  function requireAdmin() {
    const u = requireAuth();
    if (!u) return null;
    if (!isAdmin(u.role)) { navigate('home'); return null; }
    return u;
  }

  function requireSuperAdmin() {
    const u = requireAuth();
    if (!u) return null;
    if (u.role !== 'super_admin') { navigate('home'); return null; }
    return u;
  }

  /* ─── NAVBAR ─── */
  function renderNavbar() {
    const u = state.user;
    const nav = document.getElementById('navbar');
    if (!u || state.page === 'login' || state.page === 'register') {
      nav.classList.add('hidden');
      return;
    }
    nav.classList.remove('hidden');

    const isSuper = u.role === 'super_admin';
    const isAdm = isAdmin(u.role);
    const isDriver = u.role === 'driver';
    const activePage = state.page;
    const initial = u.displayName ? u.displayName.charAt(0).toUpperCase() : '?';
    const hasHistory = state.pageHistory.length > 0;

    const navLinks = [
      { href: 'home', label: 'Inicio', icon: ICONS.layout },
      ...(!isDriver ? [{ href: 'transfer', label: 'Viajes', icon: ICONS.car }] : [{ href: 'driver', label: 'Mi Perfil', icon: ICONS.user }]),
      { href: 'vehicles', label: 'Vehículos', icon: ICONS.car },
    ];

    const adminLinks = [
      { href: 'admin', label: 'Panel de Control', icon: ICONS.layout },
      ...(isSuper ? [{ href: 'admin', label: 'Usuarios', icon: ICONS.users }] : []),
    ];

    nav.innerHTML = `
      <div class="navbar-inner">
        <div style="display:flex;align-items:center;gap:8px">
          ${hasHistory ? `<button class="navbar-back-btn" id="backBtn">${icon('<polyline points="15 18 9 12 15 6"/>', 20)}</button>` : ''}
          <a href="#home" class="navbar-logo">
            <div class="logo-icon">${ICONS.car}</div>
            <span>Jump</span>
          </a>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="navbar-menu-btn" id="menuBtn">
            ${ICONS.menu}
            <span class="menu-label">Menú</span>
          </button>
          <button class="navbar-cart-btn" id="cartBtn" title="Mi carrito">
            ${ICONS.cart}
            <span class="cart-badge" id="cartBadge" style="display:none">0</span>
          </button>
          <div class="navbar-user">
            <button class="navbar-user-btn" id="userMenuBtn">
              <div class="avatar">${initial}</div>
              <span class="user-name">${u.displayName}</span>
              ${ICONS.chevronDown.replace('width="24"', 'width="12"').replace('height="24"', 'height="12"')}
            </button>
            <div class="navbar-dropdown hidden" id="userDropdown">
              <div class="navbar-dropdown-header">
                <p>${u.displayName}</p>
                <small>${u.email}</small>
                <span class="role-badge">${u.role}</span>
              </div>
              <a href="#home">${ICONS.user} Perfil</a>
              <a href="#home" style="margin-top:4px">${ICONS.layout} Ir al Inicio</a>
              <button class="logout" id="logoutBtn">${ICONS.logout} Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // User menu toggle
    const usrBtn = document.getElementById('userMenuBtn');
    const usrDropdown = document.getElementById('userDropdown');
    if (usrBtn && usrDropdown) {
      usrBtn.addEventListener('click', e => {
        e.stopPropagation();
        usrDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', () => usrDropdown && usrDropdown.classList.add('hidden'));
      usrDropdown.addEventListener('click', e => e.stopPropagation());
    }

    document.getElementById('menuBtn') && document.getElementById('menuBtn').addEventListener('click', openDrawer);
    document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('backBtn') && document.getElementById('backBtn').addEventListener('click', goBack);
  }

  function renderDrawer() {
    var drawer = document.getElementById('globalDrawer');
    var u = state.user;
    if (!u || !drawer) {
      if (drawer) drawer.innerHTML = '';
      return;
    }

    var role = u.role;
    var isSuper = role === 'super_admin';
    var isAdm = isAdmin(role);
    var isDriver = role === 'driver';
    var initial = u.displayName ? u.displayName.charAt(0).toUpperCase() : '?';

    var links = [
      { href: 'home', label: 'Inicio', icon: 'home' },
      { href: 'transfer', label: 'Transfer', icon: 'directions_car' },
      { href: 'vehicles', label: 'Vehículos', icon: 'local_shipping' }
    ];

    if (!isDriver) {
      links.push({ href: 'comida', label: 'Comida', icon: 'restaurant' });
      links.push({ href: 'paseos', label: 'Paseos', icon: 'map' });
    }

    if (isAdm || isSuper) {
      links.push({ href: 'admin', label: 'Panel Admin', icon: 'admin_panel_settings' });
    }

    var linksHtml = links.map(function(l) {
      var isActive = state.page === l.href ? ' active' : '';
      return '<a href="#' + l.href + '" class="drawer-nav-item' + isActive + '">' +
        '<span class="material-symbols-outlined">' + l.icon + '</span>' +
        '<span class="drawer-nav-label">' + l.label + '</span>' +
      '</a>';
    }).join('');

    drawer.innerHTML =
      '<div class="drawer-header">' +
        '<div class="drawer-brand">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            ICONS.car +
          '</div>' +
          '<div class="drawer-brand-text">' +
            '<strong>Jump</strong>' +
            '<small>Precision Mobility</small>' +
          '</div>' +
        '</div>' +
        '<button class="drawer-close-btn" id="drawerCloseBtn">' +
          '<span class="material-symbols-outlined">close</span>' +
        '</button>' +
      '</div>' +
      '<nav class="drawer-nav">' + linksHtml + '</nav>' +
      '<div class="drawer-user">' +
        '<div class="drawer-user-avatar">' + initial + '</div>' +
        '<div class="drawer-user-info">' +
          '<strong>' + u.displayName + '</strong>' +
          '<small>' + u.email + '</small>' +
          '<span class="role-badge">' + role + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-footer">' +
        '<button class="drawer-logout-btn" id="drawerLogoutBtn">' +
          '<span class="material-symbols-outlined">logout</span>' +
          '<span>Cerrar Sesión</span>' +
        '</button>' +
      '</div>';

    document.getElementById('drawerCloseBtn') && document.getElementById('drawerCloseBtn').addEventListener('click', closeDrawer);
    document.getElementById('drawerLogoutBtn') && document.getElementById('drawerLogoutBtn').addEventListener('click', logout);
    var navItems = drawer.querySelectorAll('.drawer-nav-item');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener('click', function() { closeDrawer(); });
    }
  }
function showPage(pageId) {
    var prev = state.page;
    if (prev && prev !== pageId && prev !== 'login' && prev !== 'register') {
      state.pageHistory.push(prev);
      if (state.pageHistory.length > 10) state.pageHistory.shift();
    }
    if (prev === 'paseo-detail' && pageId !== 'paseo-detail' && _paseoMap) {
      _paseoMap.remove();
      _paseoMap = null;
      _paseoMarkers = [];
    }
    $$('.page').forEach(function(p) { p.classList.remove('active'); });
    var el = document.getElementById('page-' + pageId);
    if (el) el.classList.add('active');
    state.page = pageId;
    renderNavbar();
    renderDrawer();

    var bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      var showBottom = ['home', 'transfer', 'comida', 'paseos', 'vehicles'].indexOf(pageId) !== -1 && state.user;
      bottomNav.style.display = showBottom ? 'flex' : 'none';
      var driverBottomNav = document.getElementById('driverBottomNav');
      if (driverBottomNav) {
        driverBottomNav.style.display = (pageId === 'driver') && state.user ? 'flex' : 'none';
      }
      bottomNav.querySelectorAll('.bottom-nav-item').forEach(function(a) {
        var p = a.dataset.page;
        a.classList.toggle('active', p === pageId);
        if (p === pageId) {
          a.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
        } else {
          a.querySelector('.material-symbols-outlined').style.fontVariationSettings = "'FILL' 0";
        }
      });
    }

    var adminContent = document.querySelector('.admin-content');
    var driverContent = document.querySelector('.driver-content');
    if (adminContent) adminContent.style.display = pageId === 'admin' ? '' : 'none';
    if (driverContent) driverContent.style.display = pageId === 'driver' ? '' : 'none';
  }

  function goBack() {
    var prev = state.pageHistory.pop();
    if (prev) navigate(prev);
  }

  function getOrCreateBackdrop() {
    var bd = document.getElementById('drawerBackdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'drawerBackdrop';
      bd.className = 'drawer-backdrop';
      document.body.appendChild(bd);
    }
    return bd;
  }

function openDrawer() {
    var drawer = document.getElementById('globalDrawer');
    var bd = getOrCreateBackdrop();
    drawer?.classList.add('open');
    bd.classList.add('active');
    bd.onclick = closeDrawer;
  }

  function closeDrawer() {
    var drawer = document.getElementById('globalDrawer');
    var bd = getOrCreateBackdrop();
    drawer?.classList.remove('open');
    bd.classList.remove('active');
    bd.onclick = null;
  }



  function initPage(page, params) {
    showPage(page);
    switch (page) {
      case 'login': initLogin(); break;
      case 'register': initRegister(); break;
      case 'home': initHome(); break;
      case 'transfer': initTransfer(); break;
      case 'vehicles': initVehicles(); break;
      case 'driver': initDriver(params); break;
      case 'admin': initAdmin(); break;
      case 'paseos': initPaseos(); break;
      case 'paseo-detail': initPaseoDetail(params); break;
      case 'comida': initComida(); break;
      case 'comida-detail': initComidaDetail(params); break;
    }
  }

  /* ─── ROUTER ─── */
  function navigate(page, data) {
    window.location.hash = page;
    // initPage will be called by hashchange
  }

  function getPageFromHash() {
    const raw = window.location.hash.replace('#', '') || 'loading';
    const parts = raw.split('?');
    const params = {};
    if (parts[1]) {
      parts[1].split('&').forEach(function(p) {
        const kv = p.split('=');
        params[kv[0]] = decodeURIComponent(kv[1] || '');
      });
    }
    return { page: parts[0], params };
  }

  function handleHashChange() {
    const { page, params } = getPageFromHash();
    if (!page || page === 'loading') {
      const u = getStoredUser();
      if (u) { state.user = u; initPage(isAdmin(u.role) ? 'admin' : 'home'); }
      else initPage('login');
      return;
    }
    initPage(page, params);
  }

  /* ─── LOGIN ─── */
  function initLogin() {
    const page = document.getElementById('page-login');
    if (!page) return;
    if (state.user) { navigate(isAdmin(state.user.role) ? 'admin' : 'home'); return; }

    const form = page.querySelector('.auth-form');
    const emailInput = page.querySelector('#loginEmail');
    const passInput = page.querySelector('#loginPass');
    const toggleBtn = page.querySelector('#loginTogglePass');
    const errorEl = page.querySelector('.form-error');
    const submitBtn = page.querySelector('#loginSubmit');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        toggleBtn.innerHTML = ICONS[isPass ? 'shield' : 'check'];
      });
    }

    // Demo user quick-fill buttons
    page.querySelectorAll('.demo-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        emailInput.value = btn.dataset.email;
        passInput.value = btn.dataset.pass;
        errorEl.classList.add('hidden');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(0,242,194,0.3);border-top-color:#00F2C2;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto"></div>';

      try {
        await login(emailInput.value, passInput.value);
        if (state.user.role === 'driver') navigate('driver');
        else if (isAdmin(state.user.role)) navigate('admin');
        else navigate('home');
      } catch (err) {
        errorEl.textContent = err.message || 'Error al iniciar sesión';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${ICONS.arrowRight} Iniciar Sesión`;
      }
    });
  }

  /* ─── REGISTER ─── */
  function initRegister() {
    const page = document.getElementById('page-register');
    if (!page) return;
    if (state.user) { navigate(isAdmin(state.user.role) ? 'admin' : 'home'); return; }

    const errorEl = page.querySelector('.form-error');
    const submitBtn = page.querySelector('#registerSubmit');
    const form = page.querySelector('.auth-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = page.querySelector('#registerName').value.trim();
      const email = page.querySelector('#registerEmail').value.trim();
      const pass = page.querySelector('#registerPass').value;

      errorEl.classList.add('hidden');
      if (!name || !email || !pass) {
        errorEl.textContent = 'Todos los campos son obligatorios';
        errorEl.classList.remove('hidden');
        return;
      }
      if (pass.length < 8) {
        errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres';
        errorEl.classList.remove('hidden');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(0,242,194,0.3);border-top-color:#00F2C2;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto"></div>';

      try {
        await register(email, pass, name, 'client');
        navigate('home');
      } catch (err) {
        errorEl.textContent = err.message || 'Error al crear la cuenta';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${ICONS.arrowRight} Crear Cuenta`;
      }
    });
  }

  /* ─── HOME ─── */
  function initHome() {
    if (!requireAuth()) return;
    const u = state.user;
    const greeting = document.getElementById('homeGreeting');
    if (greeting) greeting.textContent = u.displayName ? u.displayName.split(' ')[0] : 'Usuario';
  }

  /* ─── VEHICLES ─── */
  function initVehicles() {
    if (!requireAuth()) return;
    const container = document.getElementById('vehiclesGrid');
    const detailBar = document.getElementById('vehicleDetail');
    if (!container) return;

    const vehicles = [
      { id: 'standard', name: 'Standard', category: 'Sedan', icon: 'car', capacity: 4, luggage: 2, pricePerKm: 12, minPrice: 45, features: ['Aire acondicionado', 'Rastreo GPS', 'Seguro a bordo'], color: 'blue' },
      { id: 'premium', name: 'Premium', category: 'SUV de Lujo', icon: 'shield', capacity: 4, luggage: 3, pricePerKm: 22, minPrice: 89, features: ['Asientos de cuero', 'WiFi a bordo', 'Bebidas premium', 'Asistente personal'], color: 'amber' },
      { id: 'moto', name: 'Moto', category: 'Scooter', icon: 'bike', capacity: 1, luggage: 0, pricePerKm: 8, minPrice: 25, features: ['Casco incluido', 'Entrega rápida'], color: 'emerald' },
      { id: 'van', name: 'Van', category: 'Camioneta', icon: 'shieldCheck', capacity: 7, luggage: 6, pricePerKm: 18, minPrice: 65, features: ['Espacio amplio', 'Aire acondicionado', 'Carga asegurada'], color: 'purple' },
    ];

    let selected = 'standard';

    const iconMap = { car: ICONS.car, shield: ICONS.shield, bike: ICONS.bike, shieldCheck: ICONS.shieldCheck };

    function renderVehicles() {
      container.innerHTML = vehicles.map(v => `
        <div class="vehicle-card ${selected === v.id ? 'selected' : ''}" data-id="${v.id}">
          <div class="v-color-bar ${v.color}"></div>
          <div class="vehicle-card-body">
            <div class="v-icon-wrap ${v.color}">${iconMap[v.icon]}</div>
            <div class="v-head">
              <h3>${v.name}</h3>
              <span class="v-badge ${v.color}">$${v.pricePerKm}/km</span>
            </div>
            <div class="v-category">${v.category}</div>
            <div class="v-desc">${v.description || 'Vehículo premium para tus viajes.'}</div>
            <div class="v-specs">
              <span>${ICONS.user} ${v.capacity} pers.</span>
              <span>${ICONS.package} ${v.luggage} maletas</span>
            </div>
            <ul class="v-features">${v.features.map(f => `<li>${f}</li>`).join('')}</ul>
            <div class="v-footer">
              <small>Tarifa mínima</small>
              <span class="v-min-price">$${v.minPrice}</span>
            </div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', () => {
          selected = card.dataset.id;
          renderVehicles();
          renderDetail();
        });
      });

      renderDetail();
    }

    function renderDetail() {
      const v = vehicles.find(x => x.id === selected);
      if (!v || !detailBar) return;
      detailBar.innerHTML = `
        <div class="vd-left">
          <div class="vd-icon ${v.color}">${iconMap[v.icon]}</div>
          <div class="vd-info">
            <h3>${v.name} · ${v.category}</h3>
            <p>Capacidad: ${v.capacity} personas · ${v.luggage} maletas</p>
          </div>
        </div>
        <div class="vd-right">
          <div class="vd-rate">
            <small>Tarifa por km</small>
            <strong>$${v.pricePerKm}</strong>
          </div>
          <button class="btn btn-primary" onclick="window.location.hash='transfer'">Seleccionar</button>
        </div>
      `;
      detailBar.classList.remove('hidden');
    }

    renderVehicles();
  }

  /* ══════════════════════════════════════════════════
     DRIVER PAGE
     ══════════════════════════════════════════════════ */

  function initDriver(params) {
    const u = requireAuth();
    if (!u) return;

    document.getElementById('driverLogoutBtn')?.addEventListener('click', logout);
    document.getElementById('driverMenuToggle')?.addEventListener('click', openDrawer);

    const isAdm = isAdmin(u.role);
    const driverId = params?.driverId;

    // Mock driver data
    const driverData = {
      id: driverId || 'driver-1',
      name: driverId ? 'Carlos López' : (u.displayName || 'Conductor'),
      email: 'carlos@email.com',
      vehicle: 'Nissan Versa',
      active: true,
      earnings: 12480,
      trips: 142,
      rating: 4.8,
      history: [
        { from: 'Av. Reforma 222', to: 'Polanco', date: 'Hoy, 14:30', amount: 185 },
        { from: 'Aeropuerto CDMX', to: 'Santa Fe', date: 'Ayer, 09:15', amount: 420 },
        { from: 'Insurgentes Sur', to: 'Centro', date: '22/06/2026', amount: 95 },
        { from: 'Universidad', to: 'Perisur', date: '20/06/2026', amount: 130 },
      ],
    };

    // If admin viewing a different driver, show that driver's data
    if (isAdm && driverId) {
      // Look up from admin drivers or use mock
      const adminDrivers = state.adminDrivers || [];
      const found = adminDrivers.find(d => d.id === driverId);
      if (found) {
        driverData.name = found.name.split(' - ')[0];
        driverData.vehicle = found.name.split(' - ')[1] || 'Vehículo';
      }
    }

    state._currentDriver = driverData;
    renderDriverPage(driverData, isAdm);
  }

  function renderDriverPage(data, isAdmin) {
document.getElementById('driverAvatar').textContent = data.name.charAt(0).toUpperCase();
    document.getElementById('driverName').textContent = data.name;
    document.getElementById('driverVehicle').textContent = data.vehicle;

    // Update profile card elements
    const avatarProfile = document.getElementById('driverAvatarProfile');
    if (avatarProfile) avatarProfile.textContent = data.name.charAt(0).toUpperCase();
    const vehicleInfo = document.getElementById('driverVehicleInfo');
    if (vehicleInfo) vehicleInfo.textContent = data.vehicle;
    const ratingBar = document.getElementById('driverRatingBar');
    if (ratingBar) ratingBar.style.width = Math.round((data.rating / 5) * 100) + '%';
    const missionBar = document.getElementById('driverMissionBar');
    if (missionBar) {
      const completed = Math.min(data.trips, 5);
      missionBar.style.width = Math.round((completed / 5) * 100) + '%';
    }
    const missionCount = document.getElementById('driverMissionCount');
    if (missionCount) {
      const completed = Math.min(data.trips % 5 + 2, 5);
      missionCount.textContent = completed + '/5';
    }
    document.getElementById('driverEarnings').textContent = `$${data.earnings.toLocaleString()}`;
    document.getElementById('driverTrips').textContent = data.trips;
    document.getElementById('driverRating').textContent = `${data.rating} ★`;

    // Status toggle
    const statusBtn = document.getElementById('driverStatusBtn');
    const statusDot = document.getElementById('driverStatusDot');
    const statusText = document.getElementById('driverStatusText');
    const updateStatus = (active) => {
      data.active = active;
      statusDot.style.background = active ? 'var(--success)' : 'var(--text-muted)';
      statusText.textContent = active ? 'Activo' : 'Inactivo';
      statusBtn.style.borderColor = active ? 'rgba(16,185,129,0.3)' : 'var(--border)';
    };
    updateStatus(data.active);

    // If admin viewing another driver, disable the toggle
    if (isAdmin) {
      statusBtn.style.opacity = '0.6';
      statusBtn.style.cursor = 'default';
    } else {
      statusBtn.addEventListener('click', () => updateStatus(!data.active));
    }

    // Trip history
    const list = document.getElementById('driverTripList');
    if (data.history && data.history.length > 0) {
      list.innerHTML = data.history.map(t => `
        <div class="driver-trip-row">
          <div class="dtrip-left">
            <div class="dtrip-icon">${ICONS.car}</div>
            <div>
              <p class="dtrip-route">${t.from} → ${t.to}</p>
              <span class="dtrip-date">${t.date}</span>
            </div>
          </div>
          <div class="dtrip-right">
            <strong>$${t.amount}</strong>
          </div>
        </div>
      `).join('');
    } else {
      list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px">Sin viajes registrados</p>';
    }

    // Edit form - prefill
    if (!isAdmin) {
      document.getElementById('editDriverName').value = data.name;
      document.getElementById('editDriverEmail').value = data.email;
      document.getElementById('editDriverVehicle').value = data.vehicle;
    } else {
      // Hide edit form for admin viewing
      document.querySelector('.driver-edit-form').innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:16px">Vista de solo lectura</p>';
    }

    document.getElementById('saveDriverInfo')?.addEventListener('click', function () {
      const newName = document.getElementById('editDriverName').value.trim();
      const newEmail = document.getElementById('editDriverEmail').value.trim();
      const newVehicle = document.getElementById('editDriverVehicle').value.trim();

      if (!newName || !newEmail || !newVehicle) return;

      data.name = newName;
      data.email = newEmail;
      data.vehicle = newVehicle;

      document.getElementById('driverName').textContent = data.name;
      document.getElementById('driverVehicle').textContent = data.vehicle;
      document.getElementById('driverAvatar').textContent = data.name.charAt(0).toUpperCase();
    });
  }

  /* ══════════════════════════════════════════════════
     TRANSFER PAGE — MAP + PANEL
     ══════════════════════════════════════════════════ */

  function initTransfer() {
    if (!requireAuth()) return;

    // Reset state for fresh flow
    if (!state.pickup && !state.destination) {
      state.mapMode = 'pickup';
    }

    setupTransferMap();
    setupTransferPanel();
    updateTransferUI();
  }

  function divIcon(html, w, h, aw, ah) {
    return L.divIcon({ className: '', html, iconSize: [w, h], iconAnchor: [aw || w / 2, ah || h], popupAnchor: [0, -(ah || h)] });
  }

  function circleIcon(html, size, anchor) {
    return divIcon(html, size, size, anchor || size / 2, anchor || size / 2);
  }

  const PICKUP_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="8"/></svg>';
  const DEST_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  const DRIVER_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/></svg>';

  const PICKUP_ICON = circleIcon(`<div style="width:28px;height:28px;background:#FF6B4A;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3),0 0 12px rgba(255,107,74,0.3)">${PICKUP_SVG}</div>`, 28);
  const DEST_ICON = circleIcon(`<div style="width:28px;height:28px;background:#FF6B4A;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3),0 0 12px rgba(255,107,74,0.3)">${DEST_SVG}</div>`, 28);
  const DRIVER_ICON = circleIcon(`<div style="width:26px;height:26px;background:#00F2C2;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25),0 0 10px rgba(0,242,194,0.3)">${DRIVER_SVG}</div>`, 26);

  function setupTransferMap() {
    const container = document.getElementById('transfer-map');
    if (!container || state.map) return;

    state.map = L.map(container, { center: [10.4059, -67.2910], zoom: 15, zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(state.map);

    function updateOsmLink() {
      const osmLink = document.querySelector('.map-open-osm');
      if (!osmLink || !state.map) return;
      const c = state.map.getCenter();
      const z = state.map.getZoom();
      osmLink.href = `https://www.openstreetmap.org/#map=${z}/${c.lat.toFixed(4)}/${c.lng.toFixed(4)}`;
    }
    state.map.on('moveend', updateOsmLink);
    state.map.on('zoomend', updateOsmLink);
    updateOsmLink();

    state.map.on('click', async function (e) {
      const ll = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (state.mapMode === 'pickup') {
        state.pickup = ll;
        state.drivers = generateDrivers(ll, 5);
        state.mapMode = state.destination ? 'view' : 'destination';
        await updateTransferMarkers();
        updateTransferUI();
      } else if (state.mapMode === 'destination') {
        state.destination = ll;
        state.mapMode = 'view';
        await updateTransferMarkers();
        updateTransferUI();
      }
    });

    state._poiMarkers = [];

    if (state.pickup || state.destination) { updateTransferMarkers(); }
  }

  function clearMarkers() {
    if (state.pickupMarker) { state.map.removeLayer(state.pickupMarker); state.pickupMarker = null; }
    if (state.destMarker) { state.map.removeLayer(state.destMarker); state.destMarker = null; }
    if (state.circle) { state.map.removeLayer(state.circle); state.circle = null; }
    state.routeLines.forEach(l => state.map.removeLayer(l));
    state.routeLines = [];
    state.driverMarkers.forEach(m => state.map.removeLayer(m));
    state.driverMarkers = [];
  }

  async function updateTransferMarkers() {
    if (!state.map) return;
    clearMarkers();

    // Pickup marker
    if (state.pickup) {
      state.pickupMarker = L.marker([state.pickup.lat, state.pickup.lng], { icon: PICKUP_ICON, draggable: true }).addTo(state.map);
      state.pickupMarker.bindPopup('<div style="text-align:center"><strong style="font-size:14px">Punto de Recogida</strong><br><span style="font-size:11px;color:#94a3b8">Arrástrame para ajustar</span></div>');
      state.pickupMarker.on('dragend', async function () {
        const pos = this.getLatLng();
        state.pickup = { lat: pos.lat, lng: pos.lng };
        state.drivers = generateDrivers(state.pickup, 5);
        await updateTransferMarkers();
        updateTransferUI();
      });

      if (!state.destination) {
        state.circle = L.circle([state.pickup.lat, state.pickup.lng], { radius: 1200, color: '#00F2C2', weight: 1, opacity: 0.2, fillOpacity: 0.05 }).addTo(state.map);
      }
    }

    // Destination marker
    if (state.destination) {
      state.destMarker = L.marker([state.destination.lat, state.destination.lng], { icon: DEST_ICON, draggable: true }).addTo(state.map);
      state.destMarker.bindPopup('<div style="text-align:center"><strong style="font-size:14px">Destino</strong><br><span style="font-size:11px;color:#94a3b8">Arrástrame para ajustar</span></div>');
      state.destMarker.on('dragend', async function () {
        const pos = this.getLatLng();
        state.destination = { lat: pos.lat, lng: pos.lng };
        await updateTransferMarkers();
        updateTransferUI();
      });
    }

    // Route line — fetch real road route via OSRM
    if (state.pickup && state.destination) {
      const routeData = await fetchRoute(state.pickup, state.destination);
      if (routeData) {
        state.routeData = routeData;
        state.routeLines.push(L.polyline(routeData.coords, { color: '#00F2C2', weight: 13, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }).addTo(state.map));
        state.routeLines.push(L.polyline(routeData.coords, { color: '#00F2C2', weight: 7, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(state.map));
        state.routeLines.push(L.polyline(routeData.coords, { color: '#33ffd8', weight: 3, opacity: 0.4, lineCap: 'round', lineJoin: 'round' }).addTo(state.map));
        const bounds = L.latLngBounds(routeData.coords);
        state.map.fitBounds(bounds, { padding: [80, 80] });
      } else {
        state.routeData = null;
        const fallback = [[state.pickup.lat, state.pickup.lng], [state.destination.lat, state.destination.lng]];
        state.routeLines.push(L.polyline(fallback, { color: '#00F2C2', weight: 7, opacity: 0.95, lineCap: 'round', lineJoin: 'round', dashArray: '8,6' }).addTo(state.map));
        const bounds = L.latLngBounds([state.pickup.lat, state.pickup.lng], [state.destination.lat, state.destination.lng]);
        state.map.fitBounds(bounds, { padding: [80, 80] });
      }
    } else if (state.pickup) {
      state.routeData = null;
      state.map.setView([state.pickup.lat, state.pickup.lng], 14);
    }

    // Driver markers
    state.drivers.forEach(d => {
      const m = L.marker([d.lat, d.lng], { icon: DRIVER_ICON }).addTo(state.map);
      m.bindPopup(`<div style="text-align:center;min-width:130px"><strong style="font-size:14px">${d.name}</strong><br><span style="font-size:12px;color:#94a3b8">${d.vehicle}</span><br><span style="font-size:11px;color:#00F2C2">● Disponible</span><br><span style="font-size:11px;color:#64748b">Llega en ${d.eta}</span></div>`);
      state.driverMarkers.push(m);
    });
  }

  function updateTransferUI() {
    const panel = document.querySelector('.transfer-panel');
    if (!panel) return;
    const scroll = panel.querySelector('.panel-scroll');
    if (!scroll) return;

    state._updateCursor?.();

    const hasPickup = !!state.pickup;
    const hasDest = !!state.destination;
    const hasRoute = hasPickup && hasDest;
    const distance = hasRoute && state.routeData ? state.routeData.distance : (hasRoute ? calcDistance(state.pickup, state.destination) : 0);

    const vehicles = [
      { id: 'moto', name: 'Moto', category: 'Scooter', capacity: 1, pricePerKm: 1, basePrice: 0, eta: '2 min', color: 'emerald' },
      { id: 'carro', name: 'Carro', category: 'Sedan', capacity: 4, pricePerKm: 1.5, basePrice: 0, eta: '4 min', color: 'blue' },
    ];

    const selV = vehicles.find(v => v.id === state.selectedVehicle) || vehicles[0];
    const minFare = selV.id === 'carro' ? 1.5 : 1;
    const price = hasRoute ? Math.max(selV.basePrice + distance * selV.pricePerKm, minFare) : 0;

    // Metrics panel + vehicle selector update
    const metricsPanel = document.getElementById('metricsPanel');
    const mpVehicles = document.getElementById('mpVehicles');
    const mpCancel = document.getElementById('mpCancel');
    if (metricsPanel) {
      if (hasRoute) {
        metricsPanel.style.display = '';
        if (mpVehicles) mpVehicles.style.display = '';
        if (mpCancel) mpCancel.style.display = '';
        const km = distance;
        const time = state.routeData ? `${Math.floor(state.routeData.duration / 60)} min` : `${Math.floor(distance * 3 + 2)} min`;
        const motoPrice = Math.max(km, 1);
        const carroPrice = Math.max(km * 1.5, 1.5);
        const priceUsd = state.selectedVehicle === 'moto' ? motoPrice : carroPrice;
        fetchExchangeRate().then(rate => {
          const priceVes = (priceUsd * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          document.getElementById('mpVesAmount').textContent = `Bs. ${priceVes}`;
        });
        document.getElementById('mpKm').textContent = km.toFixed(1);
        document.getElementById('mpPrice').textContent = `$${priceUsd.toFixed(2)}`;
        document.getElementById('mpTime').textContent = time;
        document.getElementById('mpPriceMoto').textContent = `$${motoPrice.toFixed(2)}`;
        document.getElementById('mpPriceCarro').textContent = `$${carroPrice.toFixed(2)}`;
      } else {
        metricsPanel.style.display = 'none';
        if (mpVehicles) mpVehicles.style.display = 'none';
        if (mpCancel) mpCancel.style.display = 'none';
      }
    }

    // Panel content
    const vehicleOptions = vehicles.map(v => {
      const sel = state.selectedVehicle === v.id;
      const p = Math.max(v.basePrice + distance * v.pricePerKm, v.id === 'carro' ? 1.5 : 1);
      return `<button class="vehicle-option ${sel ? 'selected' : ''}" data-id="${v.id}">
        <div class="v-head">
          <div class="v-icon">${ICONS.car}</div>
          <span class="v-name">${v.name}</span>
          <span class="v-price ${v.color}">$${p.toFixed(2)}</span>
        </div>
        <div class="v-sub">${v.category} · ${v.capacity} pers · ${v.eta}</div>
      </button>`;
    }).join('');

    scroll.innerHTML = `
      <div class="panel-header">
        <h2>Solicitar Traslado</h2>
        <p>${hasRoute ? 'Confirma los detalles de tu viaje' : 'Indícanos tu recorrido'}</p>
      </div>

      <div class="location-group">
        <label>Origen</label>
        <div class="search-location-wrap">
          <input class="location-search" id="pickupSearch" type="text" placeholder="Buscar dirección de recogida..." ${hasPickup ? `value="${state._pickupLabel || ''}"` : ''}>
          <div class="search-results" id="pickupResults"></div>
        </div>
        ${!hasPickup ? `<div class="quick-stops"><span class="qs-title">📍 Atractivos turísticos:</span>${COLONIA_TOVAR_STOPS.map((s, i) => `<button class="qs-btn qs-stop" data-idx="${i}" data-list="stop" data-type="pickup">${s.name}</button>`).join('')}</div><div class="quick-stops"><span class="qs-title">🍽️ Restaurantes:</span>${COLONIA_RESTAURANTS.map((s, i) => `<button class="qs-btn qs-rest" data-idx="${i}" data-list="rest" data-type="pickup">${s.name}</button>`).join('')}</div><div class="quick-stops"><span class="qs-title">🏨 Hoteles:</span>${COLONIA_HOTELS.map((s, i) => `<button class="qs-btn qs-hotel" data-idx="${i}" data-list="hotel" data-type="pickup">${s.name}</button>`).join('')}</div>` : ''}
        <label style="margin-top:8px">O en el mapa ${!hasPickup ? `<button class="pickupSelectBtn" style="color:#00F2C2;font:inherit">${ICONS.crosshair} Señalar</button>` : ''}</label>
        <div class="location-btn ${hasPickup ? 'set' : ''}" id="pickupBtn">
          <div class="dot blue"></div>
          ${hasPickup ? (state._pickupLabel || 'Ubicación seleccionada') : 'Clic para seleccionar'}
          ${hasPickup ? `<span class="loc-icon blue">${ICONS.mapPin}</span>` : ''}
        </div>
      </div>

      <div class="location-group">
        <label>Destino</label>
        <div class="search-location-wrap">
          <input class="location-search" id="destSearch" type="text" placeholder="Buscar dirección de destino..." ${hasDest ? `value="${state._destLabel || ''}"` : ''}>
          <div class="search-results" id="destResults"></div>
        </div>
        ${hasPickup && !hasDest ? `<div class="quick-stops"><span class="qs-title">📍 Atractivos turísticos:</span>${COLONIA_TOVAR_STOPS.map((s, i) => `<button class="qs-btn qs-stop" data-idx="${i}" data-list="stop" data-type="dest">${s.name}</button>`).join('')}</div><div class="quick-stops"><span class="qs-title">🍽️ Restaurantes:</span>${COLONIA_RESTAURANTS.map((s, i) => `<button class="qs-btn qs-rest" data-idx="${i}" data-list="rest" data-type="dest">${s.name}</button>`).join('')}</div><div class="quick-stops"><span class="qs-title">🏨 Hoteles:</span>${COLONIA_HOTELS.map((s, i) => `<button class="qs-btn qs-hotel" data-idx="${i}" data-list="hotel" data-type="dest">${s.name}</button>`).join('')}</div>` : ''}
        ${hasPickup ? `<label style="margin-top:8px">O en el mapa ${!hasDest ? `<button class="destSelectBtn" style="color:#FF6B4A;font:inherit">${ICONS.crosshair} Señalar</button>` : ''}</label>` : ''}
        <div class="location-btn ${hasDest ? 'set' : ''}" id="destBtn">
          <div class="dot red"></div>
          ${hasDest ? (state._destLabel || 'Ubicación seleccionada') : (hasPickup ? 'Clic para seleccionar' : 'Primero selecciona origen')}
          ${hasDest ? `<span class="loc-icon red">${ICONS.mapPin}</span>` : ''}
        </div>
      </div>

      ${hasRoute ? `<button class="swap-btn">${ICONS.refresh} Intercambiar direcciones</button>` : ''}

      ${hasRoute ? `
      <div style="margin-bottom:16px">
        <label style="display:block;font-size:11px;font-weight:500;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Tipo de Vehículo</label>
        <div class="vehicle-grid">${vehicleOptions}</div>
      </div>

      <div class="price-box">
        <div class="price-row"><span class="label">Tarifa base</span><span class="value">$${selV.basePrice}</span></div>
        <div class="price-row"><span class="label">Distancia (${distance.toFixed(1)} km × $${selV.pricePerKm}/km)</span><span class="value">$${Math.max(distance * selV.pricePerKm, selV.id === 'carro' ? 1.5 : 1).toFixed(2)}</span></div>
        <div class="price-total">
          <span class="label">Total estimado</span>
          <div class="total-right">
            <div class="total-value">$${price.toLocaleString()}</div>
            <div class="total-note">Tarifa fija, sin sorpresas</div>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-block" id="confirmTransfer">${ICONS.arrowRight} Confirmar Viaje</button>
      ` : `
      <div class="panel-hint">
        ${!hasPickup
          ? 'Haz clic en "Seleccionar en mapa" o directamente en el mapa para indicar tu recogida'
          : 'Ahora selecciona tu destino en el mapa'}
      </div>`}
    `;

    // Event listeners
    scroll.querySelector('.pickupSelectBtn')?.addEventListener('click', () => {
      state.mapMode = 'pickup';
      updateTransferUI();
      if (state.map) document.getElementById('transfer-map').style.cursor = 'crosshair';
    });

    scroll.querySelector('.destSelectBtn')?.addEventListener('click', () => {
      state.mapMode = 'destination';
      updateTransferUI();
      if (state.map) document.getElementById('transfer-map').style.cursor = 'crosshair';
    });

    scroll.querySelector('#pickupBtn')?.addEventListener('click', () => {
      if (!hasPickup) {
        state.mapMode = 'pickup';
        updateTransferUI();
      }
    });

    scroll.querySelector('#destBtn')?.addEventListener('click', () => {
      if (hasPickup && !hasDest) {
        state.mapMode = 'destination';
        updateTransferUI();
      }
    });

    scroll.querySelector('.swap-btn')?.addEventListener('click', async () => {
      const tmp = state.pickup;
      state.pickup = state.destination;
      state.destination = tmp;
      await updateTransferMarkers();
      updateTransferUI();
    });

    scroll.querySelectorAll('.vehicle-option').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedVehicle = btn.dataset.id;
        updateTransferUI();
      });
    });

    // Quick stops (Colonia Tovar)
    const POI_LISTS = { stop: COLONIA_TOVAR_STOPS, rest: COLONIA_RESTAURANTS, hotel: COLONIA_HOTELS };
    scroll.querySelectorAll('.qs-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const idx = parseInt(this.dataset.idx);
        const listKey = this.dataset.list;
        const type = this.dataset.type;
        const list = POI_LISTS[listKey];
        if (!list) return;
        const stop = list[idx];
        if (!stop) return;
        const ll = { lat: stop.lat, lng: stop.lng };
        if (type === 'pickup') {
          state.pickup = ll;
          state._pickupLabel = stop.name;
          state.drivers = generateDrivers(ll, 5);
          state.mapMode = state.destination ? 'view' : 'destination';
        } else {
          state.destination = ll;
          state._destLabel = stop.name;
          state.mapMode = 'view';
        }
        await updateTransferMarkers();
        updateTransferUI();
      });
    });

    // Search geocoding
    ['pickup', 'dest'].forEach(type => {
      const input = scroll.querySelector(`#${type}Search`);
      const resultsEl = scroll.querySelector(`#${type}Results`);
      if (!input || !resultsEl) return;

      input.addEventListener('input', function () {
        clearTimeout(_searchTimeout);
        const q = this.value.trim();
        if (q.length < 3) { resultsEl.innerHTML = ''; resultsEl.classList.remove('open'); return; }
        _searchTimeout = setTimeout(async () => {
          const results = await geocode(q);
          if (results.length === 0) { resultsEl.innerHTML = ''; resultsEl.classList.remove('open'); return; }
          resultsEl.innerHTML = results.map((r, i) =>
            `<div class="sr-item" data-idx="${i}"><span class="sr-label">${r.label}</span><span class="sr-addr">${r.full}</span></div>`
          ).join('');
          resultsEl.classList.add('open');
          resultsEl.querySelectorAll('.sr-item').forEach(el => {
            el.addEventListener('click', async function () {
              const idx = parseInt(this.dataset.idx);
              const res = results[idx];
              if (!res) return;
              if (type === 'pickup') {
                state.pickup = { lat: res.lat, lng: res.lng };
                state._pickupLabel = res.label;
                state.drivers = generateDrivers(state.pickup, 5);
                state.mapMode = state.destination ? 'view' : 'destination';
              } else {
                state.destination = { lat: res.lat, lng: res.lng };
                state._destLabel = res.label;
                state.mapMode = 'view';
              }
              resultsEl.innerHTML = ''; resultsEl.classList.remove('open');
              await updateTransferMarkers();
              updateTransferUI();
            });
          });
        }, 400);
      });

      // Hide results on blur (with delay for click)
      input.addEventListener('blur', () => setTimeout(() => { resultsEl.innerHTML = ''; resultsEl.classList.remove('open'); }, 200));
    });

    scroll.querySelector('#confirmTransfer')?.addEventListener('click', function () {
      this.disabled = true;
      this.innerHTML = '<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto"></div> Buscando conductor...';

      setTimeout(() => {
        showConfirmedPanel(price, distance);
      }, 2000);
    });
  }

  function showConfirmedPanel(price, distance) {
    const panel = document.querySelector('.transfer-panel');
    if (!panel) return;
    const scroll = panel.querySelector('.panel-scroll');
    if (!scroll) return;

    scroll.innerHTML = `
      <div class="confirmed-card">
        <div class="check-circle">
          <div class="check-circle-inner">${ICONS.check}</div>
        </div>
        <h2>¡Viaje Confirmado!</h2>
        <p>Tu conductor está en camino</p>
      </div>
      <div class="confirmed-driver">
        <div class="driver-row">
          <div class="driver-avatar">C</div>
          <div class="driver-info">
            <p>Carlos M.</p>
            <small>Nissan Versa · ABC-123</small>
          </div>
          <div class="driver-rating">
            <span>★</span>
            <span>4.9</span>
          </div>
        </div>
        <div class="driver-detail">
          <div><span class="lbl">Recogida</span><span class="val">Av. Reforma 222</span></div>
          <div><span class="lbl">Destino</span><span class="val">Polanco</span></div>
          <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:8px">
            <span class="lbl total-lbl">Total</span>
            <span class="val total-val">$${price.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div class="confirmed-eta">
        <div class="dot"></div>
        Conductor llegando en 5 min
      </div>
      <button class="btn btn-block" style="border-color:var(--border);color:var(--text-secondary);padding:14px" onclick="alert('Contactando al conductor...')">
        Contactar Conductor
      </button>
    `;

  }

  function setupTransferPanel() {
    const panel = document.querySelector('.transfer-panel');
    if (!panel) return;
    const drag = panel.querySelector('.panel-drag');
    if (drag) {
      drag.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
      });
    }

    // Vehicle selector
    const vBtns = document.querySelectorAll('.mp-v-btn');
    vBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        vBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.selectedVehicle = this.dataset.vehicle;
        if (state.pickup && state.destination) updateTransferUI();
      });
    });

    // Confirm trip — driver search modal
    document.getElementById('mpConfirm')?.addEventListener('click', async function () {
      if (!state.pickup || !state.destination) return;
      const modal = document.getElementById('driverSearchModal');
      const body = document.getElementById('dsmBody');
      const driverEl = document.getElementById('dsmDriver');
      const confirmedEl = document.getElementById('dsmConfirmed');
      modal.style.display = 'flex';
      body.style.display = '';
      driverEl.style.display = 'none';
      confirmedEl.style.display = 'none';
      document.getElementById('dsmTitle').textContent = 'Buscando conductor disponible...';
      document.getElementById('dsmSub').textContent = 'Localizando el conductor más cercano';

      // Simulate search delay
      await new Promise(r => setTimeout(r, 2000));

      // Find nearest driver from generated drivers or adminDrivers
      const drivers = state.drivers.length ? state.drivers : state.adminDrivers;
      let nearest = null, minDist = Infinity;
      drivers.forEach(d => {
        const dist = calcDistance(state.pickup, { lat: d.lat, lng: d.lng });
        if (dist < minDist) { minDist = dist; nearest = d; }
      });
      if (!nearest) {
        nearest = { name: 'Carlos', vehicle: 'Moto', lat: state.pickup.lat + 0.005, lng: state.pickup.lng + 0.005 };
      }

      // Show driver found
      body.style.display = 'none';
      driverEl.style.display = '';
      document.getElementById('dsmDName').textContent = nearest.name;
      document.getElementById('dsmDVehicle').textContent = nearest.vehicle || (state.selectedVehicle === 'moto' ? 'Moto' : 'Carro');
      const driverDist = calcDistance(state.pickup, { lat: nearest.lat, lng: nearest.lng });
      const driverTime = Math.max(Math.round(driverDist * 3 + 1), 2);
      document.getElementById('dsmDDist').textContent = `${driverDist.toFixed(1)} km`;
      document.getElementById('dsmDTime').textContent = `${driverTime} min`;

      // Wait for driver to accept
      await new Promise(resolve => {
        document.getElementById('dsmAccept').onclick = resolve;
      });

      // Show confirmed
      driverEl.style.display = 'none';
      confirmedEl.style.display = '';
      document.getElementById('dsmConfirmedSub').textContent = `${nearest.name} está en camino · ${driverTime} min`;

      // Close
      document.getElementById('dsmClose').onclick = function () {
        modal.style.display = 'none';
      };
    });

    // Cancel trip
    document.getElementById('mpCancel')?.addEventListener('click', async function () {
      state.pickup = null;
      state.destination = null;
      state.routeData = null;
      state.mapMode = 'pickup';
      await updateTransferMarkers();
      updateTransferUI();
    });

    // Update cursor based on mode (called from updateTransferUI)
    const mapContainer = document.getElementById('transfer-map');
    if (mapContainer) {
      const updateCursor = () => {
        mapContainer.style.cursor = state.mapMode !== 'view' ? 'crosshair' : 'grab';
      };
      updateCursor();
      // Expose for external calls
      state._updateCursor = updateCursor;
    }
  }

  /* ══════════════════════════════════════════════════
     ADMIN PAGE
     ══════════════════════════════════════════════════ */

  function initAdmin() {
    if (!requireAdmin()) return;

    document.getElementById('adminLogoutBtn')?.addEventListener('click', logout);
    document.getElementById('adminMenuToggle')?.addEventListener('click', openDrawer);

    setupAdminMap();
    setupAdminTable();
    setupAdminDriverForm();
    setupAdminLocals();
  }

  function setupAdminDriverForm() {
    const toggle = document.getElementById('addDriverToggle');
    const form = document.getElementById('adminDriverForm');
    if (!toggle || !form) return;

    toggle.addEventListener('click', () => form.classList.toggle('hidden'));

    document.getElementById('addDriverBtn')?.addEventListener('click', function () {
      const form = document.getElementById('adminDriverForm');
      const name = form.querySelector('#driverName').value.trim();
      const email = form.querySelector('#driverEmail').value.trim();
      const vehicle = form.querySelector('#driverVehicle').value.trim();

      if (!name || !email || !vehicle) return;

      // Add to admin drivers list
      const lat = 10.403 + Math.random() * 0.012;
      const lng = -67.296 + Math.random() * 0.012;
      const newDriver = {
        id: 'd-' + Date.now(),
        lat, lng,
        name: name + ' - ' + vehicle,
      };

      const drivers = state.adminDrivers;
      drivers.push(newDriver);

      const driverIcon = L.divIcon({
        className: '',
        html: `<div><div style="width:28px;height:28px;background:#00F2C2;border:2.5px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(0,242,194,0.3)">${DRIVER_SVG}</div></div>`,
        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
      });
      L.marker([newDriver.lat, newDriver.lng], { icon: driverIcon })
        .addTo(state.adminMap)
        .bindPopup(`<div style="text-align:center"><strong>${newDriver.name}</strong><br><span style="color:#00F2C2;font-size:12px">● Disponible</span></div>`);

      // Update driver list
      const list = document.querySelector('.admin-drivers-list');
      if (list) {
        list.innerHTML = drivers.map(d => `
          <div class="d-row" style="cursor:pointer" onclick="window.location.hash='driver?driverId=${d.id}'">
            <div class="d-left"><div class="d-dot"></div><span class="d-name">${d.name}</span></div>
            <span class="d-status">Disponible</span>
          </div>
        `).join('');
      }

      // Clear form
      form.querySelector('#driverName').value = '';
      form.querySelector('#driverEmail').value = '';
      form.querySelector('#driverVehicle').value = '';
      form.classList.add('hidden');
    });
  }

  function setupAdminTable() {
    const input = document.getElementById('adminSearch');
    const tbody = document.getElementById('adminTableBody');
    if (!input || !tbody) return;

    const isSuper = state.user.role === 'super_admin';

    const users = [
      { id: 'u1', name: 'Carlos López', email: 'carlos@email.com', role: 'Conductor', status: 'Activo', trips: 142, rating: 4.8 },
      { id: 'u2', name: 'María García', email: 'maria@email.com', role: 'Cliente', status: 'Activo', trips: 38, rating: 5.0 },
      { id: 'u3', name: 'Juan Pérez', email: 'juan@email.com', role: 'Conductor', status: 'Activo', trips: 89, rating: 4.6 },
      { id: 'u4', name: 'Ana Martínez', email: 'ana@email.com', role: 'Cliente', status: 'Inactivo', trips: 12, rating: 4.2 },
      { id: 'u5', name: 'Roberto Sánchez', email: 'roberto@email.com', role: 'Conductor', status: 'Activo', trips: 215, rating: 4.9 },
    ];

    const roleOptions = ['Cliente', 'Conductor', 'admin', 'super_admin'];

    function renderTable(filter) {
      const filtered = users.filter(u =>
        u.name.toLowerCase().includes((filter || '').toLowerCase())
      );
      tbody.innerHTML = filtered.map(u => {
        const icon = u.role === 'Conductor' || u.role === 'admin' || u.role === 'super_admin' ? ICONS.shield : ICONS.user;
        const iconClass = u.role === 'Conductor' || u.role === 'admin' || u.role === 'super_admin' ? 'driver-icon' : 'client-icon';
        return `
        <tr class="admin-tr" data-driver="${u.role === 'Conductor' ? u.name : ''}">
          <td>
            <div class="admin-user">
              <div class="avatar">${u.name.charAt(0)}</div>
              <div>
                <span class="u-name">${u.name}</span>
                <span class="u-email">${u.email}</span>
              </div>
            </div>
          </td>
          <td><div class="admin-role"><span class="${iconClass}">${icon}</span>${isSuper ? `<div class="role-picker" data-user-id="${u.id}"><button class="role-picker-btn">${u.role}<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path d="M0 0l5 6 5-6z" fill="currentColor"/></svg></button></div>` : `<span>${u.role}</span>`}</div></td>
          <td>${u.role === 'Conductor' ? `<button class="status-toggle-btn ${u.status === 'Activo' ? 'active' : 'inactive'}" data-user-id="${u.id}"><span class="status-toggle-dot"></span>${u.status}</button>` : `<span class="admin-status-badge ${u.status === 'Activo' ? 'active' : 'inactive'}">${u.status}</span>`}</td>
          <td style="color:var(--text-secondary)">${u.trips}</td>
          <td><div class="admin-rating"><span class="star">★</span><span class="r-value">${u.rating}</span></div></td>
          <td>${u.role === 'Conductor' ? `<button class="admin-more driver-view-btn" data-name="${u.name}">${ICONS.eye}</button>` : '<button class="admin-more">' + ICONS.moreH + '</button>'}</td>
        </tr>`;
      }).join('');

      // Custom role picker setup
      if (isSuper) {
        tbody.querySelectorAll('.role-picker').forEach(picker => {
          const btn = picker.querySelector('.role-picker-btn');
          const userId = picker.dataset.userId;

          function closePicker() { picker.querySelector('.role-picker-dropdown')?.remove(); }

          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            closePicker();
            const existing = picker.querySelector('.role-picker-dropdown');
            if (existing) { existing.remove(); return; }

            const user = users.find(u => u.id === userId);
            if (!user) return;
            const dd = document.createElement('div');
            dd.className = 'role-picker-dropdown';
            dd.addEventListener('click', e => e.stopPropagation());
            roleOptions.forEach(r => {
              const opt = document.createElement('div');
              opt.className = 'role-picker-option' + (r === user.role ? ' active' : '');
              opt.textContent = r;
              opt.addEventListener('click', function () {
                user.role = r;
                renderTable(input.value);
              });
              dd.appendChild(opt);
            });
            picker.appendChild(dd);
          });
        });

        // Close pickers on outside click
        document.addEventListener('click', () => {
          tbody.querySelectorAll('.role-picker-dropdown').forEach(d => d.remove());
        }, { passive: true });
      }

      // Status toggle for conductors
      tbody.querySelectorAll('.status-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          const userId = this.dataset.userId;
          const user = users.find(u => u.id === userId);
          if (!user) return;
          user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
          renderTable(input.value);
        });
      });

      // Row click → driver view
      tbody.querySelectorAll('.admin-tr').forEach(tr => {
        tr.addEventListener('click', function (e) {
          if (e.target.closest('.role-picker, .driver-view-btn, .status-toggle-btn')) return;
          const name = this.dataset.driver;
          if (name) window.location.hash = `driver?driverId=${encodeURIComponent(name)}`;
        });
      });
    }

    renderTable('');

    input.addEventListener('input', function () {
      renderTable(this.value);
    });
  }

  function setupAdminMap() {
    const container = document.getElementById('admin-fleet-map');
    if (!container || state.adminMap) return;
    state.adminMap = L.map(container, { center: [10.4059, -67.2910], zoom: 15, zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(state.adminMap);

    function updateAdminOsmLink() {
      const osmLink = document.querySelector('.admin-osm-link .map-open-osm');
      if (!osmLink || !state.adminMap) return;
      const c = state.adminMap.getCenter();
      const z = state.adminMap.getZoom();
      osmLink.href = `https://www.openstreetmap.org/#map=${z}/${c.lat.toFixed(4)}/${c.lng.toFixed(4)}`;
    }
    state.adminMap.on('moveend', updateAdminOsmLink);
    state.adminMap.on('zoomend', updateAdminOsmLink);
    updateAdminOsmLink();

    state.adminDrivers = [
      { id: '1', lat: 10.4059, lng: -67.2910, name: 'Carlos - Nissan Versa' },
      { id: '2', lat: 10.4030, lng: -67.2940, name: 'María - Toyota Corolla' },
      { id: '3', lat: 10.4080, lng: -67.2880, name: 'Pedro - SUV Premium' },
      { id: '4', lat: 10.4060, lng: -67.2960, name: 'Luis - Moto' },
      { id: '5', lat: 10.4100, lng: -67.2850, name: 'Ana - Van' },
    ];

    const driverIcon = L.divIcon({
      className: '',
      html: `<div><div style="width:28px;height:28px;background:#00F2C2;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25),0 0 10px rgba(0,242,194,0.3)">${DRIVER_SVG}</div></div>`,
      iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -13],
    });

    state.adminDrivers.forEach(d => {
      L.marker([d.lat, d.lng], { icon: driverIcon })
        .addTo(state.adminMap)
        .bindPopup(`<div style="text-align:center"><strong>${d.name}</strong><br><span style="color:#00F2C2;font-size:12px">● Disponible</span></div>`);
    });

    // Driver list
    const list = document.querySelector('.admin-drivers-list');
    if (list) {
      list.innerHTML = state.adminDrivers.map(d => `
        <div class="d-row" style="cursor:pointer" onclick="window.location.hash='driver?driverId=${d.id}'">
          <div class="d-left"><div class="d-dot"></div><span class="d-name">${d.name}</span></div>
          <span class="d-status">Disponible</span>
        </div>
      `).join('');
    }
  }

  /* ══════════════════════════════════════════════════
     PASEOS & COMIDA
     ══════════════════════════════════════════════════ */

  const TOUR_OPERATORS = [
    {
      id: 'to1', name: 'Aventuras Tovar', owner: 'Luis Hernández',
      desc: 'Operador turístico especializado en senderismo y tours ecológicos por la montaña.',
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
      tags: ['Aventura', 'Senderismo', 'Ecoturismo'],
      plans: [
        { name: 'Tour Mirador', desc: 'Recorrido al mirador principal con vista panorámica', stops: [
          { name: 'Plaza Bolívar', lat: 10.4086, lng: -67.2910 },
          { name: 'Mirador El Alemán', lat: 10.4105, lng: -67.2850 },
          { name: 'Café Montaña', lat: 10.4095, lng: -67.2870 },
          { name: 'Mirador Principal', lat: 10.4120, lng: -67.2830 }
        ], price: 15 },
        { name: 'Ruta del Café', desc: 'Conoce el proceso del café colombiano de la región', stops: [
          { name: 'Finca Café Tovar', lat: 10.4060, lng: -67.2930 },
          { name: 'Mirador Los Pájaros', lat: 10.4080, lng: -67.2890 },
          { name: 'Cafetería Artesanal', lat: 10.4075, lng: -67.2905 }
        ], price: 20 },
        { name: 'Full Day Aventura', desc: 'Día completo de actividades al aire libre', stops: [
          { name: 'Plaza Bolívar', lat: 10.4086, lng: -67.2910 },
          { name: 'Sendero El Río', lat: 10.4040, lng: -67.2950 },
          { name: 'Piscina Natural', lat: 10.4030, lng: -67.2960 },
          { name: 'Mirador Sunset', lat: 10.4110, lng: -67.2840 },
          { name: 'Restaurant', lat: 10.4090, lng: -67.2880 }
        ], price: 45 },
      ]
    },
    {
      id: 'to2', name: 'Colonia Tours', owner: 'María García',
      desc: 'Tours culturales y gastronómicos para conocer la historia de Colonia Tovar.',
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
      tags: ['Cultural', 'Gastronómico', 'Historia'],
      plans: [
        { name: 'Historia y Tradiciones', desc: 'Tour por los puntos históricos del pueblo', stops: [
          { name: 'Museo Colonial', lat: 10.4088, lng: -67.2915 },
          { name: 'Iglesia Principal', lat: 10.4085, lng: -67.2912 },
          { name: 'Plaza Central', lat: 10.4082, lng: -67.2908 },
          { name: 'Casa de la Cultura', lat: 10.4090, lng: -67.2905 }
        ], price: 12 },
        { name: 'Ruta Gastronómica', desc: 'Degusta los mejores platos de la zona', stops: [
          { name: 'Restaurante El Alemán', lat: 10.4092, lng: -67.2900 },
          { name: 'Pizzería Colonia', lat: 10.4078, lng: -67.2918 },
          { name: 'Heladería Artesanal', lat: 10.4080, lng: -67.2910 },
          { name: 'Café Central', lat: 10.4086, lng: -67.2910 }
        ], price: 25 },
      ]
    },
    {
      id: 'to3', name: 'Montaña Express', owner: 'Pedro Rodríguez',
      desc: 'Servicio rápido de traslados turísticos con vehículos 4x4 y guías certificados.',
      img: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=600&h=400&fit=crop',
      tags: ['Off-road', '4x4', 'Rápido'],
      plans: [
        { name: 'Paseo Express', desc: 'Recorrido rápido por los puntos principales', stops: [
          { name: 'Entrada del Pueblo', lat: 10.4070, lng: -67.2935 },
          { name: 'Mirador Rápido', lat: 10.4100, lng: -67.2860 },
          { name: 'Punto Fotográfico', lat: 10.4115, lng: -67.2845 }
        ], price: 10 },
        { name: 'Aventura 4x4', desc: 'Recorrido off-road por caminos de montaña', stops: [
          { name: 'Base Camp', lat: 10.4050, lng: -67.2945 },
          { name: 'Río Seco', lat: 10.4020, lng: -67.2970 },
          { name: 'Cumbre Norte', lat: 10.4130, lng: -67.2820 },
          { name: 'Valle Verde', lat: 10.4010, lng: -67.2980 }
        ], price: 35 },
        { name: 'Atardecer VIP', desc: 'Disfruta del atardecer con cena incluida', stops: [
          { name: 'Mirador Sunset', lat: 10.4110, lng: -67.2840 },
          { name: 'Restaurant Premium', lat: 10.4105, lng: -67.2835 },
          { name: 'Punto Estrellas', lat: 10.4125, lng: -67.2810 }
        ], price: 50 },
      ]
    }
  ];

  const RESTAURANTS = [
    {
      id: 'r1', name: 'Restaurant El Alemán', owner: 'Hans Müller', category: 'parrilla',
      desc: 'Auténtica comida alemana y parrilla con ingredientes frescos de la región.',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
      tags: ['Parrilla', 'Alemán', 'Familiar'],
      menu: [
        { name: 'Chorizo Tovar', desc: 'Chorizo artesanal con yuca y ensalada', price: 8, img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=200&fit=crop' },
        { name: 'Costillas BBQ', desc: 'Costillas de cerdo con salsa barbecue casera', price: 15, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop' },
        { name: 'Schnitzel', desc: 'Milanesa alemana con papas y ensalada', price: 12, img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop' },
        { name: 'Sopa del Día', desc: 'Sopa fresca preparada diariamente', price: 5, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop' },
      ]
    },
    {
      id: 'r2', name: 'La Casa de la Abuela', owner: 'Rosa Pérez', category: 'venezolana',
      desc: 'Comida típica venezolana con recetas heredadas de generación en generación.',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
      tags: ['Típica', 'Venezolana', 'Casera'],
      menu: [
        { name: 'Pabellón Criollo', desc: 'Arroz, caraotas, carne mechada y plátano', price: 10, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop' },
        { name: 'Arepas Reinas', desc: 'Arepas rellenas de queso de mano', price: 6, img: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=200&fit=crop' },
        { name: 'Hallaquita', desc: 'Tamal dulce con carne y aceitunas', price: 7, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=200&fit=crop' },
        { name: 'Café con Leche', desc: 'Café tinto con leche caliente', price: 3, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop' },
      ]
    },
    {
      id: 'r3', name: 'Pizzería Colonia', owner: 'Marco Rossi', category: 'italiana',
      desc: 'Pizzas artesanales al horno de leña con masa fermentada 48 horas.',
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
      tags: ['Pizza', 'Italiana', 'Horno de Leña'],
      menu: [
        { name: 'Margherita', desc: 'Tomate, mozzarella, albahaca fresca', price: 9, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop' },
        { name: 'Cuatro Quesos', desc: 'Mozzarella, gorgonzola, parmesano, provolone', price: 11, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop' },
        { name: 'Pepperoni', desc: 'Doble capa de pepperoni con queso derretido', price: 10, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop' },
        { name: 'Napolitana', desc: 'Tomate, anchoas, alcaparras, aceitunas', price: 12, img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=200&fit=crop' },
      ]
    },
    {
      id: 'r4', name: 'El Viejo Molino', owner: 'Carlos Méndez', category: 'comida-rapida',
      desc: 'Hamburguesas artesanales y papas fritas con ingredientes premium.',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
      tags: ['Hamburguesas', 'Rápida', 'Papas'],
      menu: [
        { name: 'Classic Burger', desc: 'Carne 200g, lechuga, tomate, queso cheddar', price: 8, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop' },
        { name: 'BBQ Bacon', desc: 'Doble carne, bacon crocante, salsa BBQ', price: 12, img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=200&fit=crop' },
        { name: 'Loaded Fries', desc: 'Papas con queso, bacon y jalapeños', price: 7, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop' },
        { name: 'Milkshake', desc: 'Batido de vainilla, chocolate o fresa', price: 5, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop' },
      ]
    },
    {
      id: 'r5', name: 'Café Mirador', owner: 'Ana López', category: 'cafe',
      desc: 'Café de especialidad con vista al valle. El mejor espacio para relajarse.',
      img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
      tags: ['Café', 'Postres', 'Vista'],
      menu: [
        { name: 'Espresso', desc: 'Café espresso doble shot', price: 3, img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=200&fit=crop' },
        { name: 'Capuchino', desc: 'Espresso con espuma de leche vaporizada', price: 4, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop' },
        { name: 'Tostada con Aguacate', desc: 'Pan integral, aguacate, huevo pochado', price: 7, img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=200&fit=crop' },
        { name: 'Croissant', desc: 'Croissant de mantequilla recién horneado', price: 4, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=200&fit=crop' },
      ]
    },
    {
      id: 'r6', name: 'Taquería El Sol', owner: 'Roberto Díaz', category: 'mexicana',
      desc: 'Tacos, burritos y quesadillas con recetas auténticas mexicanas.',
      img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
      tags: ['Mexicana', 'Tacos', 'Picante'],
      menu: [
        { name: 'Tacos al Pastor', desc: '3 tacos con cerdo, piña, cilantro y cebolla', price: 7, img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop' },
        { name: 'Burrito Grande', desc: 'Tortilla grande rellena de carne y frijoles', price: 9, img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop' },
        { name: 'Quesadilla', desc: 'Queso fundido con chorizo o pollo', price: 6, img: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300&h=200&fit=crop' },
        { name: 'Nachos Supreme', desc: 'Totopos con queso, guacamole y crema', price: 8, img: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop' },
      ]
    }
  ];

  const FOOD_CATEGORIES = [
    { id: 'all', label: 'Todos' },
    { id: 'parrilla', label: 'Parrilla' },
    { id: 'venezolana', label: 'Venezolana' },
    { id: 'italiana', label: 'Italiana' },
    { id: 'comida-rapida', label: 'Comida Rápida' },
    { id: 'cafe', label: 'Cafetería' },
    { id: 'mexicana', label: 'Mexicana' },
  ];

  const PASEO_CATEGORIES = [
    { id: 'all', label: 'Todos' },
    { id: 'aventura', label: 'Nocturno' },
    { id: 'cultural', label: 'Urbano' },
    { id: 'rapido', label: 'Cultura' },
    { id: 'gastro', label: 'Gastronomía' },
  ];

  let _paseoFilter = 'all';
  let _comidaFilter = 'all';

  function initPaseos() {
    if (!requireAuth()) return;
    renderPaseoFilter();
    renderPaseosGrid();
    document.getElementById('paseoFab')?.addEventListener('click', () => {
      const f = document.getElementById('paseoFilter');
      if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function renderPaseoFilter() {
    const el = document.getElementById('paseoFilter');
    if (!el) return;
    el.innerHTML = PASEO_CATEGORIES.map(c =>
      `<button class="filter-chip ${_paseoFilter === c.id ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>`
    ).join('');
    el.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        _paseoFilter = btn.dataset.cat;
        renderPaseoFilter();
        renderPaseosGrid();
      });
    });
  }

  function renderPaseosGrid() {
    const el = document.getElementById('paseosGrid');
    if (!el) return;
    let list = TOUR_OPERATORS;
    if (_paseoFilter !== 'all') {
      list = list.filter(op => op.tags.some(t => t.toLowerCase().includes(_paseoFilter)));
    }
    el.innerHTML = list.map(op => `
      <div class="bento-card" data-id="${op.id}">
        <img class="bento-card-img" src="${op.img}" alt="${op.name}" loading="lazy" onerror="this.style.background='var(--bg-card)';this.alt='Imagen no disponible'">
        <div class="bento-card-body">
          <div class="bento-card-title">${op.name}</div>
          <div class="bento-card-sub">${op.desc}</div>
          <div class="bento-card-tags">${op.tags.map(t => `<span class="bento-tag">${t}</span>`).join('')}</div>
          <div class="bento-card-price">Desde $${Math.min(...op.plans.map(p => p.price))}</div>
        </div>
      </div>
    `).join('');
    el.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = `paseo-detail?id=${card.dataset.id}`;
      });
    });
  }

  let _paseoMap = null;
  let _paseoMarkers = [];

  function initPaseoDetail(params) {
    if (!requireAuth()) return;
    const op = TOUR_OPERATORS.find(o => o.id === params?.id);
    if (!op) { navigate('paseos'); return; }

    document.getElementById('paseoBack')?.addEventListener('click', () => navigate('paseos'));

    const hero = document.getElementById('paseoHero');
    if (hero) {
      hero.innerHTML = `
        <img class="detail-hero-img" src="${op.img}" alt="${op.name}" onerror="this.style.background='var(--bg-card)'">
        <div class="detail-hero-info">
          <h2>${op.name}</h2>
          <p>${op.desc}</p>
          <div class="detail-hero-tags">${op.tags.map(t => `<span class="bento-tag">${t}</span>`).join('')}</div>
          <span style="font-size:12px;color:var(--text-muted)">Operado por: ${op.owner}</span>
        </div>
      `;
    }

    const mapEl = document.getElementById('paseoMap');

    const plans = document.getElementById('paseoPlans');
    if (plans) {
      plans.innerHTML = op.plans.map((p, idx) => {
        const stopNames = p.stops.map(s => typeof s === 'string' ? s : s.name);
        return `
          <div class="plan-card" data-plan-idx="${idx}">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <ul class="plan-stops-list">
              ${stopNames.map(s => `<li>${s}</li>`).join('')}
            </ul>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <span class="plan-price">$${p.price}</span>
              <div style="display:flex;gap:8px">
                <button class="btn plan-show-map-btn" data-plan-idx="${idx}" style="border-color:rgba(0,242,194,0.3);color:var(--accent);font-size:12px">Ver en mapa</button>
                <button class="btn btn-primary plan-reserve-btn" data-plan-idx="${idx}">Reservar</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      plans.querySelectorAll('.plan-show-map-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.planIdx);
          const plan = op.plans[idx];
          if (mapEl && plan.stops.length > 0) {
            showPaseoMap(plan);
            btn.closest('.plan-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      plans.querySelectorAll('.plan-reserve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.planIdx);
          const plan = op.plans[idx];
          if (plan) {
            showToast(`Reserva solicitada: "${plan.name}" - $${plan.price} | Operador: ${op.name}`);
          }
        });
      });
    }

    if (op.plans.length > 0 && mapEl) {
      showPaseoMap(op.plans[0]);
    }
  }

  function showPaseoMap(plan) {
    const mapEl = document.getElementById('paseoMap');
    if (!mapEl) return;
    mapEl.style.display = 'block';

    const validStops = plan.stops.filter(s => s.lat && s.lng);
    if (validStops.length === 0) { mapEl.style.display = 'none'; return; }

    if (_paseoMap) {
      _paseoMap.remove();
      _paseoMap = null;
    }

    mapEl.innerHTML = '';
    _paseoMap = L.map(mapEl, { zoomControl: true, attributionControl: false });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(_paseoMap);

    _paseoMarkers = [];
    const bounds = [];

    validStops.forEach((stop, i) => {
      const icon = L.divIcon({
        className: 'paseo-stop-marker',
        html: `<div class="paseo-stop-dot">${i + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([stop.lat, stop.lng], { icon })
        .addTo(_paseoMap)
        .bindPopup(`<strong>Parada ${i + 1}:</strong> ${stop.name}`);
      _paseoMarkers.push(marker);
      bounds.push([stop.lat, stop.lng]);
    });

    if (bounds.length > 1) {
      const lineCoords = validStops.map(s => [s.lat, s.lng]);
      L.polyline(lineCoords, { color: 'var(--accent)', weight: 3, opacity: 0.8, dashArray: '8 6' }).addTo(_paseoMap);
    }

    _paseoMap.fitBounds(bounds, { padding: [30, 30] });

    setTimeout(() => _paseoMap.invalidateSize(), 100);
  }

  function initComida() {
    if (!requireAuth()) return;
    renderComidaFilter();
    renderComidaGrid();
    document.getElementById('comidaFab')?.addEventListener('click', () => {
      const f = document.getElementById('comidaFilter');
      if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function renderComidaFilter() {
    const el = document.getElementById('comidaFilter');
    if (!el) return;
    el.innerHTML = FOOD_CATEGORIES.map(c =>
      `<button class="category-icon ${_comidaFilter === c.id ? 'active' : ''}" data-cat="${c.id}">
        <span class="category-icon-circle">${c.label.charAt(0)}</span>
        <span class="category-icon-label">${c.label}</span>
      </button>`
    ).join('');
    el.querySelectorAll('.category-icon').forEach(btn => {
      btn.addEventListener('click', () => {
        _comidaFilter = btn.dataset.cat;
        renderComidaFilter();
        renderComidaGrid();
      });
    });
  }

  function renderComidaGrid() {
    const el = document.getElementById('comidaGrid');
    if (!el) return;
    let list = RESTAURANTS;
    if (_comidaFilter !== 'all') {
      list = list.filter(r => r.category === _comidaFilter);
    }
    el.innerHTML = list.map(r => `
      <div class="bento-card" data-id="${r.id}">
        <img class="bento-card-img" src="${r.img}" alt="${r.name}" loading="lazy" onerror="this.style.background='var(--bg-card)';this.alt='Imagen no disponible'">
        <div class="bento-card-body">
          <div class="bento-card-title">${r.name}</div>
          <div class="bento-card-sub">${r.desc}</div>
          <div class="bento-card-tags">${r.tags.map(t => `<span class="bento-tag">${t}</span>`).join('')}</div>
          <div class="bento-card-price">${r.menu.length} platos en menú</div>
        </div>
      </div>
    `).join('');
    el.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = `comida-detail?id=${card.dataset.id}`;
      });
    });
  }

  function initComidaDetail(params) {
    if (!requireAuth()) return;
    const r = RESTAURANTS.find(x => x.id === params?.id);
    if (!r) { navigate('comida'); return; }

    document.getElementById('comidaBack')?.addEventListener('click', () => navigate('comida'));

    const hero = document.getElementById('comidaHero');
    if (hero) {
      hero.innerHTML = `
        <img class="detail-hero-img" src="${r.img}" alt="${r.name}" onerror="this.style.background='var(--bg-card)'">
        <div class="detail-hero-info">
          <h2>${r.name}</h2>
          <p>${r.desc}</p>
          <div class="detail-hero-tags">${r.tags.map(t => `<span class="bento-tag">${t}</span>`).join('')}</div>
          <span style="font-size:12px;color:var(--text-muted)">Propietario: ${r.owner}</span>
        </div>
      `;
    }

    const menu = document.getElementById('comidaMenu');
    if (menu) {
      menu.innerHTML = r.menu.map((m, i) => `
        <div class="menu-card">
          ${m.img ? `<img class="menu-card-img" src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.style.display='none'">` : '<div class="menu-card-img menu-card-placeholder">🍽️</div>'}
          <div class="menu-card-left">
            <h3>${m.name}</h3>
            <p>${m.desc}</p>
          </div>
          <div class="menu-card-right">
            <span class="menu-card-price">$${m.price}</span>
            <button class="btn menu-add-cart-btn" onclick="event.stopPropagation(); window.__addToCartFromMenu('${r.id}', '${r.name}', ${i})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Añadir
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  window.__addToCartFromMenu = function(restId, restName, menuIdx) {
    const r = RESTAURANTS.find(x => x.id === restId);
    if (!r) return;
    const m = r.menu[menuIdx];
    if (!m) return;
    addToCart({
      id: `${restId}-${menuIdx}`,
      restaurantId: restId,
      restaurantName: restName,
      name: m.name,
      desc: m.desc,
      price: m.price,
      img: m.img || ''
    });
  };

  function setupAdminLocals() {
    const u = state.user;
    if (!u || !isAdmin(u.role)) return;

    const btnsContainer = document.getElementById('adminLocalsBtns');
    if (btnsContainer) { btnsContainer.classList.remove('hidden'); btnsContainer.style.display = 'flex'; }

    const allForms = ['adminPaseoForm', 'adminRestauranteForm', 'adminAddPlanForm', 'adminAddMenuForm'];
    function hideOther(exceptId) {
      allForms.forEach(id => { if (id !== exceptId) document.getElementById(id)?.classList.add('hidden'); });
    }

    document.getElementById('addPaseoToggle')?.addEventListener('click', () => {
      const f = document.getElementById('adminPaseoForm');
      const isHidden = f?.classList.contains('hidden');
      hideOther('adminPaseoForm');
      if (isHidden) f?.classList.remove('hidden'); else f?.classList.add('hidden');
    });

    document.getElementById('addRestauranteToggle')?.addEventListener('click', () => {
      const f = document.getElementById('adminRestauranteForm');
      const isHidden = f?.classList.contains('hidden');
      hideOther('adminRestauranteForm');
      if (isHidden) f?.classList.remove('hidden'); else f?.classList.add('hidden');
    });

    document.getElementById('addPlanToLocToggle')?.addEventListener('click', () => {
      const f = document.getElementById('adminAddPlanForm');
      const isHidden = f?.classList.contains('hidden');
      hideOther('adminAddPlanForm');
      if (isHidden) {
        populateLocalSelects();
        f?.classList.remove('hidden');
      } else {
        f?.classList.add('hidden');
      }
    });

    document.getElementById('addMenuToLocToggle')?.addEventListener('click', () => {
      const f = document.getElementById('adminAddMenuForm');
      const isHidden = f?.classList.contains('hidden');
      hideOther('adminAddMenuForm');
      if (isHidden) {
        populateLocalSelects();
        f?.classList.remove('hidden');
      } else {
        f?.classList.add('hidden');
      }
    });

    // Dynamic plan row for new local
    document.getElementById('addPaseoPlanRow')?.addEventListener('click', () => {
      const container = document.getElementById('paseoPlansForm');
      const row = document.createElement('div');
      row.className = 'plan-row';
      row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px';
      row.innerHTML = `
        <input class="form-input plan-name" placeholder="Nombre del plan">
        <input class="form-input plan-desc" placeholder="Descripción">
        <input class="form-input plan-stops" placeholder="Paradas (separadas por coma)">
        <input class="form-input plan-stops-coords" placeholder="Coords paradas (lat,lng;lat,lng)">
        <input class="form-input plan-price" type="number" placeholder="Precio $">
      `;
      container.appendChild(row);
    });

    // Dynamic menu row for new restaurant
    document.getElementById('addRestMenuRow')?.addEventListener('click', () => {
      const container = document.getElementById('restMenuForm');
      const row = document.createElement('div');
      row.className = 'menu-row';
      row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px';
      row.innerHTML = `
        <input class="form-input menu-item-name" placeholder="Nombre del plato">
        <input class="form-input menu-item-desc" placeholder="Descripción">
        <input class="form-input menu-item-price" type="number" placeholder="Precio $">
        <input class="form-input menu-item-img" placeholder="URL de imagen del plato">
      `;
      container.appendChild(row);
    });

    // Dynamic stop row for adding plan to existing local
    document.getElementById('addStopRow')?.addEventListener('click', () => {
      const container = document.getElementById('addPlanStopsForm');
      const row = document.createElement('div');
      row.className = 'stop-row';
      row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px';
      row.innerHTML = `
        <input class="form-input stop-name" placeholder="Nombre de la parada">
        <input class="form-input stop-lat" type="number" step="any" placeholder="Latitud">
        <input class="form-input stop-lng" type="number" step="any" placeholder="Longitud">
      `;
      container.appendChild(row);
    });

    // Add Paseo Local
    document.getElementById('addPaseoLocalBtn')?.addEventListener('click', () => {
      const name = document.getElementById('paseoLocalName')?.value.trim();
      const owner = document.getElementById('paseoLocalOwner')?.value.trim();
      const desc = document.getElementById('paseoLocalDesc')?.value.trim();
      const img = document.getElementById('paseoLocalImg')?.value.trim();
      if (!name || !owner) { alert('Nombre y propietario son obligatorios'); return; }

      const plans = [];
      document.querySelectorAll('#paseoPlansForm .plan-row').forEach(row => {
        const pn = row.querySelector('.plan-name')?.value.trim();
        const pd = row.querySelector('.plan-desc')?.value.trim();
        const ps = row.querySelector('.plan-stops')?.value.trim();
        const pc = row.querySelector('.plan-stops-coords')?.value.trim();
        const pp = parseFloat(row.querySelector('.plan-price')?.value) || 0;
        if (pn) {
          const stopNames = ps ? ps.split(',').map(s => s.trim()) : [];
          const coords = pc ? pc.split(';').map(c => c.split(',').map(Number)) : [];
          const stops = stopNames.map((s, i) => ({
            name: s,
            lat: coords[i] && coords[i][0] ? coords[i][0] : 10.4086,
            lng: coords[i] && coords[i][1] ? coords[i][1] : -67.2910
          }));
          plans.push({ name: pn, desc: pd || '', stops, price: pp });
        }
      });

      TOUR_OPERATORS.push({
        id: 'to-' + Date.now(), name, owner, desc: desc || '', img: img || '',
        tags: ['Local'], plans
      });

      alert(`Local "${name}" registrado exitosamente`);
      document.getElementById('adminPaseoForm')?.classList.add('hidden');
      document.getElementById('paseoLocalName').value = '';
      document.getElementById('paseoLocalOwner').value = '';
      document.getElementById('paseoLocalDesc').value = '';
      document.getElementById('paseoLocalImg').value = '';
    });

    // Add Restaurante
    document.getElementById('addRestauranteBtn')?.addEventListener('click', () => {
      const name = document.getElementById('restLocalName')?.value.trim();
      const owner = document.getElementById('restLocalOwner')?.value.trim();
      const category = document.getElementById('restLocalCategory')?.value;
      const img = document.getElementById('restLocalImg')?.value.trim();
      const desc = document.getElementById('restLocalDesc')?.value.trim();
      if (!name || !owner || !category) { alert('Nombre, propietario y categoría son obligatorios'); return; }

      const menu = [];
      document.querySelectorAll('#restMenuForm .menu-row').forEach(row => {
        const mn = row.querySelector('.menu-item-name')?.value.trim();
        const md = row.querySelector('.menu-item-desc')?.value.trim();
        const mp = parseFloat(row.querySelector('.menu-item-price')?.value) || 0;
        const mi = row.querySelector('.menu-item-img')?.value.trim();
        if (mn) {
          menu.push({ name: mn, desc: md || '', price: mp, img: mi || '' });
        }
      });

      const catLabel = FOOD_CATEGORIES.find(c => c.id === category)?.label || category;
      RESTAURANTS.push({
        id: 'r-' + Date.now(), name, owner, category, desc: desc || '', img: img || '',
        tags: [catLabel], menu
      });

      alert(`Restaurante "${name}" registrado exitosamente`);
      document.getElementById('adminRestauranteForm')?.classList.add('hidden');
      document.getElementById('restLocalName').value = '';
      document.getElementById('restLocalOwner').value = '';
      document.getElementById('restLocalCategory').value = '';
      document.getElementById('restLocalImg').value = '';
      document.getElementById('restLocalDesc').value = '';
    });

    // Add Plan to Existing Local
    document.getElementById('addPlanToLocBtn')?.addEventListener('click', () => {
      const localId = document.getElementById('addPlanLocalSelect')?.value;
      const planName = document.getElementById('addPlanName')?.value.trim();
      const planDesc = document.getElementById('addPlanDesc')?.value.trim();
      const planImg = document.getElementById('addPlanImg')?.value.trim();
      const planPrice = parseFloat(document.getElementById('addPlanPrice')?.value) || 0;
      if (!localId || !planName) { alert('Selecciona un local y escribe un nombre de plan'); return; }

      const op = TOUR_OPERATORS.find(o => o.id === localId);
      if (!op) { alert('Local no encontrado'); return; }

      const stops = [];
      document.querySelectorAll('#addPlanStopsForm .stop-row').forEach(row => {
        const sn = row.querySelector('.stop-name')?.value.trim();
        const slat = parseFloat(row.querySelector('.stop-lat')?.value);
        const slng = parseFloat(row.querySelector('.stop-lng')?.value);
        if (sn && !isNaN(slat) && !isNaN(slng)) {
          stops.push({ name: sn, lat: slat, lng: slng });
        }
      });

      op.plans.push({ name: planName, desc: planDesc || '', stops, price: planPrice, img: planImg || '' });
      alert(`Plan "${planName}" agregado a "${op.name}" exitosamente`);
      document.getElementById('adminAddPlanForm')?.classList.add('hidden');
      document.getElementById('addPlanName').value = '';
      document.getElementById('addPlanDesc').value = '';
      document.getElementById('addPlanImg').value = '';
      document.getElementById('addPlanPrice').value = '';
    });

    // Add Menu Item to Existing Restaurant
    document.getElementById('addMenuToLocBtn')?.addEventListener('click', () => {
      const localId = document.getElementById('addMenuLocalSelect')?.value;
      const itemName = document.getElementById('addMenuItemName')?.value.trim();
      const itemDesc = document.getElementById('addMenuItemDesc')?.value.trim();
      const itemPrice = parseFloat(document.getElementById('addMenuItemPrice')?.value) || 0;
      const itemImg = document.getElementById('addMenuItemImg')?.value.trim();
      if (!localId || !itemName) { alert('Selecciona un restaurante y escribe un nombre de plato'); return; }

      const r = RESTAURANTS.find(x => x.id === localId);
      if (!r) { alert('Restaurante no encontrado'); return; }

      r.menu.push({ name: itemName, desc: itemDesc || '', price: itemPrice, img: itemImg || '' });
      alert(`Platillo "${itemName}" agregado a "${r.name}" exitosamente`);
      document.getElementById('adminAddMenuForm')?.classList.add('hidden');
      document.getElementById('addMenuItemName').value = '';
      document.getElementById('addMenuItemDesc').value = '';
      document.getElementById('addMenuItemPrice').value = '';
      document.getElementById('addMenuItemImg').value = '';
    });
  }

  function populateLocalSelects() {
    const paseoSelect = document.getElementById('addPlanLocalSelect');
    const menuSelect = document.getElementById('addMenuLocalSelect');
    if (paseoSelect) {
      paseoSelect.innerHTML = '<option value="">Seleccionar local de paseos</option>' +
        TOUR_OPERATORS.map(op => `<option value="${op.id}">${op.name}</option>`).join('');
    }
    if (menuSelect) {
      menuSelect.innerHTML = '<option value="">Seleccionar restaurante</option>' +
        RESTAURANTS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
    }
  }

  /* ══════════════════════════════════════════════════
     CART
     ══════════════════════════════════════════════════ */

  function addToCart(item) {
    const existing = state.cart.find(c => c.restaurantId === item.restaurantId && c.name === item.name);
    if (existing) {
      existing.qty++;
    } else {
      state.cart.push({ ...item, qty: 1 });
    }
    updateCartBadge();
    showToast(`${item.name} agregado al carrito`);
  }

  function removeFromCart(idx) {
    state.cart.splice(idx, 1);
    updateCartBadge();
    renderCartPanel();
  }

  function changeCartQty(idx, delta) {
    state.cart[idx].qty += delta;
    if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
    updateCartBadge();
    renderCartPanel();
  }

  function getCartCount() {
    return state.cart.reduce((sum, c) => sum + c.qty, 0);
  }

  function getCartTotal() {
    return state.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  }

  function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = getCartCount();
    if (count > 0) {
      badge.style.display = 'flex';
      badge.textContent = count;
    } else {
      badge.style.display = 'none';
    }
  }

  function toggleCartPanel() {
    const panel = document.getElementById('cartPanel');
    if (!panel) return;
    if (panel.classList.contains('hidden')) {
      renderCartPanel();
      panel.classList.remove('hidden');
      document.getElementById('cartOverlay')?.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
      document.getElementById('cartOverlay')?.classList.add('hidden');
    }
  }

  function closeCartPanel() {
    document.getElementById('cartPanel')?.classList.add('hidden');
    document.getElementById('cartOverlay')?.classList.add('hidden');
  }

  function renderCartPanel() {
    const body = document.getElementById('cartBody');
    if (!body) return;

    if (state.cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>Tu carrito está vacío</p>
        </div>`;
      updateCartFooter();
      return;
    }

    body.innerHTML = state.cart.map((item, i) => `
      <div class="cart-item">
        ${item.img ? `<img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">` : `<div class="cart-item-img cart-item-placeholder">🍽️</div>`}
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-restaurant">${item.restaurantName}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" onclick="event.stopPropagation(); window.__cartChangeQty(${i}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="cart-qty-btn" onclick="event.stopPropagation(); window.__cartChangeQty(${i}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="event.stopPropagation(); window.__cartRemove(${i})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `).join('');

    updateCartFooter();
  }

  function updateCartFooter() {
    const footer = document.getElementById('cartFooter');
    if (!footer) return;
    const total = getCartTotal();
    const count = getCartCount();
    footer.innerHTML = `
      <div class="cart-total-row">
        <span>Total (${count} ${count === 1 ? 'artículo' : 'artículos'})</span>
        <span class="cart-total-amount">$${total.toFixed(2)}</span>
      </div>
      <div class="cart-actions">
        <button class="btn cart-cancel-btn" onclick="window.__closeCart()">Cancelar</button>
        <button class="btn btn-primary cart-confirm-btn" ${state.cart.length === 0 ? 'disabled' : ''} onclick="window.__confirmCart()">Confirmar compra</button>
      </div>
    `;
  }

  window.__cartChangeQty = function(idx, delta) { changeCartQty(idx, delta); };
  window.__cartRemove = function(idx) { removeFromCart(idx); };
  window.__closeCart = function() { closeCartPanel(); };
  window.__confirmCart = function() {
    if (state.cart.length === 0) return;
    const total = getCartTotal();
    const count = getCartCount();
    showToast(`Compra confirmada: ${count} artículos por $${total.toFixed(2)}`);
    state.cart = [];
    updateCartBadge();
    closeCartPanel();
  };

  function showToast(msg) {
    let t = document.getElementById('appToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'appToast';
      t.className = 'app-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  /* ══════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    // Hide loading
    document.getElementById('loading-screen').style.display = 'none';

    // Set up hash routing
    window.addEventListener('hashchange', handleHashChange);

    // Initial route
    handleHashChange();
  });

})();
