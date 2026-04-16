// ===== app.js — Point d'entree / orchestration =====

(function() {
  'use strict';

  // ===== 0. Card Type Picker =====
  function buildCardTypePicker() {
    var container = document.getElementById('card-type-picker');
    if (!container) return;
    container.innerHTML = '';

    var defaultColors = {
      standard: '#3B9B3A',
      debuter: '#6D4C2A',
      gagner: '#C8960C',
      intrepide: '#B71C1C'
    };

    for (var i = 0; i < CARD_TYPES.length; i++) {
      (function(ct, index) {
        var btn = document.createElement('button');
        btn.className = 'card-type-btn' + (index === 0 ? ' active' : '');
        btn.setAttribute('data-card-type', ct.id);

        var dot = document.createElement('span');
        dot.className = 'card-type-btn-dot';
        dot.style.background = defaultColors[ct.id] || '#667eea';

        var textWrap = document.createElement('div');

        var label = document.createElement('div');
        label.className = 'card-type-btn-label';
        label.textContent = ct.label;

        var desc = document.createElement('div');
        desc.className = 'card-type-btn-desc';
        desc.textContent = ct.description;

        textWrap.appendChild(label);
        textWrap.appendChild(desc);
        btn.appendChild(dot);
        btn.appendChild(textWrap);

        btn.addEventListener('click', function() {
          var all = container.querySelectorAll('.card-type-btn');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
          btn.classList.add('active');

          window.setCurrentCardType(ct.id);

          // Switch to the default theme for this card type
          var cardType = window.getCardTypeById(ct.id);
          var newTheme = window.getThemeById(cardType.defaultTheme);
          window.setCurrentThemeId(cardType.defaultTheme);
          window.setCurrentIconId(newTheme.defaultIcon);

          updateColorPickerActive();
          updateIconPickerActive();
          updateBulkPasteLabels();
          updateExportBothVisibility();
          window.renderCard(cardType.defaultTheme, newTheme.defaultIcon, window.getCurrentFontId());
          window.saveToLocalStorage();
        });

        container.appendChild(btn);
      })(CARD_TYPES[i], i);
    }
  }

  function updateCardTypePickerActive() {
    var btns = document.querySelectorAll('.card-type-btn');
    var current = window.getCurrentCardType();
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-card-type') === current);
    }
  }

  // ===== 1. Color Picker =====
  function buildColorPicker() {
    var container = document.getElementById('color-picker');
    if (!container) return;
    container.innerHTML = '';
    container.className = 'color-picker-grid';

    for (var i = 0; i < THEMES.length; i++) {
      (function(theme, index) {
        var swatch = document.createElement('button');
        swatch.className = 'color-swatch' + (index === 0 ? ' active' : '');
        swatch.style.background = theme.headerBg;
        swatch.title = theme.label;
        swatch.setAttribute('data-theme-id', theme.id);
        swatch.addEventListener('click', function() {
          var all = container.querySelectorAll('.color-swatch');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
          swatch.classList.add('active');

          var newIcon = theme.defaultIcon;
          window.setCurrentThemeId(theme.id);
          window.setCurrentIconId(newIcon);
          window.renderCard(theme.id, newIcon, window.getCurrentFontId());
          updateIconPickerActive();
          window.saveToLocalStorage();
        });
        container.appendChild(swatch);
      })(THEMES[i], i);
    }
  }

  // ===== 2. Icon Picker =====
  function buildIconPicker() {
    var container = document.getElementById('icon-picker');
    if (!container) return;
    container.innerHTML = '';
    container.className = 'icon-picker-grid';

    for (var i = 0; i < ICON_ORDER.length; i++) {
      (function(iconId) {
        var icon = BUILTIN_ICONS[iconId];
        if (!icon) return;
        var btn = document.createElement('button');
        btn.className = 'icon-picker-btn' + (iconId === window.getCurrentIconId() && !window.customLogoDataURL ? ' active' : '');
        btn.title = icon.name;
        btn.innerHTML = icon.svg;
        btn.setAttribute('data-icon-id', iconId);
        btn.addEventListener('click', function() {
          window.customLogoDataURL = null;
          window.setCurrentIconId(iconId);
          clearLogoPreview();
          updateIconPickerActive();
          window.renderCard(window.getCurrentThemeId(), iconId, window.getCurrentFontId());
          window.saveToLocalStorage();
        });
        container.appendChild(btn);
      })(ICON_ORDER[i]);
    }
  }

  function updateIconPickerActive() {
    var btns = document.querySelectorAll('.icon-picker-btn');
    var current = window.getCurrentIconId();
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-icon-id') === current && !window.customLogoDataURL);
    }
  }

  function updateColorPickerActive() {
    var swatches = document.querySelectorAll('.color-swatch');
    var current = window.getCurrentThemeId();
    for (var i = 0; i < swatches.length; i++) {
      swatches[i].classList.toggle('active', swatches[i].getAttribute('data-theme-id') === current);
    }
  }

  // ===== 3. Bulk Paste Labels — adapt to card type =====
  function updateBulkPasteLabels() {
    var label1 = document.getElementById('bulk-label-1');
    var label2 = document.getElementById('bulk-label-2');
    var area1 = document.getElementById('bulk-questions');
    var area2 = document.getElementById('bulk-answers');
    var hint = document.getElementById('bulk-hint');

    var ct = window.getCurrentCardType();

    if (ct === 'standard') {
      if (label1) label1.textContent = 'Questions (1 par ligne)';
      if (label2) label2.textContent = 'Reponses (1 par ligne)';
      if (area1) area1.placeholder = 'Coller 10 questions ici...\nQuestion 1\nQuestion 2\n...';
      if (area2) area2.placeholder = 'Coller 10 reponses ici...\nReponse 1\nReponse 2\n...';
      if (hint) hint.textContent = 'Collez ou tapez 10 lignes, elles remplissent automatiquement la carte.';
      if (area2) area2.style.display = '';
      if (label2) label2.style.display = '';
    } else if (ct === 'debuter') {
      if (label1) label1.textContent = 'Texte recto (face gauche)';
      if (area1) area1.placeholder = 'Collez le texte du challenge recto...';
      if (label2) label2.textContent = 'Texte verso (face droite)';
      if (area2) area2.placeholder = 'Collez le texte du challenge verso...';
      if (hint) hint.textContent = 'Chaque face a son propre challenge. Editez aussi directement sur la carte.';
      if (area2) area2.style.display = '';
      if (label2) label2.style.display = '';
    } else if (ct === 'gagner') {
      if (label1) label1.textContent = 'Question recto (face gauche)';
      if (area1) area1.placeholder = 'Collez le texte du challenge recto...';
      if (label2) label2.textContent = 'Question verso (face droite)';
      if (area2) area2.placeholder = 'Collez le texte du challenge verso...';
      if (hint) hint.textContent = 'Chaque face a son propre challenge. Editez aussi directement sur la carte.';
      if (area2) area2.style.display = '';
      if (label2) label2.style.display = '';
    } else if (ct === 'intrepide') {
      if (label1) label1.textContent = 'Description du defi';
      if (area1) area1.placeholder = 'Collez la description du defi...';
      if (label2) label2.textContent = 'Reponses';
      if (area2) area2.placeholder = 'Collez les reponses ici...';
      if (hint) hint.textContent = 'Le texte remplit les deux panneaux de la carte.';
      if (area2) area2.style.display = '';
      if (label2) label2.style.display = '';
    }
  }

  // ===== 3b. Show/hide "export both sides" depending on card type =====
  function updateExportBothVisibility() {
    var btn = document.getElementById('btn-export-both');
    if (!btn) return;
    // All card types are now dual-panel, always show
    btn.style.display = '';
  }

  // ===== 4a. Font Size Controls =====
  function buildFontSizeControls() {
    var container = document.getElementById('font-size-controls');
    if (!container) return;
    container.innerHTML = '';

    var controls = [
      { key: 'subject',  label: 'Sujet',     min: 10, max: 36, step: 1, default: 22 },
      { key: 'question', label: 'Questions',  min: 6,  max: 20, step: 0.5, default: 10 },
      { key: 'answer',   label: 'Reponses',   min: 6,  max: 20, step: 0.5, default: 10 },
      { key: 'number',   label: 'Numeros',    min: 14, max: 42, step: 1, default: 28 }
    ];

    var sizes = window.getFontSizes();

    for (var i = 0; i < controls.length; i++) {
      (function(ctrl) {
        var row = document.createElement('div');
        row.className = 'size-control-row';

        var label = document.createElement('span');
        label.className = 'size-control-label';
        label.textContent = ctrl.label;

        var range = document.createElement('input');
        range.type = 'range';
        range.className = 'size-control-range';
        range.min = ctrl.min;
        range.max = ctrl.max;
        range.step = ctrl.step;
        range.value = sizes[ctrl.key] || ctrl.default;
        range.setAttribute('data-size-key', ctrl.key);

        var val = document.createElement('span');
        val.className = 'size-control-val';
        val.textContent = range.value + 'px';

        range.addEventListener('input', function() {
          val.textContent = parseFloat(range.value) + 'px';
          window.setFontSize(ctrl.key, parseFloat(range.value));
          window.saveToLocalStorage();
        });

        row.appendChild(label);
        row.appendChild(range);
        row.appendChild(val);
        container.appendChild(row);
      })(controls[i]);
    }
  }

  function updateFontSizeControls() {
    var sizes = window.getFontSizes();
    var ranges = document.querySelectorAll('.size-control-range');
    for (var i = 0; i < ranges.length; i++) {
      var key = ranges[i].getAttribute('data-size-key');
      if (key && sizes[key] != null) {
        ranges[i].value = sizes[key];
        var val = ranges[i].parentElement.querySelector('.size-control-val');
        if (val) val.textContent = sizes[key] + 'px';
      }
    }
  }

  // ===== 4b. Font Selector =====
  function buildFontSelector() {
    var wrap = document.getElementById('font-select-wrap');
    if (!wrap) return;
    var sel = document.createElement('select');
    sel.id = 'font-select';

    for (var i = 0; i < FONTS.length; i++) {
      var opt = document.createElement('option');
      opt.value = FONTS[i].id;
      opt.textContent = FONTS[i].family;
      if (FONTS[i].id === 'poppins') opt.selected = true;
      sel.appendChild(opt);
    }

    sel.addEventListener('change', function() {
      var fontId = sel.value;
      window.setCurrentFontId(fontId);
      window.loadFont(fontId).then(function() {
        var font = window.getFontById(fontId);
        var card = document.getElementById('card-preview');
        if (card && font) window.applyFont(card, font.family);
        window.saveToLocalStorage();
      });
    });

    wrap.appendChild(sel);
  }

  // ===== 5. Bulk Paste =====
  function setupBulkPaste() {
    var qArea = document.getElementById('bulk-questions');
    var aArea = document.getElementById('bulk-answers');

    if (qArea) {
      qArea.addEventListener('input', function() {
        window.applyBulkQuestions(qArea.value);
      });
    }

    if (aArea) {
      aArea.addEventListener('input', function() {
        window.applyBulkAnswers(aArea.value);
      });
    }
  }

  // ===== 6. Logo Upload =====
  function setupLogoUpload() {
    var input = document.getElementById('logo-input');
    var wrap = document.getElementById('logo-preview-wrap');
    var img = document.getElementById('logo-preview-img');
    var nm = document.getElementById('logo-preview-name');
    var removeBtn = document.getElementById('logo-remove');

    if (!input) return;

    input.addEventListener('change', function(e) {
      var f = e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function(ev) {
        window.customLogoDataURL = ev.target.result;
        if (img) img.src = window.customLogoDataURL;
        if (nm) nm.textContent = f.name;
        if (wrap) wrap.style.display = 'flex';
        updateIconPickerActive();
        window.renderCard(window.getCurrentThemeId(), window.getCurrentIconId(), window.getCurrentFontId());
      };
      r.readAsDataURL(f);
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        window.customLogoDataURL = null;
        clearLogoPreview();
        updateIconPickerActive();
        window.renderCard(window.getCurrentThemeId(), window.getCurrentIconId(), window.getCurrentFontId());
      });
    }
  }

  function clearLogoPreview() {
    var wrap = document.getElementById('logo-preview-wrap');
    var input = document.getElementById('logo-input');
    if (wrap) wrap.style.display = 'none';
    if (input) input.value = '';
  }

  // ===== 7. Sections accordeon =====
  function setupSections() {
    var headers = document.querySelectorAll('.section-header');
    for (var i = 0; i < headers.length; i++) {
      (function(header) {
        header.addEventListener('click', function() {
          header.parentElement.classList.toggle('open');
        });
      })(headers[i]);
    }
  }

  // ===== 8. Sample Cards Modal =====
  function setupSampleCards() {
    var btn = document.getElementById('btn-sample');
    var modal = document.getElementById('sample-modal');
    if (!btn || !modal) return;

    btn.addEventListener('click', showSampleModal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('visible');
    });
  }

  function showSampleModal() {
    var modal = document.getElementById('sample-modal');
    if (!modal) return;

    var inner = modal.querySelector('.sample-modal-inner');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'sample-modal-inner';
      modal.appendChild(inner);
    }
    inner.innerHTML = '';

    var title = document.createElement('h2');
    title.textContent = 'Cartes d\'exemple';
    title.className = 'sample-modal-title';
    inner.appendChild(title);

    var list = document.createElement('div');
    list.className = 'sample-card-list';

    // Group samples by card type
    var groups = {};
    var typeLabels = {};
    for (var t = 0; t < CARD_TYPES.length; t++) {
      groups[CARD_TYPES[t].id] = [];
      typeLabels[CARD_TYPES[t].id] = CARD_TYPES[t].label;
    }

    for (var s = 0; s < SAMPLE_CARDS.length; s++) {
      var ct = SAMPLE_CARDS[s].cardType || 'standard';
      if (!groups[ct]) groups[ct] = [];
      groups[ct].push(SAMPLE_CARDS[s]);
    }

    // Render each group
    for (var typeId in groups) {
      if (groups[typeId].length === 0) continue;

      var sectionTitle = document.createElement('div');
      sectionTitle.className = 'sample-section-title';
      sectionTitle.textContent = typeLabels[typeId] || typeId;
      list.appendChild(sectionTitle);

      for (var c = 0; c < groups[typeId].length; c++) {
        (function(card) {
          var item = document.createElement('button');
          item.className = 'sample-card-item';
          var theme = window.getThemeById(card.themeId);
          var cardLabel = card.sujet || card.title || card.subtitle || 'Carte';
          item.innerHTML = '<span class="sample-dot" style="background:' + theme.headerBg + '"></span>' +
            '<span class="sample-label">' + cardLabel + '</span>' +
            '<span class="sample-theme">' + theme.label + '</span>';
          item.addEventListener('click', function() {
            var result = window.loadSampleCard(card);
            if (result) {
              updateCardTypePickerActive();
              updateColorPickerActive();
              updateIconPickerActive();
              updateBulkPasteLabels();
              updateExportBothVisibility();
              var sel = document.getElementById('font-select');
              if (sel) sel.value = result.fontId;
            }
            modal.classList.remove('visible');
            window.showToast('Carte chargee : ' + cardLabel);
          });
          list.appendChild(item);
        })(groups[typeId][c]);
      }
    }

    inner.appendChild(list);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary sample-modal-close';
    closeBtn.textContent = 'Fermer';
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('visible');
    });
    inner.appendChild(closeBtn);

    modal.classList.add('visible');
  }

  // ===== 9. Restauration brouillon =====
  function checkDraftRestore() {
    var draft = window.loadFromLocalStorage();
    if (!draft) return;

    var hasContent = false;

    // Standard Q&A
    if (draft.subject && draft.subject.trim()) hasContent = true;
    if (!hasContent && draft.questions) {
      for (var k in draft.questions) {
        if (draft.questions[k] && draft.questions[k].trim()) { hasContent = true; break; }
      }
    }
    if (!hasContent && draft.answers) {
      for (var k2 in draft.answers) {
        if (draft.answers[k2] && draft.answers[k2].trim()) { hasContent = true; break; }
      }
    }

    // Challenge fields
    if (!hasContent && draft.title && draft.title.trim()) hasContent = true;
    if (!hasContent && draft.body && draft.body.trim()) hasContent = true;
    if (!hasContent && draft.subtitle && draft.subtitle.trim()) hasContent = true;
    if (!hasContent && draft.responses && draft.responses.trim()) hasContent = true;

    // Legacy recto/verso format
    if (!hasContent && draft.recto) {
      var subj = draft.recto.subject || draft.recto.subjectA || '';
      if (subj.trim()) hasContent = true;
    }

    if (!hasContent) return;

    var frag = document.createElement('div');
    frag.className = 'toast-inner';

    var msg = document.createElement('span');
    msg.textContent = 'Brouillon trouve. Restaurer ?';
    frag.appendChild(msg);

    var actions = document.createElement('div');
    actions.className = 'toast-actions';

    var btnYes = document.createElement('button');
    btnYes.className = 'toast-btn toast-btn-yes';
    btnYes.textContent = 'Restaurer';
    btnYes.addEventListener('click', function() {
      if (draft.cardType) window.setCurrentCardType(draft.cardType);
      if (draft.themeId) window.setCurrentThemeId(draft.themeId);
      if (draft.iconId) window.setCurrentIconId(draft.iconId);
      if (draft.fontId) window.setCurrentFontId(draft.fontId);
      if (draft.fontSizes) window.setAllFontSizes(draft.fontSizes);

      var fontId = draft.fontId || 'poppins';
      window.loadFont(fontId).then(function() {
        window.renderCard(draft.themeId, draft.iconId, fontId);
        window.restoreCardContent(draft);

        updateCardTypePickerActive();
        updateColorPickerActive();
        updateIconPickerActive();
        updateBulkPasteLabels();
        updateExportBothVisibility();
        updateFontSizeControls();
        var sel = document.getElementById('font-select');
        if (sel) sel.value = fontId;
      });

      window.hideToast();
    });

    var btnNo = document.createElement('button');
    btnNo.className = 'toast-btn toast-btn-no';
    btnNo.textContent = 'Ignorer';
    btnNo.addEventListener('click', function() {
      try { localStorage.removeItem('ttmc-card-draft'); } catch(e) {}
      window.hideToast();
    });

    actions.appendChild(btnYes);
    actions.appendChild(btnNo);
    frag.appendChild(actions);

    window.showToast(frag, 0);
  }

  // ===== 10. Auto Scale =====
  function updateCardScale() {
    var m = document.querySelector('.main');
    if (!m) return;
    var sw = (m.clientWidth - 60) / 936;
    var sh = (m.clientHeight - 60) / 735;
    var wrapper = document.getElementById('card-wrapper');
    if (wrapper) {
      wrapper.style.setProperty('--card-scale', Math.min(sw, sh, 1).toFixed(4));
    }
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', function() {
    buildCardTypePicker();
    buildColorPicker();
    buildIconPicker();
    buildFontSelector();
    buildFontSizeControls();

    setupBulkPaste();
    setupLogoUpload();
    setupSections();
    setupSampleCards();

    var btnExport = document.getElementById('btn-export');
    if (btnExport) btnExport.addEventListener('click', window.exportCard);

    var btnExportBoth = document.getElementById('btn-export-both');
    if (btnExportBoth) btnExportBoth.addEventListener('click', window.exportBothSides);

    var btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        window.clearCard();
        updateCardTypePickerActive();
        updateColorPickerActive();
        updateIconPickerActive();
        updateBulkPasteLabels();
        updateExportBothVisibility();
        updateFontSizeControls();
        clearLogoPreview();
        var qArea = document.getElementById('bulk-questions');
        var aArea = document.getElementById('bulk-answers');
        if (qArea) qArea.value = '';
        if (aArea) aArea.value = '';
        var sel = document.getElementById('font-select');
        if (sel) sel.value = 'poppins';
        window.showToast('Carte reinitialisee');
      });
    }

    updateCardScale();
    updateBulkPasteLabels();
    updateExportBothVisibility();
    window.addEventListener('resize', updateCardScale);

    window.renderCard('green', 'feuille', 'poppins');

    setTimeout(checkDraftRestore, 300);
  });

})();
