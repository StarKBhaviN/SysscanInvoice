import { CategoryCard } from "@/components/ui/CategoryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export default function Home() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  return (
    <View style={styles.homePage}>
      <View style={styles.cardOuter}>
        <LinearGradient
          colors={["#003953", theme.tint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardTop}
        >
          <Text style={styles.headText}>June Invoices Report</Text>
        </LinearGradient>

        <View style={styles.cardBottom}>
          <View style={styles.partition}>
            <Text style={{ color: theme.subText }}>Paid</Text>
            <Text style={{ fontSize: 22, color: theme.headText }}>1,500</Text>
          </View>

          <Text
            style={{
              color: theme.subText,
              marginRight: 24,
              marginLeft: 12,
              fontSize: 34,
              fontWeight: 200,
            }}
          >
            |
          </Text>

          <View style={styles.partition}>
            <Text style={{ color: theme.subText }}>Unpaid</Text>
            <Text style={{ fontSize: 22, color: theme.headText }}>123</Text>
          </View>

          <Text
            style={{
              color: theme.subText,
              marginRight: 24,
              marginLeft: 12,
              fontSize: 34,
              fontWeight: 200,
            }}
          >
            |
          </Text>

          <View
            style={[
              styles.partition,
              { borderEndWidth: 0, marginRight: 0, marginLeft: 0 },
            ]}
          >
            <Text style={{ color: theme.subText }}>Overdue</Text>
            <Text style={{ fontSize: 22, color: theme.headText }}>320</Text>
          </View>
        </View>
      </View>

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
    cardOuter: ViewStyle;
    cardBottom: ViewStyle;
    cardTop: ViewStyle;
    headText: TextStyle;
    partition: ViewStyle;
  }>({
    homePage: {
      flex: 1,
      paddingVertical: 8,
    },
    cardOuter: {
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 24,
    },
    cardTop: {
      padding: 16,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    headText: {
      fontSize: 24,
      width: "70%",
      color: "#fff",
      fontWeight: "600",
    },
    cardBottom: {
      backgroundColor: theme.tint,
      padding: 16,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      flexDirection: "row",
    },
    partition: {
      // borderWidth: 1,
      flex: 1,
      borderColor: theme.subText,
    },
  });
}
