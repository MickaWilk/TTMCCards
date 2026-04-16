// ===== app.js — Point d'entrée / orchestration =====

(function() {
  'use strict';

  // ===== 1. Color Picker — grille 5 colonnes de pastilles =====
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
          // Mettre à jour l'état actif
          var all = container.querySelectorAll('.color-swatch');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
          swatch.classList.add('active');

          // Changer le thème
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

  // ===== 2. Icon Picker — grille 5 colonnes =====
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
      var isActive = btns[i].getAttribute('data-icon-id') === current && !window.customLogoDataURL;
      btns[i].classList.toggle('active', isActive);
    }
  }

  function updateColorPickerActive() {
    var swatches = document.querySelectorAll('.color-swatch');
    var current = window.getCurrentThemeId();
    for (var i = 0; i < swatches.length; i++) {
      swatches[i].classList.toggle('active', swatches[i].getAttribute('data-theme-id') === current);
    }
  }

  // ===== 3a. Font Size Controls =====
  function buildFontSizeControls() {
    var container = document.getElementById('font-size-controls');
    if (!container) return;
    container.innerHTML = '';

    var controls = [
      { key: 'subject',  label: 'Sujet',     min: 10, max: 36, step: 1, default: 20 },
      { key: 'question', label: 'Questions',  min: 6,  max: 18, step: 0.5, default: 9.5 },
      { key: 'answer',   label: 'Réponses',   min: 6,  max: 18, step: 0.5, default: 9.5 },
      { key: 'number',   label: 'Numéros',    min: 14, max: 42, step: 1, default: 28 }
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

  // ===== 3b. Font Selector =====
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

  // ===== 4. Logo Upload =====
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

  // ===== 5. Sections accordéon =====
  function setupSections() {
    var headers = document.querySelectorAll('.section-header');
    for (var i = 0; i < headers.length; i++) {
      (function(header) {
        header.addEventListener('click', function() {
          var section = header.parentElement;
          section.classList.toggle('open');
        });
      })(headers[i]);
    }
    // Ouvrir la section couleur par défaut
    var first = document.querySelector('.sidebar-section');
    if (first) first.classList.add('open');
  }

  // ===== 6. Sample Cards Modal =====
  function setupSampleCards() {
    var btn = document.getElementById('btn-sample');
    var modal = document.getElementById('sample-modal');
    if (!btn || !modal) return;

    btn.addEventListener('click', function() {
      showSampleModal();
    });

    // Fermer en cliquant sur l'overlay
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('visible');
      }
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

    for (var i = 0; i < SAMPLE_CARDS.length; i++) {
      (function(card, index) {
        var item = document.createElement('button');
        item.className = 'sample-card-item';
        var theme = window.getThemeById(card.themeId);
        item.innerHTML = '<span class="sample-dot" style="background:' + theme.headerBg + '"></span>' +
          '<span class="sample-label">' + card.sujet + '</span>' +
          '<span class="sample-theme">' + theme.label + '</span>';
        item.addEventListener('click', function() {
          var result = window.loadSampleCard(card);
          if (result) {
            updateColorPickerActive();
            updateIconPickerActive();
            // Mettre à jour le select police
            var sel = document.getElementById('font-select');
            if (sel) sel.value = result.fontId;
          }
          modal.classList.remove('visible');
          window.showToast('Carte charg\u00e9e : ' + card.sujet);
        });
        list.appendChild(item);
      })(SAMPLE_CARDS[i], i);
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

  // ===== 7. Restauration brouillon =====
  function checkDraftRestore() {
    var draft = window.loadFromLocalStorage();
    if (!draft || !draft.content) return;

    // Vérifier que le draft a du contenu
    var hasContent = false;
    if (draft.content.subject && draft.content.subject.trim()) hasContent = true;
    if (!hasContent && draft.content.q) {
      for (var k in draft.content.q) {
        if (draft.content.q[k] && draft.content.q[k].trim()) { hasContent = true; break; }
      }
    }
    if (!hasContent) return;

    // Afficher toast avec boutons
    var frag = document.createElement('div');
    frag.className = 'toast-inner';

    var msg = document.createElement('span');
    msg.textContent = 'Brouillon trouv\u00e9. Restaurer ?';
    frag.appendChild(msg);

    var actions = document.createElement('div');
    actions.className = 'toast-actions';

    var btnYes = document.createElement('button');
    btnYes.className = 'toast-btn toast-btn-yes';
    btnYes.textContent = 'Restaurer';
    btnYes.addEventListener('click', function() {
      // Restaurer thème, icône, police
      if (draft.themeId) window.setCurrentThemeId(draft.themeId);
      if (draft.iconId) window.setCurrentIconId(draft.iconId);
      if (draft.fontId) window.setCurrentFontId(draft.fontId);
      if (draft.fontSizes) window.setAllFontSizes(draft.fontSizes);

      var fontId = draft.fontId || 'poppins';
      window.loadFont(fontId).then(function() {
        window.renderCard(draft.themeId, draft.iconId, fontId);
        window.restoreCardContent(draft.content);
        updateColorPickerActive();
        updateIconPickerActive();
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

  // ===== 8. Auto Scale =====
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
    // 1. Construire les pickers
    buildColorPicker();
    buildIconPicker();
    buildFontSelector();
    buildFontSizeControls();

    // 2. Setup interactions
    setupLogoUpload();
    setupSections();
    setupSampleCards();

    // 3. Wiring boutons
    var btnExport = document.getElementById('btn-export');
    if (btnExport) btnExport.addEventListener('click', window.exportCard);

    var btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        window.clearCard();
        updateColorPickerActive();
        updateIconPickerActive();
        updateFontSizeControls();
        clearLogoPreview();
        var sel = document.getElementById('font-select');
        if (sel) sel.value = 'poppins';
        window.showToast('Carte r\u00e9initialis\u00e9e');
      });
    }

    // 4. Scale initial + resize
    updateCardScale();
    window.addEventListener('resize', updateCardScale);

    // 5. Render initial
    window.renderCard('blue', 'poisson', 'poppins');

    // 6. Vérifier brouillon après un court délai
    setTimeout(checkDraftRestore, 300);
  });

})();
