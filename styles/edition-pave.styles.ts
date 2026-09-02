import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  conteneur: {
    gap: 10,
  },
  consigne: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    paddingVertical: 10,
  },
  rangee: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  touche: {
    flexGrow: 1,
    minWidth: 40,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  toucheActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  texteTouche: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  texteToucheActive: {
    color: colors.textOnPrimary,
  },
  toucheEffacer: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBg,
  },
  texteEffacer: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.error,
  },
  separateur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  libelle: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chip: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 9,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  chipDesactive: {
    opacity: 0.4,
  },
  texteChip: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMedium,
  },
  texteChipActive: {
    color: colors.primaryDark,
  },
});
