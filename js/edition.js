/* ============================================================
   edition.js — Logica paginii de ediție (edition.html)
   Citește ?year= din URL, încarcă js/edition-YYYY-data.js
   Depinde de: profiles-engine.js (Munsell, triunghi, diagrame)
               main.js (lang toggle)
   ============================================================ */

(function () {
  'use strict';

  var DATA = null;
  var map = null;

  // ── Citește parametrul ?year= ───────────────────
  var params = new URLSearchParams(window.location.search);
  var year = params.get('year');

  if (!year) {
    document.getElementById('loading').innerHTML =
      '<p style="color:#B85C4A;">Parametrul <code>?year=</code> lipsește. <a href="archive.html">Înapoi la arhivă</a></p>';
    return;
  }

  // ── Încarcă datele dinamic (script tag, nu fetch) ──
  var script = document.createElement('script');
  script.src = 'js/edition-' + year + '-data.js';
  script.onload = function () {
    if (typeof EDITION_DATA !== 'undefined') {
      DATA = EDITION_DATA;
      document.title = 'FPPZT — Ediția ' + DATA.edition + ' (' + DATA.year + ')';
      renderPage(DATA);
    } else {
      showError();
    }
  };
  script.onerror = function () { showError(); };
  document.head.appendChild(script);

  function showError() {
    document.getElementById('loading').innerHTML =
      '<p style="color:#B85C4A;">Nu s-au găsit date pentru ediția ' + year +
      '. <a href="archive.html">Înapoi la arhivă</a></p>';
  }

  // ── Randare pagină completă ─────────────────────
  function renderPage(d) {
    document.getElementById('editionTitle').textContent =
      'Ediția a ' + d.edition + '-a — ' + d.location.ro + ' (' + d.year + ')';
    document.getElementById('editionSubtitle').textContent = d.title.ro;

    document.getElementById('loading').style.display = 'none';
    document.getElementById('editionContent').style.display = 'block';

    document.getElementById('routeTitleRo').innerHTML =
      '<span class="edition-meta">FPPZT, ' + d.dates + ', ediția a ' + d.edition + '-a</span><br>' + d.title.ro;
    document.getElementById('routeTitleEn').innerHTML =
      '<span class="edition-meta">FPPZT, ' + d.dates + ', edition ' + d.edition + '</span><br>' + d.title.en;

    renderRoute(d.route);
    initMap(d);
    renderProfileTabs(d.profiles);
    renderGallery(d.gallery);
  }

  // ── Secțiunea traseu ────────────────────────────
  function renderRoute(route) {
    if (!route) return;
    var container = document.getElementById('routeDays');

    if (route.description && route.description.ro) {
      var div = document.createElement('div');
      div.className = 'route-day route-description';
      div.innerHTML =
        '<div class="route-desc" lang="ro">' +
          route.description.ro.split('\n').map(function (p) {
            if (p.startsWith('•')) {
              return '<div class="route-bullet">' + p + '</div>';
            }
            return '<p>' + p + '</p>';
          }).join('') +
        '</div>' +
        (route.description.en
          ? '<div class="route-desc" lang="en">' +
              route.description.en.split('\n').map(function (p) {
                if (p.startsWith('•')) {
                  return '<div class="route-bullet">' + p + '</div>';
                }
                return '<p>' + p + '</p>';
              }).join('') +
            '</div>'
          : '');
      container.appendChild(div);
    }
  }

  // ── Harta Leaflet ───────────────────────────────
  function initMap(d) {
    if (!d.route) return;
    var center = d.route.mapCenter || [46.35, 25.80];
    var zoom = d.route.mapZoom || 17;

    map = L.map('editionMap', { scrollWheelZoom: false }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // ── Markere profile de sol (auriu) ──────────
    var allCoords = [];
    d.profiles.forEach(function (p) {
      if (!p.location || !p.location.lat) return;
      allCoords.push([p.location.lat, p.location.lng]);
      var marker = L.marker([p.location.lat, p.location.lng], {
        pane: 'markerPane',
        icon: L.divIcon({
          className: 'profile-map-icon',
          html: '<span>' + p.id.replace('P','') + '</span>',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      }).addTo(map);
      marker.bindTooltip('<b>' + p.id + '</b> — ' + p.soilType, {
        direction: 'top', offset: [0, -10]
      });
      marker.on('click', function () { selectProfile(p.id); });
    });

    // ── Waypoints (puncte mici maro) ────────────
    if (d.route.waypoints) {
      d.route.waypoints.forEach(function (wp) {
        allCoords.push([wp.lat, wp.lng]);
        L.circleMarker([wp.lat, wp.lng], {
          radius: 4, fillColor: '#8D6E63', fillOpacity: 0.6,
          color: '#5D4037', weight: 1
        }).addTo(map).bindTooltip(wp.name, { direction: 'top' });
      });
    }

    // Fit imediat pe profile + waypoints
    if (allCoords.length > 0) {
      map.fitBounds(allCoords, { padding: [30, 30] });
    }

    // ── GeoJSON trasee (încărcare dinamică) ──────
    if (d.route.routeFile) {
      var routeScript = document.createElement('script');
      routeScript.src = 'js/' + d.route.routeFile + '.js';
      routeScript.onload = function () {
												
        var varName = 'ROUTES_' + d.year;
        var routeData = window[varName];
        if (!routeData || !routeData.length) return;

        var legendItems = [];

        routeData.forEach(function (r) {
          var layer = L.geoJSON(r.geojson, {
            style: {
              color: r.color,
              weight: 4,
              opacity: 0.8
							 
            }
          }).addTo(map);

          // Extinde bounds cu traseul
          var b = layer.getBounds();
          if (b.isValid()) {
            allCoords.push([b.getSouthWest().lat, b.getSouthWest().lng]);
            allCoords.push([b.getNorthEast().lat, b.getNorthEast().lng]);
          }

          legendItems.push(r);
        });

        // Re-fit cu trasee incluse
        if (allCoords.length > 0) {
          map.fitBounds(allCoords, { padding: [30, 30] });
        }

        // ── Legendă pe hartă ──────────────────────
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'route-legend');
          var html = '';
          legendItems.forEach(function (r) {
            html += '<div class="route-legend-item">' +
              '<span class="route-legend-line" style="background:' + r.color + '"></span>' +
              '<span>' + r.label + '</span></div>';
          });
          html += '<div class="route-legend-item">' +
            '<span class="route-legend-dot" style="background:#C8A951"></span>' +
            '<span>Profile</span></div>';
          div.innerHTML = html;
          return div;
        };
        legend.addTo(map);
      };
      routeScript.onerror = function () {
        console.warn('Nu s-a putut încărca fișierul trasee: js/' + d.route.routeFile + '.js');
      };
      document.head.appendChild(routeScript);
									  
													  
    }
  }

  // ── Tab-urile profilelor ────────────────────────
  function renderProfileTabs(profiles) {
    var container = document.getElementById('profileTabs');
    profiles.forEach(function (p) {
      var tab = document.createElement('div');
      tab.className = 'profile-tab';
      tab.dataset.id = p.id;

      tab.innerHTML =
    (p.photo
      ? '<img src="' + p.photo + '" alt="' + p.id + '">'
      : '<div class="tab-placeholder">\u{1F52C}</div>') +
    '<span class="tab-label">' + p.id + '</span>' +
    '<span class="tab-soil">' + truncate(p.soilType, 35) + '</span>';

      tab.addEventListener('click', function () { selectProfile(p.id); });
      container.appendChild(tab);
    });

    if (profiles.length > 0) selectProfile(profiles[0].id);
  }

  function selectProfile(id) {
    var tabs = document.querySelectorAll('.profile-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.id === id);
    }
    var profile = null;
    for (var j = 0; j < DATA.profiles.length; j++) {
      if (DATA.profiles[j].id === id) { profile = DATA.profiles[j]; break; }
    }
    if (profile) renderProfileDetail(profile);
  }

  // ── Detaliu profil ──────────────────────────────
  function renderProfileDetail(p) {
    var container = document.getElementById('profileDetail');
    container.innerHTML = '';

    var detail = document.createElement('div');
    detail.className = 'profile-detail';

    // Header
    detail.innerHTML =
      '<h3>' + p.id + ' — ' + p.name.ro + '</h3>' +
      '<span class="soil-type-badge">' + p.soilType + '</span>' +
      '<div class="location-meta">' +
        '\u{1F4CD} ' + (p.location.placement || p.location.locality) +
        ' · Alt. ' + p.location.altitude + ' m' +
        ' · ' + p.location.lat.toFixed(4) + '°N, ' + p.location.lng.toFixed(4) + '°E' +
        (p.climate ? '<br>\u{1F321} TMA: ' + p.climate.tma + ' °C · PMA: ' + p.climate.pma + ' mm' : '') +
      '</div>';

    // Profil incomplet?
    if (p.incomplete || !p.horizons || p.horizons.length === 0) {
      detail.innerHTML += '<div class="incomplete-badge">' +
        '<span lang="ro">Date analitice în curs de prelucrare</span>' +
        '<span lang="en">Analytical data being processed</span></div>';
      container.appendChild(detail);
      applyLang();
      return;
    }

    // Schiță + Tabel morfologic
    var sketchId = 'sketch-' + p.id;
    detail.innerHTML +=
      '<div class="profile-subsection">' +
        '<h4 lang="ro">Descriere morfologică</h4>' +
        '<h4 lang="en">Morphological Description</h4>' +
        '<div class="sketch-desc-grid">' +
          '<div id="' + sketchId + '"></div>' +
          '<div>' + buildMorphTable(p) + '</div>' +
        '</div>' +
      '</div>';

    // Diagrame — layout 2×2 ca în profiles.html
    if (p.analyticalData && typeof window.renderTexturalTriangle === 'function' && typeof window.renderDepthChart === 'function') {
      var fp = buildFakeProfileForCharts(p);
      var triangleSvg = window.renderTexturalTriangle(fp) || '';
      var phSvg = window.renderDepthChart(fp, 'pH', 'pH', '', '#4A6B8B', null, null) || '';
      var humusSvg = window.renderDepthChart(fp, 'humus', 'Humus', '%', '#4A7C5C', null, null) || '';

      // ★ Fallback: CaCO₃ sau T
      var fourthSvg = '';
      var hasCaCO3 = fp.horizons.some(function (hz) {
        return hz.parameters.CaCO3 != null && hz.parameters.CaCO3 > 0.5;
      });
      if (hasCaCO3) {
        fourthSvg = window.renderDepthChart(fp, 'CaCO3', 'CaCO\u2083', '%', '#C8A951', null, null) || '';
      } else {
        var tVals = fp.horizons.map(function (hz) { return hz.parameters.T; }).filter(function (v) { return v != null; });
        if (tVals.length >= 2) {
          var tMax = Math.ceil(Math.max.apply(null, tVals) / 10) * 10;
          fourthSvg = window.renderDepthChart(fp, 'T', 'T (CEC)', 'me/100g', '#8B6B4A', null, null) || '';
        }
      }

      detail.innerHTML +=
        '<div class="profile-subsection">' +
          '<h4 lang="ro">Date analitice</h4>' +
          '<h4 lang="en">Analytical Data</h4>' +
          '<div class="diagrams-row">' +
            '<div class="card"><div class="card-body" style="text-align:center;">' + triangleSvg + '</div></div>' +
            '<div class="card"><div class="card-body" style="text-align:center;">' + phSvg + '</div></div>' +
          '</div>' +
          '<div class="diagrams-row">' +
            '<div class="card"><div class="card-body" style="text-align:center;">' + humusSvg + '</div></div>' +
            '<div class="card"><div class="card-body" style="text-align:center;">' + fourthSvg + '</div></div>' +
          '</div>' +
        '</div>';
    }

    // Observații
    if (p.observations && p.observations.ro && p.observations.ro.length) {
      detail.innerHTML +=
        '<div class="profile-subsection">' +
          '<h4 lang="ro">Observații</h4><h4 lang="en">Observations</h4>' +
          '<ul class="observations-list">' +
          p.observations.ro.map(function (o) { return '<li>' + o + '</li>'; }).join('') +
          '</ul></div>';
    }

    container.appendChild(detail);
    drawProfileSketch(sketchId, p);
    applyLang();
  }
  // ── Tabel morfologic ────────────────────────────
  function buildMorphTable(p) {
    var html = '<table class="morph-table">' +
      '<tr><th>Orizont</th><th>Adânc.</th><th>Textură</th><th>Culoare</th><th>Descriere</th></tr>';
    p.horizons.forEach(function (hz) {
      var rgb = munsellToRgb(hz.munsell);
      html += '<tr>' +
        '<td class="hz-symbol">' + hz.symbol +
          (hz.isLamella ? '<span class="lamella-marker">L</span>' : '') + '</td>' +
        '<td>' + hz.top + '–' + hz.bottom + '</td>' +
        '<td>' + (hz.texture || '–') + '</td>' +
        '<td><span class="color-chip" style="background:' + rgb + '"></span> ' + hz.munsell + '</td>' +
        '<td>' + (hz.description ? hz.description.ro : '–') + '</td></tr>';
    });
    return html + '</table>';
  }

  // ── Schiță SVG a profilului ─────────────────────
  function drawProfileSketch(containerId, p) {
    var el = document.getElementById(containerId);
    if (!el || !p.horizons.length) return;

    var W = 200, PAD = 10;
    var maxDepth = 0;
    p.horizons.forEach(function (h) { if (h.bottom > maxDepth) maxDepth = h.bottom; });
    var scale = (400 - 2 * PAD) / maxDepth;
    var H = maxDepth * scale + 2 * PAD;

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="width:100%;max-width:200px;height:auto;border:1px solid #BCAAA4;border-radius:8px;background:#FAF6F0">';

    p.horizons.forEach(function (hz) {
      var y = PAD + hz.top * scale;
      var h = (hz.bottom - hz.top) * scale;
      var rgb = munsellToRgb(hz.munsell);
      svg += '<rect x="30" y="' + y + '" width="130" height="' + h + '" fill="' + rgb + '" stroke="#5D4037" stroke-width="0.5"/>';
      var ty = y + h / 2 + 4;
      var tc = isDark(rgb) ? '#FAF6F0' : '#2C1810';
      svg += '<text x="95" y="' + ty + '" text-anchor="middle" font-size="10" font-family="Source Sans 3,sans-serif" font-weight="600" fill="' + tc + '">' + hz.symbol + '</text>';
    });

    for (var d = 0; d <= maxDepth; d += 20) {
      var yy = PAD + d * scale;
      svg += '<line x1="22" y1="' + yy + '" x2="30" y2="' + yy + '" stroke="#8D6E63" stroke-width="0.7"/>';
      svg += '<text x="20" y="' + (yy + 3) + '" text-anchor="end" font-size="8" fill="#8D6E63">' + d + '</text>';
    }
    svg += '</svg>';
    el.innerHTML = svg;
  }

  

  // ── Galerie foto ────────────────────────────────
  function renderGallery(gallery) {
    var grid = document.getElementById('galleryGrid');
    if (!gallery || !gallery.images || gallery.images.length === 0) {
      grid.innerHTML = '<div class="empty-gallery">' +
        '<span lang="ro">Fotografiile vor fi adăugate după simpozion.</span>' +
        '<span lang="en">Photos will be added after the symposium.</span></div>';
      return;
    }

    var current = 0;
    var images = gallery.images;

    grid.innerHTML =
      '<div class="gallery-carousel">' +
        '<button class="carousel-arrow carousel-prev" aria-label="Previous">&#10094;</button>' +
        '<div class="carousel-slide">' +
          '<img src="' + gallery.folder + images[0] + '" alt="' + images[0] + '">' +
        '</div>' +
        '<button class="carousel-arrow carousel-next" aria-label="Next">&#10095;</button>' +
      '</div>' +
      '<div class="carousel-counter">' +
        '<span class="carousel-index">1</span> / ' + images.length +
      '</div>';

    var slideDiv = grid.querySelector('.carousel-slide img');
    var counter = grid.querySelector('.carousel-index');

    function showSlide(i) {
      current = (i + images.length) % images.length;
      slideDiv.src = gallery.folder + images[current];
      slideDiv.alt = images[current];
      counter.textContent = current + 1;
    }

    grid.querySelector('.carousel-prev').addEventListener('click', function () {
      showSlide(current - 1);
    });
    grid.querySelector('.carousel-next').addEventListener('click', function () {
      showSlide(current + 1);
    });
    // ── Lightbox zoom ──────────────────────────
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-arrow lightbox-prev" aria-label="Previous">&#10094;</button>' +
      '<img src="" alt="">' +
      '<button class="lightbox-arrow lightbox-next" aria-label="Next">&#10095;</button>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector('img');

    function openLightbox() {
      lbImg.src = gallery.folder + images[current];
      lightbox.classList.add('active');
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', function () {
      lightbox.classList.remove('active');
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      showSlide(current - 1);
      lbImg.src = gallery.folder + images[current];
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function (e) {
      e.stopPropagation();
      showSlide(current + 1);
      lbImg.src = gallery.folder + images[current];
    });

    slideDiv.style.cursor = 'zoom-in';
    slideDiv.addEventListener('click', openLightbox);
  }
	// ── Convertește datele din format edition-JSON în format profiles-engine ──
  function buildFakeProfileForCharts(p) {
    var gran = p.analyticalData.granulometry;
    var chem = p.analyticalData.chemistry;
    var horizons = [];
    for (var i = 0; i < gran.headers.length; i++) {
      var parts = gran.depths[i].split('-').map(Number);
      horizons.push({
        symbol: gran.headers[i],
        top: parts[0],
        bottom: parts[1],
        texture: (gran.clay[i] !== null) ? {
          sand: (gran.sandCoarse[i] || 0) + (gran.sandFine[i] || 0),
          silt: gran.silt[i],
          clay: gran.clay[i]
        } : null,
        textureName: { ro: (gran.textureClass && gran.textureClass[i]) || '', en: (gran.textureClass && gran.textureClass[i]) || '' },
        parameters: {
          pH: chem.pH ? chem.pH[i] : null,
          humus: chem.humus ? chem.humus[i] : null,
          CaCO3: chem.CaCO3 ? chem.CaCO3[i] : null,
          T: chem.T ? chem.T[i] : null
        }
      });
    }
    return { horizons: horizons };
  }
  
  // ── Munsell → RGB ───────────────────────────────
  var MUNSELL = {
    '10YR 2/1':'#1a1912','10YR 2.5/1':'#201f17','10YR 3/1':'#373022',
    '10YR 3/2':'#423626','10YR 3/3':'#4b3a1c','10YR 4/3':'#664e32',
    '10YR 4/4':'#6e4e2a','10YR 4/6':'#7a5514','10YR 5/3':'#846c4a',
    '10YR 5/4':'#8a6a41','10YR 5/6':'#926426','10YR 6/3':'#a68c6c',
    '10YR 6/4':'#ac8a5e','2.5Y 4/3':'#5e5838','2.5Y 5/2':'#7a7358',
    '2.5Y 5/3':'#80704b','2.5Y 5/4':'#87703c','2.5Y 5/6':'#9a8a1e',
    '2.5Y 6/2':'#9e967a','2.5Y 6/3':'#a5946c','2.5Y 6/4':'#ac915c',
    '7.5YR 3/2':'#463024','7.5YR 3/3':'#4e301c','7.5YR 4/3':'#694a30',
    '7.5YR 4/6':'#7d4416','7.5YR 5/4':'#8c663e','7.5YR 5/6':'#966026',
    '7.5YR 6/4':'#af875f','7.5YR 6/6':'#b6803c',
    '10GY 5/1':'#6e7e72'
  };
  function munsellToRgb(code) {
    if (!code) return '#BCAAA4';
    if (typeof window.getMunsellRgb === 'function') return window.getMunsellRgb(code);
    return MUNSELL[code] || '#BCAAA4';
  }
  function isDark(hex) {
    if (!hex || hex.charAt(0) !== '#') return false;
    var r = parseInt(hex.substr(1,2),16), g = parseInt(hex.substr(3,2),16), b = parseInt(hex.substr(5,2),16);
    return (r*0.299 + g*0.587 + b*0.114) < 128;
  }
  function truncate(s, n) { return s.length > n ? s.substring(0, n) + '\u2026' : s; }
  function applyLang() { if (typeof window.applyCurrentLang === 'function') window.applyCurrentLang(); }

})();
