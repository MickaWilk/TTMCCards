// ===== cards.js — Rendu multi-types de cartes TTMC =====
var skipSaveToMemory = false;

(function() {
  'use strict';

  // ===== State =====
  var currentCardType = 'standard';
  var currentThemeId = 'green';
  var currentIconId = 'feuille';
  var currentFontId = 'poppins';
  var saveTimer = null;

  var fontSizes = {
    subject: 22,
    question: 10,
    answer: 10,
    number: 28
  };

  // Card data adapts to card type
  var cardData = {
    // Standard Q&A
    subject: '',
    questions: {},
    answers: {},
    // Challenge cards — Face A (recto / panneau gauche)
    title: '',
    body: '',
    footer: '',
    subtitle: '',
    challengeAnswer: '',
    // Challenge cards — Face B (verso / panneau droit)
    titleB: '',
    bodyB: '',
    footerB: '',
    subtitleB: '',
    challengeAnswerB: '',
    // Debuter headers
    debuterHeader: '',
    debuterLabel: '',
    debuterHeaderB: '',
    debuterLabelB: '',
    // Gagner headers
    gagnerHeader: '',
    gagnerHeaderB: '',
    answerLabel: '',
    answerLabelB: '',
    // Intrepide headers
    intrepideHeaderL: '',
    intrepideHeaderR: '',
    intrepideSub: '',
    // Intrepide
    responses: '',
    // Bonus/Malus labels
    bonusMalusLabelA: '',
    bonusMalusLabelB: ''
  };

  // Toggles de visibilite
  var toggles = {
    numbers: true,
    questions: true,
    answers: true,
    subject: true,
    header: true,
    icons: true,
    iconbg: true,
    watermark: true,
    background: true,
    template: true,
    recto: true,
    verso: true,
    separator: true,
    rowlines: true
  };

  // Calques (image overlays)
  var overlays = [];
  var nextOverlayId = 1;
  var dragState = null;

  // Images personnalisees
  var customImages = {
    cardBg: null,   // data URL fond de carte
    numBg: null,    // data URL fond de numeros
    nums: {}        // { '1': dataURL, ... '10': dataURL }
  };

  var cardGap = 1;
  var padTop = 14;
  var padRight = 14;
  var padBottom = 14;
  var padLeft = 14;
  var bdrTop = 3;
  var bdrRight = 3;
  var bdrBottom = 3;
  var bdrLeft = 3;

  // Custom color overrides (null = use theme default)
  var customColors = {
    headerBg: null,
    headerText: null,
    border: null,
    panelBg: null,
    numColor: null,
    cardBg: null
  };

  var LS_KEY = 'ttmc-card-draft';
  window.customLogoDataURL = null;

  // ===== Helpers =====
  function iconHTML() {
    if (currentIconId === 'none') return '';
    if (window.customLogoDataURL) {
      return '<img src="' + window.customLogoDataURL + '">';
    }
    var icon = window.BUILTIN_ICONS[currentIconId];
    return icon ? icon.svg : '';
  }

  // ttmcLogo removed — was always returning ''

  function applyFontSizeProperties(el) {
    el.style.setProperty('--subject-size', fontSizes.subject + 'px');
    el.style.setProperty('--question-size', fontSizes.question + 'px');
    el.style.setProperty('--answer-size', fontSizes.answer + 'px');
    el.style.setProperty('--num-size', fontSizes.number + 'px');
    el.style.setProperty('--answer-num-size', Math.round(fontSizes.number * 0.46) + 'px');
  }

  // ===== Main Render =====
  window.renderCard = function(themeId, iconId, fontId, skipSave) {
    if (themeId) currentThemeId = themeId;
    if (iconId) currentIconId = iconId;
    if (fontId) currentFontId = fontId;

    skipSaveToMemory = !!skipSave

    var theme = window.getThemeById(currentThemeId);
    var p = document.getElementById('card-preview');
    if (!p) return;

if (!skipSaveToMemory) saveToMemory();

    window.applyTheme(p, theme);

    // Apply custom color overrides on top of theme
    if (customColors.headerBg)   p.style.setProperty('--header-bg', customColors.headerBg);
    if (customColors.headerText) p.style.setProperty('--header-text', customColors.headerText);
    if (customColors.border)     p.style.setProperty('--border', customColors.border);
    if (customColors.panelBg)    p.style.setProperty('--panel-bg', customColors.panelBg);
    if (customColors.numColor)   p.style.setProperty('--num-color', customColors.numColor);
    if (customColors.cardBg)     p.style.setProperty('--card-bg', customColors.cardBg);

    var font = window.getFontById(currentFontId);
    if (font) window.applyFont(p, font.family);
    applyFontSizeProperties(p);
    p.style.setProperty('--card-gap', cardGap + 'px');
    p.style.setProperty('--pad-top', padTop + 'px');
    p.style.setProperty('--pad-right', padRight + 'px');
    p.style.setProperty('--pad-bottom', padBottom + 'px');
    p.style.setProperty('--pad-left', padLeft + 'px');
    p.style.setProperty('--card-padding', padTop + 'px ' + padRight + 'px ' + padBottom + 'px ' + padLeft + 'px');
    p.style.setProperty('--bdr-top', bdrTop + 'px');
    p.style.setProperty('--bdr-right', bdrRight + 'px');
    p.style.setProperty('--bdr-bottom', bdrBottom + 'px');
    p.style.setProperty('--bdr-left', bdrLeft + 'px');
    p.style.setProperty('--inner-border-width', bdrTop + 'px ' + bdrRight + 'px ' + bdrBottom + 'px ' + bdrLeft + 'px');

    // Remove old card type classes, add current (preserve vx-texture if Varimatrax)
    p.className = 'ttmc-card card-type-' + currentCardType;
    if (theme.varimatrax) p.classList.add('vx-texture');

    // Dispatch to the right renderer
    switch (currentCardType) {
      case 'debuter':    renderDebuter(p); break;
      case 'gagner':     renderGagner(p); break;
      case 'challenge':  renderChallenge(p); break;
      case 'intrepide':  renderIntrepide(p); break;
      case 'terminer':   renderTerminer(p); break;
      case 'bonusmalus': renderBonusMalus(p); break;
      default:           renderStandard(p); break;
    }

    restoreFromMemory();
    applyToggles(p);
    applyCustomImages(p);
    renderOverlays(p);
    setupAutoSave(p);
    skipSaveToMemory = false;
  };

  // ===== Toggles de visibilite =====
  function applyToggles(p) {
    p.classList.toggle('hide-numbers', !toggles.numbers);
    p.classList.toggle('hide-questions', !toggles.questions);
    p.classList.toggle('hide-answers', !toggles.answers);
    p.classList.toggle('hide-subject', !toggles.subject);
    p.classList.toggle('hide-header', !toggles.header);
    p.classList.toggle('hide-icons', !toggles.icons);
    p.classList.toggle('hide-iconbg', !toggles.iconbg);
    p.classList.toggle('hide-watermark', !toggles.watermark);
    p.classList.toggle('hide-background', !toggles.background);
    p.classList.toggle('hide-template', !toggles.template);
    p.classList.toggle('hide-recto', !toggles.recto);
    p.classList.toggle('hide-verso', !toggles.verso);
    p.classList.toggle('hide-separator', !toggles.separator);
    p.classList.toggle('hide-rowlines', !toggles.rowlines);
  }

  // ===== Images personnalisees =====
  function applyCustomImages(p) {
    // Background de carte
    if (customImages.cardBg) {
      p.style.backgroundImage = 'url(' + customImages.cardBg + ')';
      p.style.backgroundSize = 'cover';
      p.style.backgroundPosition = 'center';
    } else {
      p.style.backgroundImage = '';
    }

    // Background de numeros
    var allNums = p.querySelectorAll('.pq-num, .pa-num');
    for (var n = 0; n < allNums.length; n++) {
      if (customImages.numBg) {
        allNums[n].style.backgroundImage = 'url(' + customImages.numBg + ')';
        allNums[n].style.backgroundSize = 'contain';
        allNums[n].style.backgroundRepeat = 'no-repeat';
        allNums[n].style.backgroundPosition = 'center';
        allNums[n].classList.add('has-num-bg');
      } else {
        allNums[n].style.backgroundImage = '';
        allNums[n].classList.remove('has-num-bg');
      }
    }

    // Images de numeros individuels
    for (var num in customImages.nums) {
      if (!customImages.nums[num]) continue;
      var els = p.querySelectorAll('.pq-num[data-num="' + num + '"], .pa-num[data-num="' + num + '"]');
      for (var e = 0; e < els.length; e++) {
        els[e].innerHTML = '<img src="' + customImages.nums[num] + '" class="custom-num-img">';
      }
    }
  }

  // ===== Calques (overlays) =====
  var resizeState = null;

  function renderOverlays(p) {
    if (!p) p = document.getElementById('card-preview');
    if (!p) return;

    var old = p.querySelectorAll('.card-overlay');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);

    var sorted = overlays.slice().sort(function(a, b) { return a.z - b.z; });
    for (var j = 0; j < sorted.length; j++) {
      var o = sorted[j];
      if (!o.visible) continue;

      var wrap = document.createElement('div');
      wrap.className = 'card-overlay' + (o.locked ? ' overlay-locked' : '');
      wrap.setAttribute('data-overlay-id', o.id);
      wrap.style.cssText = 'position:absolute;left:' + o.x + 'px;top:' + o.y + 'px;' +
        'width:' + o.w + 'px;height:' + o.h + 'px;z-index:' + (50 + o.z) + ';' +
        'opacity:' + (o.opacity != null ? o.opacity : 1) + ';' +
        'pointer-events:' + (o.locked ? 'none' : 'auto') + ';';

      var img = document.createElement('img');
      img.className = 'card-overlay-img';
      img.src = o.src;
      img.draggable = false;
      wrap.appendChild(img);

      if (!o.locked) {
        var corners = ['nw','ne','sw','se'];
        for (var c = 0; c < corners.length; c++) {
          var h = document.createElement('div');
          h.className = 'overlay-handle overlay-handle-' + corners[c];
          h.setAttribute('data-corner', corners[c]);
          wrap.appendChild(h);
        }
      }

      p.appendChild(wrap);
    }
  }

  function findOverlay(id) {
    for (var i = 0; i < overlays.length; i++) {
      if (overlays[i].id === id) return overlays[i];
    }
    return null;
  }

  function updateOverlayEl(id, ov) {
    var el = document.querySelector('.card-overlay[data-overlay-id="' + id + '"]');
    if (!el) return;
    el.style.left = ov.x + 'px';
    el.style.top = ov.y + 'px';
    el.style.width = ov.w + 'px';
    el.style.height = ov.h + 'px';
  }

  function setupOverlayDrag() {
    var p = document.getElementById('card-preview');
    if (!p) return;

    // --- Mouse events ---
    p.addEventListener('mousedown', function(e) {
      var target = e.target;

      // Resize handle?
      if (target.classList.contains('overlay-handle')) {
        var wrap = target.parentElement;
        var id = parseInt(wrap.getAttribute('data-overlay-id'));
        var ov = findOverlay(id);
        if (!ov || ov.locked) return;
        e.preventDefault();
        e.stopPropagation();
        var rect = p.getBoundingClientRect();
        resizeState = {
          id: id, corner: target.getAttribute('data-corner'),
          startX: e.clientX, startY: e.clientY,
          origX: ov.x, origY: ov.y, origW: ov.w, origH: ov.h,
          scale: rect.width / 936
        };
        wrap.classList.add('overlay-resizing');
        return;
      }

      // Move overlay?
      if (!target.classList.contains('card-overlay')) return;
      var id2 = parseInt(target.getAttribute('data-overlay-id'));
      var ov2 = findOverlay(id2);
      if (!ov2 || ov2.locked) return;
      e.preventDefault();
      e.stopPropagation();
      var rect2 = p.getBoundingClientRect();
      dragState = { id: id2, startX: e.clientX, startY: e.clientY, origX: ov2.x, origY: ov2.y, scale: rect2.width / 936 };
      target.classList.add('overlay-dragging');
    });

    document.addEventListener('mousemove', function(e) {
      if (resizeState) {
        var dx = (e.clientX - resizeState.startX) / resizeState.scale;
        var dy = (e.clientY - resizeState.startY) / resizeState.scale;
        var ov = findOverlay(resizeState.id);
        if (!ov) return;
        applyResize(ov, resizeState, dx, dy);
        updateOverlayEl(resizeState.id, ov);
        return;
      }
      if (!dragState) return;
      var dx2 = (e.clientX - dragState.startX) / dragState.scale;
      var dy2 = (e.clientY - dragState.startY) / dragState.scale;
      var ov2 = findOverlay(dragState.id);
      if (!ov2) return;
      ov2.x = Math.round(dragState.origX + dx2);
      ov2.y = Math.round(dragState.origY + dy2);
      updateOverlayEl(dragState.id, ov2);
    });

    document.addEventListener('mouseup', function() {
      if (resizeState) {
        var el = document.querySelector('.card-overlay[data-overlay-id="' + resizeState.id + '"]');
        if (el) el.classList.remove('overlay-resizing');
        resizeState = null;
        if (window.onOverlaysChanged) window.onOverlaysChanged();
        return;
      }
      if (!dragState) return;
      var el2 = document.querySelector('.card-overlay[data-overlay-id="' + dragState.id + '"]');
      if (el2) el2.classList.remove('overlay-dragging');
      dragState = null;
      if (window.onOverlaysChanged) window.onOverlaysChanged();
    });

    // --- Touch events ---
    p.addEventListener('touchstart', function(e) {
      var target = e.target;
      var touch = e.touches[0];

      if (target.classList.contains('overlay-handle')) {
        var wrap = target.parentElement;
        var id = parseInt(wrap.getAttribute('data-overlay-id'));
        var ov = findOverlay(id);
        if (!ov || ov.locked) return;
        var rect = p.getBoundingClientRect();
        resizeState = {
          id: id, corner: target.getAttribute('data-corner'),
          startX: touch.clientX, startY: touch.clientY,
          origX: ov.x, origY: ov.y, origW: ov.w, origH: ov.h,
          scale: rect.width / 936
        };
        wrap.classList.add('overlay-resizing');
        return;
      }

      if (!target.classList.contains('card-overlay')) return;
      var id2 = parseInt(target.getAttribute('data-overlay-id'));
      var ov2 = findOverlay(id2);
      if (!ov2 || ov2.locked) return;
      var rect2 = p.getBoundingClientRect();
      dragState = { id: id2, startX: touch.clientX, startY: touch.clientY, origX: ov2.x, origY: ov2.y, scale: rect2.width / 936 };
      target.classList.add('overlay-dragging');
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      var touch = e.touches[0];
      if (resizeState) {
        var dx = (touch.clientX - resizeState.startX) / resizeState.scale;
        var dy = (touch.clientY - resizeState.startY) / resizeState.scale;
        var ov = findOverlay(resizeState.id);
        if (!ov) return;
        applyResize(ov, resizeState, dx, dy);
        updateOverlayEl(resizeState.id, ov);
        return;
      }
      if (!dragState) return;
      var dx2 = (touch.clientX - dragState.startX) / dragState.scale;
      var dy2 = (touch.clientY - dragState.startY) / dragState.scale;
      var ov2 = findOverlay(dragState.id);
      if (!ov2) return;
      ov2.x = Math.round(dragState.origX + dx2);
      ov2.y = Math.round(dragState.origY + dy2);
      updateOverlayEl(dragState.id, ov2);
    }, { passive: true });

    document.addEventListener('touchend', function() {
      if (resizeState) {
        var el = document.querySelector('.card-overlay[data-overlay-id="' + resizeState.id + '"]');
        if (el) el.classList.remove('overlay-resizing');
        resizeState = null;
        if (window.onOverlaysChanged) window.onOverlaysChanged();
        return;
      }
      if (!dragState) return;
      var el2 = document.querySelector('.card-overlay[data-overlay-id="' + dragState.id + '"]');
      if (el2) el2.classList.remove('overlay-dragging');
      dragState = null;
      if (window.onOverlaysChanged) window.onOverlaysChanged();
    });
  }

  // Apply resize delta based on corner
  function applyResize(ov, st, dx, dy) {
    var c = st.corner;
    var minW = 10, minH = 10;
    if (c === 'se') {
      ov.w = Math.max(minW, Math.round(st.origW + dx));
      ov.h = Math.max(minH, Math.round(st.origH + dy));
    } else if (c === 'sw') {
      var newW = Math.max(minW, Math.round(st.origW - dx));
      ov.x = Math.round(st.origX + (st.origW - newW));
      ov.w = newW;
      ov.h = Math.max(minH, Math.round(st.origH + dy));
    } else if (c === 'ne') {
      ov.w = Math.max(minW, Math.round(st.origW + dx));
      var newH = Math.max(minH, Math.round(st.origH - dy));
      ov.y = Math.round(st.origY + (st.origH - newH));
      ov.h = newH;
    } else if (c === 'nw') {
      var nwW = Math.max(minW, Math.round(st.origW - dx));
      var nwH = Math.max(minH, Math.round(st.origH - dy));
      ov.x = Math.round(st.origX + (st.origW - nwW));
      ov.y = Math.round(st.origY + (st.origH - nwH));
      ov.w = nwW;
      ov.h = nwH;
    }
  }

  // --- Overlay public API ---
  window.addOverlay = function(dataURL, opts) {
    opts = opts || {};
    var id = nextOverlayId++;
    var ov = {
      id: id,
      src: dataURL,
      x: opts.x != null ? opts.x : 0,
      y: opts.y != null ? opts.y : 0,
      w: opts.w != null ? opts.w : 936,
      h: opts.h != null ? opts.h : 735,
      z: opts.z != null ? opts.z : overlays.length,
      opacity: opts.opacity != null ? opts.opacity : 1,
      visible: true,
      locked: false,
      label: opts.label || 'Calque ' + id
    };
    overlays.push(ov);
    renderOverlays();
    if (window.onOverlaysChanged) window.onOverlaysChanged();
    return ov;
  };

  window.removeOverlay = function(id) {
    overlays = overlays.filter(function(o) { return o.id !== id; });
    renderOverlays();
    if (window.onOverlaysChanged) window.onOverlaysChanged();
  };

  window.getOverlays = function() { return overlays.slice(); };

  window.setOverlayProp = function(id, key, val) {
    for (var i = 0; i < overlays.length; i++) {
      if (overlays[i].id === id) { overlays[i][key] = val; break; }
    }
    renderOverlays();
    if (window.onOverlaysChanged) window.onOverlaysChanged();
  };

  window.moveOverlayZ = function(id, dir) {
    // dir: +1 = up, -1 = down
    for (var i = 0; i < overlays.length; i++) {
      if (overlays[i].id === id) {
        var swapIdx = i + dir;
        if (swapIdx >= 0 && swapIdx < overlays.length) {
          var tmpZ = overlays[i].z;
          overlays[i].z = overlays[swapIdx].z;
          overlays[swapIdx].z = tmpZ;
          var tmp = overlays[i];
          overlays[i] = overlays[swapIdx];
          overlays[swapIdx] = tmp;
        }
        break;
      }
    }
    renderOverlays();
    if (window.onOverlaysChanged) window.onOverlaysChanged();
  };

  window.reorderOverlayZ = function(movedId, targetId, before) {
    // Remove movedId from array, insert before/after targetId, then reassign z values
    var moved = null, movIdx = -1;
    for (var i = 0; i < overlays.length; i++) {
      if (overlays[i].id === movedId) { moved = overlays[i]; movIdx = i; break; }
    }
    if (!moved) return;
    overlays.splice(movIdx, 1);
    var targetIdx = -1;
    for (var j = 0; j < overlays.length; j++) {
      if (overlays[j].id === targetId) { targetIdx = j; break; }
    }
    if (targetIdx === -1) { overlays.push(moved); }
    else { overlays.splice(before ? targetIdx : targetIdx + 1, 0, moved); }
    // Reassign z values sequentially
    for (var k = 0; k < overlays.length; k++) overlays[k].z = k;
    renderOverlays();
    if (window.onOverlaysChanged) window.onOverlaysChanged();
  };

  window.clearOverlays = function() {
    overlays = [];
    nextOverlayId = 1;
    renderOverlays();
    if (window.onOverlaysChanged) window.onOverlaysChanged();
  };

  window.setupOverlayDrag = setupOverlayDrag;

  // =========================================================================
  // STANDARD Q&A — "Tu te mets combien en..."
  // Two panels: questions (left) + answers (right)
  // =========================================================================
  function renderStandard(p) {
    var qRows = '';
    for (var i = 1; i <= 10; i++) {
      qRows += '<div class="pq-row">' +
        '<div class="pq-num" data-num="' + i + '">' + i + '</div>' +
        '<div class="pq-txt" contenteditable="true" data-placeholder="Question ' + i + '..." data-i="' + i + '"></div>' +
        '</div>';
    }

    var leftPanel = '<div class="card-panel">' +
      '<div class="panel-inner panel-bordered">' +
        '<div class="panel-header">' +
          '<span class="panel-header-text">Tu te mets combien en...</span>' +
          '<div class="panel-header-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-subject"><span contenteditable="true" data-placeholder="SUJET ?"></span></div>' +
        '<div class="panel-questions">' + qRows + '</div>' +
        '<div class="panel-watermark">' + iconHTML() + '</div>' +
      '</div>' +
    '</div>';

    var aRows = '';
    for (var j = 1; j <= 10; j++) {
      aRows += '<div class="pa-row">' +
        '<div class="pa-num" data-num="' + j + '">' + j + '.</div>' +
        '<div class="pa-txt" contenteditable="true" data-placeholder="R\u00e9ponse ' + j + '..." data-i="' + j + '"></div>' +
        '</div>';
    }

    var rightPanel = '<div class="card-panel">' +
      '<div class="panel-inner panel-bordered">' +
        '<div class="panel-header">' +
          '<span class="panel-header-text">R\u00e9ponses</span>' +
          '<div class="panel-header-logo">' + '' + '</div>' +
          '<div class="panel-header-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-answers">' + aRows + '</div>' +
        '<div class="panel-watermark">' + iconHTML() + '</div>' +
      '</div>' +
    '</div>';

    p.innerHTML = leftPanel + separatorHTML() + rightPanel;
  }

  // =========================================================================
  // DEBUTER — "Hesite pas a Debuter"
  // Dual panel recto/verso, kraft/ticket style, free-form text
  // =========================================================================
  function renderDebuterPanel(side) {
    var sfx = (side === 'B') ? 'B' : '';
    var ph = (side === 'B') ? 'Face verso' : 'Face recto';
    return '<div class="card-panel">' +
      '<div class="debuter-inner">' +
        '<div class="debuter-border">' +
          '<div class="debuter-header">' +
            '<div class="debuter-header-text" contenteditable="true" data-field="debuterHeader' + sfx + '">H\u00c9SITE PAS \u00c0</div>' +
            '<div class="debuter-header-title" contenteditable="true" data-field="debuterLabel' + sfx + '">D\u00c9BUTER</div>' +
          '</div>' +
          '<div class="debuter-title" contenteditable="true" data-placeholder="Titre du challenge (' + ph + ')..." data-field="title' + sfx + '"></div>' +
          '<div class="debuter-body" contenteditable="true" data-placeholder="D\u00e9crivez le challenge ici..." data-field="body' + sfx + '"></div>' +
          '<div class="debuter-footer" contenteditable="true" data-placeholder="Note de bas de page..." data-field="footer' + sfx + '"></div>' +
          '<div class="debuter-logo">' + '' + '</div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="panel-watermark">' + iconHTML() + '</div>' +
    '</div>';
  }

  function renderDebuter(p) {
    p.innerHTML = renderDebuterPanel('A') + separatorHTML() + renderDebuterPanel('B');
  }

  // =========================================================================
  // GAGNER — "Hesite pas a Gagner"
  // Dual panel recto/verso, gold/amber, subtitle + body + answer
  // =========================================================================
  function renderGagnerPanel(side) {
    var sfx = (side === 'B') ? 'B' : '';
    var ph = (side === 'B') ? 'Face verso' : 'Face recto';
    return '<div class="card-panel">' +
      '<div class="gagner-inner">' +
        '<div class="gagner-header">' +
          '<span class="gagner-star">&#9733;</span>' +
          '<span class="gagner-header-text" contenteditable="true" data-field="gagnerHeader' + sfx + '">H\u00c9SITE PAS \u00c0 GAGNER</span>' +
          '<span class="gagner-star">&#9733;</span>' +
        '</div>' +
        '<div class="gagner-subtitle" contenteditable="true" data-placeholder="NOM DU CHALLENGE (' + ph + ')" data-field="subtitle' + sfx + '"></div>' +
        '<div class="gagner-body" contenteditable="true" data-placeholder="D\u00e9crivez la question ou le challenge ici..." data-field="body' + sfx + '"></div>' +
        '<div class="gagner-divider"></div>' +
        '<div class="gagner-answer-label" contenteditable="true" data-field="answerLabel' + sfx + '">R\u00e9ponse</div>' +
        '<div class="gagner-answer" contenteditable="true" data-placeholder="Tapez la r\u00e9ponse ici..." data-field="challengeAnswer' + sfx + '"></div>' +
        '<div class="gagner-logo">' + '' + '</div>' +
        '<div class="card-panel-icon">' + iconHTML() + '</div>' +
      '</div>' +
      '<div class="panel-watermark">' + iconHTML() + '</div>' +
    '</div>';
  }

  function renderGagner(p) {
    p.innerHTML = renderGagnerPanel('A') + separatorHTML() + renderGagnerPanel('B');
  }

  // =========================================================================
  // INTREPIDE — Dual panel: challenge (left) + responses (right)
  // =========================================================================
  function renderIntrepide(p) {
    var leftPanel =
      '<div class="card-panel">' +
        '<div class="intrepide-inner panel-bordered">' +
          '<div class="intrepide-header">' +
            '<span class="intrepide-header-text" contenteditable="true" data-field="intrepideHeaderL">Intr\u00e9pide</span>' +
          '</div>' +
          '<div class="intrepide-title" contenteditable="true" data-placeholder="NOM DU D\u00c9FI" data-field="title"></div>' +
          '<div class="intrepide-body" contenteditable="true" data-placeholder="D\u00e9crivez le d\u00e9fi ici...\n\nExemple : Dommage, tu es tomb\u00e9 sur une tuile. Tu recules de 5 cases sauf si le plus m\u00e9lomane de ton \u00e9quipe nous chante le refrain de Quelque part de Sheryl Luna..." data-field="body"></div>' +
          '<div class="intrepide-logo">' + '' + '</div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
      '</div>';

    var rightPanel =
      '<div class="card-panel">' +
        '<div class="intrepide-inner panel-bordered">' +
          '<div class="intrepide-header">' +
            '<span class="intrepide-header-text" contenteditable="true" data-field="intrepideHeaderR">Intr\u00e9pide</span>' +
            '<span class="intrepide-header-sub" contenteditable="true" data-field="intrepideSub">R\u00c9PONSES</span>' +
          '</div>' +
          '<div class="intrepide-responses" contenteditable="true" data-placeholder="Tapez les r\u00e9ponses ici...\n\n\u00c9cris-moi une autre histoire\nT\'es le seul \u00e0 me comprendre\nEmm\u00e8ne-moi quelque part\nNe me laissez pas surprendre\nInvente-moi un monde \u00e0 part\nApprends-moi une nouvelle danse\nEmm\u00e8ne-moi quelque part\nBoy, je te fais confiance" data-field="responses"></div>' +
          '<div class="intrepide-logo">' + '' + '</div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
      '</div>';

    p.innerHTML = leftPanel + separatorHTML() + rightPanel;
  }

  // =========================================================================
  // CHALLENGE — Orange, eclair central entre 2 panneaux
  // =========================================================================
  function renderChallenge(p) {
    var boltSvg = '<svg viewBox="0 0 36 100" fill="#F18A00" xmlns="http://www.w3.org/2000/svg">' +
      '<polygon points="22,0 6,45 18,45 10,100 30,50 18,50"/>' +
      '<polygon points="22,0 6,45 18,45 16,55 26,35 18,50 30,50 22,15" fill="#FFD54F" opacity=".5"/>' +
      '</svg>';

    var leftPanel =
      '<div class="card-panel">' +
        '<div class="challenge-inner">' +
          '<div class="challenge-header">' +
            '<span class="challenge-header-text" contenteditable="true" data-field="title">CHALLENGE</span>' +
          '</div>' +
          '<div class="challenge-title" contenteditable="true" data-placeholder="NOM DU CHALLENGE" data-field="subtitle"></div>' +
          '<div class="challenge-body" contenteditable="true" data-placeholder="D\u00e9crivez le challenge ici..." data-field="body"></div>' +
          '<div class="panel-watermark">' + iconHTML() + '</div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
      '</div>';

    var bolt = '<div class="challenge-bolt">' + boltSvg + '</div>';

    var rightPanel =
      '<div class="card-panel">' +
        '<div class="challenge-inner">' +
          '<div class="challenge-header">' +
            '<span class="challenge-header-text" contenteditable="true" data-field="titleB">R\u00c9PONSE</span>' +
          '</div>' +
          '<div class="challenge-body" contenteditable="true" data-placeholder="D\u00e9crivez la r\u00e9ponse ou le r\u00e9sultat ici..." data-field="bodyB"></div>' +
          '<div class="challenge-answer-label" contenteditable="true" data-field="answerLabel">R\u00e9ponse</div>' +
          '<div class="challenge-answer" contenteditable="true" data-placeholder="Tapez la r\u00e9ponse ici..." data-field="challengeAnswer"></div>' +
          '<div class="panel-watermark">' + iconHTML() + '</div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
      '</div>';

    p.innerHTML = leftPanel + bolt + rightPanel;
  }

  // =========================================================================
  // TERMINER — Violet, "Hesite pas a Terminer"
  // Meme structure que debuter, style violet/celebration
  // =========================================================================
  function renderTerminerPanel(side) {
    var sfx = (side === 'B') ? 'B' : '';
    var ph = (side === 'B') ? 'Face verso' : 'Face recto';
    return '<div class="card-panel">' +
      '<div class="terminer-inner">' +
        '<div class="terminer-border">' +
          '<div class="terminer-header">' +
            '<div class="terminer-header-text" contenteditable="true" data-field="debuterHeader' + sfx + '">H\u00c9SITE PAS \u00c0</div>' +
            '<div class="terminer-header-title" contenteditable="true" data-field="debuterLabel' + sfx + '">TERMINER</div>' +
          '</div>' +
          '<div class="terminer-title" contenteditable="true" data-placeholder="Titre du challenge (' + ph + ')..." data-field="title' + sfx + '"></div>' +
          '<div class="terminer-body" contenteditable="true" data-placeholder="D\u00e9crivez le challenge ici..." data-field="body' + sfx + '"></div>' +
          '<div class="terminer-footer" contenteditable="true" data-placeholder="Note de bas de page..." data-field="footer' + sfx + '"></div>' +
          '<div class="terminer-logo"></div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="panel-watermark">' + iconHTML() + '</div>' +
    '</div>';
  }

  function renderTerminer(p) {
    p.innerHTML = renderTerminerPanel('A') + separatorHTML() + renderTerminerPanel('B');
  }

  function separatorHTML() {
    return '';
  }

  // =========================================================================
  // BONUS / MALUS — Recto blanc (coeur) + Verso noir (tête de mort)
  // Bi-face avec couleurs opposées — hardcodé, ne suit pas le thème global
  // =========================================================================
  function renderBonusMalus(p) {
    var heartSvg = (window.BUILTIN_ICONS && window.BUILTIN_ICONS.coeur) ? window.BUILTIN_ICONS.coeur.svg : iconHTML();
    var skullSvg = (window.BUILTIN_ICONS && window.BUILTIN_ICONS.tete_de_mort) ? window.BUILTIN_ICONS.tete_de_mort.svg : iconHTML();

    var leftPanel =
      '<div class="card-panel bonusmalus-panel bonusmalus-recto">' +
        '<div class="bonusmalus-inner">' +
          '<div class="bonusmalus-icon bonusmalus-icon-heart">' + heartSvg + '</div>' +
          '<div class="bonusmalus-label" contenteditable="true" data-field="bonusMalusLabelA" data-placeholder="TROP FORT"></div>' +
          '<div class="bonusmalus-body" contenteditable="true" data-placeholder="D\u00e9crivez le bonus ici..." data-field="body"></div>' +
          '<div class="card-panel-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-watermark bonusmalus-watermark-light">' + heartSvg + '</div>' +
      '</div>';

    var rightPanel =
      '<div class="card-panel bonusmalus-panel bonusmalus-verso">' +
        '<div class="bonusmalus-inner">' +
          '<div class="bonusmalus-icon bonusmalus-icon-skull">' + skullSvg + '</div>' +
          '<div class="bonusmalus-label bonusmalus-label-dark" contenteditable="true" data-field="bonusMalusLabelB" data-placeholder="C\'EST NUL"></div>' +
          '<div class="bonusmalus-body bonusmalus-body-dark" contenteditable="true" data-placeholder="D\u00e9crivez le malus ici..." data-field="bodyB"></div>' +
          '<div class="card-panel-icon card-panel-icon-dark">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-watermark bonusmalus-watermark-dark">' + skullSvg + '</div>' +
      '</div>';

    p.innerHTML = leftPanel + separatorHTML() + rightPanel;
  }

  // ===== Auto-save debounced =====
  var autoSaveBound = false;
  function setupAutoSave(cardEl) {
    if (autoSaveBound) return;
    autoSaveBound = true;
    cardEl.addEventListener('input', function() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function() {
        saveToMemory();
        window.saveToLocalStorage();
      }, 500);
    });
  }

  // ===== Save DOM -> cardData =====
  function saveToMemory() {
    var p = document.getElementById('card-preview');
    if (!p) return;

    if (currentCardType === 'standard') {
      var subj = p.querySelector('.panel-subject [contenteditable]');
      if (subj) cardData.subject = subj.innerText || '';

      var qs = p.querySelectorAll('.pq-txt');
      for (var i = 0; i < qs.length; i++) {
        cardData.questions[qs[i].dataset.i] = qs[i].innerText || '';
      }

      var ans = p.querySelectorAll('.pa-txt');
      for (var k = 0; k < ans.length; k++) {
        cardData.answers[ans[k].dataset.i] = ans[k].innerText || '';
      }
    } else {
      // Challenge card types — save by data-field attribute
      var fields = p.querySelectorAll('[data-field]');
      for (var f = 0; f < fields.length; f++) {
        var key = fields[f].dataset.field;
        if (cardData.hasOwnProperty(key)) {
          cardData[key] = fields[f].innerText || '';
        }
      }
    }
  }

  // ===== Restore cardData -> DOM =====
  function restoreFromMemory() {
    var p = document.getElementById('card-preview');
    if (!p) return;

    if (currentCardType === 'standard') {
      var subj = p.querySelector('.panel-subject [contenteditable]');
      if (subj && cardData.subject) subj.innerText = cardData.subject;

      var qs = p.querySelectorAll('.pq-txt');
      for (var i = 0; i < qs.length; i++) {
        var idx = qs[i].dataset.i;
        if (cardData.questions[idx]) qs[i].innerText = cardData.questions[idx];
      }

      var ans = p.querySelectorAll('.pa-txt');
      for (var k = 0; k < ans.length; k++) {
        var idx2 = ans[k].dataset.i;
        if (cardData.answers[idx2]) ans[k].innerText = cardData.answers[idx2];
      }
    } else {
      var fields = p.querySelectorAll('[data-field]');
      for (var f = 0; f < fields.length; f++) {
        var key = fields[f].dataset.field;
        if (cardData[key]) fields[f].innerText = cardData[key];
      }
    }
  }

  // ===== Bulk paste =====
  window.applyBulkQuestions = function(text) {
    if (currentCardType === 'standard') {
      var lines = text.split(/\r?\n/).filter(function(l) { return l.trim() !== ''; });
      cardData.questions = {};
      for (var i = 0; i < Math.min(lines.length, 10); i++) {
        cardData.questions[String(i + 1)] = lines[i].trim();
      }
    } else if (currentCardType === 'intrepide') {
      cardData.body = text;
    } else {
      // Debuter/Gagner: textarea 1 = face A body
      cardData.body = text;
    }
    restoreFromMemory();
    window.saveToLocalStorage();
  };

  window.applyBulkAnswers = function(text) {
    if (currentCardType === 'standard') {
      var lines = text.split(/\r?\n/).filter(function(l) { return l.trim() !== ''; });
      cardData.answers = {};
      for (var i = 0; i < Math.min(lines.length, 10); i++) {
        cardData.answers[String(i + 1)] = lines[i].trim();
      }
    } else if (currentCardType === 'intrepide') {
      cardData.responses = text;
    } else {
      // Debuter/Gagner: textarea 2 = face B body
      cardData.bodyB = text;
    }
    restoreFromMemory();
    window.saveToLocalStorage();
  };

  // ===== Restore content from draft =====
  window.restoreCardContent = function(d) {
    if (!d) return;

    if (d.cardType) currentCardType = d.cardType;
    if (d.cardGap != null) {
      cardGap = d.cardGap;
      var p = document.getElementById('card-preview');
      if (p) p.style.setProperty('--card-gap', cardGap + 'px');
    }
    if (d.padTop != null) {
      padTop = d.padTop; padRight = d.padRight || 14; padBottom = d.padBottom || 14; padLeft = d.padLeft || 14;
      var p2 = document.getElementById('card-preview');
      if (p2) {
        p2.style.setProperty('--pad-top', padTop + 'px');
        p2.style.setProperty('--pad-right', padRight + 'px');
        p2.style.setProperty('--pad-bottom', padBottom + 'px');
        p2.style.setProperty('--pad-left', padLeft + 'px');
        p2.style.setProperty('--card-padding', padTop + 'px ' + padRight + 'px ' + padBottom + 'px ' + padLeft + 'px');
      }
    } else if (d.cardPadding != null) {
      // Legacy: single padding value
      padTop = padRight = padBottom = padLeft = d.cardPadding;
      var p2b = document.getElementById('card-preview');
      if (p2b) p2b.style.setProperty('--card-padding', padTop + 'px');
    }
    if (d.bdrTop != null) {
      bdrTop = d.bdrTop; bdrRight = d.bdrRight || 3; bdrBottom = d.bdrBottom || 3; bdrLeft = d.bdrLeft || 3;
      var p3 = document.getElementById('card-preview');
      if (p3) {
        p3.style.setProperty('--bdr-top', bdrTop + 'px');
        p3.style.setProperty('--bdr-right', bdrRight + 'px');
        p3.style.setProperty('--bdr-bottom', bdrBottom + 'px');
        p3.style.setProperty('--bdr-left', bdrLeft + 'px');
        p3.style.setProperty('--inner-border-width', bdrTop + 'px ' + bdrRight + 'px ' + bdrBottom + 'px ' + bdrLeft + 'px');
      }
    } else if (d.innerBorderWidth != null) {
      bdrTop = bdrRight = bdrBottom = bdrLeft = d.innerBorderWidth;
    }

    // Custom colors
    if (d.customColors) {
      for (var cc in d.customColors) {
        if (customColors.hasOwnProperty(cc)) customColors[cc] = d.customColors[cc] || null;
      }
    }

    // Standard Q&A fields
    if (d.subject != null) cardData.subject = d.subject;
    if (d.questions) cardData.questions = d.questions;
    if (d.answers) cardData.answers = d.answers;

    // Challenge fields — Face A
    if (d.title != null) cardData.title = d.title;
    if (d.body != null) cardData.body = d.body;
    if (d.footer != null) cardData.footer = d.footer;
    if (d.subtitle != null) cardData.subtitle = d.subtitle;
    if (d.challengeAnswer != null) cardData.challengeAnswer = d.challengeAnswer;
    // Challenge fields — Face B
    if (d.titleB != null) cardData.titleB = d.titleB;
    if (d.bodyB != null) cardData.bodyB = d.bodyB;
    if (d.footerB != null) cardData.footerB = d.footerB;
    if (d.subtitleB != null) cardData.subtitleB = d.subtitleB;
    if (d.challengeAnswerB != null) cardData.challengeAnswerB = d.challengeAnswerB;
    // Debuter headers
    if (d.debuterHeader != null) cardData.debuterHeader = d.debuterHeader;
    if (d.debuterLabel != null) cardData.debuterLabel = d.debuterLabel;
    if (d.debuterHeaderB != null) cardData.debuterHeaderB = d.debuterHeaderB;
    if (d.debuterLabelB != null) cardData.debuterLabelB = d.debuterLabelB;
    // Gagner headers
    if (d.gagnerHeader != null) cardData.gagnerHeader = d.gagnerHeader;
    if (d.gagnerHeaderB != null) cardData.gagnerHeaderB = d.gagnerHeaderB;
    if (d.answerLabel != null) cardData.answerLabel = d.answerLabel;
    if (d.answerLabelB != null) cardData.answerLabelB = d.answerLabelB;
    // Intrepide headers
    if (d.intrepideHeaderL != null) cardData.intrepideHeaderL = d.intrepideHeaderL;
    if (d.intrepideHeaderR != null) cardData.intrepideHeaderR = d.intrepideHeaderR;
    if (d.intrepideSub != null) cardData.intrepideSub = d.intrepideSub;
    // Intrepide
    if (d.responses != null) cardData.responses = d.responses;
    // Bonus/Malus labels
    if (d.bonusMalusLabelA != null) cardData.bonusMalusLabelA = d.bonusMalusLabelA;
    if (d.bonusMalusLabelB != null) cardData.bonusMalusLabelB = d.bonusMalusLabelB;

    // Legacy format support
    if (d.recto) {
      cardData.subject = d.recto.subject || d.recto.subjectA || '';
      cardData.questions = d.recto.questions || d.recto.questionsA || {};
    }
    if (d.verso) {
      cardData.answers = d.verso.answers || {};
    }
    if (d.q && !d.questions) cardData.questions = d.q;
    if (d.a && !d.answers) cardData.answers = d.a;

    restoreFromMemory();
  };

  // ===== localStorage =====
  window.saveToLocalStorage = function() {
    try {
      saveToMemory();
      var data = {
        cardType: currentCardType,
        themeId: currentThemeId,
        iconId: currentIconId,
        fontId: currentFontId,
        fontSizes: { subject: fontSizes.subject, question: fontSizes.question, answer: fontSizes.answer, number: fontSizes.number },
        cardGap: cardGap,
        padTop: padTop,
        padRight: padRight,
        padBottom: padBottom,
        padLeft: padLeft,
        bdrTop: bdrTop,
        bdrRight: bdrRight,
        bdrBottom: bdrBottom,
        bdrLeft: bdrLeft,
        customColors: Object.assign({}, customColors),
        // Standard
        subject: cardData.subject,
        questions: Object.assign({}, cardData.questions),
        answers: Object.assign({}, cardData.answers),
        // Challenge — Face A
        title: cardData.title,
        body: cardData.body,
        footer: cardData.footer,
        subtitle: cardData.subtitle,
        challengeAnswer: cardData.challengeAnswer,
        // Challenge — Face B
        titleB: cardData.titleB,
        bodyB: cardData.bodyB,
        footerB: cardData.footerB,
        subtitleB: cardData.subtitleB,
        challengeAnswerB: cardData.challengeAnswerB,
        // Debuter headers
        debuterHeader: cardData.debuterHeader,
        debuterLabel: cardData.debuterLabel,
        debuterHeaderB: cardData.debuterHeaderB,
        debuterLabelB: cardData.debuterLabelB,
        // Gagner headers
        gagnerHeader: cardData.gagnerHeader,
        gagnerHeaderB: cardData.gagnerHeaderB,
        answerLabel: cardData.answerLabel,
        answerLabelB: cardData.answerLabelB,
        // Intrepide headers
        intrepideHeaderL: cardData.intrepideHeaderL,
        intrepideHeaderR: cardData.intrepideHeaderR,
        intrepideSub: cardData.intrepideSub,
        // Intrepide
        responses: cardData.responses,
        // Bonus/Malus
        bonusMalusLabelA: cardData.bonusMalusLabelA,
        bonusMalusLabelB: cardData.bonusMalusLabelB,
        timestamp: Date.now()
      };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch(e) {
      console.warn('Sauvegarde locale impossible :', e.message);
      if (window.showToast) window.showToast('Sauvegarde locale impossible (stockage plein ?)');
    }
  };

  window.loadFromLocalStorage = function() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) {
      return null;
    }
  };

  // ===== Clear =====
  window.clearCard = function() {
    try { localStorage.removeItem(LS_KEY); } catch(e) {}
    window.customLogoDataURL = null;
    currentCardType = 'standard';
    currentThemeId = 'green';
    currentIconId = 'feuille';
    currentFontId = 'poppins';
    fontSizes = { subject: 22, question: 10, answer: 10, number: 28 };
    cardGap = 1;
    padTop = 14; padRight = 14; padBottom = 14; padLeft = 14;
    bdrTop = 3; bdrRight = 3; bdrBottom = 3; bdrLeft = 3;
    customColors = { headerBg:null, headerText:null, border:null, panelBg:null, numColor:null, cardBg:null };
    cardData = { subject: '', questions: {}, answers: {}, title: '', body: '', footer: '', subtitle: '', challengeAnswer: '', titleB: '', bodyB: '', footerB: '', subtitleB: '', challengeAnswerB: '', debuterHeader: '', debuterLabel: '', debuterHeaderB: '', debuterLabelB: '', gagnerHeader: '', gagnerHeaderB: '', answerLabel: '', answerLabelB: '', intrepideHeaderL: '', intrepideHeaderR: '', intrepideSub: '', responses: '', bonusMalusLabelA: '', bonusMalusLabelB: '' };
    overlays = [];
    nextOverlayId = 1;
    window.renderCard('green', 'feuille', 'poppins');
  };

  // ===== Load sample =====
