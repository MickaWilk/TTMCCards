// ===== export.js — Export PNG via html2canvas =====

(function() {
  'use strict';

  // ===== Slugify =====
  window.slugify = function(t) {
    return t.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // ===== Toast =====
  window.showToast = function(msg, duration) {
    var t = document.getElementById('toast');
    if (!t) return;
    // Nettoyer le contenu précédent
    t.innerHTML = '';
    if (typeof msg === 'string') {
      t.textContent = msg;
    } else {
      // msg est un élément DOM (pour les toasts avec boutons)
      t.appendChild(msg);
    }
    t.classList.remove('hidden');
    t.classList.add('visible');
    if (duration !== 0) {
      setTimeout(function() {
        t.classList.remove('visible');
        t.classList.add('hidden');
      }, duration || 3000);
    }
  };

  window.hideToast = function() {
    var t = document.getElementById('toast');
    if (!t) return;
    t.classList.remove('visible');
    t.classList.add('hidden');
  };

  // ===== Export carte en PNG =====
  window.exportCard = function() {
    var exportW = 936;
    var exportH = 735;
    var wInput = document.getElementById('export-w');
    var hInput = document.getElementById('export-h');
    if (wInput) exportW = parseInt(wInput.value) || 936;
    if (hInput) exportH = parseInt(hInput.value) || 735;

    var preview = document.getElementById('card-preview');
    if (!preview) return;

    // 1. Clone la carte à taille native, hors écran
    var clone = preview.cloneNode(true);
    clone.id = '';
    clone.style.cssText = 'position:fixed;left:-9999px;top:0;width:936px;height:735px;box-shadow:none;border-radius:20px;overflow:hidden;z-index:-1;';

    // Copier les custom properties du preview vers le clone
    var computedStyle = getComputedStyle(preview);
    var props = ['--header-bg','--header-text','--border','--num-color','--card-bg','--icon-bg-alpha','--subject-size','--question-size','--answer-size','--num-size','--answer-num-size'];
    for (var p = 0; p < props.length; p++) {
      var val = computedStyle.getPropertyValue(props[p]);
      if (val) clone.style.setProperty(props[p], val);
    }
    // Copier la font-family
    clone.style.fontFamily = preview.style.fontFamily || computedStyle.fontFamily;

    // 2. Supprimer contenteditable (empêche décalage de texte par html2canvas)
    var editables = clone.querySelectorAll('[contenteditable]');
    for (var e = 0; e < editables.length; e++) {
      editables[e].removeAttribute('contenteditable');
      if (!editables[e].innerText.trim()) editables[e].innerHTML = '&nbsp;';
    }

    document.body.appendChild(clone);

    // 3. Petit délai pour le layout
    setTimeout(function() {
      var scale = Math.max(exportW / 936, exportH / 735, 1);

      html2canvas(clone, {
        width: 936,
        height: 735,
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      }).then(function(canvas) {
        // 4. Redimensionner aux dimensions exactes
        var out = document.createElement('canvas');
        out.width = exportW;
        out.height = exportH;
        out.getContext('2d').drawImage(canvas, 0, 0, exportW, exportH);

        // 5. Télécharger
        var themeId = window.getCurrentThemeId();
        var subjectEl = preview.querySelector('.cl-subj [contenteditable]');
        var subject = subjectEl ? subjectEl.innerText.trim() : '';
        var suffix = subject ? window.slugify(subject) : 'vide';

        var link = document.createElement('a');
        link.download = 'ttmc-' + themeId + '-' + suffix + '-' + exportW + 'x' + exportH + '.png';
        link.href = out.toDataURL('image/png');
        link.click();

        // 6. Nettoyage
        document.body.removeChild(clone);
        window.showToast('Export\u00e9 en ' + exportW + ' \u00d7 ' + exportH + ' px');
      }).catch(function(err) {
        document.body.removeChild(clone);
        window.showToast('Erreur lors de l\'export');
        console.error(err);
      });
    }, 100);
  };

})();
