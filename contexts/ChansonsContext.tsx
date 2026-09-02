import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Chanson } from "../types/chanson";
import { chansonsDemo } from "../utils/chansonsDemo";
import { ecrireChansons, lireChansons } from "../utils/stockage";

const DELAI_SAUVEGARDE = 400;

type ValeurContexte = {
  chansons: Chanson[];
  chargement: boolean;
  trouver: (id: string) => Chanson | undefined;
  ajouter: (chanson: Chanson) => void;
  remplacer: (chanson: Chanson) => void;
  supprimer: (id: string) => void;
};

const ChansonsContext = createContext<ValeurContexte | null>(null);

export function ChansonsProvider({ children }: { children: ReactNode }) {
  const [chansons, setChansons] = useState<Chanson[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let annule = false;

    lireChansons().then((stockees) => {
      if (annule) {
        return;
      }
      setChansons(stockees ?? chansonsDemo);
      setChargement(false);
    });

    return () => {
      annule = true;
    };
  }, []);

  useEffect(() => {
    if (chargement) {
      return;
    }

    const minuteur = setTimeout(() => {
      ecrireChansons(chansons);
    }, DELAI_SAUVEGARDE);

    return () => clearTimeout(minuteur);
  }, [chansons, chargement]);

  const trouver = useCallback(
    (id: string) => chansons.find((chanson) => chanson.id === id),
    [chansons]
  );

  const ajouter = useCallback((chanson: Chanson) => {
    setChansons((actuelles) => [chanson, ...actuelles]);
  }, []);

  const remplacer = useCallback((chanson: Chanson) => {
    setChansons((actuelles) =>
      actuelles.map((actuelle) => (actuelle.id === chanson.id ? chanson : actuelle))
    );
  }, []);

  const supprimer = useCallback((id: string) => {
    setChansons((actuelles) => actuelles.filter((chanson) => chanson.id !== id));
  }, []);

  const valeur = useMemo(
    () => ({ chansons, chargement, trouver, ajouter, remplacer, supprimer }),
    [chansons, chargement, trouver, ajouter, remplacer, supprimer]
  );

  return <ChansonsContext.Provider value={valeur}>{children}</ChansonsContext.Provider>;
}

export function useChansons(): ValeurContexte {
  const valeur = useContext(ChansonsContext);
  if (!valeur) {
    throw new Error("useChansons doit être utilisé dans un ChansonsProvider");
  }
  return valeur;
}
