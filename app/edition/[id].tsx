import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { EditeurAccords } from "../../components/edition/EditeurAccords";
import { EditeurArpege } from "../../components/edition/EditeurArpege";
import { useChansons } from "../../contexts/ChansonsContext";
import { styles } from "../../styles/edition.styles";
import { colors } from "../../theme/colors";
import { CAPO_MAX, libelleCapo, type Chanson } from "../../types/chanson";

export default function EcranEdition() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trouver, remplacer } = useChansons();

  const chanson = trouver(id);

  if (!chanson) {
    return (
      <View style={styles.introuvable}>
        <Text style={styles.introuvableTexte}>Chanson introuvable.</Text>
      </View>
    );
  }

  const majChamp = (champs: Partial<Pick<Chanson, "titre" | "artiste" | "capo">>) => {
    remplacer({ ...chanson, ...champs, majLe: new Date().toISOString() });
  };

  const changerCapo = (delta: number) => {
    majChamp({ capo: Math.min(Math.max((chanson.capo ?? 0) + delta, 0), CAPO_MAX) });
  };

  return (
    <ScrollView style={styles.ecran} contentContainerStyle={styles.contenu}>
      <View style={styles.bloc}>
        <TextInput
          value={chanson.titre}
          onChangeText={(titre) => majChamp({ titre })}
          placeholder="Titre de la chanson"
          placeholderTextColor={colors.textFaint}
          style={styles.champTitre}
        />
        <TextInput
          value={chanson.artiste}
          onChangeText={(artiste) => majChamp({ artiste })}
          placeholder="Artiste"
          placeholderTextColor={colors.textFaint}
          style={styles.champArtiste}
        />

        <View style={styles.ligneOptions}>
          <Text style={styles.libelle}>Capo</Text>
          <View style={styles.compteur}>
            <Pressable onPress={() => changerCapo(-1)} style={styles.boutonCompteur}>
              <Text style={styles.texteBoutonCompteur}>−</Text>
            </Pressable>
            <Text style={styles.valeurCapo}>{libelleCapo(chanson.capo)}</Text>
            <Pressable onPress={() => changerCapo(1)} style={styles.boutonCompteur}>
              <Text style={styles.texteBoutonCompteur}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {chanson.format === "arpege" ? (
        <EditeurArpege chanson={chanson} onChanger={remplacer} />
      ) : (
        <EditeurAccords chanson={chanson} onChanger={remplacer} />
      )}
    </ScrollView>
  );
}
