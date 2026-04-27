// ===== themes.js — Types de cartes + Thèmes couleur officiels TTMC =====

// ===== 4 types de cartes TTMC =====
window.CARD_TYPES = [
  { id: 'standard',   label: 'Questions / Reponses',   description: 'Carte classique "Tu te mets combien en..."', defaultTheme: 'green' },
  { id: 'debuter',    label: 'Hesite pas a Debuter',   description: 'Carte challenge pour demarrer la partie',    defaultTheme: 'green' },
  { id: 'gagner',     label: 'Hesite pas a Gagner',     description: 'Carte bonus / challenge',                    defaultTheme: 'gold' },
  { id: 'challenge',  label: 'Challenge',               description: 'Carte challenge avec eclair central',        defaultTheme: 'orange' },
  { id: 'intrepide',  label: 'Intrepide',               description: 'Carte defi / dare',                         defaultTheme: 'darkred' },
  { id: 'terminer',   label: 'Hesite pas a Terminer',   description: 'Carte challenge pour terminer la partie',    defaultTheme: 'purple' },
  { id: 'bonusmalus', label: 'Trop Fort / C\'est Nul',  description: 'Recto blanc (coeur) + Verso noir (tete de mort)', defaultTheme: 'black' }
];

window.getCardTypeById = function(id) {
  return CARD_TYPES.find(function(t) { return t.id === id; }) || CARD_TYPES[0];
};