window.loadSampleCard = function(card) {
if (!card) return;
currentCardType = card.cardType || 'standard';
currentThemeId = card.themeId || 'green';
var theme = window.getThemeById(currentThemeId);
currentIconId = theme.defaultIcon || 'feuille';
currentFontId = 'poppins';
window.customLogoDataURL = null;
cardData = { subject: '', questions: {}, answers: {}, title: '', body: '', footer: '', subtitle: '', challengeAnswer: '', titleB: '', bodyB: '', footerB: '', subtitleB: '', challengeAnswerB: '', debuterHeader: '', debuterLabel: '', debuterHeaderB: '', debuterLabelB: '', gagnerHeader: '', gagnerHeaderB: '', answerLabel: '', answerLabelB: '', intrepideHeaderL: '', intrepideHeaderR: '', intrepideSub: '', responses: '', bonusMalusLabelA: '', bonusMalusLabelB: '' };

// Standard Q&A
if (card.sujet) cardData.subject = card.sujet;
else if (card.subject) cardData.subject = card.subject;
if (card.questions) {
for (var k in card.questions) cardData.questions[k] = card.questions[k];
}
if (card.answers) {
for (var k2 in card.answers) cardData.answers[k2] = card.answers[k2];
}
// Challenge fields — Face A
if (card.title) cardData.title = card.title;
if (card.body) cardData.body = card.body;
if (card.footer) card.footer = card.footer;
if (card.subtitle) cardData.subtitle = card.subtitle;
if (card.challengeAnswer) cardData.challengeAnswer = card.challengeAnswer;
// Challenge fields — Face B
if (card.titleB) cardData.titleB = card.titleB;
if (card.bodyB) cardData.bodyB = card.bodyB;
if (card.footerB) cardData.footerB = card.footerB;
if (card.subtitleB) cardData.subtitleB = card.subtitleB;
if (card.challengeAnswerB) cardData.challengeAnswerB = card.challengeAnswerB;
// Debuter headers
if (card.debuterHeader) cardData.debuterHeader = card.debuterHeader;
if (card.debuterLabel) cardData.debuterLabel = card.debuterLabel;
if (card.debuterHeaderB) cardData.debuterHeaderB = card.debuterHeaderB;
if (card.debuterLabelB) cardData.debuterLabelB = card.debuterLabelB;
// Gagner headers
if (card.gagnerHeader) cardData.gagnerHeader = card.gagnerHeader;
if (card.gagnerHeaderB) cardData.gagnerHeaderB = card.gagnerHeaderB;
if (card.answerLabel) cardData.answerLabel = card.answerLabel;
if (card.answerLabelB) cardData.answerLabelB = card.answerLabelB;
// Intrepide headers
if (card.intrepideHeaderL) cardData.intrepideHeaderL = card.intrepideHeaderL;
if (card.intrepideHeaderR) cardData.intrepideHeaderR = card.intrepideHeaderR;
if (card.intrepideSub) cardData.intrepideSub = card.intrepideSub;
// Intrepide
if (card.responses) cardData.responses = card.responses;

// Snapshot avant renderCard : saveToMemory() s'exécute en premier dans renderCard
// et écrase cardData en lisant le DOM courant (vide si même type de carte).
var snapshot = {
subject: cardData.subject,
questions: Object.assign({}, cardData.questions),
answers: Object.assign({}, cardData.answers),
title: cardData.title, body: cardData.body, footer: cardData.footer,
subtitle: cardData.subtitle, challengeAnswer: cardData.challengeAnswer,
titleB: cardData.titleB, bodyB: cardData.bodyB, footerB: cardData.footerB,
subtitleB: cardData.subtitleB, challengeAnswerB: cardData.challengeAnswerB,
debuterHeader: cardData.debuterHeader, debuterLabel: cardData.debuterLabel,
debuterHeaderB: cardData.debuterHeaderB, debuterLabelB: cardData.debuterLabelB,
gagnerHeader: cardData.gagnerHeader, gagnerHeaderB: cardData.gagnerHeaderB,
answerLabel: cardData.answerLabel, answerLabelB: cardData.answerLabelB,
intrepideHeaderL: cardData.intrepideHeaderL, intrepideHeaderR: cardData.intrepideHeaderR,
intrepideSub: cardData.intrepideSub, responses: cardData.responses,
bonusMalusLabelA: cardData.bonusMalusLabelA, bonusMalusLabelB: cardData.bonusMalusLabelB
};

window.renderCard(currentThemeId, currentIconId, currentFontId, true);

// Re-apply snapshot dans cardData (sécurité — skipSave=true évite déjà la corruption)
Object.assign(cardData, snapshot);

// Écriture directe dans le DOM — plus fiable que restoreFromMemory (pas de conditions truthy)
var p = document.getElementById('card-preview');
if (p) {
if (currentCardType === 'standard') {
var subjEl = p.querySelector('.panel-subject [contenteditable]');
if (subjEl) subjEl.innerText = snapshot.subject || '';

var qEls = p.querySelectorAll('.pq-txt');
for (var qi = 0; qi < qEls.length; qi++) {
var qKey = qEls[qi].dataset.i;
qEls[qi].innerText = (snapshot.questions && snapshot.questions[qKey]) ? snapshot.questions[qKey] : '';
}

var aEls = p.querySelectorAll('.pa-txt');
for (var ai = 0; ai < aEls.length; ai++) {
var aKey = aEls[ai].dataset.i;
aEls[ai].innerText = (snapshot.answers && snapshot.answers[aKey]) ? snapshot.answers[aKey] : '';
}
} else {
var fieldEls = p.querySelectorAll('[data-field]');
for (var fi = 0; fi < fieldEls.length; fi++) {
var fKey = fieldEls[fi].dataset.field;
if (snapshot[fKey] !== undefined) fieldEls[fi].innerText = snapshot[fKey];
}
}
}

window.saveToLocalStorage();
return { cardType: currentCardType, themeId: currentThemeId, iconId: currentIconId, fontId: currentFontId };
};

  // ===== Getters/setters =====
  window.getCurrentCardType = function() { return currentCardType; };
  window.setCurrentCardType = function(id) { currentCardType = id; };
  window.getCurrentThemeId = function() { return currentThemeId; };
  window.getCurrentIconId = function() { return currentIconId; };
  window.getCurrentFontId = function() { return currentFontId; };
  window.setCurrentThemeId = function(id) { currentThemeId = id; };
  window.setCurrentIconId = function(id) { currentIconId = id; };
  window.setCurrentFontId = function(id) { currentFontId = id; };

  window.getCardGap = function() { return cardGap; };
  window.setCardGap = function(val) {
    cardGap = val;
    var p = document.getElementById('card-preview');
    if (p) p.style.setProperty('--card-gap', cardGap + 'px');
  };

  window.getCardPadding = function() { return { top: padTop, right: padRight, bottom: padBottom, left: padLeft }; };
  window.setCardPadding = function(side, val) {
    if (side === 'top') padTop = val;
    else if (side === 'right') padRight = val;
    else if (side === 'bottom') padBottom = val;
    else if (side === 'left') padLeft = val;
    var p = document.getElementById('card-preview');
    if (p) {
      p.style.setProperty('--pad-top', padTop + 'px');
      p.style.setProperty('--pad-right', padRight + 'px');
      p.style.setProperty('--pad-bottom', padBottom + 'px');
      p.style.setProperty('--pad-left', padLeft + 'px');
      p.style.setProperty('--card-padding', padTop + 'px ' + padRight + 'px ' + padBottom + 'px ' + padLeft + 'px');
    }
  };
  window.setAllCardPadding = function(t, r, b, l) {
    padTop = t; padRight = r; padBottom = b; padLeft = l;
    var p = document.getElementById('card-preview');
    if (p) {
      p.style.setProperty('--pad-top', padTop + 'px');
      p.style.setProperty('--pad-right', padRight + 'px');
      p.style.setProperty('--pad-bottom', padBottom + 'px');
      p.style.setProperty('--pad-left', padLeft + 'px');
      p.style.setProperty('--card-padding', padTop + 'px ' + padRight + 'px ' + padBottom + 'px ' + padLeft + 'px');
    }
  };

  window.getInnerBorderWidth = function() { return { top: bdrTop, right: bdrRight, bottom: bdrBottom, left: bdrLeft }; };
  window.setInnerBorderWidth = function(side, val) {
    if (side === 'top') bdrTop = val;
    else if (side === 'right') bdrRight = val;
    else if (side === 'bottom') bdrBottom = val;
    else if (side === 'left') bdrLeft = val;
    var p = document.getElementById('card-preview');
    if (p) {
      p.style.setProperty('--bdr-top', bdrTop + 'px');
      p.style.setProperty('--bdr-right', bdrRight + 'px');
      p.style.setProperty('--bdr-bottom', bdrBottom + 'px');
      p.style.setProperty('--bdr-left', bdrLeft + 'px');
      p.style.setProperty('--inner-border-width', bdrTop + 'px ' + bdrRight + 'px ' + bdrBottom + 'px ' + bdrLeft + 'px');
    }
  };

  // ===== Custom colors getters/setters =====
  window.getCustomColors = function() { return Object.assign({}, customColors); };
  window.setCustomColor = function(key, val) {
    if (customColors.hasOwnProperty(key)) {
      customColors[key] = val || null;
      var p = document.getElementById('card-preview');
      if (p) {
        if (val) {
          var cssMap = { headerBg:'--header-bg', headerText:'--header-text', border:'--border', panelBg:'--panel-bg', numColor:'--num-color', cardBg:'--card-bg' };
          p.style.setProperty(cssMap[key], val);
        } else {
          // Re-apply theme to reset
          var theme = window.getThemeById(currentThemeId);
          window.applyTheme(p, theme);
          // Re-apply remaining custom overrides
          for (var k in customColors) {
            if (customColors[k]) {
              var cssMap2 = { headerBg:'--header-bg', headerText:'--header-text', border:'--border', panelBg:'--panel-bg', numColor:'--num-color', cardBg:'--card-bg' };
              p.style.setProperty(cssMap2[k], customColors[k]);
            }
          }
        }
      }
    }
  };
  window.resetCustomColors = function() {
    customColors = { headerBg:null, headerText:null, border:null, panelBg:null, numColor:null, cardBg:null };
    var p = document.getElementById('card-preview');
    if (p) {
      var theme = window.getThemeById(currentThemeId);
      window.applyTheme(p, theme);
      p.style.removeProperty('--panel-bg');
    }
  };

  window.getFontSizes = function() {
    return { subject: fontSizes.subject, question: fontSizes.question, answer: fontSizes.answer, number: fontSizes.number };
  };
  window.setFontSize = function(key, val) {
    if (fontSizes.hasOwnProperty(key)) {
      fontSizes[key] = val;
      var p = document.getElementById('card-preview');
      if (p) applyFontSizeProperties(p);
    }
  };
  window.setAllFontSizes = function(sizes) {
    if (sizes.subject != null) fontSizes.subject = sizes.subject;
    if (sizes.question != null) fontSizes.question = sizes.question;
    if (sizes.answer != null) fontSizes.answer = sizes.answer;
    if (sizes.number != null) fontSizes.number = sizes.number;
  };

  window.getCardData = function() {
    saveToMemory();
    return {
      cardType: currentCardType,
      subject: cardData.subject,
      questions: Object.assign({}, cardData.questions),
      answers: Object.assign({}, cardData.answers),
      title: cardData.title,
      body: cardData.body,
      footer: cardData.footer,
      subtitle: cardData.subtitle,
      challengeAnswer: cardData.challengeAnswer,
      titleB: cardData.titleB,
      bodyB: cardData.bodyB,
      footerB: cardData.footerB,
      subtitleB: cardData.subtitleB,
      challengeAnswerB: cardData.challengeAnswerB,
      debuterHeader: cardData.debuterHeader,
      debuterLabel: cardData.debuterLabel,
      debuterHeaderB: cardData.debuterHeaderB,
      debuterLabelB: cardData.debuterLabelB,
      gagnerHeader: cardData.gagnerHeader,
      gagnerHeaderB: cardData.gagnerHeaderB,
      answerLabel: cardData.answerLabel,
      answerLabelB: cardData.answerLabelB,
      intrepideHeaderL: cardData.intrepideHeaderL,
      intrepideHeaderR: cardData.intrepideHeaderR,
      intrepideSub: cardData.intrepideSub,
      responses: cardData.responses,
      bonusMalusLabelA: cardData.bonusMalusLabelA,
      bonusMalusLabelB: cardData.bonusMalusLabelB
    };
  };

  // ===== Toggles getters/setters =====
  window.getToggles = function() { return Object.assign({}, toggles); };
  window.setToggle = function(key, val) {
    if (toggles.hasOwnProperty(key)) {
      toggles[key] = val;
      var p = document.getElementById('card-preview');
      if (p) applyToggles(p);
    }
  };
  window.setAllToggles = function(t) {
    for (var k in t) {
      if (toggles.hasOwnProperty(k)) toggles[k] = t[k];
    }
    var p = document.getElementById('card-preview');
    if (p) applyToggles(p);
  };

  // ===== Custom images getters/setters =====
  window.getCustomImages = function() {
    return { cardBg: customImages.cardBg, numBg: customImages.numBg, nums: Object.assign({}, customImages.nums) };
  };
  window.setCardBg = function(dataURL) {
    customImages.cardBg = dataURL;
    var p = document.getElementById('card-preview');
    if (p) applyCustomImages(p);
  };
  window.setNumBg = function(dataURL) {
    customImages.numBg = dataURL;
    var p = document.getElementById('card-preview');
    if (p) applyCustomImages(p);
  };
  window.setNumImage = function(num, dataURL) {
    customImages.nums[String(num)] = dataURL;
    var p = document.getElementById('card-preview');
    if (p) applyCustomImages(p);
  };
  window.clearNumImages = function() {
    customImages.nums = {};
    var p = document.getElementById('card-preview');
    if (p) {
      // Restore original text numbers
      window.renderCard(currentThemeId, currentIconId, currentFontId);
    }
  };

  // Import colonne : une image decoupee en 10 parts egales
  window.importNumColumn = function(dataURL, callback) {
    var img = new Image();
    img.onload = function() {
      var sliceH = img.height / 10;
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = Math.round(sliceH);
      var ctx = canvas.getContext('2d');

      customImages.nums = {};
      for (var i = 0; i < 10; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, Math.round(i * sliceH), img.width, Math.round(sliceH), 0, 0, canvas.width, Math.round(sliceH));
        customImages.nums[String(i + 1)] = canvas.toDataURL('image/png');
      }

      var p = document.getElementById('card-preview');
      if (p) applyCustomImages(p);
      if (callback) callback(customImages.nums);
    };
    img.src = dataURL;
  };


})();
