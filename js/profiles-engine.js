// ================================================================
//  MUNSELL → RGB LOOKUP TABLE
//  ★ Culorile cele mai frecvente în soluri
// ================================================================
const MUNSELL_RGB = {
  "10YR 2/1": [26,25,22],   "10YR 2/2": [35,30,15],
  "10YR 3/1": [55,48,42],   "10YR 3/2": [66,54,38],   "10YR 3/3": [75,58,28],
  "10YR 4/2": [96,80,56],   "10YR 4/3": [102,78,50],   "10YR 4/4": [110,78,42],
  "10YR 5/2": [127,110,88], "10YR 5/3": [132,108,74],  "10YR 5/4": [138,106,65],
  "10YR 5/6": [146,100,38], "10YR 5/8": [155,95,20],
  "10YR 6/2": [160,145,120],"10YR 6/3": [166,140,108], "10YR 6/4": [172,138,94],
  "10YR 6/6": [180,130,60],
  "10YR 7/2": [195,180,155],"10YR 7/3": [200,175,138], "10YR 7/4": [205,170,122],
  "10YR 8/1": [220,215,200],"10YR 8/2": [225,210,180],
  "7.5YR 3/2": [70,48,36],  "7.5YR 3/3": [78,48,28],   "7.5YR 3/4": [85,48,22],
  "7.5YR 4/2": [98,76,58],  "7.5YR 4/3": [105,74,48],  "7.5YR 4/4": [112,72,38],
  "7.5YR 4/6": [125,68,22],
  "7.5YR 5/4": [140,102,62],"7.5YR 5/6": [150,96,38],  "7.5YR 5/8": [158,90,20],
  "7.5YR 6/4": [175,135,95],"7.5YR 6/6": [182,128,60],
  "5YR 3/2": [72,44,35],    "5YR 3/3": [80,42,28],     "5YR 3/4": [88,40,20],
  "5YR 4/3": [108,68,45],   "5YR 4/4": [115,62,35],    "5YR 4/6": [125,58,22],
  "5YR 5/4": [142,95,60],   "5YR 5/6": [152,88,38],
  "2.5YR 3/2": [72,40,36],  "2.5YR 3/4": [88,35,20],   "2.5YR 4/4": [115,55,35],
  "2.5Y 5/2": [122,115,88], "2.5Y 5/3": [128,112,75],  "2.5Y 5/4": [135,110,60],
  "2.5Y 6/2": [158,150,122],"2.5Y 6/3": [165,148,108], "2.5Y 6/4": [172,145,92],
  "2.5Y 7/2": [192,182,155],"2.5Y 7/3": [198,178,138], "2.5Y 7/4": [205,175,120],
  "5Y 5/2":   [118,118,88], "5Y 6/2":   [155,155,122], "5Y 7/2":   [188,185,152],
  "GLEY1 5/N":[120,120,120],"GLEY1 4/N":[95,95,95],
};

function munsellToRgb(m) {
  const key = `${m.hue} ${m.value}/${m.chroma}`;
  if (MUNSELL_RGB[key]) return MUNSELL_RGB[key];
  // Fallback: approximate from nearby values
  let bestKey = null, bestDist = Infinity;
  for (const k in MUNSELL_RGB) {
    const parts = k.match(/(\d+\.?\d*\w+)\s+(\d+)\/(\d+)/);
    if (!parts || parts[1] !== m.hue) continue;
    const d = Math.abs(+parts[2] - m.value) + Math.abs(+parts[3] - m.chroma);
    if (d < bestDist) { bestDist = d; bestKey = k; }
  }
  return bestKey ? MUNSELL_RGB[bestKey] : [140,120,100];
}

