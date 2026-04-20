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
  var CLAUDE_PROMPT =
    'Tu es un assistant specialise dans la structuration de donnees pour le jeu "Tu te mets combien ?" (TTMC).\n\n' +
    'Je vais te fournir du texte brut extrait par OCR depuis des photos/scans de cartes TTMC. Le texte est souvent bruite.\n\n' +
    '## Les 7 types de cartes TTMC\n\n' +
    'Chaque carte = 4201x3300px, recto (gauche) + verso (droite) separes par 1px noir.\n\n' +
    '### 1. STANDARD Q&A (4 couleurs)\n' +
    'Header "Tu te mets combien en..." + sujet en gras + 10 questions numerotees (recto) + 10 reponses numerotees (verso)\n' +
    '- Verte → cardType:"standard", themeId:"green"\n' +
    '- Bleue (Divers/Improbable) → cardType:"standard", themeId:"blue"\n' +
    '- Jaune (Personnages/Celebrites) → cardType:"standard", themeId:"yellow"\n' +
    '- Rouge (Pop Culture) → cardType:"standard", themeId:"red"\n' +
    'JSON: { cardType, themeId, sujet, questions:{"1".."10"}, answers:{"1".."10"} }\n\n' +
    '### 2. DEBUTER (verte/kraft)\n' +
    'Header "HESITE PAS A DEBUTER", titre + texte libre, recto + verso independants. PAS de Q&A numerotees.\n' +
    '→ cardType:"debuter", themeId:"green"\n' +
    'JSON: { cardType, themeId, title, body, footer, titleB, bodyB, footerB }\n\n' +
    '### 3. GAGNER (doree)\n' +
    'Header "HESITE PAS A GAGNER" avec etoiles, sous-titre + corps + reponse, recto + verso\n' +
    '→ cardType:"gagner", themeId:"gold"\n' +
    'JSON: { cardType, themeId, subtitle, body, challengeAnswer, subtitleB, bodyB, challengeAnswerB }\n\n' +
    '### 4. CHALLENGE (orange)\n' +
    '2 panneaux separes par eclair, defi gauche + reponse droite\n' +
    '→ cardType:"challenge", themeId:"orange"\n' +
    'JSON: { cardType, themeId, title:"CHALLENGE", subtitle, body, titleB:"REPONSE", bodyB, challengeAnswer }\n\n' +
    '### 5. INTREPIDE (rouge fonce)\n' +
    'Header "Intrepide", defi gauche + reponses droite (texte libre, pas numerote)\n' +
    '→ cardType:"intrepide", themeId:"darkred"\n' +
    'JSON: { cardType, themeId, title, body, responses }\n\n' +
    '### 6. TERMINER (violette)\n' +
    'Header "HESITE PAS A TERMINER", meme layout que debuter (titre + texte libre), recto + verso\n' +
    '→ cardType:"terminer", themeId:"purple"\n' +
    'JSON: { cardType, themeId, title, body, footer, titleB, bodyB, footerB }\n\n' +
    '### 7. BONUS/MALUS (blanc + noir)\n' +
    'Recto BLANC = bonus "TROP FORT" avec coeur. Verso NOIR = malus "C\'EST NUL" avec tete de mort. PAS de Q&A, juste label + texte.\n' +
    '→ cardType:"bonusmalus", themeId:"black"\n' +
    'JSON: { cardType, themeId, bonusMalusLabelA:"TROP FORT", body, bonusMalusLabelB:"C\'EST NUL", bodyB }\n\n' +
    '## Detection du type\n' +
    '- Numeros 1-10 avec questions/reponses → standard\n' +
    '- "hesite pas a debuter" → debuter\n' +
    '- "hesite pas a gagner" → gagner\n' +
    '- "challenge" / defi+reponse sans numeros → challenge\n' +
    '- "intrepide" → intrepide\n' +
    '- "hesite pas a terminer" → terminer\n' +
    '- "trop fort"/"c\'est nul" ou blanc/noir → bonusmalus\n' +
    '- Si pas d\'indice clair et Q&A numerotees → standard, themeId:"green"\n\n' +
    '## Regles OCR\n' +
    '- Corrige confusions : l/1, O/0, rn/m, cl/d, ii/u, accents manquants\n' +
    '- "Tu te mets combien en..." = HEADER, pas le sujet. Le sujet = gros texte en dessous\n' +
    '- "Reponses" = header du verso, pas une reponse\n' +
    '- Si illisible → "[illisible]", n\'invente rien\n' +
    '- Recto + verso sur meme image = UNE carte\n' +
    '- Renvoie UNIQUEMENT le JSON { "cards": [...] }, valide, parsable, sans explication\n\n' +
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
