import * as Crypto from "expo-crypto";

import {
  ACCORDAGE_STANDARD,
  type ChansonArpege,
  type Corde,
  type Mesure,
  type Note,
  type Section,
  type Technique,
} from "../types/chanson";

export const PAS_POSSIBLES = [8, 12, 16] as const;

const PAS_PAR_DEFAUT = 8;

function maintenant(): string {
  return new Date().toISOString();
}

function majChanson(chanson: ChansonArpege, sections: Section[]): ChansonArpege {
  return { ...chanson, sections, majLe: maintenant() };
}

function mesureVide(pas: number): Mesure {
  return { pas, notes: [] };
}

export function nouvelleSection(nom: string, pas = PAS_PAR_DEFAUT): Section {
  return {
    id: Crypto.randomUUID(),
    nom,
    repetitions: 1,
    mesures: [mesureVide(pas)],
  };
}

export function nouvelleChansonArpege(titre: string, artiste: string): ChansonArpege {
  const date = maintenant();
  return {
    id: Crypto.randomUUID(),
    titre,
    artiste,
    format: "arpege",
    statut: "a-apprendre",
    accordage: ACCORDAGE_STANDARD,
    sections: [nouvelleSection("Intro")],
    creeLe: date,
    majLe: date,
  };
}

function modifierMesure(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number,
  transformation: (mesure: Mesure) => Mesure
): ChansonArpege {
  const sections = chanson.sections.map((section, iS) => {
    if (iS !== indexSection) {
      return section;
    }
    return {
      ...section,
      mesures: section.mesures.map((mesure, iM) =>
        iM === indexMesure ? transformation(mesure) : mesure
      ),
    };
  });

  return majChanson(chanson, sections);
}

export function trouverNote(mesure: Mesure, corde: Corde, pas: number): Note | undefined {
  return mesure.notes.find((note) => note.corde === corde && note.pas === pas);
}

export function poserNote(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number,
  corde: Corde,
  pas: number,
  frette: number
): ChansonArpege {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => {
    const existante = trouverNote(mesure, corde, pas);
    const notes = existante
      ? mesure.notes.map((note) => (note === existante ? { ...note, frette } : note))
      : [...mesure.notes, { corde, frette, pas }];

    return { ...mesure, notes: trierNotes(notes) };
  });
}

export function retirerNote(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number,
  corde: Corde,
  pas: number
): ChansonArpege {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => ({
    ...mesure,
    notes: mesure.notes.filter((note) => !(note.corde === corde && note.pas === pas)),
  }));
}

export function basculerTechnique(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number,
  corde: Corde,
  pas: number,
  technique: Technique
): ChansonArpege {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => ({
    ...mesure,
    notes: mesure.notes.map((note) => {
      if (note.corde !== corde || note.pas !== pas) {
        return note;
      }
      if (note.technique === technique) {
        const { technique: _retiree, ...reste } = note;
        return reste;
      }
      return { ...note, technique };
    }),
  }));
}

export function changerPasMesure(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number,
  pas: number
): ChansonArpege {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => ({
    pas,
    notes: mesure.notes.filter((note) => note.pas < pas),
  }));
}

export function ajouterMesure(chanson: ChansonArpege, indexSection: number): ChansonArpege {
  const sections = chanson.sections.map((section, iS) => {
    if (iS !== indexSection) {
      return section;
    }
    const derniere = section.mesures[section.mesures.length - 1];
    return {
      ...section,
      mesures: [...section.mesures, mesureVide(derniere?.pas ?? PAS_PAR_DEFAUT)],
    };
  });

  return majChanson(chanson, sections);
}

export function dupliquerMesure(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number
): ChansonArpege {
  const sections = chanson.sections.map((section, iS) => {
    if (iS !== indexSection) {
      return section;
    }
    const source = section.mesures[indexMesure];
    if (!source) {
      return section;
    }
    const copie: Mesure = { pas: source.pas, notes: source.notes.map((note) => ({ ...note })) };
    const mesures = [...section.mesures];
    mesures.splice(indexMesure + 1, 0, copie);
    return { ...section, mesures };
  });

  return majChanson(chanson, sections);
}

export function supprimerMesure(
  chanson: ChansonArpege,
  indexSection: number,
  indexMesure: number
): ChansonArpege {
  const sections = chanson.sections.map((section, iS) => {
    if (iS !== indexSection || section.mesures.length <= 1) {
      return section;
    }
    return { ...section, mesures: section.mesures.filter((_, iM) => iM !== indexMesure) };
  });

  return majChanson(chanson, sections);
}

export function ajouterSection(chanson: ChansonArpege, nom: string): ChansonArpege {
  const derniere = chanson.sections[chanson.sections.length - 1];
  const pas = derniere?.mesures[derniere.mesures.length - 1]?.pas ?? PAS_PAR_DEFAUT;
  return majChanson(chanson, [...chanson.sections, nouvelleSection(nom, pas)]);
}

export function modifierSection(
  chanson: ChansonArpege,
  indexSection: number,
  champs: Partial<Pick<Section, "nom" | "repetitions">>
): ChansonArpege {
  const sections = chanson.sections.map((section, iS) =>
    iS === indexSection ? { ...section, ...champs } : section
  );

  return majChanson(chanson, sections);
}

export function supprimerSection(chanson: ChansonArpege, indexSection: number): ChansonArpege {
  if (chanson.sections.length <= 1) {
    return chanson;
  }
  return majChanson(
    chanson,
    chanson.sections.filter((_, iS) => iS !== indexSection)
  );
}

function trierNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => (a.pas === b.pas ? a.corde - b.corde : a.pas - b.pas));
}

export function pasParTemps(pas: number): number {
  return pas % 4 === 0 ? pas / 4 : 1;
}
