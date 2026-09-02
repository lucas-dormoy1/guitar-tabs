import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";

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
});
