// ============================================================
// LEAFLET MAP — Field Trip Route
// ============================================================
// ★ EDITARE: Coordonatele punctelor de staționare pot fi
//   modificate/adăugate în array-ul `stops` de mai jos.

document.addEventListener('DOMContentLoaded', function() {
  if (typeof L === 'undefined') {
    // Leaflet not loaded (preview/sandbox) — show fallback
    var el = document.getElementById('map');
    if (el) el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#F0EAE0;color:#8D6E63;font-style:italic;border-radius:12px;">Harta interactivă se încarcă doar pe server · Interactive map loads on server only</div>';
    return;
  }
  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView([47.25, 26.95], 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 17
  }).addTo(map);

  // Marker colors
  const venueIcon = L.divIcon({
    className: '',
    html: '<div style="width:18px;height:18px;background:#C8A951;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  const fieldIcon = L.divIcon({
    className: '',
    html: '<div style="width:18px;height:18px;background:#4A7C5C;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  // ★ Symposium venue
  L.marker([47.1747, 27.5745], { icon: venueIcon })
    .addTo(map)
    .bindPopup('<strong>Universitatea UAIC</strong><br>Amfiteatrul B8<br>Facultatea de Geografie și Geologie');

  // ★ Botanical Garden
  L.marker([47.1760, 27.5590], { icon: venueIcon })
    .addTo(map)
    .bindPopup('<strong>Grădina Botanică „Anastasie Fătu"</strong><br>13 septembrie');

  // ★ Field trip stops — EDITARE: adăugați/modificați coordonatele exacte
  const stops = [
    { lat: 47.2857, lng: 26.9122, name: 'Cucuteni (Dl. lui Viteaz) — Profil de sol 1', nameEn: 'Cucuteni (Dl. lui Viteaz) — Soil Profile 1', profileId: 'P1' },
    { lat: 47.2800, lng: 26.9168, name: 'Cucuteni (Dl. Spinișului) — Profil de sol 2', nameEn: 'Cucuteni (Dl. Spinișului) — Soil Profile 2', profileId: 'P2' },
    { lat: 47.2868, lng: 26.9246, name: 'Cucuteni (Muzeu) — Profil de sol 3', nameEn: 'Cucuteni (Museum) — Soil Profile 3', profileId: 'P3' },
    { lat: 47.3289, lng: 26.8790, name: 'Stroești (Dl. Stroești)-Profil de sol 4', nameEn: 'Stroești (Dl. Stroești) - Soil Profile 4', profileId: 'P4' },
    { lat: 47.2850, lng: 26.9250, name: 'Rezervația Arheologică Cucuteni', nameEn: 'Cucuteni Archaeological Reserve', profileId: null },
  ];

  stops.forEach(s => {
    const marker = L.marker([s.lat, s.lng], { icon: fieldIcon })
      .addTo(map)
      .bindPopup(`<strong>${s.name}</strong><br><em>${s.nameEn}</em>`);

    // If this stop is a soil profile, clicking highlights the preview card
    if (s.profileId) {
      marker.on('click', function() {
        highlightProfileCard(s.profileId);
      });
    }
  });

  // Route on roads via OSRM (free, no API key)
  L.Routing.control({
    waypoints: [
      L.latLng(47.1747, 27.5745), // Iași — UAIC
      L.latLng(47.2857, 26.9168), // Cucuteni — Profil 1
      L.latLng(47.2800, 26.9168), // Cucuteni — Profil 2
      L.latLng(47.2868, 26.9246), // Cucuteni — Profil 3
      L.latLng(47.3289, 26.8790), // Cucuteni-Cetățuie
      L.latLng(47.2850, 26.9250)  // Rezervația Cucuteni
    ],
	router: L.Routing.osrmv1({
      serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1'
    }),
    lineOptions: {
      styles: [{ color: '#B22222', weight: 5, opacity: 0.85 }]
    },
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false,
    createMarker: function() { return null; }
  }).addTo(map);

  // Fit map to all markers
  const allCoords = [[47.1747, 27.5745], [47.1760, 27.5590], ...stops.map(s => [s.lat, s.lng])];
  map.fitBounds(allCoords, { padding: [40, 40] });
});

// ============================================================
// HIGHLIGHT PROFILE CARD FROM MAP CLICK
// ============================================================
function highlightProfileCard(profileId) {
  document.querySelectorAll('.profile-preview-card').forEach(c => c.classList.remove('highlighted'));
  const card = document.getElementById('preview-' + profileId);
  if (card) {
    card.classList.add('highlighted');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => card.classList.remove('highlighted'), 4000);
  }
}
