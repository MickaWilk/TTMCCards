// ===== export.js — Export PNG via html2canvas =====

(function() {
  'use strict';

  window.slugify = function(t) {
    return t.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  window.showToast = function(msg, duration) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = '';
    if (typeof msg === 'string') {
      t.textContent = msg;
    } else {
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

  var CSS_PROPS = [
    '--header-bg','--header-text','--border','--num-color','--card-bg',
    '--icon-bg-alpha','--subject-size','--question-size','--answer-size',
    '--num-size','--answer-num-size'
  ];

  // ===== Clone la carte pour l'export =====
  function cloneCardForExport(preview) {
    var clone = preview.cloneNode(true);
    clone.id = '';
    clone.style.cssText = 'position:fixed;left:-9999px;top:0;width:936px;height:735px;box-shadow:none;border-radius:20px;overflow:hidden;z-index:-1;';

    var computedStyle = getComputedStyle(preview);
    for (var p = 0; p < CSS_PROPS.length; p++) {
      var val = computedStyle.getPropertyValue(CSS_PROPS[p]);
      if (val) clone.style.setProperty(CSS_PROPS[p], val);
    }
    clone.style.fontFamily = preview.style.fontFamily || computedStyle.fontFamily;

    var editables = clone.querySelectorAll('[contenteditable]');
    for (var e = 0; e < editables.length; e++) {
      editables[e].removeAttribute('contenteditable');
      if (!editables[e].innerText.trim()) editables[e].innerHTML = '&nbsp;';
    }

    return clone;
  }

  // ===== Export la carte complète (recto + verso côte à côte) =====
  window.exportCard = function() {
    var exportW = 936;
    var exportH = 735;
    var wInput = document.getElementById('export-w');
    var hInput = document.getElementById('export-h');
    if (wInput) exportW = parseInt(wInput.value) || 936;
    if (hInput) exportH = parseInt(hInput.value) || 735;

    var preview = document.getElementById('card-preview');
    if (!preview) return;

    var clone = cloneCardForExport(preview);
    document.body.appendChild(clone);

    setTimeout(function() {
      var scale = Math.max(exportW / 936, exportH / 735, 1);

      html2canvas(clone, {
        width: 936, height: 735, scale: scale,
        useCORS: true, allowTaint: true, backgroundColor: null, logging: false
      }).then(function(canvas) {
        var out = document.createElement('canvas');
        out.width = exportW;
        out.height = exportH;
        out.getContext('2d').drawImage(canvas, 0, 0, exportW, exportH);

        var data = window.getCardData();
        var label = data.subject || data.title || data.subtitle || '';
        var suffix = label ? window.slugify(label) : 'vide';
        var themeId = window.getCurrentThemeId();
        var cardType = data.cardType || 'standard';

        var link = document.createElement('a');
        link.download = 'ttmc-' + cardType + '-' + themeId + '-' + suffix + '-' + exportW + 'x' + exportH + '.png';
        link.href = out.toDataURL('image/png');
        link.click();

        document.body.removeChild(clone);
        window.showToast('Export\u00e9 en ' + exportW + ' \u00d7 ' + exportH + ' px');
      }).catch(function(err) {
        document.body.removeChild(clone);
        window.showToast('Erreur lors de l\'export');
        console.error(err);
      });
    }, 100);
  };

  // ===== Export des 2 faces séparément =====
  function exportHalf(side, callback) {
    var halfW = 468;
    var halfH = 735;
    var wInput = document.getElementById('export-w');
    var hInput = document.getElementById('export-h');
    if (wInput) halfW = Math.round((parseInt(wInput.value) || 936) / 2);
    if (hInput) halfH = parseInt(hInput.value) || 735;

    var preview = document.getElementById('card-preview');
    if (!preview) { if (callback) callback(); return; }

    var clone = cloneCardForExport(preview);
    document.body.appendChild(clone);

    setTimeout(function() {
      var scale = Math.max(halfW / 468, halfH / 735, 1);

      html2canvas(clone, {
        width: 936, height: 735, scale: scale,
        useCORS: true, allowTaint: true, backgroundColor: null, logging: false
      }).then(function(canvas) {
        // Découper la moitié gauche (recto) ou droite (verso)
        var srcX = (side === 'verso') ? canvas.width / 2 : 0;
        var srcW = canvas.width / 2;

        var out = document.createElement('canvas');
        out.width = halfW;
        out.height = halfH;
        out.getContext('2d').drawImage(canvas, srcX, 0, srcW, canvas.height, 0, 0, halfW, halfH);

        var data = window.getCardData();
        var label = data.subject || data.title || data.subtitle || '';
        var suffix = label ? window.slugify(label) : 'vide';
        var themeId = window.getCurrentThemeId();
        var cardType = data.cardType || 'standard';

        var link = document.createElement('a');
        link.download = 'ttmc-' + cardType + '-' + themeId + '-' + side + '-' + suffix + '-' + halfW + 'x' + halfH + '.png';
        link.href = out.toDataURL('image/png');
        link.click();

        document.body.removeChild(clone);
        if (callback) callback();
      }).catch(function(err) {
        document.body.removeChild(clone);
        window.showToast('Erreur lors de l\'export');
        console.error(err);
        if (callback) callback();
      });
    }, 100);
  }

  window.exportBothSides = function() {
    window.showToast('Export du recto...');
    exportHalf('recto', function() {
      setTimeout(function() {
        window.showToast('Export du verso...');
        exportHalf('verso', function() {
          window.showToast('Les 2 faces ont \u00e9t\u00e9 export\u00e9es !');
        });
      }, 500);
    });
  };

})();
