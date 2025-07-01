import { GraphCharts } from "@/components/charts/GraphCharts";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Purchase() {
  const { theme } = useThemeContext();
  const purchaseData = {
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
  };

  return (
    <View style={styles.page}>
      <GraphCharts title="Purchase Overview" data={purchaseData} type="bar" />
      <SepratorLine />
      {/* Add Number of Purchase Orders in it but it should be expandable and when expanded then show Number of Purchase */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <SummaryCard
          theme={theme}
          title="Total Purchase Amount"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Average Purchase"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Vendor Breakdown"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Category Breakdown"
          icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
          value="12,000"
          unit="rs"
          // onPress={() => router.push("/(main)/home/Sales")}
        />
        <SummaryCard
          theme={theme}
          title="Returns / Disputes"
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

// Field	Description
// Total Purchase Amount : Sum of all purchases  *
// Number of Purchase Orders : Count of entries  *
// Average Purchase Value	: Avg Total / No. of Orders **
// Vendor Breakdown	: Vendor-wise purchases ***
// Category Breakdown	: Material/Service based view ***
// Purchase Returns / Disputes : Value of returns ****

// GRAPH SETTINGS
// Date Range	From – To
// Group By	Day / Week / Month / Year
// Vendor Filter	Multi-select
// Category Filter	Raw Material / Equipment / Others
// Region Filter	Vendor region-wise filtering
// Purchase Type	Goods / Services
