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
      debuter: '#3B9B3A',
      gagner: '#C8960C',
      challenge: '#F18A00',
      intrepide: '#B71C1C',
      terminer: '#6B2D8E',
      bonusmalus: '#1a1a1a'
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

          window.resetCustomColors();
          updateColorPickerActive();
          updateIconPickerActive();
          updateBulkPasteLabels();
          updateExportBothVisibility();
          updateCustomColors();
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
          window.resetCustomColors();
          window.renderCard(theme.id, newIcon, window.getCurrentFontId());
          updateIconPickerActive();
          updateCustomColors();
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
    } else if (ct === 'challenge') {
      if (label1) label1.textContent = 'Defi (face gauche)';
      if (area1) area1.placeholder = 'Collez le texte du defi...';
      if (label2) label2.textContent = 'Reponse (face droite)';
      if (area2) area2.placeholder = 'Collez la reponse du challenge...';
      if (hint) hint.textContent = 'Carte challenge avec eclair central. Editez directement sur la carte.';
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
    } else if (ct === 'terminer') {
      if (label1) label1.textContent = 'Texte recto (face gauche)';
      if (area1) area1.placeholder = 'Collez le texte du challenge recto...';
      if (label2) label2.textContent = 'Texte verso (face droite)';
      if (area2) area2.placeholder = 'Collez le texte du challenge verso...';
      if (hint) hint.textContent = 'Carte "Hesite pas a Terminer". Editez directement sur la carte.';
      if (area2) area2.style.display = '';
      if (label2) label2.style.display = '';
    } else if (ct === 'bonusmalus') {
      if (label1) label1.textContent = 'Texte TROP FORT (recto blanc)';
      if (area1) area1.placeholder = 'Decrivez le bonus...';
      if (label2) label2.textContent = 'Texte C\'EST NUL (verso noir)';
      if (area2) area2.placeholder = 'Decrivez le malus...';
      if (hint) hint.textContent = 'Recto blanc avec coeur, verso noir avec tete de mort.';
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

        var num = document.createElement('input');
        num.type = 'number';
        num.className = 'size-control-num';
        num.min = ctrl.min;
        num.max = ctrl.max;
        num.step = ctrl.step;
        num.value = range.value;
        num.setAttribute('data-size-key', ctrl.key);

        range.addEventListener('input', function() {
          num.value = range.value;
          window.setFontSize(ctrl.key, parseFloat(range.value));
          window.saveToLocalStorage();
        });
        num.addEventListener('input', function() {
          range.value = num.value;
          window.setFontSize(ctrl.key, parseFloat(num.value));
          window.saveToLocalStorage();
        });

        row.appendChild(label);
        row.appendChild(range);
        row.appendChild(num);
        container.appendChild(row);
      })(controls[i]);
    }
  }

  function updateFontSizeControls() {
    var sizes = window.getFontSizes();
    var ranges = document.querySelectorAll('.size-control-range[data-size-key]');
    for (var i = 0; i < ranges.length; i++) {
      var key = ranges[i].getAttribute('data-size-key');
      if (key && sizes[key] != null) {
        ranges[i].value = sizes[key];
        var num = ranges[i].parentElement.querySelector('.size-control-num[data-size-key="' + key + '"]');
        if (num) num.value = sizes[key];
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
    var dropZone = document.getElementById('logo-drop');

    if (!input) return;

    function handleLogoFile(f) {
      if (!f || !f.type.startsWith('image/')) return;
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
    }

    input.addEventListener('change', function(e) {
      handleLogoFile(e.target.files[0]);
    });

    // Drag-and-drop
    if (dropZone) {
      dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(102,126,234,.6)';
      });
      dropZone.addEventListener('dragleave', function() {
        dropZone.style.borderColor = '';
      });
      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '';
        var f = e.dataTransfer && e.dataTransfer.files[0];
        handleLogoFile(f);
      });
    }

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

  // ===== 6b. Custom Color Pickers =====
  var COLOR_FIELDS = [
    { key: 'headerBg',   label: 'En-tete (fond)',     cssProp: '--header-bg' },
    { key: 'headerText', label: 'En-tete (texte)',     cssProp: '--header-text' },
    { key: 'border',     label: 'Bordure',             cssProp: '--border' },
    { key: 'panelBg',    label: 'Fond contenu',        cssProp: '--panel-bg' },
    { key: 'numColor',   label: 'Numeros',             cssProp: '--num-color' },
    { key: 'cardBg',     label: 'Fond carte',          cssProp: '--card-bg' }
  ];

  function getThemeColorForField(field) {
    var theme = window.getThemeById(window.getCurrentThemeId());
    var map = { headerBg:'headerBg', headerText:'headerText', border:'border', numColor:'numColor', cardBg:'cardBg' };
    if (map[field.key] && theme) return theme[map[field.key]];
    if (field.key === 'panelBg') return '#ffffff';
    return '#ffffff';
  }

  function buildCustomColors() {
    var container = document.getElementById('custom-colors');
    if (!container) return;
    container.innerHTML = '';

    var current = window.getCustomColors();

    for (var i = 0; i < COLOR_FIELDS.length; i++) {
      (function(field) {
        var row = document.createElement('div');
        row.className = 'custom-color-row';

        var label = document.createElement('span');
        label.className = 'custom-color-label';
        label.textContent = field.label;

        var input = document.createElement('input');
        input.type = 'color';
        input.className = 'custom-color-input';
        input.setAttribute('data-color-key', field.key);
        input.value = current[field.key] || getThemeColorForField(field);

        input.addEventListener('input', function() {
          window.setCustomColor(field.key, input.value);
          window.saveToLocalStorage();
        });

        row.appendChild(label);
        row.appendChild(input);
        container.appendChild(row);
      })(COLOR_FIELDS[i]);
    }
  }

  function updateCustomColors() {
    var current = window.getCustomColors();
    for (var i = 0; i < COLOR_FIELDS.length; i++) {
      var input = document.querySelector('.custom-color-input[data-color-key="' + COLOR_FIELDS[i].key + '"]');
      if (input) {
        input.value = current[COLOR_FIELDS[i].key] || getThemeColorForField(COLOR_FIELDS[i]);
      }
    }
  }

  function setupResetColors() {
    var btn = document.getElementById('btn-reset-colors');
    if (!btn) return;
    btn.addEventListener('click', function() {
      window.resetCustomColors();
      updateCustomColors();
      window.renderCard(window.getCurrentThemeId(), window.getCurrentIconId(), window.getCurrentFontId());
      window.saveToLocalStorage();
      window.showToast('Couleurs reinitialisees');
    });
  }

  // ===== 7. Toggle Grid (visibility toggles) =====
  function buildToggleGrid() {
    var container = document.getElementById('toggle-grid');
    if (!container) return;
    container.innerHTML = '';

    var items = [
      { key: 'template',   label: 'Template' },
      { key: 'background', label: 'Fond' },
      { key: 'recto',      label: 'Recto (G)' },
      { key: 'verso',      label: 'Verso (D)' },
      { key: 'separator',  label: 'S\u00e9parateur' },
      { key: 'numbers',    label: 'Num\u00e9ros' },
      { key: 'questions',  label: 'Questions' },
      { key: 'answers',    label: 'R\u00e9ponses' },
      { key: 'subject',    label: 'Sujet' },
      { key: 'header',     label: 'En-t\u00eate' },
      { key: 'icons',      label: 'Ic\u00f4nes' },
      { key: 'rowlines',   label: 'Lignes' },
      { key: 'watermark',  label: 'Watermark' }
    ];

    var current = window.getToggles();

    for (var i = 0; i < items.length; i++) {
      (function(item) {
        var row = document.createElement('label');
        row.className = 'toggle-row';

        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'toggle-cb';
        cb.checked = current[item.key] !== false;
        cb.setAttribute('data-toggle-key', item.key);

        cb.addEventListener('change', function() {
          window.setToggle(item.key, cb.checked);
          window.saveToLocalStorage();
        });

        var span = document.createElement('span');
        span.textContent = item.label;

        row.appendChild(cb);
        row.appendChild(span);
        container.appendChild(row);
      })(items[i]);
    }
  }

  function updateToggleGrid() {
    var current = window.getToggles();
    var cbs = document.querySelectorAll('.toggle-cb');
    for (var i = 0; i < cbs.length; i++) {
      var key = cbs[i].getAttribute('data-toggle-key');
      if (key && current[key] != null) {
        cbs[i].checked = current[key];
      }
    }
  }

  // ===== 7a-bis. Toggle All/None =====
  function setupToggleAll() {
    var btn = document.getElementById('btn-toggle-all');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var current = window.getToggles();
      var keys = Object.keys(current);
      var allOn = true;
      for (var i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) { allOn = false; break; }
      }
      var newState = {};
      for (var j = 0; j < keys.length; j++) {
        newState[keys[j]] = !allOn;
      }
      window.setAllToggles(newState);
      updateToggleGrid();
      window.saveToLocalStorage();
    });
  }

  // ===== 7b. Gap Control =====
  function syncRangeNum(rangeId, numId, getter, setter) {
    var range = document.getElementById(rangeId);
    var num = document.getElementById(numId);
    if (!range) return;

    var v = getter();
    range.value = v;
    if (num) num.value = v;

    range.addEventListener('input', function() {
      if (num) num.value = range.value;
      setter(parseFloat(range.value));
      window.saveToLocalStorage();
    });
    if (num) {
      num.addEventListener('input', function() {
        range.value = num.value;
        setter(parseFloat(num.value));
        window.saveToLocalStorage();
      });
    }
  }

  function updateRangeNum(rangeId, numId, val) {
    var range = document.getElementById(rangeId);
    var num = document.getElementById(numId);
    if (range) range.value = val;
    if (num) num.value = val;
  }

  function setupGapControl() {
    syncRangeNum('gap-range', 'gap-num', window.getCardGap, function(v) { window.setCardGap(v); });
  }

  function updateGapControl() {
    updateRangeNum('gap-range', 'gap-num', window.getCardGap());
  }

  // ===== 7c. Padding Control (4 sides) =====
  function setupPaddingControl() {
    var pad = window.getCardPadding();
    var sides = [
      { side: 'top', range: 'pad-top-range', num: 'pad-top-num', val: pad.top },
      { side: 'bottom', range: 'pad-bottom-range', num: 'pad-bottom-num', val: pad.bottom },
      { side: 'left', range: 'pad-left-range', num: 'pad-left-num', val: pad.left },
      { side: 'right', range: 'pad-right-range', num: 'pad-right-num', val: pad.right }
    ];
    for (var i = 0; i < sides.length; i++) {
      (function(s) {
        syncRangeNum(s.range, s.num,
          function() { return window.getCardPadding()[s.side]; },
          function(v) { window.setCardPadding(s.side, v); }
        );
      })(sides[i]);
    }
  }

  function updatePaddingControl() {
    var pad = window.getCardPadding();
    updateRangeNum('pad-top-range', 'pad-top-num', pad.top);
    updateRangeNum('pad-bottom-range', 'pad-bottom-num', pad.bottom);
    updateRangeNum('pad-left-range', 'pad-left-num', pad.left);
    updateRangeNum('pad-right-range', 'pad-right-num', pad.right);
  }

  // ===== 7d. Border Width Control (4 directions) =====
  function setupBorderWidthControl() {
    var bdr = window.getInnerBorderWidth();
    var sides = [
      { side: 'top', range: 'bdr-top-range', num: 'bdr-top-num', val: bdr.top },
      { side: 'bottom', range: 'bdr-bottom-range', num: 'bdr-bottom-num', val: bdr.bottom },
      { side: 'left', range: 'bdr-left-range', num: 'bdr-left-num', val: bdr.left },
      { side: 'right', range: 'bdr-right-range', num: 'bdr-right-num', val: bdr.right }
    ];
    for (var i = 0; i < sides.length; i++) {
      (function(s) {
        syncRangeNum(s.range, s.num,
          function() { return window.getInnerBorderWidth()[s.side]; },
          function(v) { window.setInnerBorderWidth(s.side, v); }
        );
      })(sides[i]);
    }
  }

  function updateBorderWidthControl() {
    var bdr = window.getInnerBorderWidth();
    updateRangeNum('bdr-top-range', 'bdr-top-num', bdr.top);
    updateRangeNum('bdr-bottom-range', 'bdr-bottom-num', bdr.bottom);
    updateRangeNum('bdr-left-range', 'bdr-left-num', bdr.left);
    updateRangeNum('bdr-right-range', 'bdr-right-num', bdr.right);
  }

  // ===== 8. Image Uploads =====
  function setupImageUploads() {
    // --- Card background ---
    var cardBgInput = document.getElementById('img-card-bg');
    var cardBgPreview = document.getElementById('img-card-bg-preview');
    var cardBgClear = document.getElementById('img-card-bg-clear');

    if (cardBgInput) {
      cardBgInput.addEventListener('change', function(e) {
        var f = e.target.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function(ev) {
          window.setCardBg(ev.target.result);
          if (cardBgPreview) { cardBgPreview.src = ev.target.result; cardBgPreview.style.display = ''; }
          if (cardBgClear) cardBgClear.style.display = '';
        };
        r.readAsDataURL(f);
      });
    }
    if (cardBgClear) {
      cardBgClear.addEventListener('click', function() {
        window.setCardBg(null);
        if (cardBgPreview) { cardBgPreview.src = ''; cardBgPreview.style.display = 'none'; }
        cardBgClear.style.display = 'none';
        if (cardBgInput) cardBgInput.value = '';
      });
    }

    // --- Number background ---
    var numBgInput = document.getElementById('img-num-bg');
    var numBgPreview = document.getElementById('img-num-bg-preview');
    var numBgClear = document.getElementById('img-num-bg-clear');

    if (numBgInput) {
      numBgInput.addEventListener('change', function(e) {
        var f = e.target.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function(ev) {
          window.setNumBg(ev.target.result);
          if (numBgPreview) { numBgPreview.src = ev.target.result; numBgPreview.style.display = ''; }
          if (numBgClear) numBgClear.style.display = '';
        };
        r.readAsDataURL(f);
      });
    }
    if (numBgClear) {
      numBgClear.addEventListener('click', function() {
        window.setNumBg(null);
        if (numBgPreview) { numBgPreview.src = ''; numBgPreview.style.display = 'none'; }
        numBgClear.style.display = 'none';
        if (numBgInput) numBgInput.value = '';
      });
    }

    // --- Column import (split into 10) ---
    var colInput = document.getElementById('img-num-column');
    if (colInput) {
      colInput.addEventListener('change', function(e) {
        var f = e.target.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function(ev) {
          window.importNumColumn(ev.target.result, function(nums) {
            updateNumButtons(nums);
            window.showToast('Image d\u00e9coup\u00e9e en 10 num\u00e9ros');
          });
        };
        r.readAsDataURL(f);
      });
    }

    // --- Clear all nums ---
    var clearBtn = document.getElementById('btn-clear-nums');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        window.clearNumImages();
        resetNumButtons();
        window.showToast('Images de num\u00e9ros effac\u00e9es');
      });
    }
  }

  // ===== 9. Num Buttons (individual 1-10) =====
  var activeNumIndex = null;

  function buildNumButtons() {
    var container = document.getElementById('num-buttons');
    if (!container) return;
    container.innerHTML = '';

    for (var i = 1; i <= 10; i++) {
      (function(num) {
        var btn = document.createElement('button');
        btn.className = 'num-mini-btn';
        btn.textContent = num;
        btn.title = 'Importer image pour ' + num;
        btn.setAttribute('data-num', num);

        btn.addEventListener('click', function() {
          activeNumIndex = num;
          var input = document.getElementById('img-num-single');
          if (input) { input.value = ''; input.click(); }
        });

        container.appendChild(btn);
      })(i);
    }

    // Wire hidden single file input
    var singleInput = document.getElementById('img-num-single');
    if (singleInput) {
      singleInput.addEventListener('change', function(e) {
        if (activeNumIndex == null) return;
        var f = e.target.files[0];
        if (!f) return;
        var num = activeNumIndex;
        var r = new FileReader();
        r.onload = function(ev) {
          window.setNumImage(num, ev.target.result);
          // Update button visual
          var btn = document.querySelector('.num-mini-btn[data-num="' + num + '"]');
          if (btn) {
            btn.classList.add('has-img');
            btn.innerHTML = '<img src="' + ev.target.result + '">';
          }
        };
        r.readAsDataURL(f);
      });
    }
  }

  function updateNumButtons(nums) {
    if (!nums) return;
    for (var num in nums) {
      var btn = document.querySelector('.num-mini-btn[data-num="' + num + '"]');
      if (btn && nums[num]) {
        btn.classList.add('has-img');
        btn.innerHTML = '<img src="' + nums[num] + '">';
      }
    }
  }

  function resetNumButtons() {
    var btns = document.querySelectorAll('.num-mini-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('has-img');
      btns[i].textContent = btns[i].getAttribute('data-num');
    }
  }

  // ===== 10. Overlay / Calques =====
  function addOverlayFromFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    var label = file.name.replace(/\.[^.]+$/, '');
    var r = new FileReader();
    r.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var w = img.width;
        var h = img.height;
        if (w > 936 || h > 735) {
          var ratio = Math.min(936 / w, 735 / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        window.addOverlay(ev.target.result, { w: w, h: h, label: label });
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(file);
  }

  function setupOverlays() {
    var addInput = document.getElementById('overlay-add');
    var dropZone = document.getElementById('overlay-drop');

    if (addInput) {
      addInput.addEventListener('change', function(e) {
        for (var i = 0; i < e.target.files.length; i++) {
          addOverlayFromFile(e.target.files[i]);
        }
        addInput.value = '';
      });
    }

    if (dropZone) {
      dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        dropZone.classList.add('drop-active');
      });
      dropZone.addEventListener('dragleave', function(e) {
        if (!dropZone.contains(e.relatedTarget)) {
          dropZone.classList.remove('drop-active');
        }
      });
      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drop-active');
        var files = e.dataTransfer && e.dataTransfer.files;
        if (!files || files.length === 0) return;
        for (var i = 0; i < files.length; i++) {
          addOverlayFromFile(files[i]);
        }
        window.showToast(files.length > 1 ? files.length + ' calques ajout\u00e9s' : 'Calque ajout\u00e9');
      });
    }

    // Setup drag system
    window.setupOverlayDrag();

    // Callback when overlays change — rebuild sidebar list
    window.onOverlaysChanged = buildOverlayList;
  }

  // ===== 10b. Drop image on card preview =====
  function setupCardDropZone() {
    var dropZone = document.getElementById('card-wrapper');
    if (!dropZone) return;

    dropZone.addEventListener('dragover', function(e) {
      if (!e.dataTransfer || !e.dataTransfer.types || e.dataTransfer.types.indexOf('Files') === -1) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      dropZone.classList.add('drop-hover');
    });

    dropZone.addEventListener('dragleave', function(e) {
      if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drop-hover');
      }
    });

    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('drop-hover');
      var files = e.dataTransfer && e.dataTransfer.files;
      if (!files || files.length === 0) return;
      for (var i = 0; i < files.length; i++) {
        addOverlayFromFile(files[i]);
      }
      window.showToast(files.length > 1 ? files.length + ' calques ajout\u00e9s' : 'Calque ajout\u00e9');
    });
  }

  var draggedOverlayWrap = null;

  function buildOverlayList() {
    var container = document.getElementById('overlay-list');
    if (!container) return;
    container.innerHTML = '';

    var list = window.getOverlays();
    if (list.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'overlay-empty';
      empty.textContent = 'Aucun calque';
      container.appendChild(empty);
      return;
    }

    // Sort highest z first (top of stack = top of list)
    list.sort(function(a, b) { return b.z - a.z; });

    for (var i = 0; i < list.length; i++) {
      (function(ov, idx) {
        var item = document.createElement('div');
        item.className = 'overlay-item';

        // Drag handle
        var handle = document.createElement('span');
        handle.className = 'overlay-drag-handle';
        handle.textContent = '\u2630';
        handle.title = 'Glisser pour r\u00e9ordonner';
        item.appendChild(handle);

        // Thumbnail
        var thumb = document.createElement('img');
        thumb.className = 'overlay-item-thumb';
        thumb.src = ov.src;
        item.appendChild(thumb);

        // Label
        var lbl = document.createElement('span');
        lbl.className = 'overlay-item-label';
        lbl.textContent = ov.label;
        item.appendChild(lbl);

        // Actions
        var actions = document.createElement('div');
        actions.className = 'overlay-item-actions';

        // Visibility toggle
        var btnVis = document.createElement('button');
        btnVis.className = 'overlay-item-btn' + (ov.visible ? ' active' : '');
        btnVis.textContent = ov.visible ? '\u25C9' : '\u25CE';
        btnVis.title = 'Afficher / Masquer';
        btnVis.addEventListener('click', function() {
          window.setOverlayProp(ov.id, 'visible', !ov.visible);
        });
        actions.appendChild(btnVis);

        // Lock toggle
        var btnLock = document.createElement('button');
        btnLock.className = 'overlay-item-btn' + (ov.locked ? ' active' : '');
        btnLock.textContent = ov.locked ? '\uD83D\uDD12' : '\uD83D\uDD13';
        btnLock.title = ov.locked ? 'D\u00e9verrouiller' : 'Verrouiller';
        btnLock.addEventListener('click', function() {
          window.setOverlayProp(ov.id, 'locked', !ov.locked);
        });
        actions.appendChild(btnLock);

        // Delete
        var btnDel = document.createElement('button');
        btnDel.className = 'overlay-item-btn';
        btnDel.textContent = '\u2715';
        btnDel.title = 'Supprimer';
        btnDel.style.color = '#e74c3c';
        btnDel.addEventListener('click', function() {
          window.removeOverlay(ov.id);
        });
        actions.appendChild(btnDel);

        item.appendChild(actions);

        // Size row
        var sizeRow = document.createElement('div');
        sizeRow.className = 'overlay-size-row';

        var wInput = document.createElement('input');
        wInput.className = 'overlay-size-input';
        wInput.type = 'number';
        wInput.value = ov.w;
        wInput.title = 'Largeur';
        wInput.addEventListener('change', function() {
          window.setOverlayProp(ov.id, 'w', parseInt(wInput.value) || ov.w);
        });

        var sep = document.createElement('span');
        sep.textContent = '\u00d7';
        sep.style.color = '#666';
        sep.style.fontSize = '.7rem';

        var hInput = document.createElement('input');
        hInput.className = 'overlay-size-input';
        hInput.type = 'number';
        hInput.value = ov.h;
        hInput.title = 'Hauteur';
        hInput.addEventListener('change', function() {
          window.setOverlayProp(ov.id, 'h', parseInt(hInput.value) || ov.h);
        });

        var opLabel = document.createElement('span');
        opLabel.textContent = 'Op.';
        opLabel.style.cssText = 'color:#666;font-size:.65rem;margin-left:4px;';

        var opRange = document.createElement('input');
        opRange.type = 'range';
        opRange.className = 'overlay-opacity-range';
        opRange.min = 0;
        opRange.max = 1;
        opRange.step = 0.05;
        opRange.value = ov.opacity != null ? ov.opacity : 1;
        opRange.addEventListener('input', function() {
          window.setOverlayProp(ov.id, 'opacity', parseFloat(opRange.value));
        });

        sizeRow.appendChild(wInput);
        sizeRow.appendChild(sep);
        sizeRow.appendChild(hInput);
        sizeRow.appendChild(opLabel);
        sizeRow.appendChild(opRange);

        // Wrap item + size row — draggable
        var wrap = document.createElement('div');
        wrap.className = 'overlay-wrap';
        wrap.setAttribute('data-overlay-id', ov.id);
        wrap.appendChild(item);
        wrap.appendChild(sizeRow);

        // Drag reorder — only from handle
        handle.addEventListener('mousedown', function() {
          wrap.setAttribute('draggable', 'true');
        });
        wrap.addEventListener('dragend', function() {
          wrap.removeAttribute('draggable');
          wrap.classList.remove('dragging');
          draggedOverlayWrap = null;
          var all = container.querySelectorAll('.overlay-wrap');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('drag-over');
        });
        wrap.addEventListener('dragstart', function(e) {
          draggedOverlayWrap = wrap;
          wrap.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });
        wrap.addEventListener('dragover', function(e) {
          if (!draggedOverlayWrap || draggedOverlayWrap === wrap) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          var all = container.querySelectorAll('.overlay-wrap');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('drag-over');
          wrap.classList.add('drag-over');
        });
        wrap.addEventListener('dragleave', function() {
          wrap.classList.remove('drag-over');
        });
        wrap.addEventListener('drop', function(e) {
          e.preventDefault();
          if (!draggedOverlayWrap || draggedOverlayWrap === wrap) return;
          var movedId = parseInt(draggedOverlayWrap.getAttribute('data-overlay-id'));
          var targetId = ov.id;
          // In the list, top = highest z. Dropping above = higher z (before in DOM = before=true means higher z)
          var rect = wrap.getBoundingClientRect();
          var above = e.clientY < rect.top + rect.height / 2;
          // "before" in DOM order (highest z first) means the moved item gets HIGHER z than target
          // reorderOverlayZ works on the array (low z first), so before=false means insert after target in array = higher z
          window.reorderOverlayZ(movedId, targetId, !above);
          wrap.classList.remove('drag-over');
        });

        container.appendChild(wrap);
      })(list[i], i);
    }
  }

  // ===== 11. Sections — drag reorder =====
  function setupSectionsDrag(container) {
    if (!container) return;
    var sections = container.querySelectorAll('.sidebar-section');
    var draggedSection = null;

    for (var i = 0; i < sections.length; i++) {
      (function(section) {
        var header = section.querySelector('.section-header');
        if (!header) return;

        var handle = document.createElement('span');
        handle.className = 'section-drag-handle';
        handle.textContent = '\u2630';
        handle.title = 'Glisser pour r\u00e9ordonner';
        header.insertBefore(handle, header.firstChild);

        // Collapse toggle on header click (skip if drag handle was clicked)
        var isDragging = false;
        handle.addEventListener('mousedown', function() {
          isDragging = true;
          section.setAttribute('draggable', 'true');
        });
        header.addEventListener('click', function() {
          if (isDragging) { isDragging = false; return; }
          var body = section.querySelector('.section-body');
          if (!body) return;
          if (section.classList.contains('collapsed')) {
            // Expand: set max-height to scrollHeight for smooth animation
            section.classList.remove('collapsed');
            body.style.maxHeight = body.scrollHeight + 'px';
            setTimeout(function() { body.style.maxHeight = ''; }, 260);
          } else {
            // Collapse: set explicit max-height first, then collapse
            body.style.maxHeight = body.scrollHeight + 'px';
            // Force reflow
            body.offsetHeight;
            section.classList.add('collapsed');
          }
        });
        section.addEventListener('dragend', function() {
          isDragging = false;
          section.removeAttribute('draggable');
          section.classList.remove('dragging');
          draggedSection = null;
          var all = container.querySelectorAll('.sidebar-section');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('drag-over');
        });

        section.addEventListener('dragstart', function(e) {
          draggedSection = section;
          section.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        section.addEventListener('dragover', function(e) {
          if (!draggedSection || draggedSection === section) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          var all = container.querySelectorAll('.sidebar-section');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('drag-over');
          section.classList.add('drag-over');
        });

        section.addEventListener('dragleave', function() {
          section.classList.remove('drag-over');
        });

        section.addEventListener('drop', function(e) {
          e.preventDefault();
          if (!draggedSection || draggedSection === section) return;
          var rect = section.getBoundingClientRect();
          var mid = rect.top + rect.height / 2;
          if (e.clientY < mid) {
            container.insertBefore(draggedSection, section);
          } else {
            container.insertBefore(draggedSection, section.nextSibling);
          }
          section.classList.remove('drag-over');
        });
      })(sections[i]);
    }
  }

  function setupSections() {
    setupSectionsDrag(document.getElementById('sections-left'));
    setupSectionsDrag(document.getElementById('sections-right'));
  }

  // ===== 8. Sample Cards Modal =====
  function setupSampleCards() {
    var btn = document.getElementById('btn-sample');
    var modal = document.getElementById('sample-modal');
    if (!btn || !modal) return;

    btn.addEventListener('click', showSampleModal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeSampleModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('visible')) {
        closeSampleModal();
      }
    });
  }

  function closeSampleModal() {
    var modal = document.getElementById('sample-modal');
    if (modal) modal.classList.remove('visible');
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
              window.resetCustomColors();
              updateCardTypePickerActive();
              updateColorPickerActive();
              updateIconPickerActive();
              updateBulkPasteLabels();
              updateExportBothVisibility();
              updateCustomColors();
              var sel = document.getElementById('font-select');
              if (sel) sel.value = result.fontId;
            }
            closeSampleModal();
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
    closeBtn.addEventListener('click', closeSampleModal);
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
        updateGapControl();
        updatePaddingControl();
        updateBorderWidthControl();
        updateCustomColors();
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
    var pad = window.innerWidth <= 900 ? 20 : 60;
    var sw = (m.clientWidth - pad) / 936;
    var sh = (m.clientHeight - pad) / 735;
    var scale = Math.max(Math.min(sw, sh, 1), 0.2);
    var wrapper = document.getElementById('card-wrapper');
    if (wrapper) {
      wrapper.style.setProperty('--card-scale', scale.toFixed(4));
    }
  }

  // ===== Mobile Sidebar Toggle =====
  function setupMobileSidebar() {
    var toggleLeft  = document.getElementById('sidebar-toggle');
    var toggleRight = document.getElementById('sidebar-toggle-right');
    var sidebarL    = document.getElementById('sidebar');
    var sidebarR    = document.getElementById('sidebar-right');
    var backdrop    = document.getElementById('sidebar-backdrop');
    if (!backdrop) return;

    var iconHamburger = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/></svg>';
    var iconClose     = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>';
    var iconCustom    = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>';

    function closeAll() {
      if (sidebarL) sidebarL.classList.remove('open');
      if (sidebarR) sidebarR.classList.remove('open');
      backdrop.classList.remove('visible');
      if (toggleLeft) { toggleLeft.innerHTML = iconHamburger; toggleLeft.setAttribute('aria-label', 'Design'); }
      if (toggleRight) { toggleRight.innerHTML = iconCustom; toggleRight.setAttribute('aria-label', 'Personnalisation'); }
    }

    if (toggleLeft && sidebarL) {
      toggleLeft.addEventListener('click', function() {
        if (sidebarL.classList.contains('open')) {
          closeAll();
        } else {
          if (sidebarR) sidebarR.classList.remove('open');
          sidebarL.classList.add('open');
          backdrop.classList.add('visible');
          toggleLeft.innerHTML = iconClose;
          if (toggleRight) toggleRight.innerHTML = iconCustom;
        }
      });
    }

    if (toggleRight && sidebarR) {
      toggleRight.addEventListener('click', function() {
        if (sidebarR.classList.contains('open')) {
          closeAll();
        } else {
          if (sidebarL) sidebarL.classList.remove('open');
          sidebarR.classList.add('open');
          backdrop.classList.add('visible');
          toggleRight.innerHTML = iconClose;
          if (toggleLeft) toggleLeft.innerHTML = iconHamburger;
        }
      });
    }

    backdrop.addEventListener('click', closeAll);

    // Close sidebar when an action button is clicked (export/reset) on mobile
    var actionBtns = document.querySelectorAll('#btn-export, #btn-export-both, #btn-sample, #btn-reset');
    for (var i = 0; i < actionBtns.length; i++) {
      actionBtns[i].addEventListener('click', function() {
        if (window.innerWidth <= 768) closeAll();
      });
    }
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', function() {
    buildCardTypePicker();
    buildColorPicker();
    buildToggleGrid();
    buildIconPicker();
    buildFontSelector();
    buildFontSizeControls();
    buildNumButtons();

    buildCustomColors();
    setupResetColors();
    setupGapControl();
    setupPaddingControl();
    setupBorderWidthControl();
    setupToggleAll();
    setupBulkPaste();
    setupLogoUpload();
    setupImageUploads();
    setupOverlays();
    setupCardDropZone();
    setupSections();
    setupSampleCards();
    setupMobileSidebar();
    if (window.setupOCR) window.setupOCR();

    var btnExport = document.getElementById('btn-export');
    if (btnExport) btnExport.addEventListener('click', window.exportCard);

    var btnExportBoth = document.getElementById('btn-export-both');
    if (btnExportBoth) btnExportBoth.addEventListener('click', window.exportBothSides);

    var btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        if (!confirm('Reinitialiser la carte ? Toutes les modifications seront perdues.')) return;
        window.clearCard();
        window.setAllToggles({ numbers:true, questions:true, answers:true, subject:true, header:true, icons:true, watermark:true, background:true, template:true, recto:true, verso:true, separator:true, rowlines:true });
        window.setCardBg(null);
        window.setNumBg(null);
        window.clearNumImages();
        window.clearOverlays();
        updateCardTypePickerActive();
        updateColorPickerActive();
        updateIconPickerActive();
        updateBulkPasteLabels();
        updateExportBothVisibility();
        updateFontSizeControls();
        updateGapControl();
        updatePaddingControl();
        updateBorderWidthControl();
        updateCustomColors();
        updateToggleGrid();
        resetNumButtons();
        clearLogoPreview();
        // Clear image previews
        var cardBgPreview = document.getElementById('img-card-bg-preview');
        var cardBgClear = document.getElementById('img-card-bg-clear');
        var numBgPreview = document.getElementById('img-num-bg-preview');
        var numBgClear = document.getElementById('img-num-bg-clear');
        if (cardBgPreview) { cardBgPreview.src = ''; cardBgPreview.style.display = 'none'; }
        if (cardBgClear) cardBgClear.style.display = 'none';
        if (numBgPreview) { numBgPreview.src = ''; numBgPreview.style.display = 'none'; }
        if (numBgClear) numBgClear.style.display = 'none';
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
