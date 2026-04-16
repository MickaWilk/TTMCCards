// ===== sample-cards.js — Données d'exemple inline =====
// Pas de fetch() pour compatibilité file://
// Données issues de cards/bleues.json, cards/jaunes.json, cards/rouges.json

window.SAMPLE_CARDS = [
  // ===== Bleues — Divers / Improbable =====
  {
    themeId: 'blue',
    sujet: 'Les records du monde absurdes',
    questions: {
      '1': 'Existe-t-il un record du monde de lancer de téléphone portable ?',
      '2': 'Dans quel pays a été établi le record du plus long câlin ?',
      '3': 'Combien de temps a duré le plus long hoquet jamais enregistré (en années) ?',
      '4': 'Quel est le record du monde du plus grand nombre de t-shirts enfilés en même temps ?',
      '5': 'Quelle distance a parcourue la plus longue domino chain jamais réalisée (en km) ?',
      '6': 'En quelle année Charles Osborne a-t-il commencé à hoqueter sans s\'arrêter pendant 68 ans ?',
      '7': 'Quel est le record du nombre de personnes déguisées en Schtroumpfs au même endroit ?',
      '8': 'Combien de hot-dogs Joey Chestnut a-t-il mangé en 10 min pour son record de 2021 ?',
      '9': 'Quel est le record de vitesse d\'un lit motorisé homologué par le Guinness (en km/h) ?',
      '10': 'Combien de jours a duré le plus long marathon de lecture à voix haute (record Guinness) ?'
    }
  },
  {
    themeId: 'blue',
    sujet: 'Les lois les plus bizarres',
    questions: {
      '1': 'Vrai ou faux : en Suisse, il est interdit de tirer la chasse d\'eau après 22h dans un appartement ?',
      '2': 'Dans quel pays est-il illégal de marcher sur les billets de banque ?',
      '3': 'Dans quel État américain est-il interdit de porter des fausses moustaches à l\'église ?',
      '4': 'Quel animal est-il interdit de promener sans laisse à Venise ?',
      '5': 'Dans quelle ville française est-il techniquement interdit de mourir par arrêté municipal ?',
      '6': 'En Angleterre, quelle loi de 1313 interdit de porter une armure au Parlement ?',
      '7': 'Dans quel pays est-il obligatoire de sourire en public sauf lors des funérailles ?',
      '8': 'Quel article du Code civil français interdisait aux femmes de porter un pantalon jusqu\'en 2013 ?',
      '9': 'En Australie, quelle loi interdit de changer une ampoule si on n\'est pas électricien agréé ?',
      '10': 'Dans quel État américain une loi de 1897 a failli changer la valeur de Pi à 3,2 ?'
    }
  },
  {
    themeId: 'blue',
    sujet: 'Les inventions complètement ratées',
    questions: {
      '1': 'Le Segway était censé révolutionner quoi : le transport ou la cuisine ?',
      '2': 'Quel géant de la tech a sorti les Google Glass, retirées pour manque de succès ?',
      '3': 'Comment s\'appelait le réseau social de Google qui a fermé en 2019 ?',
      '4': 'Quel format vidéo de Sony a perdu la guerre contre le VHS dans les années 80 ?',
      '5': 'Comment s\'appelait la console de jeu d\'Apple sortie en 1996 ?',
      '6': 'Quel téléphone Microsoft/Nokia tournait sous Windows Phone et a été un échec commercial ?',
      '7': 'En quelle année le Concorde a-t-il effectué son dernier vol commercial ?',
      '8': 'Comment s\'appelait la tablette de Microsoft sortie en 2002, bien avant l\'iPad ?',
      '9': 'Quel projet de dirigeable de la NASA des années 2000 devait remplacer les satellites ?',
      '10': 'Comment s\'appelait le système de vidéodisque de RCA lancé en 1981, abandonné après 2 ans ?'
    }
  },

  // ===== Jaunes — Personnages / Célébrités =====
  {
    themeId: 'yellow',
    sujet: 'Cyril Féraud',
    questions: {
      '1': 'Cyril Féraud est connu pour présenter des émissions sur quelle chaîne ?',
      '2': 'Quelle émission de jeu Cyril Féraud présente-t-il sur France 3 ?',
      '3': 'Dans quelle émission Cyril Féraud a-t-il été révélé au grand public ?',
      '4': 'En quelle année Cyril Féraud a-t-il commencé à présenter Slam ?',
      '5': 'Dans quelle ville du sud de la France Cyril Féraud est-il né ?',
      '6': 'Quel diplôme Cyril Féraud a-t-il obtenu avant de devenir animateur TV ?',
      '7': 'Avec quel autre animateur a-t-il co-présenté le concert des Enfoirés ?',
      '8': 'Quelle émission éphémère a-t-il présentée sur France 2 en access prime time ?',
      '9': 'En quelle année exacte est né Cyril Féraud ?',
      '10': 'Combien de candidats ont participé à la première saison de Slam ?'
    }
  },
  {
    themeId: 'yellow',
    sujet: 'Les présidents français',
    questions: {
      '1': 'Qui est le président actuel de la République française ?',
      '2': 'Combien de temps dure un mandat présidentiel en France ?',
      '3': 'Qui était président avant Emmanuel Macron ?',
      '4': 'Quel président a instauré la Ve République ?',
      '5': 'Quel président a aboli la peine de mort en France ?',
      '6': 'Qui est le seul président de la Ve République à n\'avoir fait qu\'un seul mandat de 7 ans ?',
      '7': 'En quelle année le mandat présidentiel est-il passé de 7 à 5 ans ?',
      '8': 'Qui fut le plus jeune président de la Ve République au moment de son élection ?',
      '9': 'Combien de présidents la Ve République a-t-elle compté au total (en 2024) ?',
      '10': 'Quel pourcentage exact des voix Jacques Chirac a-t-il obtenu au second tour en 2002 ?'
    }
  },
  {
    themeId: 'yellow',
    sujet: 'Les Youtubeurs français',
    questions: {
      '1': 'Quel Youtubeur français est connu pour ses vidéos "Bref." ?',
      '2': 'Comment s\'appelle la chaîne de Squeezie ?',
      '3': 'Quel Youtubeur est célèbre pour ses tests de produits et ses "C\'est pas sorcier" modernes ?',
      '4': 'Comment s\'appelle le duo derrière la chaîne McFly et Carlito ?',
      '5': 'Quel Youtubeur a créé le format "Point Culture" ?',
      '6': 'En quelle année Squeezie a-t-il créé sa chaîne YouTube ?',
      '7': 'Quel Youtubeur français a été le premier à dépasser les 10 millions d\'abonnés ?',
      '8': 'Comment s\'appelle l\'événement caritatif créé par ZEvent ?',
      '9': 'Combien de millions d\'euros le ZEvent 2021 a-t-il récolté ?',
      '10': 'Quel Youtubeur français détient le record du plus grand nombre de vues sur une seule vidéo en France ?'
    }
  },

  // ===== Rouges — Pop Culture =====
  {
    themeId: 'red',
    sujet: 'Dragon Ball',
    questions: {
      '1': 'Comment s\'appelle le héros principal de Dragon Ball ?',
      '2': 'De quelle couleur sont les cheveux d\'un Super Saiyen ?',
      '3': 'Comment s\'appelle le meilleur ami de Goku depuis l\'enfance ?',
      '4': 'Combien de Dragon Balls faut-il réunir pour invoquer Shenron ?',
      '5': 'Comment s\'appelle la technique signature de Goku (vague d\'énergie) ?',
      '6': 'Quel est le vrai nom Saiyen de Goku ?',
      '7': 'Comment s\'appelle le fils aîné de Goku ?',
      '8': 'En quelle année le premier manga Dragon Ball a-t-il été publié au Japon ?',
      '9': 'Quel est le niveau de puissance de Goku lors de son combat contre Freezer sur Namek ?',
      '10': 'Comment s\'appelle la technique d\'arts martiaux utilisée par le Maître des Grues (Tsuru Sennin) ?'
    }
  },
  {
    themeId: 'red',
    sujet: 'Pokémon',
    questions: {
      '1': 'Comment s\'appelle le Pokémon jaune mascotte de la franchise ?',
      '2': 'Quel est le starter de type Feu de la première génération ?',
      '3': 'Comment s\'appelle le dresseur principal dans l\'anime Pokémon ?',
      '4': 'Combien de Pokémon comptait le Pokédex de la première génération ?',
      '5': 'Quel type est super efficace contre le type Eau ?',
      '6': 'En quelle année les premiers jeux Pokémon sont-ils sortis au Japon ?',
      '7': 'Comment s\'appelle le Pokémon n\u00b0150 dans le Pokédex original ?',
      '8': 'Quel Pokémon légendaire orne la couverture de Pokémon Or ?',
      '9': 'Combien de générations de Pokémon existent au total (en 2024) ?',
      '10': 'Quel est le Pokémon ayant le plus haut total de stats de base toutes générations confondues ?'
    }
  },
  {
    themeId: 'red',
    sujet: 'Les films Marvel (MCU)',
    questions: {
      '1': 'Quel super-héros porte une armure rouge et or ?',
      '2': 'Comment s\'appelle le méchant violet qui collecte les Pierres d\'Infinité ?',
      '3': 'Quel film a lancé le MCU en 2008 ?',
      '4': 'Comment s\'appelle le marteau de Thor ?',
      '5': 'Dans quel film les Avengers se réunissent-ils pour la première fois ?',
      '6': 'Combien de Pierres d\'Infinité existe-t-il au total ?',
      '7': 'Quel acteur incarne Doctor Strange ?',
      '8': 'Dans quel film du MCU apparaît Spider-Man pour la première fois ?',
      '9': 'Combien de films composent la saga de l\'Infinité (Infinity Saga) ?',
      '10': 'Quel est le montant exact du box-office mondial d\'Avengers: Endgame en milliards de dollars ?'
    }
  }
];
