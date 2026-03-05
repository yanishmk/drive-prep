import type { Difficulty, Question, QuestionIllustration } from "@/lib/permis/types";

export const EASY_IDS = [
  "Q001",
  "Q002",
  "Q006",
  "Q007",
  "Q011",
  "Q012",
  "Q017",
  "Q020",
  "Q025",
  "Q026",
  "Q029",
  "Q031",
  "Q036",
  "Q037",
  "Q046",
  "Q051",
  "Q052",
  "Q054",
  "Q060",
  "Q063",
  "Q064",
  "Q068",
  "Q073",
  "Q081",
  "Q083",
  "Q085",
  "Q087",
  "Q091",
  "Q094",
  "Q096",
  "Q104",
  "Q110",
  "Q111",
  "Q112",
  "Q114",
  "Q115",
  "Q116",
  "Q119",
  "Q121",
  "Q123",
  "Q125",
  "Q126",
  "Q130",
  "Q131",
  "Q136",
  "Q137",
  "Q141",
  "Q142",
  "Q144",
  "Q148",
  "Q151",
  "Q152",
  "Q158",
  "Q159",
  "Q162",
  "Q163",
  "Q164",
  "Q167",
  "Q170",
  "Q172",
  "Q173",
  "Q177",
  "Q180",
  "Q181",
  "Q182",
  "Q185",
  "Q188",
  "Q190",
  "Q191",
  "Q192",
  "Q193",
  "Q194",
  "Q195",
] as const;

export const MEDIUM_IDS = [
  "Q003",
  "Q004",
  "Q008",
  "Q010",
  "Q013",
  "Q014",
  "Q015",
  "Q016",
  "Q018",
  "Q021",
  "Q023",
  "Q027",
  "Q028",
  "Q032",
  "Q033",
  "Q038",
  "Q041",
  "Q042",
  "Q045",
  "Q047",
  "Q048",
  "Q053",
  "Q055",
  "Q056",
  "Q059",
  "Q061",
  "Q065",
  "Q066",
  "Q067",
  "Q069",
  "Q071",
  "Q074",
  "Q075",
  "Q076",
  "Q078",
  "Q079",
  "Q082",
  "Q084",
  "Q086",
  "Q092",
  "Q093",
  "Q097",
  "Q099",
  "Q102",
  "Q105",
  "Q106",
  "Q107",
  "Q108",
  "Q113",
  "Q117",
  "Q118",
  "Q120",
  "Q124",
  "Q127",
  "Q128",
  "Q133",
  "Q135",
  "Q138",
  "Q143",
  "Q145",
  "Q146",
  "Q147",
  "Q149",
  "Q150",
  "Q153",
  "Q154",
  "Q156",
  "Q157",
  "Q161",
  "Q165",
  "Q166",
  "Q168",
  "Q171",
  "Q174",
  "Q175",
  "Q176",
  "Q178",
  "Q179",
  "Q183",
  "Q186",
  "Q187",
  "Q189",
  "Q196",
  "Q197",
  "Q199",
  "Q201",
] as const;

export const HARD_IDS = [
  "Q005",
  "Q009",
  "Q019",
  "Q022",
  "Q024",
  "Q030",
  "Q034",
  "Q035",
  "Q039",
  "Q040",
  "Q043",
  "Q044",
  "Q049",
  "Q050",
  "Q057",
  "Q058",
  "Q062",
  "Q070",
  "Q072",
  "Q077",
  "Q080",
  "Q088",
  "Q089",
  "Q090",
  "Q095",
  "Q098",
  "Q100",
  "Q101",
  "Q103",
  "Q109",
  "Q122",
  "Q129",
  "Q132",
  "Q134",
  "Q139",
  "Q140",
  "Q155",
  "Q160",
  "Q169",
  "Q184",
  "Q200",
] as const;

const categoryById: Record<string, string> = {
  Q001: "Signalisation",
  Q002: "Signalisation",
  Q003: "Signalisation",
  Q004: "Signalisation",
  Q005: "Signalisation",
  Q006: "Signalisation",
  Q007: "Signalisation",
  Q008: "Signalisation",
  Q009: "Signalisation",
  Q010: "Signalisation",
  Q011: "Vitesse",
  Q012: "Vitesse",
  Q013: "Zone scolaire",
  Q014: "Securite",
  Q015: "Securite",
  Q016: "Depassement",
  Q017: "Depassement",
  Q018: "Depassement",
  Q019: "Depassement",
  Q020: "Depassement",
  Q021: "Priorite",
  Q022: "Circulation",
  Q023: "Circulation",
  Q024: "Signalisation",
  Q025: "Circulation",
  Q026: "Priorite",
  Q027: "Priorite",
  Q028: "Signalisation",
  Q029: "Signalisation",
  Q030: "Securite",
  Q031: "Priorite",
  Q032: "Priorite",
  Q033: "Priorite",
  Q034: "Priorite",
  Q035: "Priorite",
  Q036: "Transport scolaire",
  Q037: "Transport scolaire",
  Q038: "Transport scolaire",
  Q039: "Transport scolaire",
  Q040: "Passage a niveau",
  Q041: "Securite",
  Q042: "Securite",
  Q043: "Securite",
  Q044: "Securite",
  Q045: "Securite",
  Q046: "Zone de travaux",
  Q047: "Zone de travaux",
  Q048: "Zone de travaux",
  Q049: "Urgence",
  Q050: "Urgence",
  Q051: "Signalisation",
  Q052: "Signalisation",
  Q053: "Signalisation",
  Q054: "Signalisation",
  Q055: "Signalisation",
  Q056: "Signalisation",
  Q057: "Signalisation",
  Q058: "Signalisation",
  Q059: "Circulation",
  Q060: "Circulation",
  Q061: "Circulation",
  Q062: "Circulation",
  Q063: "Circulation",
  Q064: "Circulation",
  Q065: "Signalisation",
  Q066: "Securite",
  Q067: "Securite",
  Q068: "Depassement",
  Q069: "Priorite",
  Q070: "Depassement",
  Q071: "Priorite",
  Q072: "Passage a niveau",
  Q073: "Zone partagee",
  Q074: "Cyclistes",
  Q075: "Cyclistes",
  Q076: "Securite",
  Q077: "Securite",
  Q078: "Zone de travaux",
  Q079: "Zone de travaux",
  Q080: "Urgence",
  Q081: "Permis",
  Q082: "Permis",
  Q083: "Permis",
  Q084: "Permis",
  Q085: "Permis",
  Q086: "Permis",
  Q087: "Permis",
  Q088: "Permis",
  Q089: "Permis",
  Q090: "Permis",
  Q091: "Infractions",
  Q092: "Infractions",
  Q093: "Infractions",
  Q094: "Infractions",
  Q095: "Infractions",
  Q096: "Securite",
  Q097: "Securite",
  Q098: "Securite",
  Q099: "Securite",
  Q100: "Infractions",
  Q101: "Infractions",
  Q102: "Securite",
  Q103: "Securite",
  Q104: "Securite",
  Q105: "Securite",
  Q106: "Securite",
  Q107: "Securite",
  Q108: "Priorite",
  Q109: "Securite",
  Q110: "Securite",
  Q161: "Signalisation",
};

const CATEGORY_SITUATIONS: Record<string, string[]> = {
  Signalisation: [
    "A l approche d une intersection, le feu passe au jaune.",
    "Vous arrivez devant un feu rouge clignotant accompagne d un panneau Arret.",
    "Une ligne d arret et un passage pieton sont traces devant vous.",
  ],
  Vitesse: [
    "Vous circulez sur une route dont la limite est affichee.",
    "La route est libre, mais la chaussee devient glissante.",
    "Le trafic roule vite autour de vous.",
  ],
  "Zone scolaire": [
    "Vous entrez dans une zone scolaire signalee.",
    "Des enfants peuvent traverser de facon imprevisible.",
    "La circulation est dense pres d une ecole.",
  ],
  Securite: [
    "La visibilite baisse a cause de la meteo.",
    "Vous suivez un vehicule qui peut freiner brusquement.",
    "Plusieurs usagers vulnerables circulent pres de la chaussee.",
  ],
  Depassement: [
    "Vous rattrapez un vehicule lent sur une route a double sens.",
    "Un cycliste circule devant vous et l espace lateral est limite.",
    "Un autre conducteur derriere semble vouloir depasser au meme moment.",
  ],
  Priorite: [
    "Plusieurs vehicules convergent vers la meme intersection.",
    "Un pieton manifeste clairement son intention de traverser.",
    "Vous devez tourner alors qu un usager est deja engage.",
  ],
  Circulation: [
    "Vous devez choisir votre voie avant un carrefour.",
    "Une voie se termine a l approche d une intersection.",
    "Vous avez manque la voie prevue pour votre virage.",
  ],
  "Transport scolaire": [
    "Un autobus scolaire active ses feux rouges intermittents.",
    "Le panneau d arret obligatoire de l autobus est deploye.",
    "Des eleves sont a proximite de l autobus scolaire.",
  ],
  "Passage a niveau": [
    "Des feux rouges clignotent au passage a niveau.",
    "Le trafic ralentit fortement juste avant les rails.",
    "Vous approchez un passage a niveau avec peu d espace devant.",
  ],
  "Zone de travaux": [
    "Des panneaux orange annoncent un chantier.",
    "La voie se retrecit en zone de travaux.",
    "Un signaleur dirige temporairement la circulation.",
  ],
  Urgence: [
    "Un vehicule d urgence est immobilise avec signaux actifs.",
    "Une ambulance approche avec signaux sonores et lumineux.",
    "Vous devez laisser un corridor de securite.",
  ],
  "Zone partagee": [
    "Vous entrez dans une rue partagee.",
    "Des pietons occupent une grande partie de la chaussee.",
    "La signalisation de zone partagee est active.",
  ],
  Cyclistes: [
    "Un cycliste roule devant vous sur une voie etroite.",
    "Vous souhaitez depasser un groupe de cyclistes.",
    "Une bande cyclable est active pendant votre virage.",
  ],
  Permis: [
    "Vous etes en parcours d acces graduel au permis.",
    "Votre statut de permis impose une restriction legale.",
    "Une condition de permis limite votre conduite.",
  ],
  Infractions: [
    "Une manoeuvre rapide pourrait entrainer des points d inaptitude.",
    "Une regle semble mineure, mais la sanction est reelle.",
    "Vous etes tente de ne pas respecter une obligation legale.",
  ],
};

const CATEGORY_CORRECT_ACTION: Record<string, string> = {
  Signalisation:
    "Vous arretez au bon endroit et repartez seulement quand la priorite est etablie.",
  Vitesse:
    "Vous respectez la limite affichee et reduisez encore si les conditions l imposent.",
  "Zone scolaire":
    "Vous ralentissez strictement et restez pret a freiner.",
  Securite:
    "Vous augmentez votre distance de securite et adaptez votre allure.",
  Depassement:
    "Vous ne depassez qu avec voie libre, signalement et distance laterale suffisante.",
  Priorite:
    "Vous cedez le passage a l usager prioritaire avant de vous engager.",
  Circulation:
    "Vous restez dans la bonne voie et reportez la manoeuvre si vous etes mal place.",
  "Transport scolaire":
    "Vous vous immobilisez selon la regle des autobus scolaires et attendez la fin des signaux.",
  "Passage a niveau":
    "Vous ne vous engagez que si le franchissement complet est possible sans blocage.",
  "Zone de travaux":
    "Vous ralentissez, gardez de l espace et suivez toute la signalisation temporaire.",
  Urgence:
    "Vous creez un corridor de securite en changeant de voie ou en ralentissant fortement.",
  "Zone partagee":
    "Vous roulez tres lentement et laissez la priorite aux pietons.",
  Cyclistes:
    "Vous respectez la distance laterale reglementaire et attendez si l espace manque.",
  Permis:
    "Vous appliquez integralement les conditions de votre type de permis.",
  Infractions:
    "Vous respectez strictement la regle legale, meme sans controle visible.",
};

const CATEGORY_WRONG_ACTIONS: Record<string, string[]> = {
  Signalisation: [
    "Vous accelerez pour franchir l intersection avant les autres.",
    "Vous avancez sans arret complet parce que la route semble vide.",
    "Vous suivez simplement le vehicule devant sans verifier.",
    "Vous depassez la ligne d arret pour gagner du temps.",
  ],
  Vitesse: [
    "Vous conservez la vitesse maximale meme sur chaussee glissante.",
    "Vous roulez au rythme du conducteur le plus rapide.",
    "Vous accelerez pour sortir plus vite de la zone.",
    "Vous ignorez la limite puisqu il n y a pas de controle visible.",
  ],
  Depassement: [
    "Vous depassez par la droite pour gagner du temps.",
    "Vous depassez en roulant sur l accotement.",
    "Vous commencez sans clignotant.",
    "Vous forcez la manoeuvre sans distance laterale suffisante.",
  ],
  Priorite: [
    "Vous vous imposez parce que vous etes deja presque engage.",
    "Vous klaxonnez puis avancez en premier.",
    "Vous coupez la trajectoire du pieton pour tourner.",
    "Vous ignorez le contact visuel d un usager prioritaire.",
  ],
  Securite: [
    "Vous suivez de tres pres pour eviter qu un autre vehicule s insere.",
    "Vous gardez la meme distance qu en conditions ideales.",
    "Vous freinez tard pour conserver le rythme.",
    "Vous comptez uniquement sur les aides electroniques.",
  ],
};

