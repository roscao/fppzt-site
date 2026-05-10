// ============================================================
// LEAFLET MAP — Field Trip Route (FPPZT 2026)
// ★ EDITARE: Coordonatele profilelor și traseul pot fi
//   modificate direct în acest fișier.
// Traseul a fost generat din traseu_2006.geojson (100 puncte).
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  if (typeof L === 'undefined') {
    var el = document.getElementById('map');
    if (el) el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#F0EAE0;color:#8D6E63;font-style:italic;border-radius:12px;">Harta interactivă necesită conexiune la internet</div>';
    return;
  }

  var map = L.map('map', { scrollWheelZoom: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 17
  }).addTo(map);

  // ── Traseu (polilinie statică, fără OSRM) ───────
  var routeCoords = [
    [47.17461,27.57234],[47.17325,27.57348],[47.17279,27.57046],[47.17314,27.56601],[47.17241,27.56616],
    [47.17226,27.56439],[47.17395,27.55665],[47.17482,27.54294],[47.17375,27.53927],[47.17271,27.53087],
    [47.17244,27.51801],[47.17506,27.49935],[47.1897,27.43164],[47.19508,27.41622],[47.1958,27.39873],
    [47.20311,27.38159],[47.21313,27.34311],[47.21459,27.33496],[47.2184,27.32239],[47.21881,27.30586],
    [47.21276,27.27803],[47.21081,27.26696],[47.21515,27.25206],[47.21777,27.2387],[47.21827,27.2327],
    [47.21804,27.21032],[47.22386,27.19256],[47.22546,27.18217],[47.22208,27.17493],[47.22328,27.16387],
    [47.22305,27.15468],[47.2204,27.13439],[47.21991,27.12213],[47.21886,27.11795],[47.21892,27.10859],
    [47.2205,27.10204],[47.22058,27.09562],[47.22169,27.08421],[47.2175,27.04316],[47.21785,27.03791],
    [47.21695,27.03108],[47.21244,27.02478],[47.21171,27.02305],[47.21101,27.01837],[47.21118,27.01173],
    [47.21393,27.00929],[47.21466,27.00203],[47.21435,26.99996],[47.21678,26.99969],[47.2287,26.98839],
    [47.23689,26.98269],[47.23969,26.97788],[47.24315,26.97325],[47.25149,26.96411],[47.26279,26.95416],
    [47.26596,26.9501],[47.27214,26.94539],[47.27659,26.9402],[47.28002,26.93781],[47.28506,26.93576],
    [47.28466,26.93203],[47.28626,26.92593],[47.28614,26.92519],[47.28408,26.9225],[47.28697,26.92038],
    [47.28764,26.91887],[47.2855,26.91235],[47.28764,26.91887],[47.28697,26.92038],[47.28449,26.92232],
    [47.28283,26.92223],[47.27842,26.92442],[47.27765,26.9172],[47.27842,26.92442],[47.28321,26.92216],
    [47.2842,26.92261],[47.28614,26.92519],[47.28577,26.92869],[47.28466,26.93203],[47.28506,26.93576],
    [47.28869,26.93221],[47.29032,26.9314],[47.29172,26.92404],[47.29674,26.91659],[47.29696,26.9155],
    [47.29964,26.9157],[47.30226,26.91301],[47.30377,26.91462],[47.30995,26.9132],[47.31233,26.91016],
    [47.31627,26.907],[47.31667,26.90454],[47.31792,26.90226],[47.31807,26.89811],[47.31884,26.89404],
    [47.32369,26.88695],[47.32516,26.88655],[47.32579,26.88587],[47.32613,26.88362],[47.32578,26.87821]
  ];

  L.polyline(routeCoords, {
    color: '#B22222',
    weight: 4,
    opacity: 0.85,
    dashArray: null,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(map);

  // ── Funcție marker numerotat ────────────────────
  function numberedIcon(number, color) {
    return L.divIcon({
      className: '',
      html: '<div style="' +
        'width:28px;height:28px;border-radius:50%;' +
        'background:' + color + ';border:3px solid #fff;' +
        'box-shadow:0 2px 8px rgba(0,0,0,0.35);' +
        'display:flex;align-items:center;justify-content:center;' +
        'font-family:Source Sans 3,sans-serif;font-weight:700;' +
        'font-size:12px;color:#fff;">' + number + '</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  function venueIcon() {
    return L.divIcon({
      className: '',
      html: '<div style="width:18px;height:18px;background:#C8A951;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  }

  // ── Locații simpozion ───────────────────────────
  L.marker([47.1747, 27.5745], { icon: venueIcon() })
    .addTo(map)
    .bindPopup('<strong>Universitatea UAIC</strong><br>Amfiteatrul B8<br>Facultatea de Geografie și Geologie');

  L.marker([47.1760, 27.5590], { icon: venueIcon() })
    .addTo(map)
    .bindPopup('<strong>Grădina Botanică „Anastasie Fătu"</strong><br>13 septembrie');

  // ── Profile de sol (markere numerotate) ─────────
  // ★ EDITARE: Modificați coordonatele exacte ale profilelor
  var profiles = [
    { id: 'P1', num: '1', lat: 47.2857, lng: 26.9122,
      name: 'Cucuteni (Dl. lui Viteaz) — Profil de sol 1',
      nameEn: 'Cucuteni (Dl. lui Viteaz) — Soil Profile 1' },
    { id: 'P2', lat: 47.2800, lng: 26.9168, num: '2',
      name: 'Cucuteni (Dl. Spinișului) — Profil de sol 2',
      nameEn: 'Cucuteni (Dl. Spinișului) — Soil Profile 2' },
    { id: 'P3', lat: 47.2868, lng: 26.9246, num: '3',
      name: 'Cucuteni (Muzeu) — Profil de sol 3',
      nameEn: 'Cucuteni (Museum) — Soil Profile 3' },
    { id: 'P4', lat: 47.3289, lng: 26.8790, num: '4',
      name: 'Stroești (Dl. Stroești) — Profil de sol 4',
      nameEn: 'Stroești (Dl. Stroești) — Soil Profile 4' }
  ];

  profiles.forEach(function(p) {
    var marker = L.marker([p.lat, p.lng], { icon: numberedIcon(p.num, '#4A7C5C') })
      .addTo(map)
      .bindPopup('<strong>' + p.name + '</strong><br><em>' + p.nameEn + '</em>');

    if (p.id) {
      marker.on('click', function() { highlightProfileCard(p.id); });
    }
  });

  // ── Alte puncte de interes ──────────────────────
  L.marker([47.2850, 26.9250], { icon: venueIcon() })
    .addTo(map)
    .bindPopup('<strong>Rezervația Arheologică Cucuteni</strong><br>Cucuteni Archaeological Reserve');

  // ── Fit bounds ──────────────────────────────────
  map.fitBounds(routeCoords, { padding: [40, 40] });
});

// ============================================================
// HIGHLIGHT PROFILE CARD FROM MAP CLICK
// ============================================================
function highlightProfileCard(profileId) {
  document.querySelectorAll('.profile-preview-card').forEach(function(c) {
    c.classList.remove('highlighted');
  });
  var card = document.getElementById('preview-' + profileId);
  if (card) {
    card.classList.add('highlighted');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function() { card.classList.remove('highlighted'); }, 4000);
  }
}
