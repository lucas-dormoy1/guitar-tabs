import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useChansons } from "../contexts/ChansonsContext";
import { styles } from "../styles/index.styles";
import type { Chanson } from "../types/chanson";
import { nouvelleChansonAccords } from "../utils/editionAccords";
import { nouvelleChansonArpege } from "../utils/editionChanson";

function Carte({ chanson }: { chanson: Chanson }) {
  return (
    <Link href={{ pathname: "/chanson/[id]", params: { id: chanson.id } }} asChild>
      <Pressable style={styles.carte}>
        <View style={styles.enTeteCarte}>
          <View>
            <Text style={styles.titre}>{chanson.titre || "Sans titre"}</Text>
            <Text style={styles.artiste}>{chanson.artiste || "Artiste inconnu"}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>
              {chanson.format === "arpege" ? "Arpège" : "Accords"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default function EcranAccueil() {
  const { chansons, chargement, ajouter } = useChansons();
  const router = useRouter();

  const creer = (chanson: Chanson) => {
    ajouter(chanson);
    router.push({ pathname: "/edition/[id]", params: { id: chanson.id } });
  };

  return (
    <ScrollView style={styles.ecran} contentContainerStyle={styles.liste}>
      <View style={styles.boutonsAjout}>
        <Pressable
          onPress={() => creer(nouvelleChansonArpege("", ""))}
          style={styles.boutonAjout}
        >
          <Text style={styles.texteBoutonAjout}>+ Arpège</Text>
        </Pressable>
        <Pressable
          onPress={() => creer(nouvelleChansonAccords("", ""))}
          style={[styles.boutonAjout, styles.boutonAjoutSecondaire]}
        >
          <Text style={[styles.texteBoutonAjout, styles.texteBoutonAjoutSecondaire]}>
            + Accords
          </Text>
        </Pressable>
      </View>

      {chargement ? null : chansons.length === 0 ? (
        <View style={styles.vide}>
          <Text style={styles.videTitre}>Aucune chanson</Text>
          <Text style={styles.videTexte}>
            Les chansons que tu apprends apparaîtront ici.
          </Text>
        </View>
      ) : (
        chansons.map((chanson) => <Carte key={chanson.id} chanson={chanson} />)
      )}
    </ScrollView>
  );
}
