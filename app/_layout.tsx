import ThemeProvider from "@/context/ThemeContext.js";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import "react-native-reanimated";

import { AlertProvider } from "@/context/alertContext";
import { UserProvider } from "@/context/userContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AlertProvider>
          <UserProvider>
            <Slot />
          </UserProvider>
        </AlertProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
