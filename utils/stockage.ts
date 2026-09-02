import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Chanson } from "../types/chanson";
import { migrerChansons } from "./migrations";

const CLE = "guitartabs.chansons.v1";

export async function lireChansons(): Promise<Chanson[] | null> {
  const brut = await AsyncStorage.getItem(CLE);
  if (!brut) {
    return null;
  }

  try {
    const donnees = JSON.parse(brut);
    return Array.isArray(donnees) ? migrerChansons(donnees as Chanson[]) : null;
  } catch {
    return null;
  }
}

export async function ecrireChansons(chansons: Chanson[]): Promise<void> {
  await AsyncStorage.setItem(CLE, JSON.stringify(chansons));
}