// ===== Themes couleur =====
// 7 themes officiels TTMC (correspondant aux 7 cartes de reference)
// + 8 themes bonus pour personnalisation
window.THEMES = [
  // --- 4 themes Standard Q&A (cartes 4-7 officielles) ---
  { id:'green',   label:'Verte — Nature / Scolaire',     headerBg:'#3B9B3A', headerText:'#ffffff', border:'#2D7A2C', numColor:'#C0392B', cardBg:'#ffffff', iconBgAlpha:'0.15', defaultIcon:'play',            cardType:'standard' },
  { id:'purple',  label:'Violette — Terminer',              headerBg:'#6B2D8E', headerText:'#ffffff', border:'#522070', numColor:'#6B2D8E', cardBg:'#ffffff', iconBgAlpha:'0.15', defaultIcon:'drapeau_arrivee', cardType:'terminer' },
  { id:'blue',    label:'Bleue — Improbable / Divers',    headerBg:'#2979B1', headerText:'#ffffff', border:'#1E5F8C', numColor:'#1E5F8C', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'poisson',         cardType:'standard' },
  { id:'orange',  label:'Orange — Challenge',             headerBg:'#F18A00', headerText:'#ffffff', border:'#C97200', numColor:'#D35400', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'eclair',          cardType:'challenge' },
  { id:'rouge_vif', label:'Rouge vif — Pop Culture',      headerBg:'#C00000', headerText:'#ffffff', border:'#980000', numColor:'#C00000', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'globe',           cardType:'standard' },

  // --- 3 themes Challenge (cartes 1-3 officielles) ---
  { id:'brown',   label:'Marron — Debuter',              headerBg:'#6D4C2A', headerText:'#8B1A1A', border:'#5D3A1A', numColor:'#4E342E', cardBg:'#D4B896', iconBgAlpha:'0.12', defaultIcon:'livre',     cardType:'debuter' },
  { id:'gold',    label:'Or — Gagner',                    headerBg:'#C8960C', headerText:'#ffffff', border:'#A07A08', numColor:'#8B6914', cardBg:'#E8C84A', iconBgAlpha:'0.20', defaultIcon:'couronne',  cardType:'gagner' },
  { id:'darkred', label:'Rouge — Intrepide',              headerBg:'#B71C1C', headerText:'#ffffff', border:'#8B1515', numColor:'#B71C1C', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'epee',      cardType:'intrepide' },

  // --- 8 themes bonus (personnalisation) ---
  { id:'yellow',  label:'Jaune — Celebrites',             headerBg:'#F5D442', headerText:'#1a5276', border:'#C9AD2E', numColor:'#1a5276', cardBg:'#ffffff', iconBgAlpha:'0.25', defaultIcon:'silhouette', cardType:'standard' },
  { id:'pink',    label:'Rose — Amour',                   headerBg:'#D63384', headerText:'#ffffff', border:'#B02A6F', numColor:'#B02A6F', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'coeur',     cardType:'standard' },
  { id:'teal',    label:'Turquoise — Voyages',            headerBg:'#0097A7', headerText:'#ffffff', border:'#007B8A', numColor:'#007B8A', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'globe',     cardType:'standard' },
  { id:'indigo',  label:'Indigo — Espace',                headerBg:'#303F9F', headerText:'#E8EAF6', border:'#283593', numColor:'#283593', cardBg:'#ffffff', iconBgAlpha:'0.15', defaultIcon:'fusee',     cardType:'standard' },
  { id:'lime',    label:'Citron vert — Gastronomie',      headerBg:'#7CB342', headerText:'#1B3A00', border:'#689F38', numColor:'#558B2F', cardBg:'#ffffff', iconBgAlpha:'0.15', defaultIcon:'trophee',   cardType:'standard' },
  { id:'black',   label:'Noire — Expert',                 headerBg:'#212121', headerText:'#FFD740', border:'#000000', numColor:'#212121', cardBg:'#E0E0E0', iconBgAlpha:'0.10', defaultIcon:'eclair',    cardType:'standard' },
  { id:'cyan',    label:'Cyan — Technologie',             headerBg:'#00ACC1', headerText:'#ffffff', border:'#00838F', numColor:'#00838F', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'manette',   cardType:'standard' },
  { id:'coral',   label:'Corail — Musique',               headerBg:'#FF6F61', headerText:'#ffffff', border:'#E55A4F', numColor:'#D84A3A', cardBg:'#ffffff', iconBgAlpha:'0.12', defaultIcon:'musique',   cardType:'standard' },

  // --- Thèmes Varimatrax ---
  { id:'vx_green',   label:'Varimatrax — Débuter',      headerBg:'#3B9B3A', headerText:'#ffffff', border:'#2D7A2C', numColor:'#2D7A2C', cardBg:'#3B9B3A', iconBgAlpha:'0.00', defaultIcon:'play',        cardType:'standard', varimatrax:true },
  { id:'vx_purple',  label:'Varimatrax — Terminer',     headerBg:'#6B2D8E', headerText:'#ffffff', border:'#522070', numColor:'#522070', cardBg:'#6B2D8E', iconBgAlpha:'0.00', defaultIcon:'drapeau_arrivee', cardType:'standard', varimatrax:true },
  { id:'vx_yellow',  label:'Varimatrax — Personnages',  headerBg:'#F5D442', headerText:'#1a5276', border:'#C9AD2E', numColor:'#1a5276', cardBg:'#F5D442', iconBgAlpha:'0.00', defaultIcon:'silhouette',  cardType:'standard', varimatrax:true },
  { id:'vx_blue',    label:'Varimatrax — Divers',       headerBg:'#2979B1', headerText:'#ffffff', border:'#1E5F8C', numColor:'#1E5F8C', cardBg:'#2979B1', iconBgAlpha:'0.00', defaultIcon:'poisson',     cardType:'standard', varimatrax:true },
  { id:'vx_red',     label:'Varimatrax — Pop Culture',  headerBg:'#C00000', headerText:'#ffffff', border:'#980000', numColor:'#980000', cardBg:'#C00000', iconBgAlpha:'0.00', defaultIcon:'globe',       cardType:'standard', varimatrax:true },
  { id:'vx_orange',  label:'Varimatrax — Challenge',    headerBg:'#F18A00', headerText:'#ffffff', border:'#C97200', numColor:'#C97200', cardBg:'#F18A00', iconBgAlpha:'0.00', defaultIcon:'eclair',      cardType:'standard', varimatrax:true },
  { id:'vx_black',   label:'Varimatrax — Malus',        headerBg:'#212121', headerText:'#FFD740', border:'#000000', numColor:'#000000', cardBg:'#212121', iconBgAlpha:'0.00', defaultIcon:'tete_de_mort', cardType:'standard', varimatrax:true },
  { id:'vx_white',   label:'Varimatrax — Bonus',        headerBg:'#f0f0f0', headerText:'#C0392B', border:'#dddddd', numColor:'#C0392B', cardBg:'#f5f5f5', iconBgAlpha:'0.00', defaultIcon:'coeur',       cardType:'standard', varimatrax:true }
];

