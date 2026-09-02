import type { Chanson, ChansonAccords } from "../types/chanson";
import { MESURES_PAR_LIGNE_PAR_DEFAUT, nouvelleSectionAccords } from "./editionAccords";

type AccordsLegacy = { contenu?: unknown };

export function migrerChansons(chansons: Chanson[]): Chanson[] {
  return chansons.map(migrer);
}

function migrer(chanson: Chanson): Chanson {
  if (typeof chanson !== "object" || chanson === null) {
    return chanson;
  }

  if (chanson.format !== "accords" || Array.isArray(chanson.sections)) {
    return chanson;
  }

  const { contenu, ...reste } = chanson as ChansonAccords & AccordsLegacy;
  const texte = typeof contenu === "string" ? contenu.trim() : "";
  const notes = [reste.notes, texte].filter(Boolean).join("\n\n");

  return {
    ...reste,
    sections: [nouvelleSectionAccords("Couplet")],
    mesuresParLigne: reste.mesuresParLigne ?? MESURES_PAR_LIGNE_PAR_DEFAUT,
    notes: notes || undefined,
  };
}
