import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useChansons } from "../contexts/ChansonsContext";
import { styles } from "../styles/index.styles";
import type { Chanson } from "../types/chanson";
import { nouvelleChansonAccords } from "../utils/editionAccords";
import { nouvelleChansonArpege } from "../utils/editionChanson";

type ProprietesCarte = {
  chanson: Chanson;
  confirmation: boolean;
  onBasculer: () => void;
  onSupprimer: () => void;
};

function Carte({ chanson, confirmation, onBasculer, onSupprimer }: ProprietesCarte) {
  const titre = chanson.titre || "Sans titre";

  return (
    <View style={styles.carte}>
      <View style={styles.enTeteCarte}>
        <Link href={{ pathname: "/chanson/[id]", params: { id: chanson.id } }} asChild>
          <Pressable role="link" style={styles.lienCarte}>
            <Text style={styles.titre}>{titre}</Text>
            <Text style={styles.artiste}>{chanson.artiste || "Artiste inconnu"}</Text>
          </Pressable>
        </Link>
        <View style={styles.actionsCarte}>
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>
              {chanson.format === "arpege" ? "Arpège" : "Accords"}
            </Text>
          </View>
          <Pressable
            onPress={onBasculer}
            role="button"
            hitSlop={8}
            aria-expanded={confirmation}
            aria-label={`Supprimer ${titre}…`}
            style={[styles.boutonSupprimer, confirmation && styles.boutonSupprimerActif]}
          >
            <Text
              style={[
                styles.texteBoutonSupprimer,
                confirmation && styles.texteBoutonSupprimerActif,
              ]}
            >
              ✕
            </Text>
          </Pressable>
        </View>
      </View>

      {confirmation ? (
        <View style={styles.confirmation}>
          <Text style={styles.texteConfirmation}>Supprimer cette chanson ?</Text>
          <View style={styles.actionsConfirmation}>
            <Pressable onPress={onBasculer} role="button" style={styles.action}>
              <Text style={styles.texteAction}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={onSupprimer}
              role="button"
              aria-label={`Supprimer définitivement ${titre}`}
              style={[styles.action, styles.actionDanger]}
            >
              <Text style={[styles.texteAction, styles.texteActionDanger]}>Supprimer</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function EcranAccueil() {
  const { chansons, chargement, ajouter, supprimer } = useChansons();
  const [idAConfirmer, setIdAConfirmer] = useState<string | null>(null);
  const router = useRouter();

  const creer = (chanson: Chanson) => {
    ajouter(chanson);
    router.push({ pathname: "/edition/[id]", params: { id: chanson.id } });
  };

  const basculer = (id: string) => {
    setIdAConfirmer((actuel) => (actuel === id ? null : id));
  };

  const confirmerSuppression = (id: string) => {
    setIdAConfirmer(null);
    supprimer(id);
  };

  return (
    <ScrollView style={styles.ecran} contentContainerStyle={styles.liste}>
      <View style={styles.boutonsAjout}>
        <Pressable
          onPress={() => creer(nouvelleChansonArpege("", ""))}
          role="button"
          style={styles.boutonAjout}
        >
          <Text style={styles.texteBoutonAjout}>+ Arpège</Text>
        </Pressable>
        <Pressable
          onPress={() => creer(nouvelleChansonAccords("", ""))}
          role="button"
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
        chansons.map((chanson) => (
          <Carte
            key={chanson.id}
            chanson={chanson}
            confirmation={idAConfirmer === chanson.id}
            onBasculer={() => basculer(chanson.id)}
            onSupprimer={() => confirmerSuppression(chanson.id)}
          />
        ))
      )}
    </ScrollView>
  );
}
