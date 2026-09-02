export type Technique = "hammer" | "pull" | "slide-up" | "slide-down" | "bend" | "mute";

export type Corde = 1 | 2 | 3 | 4 | 5 | 6;

export type Note = {
  corde: Corde;
  frette: number;
  pas: number;
  technique?: Technique;
};

export type Mesure = {
  pas: number;
  notes: Note[];
};

export type Section = {
  id: string;
  nom: string;
  repetitions: number;
  mesures: Mesure[];
};

export type StatutApprentissage = "a-apprendre" | "en-cours" | "maitrisee";

type ChansonBase = {
  id: string;
  titre: string;
  artiste: string;
  statut: StatutApprentissage;
  bpm?: number;
  tonalite?: string;
  capo?: number;
  notes?: string;
  creeLe: string;
  majLe: string;
};

export type ChansonArpege = ChansonBase & {
  format: "arpege";
  accordage: string[];
  sections: Section[];
};

export type ChansonAccords = ChansonBase & {
  format: "accords";
  contenu: string;
};

export type Chanson = ChansonArpege | ChansonAccords;

export const ACCORDAGE_STANDARD = ["E", "A", "D", "G", "B", "e"];

export function lettreCorde(accordage: string[], corde: Corde): string {
  return accordage[accordage.length - corde] ?? "";
}

export function compterMesures(chanson: ChansonArpege): number {
  return chanson.sections.reduce((total, section) => total + section.mesures.length, 0);
}
