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
    // Intrepide
    responses: ''
  };

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

  function ttmcLogo() {
    return '<span class="ttmc-logo">TTMc<sup>2</sup></span>';
  }

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

    // Remove old card type classes, add current
    p.className = 'ttmc-card card-type-' + currentCardType;

    // Dispatch to the right renderer
    switch (currentCardType) {
      case 'debuter':   renderDebuter(p); break;
      case 'gagner':    renderGagner(p); break;
      case 'intrepide': renderIntrepide(p); break;
      default:          renderStandard(p); break;
    }

    restoreFromMemory();
    setupAutoSave(p);
  };

  // =========================================================================
  // STANDARD Q&A — "Tu te mets combien en..."
  // Two panels: questions (left) + answers (right)
  // =========================================================================
  function renderStandard(p) {
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
          '<div class="panel-header-logo">' + ttmcLogo() + '</div>' +
          '<div class="panel-header-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-answers">' + aRows + '</div>' +
        '<div class="panel-watermark">' + iconHTML() + '</div>' +
      '</div>' +
    '</div>';

    p.innerHTML = leftPanel + rightPanel;
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
            '<div class="debuter-header-text">H\u00c9SITE PAS \u00c0</div>' +
            '<div class="debuter-header-title">D\u00c9BUTER</div>' +
          '</div>' +
          '<div class="debuter-title" contenteditable="true" data-placeholder="Titre du challenge (' + ph + ')..." data-field="title' + sfx + '"></div>' +
          '<div class="debuter-body" contenteditable="true" data-placeholder="D\u00e9crivez le challenge ici..." data-field="body' + sfx + '"></div>' +
          '<div class="debuter-footer" contenteditable="true" data-placeholder="Note de bas de page..." data-field="footer' + sfx + '"></div>' +
          '<div class="debuter-logo">' + ttmcLogo() + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="panel-watermark">' + iconHTML() + '</div>' +
    '</div>';
  }

  function renderDebuter(p) {
    p.innerHTML = renderDebuterPanel('A') + renderDebuterPanel('B');
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
          '<span class="gagner-header-text">H\u00c9SITE PAS \u00c0 GAGNER</span>' +
          '<span class="gagner-star">&#9733;</span>' +
        '</div>' +
        '<div class="gagner-subtitle" contenteditable="true" data-placeholder="NOM DU CHALLENGE (' + ph + ')" data-field="subtitle' + sfx + '"></div>' +
        '<div class="gagner-body" contenteditable="true" data-placeholder="D\u00e9crivez la question ou le challenge ici..." data-field="body' + sfx + '"></div>' +
        '<div class="gagner-divider"></div>' +
        '<div class="gagner-answer-label">R\u00e9ponse</div>' +
        '<div class="gagner-answer" contenteditable="true" data-placeholder="Tapez la r\u00e9ponse ici..." data-field="challengeAnswer' + sfx + '"></div>' +
        '<div class="gagner-logo">' + ttmcLogo() + '</div>' +
      '</div>' +
      '<div class="panel-watermark">' + iconHTML() + '</div>' +
    '</div>';
  }

  function renderGagner(p) {
    p.innerHTML = renderGagnerPanel('A') + renderGagnerPanel('B');
  }

  // =========================================================================
  // INTREPIDE — Dual panel: challenge (left) + responses (right)
  // =========================================================================
  function renderIntrepide(p) {
    var leftPanel =
      '<div class="card-panel">' +
        '<div class="intrepide-inner panel-bordered">' +
          '<div class="intrepide-header">' +
            '<span class="intrepide-header-text">Intr\u00e9pide</span>' +
          '</div>' +
          '<div class="intrepide-title" contenteditable="true" data-placeholder="NOM DU D\u00c9FI" data-field="title"></div>' +
          '<div class="intrepide-body" contenteditable="true" data-placeholder="D\u00e9crivez le d\u00e9fi ici...\n\nExemple : Dommage, tu es tomb\u00e9 sur une tuile. Tu recules de 5 cases sauf si le plus m\u00e9lomane de ton \u00e9quipe nous chante le refrain de Quelque part de Sheryl Luna..." data-field="body"></div>' +
          '<div class="intrepide-logo">' + ttmcLogo() + '</div>' +
        '</div>' +
      '</div>';

    var rightPanel =
      '<div class="card-panel">' +
        '<div class="intrepide-inner panel-bordered">' +
          '<div class="intrepide-header">' +
            '<span class="intrepide-header-text">Intr\u00e9pide</span>' +
            '<span class="intrepide-header-sub">R\u00c9PONSES</span>' +
          '</div>' +
          '<div class="intrepide-responses" contenteditable="true" data-placeholder="Tapez les r\u00e9ponses ici...\n\n\u00c9cris-moi une autre histoire\nT\'es le seul \u00e0 me comprendre\nEmm\u00e8ne-moi quelque part\nNe me laissez pas surprendre\nInvente-moi un monde \u00e0 part\nApprends-moi une nouvelle danse\nEmm\u00e8ne-moi quelque part\nBoy, je te fais confiance" data-field="responses"></div>' +
          '<div class="intrepide-logo">' + ttmcLogo() + '</div>' +
        '</div>' +
      '</div>';

    p.innerHTML = leftPanel + rightPanel;
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
    // Intrepide
    if (d.responses != null) cardData.responses = d.responses;

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
        // Intrepide
        responses: cardData.responses,
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
    currentCardType = 'standard';
    currentThemeId = 'green';
    currentIconId = 'feuille';
    currentFontId = 'poppins';
    fontSizes = { subject: 22, question: 10, answer: 10, number: 28 };
    cardData = { subject: '', questions: {}, answers: {}, title: '', body: '', footer: '', subtitle: '', challengeAnswer: '', titleB: '', bodyB: '', footerB: '', subtitleB: '', challengeAnswerB: '', responses: '' };
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

    cardData = { subject: '', questions: {}, answers: {}, title: '', body: '', footer: '', subtitle: '', challengeAnswer: '', titleB: '', bodyB: '', footerB: '', subtitleB: '', challengeAnswerB: '', responses: '' };

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
      responses: cardData.responses
    };
  };

  // Kept for export.js compatibility
  window.getCurrentSide = function() { return 'recto'; };
  window.switchSide = function() {};

})();
