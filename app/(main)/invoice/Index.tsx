import ChooseDateRange from "@/components/ui/ChooseDateRange";
import { DynamicTable } from "@/components/ui/DynamicTable";
import InvoiceCard from "@/components/ui/InvoiceCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function PrintInvoice() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const columns = [
    { key: "no", title: "No." },
    { key: "billDt", title: "Bill Dt." },
    { key: "billNo", title: "Bill No." },
    { key: "invAs", title: "Inv. As" },
    { key: "partyName", title: "Party Name" },
    { key: "city", title: "City" },
    { key: "amount", title: "Amount" },
    { key: "type", title: "Type" },
    { key: "ackNo", title: "Ack. No" },
    { key: "ackDt", title: "Ack. Dt" },
    { key: "irnNo", title: "IRN No" },
  ];

  const dummyData = [
    {
      no: 1,
      billDt: "25-06-25",
      billNo: "B001",
      invAs: "Sales",
      partyName: "John",
      city: "NY",
      amount: "1000",
      type: "GST",
      ackNo: "ACK123",
      ackDt: "25-06-25",
      irnNo: "IRN001",
    },
    {
      no: 2,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
    {
      no: 3,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
    {
      no: 4,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
    {
      no: 5,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
    {
      no: 7,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
    {
      no: 8,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
    {
      no: 9,
      billDt: "26-06-25",
      billNo: "B002",
      invAs: "Sales",
      partyName: "Sarah",
      city: "SF",
      amount: "1500",
      type: "GST",
      ackNo: "ACK124",
      ackDt: "26-06-25",
      irnNo: "IRN002",
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.headerText}>Print Invoice Page</Text>
      <InvoiceCard title={"INVOICE INFORMATION"}>
        <View style={styles.part}>
          <Text style={styles.text}>Print What?</Text>
          <Text style={styles.text}>Sales Invoice</Text>
        </View>
        <View style={styles.part}>
          <Text style={styles.text}>Invoice As</Text>
          <Text style={styles.text}>TAX</Text>
        </View>

        <ChooseDateRange />
        <View style={styles.part}>
          <View style={styles.row}>
            <Text style={styles.label}>From</Text>
            <Text style={{ fontWeight: 700, color : theme.icon }}>:</Text>
            <Text style={styles.value}>25-05-25</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>To</Text>
            <Text style={{ fontWeight: 700, color : theme.icon }}>:</Text>
            <Text style={styles.value}>25-06-25</Text>
          </View>
        </View>
      </InvoiceCard>

      <InvoiceCard title={"PARTY/CLIENT INFORMATION"}>
        <View style={styles.part}>
          <Text style={styles.text}>Invoice As</Text>
          <Text style={styles.text}>TAX</Text>
        </View>
        <View style={styles.part}>
          <Text style={styles.text}>Party Name</Text>
          <Text style={styles.text}>BOTH</Text>
        </View>
      </InvoiceCard>

      {/* Print Format, Number of Copies, Print Paper, Print Destination */}
      <InvoiceCard title={"PRINT OPTIONS"}>
        <View style={styles.part}>
          <Text style={styles.text}>Page Format</Text>
          <Text style={styles.text}>A4</Text>
        </View>
        <View style={styles.part}>
          <Text style={styles.text}>Number of Copies</Text>
          <Text style={styles.text}>2</Text>
        </View>
        <View style={styles.part}>
          <Text style={styles.text}>Print Paper</Text>
          <Text style={styles.text}>Plain</Text>
        </View>
        <View style={styles.part}>
          <Text style={styles.text}>Print Destination</Text>
          <Text style={styles.text}>Screen</Text>
        </View>
      </InvoiceCard>

      <DynamicTable columns={columns} data={dummyData} />

      <InvoiceCard title={"FILE/SHARE SETTINGS"}>
        <View style={styles.saveAsPdf}>
          <Text style={{ marginBottom: 4 }}>Save as PDF?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.shareBtn}>
              <Text>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text>Other</Text>
            </TouchableOpacity>
          </View>
        </View>
      </InvoiceCard>
    </ScrollView>
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
    part: ViewStyle;
    saveAsPdf: ViewStyle;
    buttonGroup: ViewStyle;
    shareBtn: ViewStyle;
    row: ViewStyle;
    label: TextStyle;
    value: TextStyle;
    text: TextStyle;
    headerText: TextStyle;
  }>({
    part: {
      // borderWidth: 2,
      width: "49%",
      marginBottom: 8,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
      marginBottom: 12,
    },
    text: {
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
    saveAsPdf: {
      width: "100%",
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "center",
    },
    shareBtn: {
      backgroundColor: "white",
      height: 30,
      marginRight: 10,
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      marginBottom: 6,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "70%",
    },
    label: {
      fontWeight: "bold",
      minWidth: 32,
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
    value: {
      textAlign: "right",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
  });
}
