// ===== cards.js — Rendu recto+verso côte à côte + édition + sauvegarde =====

(function() {
  'use strict';

  var currentThemeId = 'green';
  var currentIconId = 'feuille';
  var currentFontId = 'poppins';
  var customLogoDataURL = null;
  var saveTimer = null;

  var fontSizes = {
    subject: 22,
    question: 10,
    answer: 10,
    number: 28
  };

  var cardData = {
    subject: '',
    questions: {},
    answers: {}
  };

  var LS_KEY = 'ttmc-card-draft';

  window.customLogoDataURL = null;

  function iconHTML() {
    if (window.customLogoDataURL) {
      return '<img src="' + window.customLogoDataURL + '">';
    }
    var icon = window.BUILTIN_ICONS[currentIconId];
    return icon ? icon.svg : '';
  }

  // ===== Render — recto (gauche) + verso (droite) =====
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

    // Recto (gauche) : header + sujet + 10 questions
    var qRows = '';
    for (var i = 1; i <= 10; i++) {
      qRows += '<div class="pq-row">' +
        '<div class="pq-num">' + i + '</div>' +
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

    // Verso (droite) : header Réponses + 10 réponses
    var aRows = '';
    for (var j = 1; j <= 10; j++) {
      aRows += '<div class="pa-row">' +
        '<div class="pa-num">' + j + '.</div>' +
        '<div class="pa-txt" contenteditable="true" data-placeholder="R\u00e9ponse ' + j + '..." data-i="' + j + '"></div>' +
        '</div>';
    }

    var rightPanel = '<div class="card-panel">' +
      '<div class="panel-inner panel-bordered">' +
        '<div class="panel-header">' +
          '<span class="panel-header-text">R\u00e9ponses</span>' +
          '<div class="panel-header-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-answers">' + aRows + '</div>' +
        '<div class="panel-watermark">' + iconHTML() + '</div>' +
      '</div>' +
    '</div>';

    p.innerHTML = leftPanel + rightPanel;

    restoreFromMemory();
    setupAutoSave(p);
  };

  function applyFontSizeProperties(el) {
    el.style.setProperty('--subject-size', fontSizes.subject + 'px');
    el.style.setProperty('--question-size', fontSizes.question + 'px');
    el.style.setProperty('--answer-size', fontSizes.answer + 'px');
    el.style.setProperty('--num-size', fontSizes.number + 'px');
    el.style.setProperty('--answer-num-size', Math.round(fontSizes.number * 0.46) + 'px');
  }

  // ===== Auto-save debounced =====
  function setupAutoSave(cardEl) {
    cardEl.addEventListener('input', function() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function() {
        saveToMemory();
        window.saveToLocalStorage();
      }, 500);
    });
  }

  // ===== Save DOM → cardData =====
  function saveToMemory() {
    var p = document.getElementById('card-preview');
    if (!p) return;

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
  }

  // ===== Restore cardData → DOM =====
  function restoreFromMemory() {
    var p = document.getElementById('card-preview');
    if (!p) return;

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
  }

  // ===== Bulk paste =====
  window.applyBulkQuestions = function(text) {
    var lines = text.split(/\r?\n/).filter(function(l) { return l.trim() !== ''; });
    cardData.questions = {};
    for (var i = 0; i < Math.min(lines.length, 10); i++) {
      cardData.questions[String(i + 1)] = lines[i].trim();
    }
    restoreFromMemory();
    window.saveToLocalStorage();
  };

  window.applyBulkAnswers = function(text) {
    var lines = text.split(/\r?\n/).filter(function(l) { return l.trim() !== ''; });
    cardData.answers = {};
    for (var i = 0; i < Math.min(lines.length, 10); i++) {
      cardData.answers[String(i + 1)] = lines[i].trim();
    }
    restoreFromMemory();
    window.saveToLocalStorage();
  };

  // ===== Restore content from draft =====
  window.restoreCardContent = function(d) {
    if (!d) return;

    // Nouveau format plat
    if (d.subject != null) cardData.subject = d.subject;
    if (d.questions) cardData.questions = d.questions;
    if (d.answers) cardData.answers = d.answers;

    // Ancien format recto/verso
    if (d.recto) {
      cardData.subject = d.recto.subject || d.recto.subjectA || '';
      cardData.questions = d.recto.questions || d.recto.questionsA || {};
    }
    if (d.verso) {
      cardData.answers = d.verso.answers || {};
    }

    // Très ancien format
    if (d.q && !d.questions) cardData.questions = d.q;
    if (d.a && !d.answers) cardData.answers = d.a;

    restoreFromMemory();
  };

  // ===== localStorage =====
  window.saveToLocalStorage = function() {
    try {
      saveToMemory();
      var data = {
        themeId: currentThemeId,
        iconId: currentIconId,
        fontId: currentFontId,
        fontSizes: { subject: fontSizes.subject, question: fontSizes.question, answer: fontSizes.answer, number: fontSizes.number },
        subject: cardData.subject,
        questions: Object.assign({}, cardData.questions),
        answers: Object.assign({}, cardData.answers),
        timestamp: Date.now()
      };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch(e) {}
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
    currentThemeId = 'green';
    currentIconId = 'feuille';
    currentFontId = 'poppins';
    fontSizes = { subject: 22, question: 10, answer: 10, number: 28 };
    cardData = { subject: '', questions: {}, answers: {} };
    window.renderCard('green', 'feuille', 'poppins');
  };

  // ===== Load sample =====
  window.loadSampleCard = function(card) {
    if (!card) return;
    currentThemeId = card.themeId || 'green';
    var theme = window.getThemeById(currentThemeId);
    currentIconId = theme.defaultIcon || 'feuille';
    currentFontId = 'poppins';
    window.customLogoDataURL = null;

    cardData = { subject: '', questions: {}, answers: {} };

    if (card.sujet) cardData.subject = card.sujet;
    if (card.questions) {
      for (var k in card.questions) {
        cardData.questions[k] = card.questions[k];
      }
    }

    window.renderCard(currentThemeId, currentIconId, currentFontId);
    window.saveToLocalStorage();
    return { themeId: currentThemeId, iconId: currentIconId, fontId: currentFontId };
  };

  // ===== Getters/setters =====
  window.getCurrentThemeId = function() { return currentThemeId; };
  window.getCurrentIconId = function() { return currentIconId; };
  window.getCurrentFontId = function() { return currentFontId; };
  window.setCurrentThemeId = function(id) { currentThemeId = id; };
  window.setCurrentIconId = function(id) { currentIconId = id; };
  window.setCurrentFontId = function(id) { currentFontId = id; };

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
      subject: cardData.subject,
      questions: Object.assign({}, cardData.questions),
      answers: Object.assign({}, cardData.answers)
    };
  };

  // Kept for export.js compatibility
  window.getCurrentSide = function() { return 'recto'; };
  window.switchSide = function() {};

})();
