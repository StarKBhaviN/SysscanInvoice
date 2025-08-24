import { GraphCharts } from "@/components/charts/GraphCharts";
import SepratorLine from "@/components/ui/SepratorLine";
import { SummaryCard } from "@/components/ui/SummaryCard";
import {
  useReceivablesDetails,
  useReceivablesSummary,
} from "@/hooks/useHomeDataQuery";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const dummyReceivablesData = {
  "Receivables Overview": {
    title: "Receivables Overview",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [700, 650, 500, 800, 900, 750] }],
  },
  "Sum of Receivables": {
    title: "Sum of Receivables",
    labels: ["Debtor A", "Debtor B", "Debtor C"],
    datasets: [{ data: [3500, 2500, 1500] }],
  },
  "Overdue Receivables": {
    title: "Overdue Receivables",
    labels: ["0-30", "31-60", "61-90", ">90"],
    datasets: [{ data: [1000, 800, 500, 200] }],
  },
  "Paid Receivables": {
    title: "Paid Receivables",
    labels: ["UPI", "Cash", "Bank Transfer"],
    datasets: [{ data: [4000, 2000, 1500] }],
  },
  "Debtor Receivables": {
    title: "Debtor Receivables",
    labels: ["Debtor A", "Debtor B", "Debtor C"],
    datasets: [{ data: [5000, 3000, 2000] }],
  },
};

export default function Receivables() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [currentSection, setCurrentSection] = useState<
    keyof typeof dummyReceivablesData
  >("Receivables Overview");
  const [expandedParty, setExpandedParty] = useState<string | null>(null);

  const FROM = "2023-04-01";
  const TO = "2025-04-30";
  const { data: summary = [], isLoading: sLoading } = useReceivablesSummary(
    FROM,
    TO
  );
  const {
    data: details = [],
    isLoading: dLoading,
    isError: dError,
    error: dErrObj,
  } = useReceivablesDetails(expandedParty, FROM, TO);

  const handleReset = () => {
    setCurrentSection("Receivables Overview");
  };

  const toggleExpand = (partyName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedParty(expandedParty === partyName ? null : partyName);
  };

  return (
    <View style={styles.page}>
      <GraphCharts
        title={dummyReceivablesData[currentSection].title}
        data={dummyReceivablesData[currentSection]}
        type="bar"
        handleReset={handleReset}
      />
      <SepratorLine />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          {Object.keys(dummyReceivablesData)
            .filter((key) => key !== "Receivables Overview")
            .map((key) => (
              <SummaryCard
                key={key}
                theme={theme}
                title={key}
                icon={<Entypo name="bar-graph" size={24} color={theme.icon} />}
                value="15,000"
                unit="rs"
                onPress={() =>
                  setCurrentSection(key as keyof typeof dummyReceivablesData)
                }
              />
            ))}
        </View>

        {/* Party Listing */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Party-wise Receivables</Text>

          {sLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={summary}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const isExpanded = expandedParty === item.PartyName;
                return (
                  <View style={styles.card}>
                    {/* Summary Row */}
                    <TouchableOpacity
                      onPress={() => toggleExpand(item.PartyName)}
                    >
                      <Text style={styles.partyName}>{item.PartyName}</Text>
                      <Text style={styles.amount}>
                        Amount: ₹{item.totalDOC_AMT.toLocaleString()}
                      </Text>
                      <Text style={styles.qty}>
                        Entries: {item.totalEntries}
                      </Text>
                    </TouchableOpacity>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <View style={styles.detailsContainer}>
                        {dLoading ? (
                          <ActivityIndicator size="small" />
                        ) : dError ? (
                          <Text style={styles.errorText}>
                            {dErrObj?.message}
                          </Text>
                        ) : details?.length > 0 ? (
                          details.map((d: any, idx: number) => (
                            <View key={idx} style={styles.detailRow}>
                              <Text style={styles.detailText}>
                                Doc#: {d.DOC_NO} | Date: {d.DOC_DATE}
                              </Text>
                              <Text
                                style={[
                                  styles.detailText,
                                  { fontWeight: "700" },
                                ]}
                              >
                                Amount: ₹{d.DOC_AMT.toLocaleString()}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.detailText}>
                            No details found
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}
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
  },
  colorScheme: string
) {
  return StyleSheet.create<{
    page: ViewStyle;
    cardsRow: ViewStyle;
    sectionTitle: TextStyle;
    card: ViewStyle;
    partyName: TextStyle;
    amount: TextStyle;
    qty: TextStyle;
    detailsContainer: ViewStyle;
    detailRow: ViewStyle;
    detailText: TextStyle;
    errorText: TextStyle;
  }>({
    page: { flex: 1 },
    cardsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText,
      marginBottom: 10,
    },
    card: {
      backgroundColor: colorScheme === "dark" ? "#1B263B" : "#fff",
      padding: 14,
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
      color: "#1565C0",
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
    },
    detailRow: {
      backgroundColor: colorScheme === "dark" ? "#0D1B2A" : "#F9FAFB",
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
    },
    detailText: {
      fontSize: 12,
      color: theme.subText,
    },
    errorText: {
      color: "red",
      fontSize: 13,
      marginTop: 4,
    },
  });
}
