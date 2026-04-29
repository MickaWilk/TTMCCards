# TTMC Cards — "Tu te mets combien ?"

## Description du projet

Générateur de cartes personnalisées pour le jeu "Tu te mets combien ?" (TTMC).
Application web (HTML/CSS/JS) permettant de créer, prévisualiser et exporter des cartes
prêtes à l'impression dans 3 thèmes différents.

## Spécifications des cartes

### Dimensions
- **Taille exacte : 936 x 735 px** (orientation paysage)
- Format d'export : PNG haute qualité pour impression

### Thèmes / Couleurs

| Couleur | Thème | Texte header | Fond header | Icône (haut droite) |
|---------|-------|-------------|-------------|---------------------|
| **Bleue** | Divers / Improbable | Jaune sur bleu | Bleu | Poisson (style PP) |
| **Jaune** | Personnages / Célébrités / Nous | Bleu sur jaune | Jaune | Silhouette Cyril Féraud |
| **Rouge** | Pop Culture | Blanc sur rouge | Rouge | Épée / Dragon Ball / Pokéball |

### Structure d'une carte
- **Header** (bandeau haut) : nom du thème + icône à droite
- **Corps** : sujet de la question
- **Zone de scoring** : échelle 1 à 10 avec questions graduées

## Stack technique

- **Frontend** : HTML5 + CSS3 + JavaScript vanilla
- **Export PNG** : html2canvas (via CDN)
- **Pas de build step** — ouvrir `index.html` dans le navigateur suffit
- **Données** : fichiers JSON dans `cards/` (une entrée par carte)

## Structure du projet

```
ttmc-cards/
├── CLAUDE.md
├── index.html          # App principale (prévisualisation + export)
├── src/
│   ├── style.css       # Styles des cartes et de l'UI
│   ├── cards.js        # Logique de rendu des cartes
│   └── export.js       # Export PNG via html2canvas
├── assets/
│   └── icons/          # SVG des icônes (poisson, silhouette, pokeball...)
├── cards/
│   ├── bleues.json     # Cartes Divers/Improbable
│   ├── jaunes.json     # Cartes Personnages/Célébrités
│   └── rouges.json     # Cartes Pop Culture
└── templates/
    └── card-template.html  # Template HTML d'une carte
```

## Conventions

- Noms de fichiers en kebab-case
- Couleurs définies en variables CSS (`:root`)
- Chaque carte JSON suit le schéma : `{ "theme", "sujet", "questions": { "1": "...", ... "10": "..." } }`
- Les icônes sont en SVG inline pour un rendu net à toute taille
- Pas de dépendance npm — tout via CDN ou vanilla

## Commandes utiles

```bash
# Lancer un serveur local (Python)
cd /c/Users/mwilk/ttmc-cards
python -m http.server 8080

# Ouvrir dans le navigateur
start http://localhost:8080
```

## Notes importantes

- Le dossier projet est dans `C:\Users\mwilk\ttmc-cards\` (PAS dans OneDrive)
- Si besoin d'un venv Python : `C:\Users\mwilk\.venvs\ttmc-cards`
- Les cartes exportées vont dans un dossier `exports/` (gitignored)