const COMMON_WRONG_ACTIONS = [
  "Vous changez de voie sans signaler.",
  "Vous privilegiez la rapidite au lieu de la regle.",
  "Vous ignorez le marquage parce que la route semble libre.",
  "Vous improvisez une manoeuvre au dernier moment.",
  "Vous avancez sans verification finale.",
];

const DIRECT_PROMPTS = [
  "Que devez-vous faire?",
  "Quelle action est correcte?",
  "Quelle est la bonne decision?",
  "Quel comportement est conforme a la regle?",
  "Quelle reponse est correcte?",
  "Quelle option choisissez-vous?",
  "Que doit faire le conducteur?",
  "Quel choix est autorise?",
  "Quel choix est interdit?",
  "Quelle manoeuvre faut-il eviter?",
  "Quelle conduite adoptez-vous?",
  "Quelle action prenez-vous immediatement?",
  "Que faites-vous dans cette situation?",
  "Quelle est la meilleure action?",
  "Quel est le bon choix?",
  "Quelle action reste obligatoire?",
  "Quelle option est conforme au Code routier?",
];

const DIRECT_SUFFIXES = [
  "",
];

const EXPLANATION_HINTS = [
  "L erreur frequente est de vouloir gagner du temps au lieu de gerer la priorite.",
  "L erreur typique est de suivre les autres sans refaire ses propres verifications.",
  "L erreur courante est de sous-estimer le risque des usagers vulnerables.",
  "L erreur classique est de confondre route libre et manoeuvre autorisee.",
];

