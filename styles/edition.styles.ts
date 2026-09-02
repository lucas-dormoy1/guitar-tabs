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
    gap: 14,
    paddingBottom: 56,
  },
  bloc: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    gap: 12,
  },
  champTitre: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
    paddingVertical: 4,
  },
  champArtiste: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMedium,
    paddingVertical: 2,
  },
  libelle: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  structure: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    paddingRight: 4,
  },
  groupeSection: {
    gap: 6,
  },
  nomSection: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pastilles: {
    flexDirection: "row",
    gap: 5,
  },
  pastille: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 6,
    borderRadius: 9,
    backgroundColor: colors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  pastilleActive: {
    backgroundColor: colors.primary,
  },
  textePastille: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMedium,
  },
  textePastilleActive: {
    color: colors.textOnPrimary,
  },
  pastilleAjout: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  textePastilleAjout: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textMuted,
  },
  entete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  champNomSection: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    backgroundColor: colors.bgSubtle,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  compteur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  boutonCompteur: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  texteBoutonCompteur: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textMedium,
  },
  valeurCompteur: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    minWidth: 28,
    textAlign: "center",
  },
  valeurCapo: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    minWidth: 78,
    textAlign: "center",
  },
  ligneOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  segments: {
    flexDirection: "row",
    backgroundColor: colors.bgSubtle,
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  segment: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 8,
  },
  segmentActif: {
    backgroundColor: colors.bgCard,
  },
  texteSegment: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  texteSegmentActif: {
    color: colors.primaryDark,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  action: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: colors.bgSubtle,
  },
  texteAction: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMedium,
  },
  actionDanger: {
    backgroundColor: colors.errorBg,
  },
  texteActionDanger: {
    color: colors.error,
  },
  actionDesactivee: {
    opacity: 0.4,
  },
  chipsAccords: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  chipAccord: {
    minWidth: 58,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  chipAccordActive: {
    backgroundColor: colors.primary,
  },
  texteChipAccord: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  texteChipAccordActif: {
    color: colors.textOnPrimary,
  },
  chipAccordAjout: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  texteChipAccordAjout: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textMuted,
  },
  champParoles: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textDark,
    backgroundColor: colors.bgSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 62,
    textAlignVertical: "top",
  },
  apercu: {
    gap: 8,
  },
  introuvable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 8,
  },
  introuvableTexte: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
  },
});
