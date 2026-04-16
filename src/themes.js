// ===== themes.js — Thèmes couleur (7 officiels TTMC + 8 extras) =====

window.THEMES = [
  // ===== 7 thèmes officiels TTMC (cartes 1 à 7) =====
  { id:'green', label:'Verte — Scolaire', headerBg:'#2d8c3c', headerText:'#ffffff', border:'#1e6e2c', numColor:'#c0392b', cardBg:'#e8f5e9', iconBgAlpha:'0.15', defaultIcon:'feuille' },
  { id:'purple', label:'Violette — Mature', headerBg:'#5b2c6f', headerText:'#ffffff', border:'#4a235a', numColor:'#5b2c6f', cardBg:'#f0e6f6', iconBgAlpha:'0.15', defaultIcon:'loupe' },
  { id:'blue', label:'Bleue — Improbable', headerBg:'#2471a3', headerText:'#ffffff', border:'#1a5276', numColor:'#1a5276', cardBg:'#d6eaf8', iconBgAlpha:'0.12', defaultIcon:'poisson' },
  { id:'orange', label:'Orange — Plaisir', headerBg:'#e67e22', headerText:'#ffffff', border:'#c0691a', numColor:'#d35400', cardBg:'#fdebd0', iconBgAlpha:'0.12', defaultIcon:'etoile' },
  { id:'brown', label:'Marron — Débuter', headerBg:'#795548', headerText:'#ffffff', border:'#5d4037', numColor:'#4e342e', cardBg:'#efebe9', iconBgAlpha:'0.12', defaultIcon:'livre' },
  { id:'gold', label:'Or — Gagner', headerBg:'#c8a415', headerText:'#1a1a2e', border:'#a68b10', numColor:'#8b7200', cardBg:'#fff8e1', iconBgAlpha:'0.20', defaultIcon:'couronne' },
  { id:'red', label:'Rouge — Intrépide', headerBg:'#922b21', headerText:'#ffffff', border:'#7b241c', numColor:'#922b21', cardBg:'#fadbd8', iconBgAlpha:'0.12', defaultIcon:'epee' },

  // ===== 8 thèmes bonus =====
  { id:'yellow', label:'Jaune — Célébrités', headerBg:'#f5d442', headerText:'#1a5276', border:'#c9ad2e', numColor:'#1a5276', cardBg:'#fef9e7', iconBgAlpha:'0.25', defaultIcon:'silhouette' },
  { id:'pink', label:'Rose — Amour', headerBg:'#d63384', headerText:'#ffffff', border:'#b02a6f', numColor:'#b02a6f', cardBg:'#f0d0e0', iconBgAlpha:'0.12', defaultIcon:'coeur' },
  { id:'teal', label:'Turquoise — Voyages', headerBg:'#0097a7', headerText:'#ffffff', border:'#007b8a', numColor:'#007b8a', cardBg:'#e0f2f1', iconBgAlpha:'0.12', defaultIcon:'globe' },
  { id:'indigo', label:'Indigo — Espace', headerBg:'#303f9f', headerText:'#e8eaf6', border:'#283593', numColor:'#283593', cardBg:'#e8eaf6', iconBgAlpha:'0.15', defaultIcon:'fusee' },
  { id:'lime', label:'Citron vert — Gastronomie', headerBg:'#7cb342', headerText:'#1b3a00', border:'#689f38', numColor:'#558b2f', cardBg:'#f1f8e9', iconBgAlpha:'0.15', defaultIcon:'trophee' },
  { id:'black', label:'Noire — Expert', headerBg:'#212121', headerText:'#ffd740', border:'#000000', numColor:'#212121', cardBg:'#e0e0e0', iconBgAlpha:'0.10', defaultIcon:'eclair' },
  { id:'cyan', label:'Cyan — Technologie', headerBg:'#00acc1', headerText:'#ffffff', border:'#00838f', numColor:'#00838f', cardBg:'#e0f7fa', iconBgAlpha:'0.12', defaultIcon:'manette' },
  { id:'coral', label:'Corail — Musique', headerBg:'#ff6f61', headerText:'#ffffff', border:'#e55a4f', numColor:'#d84a3a', cardBg:'#fce4e0', iconBgAlpha:'0.12', defaultIcon:'musique' }
];

window.getThemeById = function(id) {
  return THEMES.find(function(t) { return t.id === id; }) || THEMES[0];
};

window.applyTheme = function(cardEl, theme) {
  cardEl.style.setProperty('--header-bg', theme.headerBg);
  cardEl.style.setProperty('--header-text', theme.headerText);
  cardEl.style.setProperty('--border', theme.border);
  cardEl.style.setProperty('--num-color', theme.numColor);
  cardEl.style.setProperty('--card-bg', theme.cardBg);
  cardEl.style.setProperty('--icon-bg-alpha', theme.iconBgAlpha || '0.12');
};
