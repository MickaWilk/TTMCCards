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

  // ===== 7. Toggle Grid (visibility toggles) =====
  function buildToggleGrid() {
    var container = document.getElementById('toggle-grid');
    if (!container) return;
    container.innerHTML = '';

    var items = [
      { key: 'numbers',   label: 'Num\u00e9ros' },
      { key: 'questions', label: 'Questions' },
      { key: 'answers',   label: 'R\u00e9ponses' },
      { key: 'subject',   label: 'Sujet' },
      { key: 'header',    label: 'En-t\u00eate' },
      { key: 'icons',     label: 'Ic\u00f4nes' },
      { key: 'watermark', label: 'Watermark' }
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
  function setupOverlays() {
    var addInput = document.getElementById('overlay-add');
    if (addInput) {
      addInput.addEventListener('change', function(e) {
        var f = e.target.files[0];
        if (!f) return;
        var label = f.name.replace(/\.[^.]+$/, '');
        var r = new FileReader();
        r.onload = function(ev) {
          // Detect image dimensions to set default size
          var img = new Image();
          img.onload = function() {
            var w = img.width;
            var h = img.height;
            // Scale to fit card if larger
            if (w > 936 || h > 735) {
              var ratio = Math.min(936 / w, 735 / h);
              w = Math.round(w * ratio);
              h = Math.round(h * ratio);
            }
            window.addOverlay(ev.target.result, { w: w, h: h, label: label });
          };
          img.src = ev.target.result;
        };
        r.readAsDataURL(f);
        addInput.value = '';
      });
    }

    // Setup drag system
    window.setupOverlayDrag();

    // Callback when overlays change — rebuild sidebar list
    window.onOverlaysChanged = buildOverlayList;
  }

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

    for (var i = 0; i < list.length; i++) {
      (function(ov, idx) {
        var item = document.createElement('div');
        item.className = 'overlay-item';

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

        // Z-order up
        var btnUp = document.createElement('button');
        btnUp.className = 'overlay-item-btn';
        btnUp.textContent = '\u25B2';
        btnUp.title = 'Monter';
        btnUp.addEventListener('click', function() {
          window.moveOverlayZ(ov.id, 1);
        });
        actions.appendChild(btnUp);

        // Z-order down
        var btnDown = document.createElement('button');
        btnDown.className = 'overlay-item-btn';
        btnDown.textContent = '\u25BC';
        btnDown.title = 'Descendre';
        btnDown.addEventListener('click', function() {
          window.moveOverlayZ(ov.id, -1);
        });
        actions.appendChild(btnDown);

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

        // Wrap item + size row
        var wrap = document.createElement('div');
        wrap.appendChild(item);
        wrap.appendChild(sizeRow);
        container.appendChild(wrap);
      })(list[i], i);
    }
  }

  // ===== 11. Sections accordeon =====
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
    buildToggleGrid();
    buildIconPicker();
    buildFontSelector();
    buildFontSizeControls();
    buildNumButtons();

    setupBulkPaste();
    setupLogoUpload();
    setupImageUploads();
    setupOverlays();
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
        window.setAllToggles({ numbers:true, questions:true, answers:true, subject:true, header:true, icons:true, watermark:true });
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
