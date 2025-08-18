import ChooseDateRange from "@/components/ui/ChooseDateRange";
import { DynamicTable } from "@/components/ui/DynamicTable";
import InvoiceCard from "@/components/ui/InvoiceCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Button } from "@react-navigation/elements";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SettingsModal } from "../../../components/SettingsModal";
import { generateInvoiceHtml } from "../../../utils/pdfGenerator";
import { defaultSettings, PrintSettings } from "../../../utils/print.utils";

export default function PrintInvoice() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [settings, setSettings] = useState<PrintSettings>(defaultSettings);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const createPdf = async () => {
    try {
      const htmlContent = generateInvoiceHtml(columns, dummyData);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const fileName = `Invoice_${new Date().toISOString().split("T")[0]}.pdf`;
      const newPath = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({ from: uri, to: newPath });
      return newPath;
    } catch (err) {
      console.error("PDF creation failed:", err);
      Alert.alert("Error", "Could not create the PDF file.");
      return null;
    }
  };

  const handleDownload = async () => {
    const uri = await createPdf();
    if (uri) {
      Alert.alert("Success!", "PDF generated successfully.");

      if (Platform.OS === "android") {
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: uri,
          flags: 1,
          type: "application/pdf",
        });
      }
    }
  };

  const handleShare = async () => {
    const uri = await createPdf();
    if (uri) {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Sharing not available on this device");
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Invoice PDF",
      });
    }
  };

  return (
    <>
      <SettingsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        settings={settings}
        onSave={setSettings}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Print & Share</Text>
          <Button
            style={{ backgroundColor: "transparent" }}
            onPress={() => setIsModalVisible(true)}
          >
            ⚙️
          </Button>
        </View>
        <InvoiceCard title={"INVOICE INFORMATION"}>
          <View style={styles.part}>
            <Text style={styles.text}>Print What?</Text>
            <Text style={styles.text}>{settings.printWhat}</Text>
          </View>
          <View style={styles.part}>
            <Text style={styles.text}>Invoice As</Text>
            <Text style={styles.text}>{settings.invoiceAs}</Text>
          </View>

          <ChooseDateRange />
          <View style={styles.part}>
            <View style={styles.row}>
              <Text style={styles.label}>From</Text>
              <Text style={{ fontWeight: 700, color: theme.icon }}>:</Text>
              <Text style={styles.value}>25-05-25</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>To</Text>
              <Text style={{ fontWeight: 700, color: theme.icon }}>:</Text>
              <Text style={styles.value}>25-06-25</Text>
            </View>
          </View>
        </InvoiceCard>

        <InvoiceCard title={"PARTY/CLIENT INFORMATION"}>
          <View style={styles.part}>
            <Text style={styles.text}>Invoice As</Text>
            <Text style={styles.text}>{settings.partyName}</Text>
          </View>
          <View style={styles.part}>
            <Text style={styles.text}>Party Name</Text>
            <Text style={styles.text}>{settings.partyName}</Text>
          </View>
        </InvoiceCard>

        {/* Print Format, Number of Copies, Print Paper, Print Destination */}
        <InvoiceCard title={"PRINT OPTIONS"}>
          <View style={styles.part}>
            <Text style={styles.text}>Page Format</Text>
            <Text style={styles.text}>{settings.pageFormat}</Text>
          </View>
          <View style={styles.part}>
            <Text style={styles.text}>Number of Copies</Text>
            <Text style={styles.text}>{settings.copies}</Text>
          </View>
          <View style={styles.part}>
            <Text style={styles.text}>Print Paper</Text>
            <Text style={styles.text}>{settings.printPaper}</Text>
          </View>
          <View style={styles.part}>
            <Text style={styles.text}>Print Destination</Text>
            <Text style={styles.text}>{settings.printDestination}</Text>
          </View>
        </InvoiceCard>

        <DynamicTable columns={columns} data={dummyData} />

        <InvoiceCard title={"FILE/SHARE SETTINGS"}>
          <View style={styles.saveAsPdf}>
            <Text style={{ marginBottom: 4, color: theme.headText }}>
              Save as PDF?
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => handleShare()}
              >
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={handleDownload}
              >
                <Text style={styles.shareBtnText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </InvoiceCard>
      </ScrollView>
    </>
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
    headerContainer: ViewStyle;
    saveAsPdf: ViewStyle;
    buttonGroup: ViewStyle;
    shareBtn: ViewStyle;
    row: ViewStyle;
    label: TextStyle;
    value: TextStyle;
    text: TextStyle;
    headerText: TextStyle;
    shareBtnText: TextStyle;
  }>({
    part: {
      width: "49%",
      marginBottom: 8,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
      textAlign: "center",
    },
    text: {
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
    saveAsPdf: {
      width: "100%",
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    shareBtn: {
      backgroundColor: theme.background || "#007aff",
      height: 30,
      marginRight: 10,
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      marginBottom: 6,
    },
    shareBtnText: {
      color: theme.headText,
      fontWeight: "600",
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
