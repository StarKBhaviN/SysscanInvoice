import { useSQLite } from "@/context/SQLiteContext";
import { useCompanyContext } from "@/context/companyContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle,
} from "react-native";

// This is a placeholder for your actual data item type
type DetailItem = {
  id: string;
  PartyName: string;
  NET_AMT: number;
  totalNET_AMT: string;
  totalQTY1: string;
  totalQTY3: string;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CategoryDetailsPage() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const { title, typ } = useLocalSearchParams<{ title: string; typ: string }>();

  const { controllers } = useSQLite();
  const { selectedCompanies } = useCompanyContext();
  const companyCodes = selectedCompanies.map((c) => c.CMP_CD);

  const [expandedParty, setExpandedParty] = useState<string | null>(null);
  const {
    data: summaryData = [],
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErrObj,
  } = useQuery({
    queryKey: ["detailsSummary", companyCodes.sort(), typ],
    queryFn: () => {
      if (!controllers || !typ) {
        throw new Error("Query function called with invalid parameters.");
      }
      return controllers.Home.getSummaryByTyp(companyCodes, typ);
    },
    enabled: !!typ && companyCodes.length > 0,
  });

  const {
    data: detailsData,
    isLoading: detailsLoading,
    isError: detailsError,
    error: detailsErrObj,
  } = useQuery({
    queryKey: ["homeDetails", companyCodes.sort(), typ, expandedParty],
    queryFn: () => {
      if (!controllers || !typ) {
        throw new Error("Query function called with invalid parameters.");
      }
      return controllers.Home.getSummaryDetailsByTyp(
        companyCodes,
        typ,
        expandedParty!
      );
    },
    enabled: !!typ && !!expandedParty && companyCodes.length > 0,
  });

  const toggleExpand = (partyName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedParty(expandedParty === partyName ? null : partyName);
  };

  if (summaryLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (summaryError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error fetching details: {summaryErrObj?.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>

      {/* You can now render the details for the category */}
      <FlatList
        data={summaryData as DetailItem[]}
        keyExtractor={(item: DetailItem) => item.PartyName}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expandedParty === item.PartyName;

          return (
            <View style={styles.card}>
              {/* Summary Row */}
              <TouchableOpacity onPress={() => toggleExpand(item.PartyName)}>
                <Text style={styles.partyName}>{item.PartyName}</Text>
                <Text style={styles.amount}>
                  Total Amount: ₹
                  {Number(item.totalNET_AMT).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.qty}>Total QTY1: {item.totalQTY1}</Text>
                <Text style={styles.qty}>
                  Total QTY3: {Number(item.totalQTY3).toLocaleString("en-IN")}
                </Text>
              </TouchableOpacity>

              {/* Expanded Details */}
              {isExpanded && (
                <ScrollView
                  style={styles.detailsContainer}
                  nestedScrollEnabled={true}
                >
                  {detailsLoading ? (
                    <ActivityIndicator size="small" />
                  ) : detailsError ? (
                    <Text style={styles.errorText}>
                      {detailsErrObj?.message}
                    </Text>
                  ) : (
                    detailsData?.map((bill: any) => (
                      <View key={bill.BILL_NO_SNC_N} style={styles.billRow}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 12,
                          }}
                        >
                          <Text style={[styles.billText, { fontWeight: 700 }]}>
                            {bill.BrokerName || "No Broker Data"}
                          </Text>
                          <Text style={styles.billText}>
                            Bill No: {bill.BILL_NO_SNC_N}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.billText}>QTY1: {bill.QTY1}</Text>
                          <Text style={styles.billText}>QTY3: {bill.QTY3}</Text>
                        </View>

                        <Text
                          style={[
                            styles.billText,
                            { textAlign: "right", fontWeight: 900 },
                          ]}
                        >
                          Total : ₹
                          {Number(bill.NET_AMT).toLocaleString("en-IN")}
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: string;
    tint?: string;
    icon?: string;
    tabIconDefault?: string;
    tabIconSelected?: string;
    placeholderText?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    headerText: TextStyle;
    pageTitle: TextStyle;
    listContent: ViewStyle;
    centered: ViewStyle;
    errorText: TextStyle;
    card: ViewStyle;
    partyName: TextStyle;
    amount: TextStyle;
    qty: TextStyle;
    detailsContainer: ViewStyle;
    billRow: ViewStyle;
    billText: TextStyle;
  }>({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      marginBottom: 12,
      marginTop: 6,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText,
      textAlign: "center",
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: "bold",
      margin: 16,
      color: theme.headText,
    },
    listContent: {
      paddingHorizontal: 12,
      paddingBottom: 20,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: "red",
      fontSize: 14,
      marginTop: 8,
    },
    card: {
      backgroundColor: colorScheme === "dark" ? "#1B263B" : "#fff",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    partyName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.headText,
      marginBottom: 4,
    },
    amount: {
      fontSize: 14,
      color: "#2E7D32",
      marginBottom: 2,
    },
    qty: {
      fontSize: 13,
      color: theme.subText,
    },
    detailsContainer: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#eee",
      maxHeight: 400,
    },
    billRow: {
      backgroundColor: colorScheme === "dark" ? "#0D1B2A" : "#F9FAFB",
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
    },
    billText: {
      fontSize: 12,
      color: theme.subText,
    },
  });
}
