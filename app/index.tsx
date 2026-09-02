import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useChansons } from "../contexts/ChansonsContext";
import { styles } from "../styles/index.styles";
import { compterMesures, type Chanson } from "../types/chanson";
import { nouvelleChanson } from "../utils/editionChanson";

const LIBELLES_STATUT = {
  "a-apprendre": "À apprendre",
  "en-cours": "En cours",
  maitrisee: "Maîtrisée",
} as const;

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
        <View style={styles.meta}>
          <View style={styles.puce}>
            <Text style={styles.puceTexte}>{LIBELLES_STATUT[chanson.statut]}</Text>
          </View>
          {chanson.tonalite ? (
            <View style={styles.puce}>
              <Text style={styles.puceTexte}>{chanson.tonalite}</Text>
            </View>
          ) : null}
          {chanson.bpm ? (
            <View style={styles.puce}>
              <Text style={styles.puceTexte}>{`${chanson.bpm} bpm`}</Text>
            </View>
          ) : null}
          {chanson.format === "arpege" ? (
            <View style={styles.puce}>
              <Text style={styles.puceTexte}>{`${compterMesures(chanson)} mesures`}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
}

export default function EcranAccueil() {
  const { chansons, chargement, ajouter } = useChansons();
  const router = useRouter();

  const creer = () => {
    const chanson = nouvelleChanson("", "");
    ajouter(chanson);
    router.push({ pathname: "/edition/[id]", params: { id: chanson.id } });
  };

  return (
    <ScrollView style={styles.ecran} contentContainerStyle={styles.liste}>
      <Pressable onPress={creer} style={styles.boutonAjout}>
        <Text style={styles.texteBoutonAjout}>+ Nouvelle chanson</Text>
      </Pressable>

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
