import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  children: React.ReactNode;
  title: string;
  showRecordsCount?: boolean;
  recordsCount?: number;
};

export default function InvoiceCard({
  children,
  title,
  showRecordsCount,
  recordsCount,
}: Props) {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
        {showRecordsCount && (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Records : {recordsCount}
          </Text>
        )}
      </View>
      <View style={styles.content}>{children}</View>
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
  return StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    header: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: colorScheme === "light" ? "#929dae" : "#193a4d",
      padding: 6,
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    content: {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: theme.tint,
      padding: 6,
      paddingHorizontal: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  });
}
