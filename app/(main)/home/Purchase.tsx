import { GraphCharts } from "@/components/charts/GraphCharts";
import { DynamicTable } from "@/components/ui/DynamicTable";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useHomeDetailsQuery } from "@/hooks/useHomeDataQuery";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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

  const { typ } = useLocalSearchParams<{ typ: string }>();

  const { data, isLoading, isError } = useHomeDetailsQuery(typ);

  const [currentSection, setCurrentSection] =
    useState<keyof typeof dummyPurchaseData>("Purchase Overview");

  const handleReset = () => {
    setCurrentSection("Purchase Overview");
  };

  if (isLoading && !data) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <Text>Error loading details.</Text>;
  }

  const columns = [
    { key: "no", title: "No." },
    { key: "billNo", title: "Bill No." },
    { key: "billDt", title: "Bill Dt." },
    { key: "invAs", title: "Inv. As" },
    { key: "partyName", title: "Party Name" },
    { key: "brokerName", title: "Broker Name" },
    { key: "quantity", title: "Quantity" },
    { key: "amount", title: "Amount" },
    { key: "city", title: "City" },
    { key: "ackNo", title: "Ack. No" },
    { key: "ackDt", title: "Ack. Dt" },
  ];

  const formattedTableData =
    data?.map((item, index) => ({
      no: index + 1,
      billNo: item.BILL_NO_SNC_N,
      billDt: "N/A",
      invAs: "N/A",
      partyName: item.PartyName,
      brokerName: item.BrokerName,
      quantity: item.QTY1.toString(),
      amount: item.NET_AMT.toString(),
      city: "N/A",
      ackNo: "N/A",
      ackDt: "N/A",
    })) || [];

  return (
    <View style={styles.page}>
      <GraphCharts
        title={dummyPurchaseData[currentSection].title}
        data={dummyPurchaseData[currentSection]}
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

        <DynamicTable columns={columns} data={formattedTableData} showSearch />
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
