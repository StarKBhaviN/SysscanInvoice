import { GraphCharts } from "@/components/GraphCharts";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Receivables() {
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});