window.getThemeById = function(id) {
  return THEMES.find(function(t) { return t.id === id; }) || THEMES[0];
};

window.getThemesForCardType = function() {
  return THEMES;
};

window.applyTheme = function(cardEl, theme) {
  cardEl.style.setProperty('--header-bg', theme.headerBg);
  cardEl.style.setProperty('--header-text', theme.headerText);
  cardEl.style.setProperty('--border', theme.border);
  cardEl.style.setProperty('--num-color', theme.numColor);
  cardEl.style.setProperty('--card-bg', theme.cardBg);
  cardEl.style.setProperty('--icon-bg-alpha', theme.iconBgAlpha || '0.12');
  if (theme.varimatrax) {
    cardEl.style.setProperty('--panel-inner-bg', '#ffffff');
    cardEl.style.setProperty('--header-display', 'none');
    cardEl.classList.add('vx-texture');
  } else {
    cardEl.style.removeProperty('--panel-inner-bg');
    cardEl.style.removeProperty('--header-display');
    cardEl.classList.remove('vx-texture');
    cardEl.style.backgroundColor = '';
    cardEl.style.backgroundImage = '';
    cardEl.style.backgroundSize = '';
    cardEl.style.backgroundPosition = '';
  }
};

// ===== Fonds Varimatrax — 10 styles par theme =====
window.VX_BACKGROUNDS = {

  vx_green: [
    { id:'uni',         label:'Uni',      color:'#3B9B3A', image:'none' },
    { id:'foret',       label:'Forêt',    color:'#1a4a1a', image:'linear-gradient(160deg,#1a4a1a 0%,#2d7a2c 45%,#4ab84a 100%)' },
    { id:'aurora',      label:'Aurora',   color:'#0a1f0a', image:'radial-gradient(ellipse 80% 60% at 20% 40%,rgba(59,155,58,.9) 0%,transparent 70%),radial-gradient(ellipse 60% 80% at 80% 70%,rgba(100,200,80,.5) 0%,transparent 60%),radial-gradient(ellipse 100% 50% at 50% 0%,rgba(20,80,20,.8) 0%,transparent 80%)' },
    { id:'matrix',      label:'Matrix',   color:'#010d01', image:'repeating-linear-gradient(90deg,rgba(0,200,0,.04) 0 1px,transparent 1px 32px),repeating-linear-gradient(0deg,rgba(0,200,0,.04) 0 1px,transparent 1px 32px),radial-gradient(ellipse at 50% 50%,rgba(59,155,58,.35) 0%,transparent 65%)', size:'32px 32px,32px 32px,100% 100%' },
    { id:'mesh',        label:'Mesh',     color:'#2d7a2c', image:'radial-gradient(circle at 15% 25%,rgba(255,255,255,.18) 0%,transparent 35%),radial-gradient(circle at 85% 75%,rgba(255,255,255,.12) 0%,transparent 30%),radial-gradient(circle at 50% 50%,rgba(80,200,80,.25) 0%,transparent 55%)' },
    { id:'geometrique', label:'Géo',      color:'#3B9B3A', image:'repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 1px,transparent 1px 22px),repeating-linear-gradient(-45deg,rgba(255,255,255,.07) 0 1px,transparent 1px 22px)', size:'22px 22px' },
    { id:'neon',        label:'Néon',     color:'#010d01', image:'radial-gradient(ellipse 70% 60% at 50% 55%,rgba(0,255,60,.22) 0%,rgba(30,140,30,.08) 50%,transparent 80%)' },
    { id:'emeraude',    label:'Émeraude', color:'#0f2e0f', image:'linear-gradient(135deg,#0f2e0f 0%,#1e5e1e 35%,#3B9B3A 65%,#2a7a2a 100%)' },
    { id:'points',      label:'Points',   color:'#2d7a2c', image:'radial-gradient(circle,rgba(255,255,255,.22) 1.5px,transparent 1.5px)', size:'20px 20px' },
    { id:'jungle',      label:'Jungle',   color:'#0a1f0a', image:'linear-gradient(180deg,#0a1f0a 0%,#1a4a1a 40%,#2d7a2c 70%,#1a4a1a 100%),repeating-linear-gradient(60deg,rgba(59,155,58,.08) 0 2px,transparent 2px 30px)', size:'100% 100%,30px 30px' },
  ],

  vx_purple: [
    { id:'uni',      label:'Uni',     color:'#6B2D8E', image:'none' },
    { id:'galaxie',  label:'Galaxie', color:'#07001a', image:'radial-gradient(ellipse 70% 60% at 30% 30%,rgba(107,45,142,.95) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 80% 70%,rgba(160,80,210,.6) 0%,transparent 55%),radial-gradient(circle at 55% 15%,rgba(200,150,255,.25) 0%,transparent 30%)' },
    { id:'aurora',   label:'Aurora',  color:'#0e001f', image:'radial-gradient(ellipse 120% 60% at 0% 50%,rgba(107,45,142,.85) 0%,transparent 55%),radial-gradient(ellipse 80% 80% at 100% 30%,rgba(180,80,255,.55) 0%,transparent 50%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(60,10,100,.9) 0%,transparent 50%)' },
    { id:'damier',   label:'Damier',  color:'#6B2D8E', image:'repeating-conic-gradient(#4A0E6B 0% 25%,#8B3DAE 0% 50%)', size:'22px 22px' },
    { id:'velours',  label:'Velours', color:'#1a0035', image:'linear-gradient(135deg,#0d001f 0%,#2d0055 40%,#6B2D8E 75%,#3d1060 100%)' },
    { id:'neon',     label:'Néon',    color:'#080010', image:'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(180,0,255,.28) 0%,rgba(107,45,142,.12) 45%,transparent 75%)' },
    { id:'mesh',     label:'Mesh',    color:'#4a1a6e', image:'radial-gradient(circle at 20% 30%,rgba(255,255,255,.12) 0%,transparent 40%),radial-gradient(circle at 80% 65%,rgba(200,100,255,.22) 0%,transparent 40%),radial-gradient(circle at 50% 85%,rgba(107,45,142,.5) 0%,transparent 50%)' },
    { id:'cristal',  label:'Cristal', color:'#2d0050', image:'linear-gradient(60deg,rgba(255,255,255,.08) 0%,transparent 55%),linear-gradient(130deg,rgba(180,100,255,.18) 0%,transparent 45%),linear-gradient(200deg,#3d1060 0%,#8B3DAE 100%)' },
    { id:'etoiles',  label:'Étoiles', color:'#070012', image:'radial-gradient(circle,rgba(220,180,255,.55) 1px,transparent 1px),radial-gradient(circle,rgba(255,255,255,.35) 1px,transparent 1px)', size:'32px 32px,19px 19px', pos:'0 0,16px 16px' },
    { id:'royal',    label:'Royal',   color:'#1a0030', image:'linear-gradient(160deg,#1a0030 0%,#4a1a6e 50%,#6B2D8E 80%,#522070 100%),repeating-linear-gradient(90deg,rgba(200,150,255,.04) 0 1px,transparent 1px 40px)', size:'100% 100%,40px 40px' },
  ],

  vx_yellow: [
    { id:'uni',         label:'Uni',      color:'#F5D442', image:'none' },
    { id:'soleil',      label:'Soleil',   color:'#c49a00', image:'radial-gradient(circle at 50% 120%,#fff8c0 0%,#F5D442 35%,#c49a00 70%,#8b6800 100%)' },
    { id:'or',          label:'Or',       color:'#b8860b', image:'linear-gradient(135deg,#8b6508 0%,#c49a00 30%,#F5D442 55%,#ffeaa0 70%,#c49a00 85%,#8b6508 100%)' },
    { id:'spotlight',   label:'Spot',     color:'#c49a00', image:'radial-gradient(circle at 50% 40%,rgba(255,255,220,.65) 0%,rgba(245,212,66,0) 65%)' },
    { id:'confetti',    label:'Confetti', color:'#F5D442', image:'radial-gradient(circle,rgba(200,150,0,.42) 2px,transparent 2px),radial-gradient(circle,rgba(255,255,255,.32) 1.5px,transparent 1.5px)', size:'25px 25px,18px 18px', pos:'0 0,12px 12px' },
    { id:'glamour',     label:'Glamour',  color:'#c49a00', image:'radial-gradient(ellipse at 30% 30%,rgba(255,255,200,.5) 0%,transparent 50%),radial-gradient(ellipse at 70% 70%,rgba(200,160,0,.4) 0%,transparent 45%),linear-gradient(135deg,#c49a00 0%,#F5D442 50%,#ffe066 100%)' },
    { id:'stars',       label:'Stars',    color:'#c49a00', image:'radial-gradient(circle,rgba(255,255,200,.65) 1.5px,transparent 1.5px),radial-gradient(circle,rgba(255,230,0,.42) 1px,transparent 1px)', size:'22px 22px,14px 14px', pos:'0 0,11px 11px' },
    { id:'fete',        label:'Fête',     color:'#e5a200', image:'repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 3px,transparent 3px 20px),linear-gradient(180deg,#F5D442 0%,#e5a200 100%)', size:'20px 20px,100% 100%' },
    { id:'miel',        label:'Miel',     color:'#c47a00', image:'radial-gradient(ellipse at 30% 0%,rgba(255,200,0,.5) 0%,transparent 50%),radial-gradient(ellipse at 70% 100%,rgba(180,100,0,.5) 0%,transparent 50%),linear-gradient(160deg,#F5D442 0%,#c47a00 100%)' },
    { id:'geometrique', label:'Géo',      color:'#F5D442', image:'repeating-linear-gradient(60deg,rgba(0,0,0,.07) 0 1px,transparent 1px 24px),repeating-linear-gradient(-60deg,rgba(0,0,0,.07) 0 1px,transparent 1px 24px)', size:'24px 24px' },
  ],

  vx_blue: [
    { id:'uni',      label:'Uni',    color:'#2979B1', image:'none' },
    { id:'ocean',    label:'Océan',  color:'#04213d', image:'linear-gradient(180deg,#04213d 0%,#0e4272 35%,#2979B1 70%,#1a6090 100%)' },
    { id:'ciel',     label:'Ciel',   color:'#1565c0', image:'linear-gradient(180deg,#0a2a6e 0%,#1565c0 50%,#2979B1 80%,#42a5f5 100%)' },
    { id:'vagues',   label:'Vagues', color:'#0e3a6e', image:'repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 2px,transparent 2px 28px),linear-gradient(180deg,#0a2a6e 0%,#2979B1 100%)', size:'100% 28px,100% 100%' },
    { id:'tech',     label:'Tech',   color:'#0a1e3d', image:'repeating-linear-gradient(90deg,rgba(41,121,177,.13) 0 1px,transparent 1px 28px),repeating-linear-gradient(0deg,rgba(41,121,177,.13) 0 1px,transparent 1px 28px),radial-gradient(ellipse at 50% 50%,rgba(41,121,177,.4) 0%,transparent 70%)', size:'28px 28px,28px 28px,100% 100%' },
    { id:'cristal',  label:'Cristal',color:'#0d2a50', image:'linear-gradient(60deg,rgba(255,255,255,.1) 0%,transparent 50%),linear-gradient(140deg,rgba(100,180,255,.2) 0%,transparent 50%),linear-gradient(210deg,#1a4a8a 0%,#2979B1 100%)' },
    { id:'aurora',   label:'Aurora', color:'#03111f', image:'radial-gradient(ellipse 100% 60% at 0% 50%,rgba(41,121,177,.9) 0%,transparent 60%),radial-gradient(ellipse 70% 80% at 100% 30%,rgba(100,180,255,.5) 0%,transparent 55%),radial-gradient(ellipse 80% 40% at 50% 100%,rgba(10,60,120,.8) 0%,transparent 50%)' },
    { id:'neon',     label:'Néon',   color:'#020d1a', image:'radial-gradient(ellipse 65% 55% at 50% 50%,rgba(0,150,255,.25) 0%,rgba(41,121,177,.1) 45%,transparent 75%)' },
    { id:'aqua',     label:'Aqua',   color:'#004d6e', image:'linear-gradient(135deg,#003050 0%,#0070a0 50%,#2979B1 75%,#00b4d8 100%)' },
    { id:'etoiles',  label:'Étoiles',color:'#031428', image:'radial-gradient(circle,rgba(100,180,255,.52) 1px,transparent 1px),radial-gradient(circle,rgba(255,255,255,.32) 1px,transparent 1px)', size:'28px 28px,17px 17px', pos:'0 0,14px 14px' },
  ],

  vx_red: [
    { id:'uni',         label:'Uni',     color:'#C00000', image:'none' },
    { id:'flamme',      label:'Flamme',  color:'#400000', image:'radial-gradient(ellipse at 50% 120%,#ff6600 0%,#C00000 40%,#400000 100%)' },
    { id:'velours',     label:'Velours', color:'#1a0000', image:'linear-gradient(135deg,#1a0000 0%,#5a0000 40%,#C00000 70%,#800000 100%)' },
    { id:'cinema',      label:'Cinéma',  color:'#0d0000', image:'radial-gradient(ellipse 70% 90% at 50% 50%,rgba(192,0,0,.6) 0%,rgba(100,0,0,.2) 60%,transparent 80%)' },
    { id:'aurora',      label:'Aurora',  color:'#100000', image:'radial-gradient(ellipse 110% 60% at 0% 50%,rgba(192,0,0,.9) 0%,transparent 60%),radial-gradient(ellipse 70% 80% at 100% 30%,rgba(255,50,50,.5) 0%,transparent 55%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(80,0,0,.9) 0%,transparent 50%)' },
    { id:'neon',        label:'Néon',    color:'#0a0000', image:'radial-gradient(ellipse 65% 55% at 50% 50%,rgba(255,0,0,.25) 0%,rgba(192,0,0,.1) 45%,transparent 75%)' },
    { id:'popArt',      label:'Pop Art', color:'#C00000', image:'repeating-linear-gradient(90deg,rgba(255,255,255,.09) 0 3px,transparent 3px 30px)' },
    { id:'rubis',       label:'Rubis',   color:'#3d0000', image:'linear-gradient(60deg,rgba(255,100,100,.15) 0%,transparent 50%),linear-gradient(130deg,rgba(255,50,50,.1) 0%,transparent 45%),linear-gradient(210deg,#6a0000 0%,#C00000 100%)' },
    { id:'mesh',        label:'Mesh',    color:'#900000', image:'radial-gradient(circle at 20% 30%,rgba(255,100,100,.2) 0%,transparent 40%),radial-gradient(circle at 80% 65%,rgba(255,0,0,.15) 0%,transparent 40%),radial-gradient(circle at 50% 85%,rgba(192,0,0,.4) 0%,transparent 50%)' },
    { id:'diagonales',  label:'Diag.',   color:'#C00000', image:'repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 2px,transparent 2px 18px)', size:'18px 18px' },
  ],

  vx_orange: [
    { id:'uni',         label:'Uni',     color:'#F18A00', image:'none' },
    { id:'feu',         label:'Feu',     color:'#5a1f00', image:'radial-gradient(ellipse at 50% 120%,#ffcc00 0%,#F18A00 35%,#c04000 65%,#5a1f00 100%)' },
    { id:'coucher',     label:'Coucher', color:'#3d1200', image:'linear-gradient(180deg,#0a0520 0%,#7a1060 30%,#C84000 60%,#F18A00 80%,#ffe066 100%)' },
    { id:'desert',      label:'Désert',  color:'#7a4000', image:'linear-gradient(160deg,#3d1500 0%,#8b4500 40%,#F18A00 70%,#c47000 100%)' },
    { id:'explosion',   label:'Explo.',  color:'#5a1f00', image:'radial-gradient(ellipse at 50% 50%,#ffee00 0%,#F18A00 30%,#c04000 60%,#3d0000 100%)' },
    { id:'neon',        label:'Néon',    color:'#1a0800', image:'radial-gradient(ellipse 65% 55% at 50% 50%,rgba(255,150,0,.3) 0%,rgba(241,138,0,.12) 45%,transparent 75%)' },
    { id:'lave',        label:'Lave',    color:'#1a0000', image:'radial-gradient(ellipse at 30% 70%,rgba(255,60,0,.6) 0%,transparent 50%),radial-gradient(ellipse at 70% 30%,rgba(255,150,0,.5) 0%,transparent 45%),linear-gradient(160deg,#1a0000 0%,#5a1500 50%,#c04000 100%)' },
    { id:'geometrique', label:'Géo',     color:'#F18A00', image:'repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 1px,transparent 1px 22px),repeating-linear-gradient(-45deg,rgba(255,255,255,.08) 0 1px,transparent 1px 22px)', size:'22px 22px' },
    { id:'aurora',      label:'Aurora',  color:'#1a0800', image:'radial-gradient(ellipse 100% 60% at 0% 50%,rgba(241,138,0,.9) 0%,transparent 60%),radial-gradient(ellipse 70% 80% at 100% 30%,rgba(255,200,0,.5) 0%,transparent 55%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(120,40,0,.8) 0%,transparent 50%)' },
    { id:'mesh',        label:'Mesh',    color:'#c47000', image:'radial-gradient(circle at 15% 25%,rgba(255,255,100,.18) 0%,transparent 35%),radial-gradient(circle at 85% 75%,rgba(255,200,0,.12) 0%,transparent 30%),radial-gradient(circle at 50% 50%,rgba(255,150,0,.25) 0%,transparent 55%)' },
  ],

  vx_black: [
    { id:'uni',     label:'Uni',     color:'#212121', image:'none' },
    { id:'charbon', label:'Charbon', color:'#0a0a0a', image:'linear-gradient(160deg,#0a0a0a 0%,#1a1a1a 50%,#2d2d2d 100%)' },
    { id:'void',    label:'Void',    color:'#000000', image:'none' },
    { id:'carbon',  label:'Carbon',  color:'#111',    image:'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0 1px,transparent 1px 4px),repeating-linear-gradient(-45deg,rgba(255,255,255,.04) 0 1px,transparent 1px 4px)', size:'4px 4px' },
    { id:'etoiles', label:'Étoiles', color:'#020204', image:'radial-gradient(circle,rgba(255,255,255,.72) 1px,transparent 1px),radial-gradient(circle,rgba(255,255,255,.42) 1px,transparent 1px)', size:'35px 35px,21px 21px', pos:'0 0,17px 17px' },
    { id:'neon',    label:'Néon',    color:'#020202', image:'radial-gradient(ellipse 65% 55% at 50% 50%,rgba(180,180,220,.15) 0%,rgba(100,100,180,.05) 50%,transparent 80%)' },
    { id:'grid',    label:'Grid',    color:'#0a0a0a', image:'repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 30px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 30px)', size:'30px 30px' },
    { id:'fumee',   label:'Fumée',   color:'#050505', image:'radial-gradient(ellipse at 30% 30%,rgba(80,80,80,.42) 0%,transparent 50%),radial-gradient(ellipse at 70% 70%,rgba(60,60,60,.32) 0%,transparent 45%)' },
    { id:'metal',   label:'Métal',   color:'#1a1a1a', image:'repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px),linear-gradient(160deg,#2a2a2a 0%,#0d0d0d 50%,#1a1a1a 100%)', size:'3px 100%,100% 100%' },
    { id:'ombres',  label:'Ombres',  color:'#000000', image:'radial-gradient(circle at 0% 0%,rgba(60,60,60,.6) 0%,transparent 50%),radial-gradient(circle at 100% 100%,rgba(40,40,40,.5) 0%,transparent 50%)' },
  ],

  vx_white: [
    { id:'uni',         label:'Uni',      color:'#f0f0f0', image:'none' },
    { id:'perle',       label:'Perle',    color:'#e8e0f0', image:'linear-gradient(135deg,#ffffff 0%,#f0e8ff 40%,#e0d0f5 70%,#ede8f8 100%)' },
    { id:'nuages',      label:'Nuages',   color:'#e8f0ff', image:'radial-gradient(ellipse at 20% 40%,rgba(255,255,255,.8) 0%,transparent 50%),radial-gradient(ellipse at 80% 60%,rgba(220,230,255,.6) 0%,transparent 45%),linear-gradient(180deg,#dceeff 0%,#f0f6ff 100%)' },
    { id:'cristal',     label:'Cristal',  color:'#f5f5ff', image:'linear-gradient(60deg,rgba(200,180,255,.2) 0%,transparent 50%),linear-gradient(140deg,rgba(180,220,255,.2) 0%,transparent 50%),linear-gradient(220deg,rgba(255,200,220,.15) 0%,transparent 50%),linear-gradient(300deg,rgba(200,255,200,.15) 0%,transparent 50%)' },
    { id:'holo',        label:'Holo',     color:'#f0eff8', image:'linear-gradient(45deg,rgba(255,150,150,.15) 0%,rgba(255,255,150,.15) 25%,rgba(150,255,150,.15) 50%,rgba(150,200,255,.15) 75%,rgba(200,150,255,.15) 100%)' },
    { id:'neige',       label:'Neige',    color:'#f5f8ff', image:'radial-gradient(circle,rgba(200,220,255,.55) 1.5px,transparent 1.5px)', size:'22px 22px' },
    { id:'lait',        label:'Lait',     color:'#faf5f0', image:'linear-gradient(160deg,#fffaf5 0%,#f5e8d8 50%,#f0dcc8 100%)' },
    { id:'lumiere',     label:'Lumière',  color:'#ffffff',  image:'radial-gradient(ellipse 60% 50% at 50% 40%,rgba(255,255,255,1) 0%,rgba(240,240,255,.8) 40%,rgba(220,220,245,.5) 70%,transparent 100%)' },
    { id:'geometrique', label:'Géo',      color:'#f0f0f0', image:'repeating-linear-gradient(45deg,rgba(0,0,0,.04) 0 1px,transparent 1px 22px),repeating-linear-gradient(-45deg,rgba(0,0,0,.04) 0 1px,transparent 1px 22px)', size:'22px 22px' },
    { id:'nacre',       label:'Nacre',    color:'#ece8f5', image:'linear-gradient(120deg,rgba(255,200,220,.3) 0%,transparent 33%),linear-gradient(240deg,rgba(200,220,255,.3) 0%,transparent 33%),linear-gradient(360deg,rgba(220,255,200,.2) 0%,transparent 33%),linear-gradient(180deg,#f5f0ff 0%,#e8e0f5 100%)' },
  ],

};
