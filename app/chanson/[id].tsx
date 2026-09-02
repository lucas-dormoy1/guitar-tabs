import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { GrilleAccords } from "../../components/accords/GrilleAccords";
import { Tablature } from "../../components/tablature/Tablature";
import { useChansons } from "../../contexts/ChansonsContext";
import { styles } from "../../styles/chanson.styles";
import { ECHELLES, type NomEchelle } from "../../theme/tablature";
import { libelleCapo } from "../../types/chanson";

const NOMS_ECHELLE = Object.keys(ECHELLES) as NomEchelle[];

export default function EcranChanson() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trouver } = useChansons();
  const chanson = trouver(id);
  const [echelle, setEchelle] = useState<NomEchelle>("M");

  if (!chanson) {
    return (
      <View style={styles.introuvable}>
        <Text style={styles.introuvableTexte}>Chanson introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.ecran} contentContainerStyle={styles.contenu}>
      <View style={styles.enTeteAvecAction}>
        <View style={styles.enTete}>
          <Text style={styles.titre}>{chanson.titre || "Sans titre"}</Text>
          <Text style={styles.artiste}>{chanson.artiste || "Artiste inconnu"}</Text>
        </View>
        <Link href={{ pathname: "/edition/[id]", params: { id: chanson.id } }} asChild>
          <Pressable style={styles.boutonEditer}>
            <Text style={styles.texteBoutonEditer}>Éditer</Text>
          </Pressable>
        </Link>
      </View>

      {chanson.capo ? (
        <View style={styles.meta}>
          <View style={styles.puce}>
            <Text style={styles.puceTexte}>{`Capo ${libelleCapo(chanson.capo)}`}</Text>
          </View>
        </View>
      ) : null}

      {chanson.notes ? (
        <View style={styles.notes}>
          <Text style={styles.notesTexte}>{chanson.notes}</Text>
        </View>
      ) : null}

      {chanson.format === "arpege" ? (
        <>
          <View style={styles.barreOutils}>
            <Text style={styles.barreLabel}>Taille</Text>
            <View style={styles.groupeEchelle}>
              {NOMS_ECHELLE.map((nom) => {
                const actif = nom === echelle;
                return (
                  <Pressable
                    key={nom}
                    onPress={() => setEchelle(nom)}
                    style={[styles.boutonEchelle, actif && styles.boutonEchelleActif]}
                  >
                    <Text
                      style={[
                        styles.boutonEchelleTexte,
                        actif && styles.boutonEchelleTexteActif,
                      ]}
                    >
                      {nom}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Tablature
            sections={chanson.sections}
            accordage={chanson.accordage}
            echelle={ECHELLES[echelle]}
          />

          <View style={styles.legende}>
            <Text style={styles.legendeTexte}>h — hammer-on</Text>
            <Text style={styles.legendeTexte}>p — pull-off</Text>
            <Text style={styles.legendeTexte}>／ — slide</Text>
            <Text style={styles.legendeTexte}>b — bend</Text>
            <Text style={styles.legendeTexte}>× — mute</Text>
          </View>
        </>
      ) : (
        <GrilleAccords
          sections={chanson.sections}
          mesuresParLigne={chanson.mesuresParLigne}
        />
      )}
    </ScrollView>
  );
}