function rgbStr(rgb) { return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`; }

// ================================================================
//  LANGUAGE
// ================================================================
let lang = 'ro';
function toggleLang() {
  lang = lang === 'ro' ? 'en' : 'ro';
  document.body.classList.toggle('lang-en', lang === 'en');
  document.querySelector('.lang-toggle').textContent = lang === 'ro' ? 'EN' : 'RO';
  document.documentElement.lang = lang;
  renderProfile(currentProfileIndex);
}
function t(obj) { return typeof obj === 'string' ? obj : (obj[lang] || obj['ro']); }

// ================================================================
//  TOOLTIP
// ================================================================
const tooltip = document.getElementById('tooltip');
function showTooltip(evt, html) {
  tooltip.innerHTML = html;
  tooltip.classList.add('visible');
  const r = tooltip.getBoundingClientRect();
  let x = evt.clientX + 14, y = evt.clientY - 10;
  if (x + r.width > window.innerWidth - 10) x = evt.clientX - r.width - 14;
  if (y + r.height > window.innerHeight - 10) y = evt.clientY - r.height - 10;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}
function hideTooltip() { tooltip.classList.remove('visible'); }

// ================================================================
//  PROFILE SKETCH (SVG)
// ================================================================
function renderProfileSketch(profile) {
  const W = 240, PAD_TOP = 30, PAD_BOT = 20, PAD_LEFT = 55, PAD_RIGHT = 65;
  const maxDepth = Math.max(...profile.horizons.map(h => h.bottom));
  const H = Math.max(320, maxDepth * 2.2) + PAD_TOP + PAD_BOT;
  const colW = W - PAD_LEFT - PAD_RIGHT;
  const colH = H - PAD_TOP - PAD_BOT;
  const scale = colH / maxDepth;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;">`;

  // Title
  svg += `<text x="${W/2}" y="18" text-anchor="middle" class="title-label">${lang==='ro'?'Profilul':'Profile'}</text>`;

  // Depth axis
  for (let d = 0; d <= maxDepth; d += 20) {
    const y = PAD_TOP + d * scale;
    svg += `<line x1="${PAD_LEFT-4}" y1="${y}" x2="${PAD_LEFT}" y2="${y}" stroke="#8D6E63" stroke-width="1"/>`;
    svg += `<text x="${PAD_LEFT-8}" y="${y+4}" text-anchor="end" class="axis-tick">${d}</text>`;
  }
  svg += `<text x="12" y="${PAD_TOP + colH/2}" text-anchor="middle" transform="rotate(-90, 12, ${PAD_TOP+colH/2})" class="axis-label">${lang==='ro'?'Adâncime (cm)':'Depth (cm)'}</text>`;

  // Horizons
  profile.horizons.forEach((hz, i) => {
    const y = PAD_TOP + hz.top * scale;
    const h = (hz.bottom - hz.top) * scale;
    const rgb = munsellToRgb(hz.munsell);
    const fill = rgbStr(rgb);

    // Horizon rectangle
    svg += `<rect x="${PAD_LEFT}" y="${y}" width="${colW}" height="${h}" fill="${fill}" stroke="#3E2723" stroke-width="0.8"
      class="hz-rect" data-idx="${i}" style="cursor:pointer;"/>`;

    // Horizon boundary (dashed for gradual)
    if (i > 0) {
      svg += `<line x1="${PAD_LEFT}" y1="${y}" x2="${PAD_LEFT+colW}" y2="${y}"
        stroke="#FAF6F0" stroke-width="1" stroke-dasharray="4,3" opacity="0.7"/>`;
    }

    // Horizon label (right side)
    const labelY = y + h/2 + 4;
    svg += `<text x="${PAD_LEFT+colW+8}" y="${labelY}" class="axis-label" font-weight="600" fill="#3E2723">${hz.symbol}</text>`;

    // Munsell notation (right side, below symbol)
    const mStr = `${hz.munsell.hue} ${hz.munsell.value}/${hz.munsell.chroma}`;
    svg += `<text x="${PAD_LEFT+colW+8}" y="${labelY+14}" class="axis-tick" font-size="8.5">${mStr}</text>`;

    // Depth label (left side, at boundaries)
    if (i === 0) {
      svg += `<text x="${PAD_LEFT-8}" y="${y+4}" text-anchor="end" class="axis-tick" font-weight="600">0</text>`;
    }
  });

  // Frame
  svg += `<rect x="${PAD_LEFT}" y="${PAD_TOP}" width="${colW}" height="${colH}" fill="none" stroke="#3E2723" stroke-width="1.5" rx="2"/>`;

  // Surface line (grass)
  svg += `<line x1="${PAD_LEFT-6}" y1="${PAD_TOP}" x2="${PAD_LEFT+colW+6}" y2="${PAD_TOP}" stroke="#4A7C5C" stroke-width="3"/>`;

  svg += `</svg>`;
  return svg;
}

