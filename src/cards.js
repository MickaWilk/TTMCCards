// ===== cards.js — Rendu de carte + édition Q&A + sauvegarde =====

(function() {
  'use strict';

  // État courant
  var currentThemeId = 'blue';
  var currentIconId = 'poisson';
  var currentFontId = 'poppins';
  var customLogoDataURL = null;
  var saveTimer = null;

  // Tailles de police (en px)
  var fontSizes = {
    subject: 20,
    question: 9.5,
    answer: 9.5,
    number: 28
  };

  var LS_KEY = 'ttmc-card-draft';

  // Expose les variables d'état sur window
  window.customLogoDataURL = null;

  // ===== Génération du HTML d'icône =====
  function iconHTML() {
    if (window.customLogoDataURL) {
      return '<img src="' + window.customLogoDataURL + '">';
    }
    var icon = window.BUILTIN_ICONS[currentIconId];
    return icon ? icon.svg : '';
  }

  // ===== Render principal =====
  window.renderCard = function(themeId, iconId, fontId) {
    if (themeId) currentThemeId = themeId;
    if (iconId) currentIconId = iconId;
    if (fontId) currentFontId = fontId;

    var theme = window.getThemeById(currentThemeId);
    var saved = window.saveCardContent();

    var p = document.getElementById('card-preview');
    if (!p) return;

    // Appliquer le thème via custom properties
    window.applyTheme(p, theme);

    // Appliquer la police
    var font = window.getFontById(currentFontId);
    if (font) {
      window.applyFont(p, font.family);
    }

    // Appliquer les tailles de police
    p.style.setProperty('--subject-size', fontSizes.subject + 'px');
    p.style.setProperty('--question-size', fontSizes.question + 'px');
    p.style.setProperty('--answer-size', fontSizes.answer + 'px');
    p.style.setProperty('--num-size', fontSizes.number + 'px');
    p.style.setProperty('--answer-num-size', Math.round(fontSizes.number * 0.46) + 'px');

    // Construire les lignes gauche (questions) et droite (réponses)
    var leftRows = '';
    var rightRows = '';
    for (var i = 1; i <= 10; i++) {
      leftRows += '<div class="cl-row">' +
        '<div class="cl-num">' + i + '</div>' +
        '<div class="cl-txt" contenteditable="true" data-i="' + i + '" data-placeholder="Question ' + i + '..."></div>' +
        '</div>';
      rightRows += '<div class="cr-row">' +
        '<div class="cr-num">' + i + '.</div>' +
        '<div class="cr-txt" contenteditable="true" data-i="' + i + '" data-placeholder="R\u00e9ponse ' + i + '..."></div>' +
        '</div>';
    }

    p.innerHTML =
      '<div class="cl">' +
        '<div class="cl-head">' +
          '<div class="cl-head-txt">Tu te mets combien en...</div>' +
          '<div class="cl-head-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="cl-subj"><span contenteditable="true" data-placeholder="Sujet..."></span></div>' +
        '<div class="cl-rows">' + leftRows + '</div>' +
        '<div class="cl-deco">' + iconHTML() + '</div>' +
      '</div>' +
      '<div class="cr">' +
        '<div class="cr-title">R\u00e9ponses</div>' +
        '<div class="cr-rows">' + rightRows + '</div>' +
        '<div class="cr-star"></div>' +
      '</div>';

    // Restaurer le contenu éditée
    window.restoreCardContent(saved);

    // Écouter les modifications pour la sauvegarde auto
    setupAutoSave(p);
  };

  // ===== Auto-save debounced =====
  function setupAutoSave(cardEl) {
    cardEl.addEventListener('input', function() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function() {
        window.saveToLocalStorage();
      }, 500);
    });
  }

  // ===== Sauvegarder le contenu éditable =====
  window.saveCardContent = function() {
    var s = document.querySelector('#card-preview .cl-subj [contenteditable]');
    if (!s) return null;
    var d = { subject: s.innerText, q: {}, a: {} };
    var qs = document.querySelectorAll('#card-preview .cl-txt');
    for (var i = 0; i < qs.length; i++) {
      d.q[qs[i].dataset.i] = qs[i].innerText;
    }
    var as = document.querySelectorAll('#card-preview .cr-txt');
    for (var j = 0; j < as.length; j++) {
      d.a[as[j].dataset.i] = as[j].innerText;
    }
    return d;
  };

  // ===== Restaurer le contenu =====
  window.restoreCardContent = function(d) {
    if (!d) return;
    var s = document.querySelector('#card-preview .cl-subj [contenteditable]');
    if (s && d.subject) s.innerText = d.subject;
    var qs = document.querySelectorAll('#card-preview .cl-txt');
    for (var i = 0; i < qs.length; i++) {
      if (d.q && d.q[qs[i].dataset.i]) qs[i].innerText = d.q[qs[i].dataset.i];
    }
    var as = document.querySelectorAll('#card-preview .cr-txt');
    for (var j = 0; j < as.length; j++) {
      if (d.a && d.a[as[j].dataset.i]) as[j].innerText = d.a[as[j].dataset.i];
    }
  };

  // ===== Sauvegarde localStorage =====
  window.saveToLocalStorage = function() {
    try {
      var content = window.saveCardContent();
      if (!content) return;
      var data = {
        themeId: currentThemeId,
        iconId: currentIconId,
        fontId: currentFontId,
        fontSizes: { subject: fontSizes.subject, question: fontSizes.question, answer: fontSizes.answer, number: fontSizes.number },
        content: content,
        timestamp: Date.now()
      };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch(e) {
      // silently fail
    }
  };

  // ===== Chargement localStorage =====
  window.loadFromLocalStorage = function() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) {
      return null;
    }
  };

  // ===== Effacer la carte =====
  window.clearCard = function() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch(e) {}
    window.customLogoDataURL = null;
    currentThemeId = 'blue';
    currentIconId = 'poisson';
    currentFontId = 'poppins';
    fontSizes = { subject: 20, question: 9.5, answer: 9.5, number: 28 };
    window.renderCard('blue', 'poisson', 'poppins');
  };

  // ===== Charger une carte d'exemple =====
  window.loadSampleCard = function(card) {
    if (!card) return;
    currentThemeId = card.themeId || 'blue';
    var theme = window.getThemeById(currentThemeId);
    currentIconId = theme.defaultIcon || 'poisson';
    currentFontId = 'poppins';
    window.customLogoDataURL = null;

    window.renderCard(currentThemeId, currentIconId, currentFontId);

    // Remplir le sujet
    var subj = document.querySelector('#card-preview .cl-subj [contenteditable]');
    if (subj && card.sujet) subj.innerText = card.sujet;

    // Remplir les questions (panneau gauche)
    var qs = document.querySelectorAll('#card-preview .cl-txt');
    for (var i = 0; i < qs.length; i++) {
      var idx = qs[i].dataset.i;
      if (card.questions && card.questions[idx]) {
        qs[i].innerText = card.questions[idx];
      }
    }

    // Sauvegarder
    window.saveToLocalStorage();

    return { themeId: currentThemeId, iconId: currentIconId, fontId: currentFontId };
  };

  // ===== Getters d'état =====
  window.getCurrentThemeId = function() { return currentThemeId; };
  window.getCurrentIconId = function() { return currentIconId; };
  window.getCurrentFontId = function() { return currentFontId; };
  window.setCurrentThemeId = function(id) { currentThemeId = id; };
  window.setCurrentIconId = function(id) { currentIconId = id; };
  window.setCurrentFontId = function(id) { currentFontId = id; };

  // ===== Tailles de police =====
  window.getFontSizes = function() { return { subject: fontSizes.subject, question: fontSizes.question, answer: fontSizes.answer, number: fontSizes.number }; };
  window.setFontSize = function(key, val) {
    if (fontSizes.hasOwnProperty(key)) {
      fontSizes[key] = val;
      var p = document.getElementById('card-preview');
      if (p) {
        p.style.setProperty('--subject-size', fontSizes.subject + 'px');
        p.style.setProperty('--question-size', fontSizes.question + 'px');
        p.style.setProperty('--answer-size', fontSizes.answer + 'px');
        p.style.setProperty('--num-size', fontSizes.number + 'px');
        p.style.setProperty('--answer-num-size', Math.round(fontSizes.number * 0.46) + 'px');
      }
    }
  };
  window.setAllFontSizes = function(sizes) {
    if (sizes.subject != null) fontSizes.subject = sizes.subject;
    if (sizes.question != null) fontSizes.question = sizes.question;
    if (sizes.answer != null) fontSizes.answer = sizes.answer;
    if (sizes.number != null) fontSizes.number = sizes.number;
  };

})();
