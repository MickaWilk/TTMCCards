// ===== sample-cards.js — Donnees d'exemple pour les 4 types de cartes =====
// Pas de fetch() pour compatibilite file://

window.SAMPLE_CARDS = [
  // =================================================================
  // STANDARD Q&A — "Tu te mets combien en..."
  // =================================================================

  // --- Vertes (Nature / Scolaire) ---
  {
    cardType: 'standard',
    themeId: 'green',
    sujet: 'Safaris en Afrique ?',
    questions: {
      '1': 'Pourquoi la prochaine fois il va capturer du 5G pour signaler a ses congeneres la presence de la viande ?',
      '2': 'Lorsqu\'un safari part, le cameraman doit rester debout en ecoutant les precieux conseils du ranger ?',
      '3': 'Le mambo noir appele ainsi en reference a la couleur noire de ses yeux ?',
      '4': 'Le guepard dispose de griffes retractiles, non retractiles ou decapotables ?',
      '5': 'Nommer 4 des 5 merveilles faisant partie des Big Five d\'Afrique du Sud ?',
      '6': 'Dans quel pays se trouve la somptueuse reserve du Masai Mara ?',
      '7': 'De quoi se nourrit essentiellement un pangolin ?',
      '8': 'Comment reagit un acacia brule par une girafe ?',
      '9': 'Quel serpent fait le plus de victimes en Afrique du Sud ?',
      '10': 'Indiquer le regne, l\'embranchement, la famille et le genre de la hyene tachetee.'
    },
    answers: {
      '1': 'Pour signaler a ses congeneres la presence de la viande',
      '2': 'Rester debout en ecoutant les precieux conseils du ranger',
      '3': 'En reference a l\'interieur de sa bouche',
      '4': 'De griffes semi-retractiles',
      '5': 'Lion, leopard, elephant, rhinoceros et buffle',
      '6': 'Le Kenya',
      '7': 'On accepte aussi fourmis, invertebres et les termites',
      '8': 'Il degage un gaz pour alerter les acacias voisins de la menace',
      '9': 'La vipere heurtante (ou Puff Adder)',
      '10': 'Animal (ou Animalia), Chorde (ou Chordata), Hyenidae, Crocuta'
    }
  },

  // --- Violettes (Savoir / Mature) ---
  {
    cardType: 'standard',
    themeId: 'purple',
    sujet: 'Swift ?',
    questions: {
      '1': 'Lorsqu\'elle consomme trop de guacamole, elle se sent comment ?',
      '2': 'Quelle console de jeux est sortie en 2017 ?',
      '3': 'Quelle marque automobile a sorti une version hybride de la Swift ?',
      '4': 'Citer 5 chansons de Taylor Swift ayant depasse le milliard de vues sur YouTube ?',
      '5': 'Nommer le code SWIFT, quel autre code a 3 lettres est utilise pour decoder le code des devises ?',
      '6': 'De quelle nationalite etait Jonathan Swift, auteur du livre Les Voyages de Gulliver ?',
      '7': 'Si on parle le langage d\'Apple, que signifie Swift ?',
      '8': 'Trouver la franchise dans laquelle Stromile Swift a effectue le plus de saisons en NBA ?',
      '9': 'Quel est le vrai prenom de Taylor Swift ?',
      '10': 'Lorsqu\'on parle de reseau interbancaire, que signifie SWIFT ?'
    },
    answers: {
      '1': 'Vraiment pas',
      '2': 'La Nintendo Switch',
      '3': 'Suzuki',
      '4': 'Shake it off, Blank Space, Bad Blood, Look what you made me do et You Belong with me',
      '5': 'Le code BIC',
      '6': 'Irlandaise',
      '7': 'C\'est un langage de programmation cree par Apple',
      '8': 'Les Memphis Grizzlies',
      '9': 'Alison',
      '10': 'Society for Worldwide Interbank Financial Telecommunication'
    }
  },

  // --- Bleues (Improbable / Divers) ---
  {
    cardType: 'standard',
    themeId: 'blue',
    sujet: 'Les records du monde absurdes',
    questions: {
      '1': 'Existe-t-il un record du monde de lancer de telephone portable ?',
      '2': 'Dans quel pays a ete etabli le record du plus long calin ?',
      '3': 'Combien de temps a dure le plus long hoquet jamais enregistre (en annees) ?',
      '4': 'Quel est le record du monde du plus grand nombre de t-shirts enfiles en meme temps ?',
      '5': 'Quelle distance a parcourue la plus longue domino chain jamais realisee (en km) ?',
      '6': 'En quelle annee Charles Osborne a-t-il commence a hoqueter sans s\'arreter pendant 68 ans ?',
      '7': 'Quel est le record du nombre de personnes deguisees en Schtroumpfs au meme endroit ?',
      '8': 'Combien de hot-dogs Joey Chestnut a-t-il mange en 10 min pour son record de 2021 ?',
      '9': 'Quel est le record de vitesse d\'un lit motorise homologue par le Guinness (en km/h) ?',
      '10': 'Combien de jours a dure le plus long marathon de lecture a voix haute (record Guinness) ?'
    }
  },

  // --- Oranges (Loisirs / Plaisir) ---
  {
    cardType: 'standard',
    themeId: 'orange',
    sujet: 'Fetes foraines ?',
    questions: {
      '1': 'Si la fete de la peche aux canards a la Foire Saint-Romain de Rouen est une attraction, quel type de jouets en plastique ?',
      '2': 'Parmi les activites d\'une fete foraine, la grande roue, les auto-tamponneuses et les montagnes russes ?',
      '3': 'Laquelle de ces activites n\'est pas une attraction foraine : le toboggan, le tir a la carabine ?',
      '4': 'Qu\'obtenaient d\'habitude les enfants au stand des chamboule-tout ?',
      '5': 'Quels sont les 2 principaux ingredients de la barbe a papa ?',
      '6': 'Quel type d\'attraction s\'appelle Anxylos Horror Show au Parc Asterix ?',
      '7': 'Quel prenom, promoteur de la Foire du Trone, est surnomme le PCG Manouche ?',
      '8': 'Trouve la date et le nom de la cite allemande qui a donne naissance a la Foire de Noel ?',
      '9': 'Quel animal a donne son nom au Grand Prix de la Course des Garcons de Cafe ?',
      '10': 'Quel rapport entre le debut d\'un alphabet et le numero d\'un departement francais ?'
    },
    answers: {
      '1': 'Des jouets en plastique',
      '2': 'La grande roue',
      '3': 'Le lanceur de plastique',
      '4': 'Le pompon',
      '5': 'Du sucre et du colorant alimentaire',
      '6': 'Des trains fantomes',
      '7': 'Marcel Champion',
      '8': 'Luxembourg-Ville',
      '9': 'Le chameau',
      '10': 'C\'est la vie'
    }
  },

  // --- Jaune (Celebrites) ---
  {
    cardType: 'standard',
    themeId: 'yellow',
    sujet: 'Cyril Feraud',
    questions: {
      '1': 'Cyril Feraud est connu pour presenter des emissions sur quelle chaine ?',
      '2': 'Quelle emission de jeu Cyril Feraud presente-t-il sur France 3 ?',
      '3': 'Dans quelle emission Cyril Feraud a-t-il ete revele au grand public ?',
      '4': 'En quelle annee Cyril Feraud a-t-il commence a presenter Slam ?',
      '5': 'Dans quelle ville du sud de la France Cyril Feraud est-il ne ?',
      '6': 'Quel diplome Cyril Feraud a-t-il obtenu avant de devenir animateur TV ?',
      '7': 'Avec quel autre animateur a-t-il co-presente le concert des Enfoires ?',
      '8': 'Quelle emission ephemere a-t-il presentee sur France 2 en access prime time ?',
      '9': 'En quelle annee exacte est ne Cyril Feraud ?',
      '10': 'Combien de candidats ont participe a la premiere saison de Slam ?'
    }
  },

  // =================================================================
  // DEBUTER — "Hesite pas a Debuter"
  // =================================================================
  {
    cardType: 'debuter',
    themeId: 'brown',
    title: 'La Fourchette',
    body: 'Designez une personne de chaque equipe.\n\nLa personne imitant le mieux la fourchette debute la partie.',
    footer: 'crrrrriiiiiii',
    titleB: 'Le Pantalon',
    bodyB: 'L\'equipe avec le joueur portant le pantalon (ou short/jupe) le plus moche peut demarrer la partie.',
    footerB: 'Si vous etes tous nus, rhabillez-vous tres vite.'
  },
  {
    cardType: 'debuter',
    themeId: 'brown',
    title: 'Carte Intrepide',
    body: 'Tous les joueurs prennent une carte Intrepide. Le but va etre de faire tenir le plus longtemps la carte en utilisant exclusivement le petit doigt. Vous devez rester immobiles mais pouvez souffler sur vos adversaires.',
    footer: 'Tout le monde est pret ? 3, 2, 1, c\'est parti pour l\'equilibre sur un doigt !',
    titleB: 'Carte Moteur',
    bodyB: 'Le joueur lisant cette carte tire au hasard une carte Moteur et tente de repondre a la question 5. S\'il repond correctement, son equipe peut commencer la partie sur la premiere case du plateau.',
    footerB: 'S\'il repond mal, il choisit l\'equipe qui commence (mais pas la sienne).'
  },

  // =================================================================
  // GAGNER — "Hesite pas a Gagner"
  // =================================================================
  {
    cardType: 'gagner',
    themeId: 'gold',
    subtitle: 'La boite de Jazz',
    body: 'Qu\'est-ce que le depigeonage ?\n\nA. Une pratique visant a se debarrasser des pigeons\nB. Un equivalent haitien de la pinata\nC. Une technique efficace pour enlever les soutiens-gorge\nD. Un groupe de fanatiques de Michel Pigeon\nE. Une methode ou l\'on desapprend ses acquis pour les apprendre de nouveau',
    challengeAnswer: 'Reponse A',
    subtitleB: 'A eviter !',
    bodyB: 'Comment peut-on etre son propre oncle ou sa propre tante ?\n\nTu as 52 secondes pour reflechir a tout ca et donner une reponse.\n\nTout ce qui est demi-soeur, grand-oncle ou beau-pere n\'est pas autorise.',
    challengeAnswerB: 'Si tu te maries avec la tante ou l\'oncle, quel amusant set de noms pour toi !'
  },
  {
    cardType: 'gagner',
    themeId: 'gold',
    subtitle: 'Give Me A Sign',
    body: 'Retrouver 8 des 14 pays de la tournee mondiale de Britney Spears en 2000 et 2001.\n\nOn parle bien sur de la tournee Oops!... I Did It Again Tour.\n\nTu auras le droit a 12 propositions max (donc 4 erreurs max).',
    challengeAnswer: 'Etats-Unis, Canada, Royaume-Uni (Angleterre ou Grande-Bretagne), Allemagne, Belgique, Espagne, Italie, Suisse, Pays-Bas, Suede, Norvege, Danemark, France et Bresil.',
    subtitleB: 'La Fureur',
    bodyB: 'Qu\'est-ce que l\'ippitsuryu, a ton avis ?\n\nA. L\'art de se deguiser en dragon\nB. L\'art de peindre un dragon d\'un seul coup de pinceau\nC. L\'art de raconter les histoires ancestrales des dragons\nD. L\'art d\'imiter un dragon en train de baller\nE. L\'art de dessiner un dragon dans les nuages',
    challengeAnswerB: 'Reponse B'
  },

  // =================================================================
  // INTREPIDE
  // =================================================================
  {
    cardType: 'intrepide',
    themeId: 'darkred',
    title: 'La Tuile',
    body: 'Dommage, tu es tombe sur une tuile.\n\nTu recules de 5 cases sauf si le plus melomane de ton equipe nous chante le refrain de Quelque part de Sheryl Luna.\n\nSi tu y arrives, tu restes sur la meme case et retournes une carte Intrepide au prochain tour, sinon, les 5 cases en arriere t\'attendent !',
    responses: 'Ecris-moi une autre histoire\nT\'es le seul a me comprendre\nEmmene-moi quelque part\nNe me laissez pas surprendre\nInvente-moi un monde a part\nApprends-moi une nouvelle danse\nEmmene-moi quelque part\nBoy, je te fais confiance'
  },
  {
    cardType: 'intrepide',
    themeId: 'darkred',
    title: 'Un Deux Zero',
    body: 'Retrouver le nombre recherche pour chacune de ces propositions.\nLe nombre recherche sera 0, 1 ou 2.\n\nTu avanceras d\'une case par bonne reponse.\n\nA. Le nombre de bras du personnage Lumineo\nB. Le nombre de chaussures apparaissant sur le logo Le Petit Marseillais\nC. Le nombre de pays plus enclaves que la Grece en 2019\nD. Le nombre de des dans le jeu Zombie Kidz\nE. Le nombre de lettres figurant dans l\'alphabet americain mais pas dans l\'alphabet francais\nF. Le nombre de manteaux de donocephalides commercialises a 750 watts',
    responses: 'A. 2\nB. 2\nC. 1 (le Japon)\nD. 1\nE. 0\nF. 1'
  }
];