const ESSENTIAL_QUESTIONS: Question[] = [
  {
    id: "Q111",
    question: "En ville, quelle distance minimale devez-vous garder derriere le vehicule qui vous precede en conditions normales?",
    options: [
      "4 secondes ou plus",
      "2 secondes",
      "6 secondes",
      "Une longueur de vehicule seulement",
    ],
    correctOptionIndex: 0,
    explanation:
      "En ville, la regle de base est un intervalle d au moins 4 secondes en conditions normales.",
    difficulty: "facile",
    category: "Securite",
  },
  {
    id: "Q112",
    question: "Sur une route a circulation rapide, quelle distance minimale devez-vous garder derriere le vehicule devant vous en conditions normales?",
    options: [
      "6 secondes ou plus",
      "3 secondes",
      "4 secondes",
      "2 secondes",
    ],
    correctOptionIndex: 0,
    explanation:
      "Sur une route rapide, la distance minimale recommandee est d au moins 6 secondes.",
    difficulty: "facile",
    category: "Securite",
  },
  {
    id: "Q113",
    question: "Sur chaussee glacee ou enneigee, quel intervalle de securite est recommande derriere le vehicule qui vous precede?",
    options: [
      "8 a 10 secondes ou plus",
      "4 secondes",
      "2 secondes",
      "3 secondes maximum",
    ],
    correctOptionIndex: 0,
    explanation:
      "En hiver, la distance de freinage augmente fortement. Un intervalle de 8 a 10 secondes est recommande.",
    difficulty: "moyenne",
    category: "Securite",
  },
  {
    id: "Q114",
    question: "A l arret derriere un autre vehicule, quelle distance de securite devez-vous conserver?",
    options: [
      "Environ une longueur de vehicule, pour voir les pneus arriere du vehicule devant",
      "Coller le vehicule devant pour laisser plus d espace derriere",
      "Aucun espace si le frein est maintenu",
      "Un demi-metre suffit",
    ],
    correctOptionIndex: 0,
    explanation:
      "La distance d arret recommandee est d environ une longueur de vehicule (environ 5 m).",
    difficulty: "facile",
    category: "Securite",
  },
  {
    id: "Q115",
    question: "Avant de traverser une intersection, quelle sequence de verification visuelle est recommandee?",
    options: [
      "Gauche, droite, puis gauche",
      "Droite, gauche, puis droite",
      "Seulement a gauche",
      "Seulement devant",
    ],
    correctOptionIndex: 0,
    explanation:
      "La verification gauche-droite-gauche aide a detecter les risques avant de s engager.",
    difficulty: "facile",
    category: "Priorite",
  },
  {
    id: "Q116",
    question: "Dans une intersection, quelle manoeuvre est interdite?",
    options: [
      "Changer de voie dans l intersection",
      "Ceder le passage a un pieton",
      "Regarder dans les retroviseurs avant de s engager",
      "Ralentir avant de tourner",
    ],
    correctOptionIndex: 0,
    explanation:
      "Changer de voie dans l intersection augmente les conflits et est interdit.",
    difficulty: "facile",
    category: "Circulation",
  },
  {
    id: "Q117",
    question: "Pour effectuer un virage a droite a une intersection, dans quelle voie devez-vous vous placer avant de tourner?",
    options: [
      "Dans la voie d extreme droite",
      "Dans n importe quelle voie si vous signalez",
      "Dans la voie de gauche",
      "Sur l accotement",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le placement correct pour un virage a droite est la voie d extreme droite, sauf signalisation contraire.",
    difficulty: "moyenne",
    category: "Circulation",
  },
  {
    id: "Q118",
    question: "Sur une route a plusieurs voies dans la meme direction, vous devez traverser deux voies pour votre sortie. Quelle conduite est correcte?",
    options: [
      "Changer de voie par etapes, une voie a la fois",
      "Couper directement deux voies d un seul mouvement",
      "Freiner fort au centre de la voie et attendre",
      "Rouler sur l accotement pour rejoindre la sortie",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le changement de voie doit se faire progressivement, une voie a la fois.",
    difficulty: "moyenne",
    category: "Circulation",
  },
  {
    id: "Q119",
    question: "En entrant sur une autoroute par une bretelle d acces, a qui devez-vous ceder le passage?",
    options: [
      "Aux vehicules qui circulent deja sur l autoroute",
      "Aux vehicules qui arrivent derriere vous dans la bretelle",
      "Aux vehicules qui sortent de l autoroute",
      "Personne, la voie d acceleration donne priorite",
    ],
    correctOptionIndex: 0,
    explanation:
      "La priorite revient aux vehicules deja engages sur l autoroute.",
    difficulty: "facile",
    category: "Circulation",
  },
  {
    id: "Q120",
    question: "Dans la voie d acceleration d une autoroute, quelle est la meilleure pratique?",
    options: [
      "Utiliser la voie d acceleration pour ajuster votre vitesse avant l insertion",
      "Ralentir fortement des le debut de la voie d acceleration",
      "S arreter a l entree et attendre une autorisation",
      "S inserer immediatement sans verifier l angle mort",
    ],
    correctOptionIndex: 0,
    explanation:
      "La voie d acceleration sert a atteindre une vitesse compatible avec le trafic avant l insertion.",
    difficulty: "moyenne",
    category: "Circulation",
  },
  {
    id: "Q121",
    question: "Apres un depassement sur autoroute, quelle voie devez-vous reprendre en general?",
    options: [
      "La voie de droite",
      "La voie de gauche en permanence",
      "La voie du centre meme si elle est libre",
      "L accotement de droite",
    ],
    correctOptionIndex: 0,
    explanation:
      "La voie de gauche est reservee au depassement; il faut revenir a droite apres la manoeuvre.",
    difficulty: "facile",
    category: "Depassement",
  },
  {
    id: "Q122",
    question: "Quel comportement constitue une infraction de depassement?",
    options: [
      "Effectuer plusieurs depassements successifs en zigzag",
      "Revenir a droite apres un depassement",
      "Signaler son intention avant de changer de voie",
      "Verifier ses angles morts avant la manoeuvre",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le zigzag entre les voies est une manoeuvre dangereuse et sanctionnee.",
    difficulty: "difficile",
    category: "Depassement",
  },
  {
    id: "Q123",
    question: "Quelle distance laterale minimale faut-il laisser en depassant un cycliste?",
    options: [
      "1 m si la limite est de 50 km/h ou moins, 1,5 m au-dela",
      "Toujours 0,5 m",
      "Toujours 1 m, peu importe la zone",
      "Aucune distance precise n est prevue",
    ],
    correctOptionIndex: 0,
    explanation:
      "La distance minimale depend de la limite de vitesse: 1 m ou 1,5 m.",
    difficulty: "facile",
    category: "Cyclistes",
  },
  {
    id: "Q124",
    question: "Avant d ouvrir la portiere d un vehicule stationne en bordure, que devez-vous faire?",
    options: [
      "Verifier le retroviseur puis l angle mort pour eviter l emportierage",
      "Ouvrir rapidement pour sortir avant les autres usagers",
      "Klaxonner puis ouvrir sans verifier",
      "Ouvrir de moitie et attendre que quelqu un previenne",
    ],
    correctOptionIndex: 0,
    explanation:
      "La verification retroviseur + angle mort est essentielle pour eviter de heurter un cycliste.",
    difficulty: "moyenne",
    category: "Cyclistes",
  },
  {
    id: "Q125",
    question: "A un passage pour pietons, vous devez vous arreter lorsque:",
    options: [
      "Le pieton s engage ou manifeste clairement son intention de traverser",
      "Le pieton est deja au milieu de la rue uniquement",
      "Le pieton fait uniquement un signe de la main",
      "Vous voyez un agent de la paix sur place",
    ],
    correctOptionIndex: 0,
    explanation:
      "La priorite s applique des qu un pieton s engage ou manifeste clairement son intention.",
    difficulty: "facile",
    category: "Priorite",
  },
  {
    id: "Q126",
    question: "La nuit, a partir de quelle distance devez-vous passer aux feux de croisement quand vous suivez ou croisez un vehicule?",
    options: [
      "150 metres",
      "50 metres",
      "300 metres",
      "Aucune distance n est prevue",
    ],
    correctOptionIndex: 0,
    explanation:
      "La regle de 150 m vise a eviter l eblouissement des autres conducteurs.",
    difficulty: "facile",
    category: "Signalisation",
  },
  {
    id: "Q127",
    question: "Un vehicule vous suit de trop pres. Quelle est la meilleure conduite preventive?",
    options: [
      "Augmenter votre espace a l avant et laisser passer des que possible",
      "Freiner brusquement pour lui donner une lecon",
      "Accelerer pour creuser l ecart rapidement",
      "Rester colle au vehicule devant pour bloquer le trafic",
    ],
    correctOptionIndex: 0,
    explanation:
      "Augmenter la marge devant vous reduit le risque et facilite un depassement securitaire.",
    difficulty: "moyenne",
    category: "Securite",
  },
  {
    id: "Q128",
    question: "Quel est le meilleur reflexe des premiers signes de fatigue au volant?",
    options: [
      "S arreter pour se reposer des que possible",
      "Ouvrir la fenetre et continuer longtemps",
      "Monter le volume de la musique et accelerer",
      "Boire un cafe puis ignorer les signes",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le repos reste la strategie la plus efficace contre la somnolence au volant.",
    difficulty: "moyenne",
    category: "Securite",
  },
  {
    id: "Q129",
    question: "Vous etes immobilise au feu rouge. L usage d un telephone tenu en main est:",
    options: [
      "Interdit, car vous etes toujours considere en conduite",
      "Permis si le vehicule est completement arrete",
      "Permis uniquement pour lire un message rapide",
      "Permis si personne n est a cote",
    ],
    correctOptionIndex: 0,
    explanation:
      "Attendre a un feu rouge ne retire pas l etat de conduite; le telephone tenu en main est interdit.",
    difficulty: "difficile",
    category: "Infractions",
  },
  {
    id: "Q130",
    question: "Pour un conducteur de 21 ans ou moins, quelle regle alcool s applique?",
    options: [
      "Tolerance zero alcool",
      "Tolerance jusqu a 0,05",
      "Tolerance jusqu a 0,08",
      "Aucune regle specifique",
    ],
    correctOptionIndex: 0,
    explanation:
      "Les conducteurs de 21 ans ou moins sont soumis a la regle du zero alcool.",
    difficulty: "facile",
    category: "Permis",
  },
  {
    id: "Q131",
    question: "Concernant la conduite et les drogues, quelle affirmation est correcte?",
    options: [
      "Tous les conducteurs sont soumis a la regle du zero drogue",
      "La regle s applique seulement aux nouveaux conducteurs",
      "La regle s applique uniquement aux conducteurs professionnels",
      "La regle ne s applique qu en ville",
    ],
    correctOptionIndex: 0,
    explanation:
      "La regle du zero drogue s applique a tous les conducteurs.",
    difficulty: "facile",
    category: "Securite",
  },
  {
    id: "Q132",
    question: "En brouillard epais, quel type d eclairage devez-vous privilegier?",
    options: [
      "Les feux de croisement (et antibrouillard si disponibles)",
      "Les feux de route",
      "Aucun phare pour eviter les reflets",
      "Seulement les feux de detresse en roulant",
    ],
    correctOptionIndex: 0,
    explanation:
      "Les feux de route creent un ecran lumineux dans le brouillard; les feux de croisement offrent une meilleure visibilite.",
    difficulty: "difficile",
    category: "Signalisation",
  },
  {
    id: "Q133",
    question: "Sur surface glissante, quelle conduite est recommandee?",
    options: [
      "Eviter les changements brusques de direction et de vitesse",
      "Freiner fort pour stabiliser le vehicule",
      "Accelerer pour sortir vite de la zone",
      "Utiliser constamment le regulateur de vitesse",
    ],
    correctOptionIndex: 0,
    explanation:
      "Les gestes brusques sur surface glissante augmentent le risque de derapage.",
    difficulty: "moyenne",
    category: "Securite",
  },
  {
    id: "Q134",
    question: "Votre vehicule est equipe d ABS et vous devez freiner d urgence. Que faire?",
    options: [
      "Appuyer a fond et garder une pression ferme sur la pedale",
      "Pomper rapidement la pedale de frein",
      "Freiner legerement puis relacher completement",
      "Actionner le frein de stationnement",
    ],
    correctOptionIndex: 0,
    explanation:
      "Avec ABS, il faut maintenir une pression ferme; le systeme gere le blocage/deblocage des roues.",
    difficulty: "difficile",
    category: "Securite",
  },
  {
    id: "Q135",
    question: "En zone de travaux, un signaleur vous donne une instruction contraire a l habitude de circulation. Que devez-vous faire?",
    options: [
      "Obeir au signaleur",
      "Suivre uniquement les vehicules devant vous",
      "Ignorer le signaleur si vous etes sur la voie principale",
      "Vous immobiliser et attendre un autre conducteur",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le signaleur dirige la circulation selon les risques immediats du chantier.",
    difficulty: "moyenne",
    category: "Zone de travaux",
  },
  {
    id: "Q136",
    question: "Un autobus scolaire a ses feux rouges intermittents actifs. A quelle distance minimale devez-vous vous immobiliser?",
    options: [
      "A plus de 5 metres",
      "A 1 metre",
      "A 2 metres",
      "Aucune distance precise",
    ],
    correctOptionIndex: 0,
    explanation:
      "La distance minimale d arret est superieure a 5 m pour proteger les eleves.",
    difficulty: "facile",
    category: "Transport scolaire",
  },
  {
    id: "Q137",
    question: "Lors d un arret a une intersection, quel comportement est interdit?",
    options: [
      "S immobiliser sur la ligne d arret ou dans le passage pieton",
      "Freiner progressivement",
      "Verifier la circulation arriere avant l arret",
      "Maintenir le pied sur la pedale de frein une fois arrete",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le vehicule doit s immobiliser avant la ligne d arret et laisser libre le passage pieton.",
    difficulty: "facile",
    category: "Signalisation",
  },
  {
    id: "Q138",
    question: "Avant de tourner a droite a une intersection, quelle verification est essentielle pour proteger les cyclistes?",
    options: [
      "Verifier le retroviseur droit et l angle mort droit",
      "Klaxonner puis tourner immediatement",
      "Regarder seulement devant",
      "Serrer a droite sans verifier pour bloquer les depassements",
    ],
    correctOptionIndex: 0,
    explanation:
      "La verification a droite est essentielle avant le virage pour eviter de couper un cycliste.",
    difficulty: "moyenne",
    category: "Cyclistes",
  },
  {
    id: "Q139",
    question: "Quelle affirmation concernant les voies/pistes cyclables est correcte?",
    options: [
      "Il est interdit de s arreter sur une piste cyclable et a moins de 5 m de celle-ci",
      "Le stationnement est permis sur une piste cyclable hors pointe",
      "Vous pouvez vous arreter sur la piste cyclable si vous allumez les detresses",
      "Une piste cyclable peut etre utilisee pour depasser",
    ],
    correctOptionIndex: 0,
    explanation:
      "Les pistes cyclables sont reservees aux cyclistes; l arret sur la piste et a moins de 5 m est interdit.",
    difficulty: "difficile",
    category: "Cyclistes",
  },
  {
    id: "Q140",
    question: "Sur une cote descendante tres glissante, quelle strategie est recommandee?",
    options: [
      "Reduire la vitesse avant la descente et freiner par intermittence au besoin",
      "Passer a un rapport inferieur brusquement en pleine descente",
      "Garder la meme vitesse qu en ete",
      "Utiliser le regulateur de vitesse pour stabiliser le vehicule",
    ],
    correctOptionIndex: 0,
    explanation:
      "Sur pente glissante, il faut anticiper la descente, ralentir avant et freiner progressivement/intermittence.",
    difficulty: "difficile",
    category: "Securite",
  },
  {
    id: "Q141",
    question:
      "Intersection a 4 arrets: A, B, C et D sont immobilises. A est arrive en premier. Qui passe en premier?",
    options: ["A", "B", "C", "D"],
    correctOptionIndex: 0,
    explanation:
      "A une intersection avec arret dans toutes les directions, le premier vehicule immobilise obtient la priorite.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "Tous les vehicules ont un panneau ARRET.",
      firstPassId: "A",
      controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
      cars: [
        { id: "A", from: "N", move: "straight", color: "#0f766e" },
        { id: "B", from: "E", move: "left", color: "#2563eb" },
        { id: "C", from: "S", move: "right", color: "#dc2626" },
        { id: "D", from: "W", move: "straight", color: "#f97316" },
      ],
    },
  },
  {
    id: "Q142",
    question:
      "Intersection a 4 arrets: A (sud) et B (est) s immobilisent en meme temps. Qui passe en premier?",
    options: [
      "B, parce qu il est a droite de A",
      "A, parce qu il va tout droit",
      "A et B en meme temps",
      "Celui qui klaxonne en premier",
    ],
    correctOptionIndex: 0,
    explanation:
      "Quand deux vehicules arrivent en meme temps a un arret toutes directions, on cede au vehicule situe a droite.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A et B arrivent au meme moment. C et D sont encore en approche.",
      firstPassId: "B",
      controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "E", move: "straight", color: "#2563eb" },
        { id: "C", from: "N", move: "left", color: "#dc2626" },
        { id: "D", from: "W", move: "right", color: "#f97316" },
      ],
    },
  },
  {
    id: "Q143",
    question:
      "A un arret 4 directions, A tourne a gauche et B arrive en sens inverse pour aller tout droit. Qui a la priorite immediate?",
    options: [
      "B, le vehicule qui va tout droit",
      "A, parce qu il etait deja aligne pour tourner",
      "A et B peuvent passer ensemble",
      "A, si sa voiture est plus grosse",
    ],
    correctOptionIndex: 0,
    explanation:
      "En conflit direct, le virage a gauche cede au vehicule venant en sens inverse qui poursuit tout droit.",
    difficulty: "moyenne",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "Arret toutes directions; A et B veulent s engager en conflit.",
      firstPassId: "B",
      controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
      cars: [
        { id: "A", from: "S", move: "left", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "right", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q144",
    question:
      "A une intersection ou seul votre axe a un panneau ARRET, que devez-vous faire apres l arret complet?",
    options: [
      "Ceder le passage aux vehicules de la route transversale",
      "Redemarrer des que la voiture derriere vous avance",
      "Passer en premier si vous allumez vos clignotants",
      "Avancer jusqu au milieu puis decider",
    ],
    correctOptionIndex: 0,
    explanation:
      "Lorsqu une seule chaussee est reglee par ARRET, les vehicules sur la chaussee transversale sont prioritaires.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A est sur l axe avec ARRET; B et C circulent sur l axe prioritaire.",
      firstPassId: "B",
      controls: { N: "none", S: "stop", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "W", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "straight", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q145",
    question:
      "Virage a droite au feu rouge autorise: apres l arret complet, a qui devez-vous ceder avant de tourner?",
    options: [
      "Aux pietons, cyclistes et vehicules deja engages",
      "Seulement aux pietons",
      "Seulement aux vehicules venant de gauche",
      "A personne si vous tournez lentement",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le virage a droite au feu rouge n est jamais prioritaire. Il faut ceder aux usagers vulnerables et au trafic deja engage.",
    difficulty: "moyenne",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A veut tourner a droite apres arret. Un cycliste et un pieton sont en conflit potentiel.",
      firstPassId: "C",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "right", color: "#0f766e" },
        { id: "B", from: "W", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "straight", color: "#22c55e", kind: "cyclist" },
      ],
      pedestrians: [{ id: "P1", at: "E" }],
    },
  },
  {
    id: "Q146",
    question:
      "Au feu vert, vous tournez a droite et un cycliste circule tout droit sur votre droite. Quelle decision est correcte?",
    options: [
      "Ceder le passage au cycliste avant de tourner",
      "Tourner immediatement pour ne pas bloquer la voie",
      "Klaxonner puis tourner",
      "Serrer a droite pour empecher le cycliste de passer",
    ],
    correctOptionIndex: 0,
    explanation:
      "Avant un virage a droite, il faut verifier retroviseur/angle mort droit et ceder le passage au cycliste.",
    difficulty: "moyenne",
    category: "Cyclistes",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/right-turn-yield-cyclist.svg",
      alt: "Virage a droite avec cycliste qui continue tout droit",
      overlayTag: "Cyclistes",
      context: "Le conducteur qui tourne a droite doit ceder au cycliste.",
    },
  },
  {
    id: "Q147",
    question:
      "Le feu passe au vert mais la sortie de l intersection est bloquee. Quelle action est correcte?",
    options: [
      "Attendre avant la ligne et entrer seulement si vous pouvez degager l intersection",
      "Avancer dans l intersection pour reserver votre place",
      "Suivre le vehicule devant meme sans espace de sortie",
      "Bloquer le passage pieton pour rester visible",
    ],
    correctOptionIndex: 0,
    explanation:
      "On ne s engage pas sans espace de degagement. Bloquer l intersection cree un risque et une infraction.",
    difficulty: "moyenne",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/blocked-intersection-queue.svg",
      alt: "Intersection avec sortie bloquee malgre feu vert",
      overlayTag: "Circulation",
      context: "Ne pas entrer dans l intersection sans espace de sortie.",
    },
  },
  {
    id: "Q148",
    question:
      "A un passage pour pietons, un pieton s avance vers le marquage et etablit un contact visuel. Que devez-vous faire?",
    options: [
      "Vous arreter et le laisser traverser",
      "Maintenir votre vitesse s il n est pas encore sur la chaussee",
      "Passer rapidement avant lui",
      "Klaxonner pour confirmer qu il peut traverser",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le conducteur doit ceder le passage lorsqu un pieton traverse ou manifeste clairement son intention de traverser.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/crosswalk-yield.svg",
      alt: "Passage pieton avec conducteur qui doit ceder",
      overlayTag: "Priorite",
      context: "Le pieton qui manifeste son intention de traverser est prioritaire.",
    },
  },
  {
    id: "Q149",
    question:
      "A une intersection, vous devez tourner a gauche. Une voiture arrive en sens inverse tout droit. Que faites-vous?",
    options: [
      "Vous cedez le passage a la voiture en sens inverse",
      "Vous tournez en premier si votre clignotant est active",
      "Vous avancez au milieu puis forcez le virage",
      "Vous klaxonnez pour obtenir le passage",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le virage a gauche doit ceder aux vehicules venant en sens inverse qui vont tout droit.",
    difficulty: "moyenne",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A veut tourner a gauche; B arrive en sens inverse tout droit.",
      firstPassId: "B",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "left", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", color: "#2563eb" },
        { id: "C", from: "W", move: "right", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q150",
    question: "Quelle manoeuvre est interdite a l interieur d une intersection?",
    options: [
      "Changer de voie dans l intersection",
      "Ralentir avant un virage",
      "Ceder le passage a un pieton",
      "Activer son clignotant",
    ],
    correctOptionIndex: 0,
    explanation:
      "Changer de voie dans l intersection augmente fortement le risque de conflit lateral.",
    difficulty: "moyenne",
    category: "Circulation",
    illustration: {
      kind: "intersection_4way",
      context: "A tente de modifier sa trajectoire au milieu du carrefour.",
      firstPassId: "B",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "W", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "straight", color: "#dc2626" },
        { id: "D", from: "N", move: "right", color: "#f97316" },
      ],
    },
  },
  {
    id: "Q151",
    question:
      "En entrant sur l autoroute par une bretelle, quelle regle de priorite s applique?",
    options: [
      "Le vehicule qui s insere cede le passage aux vehicules deja sur l autoroute",
      "Le vehicule sur l autoroute doit toujours s arreter",
      "Les deux vehicules ont une priorite egale",
      "La voie d acceleration donne automatiquement priorite",
    ],
    correctOptionIndex: 0,
    explanation:
      "La priorite est accordee aux vehicules deja engages sur l autoroute. La voie d acceleration sert a ajuster sa vitesse.",
    difficulty: "facile",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/highway-merge-yield.svg",
      alt: "Insertion sur autoroute avec cession de passage",
      overlayTag: "Circulation",
      context: "Le vehicule qui s insere doit ceder aux vehicules deja engages.",
    },
  },
  {
    id: "Q152",
    question:
      "Dans une voie d acceleration, quelle est la meilleure pratique avant l insertion?",
    options: [
      "Ajuster votre vitesse a celle du trafic en utilisant la voie jusqu a la fin utile",
      "Freiner fortement des le debut de la voie",
      "Vous arreter au debut de la voie d acceleration",
      "Vous inserer sans verification d angle mort",
    ],
    correctOptionIndex: 0,
    explanation:
      "La voie d acceleration est concue pour harmoniser la vitesse avant l insertion et reduire les conflits.",
    difficulty: "facile",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/highway-acceleration-lane.svg",
      alt: "Voie d acceleration utilisee avant insertion sur autoroute",
      overlayTag: "Circulation",
      context: "Utiliser la voie d acceleration pour harmoniser votre vitesse.",
    },
  },
  {
    id: "Q153",
    question:
      "En zone de 50 km/h, un autobus signale sa reintegration apres un arret. Quelle conduite est correcte?",
    options: [
      "Ceder le passage a l autobus qui se reintegre",
      "Accelerer pour le depasser avant qu il revienne",
      "Rester cote a cote avec l autobus",
      "Klaxonner pour forcer votre priorite",
    ],
    correctOptionIndex: 0,
    explanation:
      "Sur une route dont la limite est inferieure a 70 km/h, il faut ceder a l autobus qui signale sa reintegration.",
    difficulty: "moyenne",
    category: "Priorite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/city-bus-reentry.svg",
      alt: "Autobus qui signale sa reintegration en zone urbaine",
      overlayTag: "Priorite",
      context: "En zone 50, vous devez ceder a l autobus qui signale son retour en voie.",
    },
  },
  {
    id: "Q154",
    question:
      "Devant un autobus scolaire, les feux jaunes alternatifs s activent. Quelle est la bonne reaction?",
    options: [
      "Vous vous preparez a vous arreter",
      "Vous depassez rapidement avant les feux rouges",
      "Vous klaxonnez pour annoncer votre passage",
      "Vous continuez a vitesse constante",
    ],
    correctOptionIndex: 0,
    explanation:
      "Les feux jaunes d un autobus scolaire sont un presignalement d arret obligatoire: il faut se preparer a stopper.",
    difficulty: "moyenne",
    category: "Transport scolaire",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/school-bus-yellow-lights.svg",
      alt: "Autobus scolaire avec feux jaunes intermittents",
      overlayTag: "Transport scolaire",
      context: "Feux jaunes actifs: ralentir et vous preparer a l arret.",
    },
  },
  {
    id: "Q155",
    question:
      "Feux rouges intermittents et panneau ARRET d un autobus scolaire actifs sur une route non separee: que devez-vous faire?",
    options: [
      "Vous immobiliser a plus de 5 m, dans les deux sens de circulation",
      "Continuer si vous venez en sens inverse",
      "Ralentir sans vous arreter",
      "Passer si aucun enfant n est visible",
    ],
    correctOptionIndex: 0,
    explanation:
      "Avec feux rouges intermittents/panneau ARRET actifs, l arret complet a plus de 5 m est obligatoire sur une route non separee.",
    difficulty: "difficile",
    category: "Transport scolaire",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/school-bus-red-stop-undivided.svg",
      alt: "Autobus scolaire arrete avec panneau stop et feux rouges sur route non separee",
      overlayTag: "Transport scolaire",
      context: "Route non separee: arret obligatoire dans les deux sens a plus de 5 m.",
    },
  },
  {
    id: "Q156",
    question:
      "Un autobus scolaire est en arret obligatoire, mais les voies opposees sont separees par un terre-plein. En sens inverse, vous devez:",
    options: [
      "Continuer prudemment, sans obligation d arret",
      "Vous arreter obligatoirement a plus de 5 m",
      "Tourner pour eviter l autobus",
      "Attendre un signal de l accompagnateur",
    ],
    correctOptionIndex: 0,
    explanation:
      "L obligation d arret ne s applique pas en sens inverse lorsque les chaussees sont separees par un terre-plein.",
    difficulty: "moyenne",
    category: "Transport scolaire",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/school-bus-divided-road.svg",
      alt: "Autobus scolaire arrete sur chaussees separees par terre-plein",
      overlayTag: "Transport scolaire",
      context: "Avec terre-plein separateur, le sens inverse n a pas d obligation d arret.",
    },
  },
  {
    id: "Q157",
    question:
      "Un vehicule d urgence (sirene et gyrophares actifs) approche par derriere. Quelle conduite est correcte?",
    options: [
      "Ralentir, serrer a droite et vous arreter si necessaire",
      "Accelerer pour rester devant lui",
      "Tourner immediatement devant lui",
      "Le suivre de pres pour gagner du temps",
    ],
    correctOptionIndex: 0,
    explanation:
      "Il faut liberer la voie au vehicule d urgence, rester calme et eviter toute manoeuvre qui lui coupe la trajectoire.",
    difficulty: "moyenne",
    category: "Urgence",
    illustration: {
      kind: "intersection_4way",
      context: "Vehicule d urgence E en intervention.",
      firstPassId: "E",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "W", move: "straight", color: "#0f766e" },
        { id: "B", from: "S", move: "right", color: "#2563eb" },
        { id: "E", from: "E", move: "straight", kind: "emergency", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q158",
    question:
      "Sur une chaussee a plusieurs voies, une depanneuse est arretee a droite avec signaux actifs (corridor de securite). Que devez-vous faire?",
    options: [
      "Ralentir et vous eloigner en changeant de voie si possible sans danger",
      "Conserver votre voie et votre vitesse",
      "Passer au plus pres pour limiter le bouchon",
      "Vous arreter derriere la depanneuse sans raison",
    ],
    correctOptionIndex: 0,
    explanation:
      "Le corridor de securite impose de ralentir et de laisser un espace lateral maximal aux travailleurs et vehicules arretes.",
    difficulty: "facile",
    category: "Urgence",
    illustration: {
      kind: "intersection_4way",
      context: "D est une depanneuse arretee; A doit s eloigner de sa voie.",
      firstPassId: "D",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "W", move: "straight", color: "#0f766e" },
        { id: "B", from: "W", move: "straight", color: "#2563eb" },
        { id: "D", from: "E", move: "straight", kind: "truck", color: "#f97316" },
      ],
    },
  },
  {
    id: "Q159",
    question:
      "Vous tournez a gauche pendant qu un pieton traverse la chaussee que vous voulez emprunter. Qui a la priorite?",
    options: [
      "Le pieton",
      "Le conducteur qui tourne",
      "Le vehicule le plus rapide",
      "Celui qui est engage au centre de l intersection",
    ],
    correctOptionIndex: 0,
    explanation:
      "En virage, vous devez ceder aux pietons qui traversent la chaussee que vous allez emprunter.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A veut tourner a gauche pendant la traversee de P1.",
      firstPassId: "P1",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "left", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", color: "#2563eb" },
      ],
      pedestrians: [{ id: "P1", at: "W" }],
    },
  },
  {
    id: "Q160",
    question:
      "A un arret 4 directions, A veut tourner a gauche, B veut aller tout droit et un pieton P1 est engage. Qui a la priorite immediate?",
    options: ["P1", "A", "B", "A et B en meme temps"],
    correctOptionIndex: 0,
    explanation:
      "Le pieton engage a priorite. Ensuite, les vehicules appliquent les regles de cession entre eux.",
    difficulty: "difficile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "P1 est deja engage dans le passage.",
      firstPassId: "P1",
      controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
      cars: [
        { id: "A", from: "S", move: "left", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "right", color: "#dc2626" },
        { id: "D", from: "W", move: "straight", color: "#f97316" },
      ],
      pedestrians: [{ id: "P1", at: "N" }],
    },
  },
];

