// ===== cards.js — Rendu recto/verso + édition + sauvegarde =====

(function() {
  'use strict';

  // État courant
  var currentThemeId = 'blue';
  var currentIconId = 'poisson';
  var currentFontId = 'poppins';
  var currentSide = 'recto';      // 'recto' ou 'verso'
  var customLogoDataURL = null;
  var saveTimer = null;

  // Tailles de police (en px)
  var fontSizes = {
    subject: 20,
    question: 9.5,
    answer: 9.5,
    number: 28
  };

  // Mémoire du contenu des deux faces (préservé lors du switch)
  var cardData = {
    recto: {
      subjectA: '',
      questionsA: {},
      subjectB: '',
      questionsB: {}
    },
    verso: {
      subject: '',
      answers: {}
    }
  };

  var LS_KEY = 'ttmc-card-draft';

  // Expose la variable logo sur window
  window.customLogoDataURL = null;

  // ===== Génération du HTML d'icône =====
  function iconHTML() {
    if (window.customLogoDataURL) {
      return '<img src="' + window.customLogoDataURL + '">';
    }
    var icon = window.BUILTIN_ICONS[currentIconId];
    return icon ? icon.svg : '';
  }

  // ===== Render principal — dispatch selon le côté =====
  window.renderCard = function(themeId, iconId, fontId) {
    if (themeId) currentThemeId = themeId;
    if (iconId) currentIconId = iconId;
    if (fontId) currentFontId = fontId;

    var theme = window.getThemeById(currentThemeId);
    var p = document.getElementById('card-preview');
    if (!p) return;

    // Sauvegarder le contenu actuel avant le re-render
    saveCurrentSideToMemory();

    // Appliquer le thème via custom properties
    window.applyTheme(p, theme);

    // Appliquer la police
    var font = window.getFontById(currentFontId);
    if (font) {
      window.applyFont(p, font.family);
    }

    // Appliquer les tailles de police
    applyFontSizeProperties(p);

    // Générer le HTML selon le côté
    if (currentSide === 'verso') {
      renderVerso(p);
    } else {
      renderRecto(p);
    }

    // Restaurer le contenu depuis la mémoire
    restoreCurrentSideFromMemory();

    // Auto-save sur chaque modification
    setupAutoSave(p);
  };

  // ===== Appliquer les custom properties de taille =====
  function applyFontSizeProperties(el) {
    el.style.setProperty('--subject-size', fontSizes.subject + 'px');
    el.style.setProperty('--question-size', fontSizes.question + 'px');
    el.style.setProperty('--answer-size', fontSizes.answer + 'px');
    el.style.setProperty('--num-size', fontSizes.number + 'px');
    el.style.setProperty('--answer-num-size', Math.round(fontSizes.number * 0.46) + 'px');
  }

  // ===== RECTO — 2 panneaux de questions côte à côte =====
  function renderRecto(p) {
    var panelA = buildQuestionPanel('a', 'SUJET A ?');
    var panelB = buildQuestionPanel('b', 'SUJET B ?');
    p.innerHTML = panelA + panelB;
  }

  // Construit un panneau de questions (recto)
  function buildQuestionPanel(panelId, placeholder) {
    var rows = '';
    for (var i = 1; i <= 10; i++) {
      rows += '<div class="pq-row">' +
        '<div class="pq-num">' + i + '</div>' +
        '<div class="pq-txt" contenteditable="true" data-placeholder="Question ' + i + '..." data-i="' + i + '" data-panel="' + panelId + '"></div>' +
        '</div>';
    }

    return '<div class="card-panel">' +
      '<div class="panel-inner panel-bordered">' +
        '<div class="panel-header">' +
          '<span class="panel-header-text">Tu te mets combien en...</span>' +
          '<div class="panel-header-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-subject"><span contenteditable="true" data-placeholder="' + placeholder + '" data-panel="' + panelId + '"></span></div>' +
        '<div class="panel-questions">' + rows + '</div>' +
      '</div>' +
    '</div>';
  }

  // ===== VERSO — panneau score (gauche) + panneau réponses (droit) =====
  function renderVerso(p) {
    // Panneau gauche : scoring (numéros + lignes)
    var scoreRows = '';
    for (var i = 1; i <= 10; i++) {
      scoreRows += '<div class="ps-row">' +
        '<div class="ps-num">' + i + '</div>' +
        '<div class="ps-line"></div>' +
        '</div>';
    }

    var leftPanel = '<div class="card-panel">' +
      '<div class="panel-inner panel-bordered">' +
        '<div class="panel-header">' +
          '<span class="panel-header-text">Tu te mets combien en...</span>' +
          '<div class="panel-header-icon">' + iconHTML() + '</div>' +
        '</div>' +
        '<div class="panel-subject"><span contenteditable="true" data-placeholder="Sujet..." data-panel="verso"></span></div>' +
        '<div class="panel-scores">' + scoreRows + '</div>' +
        '<div class="panel-watermark">' + iconHTML() + '</div>' +
      '</div>' +
    '</div>';

    // Panneau droit : réponses
    var answerRows = '';
    for (var j = 1; j <= 10; j++) {
      answerRows += '<div class="pa-row">' +
        '<div class="pa-num">' + j + '.</div>' +
        '<div class="pa-txt" contenteditable="true" data-placeholder="R\u00e9ponse ' + j + '..." data-i="' + j + '"></div>' +
        '</div>';
    }

    var rightPanel = '<div class="card-panel">' +
      '<div class="panel-inner">' +
        '<div class="panel-resp-title">R\u00e9ponses</div>' +
        '<div class="panel-answers">' + answerRows + '</div>' +
        '<div class="panel-sparkle"></div>' +
      '</div>' +
    '</div>';

    p.innerHTML = leftPanel + rightPanel;
  }

  // ===== Auto-save debounced =====
  function setupAutoSave(cardEl) {
    cardEl.addEventListener('input', function() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function() {
        saveCurrentSideToMemory();
        window.saveToLocalStorage();
      }, 500);
    });
  }

  // ===== Sauvegarder le contenu du côté affiché dans cardData =====
  function saveCurrentSideToMemory() {
    var p = document.getElementById('card-preview');
    if (!p) return;

    if (currentSide === 'recto') {
      // Sujets A et B
      var subjects = p.querySelectorAll('.panel-subject [contenteditable]');
      if (subjects.length >= 2) {
        cardData.recto.subjectA = subjects[0].innerText || '';
        cardData.recto.subjectB = subjects[1].innerText || '';
      } else if (subjects.length === 1) {
        cardData.recto.subjectA = subjects[0].innerText || '';
      }

      // Questions panneau A
      var qA = p.querySelectorAll('.pq-txt[data-panel="a"]');
      for (var i = 0; i < qA.length; i++) {
        cardData.recto.questionsA[qA[i].dataset.i] = qA[i].innerText || '';
      }

      // Questions panneau B
      var qB = p.querySelectorAll('.pq-txt[data-panel="b"]');
      for (var j = 0; j < qB.length; j++) {
        cardData.recto.questionsB[qB[j].dataset.i] = qB[j].innerText || '';
      }
    } else {
      // Verso : sujet
      var versoSubj = p.querySelector('.panel-subject [contenteditable][data-panel="verso"]');
      if (versoSubj) {
        cardData.verso.subject = versoSubj.innerText || '';
      }

      // Verso : réponses
      var answers = p.querySelectorAll('.pa-txt');
      for (var k = 0; k < answers.length; k++) {
        cardData.verso.answers[answers[k].dataset.i] = answers[k].innerText || '';
      }
    }
  }

  // ===== Restaurer le contenu depuis cardData vers le DOM =====
  function restoreCurrentSideFromMemory() {
    var p = document.getElementById('card-preview');
    if (!p) return;

    if (currentSide === 'recto') {
      var subjects = p.querySelectorAll('.panel-subject [contenteditable]');
      if (subjects.length >= 1 && cardData.recto.subjectA) {
        subjects[0].innerText = cardData.recto.subjectA;
      }
      if (subjects.length >= 2 && cardData.recto.subjectB) {
        subjects[1].innerText = cardData.recto.subjectB;
      }

      var qA = p.querySelectorAll('.pq-txt[data-panel="a"]');
      for (var i = 0; i < qA.length; i++) {
        var idx = qA[i].dataset.i;
        if (cardData.recto.questionsA[idx]) qA[i].innerText = cardData.recto.questionsA[idx];
      }

      var qB = p.querySelectorAll('.pq-txt[data-panel="b"]');
      for (var j = 0; j < qB.length; j++) {
        var idx2 = qB[j].dataset.i;
        if (cardData.recto.questionsB[idx2]) qB[j].innerText = cardData.recto.questionsB[idx2];
      }
    } else {
      var versoSubj = p.querySelector('.panel-subject [contenteditable][data-panel="verso"]');
      if (versoSubj && cardData.verso.subject) {
        versoSubj.innerText = cardData.verso.subject;
      }

      var answers = p.querySelectorAll('.pa-txt');
      for (var k = 0; k < answers.length; k++) {
        var idx3 = answers[k].dataset.i;
        if (cardData.verso.answers[idx3]) answers[k].innerText = cardData.verso.answers[idx3];
      }
    }
  }

  // ===== Sauvegarder le contenu éditable (compat ancien format) =====
  window.saveCardContent = function() {
    saveCurrentSideToMemory();
    return {
      recto: {
        subjectA: cardData.recto.subjectA,
        questionsA: Object.assign({}, cardData.recto.questionsA),
        subjectB: cardData.recto.subjectB,
        questionsB: Object.assign({}, cardData.recto.questionsB)
      },
      verso: {
        subject: cardData.verso.subject,
        answers: Object.assign({}, cardData.verso.answers)
      }
    };
  };

  // ===== Restaurer le contenu =====
  window.restoreCardContent = function(d) {
    if (!d) return;

    // Support nouveau format (recto/verso)
    if (d.recto) {
      cardData.recto.subjectA = d.recto.subjectA || '';
      cardData.recto.questionsA = d.recto.questionsA || {};
      cardData.recto.subjectB = d.recto.subjectB || '';
      cardData.recto.questionsB = d.recto.questionsB || {};
    }
    if (d.verso) {
      cardData.verso.subject = d.verso.subject || '';
      cardData.verso.answers = d.verso.answers || {};
    }

    // Support ancien format (migration depuis v1)
    if (d.subject && !d.recto) {
      cardData.recto.subjectA = d.subject;
      if (d.q) cardData.recto.questionsA = d.q;
      if (d.a) cardData.verso.answers = d.a;
    }

    // Appliquer au DOM
    restoreCurrentSideFromMemory();
  };

  // ===== Basculer entre recto et verso =====
  window.switchSide = function(side) {
    if (side === currentSide) return;

    // Sauvegarder le contenu du côté actuel
    saveCurrentSideToMemory();

    // Basculer
    currentSide = side;

    // Re-render la carte
    window.renderCard(currentThemeId, currentIconId, currentFontId);

    // Sauvegarder dans localStorage
    window.saveToLocalStorage();
  };

  // ===== Getter du côté courant =====
  window.getCurrentSide = function() { return currentSide; };
  window.setCurrentSide = function(s) { currentSide = s; };

  // ===== Sauvegarde localStorage =====
  window.saveToLocalStorage = function() {
    try {
      saveCurrentSideToMemory();
      var data = {
        themeId: currentThemeId,
        iconId: currentIconId,
        fontId: currentFontId,
        fontSizes: { subject: fontSizes.subject, question: fontSizes.question, answer: fontSizes.answer, number: fontSizes.number },
        currentSide: currentSide,
        recto: {
          subjectA: cardData.recto.subjectA,
          questionsA: Object.assign({}, cardData.recto.questionsA),
          subjectB: cardData.recto.subjectB,
          questionsB: Object.assign({}, cardData.recto.questionsB)
        },
        verso: {
          subject: cardData.verso.subject,
          answers: Object.assign({}, cardData.verso.answers)
        },
        timestamp: Date.now()
      };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch(e) {
      // Échec silencieux
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
    currentSide = 'recto';
    fontSizes = { subject: 20, question: 9.5, answer: 9.5, number: 28 };
    cardData = {
      recto: { subjectA: '', questionsA: {}, subjectB: '', questionsB: {} },
      verso: { subject: '', answers: {} }
    };
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
    currentSide = 'recto';

    // Réinitialiser les données
    cardData = {
      recto: { subjectA: '', questionsA: {}, subjectB: '', questionsB: {} },
      verso: { subject: '', answers: {} }
    };

    // Remplir le panneau A du recto avec les données de l'exemple
    if (card.sujet) cardData.recto.subjectA = card.sujet;
    if (card.questions) {
      for (var k in card.questions) {
        cardData.recto.questionsA[k] = card.questions[k];
      }
    }

    // Render
    window.renderCard(currentThemeId, currentIconId, currentFontId);

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

  // ===== Accès aux données (pour l'export) =====
  window.getCardData = function() {
    saveCurrentSideToMemory();
    return {
      recto: {
        subjectA: cardData.recto.subjectA,
        questionsA: Object.assign({}, cardData.recto.questionsA),
        subjectB: cardData.recto.subjectB,
        questionsB: Object.assign({}, cardData.recto.questionsB)
      },
      verso: {
        subject: cardData.verso.subject,
        answers: Object.assign({}, cardData.verso.answers)
      }
    };
  };

})();
