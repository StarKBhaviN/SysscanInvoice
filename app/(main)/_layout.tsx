import FooterNav from "@/components/FooterNav";
import Header from "@/components/Header";
import { useThemeContext } from "@/hooks/useThemeContext";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { CompanyProvider } from "@/context/companyContext";
import { SQLiteProvider } from "@/context/SQLiteContext";
import { useUserContext } from "@/context/userContext";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

export default function MainLayout() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const { token, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <SQLiteProvider>
          <CompanyProvider>
            <Header />
            <View style={styles.content}>
              <Slot />
            </View>
            <FooterNav />
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
