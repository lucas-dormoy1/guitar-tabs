import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../styles/edition-grille.styles";
import { lettreCorde, type Corde, type Mesure, type Technique } from "../../types/chanson";
import { pasParTemps, trouverNote } from "../../utils/editionChanson";

const CORDES: Corde[] = [1, 2, 3, 4, 5, 6];

const MARQUES: Record<Technique, string> = {
  hammer: "h",
  pull: "p",
  "slide-up": "/",
  "slide-down": "\\",
  bend: "b",
  mute: "×",
};

export type Selection = { corde: Corde; pas: number };

type Props = {
  mesure: Mesure;
  accordage: string[];
  selection: Selection | null;
  onCase: (corde: Corde, pas: number) => void;
};

export function GrilleMesure({ mesure, accordage, selection, onCase }: Props) {
  const parTemps = pasParTemps(mesure.pas);
  const pas = Array.from({ length: mesure.pas }, (_, index) => index);

  return (
    <View style={styles.conteneur}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.enTeteTemps}>
            <View style={styles.lettres} />
            {pas.map((index) => (
              <View key={index} style={styles.celluleTemps}>
                {index % parTemps === 0 ? (
                  <Text style={styles.texteTemps}>{index / parTemps + 1}</Text>
                ) : null}
              </View>
            ))}
          </View>

          {CORDES.map((corde) => (
            <View key={corde} style={styles.ligne}>
              <View style={styles.lettreCorde}>
                <Text style={styles.texteLettre}>{lettreCorde(accordage, corde)}</Text>
              </View>
              {pas.map((index) => {
                const note = trouverNote(mesure, corde, index);
                const active = selection?.corde === corde && selection.pas === index;
                const debutTemps = index % parTemps === 0;

                return (
                  <Pressable
                    key={index}
                    onPress={() => onCase(corde, index)}
                    style={[
                      styles.case,
                      debutTemps && styles.caseTemps,
                      index === mesure.pas - 1 && styles.caseFin,
                    ]}
                  >
                    <View style={[styles.corde, corde >= 5 && styles.cordeGrave]} />
                    {active ? <View style={styles.pastilleSelection} /> : null}
                    {note ? (
                      <>
                        {active ? null : <View style={styles.fondFrette} />}
                        <Text
                          style={[
                            styles.texteFrette,
                            active && styles.texteFretteSelection,
                          ]}
                        >
                          {note.technique === "mute" ? "×" : note.frette}
                        </Text>
                        {note.technique && note.technique !== "mute" ? (
                          <Text style={styles.marqueTechnique}>
                            {MARQUES[note.technique]}
                          </Text>
                        ) : null}
                      </>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
