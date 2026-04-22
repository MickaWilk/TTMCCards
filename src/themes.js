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
  }
};