const NEW_SCENARIO_QUESTIONS: Question[] = [
  {
    id: "Q162",
    question: "Intersection a 4 arrets: quel vehicule passe en premier?",
    options: [
      "Le vehicule immobilise en premier",
      "Le vehicule le plus gros",
      "Le vehicule qui tourne a gauche",
      "Le vehicule qui klaxonne",
    ],
    correctOptionIndex: 0,
    explanation: "A un arret toutes directions, l ordre de passage commence par le premier vehicule immobilise.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A est arrete depuis quelques secondes; B, C et D viennent juste de s immobiliser.",
      firstPassId: "A",
      controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
      cars: [
        { id: "A", from: "N", move: "straight", color: "#0f766e" },
        { id: "B", from: "E", move: "straight", color: "#2563eb" },
        { id: "C", from: "S", move: "left", color: "#dc2626" },
        { id: "D", from: "W", move: "right", color: "#f97316" },
      ],
    },
  },
  {
    id: "Q163",
    question: "Deux vehicules arrivent exactement en meme temps a un arret 4 directions. Qui a priorite?",
    options: [
      "Le vehicule situe a droite",
      "Le vehicule situe a gauche",
      "Le vehicule le plus rapide",
      "Aucun, ils passent ensemble",
    ],
    correctOptionIndex: 0,
    explanation: "En arrivee simultanee a un arret toutes directions, on cede au vehicule a droite.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A (sud) et B (est) arrivent exactement au meme moment.",
      firstPassId: "B",
      controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "E", move: "straight", color: "#2563eb" },
        { id: "C", from: "N", move: "left", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q164",
    question: "Vous tournez a gauche et un vehicule arrive en sens inverse tout droit. Quelle action est correcte?",
    options: [
      "Ceder le passage au vehicule en sens inverse",
      "Tourner en premier pour ne pas bloquer",
      "Avancer au centre et forcer le passage",
      "Klaxonner puis tourner",
    ],
    correctOptionIndex: 0,
    explanation: "Le virage a gauche cede au vehicule venant en sens inverse qui va tout droit.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A veut tourner a gauche pendant que B arrive en sens inverse.",
      firstPassId: "B",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "left", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", color: "#2563eb" },
        { id: "C", from: "W", move: "right", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q165",
    question: "Virage a droite au feu rouge autorise: que devez-vous faire avant de tourner?",
    options: [
      "Arret complet puis ceder aux pietons, cyclistes et vehicules engages",
      "Ralentir seulement si un pieton traverse",
      "Tourner des que la voie auto est libre",
      "Tourner avant les cyclistes pour ne pas bloquer",
    ],
    correctOptionIndex: 0,
    explanation: "Le virage a droite au rouge n est jamais prioritaire. L arret complet et la cession sont obligatoires.",
    difficulty: "moyenne",
    category: "Priorite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/right-turn-yield-cyclist.svg",
      alt: "Virage a droite au rouge avec usagers prioritaires",
      overlayTag: "Priorite",
      context: "Apres arret complet, ceder aux pietons, cyclistes et vehicules engages.",
    },
  },
  {
    id: "Q166",
    question: "Le feu devient vert, mais la sortie de l intersection est bloquee. Que devez-vous faire?",
    options: [
      "Attendre avant la ligne et entrer seulement si vous pouvez degager",
      "Entrer quand meme pour reserver votre place",
      "Suivre le vehicule devant sans verifier l espace",
      "Bloquer le passage pieton pour rester visible",
    ],
    correctOptionIndex: 0,
    explanation: "On ne s engage pas sans espace de degagement. Bloquer l intersection est dangereux et sanctionnable.",
    difficulty: "moyenne",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/blocked-intersection-queue.svg",
      alt: "Sortie d intersection bloquee",
      overlayTag: "Circulation",
      context: "Attendre avant la ligne tant que la sortie reste congestionnee.",
    },
  },
  {
    id: "Q167",
    question: "Autobus scolaire avec feux jaunes intermittents: quelle conduite est correcte?",
    options: [
      "Ralentir et se preparer a arreter",
      "Depasser rapidement avant les feux rouges",
      "Maintenir la meme vitesse",
      "Klaxonner pour prevenir les autres",
    ],
    correctOptionIndex: 0,
    explanation: "Les feux jaunes annoncent un arret obligatoire imminent de l autobus scolaire.",
    difficulty: "facile",
    category: "Transport scolaire",
    illustration: {
      kind: "intersection_4way",
      context: "B est un autobus scolaire en phase de pre-signalement d arret.",
      firstPassId: "B",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", kind: "bus", color: "#eab308" },
      ],
    },
  },
  {
    id: "Q168",
    question: "Autobus scolaire avec feux rouges intermittents sur route a deux sens non separee: vous devez",
    options: [
      "Vous immobiliser",
      "Continuer lentement",
      "Depasser par la gauche",
      "Passer si aucun enfant n est visible",
    ],
    correctOptionIndex: 0,
    explanation: "Avec les feux rouges d autobus scolaire, l arret est obligatoire dans cette configuration.",
    difficulty: "moyenne",
    category: "Transport scolaire",
    illustration: {
      kind: "intersection_4way",
      context: "B (autobus scolaire) est en arret obligatoire avec signaux actifs.",
      firstPassId: "B",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", kind: "bus", color: "#eab308" },
        { id: "C", from: "W", move: "straight", color: "#2563eb" },
      ],
    },
  },
  {
    id: "Q169",
    question: "Autobus scolaire feux rouges sur chausses separees par terre-plein: en sens inverse, que faites-vous?",
    options: [
      "Continuer avec prudence",
      "Arret obligatoire immediat",
      "Faire demi-tour",
      "Changer de voie et s immobiliser",
    ],
    correctOptionIndex: 0,
    explanation: "Sur chausses separees physiquement, le sens oppose n est pas soumis au meme arret.",
    difficulty: "difficile",
    category: "Transport scolaire",
    illustration: {
      kind: "intersection_4way",
      context: "B (autobus) est sur la chaussee opposee separee d un terre-plein.",
      firstPassId: "A",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", kind: "bus", color: "#eab308" },
      ],
    },
  },
  {
    id: "Q170",
    question: "Vous entendez une sirene et voyez un vehicule d urgence derriere. Quelle action est correcte?",
    options: [
      "Reduire la vitesse et serrer a droite pour le laisser passer",
      "Freiner brusquement au centre de la voie",
      "Accelerer pour garder votre position",
      "Continuer a vitesse constante",
    ],
    correctOptionIndex: 0,
    explanation: "Il faut faciliter le passage du vehicule d urgence de facon previsible et securitaire.",
    difficulty: "facile",
    category: "Urgence",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/emergency-rear-siren.svg",
      alt: "Vehicule urgence arrivant derriere",
      overlayTag: "Urgence",
      context: "Reduire la vitesse, serrer a droite et laisser passer.",
    },
  },
  {
    id: "Q171",
    question: "Vehicule d urgence arrete sur l accotement avec gyrophares actifs: vous devez",
    options: [
      "Changer de voie si possible, sinon ralentir nettement",
      "Maintenir votre vitesse",
      "Vous arreter completement sur votre voie",
      "Passer au plus pres de l intervention",
    ],
    correctOptionIndex: 0,
    explanation: "Le corridor de securite impose de s eloigner du vehicule d urgence ou de ralentir fortement.",
    difficulty: "moyenne",
    category: "Urgence",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/emergency-shoulder-move-over.svg",
      alt: "Vehicule urgence arrete sur accotement",
      overlayTag: "Urgence",
      context: "Corridor de securite: changer de voie ou ralentir fortement.",
    },
  },
  {
    id: "Q172",
    question: "En entrant sur l autoroute par une bretelle, qui cede le passage?",
    options: [
      "Le vehicule qui s insere",
      "Le vehicule deja sur l autoroute",
      "Les deux ont la meme priorite",
      "Le vehicule le plus rapide",
    ],
    correctOptionIndex: 0,
    explanation: "La priorite est aux vehicules deja engages sur l autoroute.",
    difficulty: "facile",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/highway-ramp-priority.svg",
      alt: "Bretelle d acces et circulation principale avec priorite",
      overlayTag: "Circulation",
      context: "Le vehicule en bretelle cede le passage au flux principal.",
    },
  },
  {
    id: "Q173",
    question: "Avant un changement de voie, quelle verification finale est indispensable?",
    options: [
      "Un coup d oeil dans l angle mort du cote vise",
      "Regarder seulement le retroviseur interieur",
      "Regarder uniquement devant",
      "Klaxonner puis changer de voie",
    ],
    correctOptionIndex: 0,
    explanation: "Les retroviseurs ne suppriment pas tous les angles morts; la verification directe est obligatoire.",
    difficulty: "facile",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/blind-spot-check.svg",
      alt: "Verification d angle mort avant changement de voie",
      overlayTag: "Securite",
      context: "Verification finale indispensable du cote vise.",
    },
  },
  {
    id: "Q174",
    question: "Vous tournez a droite et un cycliste continue tout droit a votre droite. Qui passe d abord?",
    options: [
      "Le cycliste",
      "Le conducteur qui tourne",
      "Les deux en meme temps",
      "Celui qui arrive le plus vite",
    ],
    correctOptionIndex: 0,
    explanation: "Avant de tourner a droite, vous devez ceder au cycliste deja dans la trajectoire.",
    difficulty: "moyenne",
    category: "Cyclistes",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/right-turn-yield-cyclist.svg",
      alt: "Cycliste prioritaire lors d un virage a droite",
      overlayTag: "Cyclistes",
      context: "Le cycliste qui continue tout droit passe avant le virage a droite.",
    },
  },
  {
    id: "Q175",
    question: "Avant d ouvrir votre portiere cote circulation, quel geste est correct?",
    options: [
      "Verifier retroviseur et angle mort arriere",
      "Ouvrir vite pour sortir",
      "Klaxonner puis ouvrir",
      "Laisser la portiere entrouverte sans regarder",
    ],
    correctOptionIndex: 0,
    explanation: "La verification evite l emportierage d un cycliste ou d un motocycliste.",
    difficulty: "moyenne",
    category: "Cyclistes",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/door-check-cyclist.svg",
      alt: "Ouverture de portiere avec cycliste approchant",
      overlayTag: "Cyclistes",
      context: "Verifier retroviseur et angle mort avant d ouvrir la portiere.",
    },
  },
  {
    id: "Q176",
    question: "En depassant un cycliste, quelle regle est correcte?",
    options: [
      "Laisser un ecart lateral de securite suffisant",
      "Le depasser sans se deporter",
      "Le frler pour gagner du temps",
      "Klaxonner et passer immediatement",
    ],
    correctOptionIndex: 0,
    explanation: "Le depassement d un cycliste exige une marge laterale de securite reelle.",
    difficulty: "moyenne",
    category: "Cyclistes",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/cyclist-overtake-distance.svg",
      alt: "Depassement d un cycliste avec ecart lateral",
      overlayTag: "Cyclistes",
      context: "Conserver une distance laterale suffisante pendant le depassement.",
    },
  },
  {
    id: "Q177",
    question: "A un passage pieton, un pieton manifeste clairement son intention de traverser. Vous devez",
    options: [
      "Vous arreter et le laisser traverser",
      "Maintenir votre vitesse",
      "Passer rapidement avant lui",
      "Klaxonner pour indiquer votre presence",
    ],
    correctOptionIndex: 0,
    explanation: "Le pieton qui s engage ou manifeste clairement son intention est prioritaire.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/crosswalk-yield.svg",
      alt: "Pieton prioritaire au passage pieton",
      overlayTag: "Priorite",
      context: "Le conducteur s arrete et laisse traverser le pieton.",
    },
  },
  {
    id: "Q178",
    question: "Sur une route a une voie par sens, quel depassement est permis?",
    options: [
      "Depasser par la gauche seulement si marquage et visibilite le permettent",
      "Depasser par l accotement droit",
      "Depasser en courbe sans visibilite",
      "Depasser sans signaler",
    ],
    correctOptionIndex: 0,
    explanation: "Le depassement doit etre legal et securitaire: par la gauche avec visibilite et marquage autorisant.",
    difficulty: "moyenne",
    category: "Depassement",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/two-way-overtake-left.svg",
      alt: "Depassement sur route a une voie par sens",
      overlayTag: "Depassement",
      context: "Depasser par la gauche seulement avec visibilite et marquage autorisant.",
    },
  },
  {
    id: "Q179",
    question: "Une voie centrale partagee est reservee principalement a",
    options: [
      "La preparation des virages a gauche",
      "La circulation continue a haute vitesse",
      "Le depassement sur longue distance",
      "Le stationnement temporaire",
    ],
    correctOptionIndex: 0,
    explanation: "La voie centrale partagee sert aux manoeuvres de virage a gauche, pas a la circulation continue.",
    difficulty: "moyenne",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/center-turn-lane.svg",
      alt: "Voie centrale partagee pour virage a gauche",
      overlayTag: "Circulation",
      context: "La voie centrale partagee sert principalement a preparer un virage a gauche.",
    },
  },
  {
    id: "Q180",
    question: "Un X rouge au-dessus de votre voie signifie",
    options: [
      "Voie fermee ou interdite a la circulation",
      "Voie prioritaire",
      "Reduction obligatoire de 10 km/h",
      "Arret obligatoire dans cette voie",
    ],
    correctOptionIndex: 0,
    explanation: "Le X rouge indique une voie interdite a la circulation.",
    difficulty: "facile",
    category: "Signalisation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/quebec-signs/qc-p100-x-rouge-voie.png",
      alt: "X rouge au dessus d une voie",
      overlayTag: "Signalisation",
      context: "Le X rouge indique une voie fermee ou interdite.",
      sourceLabel: "Panneau officiel Quebec (Wikimedia Commons)",
      sourceUrl: "https://commons.wikimedia.org/wiki/Category:Road_signs_of_Quebec",
    },
  },
  {
    id: "Q181",
    question: "Panneau voie BUS TAXI: en auto, quelle conduite est correcte?",
    options: [
      "Rester hors de la voie reservee, sauf exception indiquee",
      "Entrer dans la voie si elle parait vide",
      "Utiliser la voie seulement pour depasser",
      "S y arreter pour debarquer un passager",
    ],
    correctOptionIndex: 0,
    explanation: "Une voie reservee ne peut etre utilisee que par les usagers autorises.",
    difficulty: "facile",
    category: "Signalisation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/signs/bus-lane.svg",
      alt: "Panneau voie reservee autobus et taxis",
      overlayTag: "Signalisation",
      context: "Une voiture doit rester hors de cette voie reservee.",
    },
  },
  {
    id: "Q182",
    question: "Passage a niveau: les feux rouges clignotent. Que devez-vous faire?",
    options: [
      "Vous arreter avant la zone de danger",
      "Accelerer pour franchir avant le train",
      "Traverser si aucun train n est visible",
      "Contourner les vehicules arretes",
    ],
    correctOptionIndex: 0,
    explanation: "Feux rouges a un passage a niveau = arret obligatoire.",
    difficulty: "facile",
    category: "Passage a niveau",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/signs/railway.svg",
      alt: "Signalisation de passage a niveau",
      overlayTag: "Passage a niveau",
      context: "Feux rouges clignotants: arret obligatoire avant la zone de danger.",
    },
  },
  {
    id: "Q183",
    question: "Apres le passage d un train, quand pouvez-vous repartir?",
    options: [
      "Quand les signaux cessent et que la voie est completement libre",
      "Des que la locomotive est passee",
      "Des que le vehicule devant avance",
      "Des que la barriere remonte a moitie",
    ],
    correctOptionIndex: 0,
    explanation: "Il faut attendre la fin complete des signaux et verifier l absence de danger.",
    difficulty: "moyenne",
    category: "Passage a niveau",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/quebec-signs/qc-d180-1.png",
      alt: "Passage a niveau au Quebec",
      overlayTag: "Passage a niveau",
      context: "Repartez seulement quand les signaux cessent et que la voie est libre.",
      sourceLabel: "Panneau officiel Quebec (Wikimedia Commons)",
      sourceUrl: "https://commons.wikimedia.org/wiki/Category:Road_signs_of_Quebec",
    },
  },
  {
    id: "Q184",
    question: "Vous tournez a gauche pendant qu un pieton traverse la chaussee que vous voulez emprunter. Qui a priorite?",
    options: [
      "Le pieton",
      "Le vehicule qui tourne",
      "Le vehicule le plus rapide",
      "Personne, priorite egale",
    ],
    correctOptionIndex: 0,
    explanation: "En virage, vous devez ceder au pieton engage dans la chaussee visee.",
    difficulty: "difficile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A veut tourner a gauche; P1 est deja engage dans le passage.",
      firstPassId: "P1",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "left", color: "#0f766e" },
        { id: "B", from: "N", move: "straight", color: "#2563eb" },
      ],
      pedestrians: [{ id: "P1", at: "W" }],
    },
  },
  {
    id: "Q185",
    question: "Sous la pluie, la distance de securite habituelle est-elle suffisante?",
    options: [
      "Non, il faut augmenter la distance",
      "Oui, toujours",
      "Oui, seulement sous 50 km/h",
      "Oui, avec des pneus uses",
    ],
    correctOptionIndex: 0,
    explanation: "Sur chaussee mouillee, la distance de freinage augmente; il faut augmenter la marge.",
    difficulty: "facile",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/rain-follow-distance.svg",
      alt: "Deux vehicules sous la pluie avec distance de securite augmentee",
      overlayTag: "Pluie",
      context: "Sous la pluie, augmentez la distance de securite.",
    },
  },
  {
    id: "Q186",
    question: "Un pneu sous-gonfle peut entrainer",
    options: [
      "Un echauffement, un risque d eclatement et une consommation plus elevee",
      "Une meilleure adherence en tout temps",
      "Une distance de freinage plus courte",
      "Une usure plus reguliere",
    ],
    correctOptionIndex: 0,
    explanation: "Le sous-gonflage augmente les risques mecaniques et de perte de controle.",
    difficulty: "moyenne",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/tire-underinflated.svg",
      alt: "Comparatif entre pneu normal et pneu sous gonfle",
      overlayTag: "Pneus",
      context: "Le sous gonflage provoque un echauffement et augmente les risques.",
    },
  },
  {
    id: "Q187",
    question: "Premiers signes de fatigue au volant: quelle decision est la plus sure?",
    options: [
      "S arreter pour se reposer des que possible",
      "Monter le volume et continuer",
      "Ouvrir la fenetre et accelerer",
      "Boire un cafe et ignorer les signes",
    ],
    correctOptionIndex: 0,
    explanation: "Le repos reste la mesure la plus efficace contre la somnolence au volant.",
    difficulty: "moyenne",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/fatigue-stop.svg",
      alt: "Conducteur fatigue qui doit s arreter a une aire de repos",
      overlayTag: "Fatigue",
      context: "Des les premiers signes de fatigue, il faut s arreter pour recuperer.",
    },
  },
  {
    id: "Q188",
    question: "La nuit, quand vous suivez un vehicule, quels phares utilisez-vous?",
    options: [
      "Les feux de croisement",
      "Les feux de route",
      "Les feux de detresse",
      "Aucun phare",
    ],
    correctOptionIndex: 0,
    explanation: "Les feux de croisement evitent d eblouir le conducteur devant.",
    difficulty: "facile",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/night-following-low-beam.svg",
      alt: "Conduite de nuit derriere un vehicule avec feux de croisement",
      overlayTag: "Visibilite",
      context: "De nuit, adaptez l eclairage pour voir sans eblouir.",
    },
  },
  {
    id: "Q189",
    question: "La nuit, en croisant un vehicule en sens inverse, vous devez",
    options: [
      "Passer aux feux de croisement des risque d eblouissement",
      "Garder les feux de route jusqu au croisement complet",
      "Eteindre vos phares",
      "Freiner brusquement au centre de la voie",
    ],
    correctOptionIndex: 0,
    explanation: "La priorite est d eviter l eblouissement des autres usagers.",
    difficulty: "moyenne",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/night-oncoming-low-beam.svg",
      alt: "Deux vehicules se croisant de nuit avec feux de croisement",
      overlayTag: "Visibilite",
      context: "En croisement de nuit, passez aux feux de croisement.",
    },
  },
  {
    id: "Q190",
    question: "Dans une zone scolaire sans panneau de limite inferieure, la vitesse maximale est",
    options: [
      "50 km/h",
      "30 km/h",
      "70 km/h",
      "40 km/h",
    ],
    correctOptionIndex: 0,
    explanation: "En zone scolaire, la limite est 50 km/h sauf signalisation d une limite plus basse.",
    difficulty: "facile",
    category: "Zone scolaire",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/quebec-signs/qc-d010-1-zone-scolaire.png",
      alt: "Panneau avance en zone scolaire",
      overlayTag: "Zone scolaire",
      context: "Zone scolaire signalee.",
    },
  },
  {
    id: "Q191",
    question: "En zone de travaux avec limite temporaire affichee, vous devez",
    options: [
      "Respecter la vitesse temporaire",
      "Conserver la vitesse habituelle",
      "Accelerer pour sortir vite de la zone",
      "Suivre la vitesse du vehicule le plus rapide",
    ],
    correctOptionIndex: 0,
    explanation: "La signalisation temporaire orange est obligatoire dans un chantier.",
    difficulty: "facile",
    category: "Zone de travaux",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/signs/work-zone.svg",
      alt: "Panneau zone de travaux",
      overlayTag: "Zone de travaux",
      context: "Ralentir et suivre les indications temporaires du chantier.",
    },
  },
  {
    id: "Q192",
    question: "Avant de vous engager dans une intersection, quelle sequence visuelle est recommandee?",
    options: [
      "Gauche, droite, puis gauche",
      "Droite, gauche, puis droite",
      "Seulement devant",
      "Seulement a gauche",
    ],
    correctOptionIndex: 0,
    explanation: "La sequence gauche-droite-gauche aide a detecter les risques avant engagement.",
    difficulty: "facile",
    category: "Priorite",
    illustration: {
      kind: "intersection_4way",
      context: "A est en approche et doit verifier toutes les directions.",
      firstPassId: "A",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "W", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "straight", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q193",
    question: "Au panneau ARRET, ou devez-vous immobiliser votre vehicule?",
    options: [
      "Avant la ligne d arret et sans bloquer le passage pieton",
      "Sur la ligne d arret",
      "Dans le passage pieton",
      "Au milieu de l intersection",
    ],
    correctOptionIndex: 0,
    explanation: "Le vehicule doit s immobiliser avant la ligne d arret, en laissant libre le passage pieton.",
    difficulty: "facile",
    category: "Signalisation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/quebec-signs/qc-p010-stop.png",
      alt: "Panneau arret officiel",
      overlayTag: "Signalisation",
      context: "Arret complet obligatoire avant la ligne.",
      sourceLabel: "Panneau officiel Quebec (Wikimedia Commons)",
      sourceUrl: "https://commons.wikimedia.org/wiki/Category:Road_signs_of_Quebec",
    },
  },
  {
    id: "Q194",
    question: "Ce panneau signifie",
    options: [
      "Interdiction de tourner a droite au feu rouge",
      "Interdiction de tourner a droite en tout temps",
      "Obligation de tourner a droite",
      "Interdiction de depasser par la droite",
    ],
    correctOptionIndex: 0,
    explanation: "Le panneau vise le virage a droite pendant la phase rouge du feu.",
    difficulty: "facile",
    category: "Signalisation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/quebec-signs/qc-no-right-on-red.svg",
      alt: "Interdiction de virer a droite au rouge",
      overlayTag: "Signalisation",
      context: "Le virage a droite est interdit lorsque le feu est rouge.",
      sourceLabel: "Panneau officiel Quebec (Wikimedia Commons)",
      sourceUrl: "https://commons.wikimedia.org/wiki/Category:Road_signs_of_Quebec",
    },
  },
  {
    id: "Q195",
    question: "Un panneau d interdiction de tourner a gauche indique",
    options: [
      "Virage a gauche interdit a cet endroit",
      "Virage a gauche permis sans pieton",
      "Virage a gauche permis apres arret complet",
      "Virage a gauche reserve aux autobus",
    ],
    correctOptionIndex: 0,
    explanation: "Une interdiction de manoeuvre reste en vigueur tant qu aucune exception n est affichee.",
    difficulty: "facile",
    category: "Signalisation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/quebec-signs/qc-no-left-turn.svg",
      alt: "Interdiction de tourner a gauche",
      overlayTag: "Signalisation",
      context: "Le virage a gauche est interdit au point signale.",
      sourceLabel: "Panneau officiel Quebec (Wikimedia Commons)",
      sourceUrl: "https://commons.wikimedia.org/wiki/Category:Road_signs_of_Quebec",
    },
  },
  {
    id: "Q196",
    question: "Quelle manoeuvre est interdite a l interieur d une intersection?",
    options: [
      "Changer de voie dans l intersection",
      "Ceder a un pieton",
      "Ralentir avant de tourner",
      "Signaler un virage",
    ],
    correctOptionIndex: 0,
    explanation: "Changer de voie dans l intersection augmente fortement le risque de conflit lateral.",
    difficulty: "moyenne",
    category: "Circulation",
    illustration: {
      kind: "intersection_4way",
      context: "A tente de changer de voie au coeur du carrefour.",
      firstPassId: "B",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "straight", color: "#0f766e" },
        { id: "B", from: "W", move: "straight", color: "#2563eb" },
        { id: "C", from: "E", move: "straight", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q197",
    question: "Vous devez traverser deux voies pour prendre votre sortie. Quelle conduite est correcte?",
    options: [
      "Changer de voie une a la fois",
      "Couper les deux voies d un seul mouvement",
      "Freiner fort au centre et attendre",
      "Rouler sur l accotement pour rejoindre la sortie",
    ],
    correctOptionIndex: 0,
    explanation: "Un changement progressif, une voie a la fois, reduit les conflits lateraux.",
    difficulty: "moyenne",
    category: "Circulation",
    illustration: {
      kind: "intersection_4way",
      context: "A doit atteindre sa sortie sans couper brusquement plusieurs voies.",
      firstPassId: "A",
      controls: { N: "none", S: "none", E: "none", W: "none" },
      cars: [
        { id: "A", from: "S", move: "right", color: "#0f766e" },
        { id: "B", from: "S", move: "straight", color: "#2563eb" },
        { id: "C", from: "N", move: "straight", color: "#dc2626" },
      ],
    },
  },
  {
    id: "Q199",
    question: "Vous croisez un vehicule lourd en sens inverse. Quelle position est la plus sure dans votre voie?",
    options: [
      "Le tiers droit de votre voie",
      "Le centre de votre voie",
      "Le tiers gauche de votre voie",
      "L accotement",
    ],
    correctOptionIndex: 0,
    explanation: "Le tiers droit augmente la marge laterale avec le vehicule lourd.",
    difficulty: "moyenne",
    category: "Securite",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/heavy-vehicle-lane-third.svg",
      alt: "Croisement avec un camion en restant dans le tiers droit de la voie",
      overlayTag: "Securite",
      context: "Face a un vehicule lourd, gardez une marge laterale en restant au tiers droit.",
    },
  },
  {
    id: "Q200",
    question: "Feu vert, mais la sortie est completement bloquee. Que devez-vous faire?",
    options: [
      "Rester avant l intersection jusqu a degagement",
      "Avancer au centre pour reserver votre place",
      "Passer quand meme si vous etes presse",
      "Suivre le vehicule devant sans espace",
    ],
    correctOptionIndex: 0,
    explanation: "Le feu vert n autorise pas a bloquer une intersection sans espace de sortie.",
    difficulty: "difficile",
    category: "Circulation",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/scenes/blocked-intersection-queue.svg",
      alt: "Intersection bloquee en sortie malgre feu vert",
      overlayTag: "Circulation",
      context: "Attendre avant la ligne tant que vous ne pouvez pas degager l intersection.",
    },
  },
  {
    id: "Q201",
    question: "En reduction de voies dans une zone de travaux, quelle strategie est correcte?",
    options: [
      "Fusionner progressivement en alternance en gardant l espace",
      "Forcer l insertion au dernier moment sans clignotant",
      "S arreter en plein milieu de la voie fermee",
      "Utiliser l accotement pour depasser",
    ],
    correctOptionIndex: 0,
    explanation: "La fusion alternee previsible reduit les conflits et ameliore la fluidite en zone de travaux.",
    difficulty: "moyenne",
    category: "Zone de travaux",
    illustration: {
      kind: "photo",
      imageUrl: "/illustrations/signs/merge.svg",
      alt: "Panneau de reduction de voie et fusion",
      overlayTag: "Zone de travaux",
      context: "En reduction de voie, fusionnez progressivement sans forcer l insertion.",
    },
  },
];

