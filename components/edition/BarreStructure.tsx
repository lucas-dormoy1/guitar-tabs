import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../styles/edition.styles";
import type { Section } from "../../types/chanson";

type Props = {
  sections: Section[];
  indexSection: number;
  indexMesure: number;
  onSelectionner: (indexSection: number, indexMesure: number) => void;
  onAjouterMesure: (indexSection: number) => void;
  onAjouterSection: () => void;
};

export function BarreStructure({
  sections,
  indexSection,
  indexMesure,
  onSelectionner,
  onAjouterMesure,
  onAjouterSection,
}: Props) {
  let numero = 0;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.structure}>
        {sections.map((section, iS) => (
          <View key={section.id} style={styles.groupeSection}>
            <Text style={styles.nomSection} numberOfLines={1}>
              {section.repetitions > 1 ? `${section.nom} ×${section.repetitions}` : section.nom}
            </Text>
            <View style={styles.pastilles}>
              {section.mesures.map((_, iM) => {
                numero += 1;
                const active = iS === indexSection && iM === indexMesure;
                return (
                  <Pressable
                    key={iM}
                    onPress={() => onSelectionner(iS, iM)}
                    style={[styles.pastille, active && styles.pastilleActive]}
                  >
                    <Text style={[styles.textePastille, active && styles.textePastilleActive]}>
                      {numero}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => onAjouterMesure(iS)}
                style={[styles.pastille, styles.pastilleAjout]}
              >
                <Text style={styles.textePastilleAjout}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={styles.groupeSection}>
          <Text style={styles.nomSection}> </Text>
          <Pressable onPress={onAjouterSection} style={[styles.pastille, styles.pastilleAjout]}>
            <Text style={styles.textePastilleAjout}>+ Section</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
