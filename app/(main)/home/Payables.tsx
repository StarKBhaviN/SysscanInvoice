import { GraphCharts } from "@/components/charts/GraphCharts";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Payables() {
  const { theme } = useThemeContext();

  const payablesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [600, 500, 450, 700, 650, 800] }],
  };

  return (
    <View style={styles.page}>
      <GraphCharts title="Payables Overview" data={payablesData} type="bar" />
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
          title="Sum of Unpaid Amounts"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Overdue Amounts"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        {/* In paid payables there should be also Common Method of payment */}
        <SummaryCard
          theme={theme}
          title="Paid Payables"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Vendor Payables"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});

// Total Payables	Sum of unpaid amounts
// Overdue Payables	Amounts not paid on time
// Paid Payables	Already settled bills
// Vendor Payables	Breakdown per vendor
// Payment Method Usage	Which method used for payables
// Payables Aging	Based on due time buckets

// Date Range	Invoice date / due date
// Vendor Filter	List of vendors
// Aging Buckets	0–30, 31–60, 61–90, >90
// Category Filter	Supplies / Services / Others
// Payment Status	Paid / Unpaid / Partially Paid
