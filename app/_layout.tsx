// app/_layout.tsx
import ThemeProvider from "@/context/ThemeContext.js";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import "react-native-reanimated";

import { AlertProvider } from "@/context/alertContext";
import { CompanyProvider } from "@/context/companyContext";
import { UserProvider } from "@/context/userContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AlertProvider>
          <UserProvider>
            <CompanyProvider>
              <Slot />
            </CompanyProvider>
          </UserProvider>
        </AlertProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