const ILLUSTRATIONS_BY_ID: Partial<Record<string, QuestionIllustration>> = {
  Q021: {
    kind: "intersection_4way",
    context: "Intersection a 4 arrets. Ordre d arrivee: A, puis B, puis C.",
    firstPassId: "A",
    controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
    cars: [
      { id: "A", from: "N", move: "straight", color: "#0f766e" },
      { id: "B", from: "W", move: "straight", color: "#2563eb" },
      { id: "C", from: "S", move: "left", color: "#dc2626" },
    ],
  },
  Q026: {
    kind: "intersection_4way",
    context: "Feu vert normal. Le vehicule B est deja engage dans l intersection.",
    firstPassId: "B",
    controls: { N: "none", S: "none", E: "none", W: "none" },
    cars: [
      { id: "A", from: "S", move: "left", color: "#f97316" },
      { id: "B", from: "N", move: "straight", color: "#2563eb" },
      { id: "C", from: "E", move: "right", color: "#0f766e" },
    ],
  },
  Q033: {
    kind: "intersection_4way",
    context: "Intersection sans feux ni panneaux. A et B arrivent en meme temps; C arrive apres.",
    firstPassId: "B",
    controls: { N: "none", S: "none", E: "none", W: "none" },
    cars: [
      { id: "A", from: "S", move: "straight", color: "#0f766e" },
      { id: "B", from: "E", move: "straight", color: "#2563eb" },
      { id: "C", from: "W", move: "left", color: "#dc2626" },
    ],
  },
  Q069: {
    kind: "intersection_4way",
    context: "A a un panneau Cedez. B puis C circulent deja sur la route prioritaire.",
    firstPassId: "B",
    controls: { N: "none", S: "yield", E: "none", W: "none" },
    cars: [
      { id: "A", from: "S", move: "straight", color: "#0f766e" },
      { id: "B", from: "W", move: "straight", color: "#2563eb" },
      { id: "C", from: "E", move: "straight", color: "#dc2626" },
    ],
  },
  Q071: {
    kind: "intersection_4way",
    context: "A veut tourner a gauche pendant que B arrive en sens inverse.",
    firstPassId: "B",
    controls: { N: "none", S: "none", E: "none", W: "none" },
    cars: [
      { id: "A", from: "S", move: "left", color: "#0f766e" },
      { id: "B", from: "N", move: "straight", color: "#2563eb" },
      { id: "C", from: "W", move: "right", color: "#dc2626" },
    ],
  },
  Q108: {
    kind: "intersection_4way",
    context: "Intersection a 4 arrets. A s immobilise en premier, puis B, puis C.",
    firstPassId: "A",
    controls: { N: "stop", S: "stop", E: "stop", W: "stop" },
    cars: [
      { id: "A", from: "W", move: "right", color: "#0f766e" },
      { id: "B", from: "N", move: "straight", color: "#2563eb" },
      { id: "C", from: "E", move: "left", color: "#dc2626" },
    ],
  },
};

