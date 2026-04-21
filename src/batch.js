// ===== batch.js — Génération en masse depuis JSON =====

(function() {
  'use strict';

  var batchCards = [];
  var batchCancelled = false;
  var globalThemeOverride = ''; // '' = auto (use JSON themeId)
  var cardThemeOverrides = {};  // { index: themeId }

  // ===== Couleurs des badges par type =====
  var BADGE_COLORS = {
    'standard-green':  '#3B9B3A',
    'standard-yellow': '#C8960C',
    'standard-blue':   '#1565C0',
    'standard-red':    '#C00000',
    'debuter':         '#3B9B3A',
    'gagner':          '#C8960C',
    'challenge':       '#F18A00',
    'intrepide':       '#B71C1C',
    'terminer':        '#6B2D8E',
    'bonusmalus':      '#1a1a1a'
  };

  function getBadgeColor(card) {
    var type = card.cardType || 'standard';
    if (type === 'standard') {
      var themeId = card.themeId || '';
      var key = 'standard-' + themeId;
      if (BADGE_COLORS[key]) return BADGE_COLORS[key];
    }
    return BADGE_COLORS[type] || '#667eea';
  }

  // ===== Parser JSON =====
  function parseJSON(raw) {
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch(e) {
      return null;
    }

    // Format { "cards": [...] }
    if (parsed && Array.isArray(parsed.cards)) {
      return parsed.cards;
    }
    // Tableau direct
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  }

  // ===== Mapping des themeId courants =====
  var THEME_ALIASES = {
    'red': 'rouge_vif',
    'rouge': 'rouge_vif',
    'vert': 'green',
    'bleu': 'blue',
    'jaune': 'yellow',
    'noir': 'black',
    'violet': 'purple',
    'marron': 'brown',
    'or': 'gold'
  };

  function normalizeCard(card) {
    // Si cardType absent mais sujet présent → standard
    if (!card.cardType && card.sujet) {
      card.cardType = 'standard';
    }
    // Mapper les alias de themeId courants
    if (card.themeId && THEME_ALIASES[card.themeId]) {
      card.themeId = THEME_ALIASES[card.themeId];
    }
    return card;
  }

  // ===== Thème effectif pour une carte =====
  function getEffectiveThemeId(card, index) {
    if (cardThemeOverrides[index]) return cardThemeOverrides[index];
    if (globalThemeOverride) return globalThemeOverride;
    return card.themeId || 'green';
  }

  // ===== Construction des options <select> pour thèmes =====
  function buildThemeOptionsHTML(selectedId) {
    var html = '<option value="">Auto</option>';
    // Varimatrax en premier
    html += '<optgroup label="Varimatrax">';
    for (var i = 0; i < window.THEMES.length; i++) {
      if (window.THEMES[i].varimatrax) {
        html += '<option value="' + window.THEMES[i].id + '"' +
                (window.THEMES[i].id === selectedId ? ' selected' : '') +
                '>' + window.THEMES[i].label.replace('Varimatrax — ', '') + '</option>';
      }
    }
    html += '</optgroup>';
    // Thèmes standard
    html += '<optgroup label="Classiques">';
    for (var j = 0; j < window.THEMES.length; j++) {
      if (!window.THEMES[j].varimatrax) {
        html += '<option value="' + window.THEMES[j].id + '"' +
                (window.THEMES[j].id === selectedId ? ' selected' : '') +
                '>' + window.THEMES[j].label + '</option>';
      }
    }
    html += '</optgroup>';
    return html;
  }

  // ===== Download helper =====
  function downloadDataURL(dataURL, filename) {
    var a = document.createElement('a');
    a.download = filename;
    a.href = dataURL;
    a.click();
  }

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  // ===== Afficher la liste des cartes =====
  function renderCardList() {
    var listEl = document.getElementById('batch-card-list');
    var countEl = document.getElementById('batch-count');
    if (!listEl) return;

    listEl.innerHTML = '';
    cardThemeOverrides = {};

    if (countEl) countEl.textContent = batchCards.length + ' carte' + (batchCards.length > 1 ? 's' : '') + ' charg\u00e9e' + (batchCards.length > 1 ? 's' : '');

    // Mettre à jour le sélecteur global
    var globalSel = document.getElementById('batch-theme-override');
    if (globalSel) globalSel.innerHTML = buildThemeOptionsHTML(globalThemeOverride);

    for (var i = 0; i < batchCards.length; i++) {
      (function(card, idx) {
        var item = document.createElement('div');
        item.className = 'batch-card-item';

        var effectiveTheme = getEffectiveThemeId(card, idx);
        var theme = window.getThemeById(effectiveTheme);

        var badge = document.createElement('span');
        badge.className = 'batch-card-badge';
        badge.style.background = theme.headerBg;

        var label = document.createElement('span');
        label.className = 'batch-card-label';
        label.textContent = (idx + 1) + '. ' + (card.sujet || card.title || card.subtitle || 'Carte sans titre');

        var sel = document.createElement('select');
        sel.className = 'batch-card-theme-select';
        sel.innerHTML = buildThemeOptionsHTML('');
        sel.addEventListener('change', function() {
          cardThemeOverrides[idx] = sel.value || '';
          var newTheme = window.getThemeById(getEffectiveThemeId(card, idx));
          badge.style.background = newTheme.headerBg;
        });

        item.appendChild(badge);
        item.appendChild(label);
        item.appendChild(sel);
        listEl.appendChild(item);
      })(batchCards[i], i);
    }

    // Afficher la section thème + status
    var themeRow = document.getElementById('batch-theme-row');
    if (themeRow) themeRow.style.display = '';
    var status = document.getElementById('batch-status');
    if (status) {
      status.style.display = 'block';
      setTimeout(function() { status.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 50);
    }
  }

  // ===== Mettre à jour les badges quand le thème global change =====
  function updateAllBadges() {
    var items = document.querySelectorAll('.batch-card-item');
    for (var i = 0; i < items.length; i++) {
      if (i < batchCards.length) {
        var effectiveTheme = getEffectiveThemeId(batchCards[i], i);
        var theme = window.getThemeById(effectiveTheme);
        var badge = items[i].querySelector('.batch-card-badge');
        if (badge) badge.style.background = theme.headerBg;
      }
    }
  }

  // ===== Génération séquentielle =====
  function sleep(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }

  function getExportDimensions() {
    var exportW = parseInt(document.getElementById('export-w') ? document.getElementById('export-w').value : '4201') || 4201;
    var exportH = parseInt(document.getElementById('export-h') ? document.getElementById('export-h').value : '3300') || 3300;
    return { w: exportW, h: exportH };
  }

  function getMode() {
    var splitRadio = document.getElementById('batch-mode-split');
    return (splitRadio && splitRadio.checked) ? 'split' : 'full';
  }

  function captureAsync(side, exportW, exportH) {
    return new Promise(function(resolve) {
      window.captureCardToDataURL(side, exportW, exportH, function(dataURL) {
        resolve(dataURL);
      });
    });
  }

async function runBatch() {
batchCancelled = false;
var total = batchCards.length;
if (total === 0) return;
var btnGenerate = document.getElementById('btn-batch-generate');
var btnCancel = document.getElementById('btn-batch-cancel');
var progressWrap = document.getElementById('batch-progress-wrap');
var progressFill = document.getElementById('batch-progress-fill');
var progressText = document.getElementById('batch-progress-text');

if (btnGenerate) btnGenerate.disabled = true;
if (btnCancel) btnCancel.style.display = '';
if (progressWrap) progressWrap.style.display = '';
if (progressFill) progressFill.style.width = '0%';

var mode = getMode();
var dims = getExportDimensions();

for (var i = 0; i < total; i++) {
  if (batchCancelled) break;

  var card = batchCards[i];
  var label = card.sujet || card.title || card.subtitle || 'carte';

  if (progressText) progressText.textContent = 'Carte ' + (i + 1) + '/' + total + ' \u2014 ' + label;
  if (progressFill) progressFill.style.width = ((i / total) * 100) + '%';

  // Appliquer l'override de thème si défini
  var effectiveTheme = getEffectiveThemeId(card, i);
  var cardToLoad = Object.assign({}, card, { themeId: effectiveTheme });

  // Charger la carte, appliquer les réglages print
  window.loadSampleCard(cardToLoad);
  window.setCardGap(1);
  window.setToggle('separator', false);
  window.setInnerBorderWidth('top', 3);
  window.setInnerBorderWidth('right', 3);
  window.setInnerBorderWidth('bottom', 3);
  window.setInnerBorderWidth('left', 3);
  
  // Attendre que le DOM soit rendu + polices chargées
  await sleep(600);

  // Forcer l'écriture de TOUT le contenu dans le DOM (sujet + questions + réponses)
  // loadSampleCard peut avoir des race conditions — on réécrit tout inconditionnellement
  var p = document.getElementById('card-preview');
  if (p && window.getCurrentCardType() === 'standard') {
    var subjEl = p.querySelector('.panel-subject [contenteditable]');
    if (subjEl) subjEl.innerText = card.sujet || card.subject || '';

    var qEls = p.querySelectorAll('.pq-txt');
    for (var qi = 0; qi < qEls.length; qi++) {
      var qKey = qEls[qi].dataset.i;
      if (card.questions && card.questions[qKey]) {
        qEls[qi].innerText = card.questions[qKey];
      }
    }

    var aEls = p.querySelectorAll('.pa-txt');
    for (var ai = 0; ai < aEls.length; ai++) {
      var aKey = aEls[ai].dataset.i;
      if (card.answers && card.answers[aKey]) {
        aEls[ai].innerText = card.answers[aKey];
      }
    }
  } else if (p) {
    // Types non-standard : forcer les champs data-field
    var fieldEls = p.querySelectorAll('[data-field]');
    for (var fi = 0; fi < fieldEls.length; fi++) {
      var fKey = fieldEls[fi].dataset.field;
      if (card[fKey] !== undefined && card[fKey] !== '') {
        fieldEls[fi].innerText = card[fKey];
      }
    }
  }
  await sleep(100);

  if (batchCancelled) break;

  var slug = window.slugify(label);
  var cardType = card.cardType || 'standard';
  var themeId = effectiveTheme || card.themeId || '';
  var prefix = pad2(i + 1);

  if (mode === 'full') {
    var dataURL = await captureAsync('full', dims.w, dims.h);
    if (dataURL) {
      var filename = 'ttmc-' + prefix + '-' + cardType + '-' + themeId + '-' + slug + '.png';
      downloadDataURL(dataURL, filename);
    }
    await sleep(200);
  } else {
    // split : recto puis verso
    var rectoURL = await captureAsync('recto', dims.w, dims.h);
    if (rectoURL) {
      var rectoName = 'ttmc-' + prefix + '-' + cardType + '-recto-' + slug + '.png';
      downloadDataURL(rectoURL, rectoName);
    }
    await sleep(300);

    if (batchCancelled) break;

    var versoURL = await captureAsync('verso', dims.w, dims.h);
    if (versoURL) {
      var versoName = 'ttmc-' + prefix + '-' + cardType + '-verso-' + slug + '.png';
      downloadDataURL(versoURL, versoName);
    }
    await sleep(200);
  }
}

var exported = batchCancelled ? i : total;
if (progressFill) progressFill.style.width = '100%';
if (progressText) progressText.textContent = batchCancelled
  ? 'Annul\u00e9 \u2014 ' + exported + ' carte' + (exported > 1 ? 's' : '') + ' export\u00e9e' + (exported > 1 ? 's' : '')
  : 'Termin\u00e9 ! ' + total + ' carte' + (total > 1 ? 's' : '') + ' export\u00e9e' + (total > 1 ? 's' : '');

if (btnGenerate) btnGenerate.disabled = false;
if (btnCancel) btnCancel.style.display = 'none';
}

  // ===== Setup UI =====
  window.setupBatch = function() {
    var dropZone = document.getElementById('batch-drop');
    var fileInput = document.getElementById('batch-file-input');
    var textarea = document.getElementById('batch-json-paste');
    var btnLoad = document.getElementById('btn-batch-load');
    var btnGenerate = document.getElementById('btn-batch-generate');
    var btnCancel = document.getElementById('btn-batch-cancel');

    // -- Sélecteur de thème global --
    var globalSel = document.getElementById('batch-theme-override');
    if (globalSel) {
      globalSel.innerHTML = buildThemeOptionsHTML('');
      globalSel.addEventListener('change', function() {
        globalThemeOverride = globalSel.value || '';
        updateAllBadges();
      });
    }

    // -- Drop zone fichier --
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', function() {
        fileInput.click();
      });

      dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('drop-active');
      });
      dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('drop-active');
      });
      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drop-active');
        var f = e.dataTransfer && e.dataTransfer.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          if (textarea) textarea.value = ev.target.result;
        };
        reader.readAsText(f);
      });

      fileInput.addEventListener('change', function(e) {
        var f = e.target.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          if (textarea) textarea.value = ev.target.result;
        };
        reader.readAsText(f);
        fileInput.value = '';
      });
    }

    // -- Bouton Charger --
    if (btnLoad) {
      btnLoad.addEventListener('click', function() {
        var raw = textarea ? textarea.value.trim() : '';
        if (!raw) {
          window.showToast('Collez un JSON ou chargez un fichier.');
          return;
        }
        var cards = parseJSON(raw);
        if (!cards || cards.length === 0) {
          window.showToast('JSON invalide ou aucune carte trouv\u00e9e.');
          return;
        }
        batchCards = cards.map(normalizeCard);
        renderCardList();
      });
    }

    // -- Bouton Générer --
    if (btnGenerate) {
      btnGenerate.addEventListener('click', function() {
        if (batchCards.length === 0) {
          window.showToast('Aucune carte charg\u00e9e.');
          return;
        }
        runBatch();
      });
    }

    // -- Bouton Annuler --
    if (btnCancel) {
      btnCancel.addEventListener('click', function() {
        batchCancelled = true;
      });
    }
  };

})();
