import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ChansonsProvider } from "../contexts/ChansonsContext";
import { optionsStack, styles } from "../styles/root-layout.styles";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [policesChargees] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (policesChargees) {
      SplashScreen.hideAsync();
    }
  }, [policesChargees]);

  if (!policesChargees) {
    return <View style={styles.chargement} />;
  }

  return (
    <SafeAreaProvider>
      <ChansonsProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={optionsStack}>
          <Stack.Screen name="index" options={{ title: "Mes chansons" }} />
          <Stack.Screen name="chanson/[id]" options={{ title: "" }} />
          <Stack.Screen name="edition/[id]" options={{ title: "Édition" }} />
        </Stack>
      </ChansonsProvider>
    </SafeAreaProvider>
  );
}
