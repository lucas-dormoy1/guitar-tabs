import { ETIREMENT_MAX, type DimensionsTablature } from "../theme/tablature";
import type { Mesure, Note, Section } from "../types/chanson";

export type MesurePlacee = {
  numero: number;
  indexSection: number;
  indexMesure: number;
  x: number;
  largeur: number;
  largeurPas: number;
  pas: number;
  notes: Note[];
};

export type SystemePlace = {
  y: number;
  hauteur: number;
  yCordes: number;
  largeur: number;
  mesures: MesurePlacee[];
  nomSection: string | null;
  repetitions: number;
  debutSection: boolean;
  finSection: boolean;
};

export type LayoutTablature = {
  systemes: SystemePlace[];
  largeurTotale: number;
  hauteurTotale: number;
};

type Groupe = {
  mesures: Mesure[];
  premierNumero: number;
  premierIndex: number;
};

function largeurNominale(pas: number, dims: DimensionsTablature): number {
  return pas * dims.largeurPas + dims.padMesure * 2;
}

function fermerGroupe(
  mesures: Mesure[],
  numero: number,
  premierNumeroSection: number
): Groupe {
  const premierNumero = numero - mesures.length;
  return {
    mesures,
    premierNumero,
    premierIndex: premierNumero - premierNumeroSection,
  };
}

function grouperEnSystemes(
  section: Section,
  largeurUtile: number,
  dims: DimensionsTablature,
  premierNumero: number
): Groupe[] {
  const groupes: Groupe[] = [];
  let mesures: Mesure[] = [];
  let largeurCourante = 0;
  let numero = premierNumero;

  for (const mesure of section.mesures) {
    const largeur = largeurNominale(mesure.pas, dims);
    if (mesures.length > 0 && largeurCourante + largeur > largeurUtile) {
      groupes.push(fermerGroupe(mesures, numero, premierNumero));
      mesures = [];
      largeurCourante = 0;
    }
    mesures.push(mesure);
    largeurCourante += largeur;
    numero += 1;
  }

  if (mesures.length > 0) {
    groupes.push(fermerGroupe(mesures, numero, premierNumero));
  }

  return groupes;
}

function justifier(groupe: Groupe, largeurUtile: number, dims: DimensionsTablature): number {
  const totalPas = groupe.mesures.reduce((total, mesure) => total + mesure.pas, 0);
  const espaceFixe = groupe.mesures.length * dims.padMesure * 2;
  const ideale = (largeurUtile - espaceFixe) / totalPas;
  return Math.min(ideale, dims.largeurPas * ETIREMENT_MAX);
}

export function calculerLayout(
  sections: Section[],
  largeurDisponible: number,
  dims: DimensionsTablature
): LayoutTablature {
  const systemes: SystemePlace[] = [];
  const largeurUtile = Math.max(largeurDisponible - dims.largeurEnTete, dims.largeurPas);
  let y = 0;
  let numero = 1;

  sections.forEach((section, indexSection) => {
    const groupes = grouperEnSystemes(section, largeurUtile, dims, numero);
    numero += section.mesures.length;

    groupes.forEach((groupe, index) => {
      const debutSection = index === 0;
      const finSection = index === groupes.length - 1;
      const largeurPas = justifier(groupe, largeurUtile, dims);

      let x = dims.largeurEnTete;
      const mesures = groupe.mesures.map((mesure, position) => {
        const largeur = mesure.pas * largeurPas + dims.padMesure * 2;
        const placee: MesurePlacee = {
          numero: groupe.premierNumero + position,
          indexSection,
          indexMesure: groupe.premierIndex + position,
          x,
          largeur,
          largeurPas,
          pas: mesure.pas,
          notes: mesure.notes,
        };
        x += largeur;
        return placee;
      });

      const hauteur =
        (debutSection ? dims.hauteurLabelSection : 0) +
        dims.margeHaut +
        dims.espacementCordes * 5 +
        dims.margeBas;

      systemes.push({
        y,
        hauteur,
        yCordes: y + (debutSection ? dims.hauteurLabelSection : 0) + dims.margeHaut,
        largeur: x,
        mesures,
        nomSection: debutSection ? section.nom : null,
        repetitions: section.repetitions,
        debutSection,
        finSection,
      });

      y += hauteur + dims.espaceEntreSystemes;
    });
  });

  const dernier = systemes[systemes.length - 1];

  return {
    systemes,
    largeurTotale: systemes.reduce((max, systeme) => Math.max(max, systeme.largeur), 0),
    hauteurTotale: dernier ? dernier.y + dernier.hauteur : 0,
  };
}

export function yCorde(systeme: SystemePlace, corde: number, dims: DimensionsTablature): number {
  return systeme.yCordes + (corde - 1) * dims.espacementCordes;
}

export function xPas(mesure: MesurePlacee, pas: number, dims: DimensionsTablature): number {
  return mesure.x + dims.padMesure + (pas + 0.5) * mesure.largeurPas;
}

export function noteSuivanteSurCorde(mesure: MesurePlacee, note: Note): Note | null {
  const candidates = mesure.notes
    .filter((autre) => autre.corde === note.corde && autre.pas > note.pas)
    .sort((a, b) => a.pas - b.pas);
  return candidates[0] ?? null;
}
