// ================================================================
//  ★ SOIL PROFILE DATA — EDITARE: Modificați/adăugați profile aici
//     Acest bloc poate fi mutat într-un fișier extern:
//     data/profiles-2026.json
// ================================================================
const PROFILES_DATA = [
  {
    id: "P1-2026",
    name: { ro: "Profilul 1 — Cucuteni (Dl. lui Viteaz)", en: "Profile 1 — Cucuteni (Dl. lui Viteaz)" },
    classification: {
      srts: "Cernoziom tipic moderat humifer",
      wrb: "Haplic Chernozem (Loamic, Pachic)"
    },
    location: {
      lat: 47.208, lng: 27.005,
      description: { ro: "Platoul Cucuteni (Dl. lui Viteaz), pe depozit loessoid", en: "Cucuteni (Dl. lui Viteaz) Plateau, on loessoid deposit" }
    },
    landuse: { ro: "Teren arabil — grâu de toamnă", en: "Arable land — winter wheat" },
    parentMaterial: { ro: "Depozit loessoid carbonatic", en: "Calcareous loessoid deposit" },
    photo: "photos/2026/P1.jpeg", // ★ Înlocuiți cu "photos/2026-P1.jpg" când aveți fotografia
    horizons: [
      {
        symbol: "Ap",
        top: 0, bottom: 28,
        munsell: { hue: "10YR", value: 3, chroma: 2 },
        textureName: { ro: "Luto-argiloasă", en: "Clay loam" },
        texture: { sand: 28, silt: 37, clay: 35 },
        description: {
          ro: "Umed, brun-cenușiu foarte închis; structură grăunțoasă fină; consistență friabilă; abundent permeabil de rădăcini; limită netedă.",
          en: "Moist, very dark grayish brown; fine granular structure; friable; abundant roots; smooth boundary."
        },
        parameters: { pH: 7.1, humus: 3.8, CaCO3: 0, SB: 28.5 }
      },
      {
        symbol: "Am",
        top: 28, bottom: 52,
        munsell: { hue: "10YR", value: 3, chroma: 3 },
        textureName: { ro: "Luto-argiloasă", en: "Clay loam" },
        texture: { sand: 26, silt: 38, clay: 36 },
        description: {
          ro: "Umed, brun închis; structură poliedrică subangulară medie; consistență friabilă; rădăcini comune; limită graduală.",
          en: "Moist, dark brown; medium subangular blocky structure; friable; common roots; gradual boundary."
        },
        parameters: { pH: 7.3, humus: 2.9, CaCO3: 0, SB: 30.2 }
      },
      {
        symbol: "A/C",
        top: 52, bottom: 78,
        munsell: { hue: "10YR", value: 4, chroma: 3 },
        textureName: { ro: "Lutoasă", en: "Loam" },
        texture: { sand: 32, silt: 40, clay: 28 },
        description: {
          ro: "Umed, brun; structură poliedrică angulară grosieră; pseudomicelii de CaCO3; rădăcini rare; limită graduală.",
          en: "Moist, brown; coarse angular blocky structure; CaCO3 pseudomycelia; rare roots; gradual boundary."
        },
        parameters: { pH: 7.8, humus: 1.4, CaCO3: 4.2, SB: 32.0 }
      },
      {
        symbol: "Ck1",
        top: 78, bottom: 120,
        munsell: { hue: "10YR", value: 5, chroma: 4 },
        textureName: { ro: "Lutoasă", en: "Loam" },
        texture: { sand: 35, silt: 40, clay: 25 },
        description: {
          ro: "Umed, brun-gălbui; masiv; concreții carbonatice; efervescență puternică la HCl.",
          en: "Moist, yellowish brown; massive; carbonate concretions; strong effervescence with HCl."
        },
        parameters: { pH: 8.2, humus: 0.6, CaCO3: 14.5, SB: 33.1 }
      },
      {
        symbol: "Ck2",
        top: 120, bottom: 170,
        munsell: { hue: "10YR", value: 6, chroma: 4 },
        textureName: { ro: "Luto-nisipoasă", en: "Sandy loam" },
        texture: { sand: 48, silt: 33, clay: 19 },
        description: {
          ro: "Umed, brun-gălbui deschis; masiv; loess tipic; abundente concreții carbonatice.",
          en: "Moist, light yellowish brown; massive; typical loess; abundant carbonate concretions."
        },
        parameters: { pH: 8.4, humus: 0.2, CaCO3: 18.7, SB: 28.5 }
      }
    ]
  },
  {
    id: "P2-2026",
    name: { ro: "Profilul 2 — Cucuteni-Cetățuie", en: "Profile 2 — Cucuteni-Cetățuie" },
    classification: {
      srts: "Cernoziom cambic moderat humifer",
      wrb: "Cambic Chernozem (Loamic)"
    },
    location: {
      lat: 47.280, lng: 26.937,
      description: { ro: "Versant nordic, sit arheologic Cucuteni-Cetățuie", en: "Northern slope, Cucuteni-Cetățuie archaeological site" }
    },
    landuse: { ro: "Pășune — sit arheologic protejat", en: "Pasture — protected archaeological site" },
    parentMaterial: { ro: "Depozit deluvio-proluvial pe substrat marnos", en: "Deluvio-proluvial deposit on marly substrate" },
    photo: "photos/2026/P2.jpeg",
    horizons: [
      {
        symbol: "Ap",
        top: 0, bottom: 22,
        munsell: { hue: "10YR", value: 3, chroma: 1 },
        textureName: { ro: "Argiloasă", en: "Clay" },
        texture: { sand: 18, silt: 35, clay: 47 },
        description: {
          ro: "Umed, cenușiu foarte închis; structură grăunțoasă fină; friabil; abundent permeabil de rădăcini; fragmente ceramice Cucuteni la bază; limită netedă.",
          en: "Moist, very dark gray; fine granular structure; friable; abundant roots; Cucuteni ceramic fragments at base; smooth boundary."
        },
        parameters: { pH: 6.8, humus: 4.6, CaCO3: 0, SB: 26.8 }
      },
      {
        symbol: "Am",
        top: 22, bottom: 45,
        munsell: { hue: "10YR", value: 3, chroma: 2 },
        textureName: { ro: "Argiloasă", en: "Clay" },
        texture: { sand: 16, silt: 36, clay: 48 },
        description: {
          ro: "Umed, brun-cenușiu foarte închis; structură poliedrică subangulară; compact; rădăcini comune; arsuri antropice; limită graduală.",
          en: "Moist, very dark grayish brown; subangular blocky structure; compact; common roots; anthropogenic burn layer; gradual boundary."
        },
        parameters: { pH: 7.0, humus: 3.2, CaCO3: 0, SB: 29.0 }
      },
      {
        symbol: "Bv",
        top: 45, bottom: 72,
        munsell: { hue: "7.5YR", value: 4, chroma: 4 },
        textureName: { ro: "Argiloasă", en: "Clay" },
        texture: { sand: 14, silt: 34, clay: 52 },
        description: {
          ro: "Umed, brun; structură poliedrică angulară; pelicule de argilă pe fețele agregatelor; tare; rădăcini rare; limită graduală.",
          en: "Moist, brown; angular blocky structure; clay coatings on aggregate faces; hard; rare roots; gradual boundary."
        },
        parameters: { pH: 7.4, humus: 1.1, CaCO3: 0.5, SB: 32.5 }
      },
      {
        symbol: "BCk",
        top: 72, bottom: 110,
        munsell: { hue: "10YR", value: 5, chroma: 3 },
        textureName: { ro: "Luto-argiloasă", en: "Clay loam" },
        texture: { sand: 22, silt: 38, clay: 40 },
        description: {
          ro: "Umed, brun; masiv; pseudomicelii carbonatice; efervescență moderată.",
          en: "Moist, brown; massive; carbonate pseudomycelia; moderate effervescence."
        },
        parameters: { pH: 8.0, humus: 0.4, CaCO3: 8.3, SB: 34.0 }
      },
      {
        symbol: "Ck",
        top: 110, bottom: 150,
        munsell: { hue: "2.5Y", value: 6, chroma: 3 },
        textureName: { ro: "Lutoasă", en: "Loam" },
        texture: { sand: 28, silt: 42, clay: 30 },
        description: {
          ro: "Umed, brun-gălbui deschis; masiv; marno-calcar alterat; efervescență puternică.",
          en: "Moist, light yellowish brown; massive; weathered marly limestone; strong effervescence."
        },
        parameters: { pH: 8.4, humus: 0.1, CaCO3: 22.5, SB: 30.0 }
      }
    ]
  },
  {
    id: "P3-2026",
    name: { ro: "Profilul 3 — Cucuteni (Rezervație)", en: "Profile 3 — Cucuteni (Reserve)" },
    classification: {
      srts: "Rendzină tipică",
      wrb: "Rendzic Leptosol (Clayic)"
    },
    location: {
      lat: 47.285, lng: 26.925,
      description: { ro: "Rezervația Arheologică Cucuteni, versant sud-vestic", en: "Cucuteni Archaeological Reserve, south-western slope" }
    },
    landuse: { ro: "Pășune naturală", en: "Natural pasture" },
    parentMaterial: { ro: "Calcar recifal sarmatic", en: "Sarmatian reef limestone" },
    photo: "photos/2026/P3.jpeg",
    horizons: [
      {
        symbol: "Am",
        top: 0, bottom: 30,
        munsell: { hue: "10YR", value: 2, chroma: 1 },
        textureName: { ro: "Luto-argiloasă", en: "Clay loam" },
        texture: { sand: 20, silt: 42, clay: 38 },
        description: {
          ro: "Umed, negru; structură grăunțoasă foarte fină; friabil; permeabil dens de rădăcini; efervescență la HCl; limită netedă.",
          en: "Moist, black; very fine granular structure; friable; densely rooted; HCl effervescence; smooth boundary."
        },
        parameters: { pH: 7.6, humus: 7.2, CaCO3: 3.1, SB: 38.0 }
      },
      {
        symbol: "ACk",
        top: 30, bottom: 50,
        munsell: { hue: "10YR", value: 3, chroma: 2 },
        textureName: { ro: "Luto-argiloasă", en: "Clay loam" },
        texture: { sand: 22, silt: 40, clay: 38 },
        description: {
          ro: "Umed, brun-cenușiu foarte închis; fragmente de calcar; structură poliedrică; efervescență puternică; limită neregulată.",
          en: "Moist, very dark grayish brown; limestone fragments; blocky structure; strong effervescence; irregular boundary."
        },
        parameters: { pH: 8.0, humus: 3.5, CaCO3: 12.8, SB: 40.0 }
      },
      {
        symbol: "R",
        top: 50, bottom: 70,
        munsell: { hue: "2.5Y", value: 7, chroma: 2 },
        textureName: { ro: "—", en: "—" },
        texture: "photos/2026/P4.jpeg",
        description: {
          ro: "Calcar recifal compact, fisurat, cu patină de alterare brun-gălbuie.",
          en: "Compact reef limestone, fissured, with yellowish-brown weathering patina."
        },
        parameters: { pH: 8.5, humus: 0, CaCO3: 85.0, SB: null }
      }
    ]
  },
  {
    id: "P4-2026",
    name: { ro: "Profilul 4 — Cucuteni-Cetățuie", en: "Profile 4 — Cucuteni-Cetățuie" },
    classification: {
      srts: "Cernoziom cambic moderat humifer",
      wrb: "Cambic Chernozem (Loamic)"
    },
    location: {
      lat: 47.280, lng: 26.937,
      description: { ro: "Versant nordic, sit arheologic Cucuteni-Cetățuie", en: "Northern slope, Cucuteni-Cetățuie archaeological site" }
    },
    landuse: { ro: "Pășune — sit arheologic protejat", en: "Pasture — protected archaeological site" },
    parentMaterial: { ro: "Depozit deluvio-proluvial pe substrat marnos", en: "Deluvio-proluvial deposit on marly substrate" },
    photo: null,
    horizons: [
      {
        symbol: "Ap",
        top: 0, bottom: 22,
        munsell: { hue: "10YR", value: 3, chroma: 1 },
        textureName: { ro: "Argiloasă", en: "Clay" },
        texture: { sand: 18, silt: 35, clay: 47 },
        description: {
          ro: "Umed, cenușiu foarte închis; structură grăunțoasă fină; friabil; abundent permeabil de rădăcini; fragmente ceramice Cucuteni la bază; limită netedă.",
          en: "Moist, very dark gray; fine granular structure; friable; abundant roots; Cucuteni ceramic fragments at base; smooth boundary."
        },
        parameters: { pH: 6.8, humus: 4.6, CaCO3: 0, SB: 26.8 }
      },
      {
        symbol: "Am",
        top: 22, bottom: 45,
        munsell: { hue: "10YR", value: 3, chroma: 2 },
        textureName: { ro: "Argiloasă", en: "Clay" },
        texture: { sand: 16, silt: 36, clay: 48 },
        description: {
          ro: "Umed, brun-cenușiu foarte închis; structură poliedrică subangulară; compact; rădăcini comune; arsuri antropice; limită graduală.",
          en: "Moist, very dark grayish brown; subangular blocky structure; compact; common roots; anthropogenic burn layer; gradual boundary."
        },
        parameters: { pH: 7.0, humus: 3.2, CaCO3: 0, SB: 29.0 }
      },
      {
        symbol: "Bv",
        top: 45, bottom: 72,
        munsell: { hue: "7.5YR", value: 4, chroma: 4 },
        textureName: { ro: "Argiloasă", en: "Clay" },
        texture: { sand: 14, silt: 34, clay: 52 },
        description: {
          ro: "Umed, brun; structură poliedrică angulară; pelicule de argilă pe fețele agregatelor; tare; rădăcini rare; limită graduală.",
          en: "Moist, brown; angular blocky structure; clay coatings on aggregate faces; hard; rare roots; gradual boundary."
        },
        parameters: { pH: 7.4, humus: 1.1, CaCO3: 0.5, SB: 32.5 }
      },
      {
        symbol: "BCk",
        top: 72, bottom: 110,
        munsell: { hue: "10YR", value: 5, chroma: 3 },
        textureName: { ro: "Luto-argiloasă", en: "Clay loam" },
        texture: { sand: 22, silt: 38, clay: 40 },
        description: {
          ro: "Umed, brun; masiv; pseudomicelii carbonatice; efervescență moderată.",
          en: "Moist, brown; massive; carbonate pseudomycelia; moderate effervescence."
        },
        parameters: { pH: 8.0, humus: 0.4, CaCO3: 8.3, SB: 34.0 }
      },
      {
        symbol: "Ck",
        top: 110, bottom: 150,
        munsell: { hue: "2.5Y", value: 6, chroma: 3 },
        textureName: { ro: "Lutoasă", en: "Loam" },
        texture: { sand: 28, silt: 42, clay: 30 },
        description: {
          ro: "Umed, brun-gălbui deschis; masiv; marno-calcar alterat; efervescență puternică.",
          en: "Moist, light yellowish brown; massive; weathered marly limestone; strong effervescence."
        },
        parameters: { pH: 8.4, humus: 0.1, CaCO3: 22.5, SB: 30.0 }
      }
    ]
  },
];
