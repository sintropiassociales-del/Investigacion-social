// ============================================================
// SINTROPÍA SOCIAL — config.js
// ============================================================

var CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzde2DznpNvoQYTjTH7aiNbDRrJyEskNrnGu1foPqWc9KQNpbMiUaBMYpLMCNpZMCiY7A/exec',
  GUEST_PERCENT: 0.10,
  CONTACT_EMAIL: 'contacto@sintropiasocial.com',
  ADMIN_EMAILS: ['dsalgado@sintropiasocial.com'],
  PAYPAL_CLIENT_ID: 'BAADNWafE2xUH09mKvDiejlkmXxK9XQx1oa-ujzF7TF-pQNLf1a58OhHRUMUNoDx9dgXzhDclHdQhukdW0',
  PAYPAL_BUTTON_ID: 'RY5K7VHYRPJLY',
  PAYPAL_SUBSCRIPTION_ID: '' // Aquí pondrás tu Plan ID de suscripción mensual
};

// ── Auth helpers ──
var Auth = {
  getUser: function() {
    try { return JSON.parse(localStorage.getItem('ss_user')); } catch(e) { return null; }
  },
  getAdmin: function() {
    try { return JSON.parse(localStorage.getItem('ss_admin')); } catch(e) { return null; }
  },
  setUser: function(u) { localStorage.setItem('ss_user', JSON.stringify(u)); },
  setAdmin: function(a) { localStorage.setItem('ss_admin', JSON.stringify(a)); },
  logout: function() { localStorage.removeItem('ss_user'); location.href = 'index.html'; },
  logoutAdmin: function() { localStorage.removeItem('ss_admin'); location.reload(); },
  isAdmin: function() {
    var a = Auth.getAdmin();
    return !!(a && a.token);
  },
  getToken: function() {
    var a = Auth.getAdmin();
    return (a && a.token) ? a.token : null;
  }
};

// ── SHA-256 (browser nativo) ──
async function sha256(str) {
  var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(function(b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
}

// ── API helper — todo via GET para compatibilidad con Apps Script ──
async function api(action, params) {
  try {
    var p = new URLSearchParams();
    p.append('action', action);
    if (params) {
      Object.keys(params).forEach(function(k) {
        if (params[k] !== null && params[k] !== undefined) {
          p.append(k, String(params[k]));
        }
      });
    }
    var url = CONFIG.API_URL + '?' + p.toString();
    console.log('API Request:', action, params);
    var res = await fetch(url);
    var text = await res.text();
    console.log('API Response:', text.slice(0, 500));
    try {
      return JSON.parse(text);
    } catch(e) {
      console.error('Respuesta no JSON:', text.slice(0, 400));
      return { ok: false, error: 'Error en la respuesta del servidor. Verifica que el Web App esté desplegado correctamente.' };
    }
  } catch(e) {
    console.error('API error:', e);
    return { ok: false, error: 'Error de conexión con el servidor: ' + e.message };
  }
}
