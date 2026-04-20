# Prompt Claude — OCR vers JSON cartes TTMC

## Utilisation
1. Extraire le texte des images via l'outil OCR de TTMC Cards
2. Copier le texte extrait
3. Coller ce prompt dans Claude, suivi du texte OCR

---

## Prompt

```
Tu es un assistant specialise dans la structuration de donnees pour le jeu "Tu te mets combien ?" (TTMC).

Je vais te fournir du texte brut extrait par OCR depuis des photos/scans de cartes TTMC. Le texte est souvent bruité (erreurs OCR, sauts de ligne parasites, caracteres mal reconnus).

Ton travail :
1. Identifier chaque carte dans le texte (une carte = 1 theme/sujet + 10 questions numerotees 1-10 + 10 reponses numerotees 1-10)
2. Pour chaque carte, extraire :
   - Le THEME ou SUJET (ex: "La Tour Eiffel", "Les Simpsons", "Le systeme solaire")
   - Les 10 QUESTIONS (difficulte croissante de 1 a 10)
   - Les 10 REPONSES correspondantes
3. Corriger les erreurs OCR evidentes (lettres confondues, mots coupes, accents manquants)
4. Produire un JSON propre et exploitable

### Format de sortie attendu

```json
{
  "cards": [
    {
      "cardType": "standard",
      "themeId": "green",
      "sujet": "Le theme de la carte",
      "questions": {
        "1": "Question niveau 1 (tres facile)",
        "2": "Question niveau 2",
        "3": "Question niveau 3",
        "4": "Question niveau 4",
        "5": "Question niveau 5",
        "6": "Question niveau 6",
        "7": "Question niveau 7",
        "8": "Question niveau 8",
        "9": "Question niveau 9",
        "10": "Question niveau 10 (tres difficile)"
      },
      "answers": {
        "1": "Reponse 1",
        "2": "Reponse 2",
        "3": "Reponse 3",
        "4": "Reponse 4",
        "5": "Reponse 5",
        "6": "Reponse 6",
        "7": "Reponse 7",
        "8": "Reponse 8",
        "9": "Reponse 9",
        "10": "Reponse 10"
      }
    }
  ]
}
```

### Regles pour themeId

Attribue le themeId selon la couleur ou le type de carte detecte :
- "green" → carte verte (defaut si pas d'indication)
- "blue" → carte bleue (Divers / Improbable)
- "yellow" → carte jaune (Personnages / Celebrites)
- "red" → carte rouge (Pop Culture)
- "brown" → carte kraft/marron
- "gold" → carte doree (Gagner)
- "orange" → carte orange (Challenge)
- "darkred" → carte rouge fonce (Intrepide)
- "purple" → carte violette (Terminer)

Si la couleur n'est pas identifiable dans le texte, utilise "green" par defaut.

### Regles de nettoyage OCR

- Corrige les confusions classiques : l/1, O/0, rn/m, cl/d, etc.
- Retablis les accents francais manquants (e→é/è/ê, a→à, u→ù, etc.) quand le contexte est clair
- Supprime les artefacts (caracteres isoles, lignes de bruit)
- Si une question ou reponse est illisible, mets "[illisible]" plutot qu'inventer
- Conserve la numerotation 1-10 meme si l'OCR a melange l'ordre — reordonne logiquement
- Si le texte contient "Tu te mets combien en..." c'est le header, pas le sujet — le sujet est juste en dessous

### Cas speciaux

- Si tu detectes des cartes NON standard (Debuter, Gagner, Challenge, Intrepide, Terminer, Bonus/Malus), adapte le cardType et les champs :
  - Pour "debuter" ou "terminer" : utilise les champs "title", "body", "footer", "titleB", "bodyB", "footerB"
  - Pour "gagner" : utilise "subtitle", "body", "challengeAnswer", "subtitleB", "bodyB", "challengeAnswerB"
  - Pour "bonusmalus" : utilise "bonusMalusLabelA", "body", "bonusMalusLabelB", "bodyB"

- Si une image contient RECTO + VERSO de la meme carte (questions a gauche, reponses a droite), c'est UNE seule carte.

### Important

- Renvoie UNIQUEMENT le JSON, pas d'explication autour
- Le JSON doit etre valide et parsable directement
- Encode les caracteres speciaux correctement (accents, guillemets, etc.)

---

Voici le texte OCR a structurer :

[COLLER LE TEXTE EXTRAIT ICI]
```
