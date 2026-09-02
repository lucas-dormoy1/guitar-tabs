import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  contenu: {
    padding: 16,
    gap: 16,
    paddingBottom: 48,
  },
  enTete: {
    flex: 1,
    gap: 4,
  },
  enTeteAvecAction: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titre: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  artiste: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  puce: {
    backgroundColor: colors.bgSubtle,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  puceTexte: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMedium,
  },
  barreOutils: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  barreLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  groupeEchelle: {
    flexDirection: "row",
    backgroundColor: colors.bgSubtle,
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  boutonEchelle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  boutonEchelleActif: {
    backgroundColor: colors.bgCard,
  },
  boutonEchelleTexte: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  boutonEchelleTexteActif: {
    color: colors.primaryDark,
  },
  boutonEditer: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  texteBoutonEditer: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textOnPrimary,
  },
  notes: {
    backgroundColor: colors.accentBg,
    borderRadius: 12,
    padding: 14,
  },
  notesTexte: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMedium,
  },
  legende: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 2,
  },
  legendeTexte: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textFaint,
  },
  introuvable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  introuvableTexte: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textMuted,
  },
});
