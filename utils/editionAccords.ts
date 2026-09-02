import * as Crypto from "expo-crypto";

import type { ChansonAccords, MesureAccords, SectionAccords } from "../types/chanson";

export const MESURES_PAR_LIGNE_POSSIBLES = [2, 3, 4] as const;

export const ACCORDS_MAX = 4;

export const MESURES_PAR_LIGNE_PAR_DEFAUT = 4;

function maintenant(): string {
  return new Date().toISOString();
}

function majChanson(chanson: ChansonAccords, sections: SectionAccords[]): ChansonAccords {
  return { ...chanson, sections, majLe: maintenant() };
}

function mesureVide(): MesureAccords {
  return { accords: [] };
}

export function nouvelleSectionAccords(nom: string): SectionAccords {
  return {
    id: Crypto.randomUUID(),
    nom,
    repetitions: 1,
    mesures: [mesureVide(), mesureVide(), mesureVide(), mesureVide()],
  };
}

export function nouvelleChansonAccords(titre: string, artiste: string): ChansonAccords {
  const date = maintenant();
  return {
    id: Crypto.randomUUID(),
    titre,
    artiste,
    format: "accords",
    statut: "a-apprendre",
    sections: [nouvelleSectionAccords("Couplet")],
    mesuresParLigne: MESURES_PAR_LIGNE_PAR_DEFAUT,
    creeLe: date,
    majLe: date,
  };
}

function modifierMesure(
  chanson: ChansonAccords,
  indexSection: number,
  indexMesure: number,
  transformation: (mesure: MesureAccords) => MesureAccords
): ChansonAccords {
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

export function poserAccord(
  chanson: ChansonAccords,
  indexSection: number,
  indexMesure: number,
  indexAccord: number,
  nom: string
): ChansonAccords {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => {
    if (indexAccord >= mesure.accords.length) {
      if (mesure.accords.length >= ACCORDS_MAX) {
        return mesure;
      }
      return { ...mesure, accords: [...mesure.accords, nom] };
    }
    return {
      ...mesure,
      accords: mesure.accords.map((accord, i) => (i === indexAccord ? nom : accord)),
    };
  });
}

export function retirerAccord(
  chanson: ChansonAccords,
  indexSection: number,
  indexMesure: number,
  indexAccord: number
): ChansonAccords {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => ({
    ...mesure,
    accords: mesure.accords.filter((_, i) => i !== indexAccord),
  }));
}

export function modifierParoles(
  chanson: ChansonAccords,
  indexSection: number,
  indexMesure: number,
  paroles: string
): ChansonAccords {
  return modifierMesure(chanson, indexSection, indexMesure, (mesure) => {
    if (!paroles) {
      const { paroles: _vides, ...reste } = mesure;
      return reste;
    }
    return { ...mesure, paroles };
  });
}

export function ajouterMesure(chanson: ChansonAccords, indexSection: number): ChansonAccords {
  const sections = chanson.sections.map((section, iS) =>
    iS === indexSection ? { ...section, mesures: [...section.mesures, mesureVide()] } : section
  );

  return majChanson(chanson, sections);
}

export function dupliquerMesure(
  chanson: ChansonAccords,
  indexSection: number,
  indexMesure: number
): ChansonAccords {
  const sections = chanson.sections.map((section, iS) => {
    if (iS !== indexSection) {
      return section;
    }
    const source = section.mesures[indexMesure];
    if (!source) {
      return section;
    }
    const mesures = [...section.mesures];
    mesures.splice(indexMesure + 1, 0, { ...source, accords: [...source.accords] });
    return { ...section, mesures };
  });

  return majChanson(chanson, sections);
}

export function supprimerMesure(
  chanson: ChansonAccords,
  indexSection: number,
  indexMesure: number
): ChansonAccords {
  const sections = chanson.sections.map((section, iS) => {
    if (iS !== indexSection || section.mesures.length <= 1) {
      return section;
    }
    return { ...section, mesures: section.mesures.filter((_, iM) => iM !== indexMesure) };
  });

  return majChanson(chanson, sections);
}

export function ajouterSection(chanson: ChansonAccords, nom: string): ChansonAccords {
  return majChanson(chanson, [...chanson.sections, nouvelleSectionAccords(nom)]);
}

export function modifierSection(
  chanson: ChansonAccords,
  indexSection: number,
  champs: Partial<Pick<SectionAccords, "nom" | "repetitions">>
): ChansonAccords {
  const sections = chanson.sections.map((section, iS) =>
    iS === indexSection ? { ...section, ...champs } : section
  );

  return majChanson(chanson, sections);
}

export function supprimerSection(
  chanson: ChansonAccords,
  indexSection: number
): ChansonAccords {
  if (chanson.sections.length <= 1) {
    return chanson;
  }
  return majChanson(
    chanson,
    chanson.sections.filter((_, iS) => iS !== indexSection)
  );
}

export function changerMesuresParLigne(
  chanson: ChansonAccords,
  mesuresParLigne: number
): ChansonAccords {
  return { ...chanson, mesuresParLigne, majLe: maintenant() };
}
