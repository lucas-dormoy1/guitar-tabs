import { Pressable, Text, View } from "react-native";

import { styles } from "../../styles/accords.styles";
import type { PositionMesure, SectionAccords } from "../../types/chanson";
import { decouperEnLignes, partiesAccord } from "../../utils/accords";

type Props = {
  sections: SectionAccords[];
  mesuresParLigne: number;
  selection?: PositionMesure | null;
  onMesure?: (indexSection: number, indexMesure: number) => void;
};

export function GrilleAccords({ sections, mesuresParLigne, selection, onMesure }: Props) {
  return (
    <View style={styles.conteneur}>
      <View style={styles.page}>
        {sections.map((section, indexSection) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.enTeteSection}>
              <Text style={styles.nomSection}>{section.nom}</Text>
              {section.repetitions > 1 ? (
                <Text style={styles.repetitions}>{`×${section.repetitions}`}</Text>
              ) : null}
            </View>

            {decouperEnLignes(section.mesures, mesuresParLigne).map((ligne, iLigne) => {
              const avecParoles = ligne.some((cellule) => Boolean(cellule?.mesure.paroles));

              return (
                <View key={iLigne} style={styles.ligne}>
                  {ligne.map((cellule, iCellule) => {
                    if (!cellule) {
                      return <View key={iCellule} style={styles.celluleVide} />;
                    }

                    const fin =
                      iCellule === ligne.length - 1 || ligne[iCellule + 1] === null;
                    const active =
                      selection?.section === indexSection &&
                      selection.mesure === cellule.index;

                    return (
                      <Pressable
                        key={iCellule}
                        onPress={
                          onMesure ? () => onMesure(indexSection, cellule.index) : undefined
                        }
                        disabled={!onMesure}
                        style={[
                          styles.mesure,
                          fin && styles.mesureFin,
                          active && styles.mesureActive,
                        ]}
                      >
                        <View style={styles.accords}>
                          {cellule.mesure.accords.map((accord, iAccord) => {
                            const { principal, basse } = partiesAccord(accord);
                            return (
                              <Text key={iAccord} style={styles.accord} numberOfLines={1}>
                                {principal}
                                {basse ? (
                                  <Text style={styles.basse}>{`/${basse}`}</Text>
                                ) : null}
                              </Text>
                            );
                          })}
                        </View>
                        {avecParoles ? (
                          <Text style={styles.paroles}>{cellule.mesure.paroles ?? ""}</Text>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
