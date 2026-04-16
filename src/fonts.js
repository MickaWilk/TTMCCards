// ===== fonts.js — 12 polices Google Fonts avec chargement lazy =====

window.FONTS = [
  { id: 'poppins',       family: 'Poppins',        weights: '400;600;700;800;900', loaded: true },
  { id: 'roboto',        family: 'Roboto',         weights: '400;700;900',         loaded: false },
  { id: 'opensans',      family: 'Open Sans',      weights: '400;600;700;800',     loaded: false },
  { id: 'montserrat',    family: 'Montserrat',     weights: '400;600;700;800;900', loaded: false },
  { id: 'lato',          family: 'Lato',           weights: '400;700;900',         loaded: false },
  { id: 'raleway',       family: 'Raleway',        weights: '400;600;700;800;900', loaded: false },
  { id: 'nunito',        family: 'Nunito',         weights: '400;600;700;800;900', loaded: false },
  { id: 'playfair',      family: 'Playfair Display', weights: '400;700;900',       loaded: false },
  { id: 'oswald',        family: 'Oswald',         weights: '400;600;700',         loaded: false },
  { id: 'merriweather',  family: 'Merriweather',   weights: '400;700;900',         loaded: false },
  { id: 'sourcesans',    family: 'Source Sans 3',  weights: '400;600;700;900',     loaded: false },
  { id: 'bitter',        family: 'Bitter',         weights: '400;600;700;800;900', loaded: false }
];

/**
 * Charge dynamiquement une Google Font via injection d'un <link>.
 * Poppins est déjà preloaded dans le <head>, les autres se chargent à la demande.
 */
window.loadFont = function(fontId) {
  var font = null;
  for (var i = 0; i < FONTS.length; i++) {
    if (FONTS[i].id === fontId) { font = FONTS[i]; break; }
  }
  if (!font) return Promise.resolve();
  if (font.loaded) return Promise.resolve();

  return new Promise(function(resolve) {
    var familyParam = font.family.replace(/ /g, '+');
    var url = 'https://fonts.googleapis.com/css2?family=' + familyParam + ':wght@' + font.weights + '&display=swap';

    // Vérifie si le link existe déjà
    var existing = document.querySelector('link[href="' + url + '"]');
    if (existing) {
      font.loaded = true;
      resolve();
      return;
    }

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = function() {
      font.loaded = true;
      resolve();
    };
    link.onerror = function() {
      // On résout quand même pour ne pas bloquer
      resolve();
    };
    document.head.appendChild(link);
  });
};

/**
 * Applique une police à un élément de carte.
 */
window.applyFont = function(cardEl, fontFamily) {
  cardEl.style.fontFamily = "'" + fontFamily + "', sans-serif";
};

/**
 * Retourne l'objet font par id.
 */
window.getFontById = function(fontId) {
  for (var i = 0; i < FONTS.length; i++) {
    if (FONTS[i].id === fontId) return FONTS[i];
  }
  return FONTS[0];
};
