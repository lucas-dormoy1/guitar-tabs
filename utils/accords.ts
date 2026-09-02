import type { MesureAccords } from "../types/chanson";

const HAUTEURS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const MOTIF_ACCORD = /^([A-G])([#b]?)([^/]*)(?:\/([A-G])([#b]?))?$/;

export const RACINES = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

export const SUFFIXES = [
  { valeur: "", libelle: "maj" },
  { valeur: "m", libelle: "m" },
  { valeur: "7", libelle: "7" },
  { valeur: "m7", libelle: "m7" },
  { valeur: "maj7", libelle: "maj7" },
  { valeur: "sus2", libelle: "sus2" },
  { valeur: "sus4", libelle: "sus4" },
  { valeur: "5", libelle: "5" },
  { valeur: "6", libelle: "6" },
  { valeur: "9", libelle: "9" },
  { valeur: "dim", libelle: "dim" },
  { valeur: "aug", libelle: "aug" },
  { valeur: "add9", libelle: "add9" },
] as const;

export type AccordAnalyse = {
  racine: string;
  hauteur: number;
  suffixe: string;
  basse: string | null;
};

export type CelluleAccords = {
  mesure: MesureAccords;
  index: number;
};

function hauteurDe(lettre: string, alteration: string): number {
  const decalage = alteration === "#" ? 1 : alteration === "b" ? -1 : 0;
  return (HAUTEURS[lettre] + decalage + 12) % 12;
}

export function analyserAccord(nom: string): AccordAnalyse | null {
  const trouve = nom.trim().match(MOTIF_ACCORD);
  if (!trouve) {
    return null;
  }

  const [, lettre, alteration, suffixe, lettreBasse, alterationBasse] = trouve;

  return {
    racine: `${lettre}${alteration}`,
    hauteur: hauteurDe(lettre, alteration),
    suffixe,
    basse: lettreBasse ? `${lettreBasse}${alterationBasse ?? ""}` : null,
  };
}

export function changerRacine(nom: string, racine: string): string {
  const analyse = analyserAccord(nom);
  if (!analyse) {
    return racine;
  }
  return `${racine}${analyse.suffixe}${analyse.basse ? `/${analyse.basse}` : ""}`;
}

export function changerSuffixe(nom: string, suffixe: string): string {
  const analyse = analyserAccord(nom);
  if (!analyse) {
    return nom;
  }
  return `${analyse.racine}${suffixe}${analyse.basse ? `/${analyse.basse}` : ""}`;
}

export function memeRacine(nom: string, racine: string): boolean {
  const analyse = analyserAccord(nom);
  const cible = analyserAccord(racine);
  return analyse !== null && cible !== null && analyse.hauteur === cible.hauteur;
}

export function decouperEnLignes(
  mesures: MesureAccords[],
  parLigne: number
): (CelluleAccords | null)[][] {
  const lignes: (CelluleAccords | null)[][] = [];
  const taille = Math.max(1, Math.floor(parLigne));

  for (let debut = 0; debut < mesures.length; debut += taille) {
    const ligne: (CelluleAccords | null)[] = mesures
      .slice(debut, debut + taille)
      .map((mesure, position) => ({ mesure, index: debut + position }));

    while (ligne.length < taille) {
      ligne.push(null);
    }
    lignes.push(ligne);
  }

  return lignes;
}
