import { CategoryCard } from "@/components/ui/CategoryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import HomeSummary from "./_components/HomeSummary";

export default function Home() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  return (
    <View style={styles.homePage}>
      <HomeSummary />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <CategoryCard
          theme={theme}
          title="Sales"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          onPress={() => router.push("/(main)/home/Sales")}
        />
        <CategoryCard
          theme={theme}
          title="Purchase"
          icon={<Entypo name="layers" size={24} color={theme.icon} />}
          value="Value"
          unit="Value"
          onPress={() => router.push("/(main)/home/Purchase")}
        />
        <CategoryCard
          theme={theme}
          title="Receivables"
          icon={<Feather name="arrow-down-left" size={24} color={theme.icon} />}
          value="1500"
          unit="rs"
          onPress={() => router.push("/(main)/home/Receivables")}
        />
        <CategoryCard
          theme={theme}
          title="Payables"
          icon={<Feather name="arrow-up-right" size={24} color={theme.icon} />}
          value="500"
          unit="rs"
          onPress={() => router.push("/(main)/home/Payables")}
        />
      </View>
    </View>
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
  return StyleSheet.create<{
    homePage: ViewStyle;
  }>({
    homePage: {
      flex: 1,
      paddingVertical: 8,
    },
  });
}
