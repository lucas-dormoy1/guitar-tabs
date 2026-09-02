import { Pressable, Text, View } from "react-native";

import { styles } from "../../styles/edition-pave.styles";
import type { Technique } from "../../types/chanson";

const FRETTES = Array.from({ length: 13 }, (_, index) => index);

const TECHNIQUES: { valeur: Technique; libelle: string }[] = [
  { valeur: "hammer", libelle: "h" },
  { valeur: "pull", libelle: "p" },
  { valeur: "slide-up", libelle: "/" },
  { valeur: "slide-down", libelle: "\\" },
  { valeur: "bend", libelle: "b" },
  { valeur: "mute", libelle: "×" },
];

type Props = {
  fretteActive: number | null;
  techniqueActive: Technique | null;
  avecNote: boolean;
  actif: boolean;
  onFrette: (frette: number) => void;
  onTechnique: (technique: Technique) => void;
  onEffacer: () => void;
};

export function PaveSaisie({
  fretteActive,
  techniqueActive,
  avecNote,
  actif,
  onFrette,
  onTechnique,
  onEffacer,
}: Props) {
  if (!actif) {
    return (
      <Text style={styles.consigne}>
        Touche une case de la grille pour placer une note.
      </Text>
    );
  }

  return (
    <View style={styles.conteneur}>
      <View style={styles.rangee}>
        {FRETTES.map((frette) => {
          const active = frette === fretteActive;
          return (
            <Pressable
              key={frette}
              onPress={() => onFrette(frette)}
              style={[styles.touche, active && styles.toucheActive]}
            >
              <Text style={[styles.texteTouche, active && styles.texteToucheActive]}>
                {frette}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={onEffacer}
          disabled={!avecNote}
          style={[styles.touche, styles.toucheEffacer, !avecNote && styles.chipDesactive]}
        >
          <Text style={styles.texteEffacer}>Effacer</Text>
        </Pressable>
      </View>

      <View style={styles.separateur}>
        <Text style={styles.libelle}>Jeu</Text>
        <View style={styles.rangee}>
          {TECHNIQUES.map(({ valeur, libelle }) => {
            const active = valeur === techniqueActive;
            return (
              <Pressable
                key={valeur}
                onPress={() => onTechnique(valeur)}
                disabled={!avecNote}
                style={[
                  styles.chip,
                  active && styles.chipActive,
                  !avecNote && styles.chipDesactive,
                ]}
              >
                <Text style={[styles.texteChip, active && styles.texteChipActive]}>
                  {libelle}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
