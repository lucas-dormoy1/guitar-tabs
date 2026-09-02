import { Pressable, Text, View } from "react-native";

import { styles } from "../../styles/edition-pave-accords.styles";
import { analyserAccord, memeRacine, RACINES, SUFFIXES } from "../../utils/accords";

type Props = {
  actif: boolean;
  accord: string | null;
  onRacine: (racine: string) => void;
  onSuffixe: (suffixe: string) => void;
  onRetirer: () => void;
};

export function PaveAccords({ actif, accord, onRacine, onSuffixe, onRetirer }: Props) {
  if (!actif) {
    return (
      <Text style={styles.consigne}>
        Touche un accord de la mesure pour le modifier, ou « + » pour en ajouter un.
      </Text>
    );
  }

  const analyse = accord ? analyserAccord(accord) : null;

  return (
    <View style={styles.conteneur}>
      <View style={styles.rangee}>
        {RACINES.map((racine) => {
          const active = accord !== null && memeRacine(accord, racine);
          return (
            <Pressable
              key={racine}
              onPress={() => onRacine(racine)}
              style={[styles.touche, active && styles.toucheActive]}
            >
              <Text style={[styles.texteTouche, active && styles.texteToucheActive]}>
                {racine}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.entete}>
        <Text style={styles.libelle}>Couleur</Text>
        <Pressable
          onPress={onRetirer}
          disabled={accord === null}
          style={[styles.boutonRetirer, accord === null && styles.chipDesactive]}
        >
          <Text style={styles.texteRetirer}>Retirer</Text>
        </Pressable>
      </View>

      <View style={styles.rangee}>
        {SUFFIXES.map(({ valeur, libelle }) => {
          const active = analyse !== null && analyse.suffixe === valeur;
          return (
            <Pressable
              key={libelle}
              onPress={() => onSuffixe(valeur)}
              disabled={accord === null}
              style={[
                styles.chip,
                active && styles.chipActive,
                accord === null && styles.chipDesactive,
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
  );
}
