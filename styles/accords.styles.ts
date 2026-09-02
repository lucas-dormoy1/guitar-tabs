import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { LARGEUR_MAX } from "../theme/tablature";

export const styles = StyleSheet.create({
  conteneur: {
    width: "100%",
    backgroundColor: colors.tabPapier,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  page: {
    width: "100%",
    maxWidth: LARGEUR_MAX,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  enTeteSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nomSection: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.tabLabel,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  repetitions: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.tabTechnique,
  },
  ligne: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  mesure: {
    flex: 1,
    minHeight: 30,
    paddingLeft: 8,
    paddingRight: 4,
    gap: 3,
    borderLeftWidth: 1,
    borderLeftColor: colors.tabBarreMesure,
  },
  mesureFin: {
    borderRightWidth: 1,
    borderRightColor: colors.tabBarreMesure,
  },
  mesureActive: {
    backgroundColor: colors.tabSelection,
  },
  celluleVide: {
    flex: 1,
  },
  accords: {
    flexDirection: "row",
    minHeight: 22,
  },
  accord: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.tabFrette,
  },
  paroles: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMedium,
  },
});
