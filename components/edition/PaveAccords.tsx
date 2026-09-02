import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { styles } from "../../styles/edition-pave-accords.styles";
import {
  analyserAccord,
  memeBasse,
  memeRacine,
  RACINES,
  SUFFIXES,
} from "../../utils/accords";

type PropsRangeeNotes = {
  estActive: (note: string) => boolean;
  onChoisir: (note: string) => void;
};

function RangeeNotes({ estActive, onChoisir }: PropsRangeeNotes) {
  return (
    <View style={styles.rangee}>
      {RACINES.map((note) => {
        const active = estActive(note);
        return (
          <Pressable
            key={note}
            onPress={() => onChoisir(note)}
            role="button"
            aria-pressed={active}
            style={[styles.touche, active && styles.toucheActive]}
          >
            <Text style={[styles.texteTouche, active && styles.texteToucheActive]}>
              {note}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type Props = {
  actif: boolean;
  accord: string | null;
  onRacine: (racine: string) => void;
  onSuffixe: (suffixe: string) => void;
  onBasse: (basse: string | null) => void;
  onRetirer: () => void;
};

export function PaveAccords({
  actif,
  accord,
  onRacine,
  onSuffixe,
  onBasse,
  onRetirer,
}: Props) {
  const [basseOuverte, setBasseOuverte] = useState(false);

  useEffect(() => {
    if (accord === null) {
      setBasseOuverte(false);
    }
  }, [accord]);

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
      <RangeeNotes
        estActive={(note) => memeRacine(analyse, note)}
        onChoisir={onRacine}
      />

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

      <View style={styles.entete}>
        <Text style={styles.libelle}>Basse</Text>
        <Pressable
          onPress={() => setBasseOuverte(!basseOuverte)}
          disabled={accord === null}
          role="button"
          aria-expanded={basseOuverte}
          aria-label="Choisir la basse de l'accord"
          style={[
            styles.chip,
            styles.chipValeur,
            basseOuverte && styles.chipActive,
            accord === null && styles.chipDesactive,
          ]}
        >
          <Text style={[styles.texteChip, basseOuverte && styles.texteChipActive]}>
            {analyse?.basse ? `/${analyse.basse}` : "Aucune"}
          </Text>
        </Pressable>
      </View>

      {basseOuverte && accord !== null ? (
        <RangeeNotes
          estActive={(note) => memeBasse(analyse, note)}
          onChoisir={(note) => onBasse(memeBasse(analyse, note) ? null : note)}
        />
      ) : null}
    </View>
  );
}
