// app/(main)/_layout.tsx
import FooterNav from "@/components/FooterNav";
import Header from "@/components/Header";
import { useThemeContext } from "@/hooks/useThemeContext";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { CompanyProvider } from "@/context/companyContext";
import { SQLiteProvider } from "@/context/SQLiteContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

export default function MainLayout() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <SQLiteProvider>
          <CompanyProvider>
            <QueryClientProvider client={queryClient}>
              <Header />
              <View style={styles.content}>
                <Slot />
              </View>
              <FooterNav />
            </QueryClientProvider>
          </CompanyProvider>
        </SQLiteProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: any;
    tint?: string;
    icon?: string;
    tabIconDefault?: string;
    tabIconSelected?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 12,
      paddingVertical: 6,
    },
  });
}
