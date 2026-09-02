import type { TextStyle, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const stylesActions = {
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
} satisfies Record<string, ViewStyle | TextStyle>;
