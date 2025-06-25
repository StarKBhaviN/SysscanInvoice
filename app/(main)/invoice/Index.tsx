import InvoiceCard from "@/components/ui/InvoiceCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

export default function PrintInvoice() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  return (
    <View>
      <Text>Print Invoice Page</Text>
      <InvoiceCard title={"INVOICE INFORMATION"}>
        <View style={styles.part}>
          <Text>Invoice Type</Text>
          <Text>TAX</Text>
        </View>
        <View style={styles.part}>
          <Text>Invoice Series</Text>
          <Text>YARN</Text>
        </View>
        <View style={styles.part}>
          <Text>Start Invoice No.</Text>
          <Text>7</Text>
        </View>
        <View style={styles.part}>
          <Text>End Invoice No.</Text>
          <Text>9</Text>
        </View>
      </InvoiceCard>

      <InvoiceCard title={"PARTY/CLIENT INFORMATION"}>
        <View style={styles.part}>
          <Text>Client Name</Text>
          <Text>Alice Smith</Text>
        </View>
        <View style={styles.part}>
          <Text>Client Details</Text>
          <Text>123, Main Street, City.</Text>
          <Text>GSTIN: 1234567890</Text>
        </View>
        <View style={styles.part}>
          <Text>Print Party Name? ...</Text>
          <Text>Print Broker Name? ...</Text>
        </View>
        <View style={styles.part}>
          <Text>Print Consignee Name? ...</Text>
          <Text>Print Due Date? ...</Text>
        </View>
      </InvoiceCard>

      <InvoiceCard title={"PRINT OPTIONS"}>
        <View style={styles.part}>
          <Text>Page Size</Text>
          <Text>A4</Text>
        </View>
        <View style={styles.part}>
          <Text>Printer Type</Text>
          <Text>Select Printer</Text>
        </View>
      </InvoiceCard>

      <InvoiceCard title={"FILE/SHARE SETTINGS"}>
        <View style={styles.saveAsPdf}>
          <Text style={{marginBottom : 4}}>Save as PDF?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.shareBtn}>
              <Text>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text>Email</Text>
            </TouchableOpacity >
            <TouchableOpacity style={styles.shareBtn}>
              <Text>Other</Text>
            </TouchableOpacity>
          </View>
        </View>
      </InvoiceCard>
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
    part: ViewStyle;
    saveAsPdf: ViewStyle;
    buttonGroup: ViewStyle;
    shareBtn: ViewStyle
  }>({
    part: {
      // borderWidth: 2,
      width: "49%",
      marginBottom: 8,
    },
    saveAsPdf: {
      width : "100%",
    },
    buttonGroup : {
      flexDirection : "row",
      justifyContent : "center"
    },
    shareBtn : {
      backgroundColor : "white",
      height : 30,
      marginRight : 10,
      width : "30%",
      alignItems : "center",
      justifyContent : "center",
      borderRadius : 8,
      marginBottom : 6  
    }
  });
}
