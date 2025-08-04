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

const dummyGraphData = {
  "Sales Overview": {
    title: "Sales Overview",
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
  "Sales Summary": {
    title: "Sales Summary",
    labels: ["Orders", "Revenue", "Units", "Avg Order Value"],
    datasets: [{ data: [120, 12000, 3200, 100] }],
  },
  "Sales By Product": {
    title: "Sales By Product",
    labels: ["Shirts", "Jeans", "Jackets", "Shoes"],
    datasets: [{ data: [3400, 2200, 1700, 4700] }],
  },
  "Sales By Region": {
    title: "Sales By Region",
    labels: ["North", "South", "East", "West"],
    datasets: [{ data: [3000, 2500, 2800, 3200] }],
  },
  "Sales By Channel": {
    title: "Sales By Channel",
    labels: ["Online", "Retail", "Wholesale"],
    datasets: [{ data: [5000, 4000, 3000] }],
  },
};

export default function Sales() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [currentSection, setCurrentSection] =
    useState<keyof typeof dummyGraphData>("Sales Overview");

  const { typ } = useLocalSearchParams<{ typ: string }>();

  const handleReset = () => {
    setCurrentSection("Sales Overview");
  };

  const { data, isLoading, isError } = useHomeDetailsQuery(typ);

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
  console.log(data);
  return (
    <View style={styles.page}>
      <GraphCharts
        title={dummyGraphData[currentSection].title}
        data={dummyGraphData[currentSection]}
        type="line"
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
          {Object.keys(dummyGraphData)
            .filter((key) => key !== "Sales Overview")
            .map((key) => (
              <SummaryCard
                key={key}
                theme={theme}
                title={key}
                icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
                value={"12,000"}
                unit="rs"
                onPress={() =>
                  setCurrentSection(key as keyof typeof dummyGraphData)
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
    resetButton: ViewStyle;
    resetButtonText: TextStyle;
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
    resetButton: {
      alignSelf: "flex-end",
      marginVertical: 12,
      marginRight: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.tint,
      borderRadius: 8,
    },
    resetButtonText: {
      color: "#fff",
      fontWeight: "600",
    },
  });
}
