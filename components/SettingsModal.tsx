import { useThemeContext } from "@/hooks/useThemeContext";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  invoiceAsOptions,
  pageFormatOptions,
  partyNameOptions,
  printDestinationOptions,
  printPaperOptions,
  PrintSettings,
  printWhatOptions,
} from "../utils/print.utils";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onSave: (newSettings: PrintSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  settings,
  onSave,
}) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const [currentSettings, setCurrentSettings] =
    useState<PrintSettings>(settings);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  const updateSetting = (key: keyof PrintSettings, value: string) => {
    setCurrentSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Print Settings</Text>
          <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            <SettingPicker
              label="Print What?"
              selectedValue={currentSettings.printWhat}
              onValueChange={(v) => updateSetting("printWhat", v)}
              options={printWhatOptions}
            />
            <SettingPicker
              label="Invoice As"
              selectedValue={currentSettings.invoiceAs}
              onValueChange={(v) => updateSetting("invoiceAs", v)}
              options={invoiceAsOptions}
            />
            <SettingPicker
              label="Party Name"
              selectedValue={currentSettings.partyName}
              onValueChange={(v) => updateSetting("partyName", v)}
              options={partyNameOptions}
            />
            <SettingPicker
              label="Page Format"
              selectedValue={currentSettings.pageFormat}
              onValueChange={(v) => updateSetting("pageFormat", v)}
              options={pageFormatOptions}
            />
            <Text style={styles.label}>Number of Copies</Text>
            <TextInput
              style={styles.input}
              value={currentSettings.copies}
              onChangeText={(text) => updateSetting("copies", text)}
              keyboardType="number-pad"
            />
            <SettingPicker
              label="Print Paper"
              selectedValue={currentSettings.printPaper}
              onValueChange={(v) => updateSetting("printPaper", v)}
              options={printPaperOptions}
            />
            <SettingPicker
              label="Print Destination"
              selectedValue={currentSettings.printDestination}
              onValueChange={(v) => updateSetting("printDestination", v)}
              options={printDestinationOptions}
            />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="#ff3b30" />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SettingPicker = ({
  label,
  selectedValue,
  onValueChange,
  options,
}: any) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={{
            color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
          }}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          {options.map((opt: string) => (
            <Picker.Item label={opt} value={opt} key={opt} />
          ))}
        </Picker>
      </View>
    </>
  );
};

function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: any;
    tint?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create<{
    centeredView: ViewStyle;
    modalView: ViewStyle;
    modalTitle: TextStyle;
    label: TextStyle;
    input: TextStyle;
    pickerContainer: ViewStyle;
    buttonContainer: ViewStyle;
  }>({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      elevation: 5,
      width: "90%",
      maxHeight: "85%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 10,
      alignSelf: "flex-start",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
    input: {
      height: 50,
      borderColor: "lightgray",
      borderWidth: 0.5,
      borderRadius: 8,
      width: "100%",
      paddingHorizontal: 10,
      marginTop: 5,
      justifyContent: "center",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
    pickerContainer: {
      height: 50,
      width: "100%",
      borderColor: "lightgray",
      borderWidth: 0.5,
      borderRadius: 8,
      justifyContent: "center",
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 20,
    },
  });
}
