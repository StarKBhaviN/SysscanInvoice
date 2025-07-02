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

const dummyPurchaseData = {
  "Purchase Overview": {
    title: "Purchase Overview",
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [
          1000, 1300, 1600, 1800, 1500, 2000, 2200, 2500, 1900, 650, 1250, 2345,
        ],
      },
    ],
  },
  "Total Purchase Amount": {
    title: "Total Purchase Amount",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [{ data: [8000, 11000, 9500, 10200] }],
  },
  "Average Purchase": {
    title: "Average Purchase",
    labels: ["Vendor A", "Vendor B", "Vendor C"],
    datasets: [{ data: [3500, 2800, 4000] }],
  },
  "Vendor Breakdown": {
    title: "Vendor Breakdown",
    labels: ["Vendor A", "Vendor B", "Vendor C", "Vendor D"],
    datasets: [{ data: [5000, 3000, 4000, 2500] }],
  },
  "Category Breakdown": {
    title: "Category Breakdown",
    labels: ["Raw Material", "Equipment", "Others"],
    datasets: [{ data: [7000, 4000, 3000] }],
  },
  "Returns / Disputes": {
    title: "Returns / Disputes",
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [{ data: [500, 300, 700, 200] }],
  },
};

export default function Purchase() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const [currentSection, setCurrentSection] =
    useState<keyof typeof dummyPurchaseData>("Purchase Overview");

  const handleReset = () => {
    setCurrentSection("Purchase Overview");
  };

  return (
    <View style={styles.page}>
      <GraphCharts
        title={dummyPurchaseData[currentSection].title}
        data={dummyPurchaseData[currentSection]}
        type="bar"
        handleReset={handleReset}
      />
      <SepratorLine />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(dummyPurchaseData)
            .filter((key) => key !== "Purchase Overview")
            .map((key) => (
              <SummaryCard
                key={key}
                theme={theme}
                title={key}
                icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
                value="12,000"
                unit="rs"
                onPress={() =>
                  setCurrentSection(key as keyof typeof dummyPurchaseData)
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
