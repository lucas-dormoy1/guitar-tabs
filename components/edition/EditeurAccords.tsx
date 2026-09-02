import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { styles } from "../../styles/edition.styles";
import { colors } from "../../theme/colors";
import type { ChansonAccords, PositionMesure } from "../../types/chanson";
import { changerBasse, changerRacine, changerSuffixe } from "../../utils/accords";
import {
  ACCORDS_MAX,
  ajouterMesure,
  ajouterSection,
  changerMesuresParLigne,
  dupliquerMesure,
  MESURES_PAR_LIGNE_POSSIBLES,
  modifierParoles,
  modifierSection,
  poserAccord,
  retirerAccord,
  supprimerMesure,
  supprimerSection,
} from "../../utils/editionAccords";
import { GrilleAccords } from "../accords/GrilleAccords";
import { BarreStructure } from "./BarreStructure";
import { PaveAccords } from "./PaveAccords";

const REPETITIONS_MAX = 8;

type Props = {
  chanson: ChansonAccords;
  onChanger: (chanson: ChansonAccords) => void;
};

export function EditeurAccords({ chanson, onChanger }: Props) {
  const [position, setPosition] = useState<PositionMesure>({ section: 0, mesure: 0 });
  const [indexAccord, setIndexAccord] = useState<number | null>(null);

  const indexSection = Math.min(position.section, chanson.sections.length - 1);
  const section = chanson.sections[indexSection];
  const indexMesure = Math.min(position.mesure, section.mesures.length - 1);
  const mesure = section.mesures[indexMesure];

  const accordSelectionne =
    indexAccord === null ? null : mesure.accords[indexAccord] ?? null;

  const numeroMesure =
    chanson.sections
      .slice(0, indexSection)
      .reduce((total, precedente) => total + precedente.mesures.length, 0) +
    indexMesure +
    1;

  const choisirMesure = (iS: number, iM: number) => {
    setPosition({ section: iS, mesure: iM });
    setIndexAccord(null);
  };

  const toucherAccord = (index: number) => {
    setIndexAccord(indexAccord === index ? null : index);
  };

  const choisirRacine = (racine: string) => {
    if (indexAccord === null) {
      return;
    }
    const nom = accordSelectionne ? changerRacine(accordSelectionne, racine) : racine;
    onChanger(poserAccord(chanson, indexSection, indexMesure, indexAccord, nom));
  };

  const choisirSuffixe = (suffixe: string) => {
    if (indexAccord === null || !accordSelectionne) {
      return;
    }
    onChanger(
      poserAccord(
        chanson,
        indexSection,
        indexMesure,
        indexAccord,
        changerSuffixe(accordSelectionne, suffixe)
      )
    );
  };

  const choisirBasse = (basse: string | null) => {
    if (indexAccord === null || !accordSelectionne) {
      return;
    }
    onChanger(
      poserAccord(
        chanson,
        indexSection,
        indexMesure,
        indexAccord,
        changerBasse(accordSelectionne, basse)
      )
    );
  };

  const retirer = () => {
    if (indexAccord === null || !accordSelectionne) {
      return;
    }
    onChanger(retirerAccord(chanson, indexSection, indexMesure, indexAccord));
    setIndexAccord(null);
  };

  const changerRepetitions = (delta: number) => {
    const valeur = Math.min(Math.max(section.repetitions + delta, 1), REPETITIONS_MAX);
    onChanger(modifierSection(chanson, indexSection, { repetitions: valeur }));
  };

  return (
    <>
      <View style={styles.bloc}>
        <Text style={styles.libelle}>Structure</Text>
        <BarreStructure
          sections={chanson.sections}
          indexSection={indexSection}
          indexMesure={indexMesure}
          onSelectionner={choisirMesure}
          onAjouterMesure={(iS) => {
            onChanger(ajouterMesure(chanson, iS));
            setPosition({ section: iS, mesure: chanson.sections[iS].mesures.length });
            setIndexAccord(null);
          }}
          onAjouterSection={() => {
            onChanger(ajouterSection(chanson, `Section ${chanson.sections.length + 1}`));
            setPosition({ section: chanson.sections.length, mesure: 0 });
            setIndexAccord(null);
          }}
        />

        <View style={styles.ligneOptions}>
          <Text style={styles.libelle}>Mesures / ligne</Text>
          <View style={styles.segments}>
            {MESURES_PAR_LIGNE_POSSIBLES.map((nombre) => {
              const actif = nombre === chanson.mesuresParLigne;
              return (
                <Pressable
                  key={nombre}
                  onPress={() => onChanger(changerMesuresParLigne(chanson, nombre))}
                  style={[styles.segment, actif && styles.segmentActif]}
                >
                  <Text style={[styles.texteSegment, actif && styles.texteSegmentActif]}>
                    {nombre}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.bloc}>
        <View style={styles.entete}>
          <TextInput
            value={section.nom}
            onChangeText={(nom) => onChanger(modifierSection(chanson, indexSection, { nom }))}
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

        <View style={styles.actions}>
          <Pressable
            onPress={() => onChanger(dupliquerMesure(chanson, indexSection, indexMesure))}
            style={styles.action}
          >
            <Text style={styles.texteAction}>Dupliquer la mesure</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onChanger(supprimerMesure(chanson, indexSection, indexMesure));
              setPosition({ section: indexSection, mesure: Math.max(indexMesure - 1, 0) });
              setIndexAccord(null);
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
              onChanger(supprimerSection(chanson, indexSection));
              setPosition({ section: Math.max(indexSection - 1, 0), mesure: 0 });
              setIndexAccord(null);
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

      <View style={styles.bloc}>
        <Text style={styles.libelle}>{`Mesure ${numeroMesure}`}</Text>

        <View style={styles.chipsAccords}>
          {mesure.accords.map((accord, index) => {
            const actif = index === indexAccord;
            return (
              <Pressable
                key={index}
                onPress={() => toucherAccord(index)}
                style={[styles.chipAccord, actif && styles.chipAccordActive]}
              >
                <Text
                  style={[styles.texteChipAccord, actif && styles.texteChipAccordActif]}
                >
                  {accord}
                </Text>
              </Pressable>
            );
          })}

          {mesure.accords.length < ACCORDS_MAX ? (
            <Pressable
              onPress={() => toucherAccord(mesure.accords.length)}
              style={[
                styles.chipAccord,
                styles.chipAccordAjout,
                indexAccord === mesure.accords.length && styles.chipAccordActive,
              ]}
            >
              <Text
                style={[
                  styles.texteChipAccordAjout,
                  indexAccord === mesure.accords.length && styles.texteChipAccordActif,
                ]}
              >
                +
              </Text>
            </Pressable>
          ) : null}
        </View>

        <TextInput
          value={mesure.paroles ?? ""}
          onChangeText={(paroles) =>
            onChanger(modifierParoles(chanson, indexSection, indexMesure, paroles))
          }
          placeholder="Paroles sous cette mesure"
          placeholderTextColor={colors.textFaint}
          multiline
          style={styles.champParoles}
        />
      </View>

      <PaveAccords
        actif={indexAccord !== null}
        accord={accordSelectionne}
        onRacine={choisirRacine}
        onSuffixe={choisirSuffixe}
        onBasse={choisirBasse}
        onRetirer={retirer}
      />

      <View style={styles.apercu}>
        <Text style={styles.libelle}>{`Aperçu — ${section.nom}`}</Text>
        <GrilleAccords
          sections={[section]}
          mesuresParLigne={chanson.mesuresParLigne}
          selection={{ section: 0, mesure: indexMesure }}
          onMesure={(_, iMesure) => choisirMesure(indexSection, iMesure)}
        />
      </View>
    </>
  );
}
