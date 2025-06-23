// app/(main)/_layout.tsx
import FooterNav from "@/components/FooterNav";
import Header from "@/components/Header";
import { useThemeContext } from "@/hooks/useThemeContext";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Slot } from "expo-router";

export default function MainLayout() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Header />
        <View style={styles.content}>
          <Slot />
        </View>
        <FooterNav />
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
    },
  });
}
