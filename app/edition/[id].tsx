import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { BarreStructure } from "../../components/edition/BarreStructure";
import { GrilleMesure, type Selection } from "../../components/edition/GrilleMesure";
import { PaveSaisie } from "../../components/edition/PaveSaisie";
import { Tablature } from "../../components/tablature/Tablature";
import { useChansons } from "../../contexts/ChansonsContext";
import { styles } from "../../styles/edition.styles";
import { colors } from "../../theme/colors";
import type { ChansonArpege, Corde, Technique } from "../../types/chanson";
import {
  ajouterMesure,
  ajouterSection,
  basculerTechnique,
  changerPasMesure,
  dupliquerMesure,
  modifierSection,
  PAS_POSSIBLES,
  poserNote,
  retirerNote,
  supprimerMesure,
  supprimerSection,
  trouverNote,
} from "../../utils/editionChanson";

const REPETITIONS_MAX = 8;

export default function EcranEdition() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trouver, remplacer } = useChansons();
  const [position, setPosition] = useState({ section: 0, mesure: 0 });
  const [selection, setSelection] = useState<Selection | null>(null);

  const chanson = trouver(id);

  if (!chanson || chanson.format !== "arpege") {
    return (
      <View style={styles.introuvable}>
        <Text style={styles.introuvableTexte}>
          {chanson
            ? "L'éditeur ne gère que les chansons en arpège pour l'instant."
            : "Chanson introuvable."}
        </Text>
      </View>
    );
  }

  const indexSection = Math.min(position.section, chanson.sections.length - 1);
  const section = chanson.sections[indexSection];
  const indexMesure = Math.min(position.mesure, section.mesures.length - 1);
  const mesure = section.mesures[indexMesure];

  const noteSelectionnee = selection
    ? trouverNote(mesure, selection.corde, selection.pas)
    : undefined;

  const appliquer = (suivante: ChansonArpege) => {
    remplacer(suivante);
  };

  const majChamp = (champs: Partial<Pick<ChansonArpege, "titre" | "artiste">>) => {
    appliquer({ ...chanson, ...champs, majLe: new Date().toISOString() });
  };

  const choisirMesure = (iS: number, iM: number) => {
    setPosition({ section: iS, mesure: iM });
    setSelection(null);
  };

  const toucherCase = (corde: Corde, pas: number) => {
    const dejaActive = selection?.corde === corde && selection.pas === pas;

    if (dejaActive) {
      if (trouverNote(mesure, corde, pas)) {
        appliquer(retirerNote(chanson, indexSection, indexMesure, corde, pas));
      }
      setSelection(null);
      return;
    }

    setSelection({ corde, pas });
  };

  const choisirFrette = (frette: number) => {
    if (!selection) {
      return;
    }
    appliquer(
      poserNote(chanson, indexSection, indexMesure, selection.corde, selection.pas, frette)
    );
  };

  const choisirTechnique = (technique: Technique) => {
    if (!selection || !noteSelectionnee) {
      return;
    }
    appliquer(
      basculerTechnique(chanson, indexSection, indexMesure, selection.corde, selection.pas, technique)
    );
  };

  const effacerNote = () => {
    if (!selection) {
      return;
    }
    appliquer(retirerNote(chanson, indexSection, indexMesure, selection.corde, selection.pas));
    setSelection(null);
  };

  const changerRepetitions = (delta: number) => {
    const valeur = Math.min(Math.max(section.repetitions + delta, 1), REPETITIONS_MAX);
    appliquer(modifierSection(chanson, indexSection, { repetitions: valeur }));
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
      </View>

      <View style={styles.bloc}>
        <Text style={styles.libelle}>Structure</Text>
        <BarreStructure
          sections={chanson.sections}
          indexSection={indexSection}
          indexMesure={indexMesure}
          onSelectionner={choisirMesure}
          onAjouterMesure={(iS) => {
            appliquer(ajouterMesure(chanson, iS));
            setPosition({ section: iS, mesure: chanson.sections[iS].mesures.length });
            setSelection(null);
          }}
          onAjouterSection={() => {
            appliquer(ajouterSection(chanson, `Section ${chanson.sections.length + 1}`));
            setPosition({ section: chanson.sections.length, mesure: 0 });
            setSelection(null);
          }}
        />
      </View>

      <View style={styles.bloc}>
        <View style={styles.entete}>
          <TextInput
            value={section.nom}
            onChangeText={(nom) => appliquer(modifierSection(chanson, indexSection, { nom }))}
            placeholder="Nom de la section"
            placeholderTextColor={colors.textFaint}
            style={styles.champNomSection}
          />
          <View style={styles.compteur}>
            <Pressable onPress={() => changerRepetitions(-1)} style={styles.boutonCompteur}>
              <Text style={styles.texteBoutonCompteur}>−</Text>
            </Pressable>
            <Text style={styles.valeurCompteur}>{`×${section.repetitions}`}</Text>
            <Pressable onPress={() => changerRepetitions(1)} style={styles.boutonCompteur}>
              <Text style={styles.texteBoutonCompteur}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.ligneOptions}>
          <Text style={styles.libelle}>Pas / mesure</Text>
          <View style={styles.segments}>
            {PAS_POSSIBLES.map((pas) => {
              const actif = pas === mesure.pas;
              return (
                <Pressable
                  key={pas}
                  onPress={() => {
                    appliquer(changerPasMesure(chanson, indexSection, indexMesure, pas));
                    setSelection(null);
                  }}
                  style={[styles.segment, actif && styles.segmentActif]}
                >
                  <Text style={[styles.texteSegment, actif && styles.texteSegmentActif]}>
                    {pas}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => appliquer(dupliquerMesure(chanson, indexSection, indexMesure))}
            style={styles.action}
          >
            <Text style={styles.texteAction}>Dupliquer la mesure</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              appliquer(supprimerMesure(chanson, indexSection, indexMesure));
              setSelection(null);
            }}
            disabled={section.mesures.length <= 1}
            style={[
              styles.action,
              styles.actionDanger,
              section.mesures.length <= 1 && styles.actionDesactivee,
            ]}
          >
            <Text style={[styles.texteAction, styles.texteActionDanger]}>
              Supprimer la mesure
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              appliquer(supprimerSection(chanson, indexSection));
              setPosition({ section: Math.max(indexSection - 1, 0), mesure: 0 });
              setSelection(null);
            }}
            disabled={chanson.sections.length <= 1}
            style={[
              styles.action,
              styles.actionDanger,
              chanson.sections.length <= 1 && styles.actionDesactivee,
            ]}
          >
            <Text style={[styles.texteAction, styles.texteActionDanger]}>
              Supprimer la section
            </Text>
          </Pressable>
        </View>
      </View>

      <GrilleMesure
        mesure={mesure}
        accordage={chanson.accordage}
        selection={selection}
        onCase={toucherCase}
      />

      <PaveSaisie
        actif={selection !== null}
        avecNote={noteSelectionnee !== undefined}
        fretteActive={noteSelectionnee?.frette ?? null}
        techniqueActive={noteSelectionnee?.technique ?? null}
        onFrette={choisirFrette}
        onTechnique={choisirTechnique}
        onEffacer={effacerNote}
      />

      <View style={styles.apercu}>
        <Text style={styles.libelle}>{`Aperçu — ${section.nom}`}</Text>
        <Tablature sections={[section]} accordage={chanson.accordage} echelle={1} />
      </View>
    </ScrollView>
  );
}
