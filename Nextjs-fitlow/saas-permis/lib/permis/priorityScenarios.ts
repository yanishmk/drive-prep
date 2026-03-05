import type { PriorityScenario } from "@/lib/permis/types";

export const PRIORITY_SCENARIOS: PriorityScenario[] = [
  {
    id: 1,
    titre: "Arret 4 directions, 3 voitures",
    sceneVueDessus:
      "Intersection en croix avec panneau Arret sur chaque branche.",
    positionsVoitures:
      "A au nord (0,+30), B a l est (+30,0), C au sud (0,-30).",
    directions:
      "A va tout droit vers le sud, B va tout droit vers l ouest, C tourne a gauche vers l est.",
    passeEnPremier: "A passe en premier.",
  },
  {
    id: 2,
    titre: "Arret 4 directions, arrivee simultanee a 2",
    sceneVueDessus:
      "Intersection en croix reglee par Arret dans toutes les directions.",
    positionsVoitures: "A a l ouest (-30,0), B au sud (0,-30).",
    directions: "A va tout droit vers l est, B va tout droit vers le nord.",
    passeEnPremier: "B passe en premier (priorite a droite).",
  },
  {
    id: 3,
    titre: "Route prioritaire vs route secondaire",
    sceneVueDessus:
      "Croisement en croix, Arret seulement sur l axe nord-sud.",
    positionsVoitures: "A au nord (0,+30), B a l ouest (-30,0).",
    directions: "A traverse vers le sud, B continue tout droit vers l est.",
    passeEnPremier: "B passe en premier (route prioritaire).",
  },
  {
    id: 4,
    titre: "Feu vert oppose: tout droit vs virage gauche",
    sceneVueDessus:
      "Intersection avec feux, sans fleche de virage protegee.",
    positionsVoitures: "A au nord (0,+30), B au sud (0,-30).",
    directions: "A tourne a gauche vers l est, B va tout droit vers le nord.",
    passeEnPremier: "B passe en premier.",
  },
  {
    id: 5,
    titre: "Intersection en T",
    sceneVueDessus:
      "Route principale est-ouest, branche sud qui se termine sur la principale.",
    positionsVoitures: "A sur la branche sud (0,-30), B a l ouest (-30,0).",
    directions: "A veut tourner a gauche vers l est, B continue tout droit vers l est.",
    passeEnPremier: "B passe en premier.",
  },
  {
    id: 6,
    titre: "Carrefour giratoire a 1 voie",
    sceneVueDessus:
      "Giratoire simple avec une voie de circulation autour d un ilot central.",
    positionsVoitures:
      "A deja engage dans l anneau au nord (0,+15), B en attente a l entree ouest (-35,0).",
    directions: "A va vers la sortie ouest, B veut entrer pour aller au sud.",
    passeEnPremier: "A passe en premier (vehicule deja dans l anneau).",
  },
  {
    id: 7,
    titre: "Virage a droite au rouge",
    sceneVueDessus:
      "Intersection a feux, axe nord-sud au vert, axe est-ouest au rouge.",
    positionsVoitures: "A a l est (+30,0), B au nord (0,+30).",
    directions:
      "A veut tourner a droite vers le sud au rouge, B va tout droit vers le sud avec feu vert.",
    passeEnPremier: "B passe en premier.",
  },
  {
    id: 8,
    titre: "Rouge clignotant vs jaune clignotant",
    sceneVueDessus:
      "Intersection en croix avec signalisation differente selon l axe.",
    positionsVoitures: "A a l ouest (-30,0), B au sud (0,-30).",
    directions: "A va tout droit vers l est, B va tout droit vers le nord.",
    passeEnPremier: "A passe en premier (B doit arret complet et ceder).",
  },
  {
    id: 9,
    titre: "Autobus scolaire a l arret",
    sceneVueDessus:
      "Route a double sens sans terre-plein, autobus scolaire a l arret au centre.",
    positionsVoitures:
      "A derriere l autobus (0,-25), B en sens inverse devant l autobus (0,+25).",
    directions: "A roule vers le nord, B roule vers le sud.",
    passeEnPremier:
      "Aucune voiture ne passe tant que les feux rouges/panneau Arret sont actifs.",
  },
  {
    id: 10,
    titre: "Vehicule d urgence en intervention",
    sceneVueDessus:
      "Intersection a feux avec ambulance signaux actifs arrivant de l ouest.",
    positionsVoitures: "A (ambulance) a l ouest (-30,0), B au nord (0,+30), C au sud (0,-30).",
    directions:
      "A traverse vers l est; B et C voulaient poursuivre tout droit.",
    passeEnPremier: "A (vehicule d urgence) passe en premier.",
  },
];
