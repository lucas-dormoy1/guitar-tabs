import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { stylesActions } from "./actions.styles";

export const styles = StyleSheet.create({
  ...stylesActions,
  ecran: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  liste: {
    padding: 16,
    gap: 12,
  },
  boutonsAjout: {
    flexDirection: "row",
    gap: 10,
  },
  boutonAjout: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  texteBoutonAjout: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textOnPrimary,
  },
  boutonAjoutSecondaire: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  texteBoutonAjoutSecondaire: {
    color: colors.primaryDark,
  },
  carte: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 14,
  },
  enTeteCarte: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  lienCarte: {
    flex: 1,
  },
  actionsCarte: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  boutonSupprimer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  boutonSupprimerActif: {
    backgroundColor: colors.errorBg,
  },
  texteBoutonSupprimer: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  texteBoutonSupprimerActif: {
    color: colors.error,
  },
  confirmation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  texteConfirmation: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMedium,
  },
  actionsConfirmation: {
    flexDirection: "row",
    gap: 8,
  },
  titre: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textDark,
  },
  artiste: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.primaryBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeTexte: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  vide: {
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  videTitre: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textMedium,
  },
  videTexte: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});