function localPhoto(
  imageUrl: string,
  alt: string,
  overlayTag: string,
  context: string,
  sourceLabel?: string,
  sourceUrl?: string
): QuestionIllustration {
  return {
    kind: "photo",
    imageUrl,
    alt,
    overlayTag,
    context,
    sourceLabel,
    sourceUrl,
  };
}

const QUEBEC_SIGNS_SOURCE_LABEL = "Panneau officiel Quebec (Wikimedia Commons)";
const QUEBEC_SIGNS_SOURCE_URL =
  "https://commons.wikimedia.org/wiki/Category:Road_signs_of_Quebec";

function officialSign(
  fileName: string,
  alt: string,
  overlayTag: string,
  context: string
): QuestionIllustration {
  return localPhoto(
    `/illustrations/quebec-signs/${fileName}`,
    alt,
    overlayTag,
    context,
    QUEBEC_SIGNS_SOURCE_LABEL,
    QUEBEC_SIGNS_SOURCE_URL
  );
}

const PHOTO_ILLUSTRATIONS_BY_ID: Partial<Record<string, QuestionIllustration>> = {
  Q001: localPhoto(
    "/illustrations/signs/stop-sign.svg",
    "Panneau arret vu en approche",
    "Signalisation",
    "Arret complet obligatoire avant de repartir."
  ),
  Q002: localPhoto(
    "/illustrations/signs/yield-sign.svg",
    "Panneau cedez le passage",
    "Signalisation",
    "Le passage doit etre cede a l usager prioritaire."
  ),
  Q003: localPhoto(
    "/illustrations/signs/road-closed-ahead.svg",
    "Panneau route barree",
    "Signalisation",
    "Lire la contrainte avant de poursuivre votre trajectoire."
  ),
  Q004: localPhoto(
    "/illustrations/signs/detour.svg",
    "Panneau detour directionnel",
    "Signalisation",
    "Suivre l itineraire indique, sans improviser."
  ),
  Q005: localPhoto(
    "/illustrations/signs/no-left.svg",
    "Interdiction de tourner a gauche",
    "Signalisation",
    "Une manoeuvre interdite reste interdite meme si la voie parait libre."
  ),
  Q006: localPhoto(
    "/illustrations/signs/no-right.svg",
    "Interdiction de tourner a droite",
    "Signalisation",
    "Identifier clairement l interdiction avant de s engager."
  ),
  Q007: localPhoto(
    "/illustrations/signs/no-parking.svg",
    "Interdiction de stationner",
    "Signalisation",
    "Stationner dans une zone interdite expose a une sanction."
  ),
  Q008: localPhoto(
    "/illustrations/signs/one-way.svg",
    "Panneau sens unique",
    "Signalisation",
    "Respecter la direction de circulation imposee."
  ),
  Q009: localPhoto(
    "/illustrations/signs/no-u-turn.svg",
    "Interdiction de demi-tour",
    "Signalisation",
    "Le demi-tour est interdit au point signale."
  ),
  Q010: localPhoto(
    "/illustrations/signs/bus-lane.svg",
    "Voie reservee bus et taxi",
    "Signalisation",
    "Une voie reservee ne peut pas etre utilisee par defaut."
  ),
  Q011: localPhoto(
    "/illustrations/signs/speed-50.svg",
    "Limite de vitesse 50 km h",
    "Vitesse",
    "La limite affichee fixe la vitesse maximale, pas la vitesse cible."
  ),
  Q012: localPhoto(
    "/illustrations/signs/speed-70.svg",
    "Limite de vitesse 70 km h",
    "Vitesse",
    "Adapter votre vitesse aux conditions en plus de la limite."
  ),
  Q013: localPhoto(
    "/illustrations/signs/school-zone.svg",
    "Signalisation de zone scolaire",
    "Zone scolaire",
    "Ralentir et anticiper les traverses imprevisibles."
  ),
  Q024: localPhoto(
    "/illustrations/signs/detour.svg",
    "Signalisation de fermeture et detour",
    "Zone de travaux",
    "Suivre les indications temporaires du chantier."
  ),
  Q028: localPhoto(
    "/illustrations/signs/bus-lane.svg",
    "Panneau de voie reservee",
    "Signalisation",
    "Verifier a qui la voie est autorisee."
  ),
  Q029: localPhoto(
    "/illustrations/signs/no-parking.svg",
    "Panneau interdiction de stationnement",
    "Signalisation",
    "Interdiction de stationner et de s immobiliser selon le contexte."
  ),
  Q040: localPhoto(
    "/illustrations/signs/railway.svg",
    "Signalisation de passage a niveau",
    "Passage a niveau",
    "Ne jamais s engager sans espace de sortie complet."
  ),
  Q046: localPhoto(
    "/illustrations/signs/work-zone.svg",
    "Signalisation de travaux routiers",
    "Zone de travaux",
    "Ralentir et suivre la signalisation orange."
  ),
  Q037: localPhoto(
    "/illustrations/scenes/school-bus-zone.svg",
    "Autobus scolaire en zone de ramassage",
    "Transport scolaire",
    "En presence d un autobus scolaire, reduisez la vitesse et restez pret a vous arreter."
  ),
  Q047: localPhoto(
    "/illustrations/signs/work-zone.svg",
    "Panneau chantier et danger temporaire",
    "Zone de travaux",
    "Anticiper voies reduites et travailleurs presents."
  ),
  Q048: localPhoto(
    "/illustrations/signs/work-zone.svg",
    "Panneaux orange annonçant une zone de travaux",
    "Zone de travaux",
    "En zone de chantier, adaptez immediatement votre vitesse et suivez la signalisation temporaire."
  ),
  Q051: localPhoto(
    "/illustrations/signs/mandatory-right.svg",
    "Direction obligatoire vers la droite",
    "Signalisation",
    "Une obligation directionnelle doit etre respectee."
  ),
  Q052: localPhoto(
    "/illustrations/signs/one-way.svg",
    "Panneau sens unique en secteur urbain",
    "Signalisation",
    "Le sens unique interdit toute circulation opposee."
  ),
  Q053: localPhoto(
    "/illustrations/signs/no-u-turn.svg",
    "Interdiction de demi-tour en intersection",
    "Signalisation",
    "Ne pas confondre virage et demi-tour."
  ),
  Q054: localPhoto(
    "/illustrations/signs/no-left.svg",
    "Interdiction de tourner a gauche a un carrefour",
    "Signalisation",
    "Le clignotant ne leve jamais une interdiction."
  ),
  Q055: localPhoto(
    "/illustrations/signs/no-right.svg",
    "Interdiction de tourner a droite",
    "Signalisation",
    "Attendre une zone autorisee pour tourner."
  ),
  Q056: localPhoto(
    "/illustrations/signs/no-parking.svg",
    "Interdiction de stationnement le long de la voie",
    "Signalisation",
    "Respecter les zones reservees et les restrictions locales."
  ),
  Q057: localPhoto(
    "/illustrations/signs/road-closed-ahead.svg",
    "Route fermee annoncee par panneau",
    "Signalisation",
    "Adapter l itineraire des l annonce de fermeture."
  ),
  Q058: localPhoto(
    "/illustrations/signs/detour.svg",
    "Panneau de detour obligatoire",
    "Signalisation",
    "Le detour previent un conflit avec une zone interdite."
  ),
  Q065: localPhoto(
    "/illustrations/signs/speed-100.svg",
    "Panneau limitation 100 km h",
    "Vitesse",
    "Sur route rapide, la limite reste un maximum legal."
  ),
  Q072: localPhoto(
    "/illustrations/signs/railway.svg",
    "Croisement ferroviaire signale",
    "Passage a niveau",
    "Surveiller feux, barrieres et espace de franchissement."
  ),
  Q078: localPhoto(
    "/illustrations/signs/work-zone.svg",
    "Signal de travaux et reduction de vitesse",
    "Zone de travaux",
    "En chantier, la marge de securite doit augmenter."
  ),
  Q079: localPhoto(
    "/illustrations/signs/merge.svg",
    "Signalisation d insertion en voie retrecie",
    "Zone de travaux",
    "Fusionner une voie a la fois et conserver l espace."
  ),
};

