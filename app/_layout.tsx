import ThemeProvider from "@/context/ThemeContext.js";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import "react-native-reanimated";

import { AlertProvider } from "@/context/alertContext";
import { UserProvider } from "@/context/userContext";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { AppState, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

// Bridge app state to react-query focus state (for RN)
function onAppStateChange(status: string) {
  focusManager.setFocused(status === "active");
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) return null;

  if (Platform.OS !== "web") {
    AppState.addEventListener("change", onAppStateChange);
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AlertProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <Slot />
            </UserProvider>
          </QueryClientProvider>
        </AlertProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
