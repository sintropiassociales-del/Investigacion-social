// ============================================================
//  SINTROPÍA SOCIAL — Configuración central
//  INSTRUCCIÓN: Después de desplegar tu Apps Script,
//  reemplaza la URL de abajo con tu URL real.
// ============================================================

const CONFIG = {
  // ⬇ REEMPLAZA ESTA URL con la de tu Apps Script desplegado
  API_URL: https://script.google.com/macros/s/AKfycbxnBy1DKH14oWGEnzFHLDrD0XlgshVkBJrCL5b7zp8XKO0hmE4xriXEDXU9PZZl5KzovQ/exec/exec,

  SHEET_ID: '114sl6Mt-UhQQsv7zyicAAmsYzo3VDPoAvbT-0MakK94',

  // Citas visibles para invitados (10%)
  GUEST_PERCENT: 0.10,

  // Email de contacto
  CONTACT_EMAIL: 'contacto@sintropiasocial.com',

  // Admins registradas (solo para referencia visual en el frontend)
  ADMIN_EMAILS: ['dsalgado@sintropiasocial.com'],

  // PayPal hosted button
  PAYPAL_CLIENT_ID: 'BAADNWafE2xUH09mKvDiejlkmXxK9XQx1oa-ujzF7TF-pQNLf1a58OhHRUMUNoDx9dgXzhDclHdQhukdW0',
  PAYPAL_BUTTON_ID: 'RY5K7VHYRPJLY',
};

// ── Auth helpers ──
const Auth = {
  getUser:  () => { try{ return JSON.parse(localStorage.getItem('ss_user'));  }catch(e){ return null; } },
  getAdmin: () => { try{ return JSON.parse(localStorage.getItem('ss_admin')); }catch(e){ return null; } },
  setUser:  (u)  => localStorage.setItem('ss_user',  JSON.stringify(u)),
  setAdmin: (a)  => localStorage.setItem('ss_admin', JSON.stringify(a)),
  logout:   ()   => { localStorage.removeItem('ss_user');  location.href='index.html'; },
  logoutAdmin: () => { localStorage.removeItem('ss_admin'); location.href='index.html'; },
  isAdmin: () => !!Auth.getAdmin()?.token,
  getToken: () => Auth.getAdmin()?.token || null,
};

// ── SHA-256 helper (browser) ──
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// ── API helper ──
async function api(action, body = null) {
  try {
    if (body) {
      const res = await fetch(CONFIG.API_URL, {
        method: 'POST',
        body: JSON.stringify({ action, ...body }),
      });
      return await res.json();
    } else {
      const res = await fetch(`${CONFIG.API_URL}?action=${action}`);
      return await res.json();
    }
  } catch(e) {
    console.error('API error:', e);
    return { ok: false, error: 'Error de conexión con el servidor' };
  }
}
