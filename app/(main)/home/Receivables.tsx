import { GraphCharts } from "@/components/charts/GraphCharts";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

const dummyReceivablesData = {
  "Receivables Breakdown": [
    {
      name: "Customers A",
      value: 500,
      color: "#FF6384",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Customers B",
      value: 300,
      color: "#36A2EB",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Customers C",
      value: 200,
      color: "#FFCE56",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Customers D",
      value: 150,
      color: "#CDCE56",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ],
  "Total Receivables": [
    {
      name: "Pending",
      value: 12000,
      color: "#FFA07A",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ],
  "Overdue Receivables": [
    {
      name: "Overdue",
      value: 4500,
      color: "#FA8072",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ],
  "Paid Receivables": [
    {
      name: "Paid",
      value: 7500,
      color: "#90EE90",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ],
  "Top Debtors": [
    {
      name: "Debtor A",
      value: 2000,
      color: "#8A2BE2",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Debtor B",
      value: 1500,
      color: "#5F9EA0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ],
};

export default function Receivables() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [currentSection, setCurrentSection] = useState<
    keyof typeof dummyReceivablesData
  >("Receivables Breakdown");

  const handleReset = () => {
    setCurrentSection("Receivables Breakdown");
  };

  return (
    <View style={styles.page}>
      <GraphCharts
        title={currentSection}
        data={dummyReceivablesData[currentSection]}
        type="pie"
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
          {Object.keys(dummyReceivablesData)
            .filter((key) => key !== "Receivables Breakdown")
            .map((key) => (
              <SummaryCard
                key={key}
                theme={theme}
                title={key}
                icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
                value="12,000"
                unit="rs"
                onPress={() =>
                  setCurrentSection(key as keyof typeof dummyReceivablesData)
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