const OFFICIAL_SIGN_ILLUSTRATIONS_BY_ID: Partial<Record<string, QuestionIllustration>> = {
  Q001: officialSign(
    "qc-p010-stop.svg",
    "Panneau ARRET officiel du Quebec",
    "Signalisation",
    "Arret complet obligatoire."
  ),
  Q002: officialSign(
    "qc-p020-cede.svg",
    "Panneau CEDEZ officiel du Quebec",
    "Signalisation",
    "Ceder le passage aux usagers prioritaires."
  ),
  Q003: officialSign(
    "qc-p040-route-barree.svg",
    "Panneau route barree",
    "Signalisation",
    "Route fermee dans cette direction."
  ),
  Q005: officialSign(
    "qc-no-left-turn.svg",
    "Interdiction de tourner a gauche",
    "Signalisation",
    "Virage a gauche interdit."
  ),
  Q006: officialSign(
    "qc-no-right-turn.svg",
    "Interdiction de tourner a droite",
    "Signalisation",
    "Virage a droite interdit."
  ),
  Q011: officialSign(
    "qc-p070-50.svg",
    "Panneau maximum 50",
    "Vitesse",
    "Vitesse maximale autorisee: 50 km/h."
  ),
  Q012: officialSign(
    "qc-d070-70-recommandee.svg",
    "Panneau avance de limite maximum 70",
    "Vitesse",
    "Annonce qu une zone de 70 km/h commence plus loin."
  ),
  Q013: officialSign(
    "qc-d010-1-zone-scolaire.svg",
    "Panneau avance ARRET en zone scolaire",
    "Zone scolaire",
    "Annonce un arret a venir en zone scolaire."
  ),
  Q024: officialSign(
    "qc-p040-route-barree.svg",
    "Panneau route barree",
    "Signalisation",
    "Panneau de fermeture de route."
  ),
  Q029: officialSign(
    "qc-p100-x-rouge-voie.svg",
    "Signal lumineux X rouge au-dessus d une voie",
    "Signalisation",
    "La voie marquee par X rouge est interdite."
  ),
  Q051: officialSign(
    "qc-p110-1.svg",
    "Panneau obligation d aller tout droit",
    "Signalisation",
    "Direction obligatoire tout droit."
  ),
  Q052: officialSign(
    "qc-p110-4.svg",
    "Panneau obligation tourner a gauche ou a droite",
    "Signalisation",
    "Obligation de tourner a droite ou a gauche."
  ),
  Q053: officialSign(
    "qc-p040-entree-interdite.svg",
    "Panneau entree interdite",
    "Signalisation",
    "Acces interdit dans cette direction."
  ),
  Q054: officialSign(
    "qc-p010-stop.svg",
    "Panneau ARRET officiel du Quebec",
    "Signalisation",
    "Arret complet obligatoire."
  ),
  Q055: officialSign(
    "qc-p030-priorite-sens-inverse.svg",
    "Panneau priorite au sens inverse",
    "Signalisation",
    "Vous devez ceder a la circulation venant en sens inverse."
  ),
  Q056: officialSign(
    "qc-d040-1.svg",
    "Panneau ARRET ENLEVE DATE",
    "Signalisation",
    "Suppression d une obligation d arret a la date indiquee."
  ),
  Q057: officialSign(
    "qc-p040-route-barree.svg",
    "Panneau route barree",
    "Signalisation",
    "Route fermee a la circulation."
  ),
  Q058: officialSign(
    "qc-d120-45.svg",
    "Panneau sortie 45 km h",
    "Signalisation",
    "Vitesse conseillee pour la bretelle de sortie."
  ),
  Q065: officialSign(
    "qc-p070-100.svg",
    "Panneau maximum 100",
    "Vitesse",
    "Vitesse maximale autorisee: 100 km/h."
  ),
  Q072: officialSign(
    "qc-d180-1.svg",
    "Panneau passage a niveau",
    "Passage a niveau",
    "Annonce un passage a niveau a l avance."
  ),
  Q078: officialSign(
    "qc-d350.svg",
    "Panneau chaussee cahoteuse",
    "Signalisation",
    "Chaussee irreguliere: ralentir et garder vos distances."
  ),
  Q079: officialSign(
    "qc-d360.svg",
    "Panneau chute de pierres",
    "Signalisation",
    "Risque de chute de pierres."
  ),
  Q161: officialSign(
    "qc-no-right-on-red.svg",
    "Interdiction de tourner a droite au feu rouge",
    "Signalisation",
    "Virage a droite interdit lorsque le feu est rouge."
  ),
};

function makeOverrideQuestion(
  id: string,
  question: string,
  options: [string, string, string, string],
  correctOptionIndex: number,
  explanation: string
): Question {
  return {
    id,
    question,
    options,
    correctOptionIndex,
    explanation,
    difficulty: difficultyForId(id),
    category: categoryById[id] ?? "Securite",
  };
}

