import { GraphCharts } from "@/components/charts/GraphCharts";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const dummyPayablesData = {
  "Payables Overview": {
    title: "Payables Overview",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [600, 500, 450, 700, 650, 800] }],
  },
  "Sum of Unpaid Amounts": {
    title: "Sum of Unpaid Amounts",
    labels: ["Vendor A", "Vendor B", "Vendor C"],
    datasets: [{ data: [3000, 2000, 1000] }],
  },
  "Overdue Amounts": {
    title: "Overdue Amounts",
    labels: ["0-30", "31-60", "61-90", ">90"],
    datasets: [{ data: [800, 600, 300, 100] }],
  },
  "Paid Payables": {
    title: "Paid Payables",
    labels: ["UPI", "Cash", "Bank Transfer"],
    datasets: [{ data: [2000, 1500, 3500] }],
  },
  "Vendor Payables": {
    title: "Vendor Payables",
    labels: ["Vendor A", "Vendor B", "Vendor C"],
    datasets: [{ data: [4000, 2500, 1000] }],
  },
};

export default function Payables() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [currentSection, setCurrentSection] =
    useState<keyof typeof dummyPayablesData>("Payables Overview");

  const handleReset = () => {
    setCurrentSection("Payables Overview");
  };

  return (
    <View style={styles.page}>
      <GraphCharts
        title={dummyPayablesData[currentSection].title}
        data={dummyPayablesData[currentSection]}
        type="bar"
        handleReset={handleReset}
      />
      <SepratorLine />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(dummyPayablesData)
            .filter((key) => key !== "Payables Overview")
            .map((key) => (
              <SummaryCard
                key={key}
                theme={theme}
                title={key}
                icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
                value="12,000"
                unit="rs"
                onPress={() =>
                  setCurrentSection(key as keyof typeof dummyPayablesData)
                }
              />
            ))}
        </View>
      </ScrollView>
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
    page: ViewStyle;
    salesBtn: ViewStyle;
    salesText: TextStyle;
  }>({
    page: {
      flex: 1,
    },
    salesBtn: {
      borderWidth: 0.5,
      padding: 12,
      width: 100,
      borderRadius: 14,
      marginBottom: 14,
      backgroundColor: theme.tint,
      borderColor: colorScheme === "dark" ? theme.icon : "#323232",
    },
    salesText: {
      color: colorScheme === "dark" ? theme.icon : "#323232",
    },
  });
}
