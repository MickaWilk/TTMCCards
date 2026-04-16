// ===== Liste de toutes les icônes disponibles =====
const ICONS = [
  { name: 'Poisson', file: 'assets/icons/poisson.svg' },
  { name: 'Silhouette', file: 'assets/icons/silhouette.svg' },
  { name: 'Pokéball', file: 'assets/icons/popculture.svg' },
  { name: 'Dragon Ball', file: 'assets/icons/dragonball.svg' },
  { name: 'Épée', file: 'assets/icons/epee.svg' },
  { name: 'Manette', file: 'assets/icons/manette.svg' },
  { name: 'Étoile', file: 'assets/icons/etoile.svg' }
];

// ===== Configuration des thèmes =====
const THEMES = {
  blue: {
    className: 'card-blue',
    label: 'Divers / Improbable',
    headerText: 'Tu te mets combien en...',
    defaultIcon: 0 // poisson
  },
  yellow: {
    className: 'card-yellow',
    label: 'Personnages / Célébrités / Nous',
    headerText: 'Tu te mets combien en...',
    defaultIcon: 1 // silhouette
  },
  red: {
    className: 'card-red',
    label: 'Pop Culture',
    headerText: 'Tu te mets combien en...',
    defaultIcon: 2 // pokéball
  }
};

const iconCache = {};
let currentIconIndex = 0;

// ===== Chargement icône =====
async function loadIconByIndex(index) {
  const file = ICONS[index].file;
  if (iconCache[file]) return iconCache[file];
  const resp = await fetch(file);
  const svg = await resp.text();
  iconCache[file] = svg;
  return svg;
}

// ===== Preload toutes les icônes =====
async function preloadAllIcons() {
  await Promise.all(ICONS.map((_, i) => loadIconByIndex(i)));
}

// ===== Étoile décorative SVG =====
const SPARKLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/>
</svg>`;

// ===== Rendu d'une carte vide =====
async function renderCard(theme) {
  const icon = await loadIconByIndex(currentIconIndex);
  const config = THEMES[theme];
  const preview = document.getElementById('card-preview');
  preview.className = config.className;

  let numbersHTML = '';
  for (let i = 1; i <= 10; i++) {
    numbersHTML += `
      <div class="card-number-row">
        <div class="card-number-val">${i}</div>
        <div class="card-number-line"></div>
      </div>`;
  }

  let answersHTML = '';
  for (let i = 1; i <= 10; i++) {
    answersHTML += `
      <div class="card-answer-row">
        <div class="card-answer-num">${i}.</div>
        <div class="card-answer-line"></div>
      </div>`;
  }

  preview.innerHTML = `
    <div class="card-left">
      <div class="card-left-inner">
        <div class="card-left-header">
          <div class="card-left-header-text">${config.headerText}</div>
          <div class="card-left-header-icon">${icon}</div>
        </div>
        <div class="card-subject-line"><span></span></div>
        <div class="card-numbers">
          ${numbersHTML}
        </div>
      </div>
      <div class="card-left-deco">${icon}</div>
    </div>
    <div class="card-right">
      <div class="card-right-inner">
        <div class="card-right-title">Réponses</div>
        <div class="card-answers">
          ${answersHTML}
        </div>
        <div class="card-right-deco">${SPARKLE_SVG}</div>
      </div>
    </div>
  `;
}

// ===== Icon Picker =====
async function buildIconPicker() {
  const picker = document.getElementById('icon-picker');
  picker.innerHTML = '';

  for (let i = 0; i < ICONS.length; i++) {
    const svg = await loadIconByIndex(i);
    const btn = document.createElement('button');
    btn.className = 'icon-picker-btn' + (i === currentIconIndex ? ' active' : '');
    btn.title = ICONS[i].name;
    btn.innerHTML = svg;
    btn.addEventListener('click', async () => {
      currentIconIndex = i;
      // Update active state
      picker.querySelectorAll('.icon-picker-btn').forEach((b, j) => {
        b.classList.toggle('active', j === i);
      });
      await renderCard(getCurrentTheme());
    });
    picker.appendChild(btn);
  }
}

// ===== Auto-scale pour tenir dans la fenêtre =====
function updateCardScale() {
  const main = document.querySelector('.main');
  const availW = main.clientWidth - 80;
  const availH = main.clientHeight - 80;
  const scaleW = availW / 936;
  const scaleH = availH / 735;
  const scale = Math.min(scaleW, scaleH, 1);
  document.getElementById('card-wrapper').style.setProperty('--card-scale', scale.toFixed(3));
}

// ===== Récupérer le thème courant =====
function getCurrentTheme() {
  return document.getElementById('theme-select').value;
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', async () => {
  const themeSelect = document.getElementById('theme-select');

  // Preload toutes les icônes
  await preloadAllIcons();

  // Construire le picker d'icônes
  await buildIconPicker();

  // Changement de thème → met à jour l'icône par défaut et re-render
  themeSelect.addEventListener('change', async () => {
    const theme = getCurrentTheme();
    currentIconIndex = THEMES[theme].defaultIcon;
    // Update picker active state
    document.querySelectorAll('.icon-picker-btn').forEach((b, j) => {
      b.classList.toggle('active', j === currentIconIndex);
    });
    await renderCard(theme);
  });

  // Scale initial + resize
  updateCardScale();
  window.addEventListener('resize', updateCardScale);

  // Chargement initial
  await renderCard('blue');
});