// ================================================================
//  SRTS TEXTURAL TRIANGLE (SVG)
// ================================================================
function renderTexturalTriangle(profile) {
  const W = 460, H = 430, PAD = 50;
  const triH = (W - 2*PAD) * Math.sin(Math.PI/3);
  const cx = W/2, botY = PAD + triH;
  const leftX = PAD, rightX = W - PAD, topY = PAD;

  // SRTS ternary: bottom-left=100% Nisip, bottom-right=100% Praf, top=100% Argilă
  function ternaryToXY(sand, silt, clay) {
    const x = leftX + (rightX-leftX) * (silt/100 + clay/200);
    const y = botY - triH * (clay/100);
    return [x, y];
  }

  function polyPoints(verts) {
    return verts.map(v => { const p = ternaryToXY(v[0],v[1],v[2]); return p[0]+','+p[1]; }).join(' ');
  }

  let svg = '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:'+W+'px;">';
  svg += '<text x="'+cx+'" y="16" text-anchor="middle" class="title-label">'+(lang==='ro'?'Diagrama triunghiulară a texturii SRTS':'SRTS Textural Triangle Diagram')+'</text>';

  // Triangle outline
  svg += '<polygon points="'+leftX+','+botY+' '+rightX+','+botY+' '+cx+','+topY+'" fill="#FAF6F0" stroke="#3E2723" stroke-width="1.5"/>';

  // Grid lines every 10%
  for (var p = 10; p < 100; p += 10) {
    var p1=ternaryToXY(100-p,0,p), p2=ternaryToXY(0,100-p,p);
    svg += '<line x1="'+p1[0]+'" y1="'+p1[1]+'" x2="'+p2[0]+'" y2="'+p2[1]+'" class="grid-line" opacity="0.4"/>';
    var p3=ternaryToXY(p,100-p,0), p4=ternaryToXY(p,0,100-p);
    svg += '<line x1="'+p3[0]+'" y1="'+p3[1]+'" x2="'+p4[0]+'" y2="'+p4[1]+'" class="grid-line" opacity="0.4"/>';
    var p5=ternaryToXY(100-p,p,0), p6=ternaryToXY(0,p,100-p);
    svg += '<line x1="'+p5[0]+'" y1="'+p5[1]+'" x2="'+p6[0]+'" y2="'+p6[1]+'" class="grid-line" opacity="0.4"/>';
  }

  // SRTS texture classes as polygons [sand, silt, clay]
  var classes = [
    { id:'N',  name:'N',  nameRo:'Nisip',              fill:'#E8D5B0', pts:[[100,0,0],[68,32,0],[63,32,5],[95,0,5]] },
    { id:'U',  name:'U',  nameRo:'Nisip lutos',         fill:'#DECCA0', pts:[[94,0,6],[62,32,6],[56,32,12],[88,0,12]] },
    { id:'S',  name:'S',  nameRo:'Lut nisipos',         fill:'#D4C090', pts:[[87,0,13],[55,32,13],[48,32,20],[80,0,20]] },
    { id:'SS', name:'SS', nameRo:'Lut nis. prăfos',     fill:'#C8C0A0', pts:[[67,33,0],[50,50,0],[30,50,20],[47,33,20]] },
    { id:'SP', name:'SP', nameRo:'Praf',                fill:'#C0C8B0', pts:[[49,51,0],[0,100,0],[0,80,20],[29,51,20]] },
    { id:'LN', name:'LN', nameRo:'Lut nisipo-argilos',  fill:'#C0B080', pts:[[79,0,21],[65,14,21],[54,14,32],[68,0,32]] },
    { id:'LL', name:'LL', nameRo:'Lut mediu',           fill:'#B8A880', pts:[[64,15,21],[47,32,21],[36,32,32],[53,15,32]] },
    { id:'LP', name:'LP', nameRo:'Lut prăfos',          fill:'#B0B090', pts:[[46,33,21],[0,79,21],[0,68,32],[35,33,32]] },
    { id:'TN', name:'TN', nameRo:'Argilă nisipoasă',    fill:'#A89070', pts:[[67,0,33],[53,14,33],[41,14,45],[55,0,45]] },
    { id:'TT', name:'TT', nameRo:'Lut argilos mediu',   fill:'#A08868', pts:[[52,15,33],[35,32,33],[23,32,45],[40,15,45]] },
    { id:'TP', name:'TP', nameRo:'Lut argilo-prăfos',   fill:'#988878', pts:[[34,33,33],[0,67,33],[0,55,45],[22,33,45]] },
    { id:'AL', name:'AL', nameRo:'Argilă lutoasă',      fill:'#907860', pts:[[54,0,46],[22,32,46],[8,32,60],[40,0,60]] },
    { id:'AP', name:'AP', nameRo:'Argilă prăfoasă',     fill:'#887868', pts:[[21,33,46],[0,54,46],[0,40,60],[7,33,60]] },
    { id:'AM', name:'AM', nameRo:'Argilă medie',        fill:'#806850', pts:[[39,0,61],[0,39,61],[0,30,70],[30,0,70]] },
    { id:'AF', name:'AF', nameRo:'Argilă fină',         fill:'#705840', pts:[[29,0,71],[0,29,71],[0,0,100]] },
  ];

  // Draw class polygons
  classes.forEach(function(c) {
    svg += '<polygon points="'+polyPoints(c.pts)+'" fill="'+c.fill+'" stroke="#8D6E63" stroke-width="0.6" opacity="0.6"/>';
  });

  // Class labels at centroids
  // Class labels — only symbols
  classes.forEach(function(c) {
    var sx=0, sy=0, sl=0;
    c.pts.forEach(function(v){ sx+=v[0]; sy+=v[1]; sl+=v[2]; });
    var n=c.pts.length;
    var ct = ternaryToXY(sx/n, sy/n, sl/n);
    svg += '<text x="'+ct[0]+'" y="'+(ct[1]+3)+'" text-anchor="middle" font-size="8" fill="#3E2723" font-weight="700" font-family="JetBrains Mono,monospace">'+c.id+'</text>';
  });

  // Axis labels
  svg += '<text x="'+cx+'" y="'+(botY+35)+'" text-anchor="middle" class="axis-label">'+(lang==='ro'?'% Nisip (2–0,02 mm)':'% Sand (2–0.02 mm)')+'</text>';
  // Midpoint of left edge (Argilă)
  var lmx = (leftX + cx) / 2 - 15;
  var lmy = (botY + topY) / 2;
  svg += '<text x="'+lmx+'" y="'+lmy+'" text-anchor="middle" class="axis-label" transform="rotate(-60,'+lmx+','+lmy+')">'+(lang==='ro'?'% Argilă (<0,002 mm)':'% Clay (<0.002 mm)')+'</text>';

  // Midpoint of right edge (Praf)
  var rmx = (rightX + cx) / 2 + 15;
  var rmy = (botY + topY) / 2;
  svg += '<text x="'+rmx+'" y="'+rmy+'" text-anchor="middle" class="axis-label" transform="rotate(60,'+rmx+','+rmy+')">'+(lang==='ro'?'% Praf (0,002–0,02 mm)':'% Silt (0.002–0.02 mm)')+'</text>';

  // Axis ticks
  for (var p = 0; p <= 100; p += 20) {
    var bx = leftX + (rightX-leftX)*(1-p/100);
    svg += '<text x="'+bx+'" y="'+(botY+16)+'" text-anchor="middle" class="axis-tick">'+p+'</text>';
  }


  // Plot horizon data points
  var colors = ['#C8A951','#4A7C5C','#B85C4A','#4A6B8B','#8B6B4A','#6B4A8B'];
  profile.horizons.forEach(function(hz, i) {
    if (!hz.texture) return;
    var pt = ternaryToXY(hz.texture.sand, hz.texture.silt, hz.texture.clay);
    var col = colors[i % colors.length];
    svg += '<circle cx="'+pt[0]+'" cy="'+pt[1]+'" r="7" fill="'+col+'" class="data-dot" onmouseenter="showTooltip(event, \''+hz.symbol+'<br>'+hz.texture.sand+'% '+(lang==='ro'?'nisip':'sand')+'<br>'+hz.texture.silt+'% '+(lang==='ro'?'praf':'silt')+'<br>'+hz.texture.clay+'% '+(lang==='ro'?'argilă':'clay')+'<br>'+t(hz.textureName)+'\')" onmouseleave="hideTooltip()" style="cursor:pointer;"/>';
    svg += '<text x="'+(pt[0]+10)+'" y="'+(pt[1]+4)+'" font-size="9" font-weight="600" fill="'+col+'">'+hz.symbol+'</text>';
  });

  svg += '</svg>';
  return svg;
}

