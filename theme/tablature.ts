export type DimensionsTablature = {
  espacementCordes: number;
  largeurPas: number;
  padMesure: number;
  largeurEnTete: number;
  margeHaut: number;
  margeBas: number;
  hauteurLabelSection: number;
  espaceEntreSystemes: number;
  tailleFrette: number;
  tailleTechnique: number;
  tailleEnTete: number;
  tailleLabelSection: number;
  tailleNumeroMesure: number;
  epaisseurCorde: number;
  epaisseurBarre: number;
};

export const ECHELLES = {
  S: 0.85,
  M: 1,
  L: 1.25,
} as const;

export const LARGEUR_MAX = 560;

export const ETIREMENT_MAX = 1.5;

export type NomEchelle = keyof typeof ECHELLES;

export function dimensionsTablature(echelle: number): DimensionsTablature {
  return {
    espacementCordes: 15 * echelle,
    largeurPas: 17 * echelle,
    padMesure: 9 * echelle,
    largeurEnTete: 22 * echelle,
    margeHaut: 14 * echelle,
    margeBas: 12 * echelle,
    hauteurLabelSection: 26 * echelle,
    espaceEntreSystemes: 10 * echelle,
    tailleFrette: 12 * echelle,
    tailleTechnique: 9 * echelle,
    tailleEnTete: 10 * echelle,
    tailleLabelSection: 11 * echelle,
    tailleNumeroMesure: 9 * echelle,
    epaisseurCorde: 1,
    epaisseurBarre: 1.2,
  };
}
