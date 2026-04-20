// ===== ocr.js — Extraction de texte via Tesseract.js =====

(function() {
  'use strict';

  var ocrFiles = [];   // { id, file, dataURL, name, status:'pending'|'processing'|'done'|'error' }
  var nextId = 1;
  var isProcessing = false;

  function getEls() {
    return {
      drop:       document.getElementById('ocr-drop'),
      input:      document.getElementById('ocr-input'),
      fileList:   document.getElementById('ocr-file-list'),
      lang:       document.getElementById('ocr-lang'),
      btnExtract: document.getElementById('btn-ocr-extract'),
      progress:   document.getElementById('ocr-progress'),
      progressFill: document.getElementById('ocr-progress-fill'),
      progressText: document.getElementById('ocr-progress-text'),
      output:     document.getElementById('ocr-output'),
      actions:    document.getElementById('ocr-actions'),
      btnCopy:    document.getElementById('btn-ocr-copy'),
      btnDownload: document.getElementById('btn-ocr-download'),
      btnClear:   document.getElementById('btn-ocr-clear')
    };
  }

  // ===== File list UI =====
  function renderFileList() {
    var els = getEls();
    if (!els.fileList) return;
    els.fileList.innerHTML = '';

    if (ocrFiles.length === 0) {
      if (els.btnExtract) els.btnExtract.disabled = true;
      return;
    }

    for (var i = 0; i < ocrFiles.length; i++) {
      (function(f, idx) {
        var item = document.createElement('div');
        item.className = 'ocr-file-item';

        var thumb = document.createElement('img');
        thumb.className = 'ocr-file-thumb';
        thumb.src = f.dataURL;
        item.appendChild(thumb);

        var name = document.createElement('span');
        name.className = 'ocr-file-name';
        name.textContent = (idx + 1) + '. ' + f.name;
        item.appendChild(name);

        var status = document.createElement('span');
        status.className = 'ocr-file-status';
        if (f.status === 'done') { status.textContent = 'OK'; status.classList.add('done'); }
        else if (f.status === 'processing') { status.textContent = '...'; status.classList.add('processing'); }
        else if (f.status === 'error') { status.textContent = 'Err'; status.classList.add('error'); }
        else { status.textContent = ''; }
        item.appendChild(status);

        if (!isProcessing) {
          var removeBtn = document.createElement('button');
          removeBtn.className = 'ocr-file-remove';
          removeBtn.textContent = '\u2715';
          removeBtn.title = 'Retirer';
          removeBtn.addEventListener('click', function() {
            ocrFiles.splice(ocrFiles.indexOf(f), 1);
            renderFileList();
          });
          item.appendChild(removeBtn);
        }

        els.fileList.appendChild(item);
      })(ocrFiles[i], i);
    }

    if (els.btnExtract) els.btnExtract.disabled = isProcessing;
  }

  // ===== Add files =====
  function addFiles(files) {
    for (var i = 0; i < files.length; i++) {
      (function(file) {
        if (!file.type.startsWith('image/')) return;
        var reader = new FileReader();
        reader.onload = function(e) {
          ocrFiles.push({
            id: nextId++,
            file: file,
            dataURL: e.target.result,
            name: file.name,
            status: 'pending'
          });
          renderFileList();
        };
        reader.readAsDataURL(file);
      })(files[i]);
    }
  }

  // ===== Progress =====
  function showProgress(pct, text) {
    var els = getEls();
    if (els.progress) els.progress.style.display = '';
    if (els.progressFill) els.progressFill.style.width = pct + '%';
    if (els.progressText) els.progressText.textContent = text || (Math.round(pct) + '%');
  }

  function hideProgress() {
    var els = getEls();
    if (els.progress) els.progress.style.display = 'none';
  }

  // ===== Extract =====
  function extractAll() {
    if (isProcessing || ocrFiles.length === 0) return;
    if (typeof Tesseract === 'undefined') {
      if (window.showToast) window.showToast('Tesseract.js non charge. Verifiez votre connexion.');
      return;
    }

    var els = getEls();
    isProcessing = true;
    if (els.btnExtract) els.btnExtract.disabled = true;
    if (els.output) els.output.style.display = 'none';
    if (els.actions) els.actions.style.display = 'none';

    var lang = (els.lang && els.lang.value) || 'fra';
    var results = [];
    var total = ocrFiles.length;
    var processed = 0;

    // Reset statuses
    for (var i = 0; i < ocrFiles.length; i++) ocrFiles[i].status = 'pending';
    renderFileList();
    showProgress(0, '0/' + total);

    function processNext(idx) {
      if (idx >= total) {
        // All done
        isProcessing = false;
        hideProgress();
        renderFileList();
        showResults(results);
        return;
      }

      var f = ocrFiles[idx];
      f.status = 'processing';
      renderFileList();

      Tesseract.recognize(f.dataURL, lang, {
        logger: function(info) {
          if (info.status === 'recognizing text' && info.progress != null) {
            var filePct = info.progress * 100;
            var globalPct = ((idx + info.progress) / total) * 100;
            showProgress(globalPct, (idx + 1) + '/' + total + ' (' + Math.round(filePct) + '%)');
          }
        }
      }).then(function(result) {
        f.status = 'done';
        results.push({
          name: f.name,
          text: result.data.text || ''
        });
        processed++;
        showProgress((processed / total) * 100, processed + '/' + total);
        renderFileList();
        processNext(idx + 1);
      }).catch(function(err) {
        f.status = 'error';
        results.push({
          name: f.name,
          text: '[Erreur: ' + (err.message || err) + ']'
        });
        processed++;
        console.error('OCR error on ' + f.name, err);
        renderFileList();
        processNext(idx + 1);
      });
    }

    processNext(0);
  }

  // ===== Show results =====
  function showResults(results) {
    var els = getEls();
    if (!els.output) return;

    var lines = [];
    for (var i = 0; i < results.length; i++) {
      if (results.length > 1) {
        lines.push('=== ' + results[i].name + ' ===');
      }
      lines.push(results[i].text.trim());
      if (i < results.length - 1) lines.push('');
    }

    var text = lines.join('\n');
    els.output.value = text;
    els.output.style.display = '';
    els.output.removeAttribute('readonly');
    if (els.actions) els.actions.style.display = '';

    if (window.showToast) {
      window.showToast(results.length + ' image' + (results.length > 1 ? 's' : '') + ' traitee' + (results.length > 1 ? 's' : ''));
    }
  }

  // ===== Claude prompt =====
  var CLAUDE_PROMPT = 'Tu es un assistant specialise dans la structuration de donnees pour le jeu "Tu te mets combien ?" (TTMC).\n\n' +
    'Je vais te fournir du texte brut extrait par OCR depuis des photos/scans de cartes TTMC. Le texte est souvent bruite (erreurs OCR, sauts de ligne parasites, caracteres mal reconnus).\n\n' +
    'Ton travail :\n' +
    '1. Identifier chaque carte dans le texte (une carte = 1 theme/sujet + 10 questions numerotees 1-10 + 10 reponses numerotees 1-10)\n' +
    '2. Pour chaque carte, extraire : le THEME/SUJET, les 10 QUESTIONS (difficulte croissante), les 10 REPONSES correspondantes\n' +
    '3. Corriger les erreurs OCR evidentes (lettres confondues, mots coupes, accents manquants)\n' +
    '4. Produire un JSON propre et exploitable\n\n' +
    '### Format de sortie\n\n' +
    '```json\n' +
    '{\n' +
    '  "cards": [\n' +
    '    {\n' +
    '      "cardType": "standard",\n' +
    '      "themeId": "green",\n' +
    '      "sujet": "Le theme de la carte",\n' +
    '      "questions": { "1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "...", "8": "...", "9": "...", "10": "..." },\n' +
    '      "answers": { "1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "...", "8": "...", "9": "...", "10": "..." }\n' +
    '    }\n' +
    '  ]\n' +
    '}\n' +
    '```\n\n' +
    '### themeId selon la couleur detectee\n' +
    '- "green" (defaut), "blue" (Divers), "yellow" (Personnages), "red" (Pop Culture), "brown" (kraft), "gold" (Gagner), "orange" (Challenge), "darkred" (Intrepide), "purple" (Terminer)\n\n' +
    '### Regles\n' +
    '- Corrige les confusions OCR classiques (l/1, O/0, rn/m, cl/d, accents manquants)\n' +
    '- Si illisible, mets "[illisible]" — n\'invente rien\n' +
    '- "Tu te mets combien en..." est le header, pas le sujet\n' +
    '- Si recto + verso sur la meme image = UNE seule carte\n' +
    '- Pour cartes non-standard (debuter, gagner, challenge, intrepide, terminer, bonusmalus), adapte cardType et utilise les champs title/body/footer/titleB/bodyB/footerB\n' +
    '- Renvoie UNIQUEMENT le JSON valide, rien d\'autre\n\n' +
    '---\n\nVoici le texte OCR a structurer :\n\n';

  function copyPromptWithText() {
    var els = getEls();
    if (!els.output || !els.output.value) return;

    var full = CLAUDE_PROMPT + els.output.value;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(full).then(function() {
        if (window.showToast) window.showToast('Prompt + texte copie ! Collez dans Claude.');
      });
    } else {
      // Fallback
      var ta = document.createElement('textarea');
      ta.value = full;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (window.showToast) window.showToast('Prompt + texte copie ! Collez dans Claude.');
    }
  }

  // ===== Copy / Download / Clear =====
  function copyOutput() {
    var els = getEls();
    if (!els.output || !els.output.value) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(els.output.value).then(function() {
        if (window.showToast) window.showToast('Texte copie !');
      });
    } else {
      els.output.select();
      document.execCommand('copy');
      if (window.showToast) window.showToast('Texte copie !');
    }
  }

  function downloadOutput() {
    var els = getEls();
    if (!els.output || !els.output.value) return;

    var blob = new Blob([els.output.value], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;

    var timestamp = new Date().toISOString().slice(0, 10);
    link.download = 'ttmc-texte-extrait-' + timestamp + '.txt';
    link.click();

    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    if (window.showToast) window.showToast('Fichier telecharge');
  }

  function clearAll() {
    ocrFiles = [];
    isProcessing = false;
    var els = getEls();
    renderFileList();
    hideProgress();
    if (els.output) { els.output.value = ''; els.output.style.display = 'none'; }
    if (els.actions) els.actions.style.display = 'none';
  }

  // ===== Init =====
  window.setupOCR = function() {
    var els = getEls();

    // File input
    if (els.input) {
      els.input.addEventListener('change', function(e) {
        addFiles(e.target.files);
        els.input.value = '';
      });
    }

    // Drop zone
    if (els.drop) {
      els.drop.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        els.drop.classList.add('drop-active');
      });
      els.drop.addEventListener('dragleave', function(e) {
        if (!els.drop.contains(e.relatedTarget)) {
          els.drop.classList.remove('drop-active');
        }
      });
      els.drop.addEventListener('drop', function(e) {
        e.preventDefault();
        els.drop.classList.remove('drop-active');
        if (e.dataTransfer && e.dataTransfer.files) {
          addFiles(e.dataTransfer.files);
        }
      });
    }

    // Buttons
    if (els.btnExtract) els.btnExtract.addEventListener('click', extractAll);
    if (els.btnCopy)    els.btnCopy.addEventListener('click', copyOutput);
    if (els.btnDownload) els.btnDownload.addEventListener('click', downloadOutput);
    if (els.btnClear)   els.btnClear.addEventListener('click', clearAll);

    var btnPrompt = document.getElementById('btn-ocr-prompt');
    if (btnPrompt) btnPrompt.addEventListener('click', copyPromptWithText);
  };

})();
