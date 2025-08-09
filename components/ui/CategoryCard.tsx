import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TransactionData {
  "COUNT(BILL_NO_SNC_N)": number;
  "Sum(NET_AMT)": number;
  "Sum(QTY1)": number;
  "Sum(QTY3)": number;
  TYP: string;
}

interface CategoryCardProps {
  theme: {
    background: string;
    headText: string;
    subText: string;
    tint: string;
  };
  title: string;
  icon?: React.ReactNode;
  data: TransactionData;
  unit: string;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  theme,
  title,
  icon,
  data,
  unit,
  onPress,
}) => {
  const { colorScheme } = useThemeContext();
  const styles = createStyles(colorScheme);
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.tint }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: theme.headText }]}>{title}</Text>
          <Text style={styles.themeText}>
            Bills :{" "}
            <Text style={{ color: theme.headText }}>
              {data["COUNT(BILL_NO_SNC_N)"]}
            </Text>
          </Text>
        </View>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: theme.background,
            height: 34,
            width: 34,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: theme.headText }]}>
          {data["Sum(NET_AMT)"].toLocaleString("en-IN")}
        </Text>
        <Text style={[styles.unit, { color: theme.subText }]}>{unit}</Text>
      </View>
      <View style={[styles.valueRow, { marginBottom: 0 }]}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={styles.themeText}>Pcs</Text>
            <Text style={styles.themeText}>:</Text>
            <Text style={{ color: theme.headText }}>
              {data["Sum(QTY1)"].toLocaleString("en-IN")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={styles.themeText}>Qty</Text>
            <Text style={styles.themeText}>:</Text>
            <Text style={{ color: theme.headText }}>
              {data["Sum(QTY3)"].toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function createStyles(colorScheme: string) {
  return StyleSheet.create({
    card: {
      borderRadius: 12,
      padding: 14,
      width: "48%",
      marginBottom: 15,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      minHeight: 40,
    },
    left: {
      flex: 0.9,
    },
    title: {
      fontSize: 17,
      fontWeight: "bold",
      flexShrink: 1,
    },
    valueRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 8,
    },
    value: {
      fontSize: 16,
      marginRight: 6,
      fontWeight: "900",
    },
    unit: {
      fontSize: 16,
    },
    themeText: {
      color: colorScheme === "dark" ? "#8E8E8E" : "#505050ff",
    },
  });
}
