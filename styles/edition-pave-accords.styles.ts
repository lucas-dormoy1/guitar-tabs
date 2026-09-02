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
    minWidth: 52,
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
    fontSize: 15,
    color: colors.textDark,
  },
  texteToucheActive: {
    color: colors.textOnPrimary,
  },
  entete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  libelle: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  boutonRetirer: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.errorBg,
    alignItems: "center",
    justifyContent: "center",
  },
  texteRetirer: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.error,
  },
  chip: {
    paddingHorizontal: 12,
    height: 36,
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
