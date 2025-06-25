import { GraphCharts } from "@/components/GraphCharts";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Payables() {
  const payablesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [600, 500, 450, 700, 650, 800] }],
  };

  return (
    <View style={styles.page}>
      <GraphCharts title="Payables Overview" data={payablesData} type="bar" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
