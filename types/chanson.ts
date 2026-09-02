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

export type MesureAccords = {
  accords: string[];
  paroles?: string;
};

export type SectionBase<TMesure> = {
  id: string;
  nom: string;
  repetitions: number;
  mesures: TMesure[];
};

export type Section = SectionBase<Mesure>;

export type SectionAccords = SectionBase<MesureAccords>;

export type PositionMesure = {
  section: number;
  mesure: number;
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
  sections: SectionAccords[];
  mesuresParLigne: number;
};

export type Chanson = ChansonArpege | ChansonAccords;

export const ACCORDAGE_STANDARD = ["E", "A", "D", "G", "B", "e"];

export function lettreCorde(accordage: string[], corde: Corde): string {
  return accordage[accordage.length - corde] ?? "";
}

export const CAPO_MAX = 12;

export function libelleCapo(capo: number | undefined): string {
  if (!capo) {
    return "Aucun";
  }
  return capo === 1 ? "1re case" : `${capo}e case`;
}
