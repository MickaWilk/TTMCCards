# Prompt Claude — OCR vers JSON cartes TTMC

## Utilisation
1. Extraire le texte des images via l'outil OCR de TTMC Cards
2. Copier le texte extrait
3. Coller ce prompt dans Claude, suivi du texte OCR

---

## Prompt

```
Tu es un assistant specialise dans la structuration de donnees pour le jeu "Tu te mets combien ?" (TTMC).

Je vais te fournir du texte brut extrait par OCR depuis des photos/scans de cartes TTMC. Le texte est souvent bruite (erreurs OCR, sauts de ligne parasites, caracteres mal reconnus).

### Les 7 types de cartes TTMC

Chaque carte fait 4201x3300 px, avec un recto (gauche, 2100px) et un verso (droite, 2100px) separes par 1px noir.

#### 1. STANDARD Q&A (4 couleurs)
Structure : header "Tu te mets combien en..." + sujet en gras + 10 questions numerotees (recto) + 10 reponses numerotees (verso)
- **Verte** ("N'hesite pas a Debuter") → cardType:"standard", themeId:"green"
- **Bleue** ("Divers / Improbable") → cardType:"standard", themeId:"blue"
- **Jaune** ("Personnages / Celebrites") → cardType:"standard", themeId:"yellow"
- **Rouge** ("Pop Culture") → cardType:"standard", themeId:"rouge_vif"

Format JSON pour standard :
```json
{
  "cardType": "standard",
  "themeId": "green",
  "sujet": "Le sujet de la carte",
  "questions": { "1": "Q1", "2": "Q2", "3": "Q3", "4": "Q4", "5": "Q5", "6": "Q6", "7": "Q7", "8": "Q8", "9": "Q9", "10": "Q10" },
  "answers": { "1": "R1", "2": "R2", "3": "R3", "4": "R4", "5": "R5", "6": "R6", "7": "R7", "8": "R8", "9": "R9", "10": "R10" }
}
```

#### 2. DEBUTER (verte/kraft)
Structure : bordure verte, header "HESITE PAS A DEBUTER", titre + texte libre (pas de Q&A numerotees), recto + verso independants
→ cardType:"debuter", themeId:"green"

Format JSON :
```json
{
  "cardType": "debuter",
  "themeId": "green",
  "title": "Titre recto",
  "body": "Texte du challenge recto",
  "footer": "Note de bas de page recto",
  "titleB": "Titre verso",
  "bodyB": "Texte du challenge verso",
  "footerB": "Note de bas de page verso"
}
```

#### 3. GAGNER (doree/or)
Structure : fond dore, header "HESITE PAS A GAGNER" avec etoiles, sous-titre + corps + reponse, recto + verso
→ cardType:"gagner", themeId:"gold"

Format JSON :
```json
{
  "cardType": "gagner",
  "themeId": "gold",
  "subtitle": "Nom du challenge recto",
  "body": "Description recto",
  "challengeAnswer": "Reponse recto",
  "subtitleB": "Nom du challenge verso",
  "bodyB": "Description verso",
  "challengeAnswerB": "Reponse verso"
}
```

#### 4. CHALLENGE (orange)
Structure : fond orange, 2 panneaux separes par un eclair, defi a gauche + reponse a droite
→ cardType:"challenge", themeId:"orange"

Format JSON :
```json
{
  "cardType": "challenge",
  "themeId": "orange",
  "title": "CHALLENGE",
  "subtitle": "Nom du challenge",
  "body": "Description du defi",
  "titleB": "REPONSE",
  "bodyB": "Description de la reponse",
  "challengeAnswer": "Reponse courte"
}
```

#### 5. INTREPIDE (rouge fonce)
Structure : fond rouge fonce, header "Intrepide", defi a gauche + reponses a droite (texte libre, pas numerote)
→ cardType:"intrepide", themeId:"darkred"

Format JSON :
```json
{
  "cardType": "intrepide",
  "themeId": "darkred",
  "title": "Nom du defi",
  "body": "Description du defi",
  "responses": "Texte des reponses (verso)"
}
```

#### 6. TERMINER (violette)
Structure : fond violet, header "HESITE PAS A TERMINER", meme layout que debuter (titre + texte libre), recto + verso
→ cardType:"terminer", themeId:"purple"

Format JSON :
```json
{
  "cardType": "terminer",
  "themeId": "purple",
  "title": "Titre recto",
  "body": "Texte du challenge recto",
  "footer": "Note recto",
  "titleB": "Titre verso",
  "bodyB": "Texte du challenge verso",
  "footerB": "Note verso"
}
```

#### 7. BONUS/MALUS (blanc + noir)
Structure : recto BLANC avec coeur (bonus / "TROP FORT"), verso NOIR avec tete de mort (malus / "C'EST NUL"). PAS de questions/reponses, juste un label + texte libre par face.
→ cardType:"bonusmalus", themeId:"black"

Format JSON :
```json
{
  "cardType": "bonusmalus",
  "themeId": "black",
  "bonusMalusLabelA": "TROP FORT",
  "body": "Description du bonus",
  "bonusMalusLabelB": "C'EST NUL",
  "bodyB": "Description du malus"
}
```

### Ton travail

1. Identifier chaque carte dans le texte OCR
2. Determiner son type (standard Q&A, debuter, gagner, challenge, intrepide, terminer, bonusmalus) selon les indices :
   - Presence de numeros 1-10 avec questions/reponses → standard
   - "hesite pas a debuter" → debuter
   - "hesite pas a gagner" → gagner
   - "challenge" + eclair ou defi/reponse sans numeros → challenge
   - "intrepide" → intrepide
   - "hesite pas a terminer" → terminer
   - "trop fort" / "c'est nul" ou structure blanc/noir → bonusmalus
3. Determiner la couleur/themeId selon les indices dans le texte
4. Extraire et structurer les champs selon le format du type detecte
5. Corriger les erreurs OCR

### Regles de nettoyage OCR

- Corrige les confusions classiques : l/1, O/0, rn/m, cl/d, ii/u, etc.
- Retablis les accents francais (e→e/e/e, a→a, u→u, c→c) quand le contexte est clair
- "Tu te mets combien en..." est le HEADER, pas le sujet — le sujet est le gros texte en dessous
- "Reponses" est le header du verso, pas une reponse
- Supprime les artefacts (caracteres isoles, lignes de bruit)
- Si une question ou reponse est illisible, mets "[illisible]"
- Conserve la numerotation 1-10 meme si l'OCR a melange l'ordre
- Si recto + verso sur la meme image = UNE seule carte

### Format de sortie final

```json
{
  "cards": [
    { ... carte 1 ... },
    { ... carte 2 ... }
  ]
}
```

IMPORTANT :
- Renvoie UNIQUEMENT le JSON valide, pas d'explication
- Le JSON doit etre parsable directement par JSON.parse()
- Encode correctement les accents et guillemets
- Une image = generalement une carte (sauf si plusieurs cartes visibles)

---

Voici le texte OCR a structurer :

[COLLER LE TEXTE EXTRAIT ICI]
```
