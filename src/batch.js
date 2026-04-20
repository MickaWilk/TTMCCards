// ===== batch.js — Génération en masse depuis JSON =====

(function() {
  'use strict';

  var batchCards = [];
  var batchCancelled = false;

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

  function normalizeCard(card) {
    // Si cardType absent mais sujet présent → standard
    if (!card.cardType && card.sujet) {
      card.cardType = 'standard';
    }
    return card;
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

    if (countEl) countEl.textContent = batchCards.length + ' carte' + (batchCards.length > 1 ? 's' : '') + ' charg\u00e9e' + (batchCards.length > 1 ? 's' : '');

    for (var i = 0; i < batchCards.length; i++) {
      (function(card, idx) {
        var item = document.createElement('div');
        item.className = 'batch-card-item';

        var badge = document.createElement('span');
        badge.className = 'batch-card-badge';
        badge.style.background = getBadgeColor(card);

        var label = document.createElement('span');
        label.className = 'batch-card-label';
        label.textContent = (idx + 1) + '. ' + (card.sujet || card.title || card.subtitle || 'Carte sans titre');

        item.appendChild(badge);
        item.appendChild(label);
        listEl.appendChild(item);
      })(batchCards[i], i);
    }

    var status = document.getElementById('batch-status');
    if (status) status.style.display = '';
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

      // Charger la carte et attendre le rendu DOM
      window.loadSampleCard(card);
      await sleep(350);

      if (batchCancelled) break;

      var slug = window.slugify(label);
      var cardType = card.cardType || 'standard';
      var themeId = card.themeId || '';
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
          alert('Collez un JSON ou chargez un fichier.');
          return;
        }
        var cards = parseJSON(raw);
        if (!cards || cards.length === 0) {
          alert('JSON invalide ou aucune carte trouv\u00e9e.');
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
          alert('Aucune carte charg\u00e9e.');
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
