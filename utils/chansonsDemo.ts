import {
  ACCORDAGE_STANDARD,
  type Chanson,
  type ChansonAccords,
  type ChansonArpege,
} from "../types/chanson";

const arpegeDemo: ChansonArpege = {
  id: "demo-arpege",
  titre: "Arpège de démo",
  artiste: "GuitarTabs",
  format: "arpege",
  statut: "en-cours",
  bpm: 76,
  tonalite: "Am",
  accordage: ACCORDAGE_STANDARD,
  notes: "Chanson de démonstration : elle sert à valider le rendu de la tablature.",
  creeLe: "2026-09-01T00:00:00.000Z",
  majLe: "2026-09-01T00:00:00.000Z",
  sections: [
    {
      id: "intro",
      nom: "Intro",
      repetitions: 2,
      mesures: [
        {
          pas: 8,
          notes: [
            { corde: 5, frette: 0, pas: 0 },
            { corde: 1, frette: 0, pas: 0 },
            { corde: 3, frette: 2, pas: 1 },
            { corde: 2, frette: 1, pas: 2 },
            { corde: 1, frette: 0, pas: 3 },
            { corde: 4, frette: 2, pas: 4 },
            { corde: 3, frette: 2, pas: 5 },
            { corde: 2, frette: 1, pas: 6 },
            { corde: 3, frette: 2, pas: 7 },
          ],
        },
        {
          pas: 8,
          notes: [
            { corde: 5, frette: 3, pas: 0 },
            { corde: 1, frette: 0, pas: 0 },
            { corde: 3, frette: 0, pas: 1 },
            { corde: 2, frette: 1, pas: 2 },
            { corde: 1, frette: 0, pas: 3 },
            { corde: 4, frette: 2, pas: 4 },
            { corde: 3, frette: 0, pas: 5 },
            { corde: 2, frette: 0, pas: 6, technique: "hammer" },
            { corde: 2, frette: 1, pas: 7 },
          ],
        },
      ],
    },
    {
      id: "couplet",
      nom: "Couplet",
      repetitions: 1,
      mesures: [
        {
          pas: 8,
          notes: [
            { corde: 6, frette: 3, pas: 0 },
            { corde: 1, frette: 3, pas: 0 },
            { corde: 3, frette: 0, pas: 1 },
            { corde: 2, frette: 0, pas: 2 },
            { corde: 1, frette: 3, pas: 3 },
            { corde: 5, frette: 2, pas: 4 },
            { corde: 3, frette: 0, pas: 5 },
            { corde: 2, frette: 0, pas: 6 },
            { corde: 3, frette: 0, pas: 7 },
          ],
        },
        {
          pas: 8,
          notes: [
            { corde: 6, frette: 0, pas: 0 },
            { corde: 2, frette: 0, pas: 0 },
            { corde: 3, frette: 0, pas: 1 },
            { corde: 4, frette: 2, pas: 2, technique: "slide-up" },
            { corde: 4, frette: 4, pas: 4 },
            { corde: 3, frette: 0, pas: 5 },
            { corde: 2, frette: 0, pas: 6 },
            { corde: 1, frette: 0, pas: 7 },
          ],
        },
        {
          pas: 8,
          notes: [
            { corde: 5, frette: 0, pas: 0 },
            { corde: 4, frette: 0, pas: 0, technique: "mute" },
            { corde: 3, frette: 2, pas: 1 },
            { corde: 2, frette: 1, pas: 2 },
            { corde: 1, frette: 0, pas: 3 },
            { corde: 2, frette: 3, pas: 4, technique: "pull" },
            { corde: 2, frette: 1, pas: 5 },
            { corde: 3, frette: 2, pas: 6 },
            { corde: 4, frette: 2, pas: 7 },
          ],
        },
        {
          pas: 8,
          notes: [
            { corde: 6, frette: 0, pas: 0 },
            { corde: 3, frette: 2, pas: 2 },
            { corde: 2, frette: 1, pas: 4, technique: "bend" },
            { corde: 1, frette: 0, pas: 6 },
            { corde: 2, frette: 1, pas: 6 },
            { corde: 3, frette: 2, pas: 6 },
          ],
        },
      ],
    },
  ],
};

const accordsDemo: ChansonAccords = {
  id: "demo-accords",
  titre: "Grille de démo",
  artiste: "GuitarTabs",
  format: "accords",
  statut: "a-apprendre",
  bpm: 92,
  tonalite: "G",
  capo: 2,
  mesuresParLigne: 4,
  notes: "Grille de démonstration : elle sert à valider le rendu accords + paroles.",
  creeLe: "2026-09-01T00:00:00.000Z",
  majLe: "2026-09-01T00:00:00.000Z",
  sections: [
    {
      id: "couplet",
      nom: "Couplet",
      repetitions: 2,
      mesures: [
        { accords: ["G"], paroles: "Sur le chemin" },
        { accords: ["D"], paroles: "que l'on connaît" },
        { accords: ["Em"], paroles: "il reste encore" },
        { accords: ["C"], paroles: "un peu de jour" },
      ],
    },
    {
      id: "refrain",
      nom: "Refrain",
      repetitions: 1,
      mesures: [
        { accords: ["C", "D"], paroles: "Et l'on repart" },
        { accords: ["G"], paroles: "sans se presser" },
        { accords: ["Am7"], paroles: "le temps qu'il faut" },
        { accords: ["D/F#"], paroles: "pour respirer" },
        { accords: ["C"] },
        { accords: ["G/B"] },
        { accords: ["Am7", "D7"] },
        { accords: ["G"] },
      ],
    },
  ],
};

export const chansonsDemo: Chanson[] = [arpegeDemo, accordsDemo];
