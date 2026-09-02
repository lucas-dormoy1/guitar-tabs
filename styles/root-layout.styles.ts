import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  chargement: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
});

export const optionsStack = {
  headerStyle: { backgroundColor: colors.bgBase },
  headerTitleStyle: { fontFamily: fonts.bold, color: colors.textDark, fontSize: 17 },
  headerTintColor: colors.primary,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.bgBase },
} as const;
