// ===== cards.js — Rendu multi-types de cartes TTMC =====

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
    watermark: true,
    background: true,
    template: true,
    recto: true,
    verso: true,
    separator: true
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

  var cardGap = 10;
  var cardPadding = 14;
  var innerBorderWidth = 3;

  var LS_KEY = 'ttmc-card-draft';
  window.customLogoDataURL = null;

  // ===== Helpers =====
  function iconHTML() {
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
  window.renderCard = function(themeId, iconId, fontId) {
    if (themeId) currentThemeId = themeId;
    if (iconId) currentIconId = iconId;
    if (fontId) currentFontId = fontId;

    var theme = window.getThemeById(currentThemeId);
    var p = document.getElementById('card-preview');
    if (!p) return;

    saveToMemory();
    window.applyTheme(p, theme);

    var font = window.getFontById(currentFontId);
    if (font) window.applyFont(p, font.family);
    applyFontSizeProperties(p);
    p.style.setProperty('--card-gap', cardGap + 'px');
    p.style.setProperty('--card-padding', cardPadding + 'px');
    p.style.setProperty('--inner-border-width', innerBorderWidth + 'px');

    // Remove old card type classes, add current
    p.className = 'ttmc-card card-type-' + currentCardType;

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
  };

  // ===== Toggles de visibilite =====
  function applyToggles(p) {
    p.classList.toggle('hide-numbers', !toggles.numbers);
    p.classList.toggle('hide-questions', !toggles.questions);
    p.classList.toggle('hide-answers', !toggles.answers);
    p.classList.toggle('hide-subject', !toggles.subject);
    p.classList.toggle('hide-header', !toggles.header);
    p.classList.toggle('hide-icons', !toggles.icons);
    p.classList.toggle('hide-watermark', !toggles.watermark);
    p.classList.toggle('hide-background', !toggles.background);
    p.classList.toggle('hide-template', !toggles.template);
    p.classList.toggle('hide-recto', !toggles.recto);
    p.classList.toggle('hide-verso', !toggles.verso);
    p.classList.toggle('hide-separator', !toggles.separator);
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
  function renderOverlays(p) {
    if (!p) p = document.getElementById('card-preview');
    if (!p) return;

    // Remove existing overlay elements
    var old = p.querySelectorAll('.card-overlay');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);

    // Render sorted by z
    var sorted = overlays.slice().sort(function(a, b) { return a.z - b.z; });
    for (var j = 0; j < sorted.length; j++) {
      var o = sorted[j];
      if (!o.visible) continue;
      var img = document.createElement('img');
      img.className = 'card-overlay' + (o.locked ? ' overlay-locked' : '');
      img.src = o.src;
      img.draggable = false;
      img.setAttribute('data-overlay-id', o.id);
      img.style.cssText = 'position:absolute;left:' + o.x + 'px;top:' + o.y + 'px;' +
        'width:' + o.w + 'px;height:' + o.h + 'px;z-index:' + (50 + o.z) + ';' +
        'opacity:' + (o.opacity != null ? o.opacity : 1) + ';' +
        'pointer-events:' + (o.locked ? 'none' : 'auto') + ';';
      p.appendChild(img);
    }
  }

  function setupOverlayDrag() {
    var p = document.getElementById('card-preview');
    if (!p) return;

    p.addEventListener('mousedown', function(e) {
      var target = e.target;
      if (!target.classList.contains('card-overlay')) return;
      var id = parseInt(target.getAttribute('data-overlay-id'));
      var ov = null;
      for (var i = 0; i < overlays.length; i++) {
        if (overlays[i].id === id) { ov = overlays[i]; break; }
      }
      if (!ov || ov.locked) return;

      e.preventDefault();
      e.stopPropagation();
      var rect = p.getBoundingClientRect();
      var scale = rect.width / 936;

      dragState = { id: id, startX: e.clientX, startY: e.clientY, origX: ov.x, origY: ov.y, scale: scale };
      target.classList.add('overlay-dragging');
    });

    document.addEventListener('mousemove', function(e) {
      if (!dragState) return;
      var dx = (e.clientX - dragState.startX) / dragState.scale;
      var dy = (e.clientY - dragState.startY) / dragState.scale;
      var ov = null;
      for (var i = 0; i < overlays.length; i++) {
        if (overlays[i].id === dragState.id) { ov = overlays[i]; break; }
      }
      if (!ov) return;
      ov.x = Math.round(dragState.origX + dx);
      ov.y = Math.round(dragState.origY + dy);
      var el = document.querySelector('.card-overlay[data-overlay-id="' + dragState.id + '"]');
      if (el) { el.style.left = ov.x + 'px'; el.style.top = ov.y + 'px'; }
    });

    document.addEventListener('mouseup', function() {
      if (!dragState) return;
      var el = document.querySelector('.card-overlay[data-overlay-id="' + dragState.id + '"]');
      if (el) el.classList.remove('overlay-dragging');
      dragState = null;
      if (window.onOverlaysChanged) window.onOverlaysChanged();
    });

    // Touch events for mobile
    p.addEventListener('touchstart', function(e) {
      var target = e.target;
      if (!target.classList.contains('card-overlay')) return;
      var id = parseInt(target.getAttribute('data-overlay-id'));
      var ov = null;
      for (var i = 0; i < overlays.length; i++) {
        if (overlays[i].id === id) { ov = overlays[i]; break; }
      }
      if (!ov || ov.locked) return;
      var touch = e.touches[0];
      var rect = p.getBoundingClientRect();
      var scale = rect.width / 936;
      dragState = { id: id, startX: touch.clientX, startY: touch.clientY, origX: ov.x, origY: ov.y, scale: scale };
      target.classList.add('overlay-dragging');
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!dragState) return;
      var touch = e.touches[0];
      var dx = (touch.clientX - dragState.startX) / dragState.scale;
      var dy = (touch.clientY - dragState.startY) / dragState.scale;
      var ov = null;
      for (var i = 0; i < overlays.length; i++) {
        if (overlays[i].id === dragState.id) { ov = overlays[i]; break; }
      }
      if (!ov) return;
      ov.x = Math.round(dragState.origX + dx);
      ov.y = Math.round(dragState.origY + dy);
      var el = document.querySelector('.card-overlay[data-overlay-id="' + dragState.id + '"]');
      if (el) { el.style.left = ov.x + 'px'; el.style.top = ov.y + 'px'; }
    }, { passive: true });

    document.addEventListener('touchend', function() {
      if (!dragState) return;
      var el = document.querySelector('.card-overlay[data-overlay-id="' + dragState.id + '"]');
      if (el) el.classList.remove('overlay-dragging');
      dragState = null;
      if (window.onOverlaysChanged) window.onOverlaysChanged();
    });
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
        '</div>' +
      '</div>' +
      '<div class="panel-watermark">' + iconHTML() + '</div>' +
    '</div>';
  }

  function renderTerminer(p) {
    p.innerHTML = renderTerminerPanel('A') + separatorHTML() + renderTerminerPanel('B');
  }

  // =========================================================================
  // Separator helper — inserts 1px black line between panels
  // =========================================================================
  function separatorHTML() {
    return '<div class="card-separator"></div>';
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
        '</div>' +
        '<div class="panel-watermark bonusmalus-watermark-light">' + heartSvg + '</div>' +
      '</div>';

    var rightPanel =
      '<div class="card-panel bonusmalus-panel bonusmalus-verso">' +
        '<div class="bonusmalus-inner">' +
          '<div class="bonusmalus-icon bonusmalus-icon-skull">' + skullSvg + '</div>' +
          '<div class="bonusmalus-label bonusmalus-label-dark" contenteditable="true" data-field="bonusMalusLabelB" data-placeholder="C\'EST NUL"></div>' +
          '<div class="bonusmalus-body bonusmalus-body-dark" contenteditable="true" data-placeholder="D\u00e9crivez le malus ici..." data-field="bodyB"></div>' +
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
    if (d.cardPadding != null) {
      cardPadding = d.cardPadding;
      var p2 = document.getElementById('card-preview');
      if (p2) p2.style.setProperty('--card-padding', cardPadding + 'px');
    }
    if (d.innerBorderWidth != null) {
      innerBorderWidth = d.innerBorderWidth;
      var p3 = document.getElementById('card-preview');
      if (p3) p3.style.setProperty('--inner-border-width', innerBorderWidth + 'px');
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
        cardPadding: cardPadding,
        innerBorderWidth: innerBorderWidth,
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
    cardGap = 10;
    cardPadding = 14;
    innerBorderWidth = 3;
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
    if (card.questions) {
      for (var k in card.questions) cardData.questions[k] = card.questions[k];
    }
    if (card.answers) {
      for (var k2 in card.answers) cardData.answers[k2] = card.answers[k2];
    }

    // Challenge fields — Face A
    if (card.title) cardData.title = card.title;
    if (card.body) cardData.body = card.body;
    if (card.footer) cardData.footer = card.footer;
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

    window.renderCard(currentThemeId, currentIconId, currentFontId);
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

  window.getCardPadding = function() { return cardPadding; };
  window.setCardPadding = function(val) {
    cardPadding = val;
    var p = document.getElementById('card-preview');
    if (p) p.style.setProperty('--card-padding', cardPadding + 'px');
  };

  window.getInnerBorderWidth = function() { return innerBorderWidth; };
  window.setInnerBorderWidth = function(val) {
    innerBorderWidth = val;
    var p = document.getElementById('card-preview');
    if (p) p.style.setProperty('--inner-border-width', innerBorderWidth + 'px');
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
