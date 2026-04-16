// ===== Utilitaire slug =====
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ===== Toast =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.classList.add('hidden');
  }, 3000);
}

// ===== Export de la carte courante =====
async function exportCurrentCard() {
  const preview = document.getElementById('card-preview');
  const theme = getCurrentTheme();
  const label = THEMES[theme].label;

  const canvas = await html2canvas(preview, {
    width: 936,
    height: 735,
    scale: 1,
    useCORS: true,
    backgroundColor: null
  });

  const link = document.createElement('a');
  link.download = `ttmc-${theme}-${slugify(label)}-vide.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  showToast(`Carte exportée : ${label}`);
}

// ===== Export de toutes les cartes (une par thème) =====
async function exportAllCards() {
  const themes = Object.keys(THEMES);
  const total = themes.length;

  showToast(`Export en cours... 0/${total}`);

  for (let i = 0; i < total; i++) {
    await renderCard(themes[i]);
    await new Promise(resolve => setTimeout(resolve, 500));

    const preview = document.getElementById('card-preview');
    const canvas = await html2canvas(preview, {
      width: 936,
      height: 735,
      scale: 1,
      useCORS: true,
      backgroundColor: null
    });

    const link = document.createElement('a');
    link.download = `ttmc-${themes[i]}-${slugify(THEMES[themes[i]].label)}-vide.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast(`Export en cours... ${i + 1}/${total}`);
  }

  // Revenir au thème sélectionné
  const current = getCurrentTheme();
  await renderCard(current);

  showToast(`${total} cartes exportées !`);
}

// ===== Wiring des boutons =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-export').addEventListener('click', exportCurrentCard);
  document.getElementById('btn-export-all').addEventListener('click', exportAllCards);
});
