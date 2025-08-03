import { useThemeContext } from "@/hooks/useThemeContext";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export default function ChooseDateRange() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isPicking, setIsPicking] = useState(false);
  const [target, setTarget] = useState<"start" | "end" | null>(null);
  const [tempDate, setTempDate] = useState(new Date());

  const ranges = ["Last Month", "Last 3 Month", "Last 6 Month", "Last Year"];

  const applyRange = (range: string) => {
    setSelectedRange(range);
  };

  const openDatePicker = (targetField: "start" | "end") => {
    setTarget(targetField);
    const parsedDate =
      targetField === "start" && startDate
        ? parseDate(startDate)
        : targetField === "end" && endDate
        ? parseDate(endDate)
        : new Date();
    setTempDate(parsedDate);
    setIsPicking(true);
  };

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(2000 + year, month - 1, day);
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setIsPicking(false);
    if (selected && target) {
      const formattedDate = selected.toLocaleDateString("en-GB");
      if (target === "start") {
        setStartDate(formattedDate);
      } else {
        setEndDate(formattedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Date" onPress={() => setModalVisible(true)} />
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Choose Date Range</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ranges.map((range) => (
                <Pressable
                  key={range}
                  style={[
                    styles.chip,
                    selectedRange === range && styles.chipSelected,
                  ]}
                  onPress={() => applyRange(range)}
                >
                  <Text
                    style={
                      selectedRange === range
                        ? styles.chipTextSelected
                        : styles.chipText
                    }
                  >
                    {range}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Start Date (DD/MM/YY)"
                value={startDate}
                onChangeText={setStartDate}
                onFocus={() => openDatePicker("start")}
              />
              <TextInput
                style={styles.input}
                placeholder="End Date (DD/MM/YY)"
                value={endDate}
                onChangeText={setEndDate}
                onFocus={() => openDatePicker("end")}
              />
            </View>

            {isPicking && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="calendar"
                onChange={onDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(2016, 0, 1)}
              />
            )}

            <Button title="Done" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme: any, colorScheme: string) {
  return StyleSheet.create<{
    container: ViewStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    header: TextStyle;
    chip: ViewStyle;
    chipSelected: ViewStyle;
    chipText: TextStyle;
    chipTextSelected: TextStyle;
    inputRow: ViewStyle;
    input: TextStyle;
  }>({
    container: {
      // padding: 20,
      // backgroundColor: theme.background,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.tint,
      padding: 20,
      borderRadius: 8,
      width: "90%",
      alignItems: "center",
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
      marginBottom: 12,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.icon,
    },
    chipSelected: {
      backgroundColor: theme.subText,
    },
    chipText: {
      color: theme.subText,
    },
    chipTextSelected: {
      color: theme.background,
    },
    inputRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 12,
      width: "100%",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.subText,
      borderRadius: 4,
      padding: 8,
      flex: 1,
      marginHorizontal: 4,
      textAlign: "center",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
    },
  });
}
