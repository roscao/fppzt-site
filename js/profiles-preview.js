// ============================================================
// MINI PROFILE SKETCHES (Munsell-colored)
// ★ EDITARE: Adăugați culori Munsell noi în tabelul de mai jos
//   dacă profilele au culori care nu sunt acoperite.
// ============================================================
const MUNSELL = {
  "10YR 2/1":[26,25,22],  "10YR 3/1":[55,48,42],  "10YR 3/2":[66,54,38],
  "10YR 3/3":[75,58,28],  "10YR 4/3":[102,78,50],  "10YR 5/3":[132,108,74],
  "10YR 5/4":[138,106,65],"10YR 6/4":[172,138,94],
  "7.5YR 4/4":[112,72,38],"2.5Y 6/3":[165,148,108],"2.5Y 7/2":[192,182,155],
};

function mRgb(hue, val, chr) {
  const k = hue+' '+val+'/'+chr;
  if (MUNSELL[k]) return 'rgb('+MUNSELL[k].join(',')+')';
  let best=null, bd=99;
  for (const key in MUNSELL) {
    const m = key.match(/(.+)\s+(\d+)\/(\d+)/);
    if (!m || m[1]!==hue) continue;
    const d = Math.abs(+m[2]-val)+Math.abs(+m[3]-chr);
    if (d<bd){bd=d;best=key;}
  }
  return best ? 'rgb('+MUNSELL[best].join(',')+')' : 'rgb(140,120,100)';
}

// ★ EDITARE: Datele orizonturilor pentru schițele mini din pagina principală.
//   Când adăugați un profil nou, adăugați și intrarea corespunzătoare aici.
const MINI_PROFILES = {
  P1: [
    {sym:'Ap',  t:0,  b:28,  hue:'10YR',v:3,c:2},
    {sym:'Am',  t:28, b:52,  hue:'10YR',v:3,c:3},
    {sym:'A/C', t:52, b:78,  hue:'10YR',v:4,c:3},
    {sym:'Ck1', t:78, b:120, hue:'10YR',v:5,c:4},
    {sym:'Ck2', t:120,b:170, hue:'10YR',v:6,c:4},
  ],
  P2: [
    {sym:'Ap',  t:0,  b:22,  hue:'10YR',v:3,c:1},
    {sym:'Am',  t:22, b:45,  hue:'10YR',v:3,c:2},
    {sym:'Bv',  t:45, b:72,  hue:'7.5YR',v:4,c:4},
    {sym:'BCk', t:72, b:110, hue:'10YR',v:5,c:3},
    {sym:'Ck',  t:110,b:150, hue:'2.5Y',v:6,c:3},
  ],
  P3: [
    {sym:'Am',  t:0,  b:30,  hue:'10YR',v:2,c:1},
    {sym:'ACk', t:30, b:50,  hue:'10YR',v:3,c:2},
    {sym:'R',   t:50, b:70,  hue:'2.5Y',v:7,c:2},
  ],
  P4: [
    {sym:'Am',  t:0,  b:30,  hue:'10YR',v:2,c:1},
    {sym:'ACk', t:30, b:50,  hue:'10YR',v:3,c:2},
    {sym:'R',   t:50, b:70,  hue:'2.5Y',v:7,c:2},
  ]
};

function drawMiniSketch(containerId, horizons) {
  const W=140, PTOP=20, PBOT=10, PL=35, PR=40;
  const maxD = Math.max(...horizons.map(h=>h.b));
  const H = Math.max(180, maxD*1.3)+PTOP+PBOT;
  const colW=W-PL-PR, colH=H-PTOP-PBOT, sc=colH/maxD;

  let s = '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:'+W+'px;">';
  s += '<line x1="'+(PL-4)+'" y1="'+PTOP+'" x2="'+(PL+colW+4)+'" y2="'+PTOP+'" stroke="#4A7C5C" stroke-width="3"/>';

  horizons.forEach((hz,i) => {
    const y=PTOP+hz.t*sc, h=(hz.b-hz.t)*sc;
    const fill = mRgb(hz.hue,hz.v,hz.c);
    s += '<rect x="'+PL+'" y="'+y+'" width="'+colW+'" height="'+h+'" fill="'+fill+'" stroke="#3E2723" stroke-width="0.7"/>';
    if(i>0) s += '<line x1="'+PL+'" y1="'+y+'" x2="'+(PL+colW)+'" y2="'+y+'" stroke="#FAF6F0" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.6"/>';
    s += '<text x="'+(PL+colW+5)+'" y="'+(y+h/2+4)+'" font-family="JetBrains Mono,monospace" font-size="8" fill="#3E2723" font-weight="600">'+hz.sym+'</text>';
  });

  for(let d=0;d<=maxD;d+=40){
    const y=PTOP+d*sc;
    s += '<text x="'+(PL-5)+'" y="'+(y+3)+'" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="7.5" fill="#8D6E63">'+d+'</text>';
  }

  s += '<rect x="'+PL+'" y="'+PTOP+'" width="'+colW+'" height="'+colH+'" fill="none" stroke="#3E2723" stroke-width="1.2" rx="1"/>';
  s += '<text x="8" y="'+(PTOP+colH/2)+'" text-anchor="middle" transform="rotate(-90,8,'+(PTOP+colH/2)+')" font-family="Source Sans 3,sans-serif" font-size="8" fill="#8D6E63">cm</text>';
  s += '</svg>';

  const el = document.getElementById(containerId);
  if(el) el.innerHTML = s;
}

// Draw all mini sketches on load
document.addEventListener('DOMContentLoaded', function() {
  for (const id in MINI_PROFILES) {
    drawMiniSketch('sketch-'+id, MINI_PROFILES[id]);
  }
});
