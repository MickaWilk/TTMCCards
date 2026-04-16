// ===== themes.js — 15 thèmes couleur =====

window.THEMES = [
  { id:'blue', label:'Bleue \u2014 Divers / Improbable', headerBg:'#3d7a9e', headerText:'#f5d442', border:'#2e6483', numColor:'#2e6483', cardBg:'#c5d5df', iconBgAlpha:'0.12', defaultIcon:'poisson' },
  { id:'yellow', label:'Jaune \u2014 Personnages / C\u00e9l\u00e9brit\u00e9s', headerBg:'#f5d442', headerText:'#1a5276', border:'#c9ad2e', numColor:'#1a5276', cardBg:'#f0e6c0', iconBgAlpha:'0.25', defaultIcon:'silhouette' },
  { id:'red', label:'Rouge \u2014 Pop Culture', headerBg:'#6e2130', headerText:'#ffffff', border:'#551a27', numColor:'#6e2130', cardBg:'#d8c8c8', iconBgAlpha:'0.12', defaultIcon:'pokeball' },
  { id:'green', label:'Verte \u2014 Nature / Sciences', headerBg:'#2d7d46', headerText:'#ffffff', border:'#1e5c32', numColor:'#1e5c32', cardBg:'#c8dece', iconBgAlpha:'0.12', defaultIcon:'feuille' },
  { id:'purple', label:'Violette \u2014 Myst\u00e8re / \u00c9nigmes', headerBg:'#6b3fa0', headerText:'#f0e68c', border:'#52308a', numColor:'#52308a', cardBg:'#d8cde8', iconBgAlpha:'0.15', defaultIcon:'loupe' },
  { id:'orange', label:'Orange \u2014 Sport / Exploits', headerBg:'#e67e22', headerText:'#ffffff', border:'#c0691a', numColor:'#c0691a', cardBg:'#f0dcc0', iconBgAlpha:'0.12', defaultIcon:'trophee' },
  { id:'pink', label:'Rose \u2014 Amour / Quotidien', headerBg:'#d63384', headerText:'#ffffff', border:'#b02a6f', numColor:'#b02a6f', cardBg:'#f0d0e0', iconBgAlpha:'0.12', defaultIcon:'coeur' },
  { id:'teal', label:'Turquoise \u2014 Voyages / G\u00e9o', headerBg:'#0097a7', headerText:'#ffffff', border:'#007b8a', numColor:'#007b8a', cardBg:'#c0e0e4', iconBgAlpha:'0.12', defaultIcon:'globe' },
  { id:'indigo', label:'Indigo \u2014 Espace / Astronomie', headerBg:'#303f9f', headerText:'#e8eaf6', border:'#283593', numColor:'#283593', cardBg:'#c5cae9', iconBgAlpha:'0.15', defaultIcon:'fusee' },
  { id:'brown', label:'Marron \u2014 Histoire / Patrimoine', headerBg:'#6d4c41', headerText:'#fff8e1', border:'#5d4037', numColor:'#5d4037', cardBg:'#d7ccc8', iconBgAlpha:'0.12', defaultIcon:'livre' },
  { id:'lime', label:'Citron vert \u2014 Gastronomie', headerBg:'#7cb342', headerText:'#1b3a00', border:'#689f38', numColor:'#558b2f', cardBg:'#dcedc8', iconBgAlpha:'0.15', defaultIcon:'etoile' },
  { id:'black', label:'Noire \u2014 D\u00e9fi / Expert', headerBg:'#212121', headerText:'#ffd740', border:'#000000', numColor:'#212121', cardBg:'#bdbdbd', iconBgAlpha:'0.10', defaultIcon:'epee' },
  { id:'gold', label:'Or \u2014 Sp\u00e9cial / Premium', headerBg:'#c8a415', headerText:'#1a1a2e', border:'#a68b10', numColor:'#8b7200', cardBg:'#f5ecc8', iconBgAlpha:'0.20', defaultIcon:'couronne' },
  { id:'cyan', label:'Cyan \u2014 Technologie / Internet', headerBg:'#00acc1', headerText:'#ffffff', border:'#00838f', numColor:'#00838f', cardBg:'#b2ebf2', iconBgAlpha:'0.12', defaultIcon:'manette' },
  { id:'coral', label:'Corail \u2014 Musique / Arts', headerBg:'#ff6f61', headerText:'#ffffff', border:'#e55a4f', numColor:'#d84a3a', cardBg:'#fce4e0', iconBgAlpha:'0.12', defaultIcon:'musique' }
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
