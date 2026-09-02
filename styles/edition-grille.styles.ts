import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const TAILLE_CASE = 40;
export const HAUTEUR_CASE = 38;
export const LARGEUR_LETTRES = 26;

export const styles = StyleSheet.create({
  conteneur: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  defilement: {
    flexDirection: "row",
  },
  lettres: {
    width: LARGEUR_LETTRES,
  },
  enTeteTemps: {
    flexDirection: "row",
    height: 20,
  },
  celluleTemps: {
    width: TAILLE_CASE,
    alignItems: "center",
    justifyContent: "center",
  },
  texteTemps: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.textFaint,
  },
  ligne: {
    flexDirection: "row",
    height: HAUTEUR_CASE,
    alignItems: "center",
  },
  lettreCorde: {
    width: LARGEUR_LETTRES,
    height: HAUTEUR_CASE,
    alignItems: "center",
    justifyContent: "center",
  },
  texteLettre: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  case: {
    width: TAILLE_CASE,
    height: HAUTEUR_CASE,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },
  caseTemps: {
    borderLeftColor: colors.border,
  },
  caseFin: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  corde: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.tabCorde,
  },
  cordeGrave: {
    backgroundColor: colors.tabCordeGrave,
  },
  pastilleSelection: {
    position: "absolute",
    width: TAILLE_CASE - 8,
    height: HAUTEUR_CASE - 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  fondFrette: {
    position: "absolute",
    width: 24,
    height: 20,
    borderRadius: 5,
    backgroundColor: colors.bgCard,
  },
  texteFrette: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.tabFrette,
  },
  texteFretteSelection: {
    color: colors.primaryDark,
  },
  marqueTechnique: {
    position: "absolute",
    bottom: 1,
    fontFamily: fonts.medium,
    fontSize: 9,
    color: colors.tabTechnique,
  },
});