const QUESTION_OVERRIDES: Partial<Record<string, Question>> = {
  Q001: makeOverrideQuestion(
    "Q001",
    "Ce panneau ARRET vous oblige a :",
    [
      "Faire un arret complet avant la ligne ou le passage pieton.",
      "Ralentir seulement si un vehicule approche.",
      "Ceder le passage sans vous immobiliser.",
      "Passer en premier si l intersection semble libre.",
    ],
    0,
    "Au panneau ARRET, l arret complet est obligatoire, puis vous cedez le passage selon la priorite."
  ),
  Q002: makeOverrideQuestion(
    "Q002",
    "Au panneau CEDEZ, vous devez :",
    [
      "Ralentir et ceder le passage; vous arreter seulement si necessaire.",
      "Toujours vous immobiliser completement, meme sans usager.",
      "Passer avant les vehicules venant de gauche.",
      "Accrocher la voie prioritaire sans ralentir.",
    ],
    0,
    "Un CEDEZ impose de laisser passer les usagers prioritaires. L arret complet n est requis que si necessaire."
  ),
  Q003: makeOverrideQuestion(
    "Q003",
    "Ce panneau indique :",
    [
      "Route fermee a la circulation dans cette direction.",
      "Detour obligatoire vers la gauche.",
      "Stationnement interdit sur 100 m.",
      "Voie reservee aux autobus.",
    ],
    0,
    "Le panneau indique une fermeture de route dans la direction montree."
  ),
  Q004: makeOverrideQuestion(
    "Q004",
    "Un panneau DETOUR avec fleche signifie :",
    [
      "Vous devez suivre l itineraire de deviation indique.",
      "Vous pouvez ignorer le panneau si la voie semble libre.",
      "La route est fermee definitivement.",
      "Le depassement est obligatoire.",
    ],
    0,
    "Le panneau DETOUR sert a rediriger temporairement la circulation."
  ),
  Q005: makeOverrideQuestion(
    "Q005",
    "Un panneau d interdiction de tourner a gauche signifie :",
    [
      "Le virage a gauche est interdit a cet endroit.",
      "Le virage a gauche est permis en l absence de pietons.",
      "Le virage a gauche est permis apres un arret complet.",
      "Le virage a gauche est reserve aux autobus.",
    ],
    0,
    "Une interdiction de virage s applique en tout temps sauf indication contraire explicite."
  ),
  Q006: makeOverrideQuestion(
    "Q006",
    "Un panneau d interdiction de tourner a droite signifie :",
    [
      "Le virage a droite est interdit a cet endroit.",
      "Le virage a droite est permis apres un arret complet.",
      "Le virage a droite est permis si la voie est libre.",
      "Le virage a droite est reserve aux taxis.",
    ],
    0,
    "Le virage a droite est interdit au point signale."
  ),
  Q007: makeOverrideQuestion(
    "Q007",
    "Un panneau d interdiction de stationner signifie :",
    [
      "Vous ne pouvez pas stationner dans la zone indiquee.",
      "Vous pouvez stationner moins de 15 minutes.",
      "Vous pouvez vous arreter et quitter le vehicule.",
      "L interdiction s applique seulement la nuit.",
    ],
    0,
    "L interdiction de stationner s applique selon les conditions du panneau et de la zone."
  ),
  Q008: makeOverrideQuestion(
    "Q008",
    "Un panneau sens unique indique :",
    [
      "La circulation est autorisee dans une seule direction.",
      "La circulation est interdite a tous les vehicules.",
      "Le depassement est obligatoire.",
      "La voie est reservee aux autobus.",
    ],
    0,
    "Sur une voie a sens unique, circuler en sens inverse est interdit."
  ),
  Q009: makeOverrideQuestion(
    "Q009",
    "Un panneau d interdiction de demi-tour signifie :",
    [
      "Le demi-tour est interdit a cet endroit.",
      "Le demi-tour est permis apres avoir cede le passage.",
      "Le demi-tour est permis la nuit seulement.",
      "Le demi-tour est permis si aucun pieton n est present.",
    ],
    0,
    "Le demi-tour est interdit au point signale."
  ),
  Q010: makeOverrideQuestion(
    "Q010",
    "Ce panneau BUS TAXI indique :",
    [
      "Une voie reservee aux autobus et aux taxis.",
      "Une aire d attente de transport collectif.",
      "Une voie obligatoire pour tous les vehicules.",
      "Un arret d autobus obligatoire.",
    ],
    0,
    "La voie marquee BUS TAXI est reservee aux categories indiquees."
  ),
  Q011: makeOverrideQuestion(
    "Q011",
    "Que signifie le panneau MAXIMUM 50?",
    [
      "La vitesse maximale autorisee est 50 km/h.",
      "La vitesse conseillee est 50 km/h.",
      "La vitesse minimale est 50 km/h.",
      "Vous devez rouler exactement a 50 km/h.",
    ],
    0,
    "MAXIMUM indique une limite legale a ne pas depasser."
  ),
  Q012: makeOverrideQuestion(
    "Q012",
    "Ce panneau jaune avec MAXIMUM 70 annonce :",
    [
      "Une zone de vitesse maximale 70 km/h plus loin.",
      "Une vitesse minimale de 70 km/h immediatement.",
      "Une vitesse conseillee de 70 km/h dans la courbe.",
      "La fin de toute limitation de vitesse.",
    ],
    0,
    "Ce panneau est un avertissement avance: la limite maximale de 70 km/h debute plus loin."
  ),
  Q013: makeOverrideQuestion(
    "Q013",
    "Ce panneau jaune avec ARRET signifie :",
    [
      "Un panneau ARRET est annonce plus loin.",
      "Vous devez vous arreter immediatement a ce panneau.",
      "Le virage a gauche est interdit au prochain carrefour.",
      "La priorite est donnee au sens inverse.",
    ],
    0,
    "Ce panneau avertit de la presence d un ARRET a venir."
  ),
  Q024: makeOverrideQuestion(
    "Q024",
    "Que signifie ce panneau?",
    [
      "Route fermee dans cette direction.",
      "Detour obligatoire a droite.",
      "Stationnement interdit sur cette rue.",
      "Fin de limitation de vitesse.",
    ],
    0,
    "Ce panneau indique que la route est fermee dans la direction signalee."
  ),
  Q028: makeOverrideQuestion(
    "Q028",
    "Ce panneau indique une voie reservee BUS TAXI. Vous conduisez une auto. Que devez-vous faire?",
    [
      "Rester hors de cette voie, sauf exception indiquee.",
      "Utiliser la voie en tout temps si elle est libre.",
      "Utiliser la voie seulement pour depasser.",
      "Vous y arreter pour laisser passer les autobus.",
    ],
    0,
    "Une auto ne doit pas circuler dans une voie reservee, sauf exceptions affichees."
  ),
  Q029: makeOverrideQuestion(
    "Q029",
    "Un X rouge au-dessus d une voie indique :",
    [
      "Qu il est interdit de circuler dans cette voie.",
      "Que vous devez vous y arreter.",
      "Que vous devez reduire de 30 km/h.",
      "Que cette voie est prioritaire.",
    ],
    0,
    "Le X rouge signifie voie fermee ou interdite a la circulation."
  ),
  Q051: makeOverrideQuestion(
    "Q051",
    "Ce panneau circulaire vert avec fleche vers le haut indique :",
    [
      "Direction obligatoire tout droit.",
      "Sens unique.",
      "Interdiction de demi-tour.",
      "Voie reservee aux autobus.",
    ],
    0,
    "Ce panneau impose une direction obligatoire: tout droit."
  ),
  Q052: makeOverrideQuestion(
    "Q052",
    "Ce panneau circulaire vert avec deux fleches indique :",
    [
      "Vous devez tourner soit a droite, soit a gauche.",
      "Vous devez aller tout droit.",
      "Vous pouvez faire demi-tour.",
      "Vous devez vous arreter.",
    ],
    0,
    "Ce panneau impose un choix de virage: gauche ou droite, sans aller tout droit."
  ),
  Q053: makeOverrideQuestion(
    "Q053",
    "Ce panneau rouge (sens interdit) signifie :",
    [
      "Acces interdit dans cette direction.",
      "Stationnement interdit.",
      "Arret obligatoire avant de passer.",
      "Voie reservee aux autobus.",
    ],
    0,
    "Le panneau sens interdit interdit l entree dans cette direction."
  ),
  Q054: makeOverrideQuestion(
    "Q054",
    "Le panneau ARRET signifie :",
    [
      "Arret complet obligatoire puis ceder le passage.",
      "Ralentir sans vous immobiliser.",
      "Passer en premier apres un coup de klaxon.",
      "Arret obligatoire seulement si un pieton traverse.",
    ],
    0,
    "Au panneau ARRET, vous devez immobiliser completement le vehicule."
  ),
  Q055: makeOverrideQuestion(
    "Q055",
    "Ce panneau de priorite indique :",
    [
      "Vous devez ceder le passage aux vehicules en sens inverse.",
      "Vous avez priorite sur les vehicules en sens inverse.",
      "Le depassement est obligatoire.",
      "La route est fermee.",
    ],
    0,
    "Ce panneau signifie priorite au sens inverse: vous devez ceder."
  ),
  Q056: makeOverrideQuestion(
    "Q056",
    "Le panneau ARRET ENLEVE DATE signifie :",
    [
      "L obligation d arret est retiree a partir de la date indiquee.",
      "Vous devez arreter plus longtemps a la date indiquee.",
      "La route sera fermee a la date indiquee.",
      "Le stationnement est interdit jusqu a la date indiquee.",
    ],
    0,
    "Ce panneau annonce la suppression d une obligation d arret a la date mentionnee."
  ),
  Q057: makeOverrideQuestion(
    "Q057",
    "Le panneau ROUTE FERMEE indique :",
    [
      "Aucun passage autorise dans cette direction.",
      "Detour optionnel.",
      "Passage autorise pour tous les vehicules legers.",
      "Fin de zone de travaux.",
    ],
    0,
    "ROUTE FERMEE signifie que la circulation est interdite dans la direction indiquee."
  ),
  Q058: makeOverrideQuestion(
    "Q058",
    "Le panneau SORTIE 45 km/h signifie :",
    [
      "Vitesse conseillee dans la bretelle de sortie.",
      "Nouvelle limite legale minimale de 45 km/h.",
      "Vitesse maximale de toute l autoroute: 45 km/h.",
      "Interdiction de sortir au-dela de 45 km/h.",
    ],
    0,
    "Ce panneau donne une vitesse recommandee pour prendre la sortie de facon securitaire."
  ),
  Q065: makeOverrideQuestion(
    "Q065",
    "Que signifie le panneau MAXIMUM 100?",
    [
      "La vitesse maximale autorisee est 100 km/h.",
      "La vitesse minimale est 100 km/h.",
      "Vous devez rouler exactement a 100 km/h.",
      "Vous pouvez depasser 100 km/h pour depasser un vehicule.",
    ],
    0,
    "MAXIMUM indique une limite legale, pas une vitesse minimale ni obligatoire."
  ),
  Q072: makeOverrideQuestion(
    "Q072",
    "Ce panneau annonce :",
    [
      "Un passage a niveau plus loin.",
      "Une intersection en croix.",
      "Une route fermee.",
      "Une voie reservee au transport en commun.",
    ],
    0,
    "Ce panneau avertit d un passage a niveau en approche."
  ),
  Q078: makeOverrideQuestion(
    "Q078",
    "Ce panneau avertit :",
    [
      "Chaussee cahoteuse.",
      "Route glissante a cause de l eau.",
      "Passage a niveau.",
      "Voie reservee aux camions.",
    ],
    0,
    "La chaussee cahoteuse exige de ralentir et de conserver une bonne maitrise du vehicule."
  ),
  Q079: makeOverrideQuestion(
    "Q079",
    "Ce panneau jaune de danger indique :",
    [
      "Risque de chute de pierres.",
      "Presence d une voie d acceleration.",
      "Debut d une route en gravier.",
      "Arret obligatoire a l intersection suivante.",
    ],
    0,
    "Ce panneau signale un secteur ou des pierres peuvent tomber sur la chaussee."
  ),
  Q161: makeOverrideQuestion(
    "Q161",
    "Ce panneau indique :",
    [
      "Interdiction de tourner a droite au feu rouge.",
      "Interdiction de tourner a droite en tout temps.",
      "Obligation de tourner a droite au feu vert.",
      "Interdiction de depasser un vehicule par la droite.",
    ],
    0,
    "Ce panneau interdit le virage a droite lorsque le feu est rouge."
  ),
};

const ALL_IDS = Object.keys(categoryById).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1))
);

function difficultyForId(id: string): Difficulty {
  if (EASY_IDS.includes(id as (typeof EASY_IDS)[number])) return "facile";
  if (MEDIUM_IDS.includes(id as (typeof MEDIUM_IDS)[number])) return "moyenne";
  return "difficile";
}

function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function pickThreeUnique(items: string[], seed: number): [string, string, string] {
  const rng = makeRng(seed);
  const pool = [...new Set(items)];
  const picked: string[] = [];
  while (picked.length < 3) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return [picked[0], picked[1], picked[2]];
}

function shuffleOptions(
  options: string[],
  seed: number
): [string, string, string, string] {
  const rng = makeRng(seed);
  const out = [...options];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return [out[0], out[1], out[2], out[3]];
}

function normalizeQuestionText(text: string): string {
  return text.trim().toLowerCase();
}

function buildQuestion(id: string, promptShift = 0, suffixShift = 0): Question {
  const n = Number(id.slice(1));
  const category = categoryById[id] ?? "Securite";
  const difficulty = difficultyForId(id);
  const situations = CATEGORY_SITUATIONS[category] ?? CATEGORY_SITUATIONS.Securite;
  const situation = situations[n % situations.length];
  const prompt = DIRECT_PROMPTS[
    (n * 7 + category.length + promptShift) % DIRECT_PROMPTS.length
  ];
  const suffix = DIRECT_SUFFIXES[
    (n * 11 + category.length + suffixShift) % DIRECT_SUFFIXES.length
  ];

  const correct = CATEGORY_CORRECT_ACTION[category] ?? CATEGORY_CORRECT_ACTION.Securite;
  const wrongPool = [
    ...(CATEGORY_WRONG_ACTIONS[category] ?? []),
    ...COMMON_WRONG_ACTIONS,
  ].filter((opt) => opt !== correct);
  const wrong = pickThreeUnique(wrongPool, n * 13 + 17);
  const options = shuffleOptions([correct, ...wrong], n * 7 + 11);
  const correctOptionIndex = options.findIndex((opt) => opt === correct);

  return {
    id,
    category,
    difficulty,
    question: `${situation} ${prompt}${suffix ? ` ${suffix}` : ""}`,
    options,
    correctOptionIndex,
    explanation:
      `${correct} Cette action respecte la regle et reduit le risque de collision. ` +
      EXPLANATION_HINTS[n % EXPLANATION_HINTS.length],
  };
}

const GENERATED_QUESTIONS: Question[] = (() => {
  const usedTexts = new Set<string>();
  const out: Question[] = [];

  for (const id of ALL_IDS) {
    const override = QUESTION_OVERRIDES[id];
    if (override) {
      out.push(override);
      usedTexts.add(normalizeQuestionText(override.question));
      continue;
    }

    let candidate = buildQuestion(id);
    let foundUnique = !usedTexts.has(normalizeQuestionText(candidate.question));

    if (!foundUnique) {
      for (let promptShift = 0; promptShift < DIRECT_PROMPTS.length && !foundUnique; promptShift++) {
        for (let suffixShift = 0; suffixShift < DIRECT_SUFFIXES.length && !foundUnique; suffixShift++) {
          candidate = buildQuestion(id, promptShift + 1, suffixShift + 1);
          foundUnique = !usedTexts.has(normalizeQuestionText(candidate.question));
        }
      }
    }

    out.push(candidate);
    usedTexts.add(normalizeQuestionText(candidate.question));
  }

  return out;
})();

export const QUESTION_BANK: Question[] = [
  ...GENERATED_QUESTIONS,
  ...ESSENTIAL_QUESTIONS,
  ...NEW_SCENARIO_QUESTIONS,
]
  .sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)))
  .map((question) => {
    const illustration =
      question.illustration ??
      ILLUSTRATIONS_BY_ID[question.id] ??
      OFFICIAL_SIGN_ILLUSTRATIONS_BY_ID[question.id] ??
      PHOTO_ILLUSTRATIONS_BY_ID[question.id];
    if (!illustration) return question;
    return { ...question, illustration };
  });

const QUESTION_INDEX = new Map(
  QUESTION_BANK.map((question) => [question.id, question])
);

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_INDEX.get(id);
}

export const QUESTION_STATS = {
  total: QUESTION_BANK.length,
  easy: EASY_IDS.length,
  medium: MEDIUM_IDS.length,
  hard: HARD_IDS.length,
  categories: Array.from(new Set(QUESTION_BANK.map((q) => q.category))).length,
};
