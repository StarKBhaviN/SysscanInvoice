import { GraphCharts } from "@/components/GraphCharts";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Purchase() {
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});