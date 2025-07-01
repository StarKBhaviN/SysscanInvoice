import { GraphCharts } from "@/components/charts/GraphCharts";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Receivables() {
  const { theme } = useThemeContext();
  const receivablesData = [
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
  ];

  return (
    <View style={styles.page}>
      <GraphCharts
        title="Receivables Breakdown"
        data={receivablesData}
        type="pie"
      />
      <SepratorLine />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <SummaryCard
          theme={theme}
          title="Total Receivables"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Overdue Receivables"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Paid Receivables"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Top Debtors"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        {/* Setting icon for time period */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});

// Field	Description
// Total Receivables	Outstanding invoices
// Overdue Receivables	Due past their date
// Paid Receivables	Amount already paid
// Receivables Aging	0–30, 31–60, etc.
// Top Debtors	Clients with most dues
// Payment Methods	Breakdown by mode (UPI, Cash, etc.)

// Setting	Description
// Date Range	Invoice issue/due date range
// Aging Buckets	Toggle buckets (0-30, 31-60…)
// Client Filter	Search by client name
// Region Filter	City/State-based filter
// Payment Status	Paid / Unpaid / Overdue