// ================================================================
//  DEPTH FUNCTION CHARTS (SVG)
// ================================================================
function renderDepthChart(profile, paramKey, paramLabel, unit, color, xMin, xMax) {
  const W = 260, H = 400, PAD = { t: 35, r: 20, b: 35, l: 50 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const data = [];
  profile.horizons.forEach(hz => {
    const v = hz.parameters[paramKey];
    if (v == null) return;
    const midDepth = (hz.top + hz.bottom) / 2;
    data.push({ depth: midDepth, top: hz.top, bottom: hz.bottom, value: v, symbol: hz.symbol });
  });

  if (data.length === 0) return '';

  const maxDepth = Math.max(...profile.horizons.map(h => h.bottom));
  const minVal = (xMin !== null) ? xMin : 0;
  const maxVal = (xMax !== null) ? xMax : Math.max(...data.map(d => d.value)) * 1.15;

  const scaleX = v => PAD.l + (v - minVal) / (maxVal - minVal) * plotW;
  const scaleY = d => PAD.t + (d / maxDepth) * plotH;

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;">`;

  // Title
  svg += `<text x="${W/2}" y="18" text-anchor="middle" class="title-label">${paramLabel} (${unit})</text>`;

  // Grid
  const nTicksX = 5;
  for (let i = 0; i <= nTicksX; i++) {
    const v = minVal + (maxVal - minVal) * i / nTicksX;
    const x = scaleX(v);
    svg += `<line x1="${x}" y1="${PAD.t}" x2="${x}" y2="${PAD.t+plotH}" class="grid-line"/>`;
    svg += `<text x="${x}" y="${PAD.t+plotH+14}" text-anchor="middle" class="axis-tick">${v.toFixed(1)}</text>`;
  }

  // Depth ticks
  for (let d = 0; d <= maxDepth; d += 20) {
    const y = scaleY(d);
    svg += `<line x1="${PAD.l}" y1="${y}" x2="${PAD.l+plotW}" y2="${y}" class="grid-line" opacity="0.3"/>`;
    svg += `<text x="${PAD.l-6}" y="${y+4}" text-anchor="end" class="axis-tick">${d}</text>`;
  }

  // Depth label
  svg += `<text x="14" y="${PAD.t+plotH/2}" text-anchor="middle" transform="rotate(-90,14,${PAD.t+plotH/2})" class="axis-label">cm</text>`;

  // Step function (horizontal bars at each horizon)
  data.forEach(d => {
    const x = scaleX(d.value);
    const y1 = scaleY(d.top);
    const y2 = scaleY(d.bottom);
    // Horizontal bar
    svg += `<rect x="${PAD.l}" y="${y1}" width="${x-PAD.l}" height="${y2-y1}"
      fill="${color}" opacity="0.15" stroke="none"/>`;
    // Step line
    svg += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="2.5"/>`;
  });

  // Connect steps
  for (let i = 0; i < data.length - 1; i++) {
    const x1 = scaleX(data[i].value);
    const x2 = scaleX(data[i+1].value);
    const y = scaleY(data[i].bottom);
    svg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3"/>`;
  }

  // Data points
  data.forEach(d => {
    const x = scaleX(d.value);
    const y = scaleY((d.top + d.bottom) / 2);
    svg += `<circle cx="${x}" cy="${y}" r="4.5" fill="${color}" class="data-dot"
      onmouseenter="showTooltip(event, '${d.symbol}: ${d.value} ${unit}<br>${d.top}–${d.bottom} cm')"
      onmouseleave="hideTooltip()"
      style="cursor:pointer;"/>`;
  });

  // Plot frame
  svg += `<rect x="${PAD.l}" y="${PAD.t}" width="${plotW}" height="${plotH}" fill="none" stroke="#8D6E63" stroke-width="1"/>`;

  svg += `</svg>`;
  return svg;
}

// ================================================================
//  ★ FALLBACK: CaCO₃ sau T (capacitatea de schimb cationic)
// ================================================================
function renderCaCO3OrT(profile) {
  // Verifică dacă cel puțin un orizont are CaCO₃ > 0.5
  const hasCaCO3 = profile.horizons.some(hz =>
    hz.parameters.CaCO3 != null && hz.parameters.CaCO3 > 0.5
  );

  if (hasCaCO3) {
    return renderDepthChart(profile, 'CaCO3', 'CaCO₃', '%', '#C8A951', 0, 25);
  }

  // Fallback → graficul T
  // Calculăm xMax dinamic (rotunjit la zecimala superioară de 10)
  const tValues = profile.horizons
    .map(hz => hz.parameters.T)
    .filter(v => v != null);

  if (tValues.length < 2) return ''; // nu avem suficiente date

  const tMax = Math.ceil(Math.max(...tValues) / 10) * 10;

  return renderDepthChart(
    profile,
    'T',
    lang === 'ro' ? 'T (cap. schimb cat.)' : 'T (CEC)',
    'me/100g',
    '#8B6B4A',   // maro-bej, diferit de celelalte grafice
    0,
    tMax
  );
}

// ================================================================
//  RENDER PROFILE PAGE
// ================================================================
let currentProfileIndex = 0;

function renderTabs() {
  const tabs = document.getElementById('profileTabs');
  tabs.innerHTML = PROFILES_DATA.map((p, i) =>
    `<button class="profile-tab ${i===currentProfileIndex?'active':''}" onclick="selectProfile(${i})">
      ${t(p.name)}
      <span class="tab-sub">${p.classification.srts}</span>
    </button>`
  ).join('');
}

function selectProfile(i) {
  currentProfileIndex = i;
  renderTabs();
  renderProfile(i);
}

function renderProfile(i) {
  const p = PROFILES_DATA[i];
  const grid = document.getElementById('profileGrid');

  // Photo section
  const photoHtml = p.photo
    ? `<img src="${p.photo}" alt="${t(p.name)}">`
    : `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
       <span>${lang==='ro'?'Fotografie — în curând':'Photo — coming soon'}</span>`;

  grid.innerHTML = `
    <!-- TOP ROW: Photo + Profile Sketch + Classification -->
    <div class="profile-top-row">
      <div class="card">
        <div class="photo-slot">${photoHtml}</div>
      </div>

      <div class="card">
        <div class="card-body" style="text-align:center;">
          ${renderProfileSketch(p)}
        </div>
      </div>

      <div class="card">
        <dl class="profile-meta">
          <dt>${lang==='ro'?'Clasificare SRTS':'SRTS Classification'}</dt>
          <dd>${p.classification.srts}</dd>
          <dt>${lang==='ro'?'Clasificare WRB':'WRB Classification'}</dt>
          <dd>${p.classification.wrb}</dd>
          <dt>${lang==='ro'?'Localizare':'Location'}</dt>
          <dd>${t(p.location.description)}</dd>
          <dt>${lang==='ro'?'Folosință':'Land Use'}</dt>
          <dd>${t(p.landuse)}</dd>
          <dt>${lang==='ro'?'Material parental':'Parent Material'}</dt>
          <dd>${t(p.parentMaterial)}</dd>
          <dt>${lang==='ro'?'Coordonate':'Coordinates'}</dt>
          <dd style="font-family:var(--font-mono);font-size:0.85rem;">${p.location.lat.toFixed(4)}°N, ${p.location.lng.toFixed(4)}°E</dd>
        </dl>
      </div>
    </div>
	<!-- HORIZON TABLE -->
    <div class="card description-card">
      <div class="card-header">
        <h3>${lang==='ro'?'Descrierea Morfologică a Orizonturilor':'Morphological Description of Horizons'}</h3>
        <span class="badge">${p.horizons.length} ${lang==='ro'?'orizonturi':'horizons'}</span>
      </div>
      <div class="card-body" style="overflow-x:auto;">
        <table class="horizon-table">
          <thead>
            <tr>
              <th>${lang==='ro'?'Orizont':'Horizon'}</th>
              <th>${lang==='ro'?'Adâncime':'Depth'}</th>
              <th>Munsell</th>
              <th>${lang==='ro'?'Textură':'Texture'}</th>
              <th>${lang==='ro'?'Descriere':'Description'}</th>
            </tr>
          </thead>
          <tbody>
            ${p.horizons.map(hz => {
              const rgb = munsellToRgb(hz.munsell);
              const mStr = hz.munsell.hue + ' ' + hz.munsell.value + '/' + hz.munsell.chroma;
              return '<tr>' +
                '<td><strong>' + hz.symbol + '</strong></td>' +
                '<td style="font-family:var(--font-mono);font-size:0.85rem;white-space:nowrap;">' + hz.top + '–' + hz.bottom + ' cm</td>' +
                '<td style="white-space:nowrap;"><span class="hz-color-chip" style="background:' + rgbStr(rgb) + ';"></span>' + mStr + '</td>' +
                '<td>' + t(hz.textureName) + '</td>' +
                '<td style="max-width:340px;">' + t(hz.description) + '</td>' +
              '</tr>';
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <!-- DIAGRAMS ROW -->
    <div class="diagrams-row">
      <div class="card">
        <div class="card-body" style="text-align:center;">
          ${renderTexturalTriangle(p)}
        </div>
      </div>
      <div class="card">
        <div class="card-body" style="text-align:center;">
          // ${renderDepthChart(p, 'pH', 'pH', '', '#4A6B8B', 3.5, 9)}
        </div>
      </div>
    </div>

    <div class="diagrams-row">
      <div class="card">
        <div class="card-body" style="text-align:center;">
          ${renderDepthChart(p, 'humus', lang==='ro'?'Humus':'Humus', '%', '#4A7C5C', 0, 8)}
        </div>
      </div>
      <div class="card">
        <div class="card-body" style="text-align:center;">
          ${renderCaCO3OrT(p)}
        </div>
      </div>
    </div>    
  `;
}

// ================================================================
//  INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#','');
  let startIndex = 0;
  if (hash) {
    const idx = PROFILES_DATA.findIndex(p => p.id === hash);
    if (idx >= 0) startIndex = idx;
  }
  currentProfileIndex = startIndex;
  renderTabs();
  renderProfile(currentProfileIndex);
});
