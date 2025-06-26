import React, { useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import InvoiceCard from "@/components/ui/InvoiceCard";
import { useThemeContext } from "@/hooks/useThemeContext";

export interface TableColumn {
  key: string;
  title: string;
}
export interface TableRow {
  [key: string]: any;
}
export interface DynamicTableProps {
  columns: TableColumn[];
  data: TableRow[];
}

export const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
}) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedRows(newSet);
  };
  const selectAll = () => setSelectedRows(new Set(data.map((_, i) => i)));
  const deselectAll = () => setSelectedRows(new Set());
  const inverseSelection = () => {
    const newSet = new Set<number>(
      data.map((_, i) => (selectedRows.has(i) ? -1 : i)).filter((i) => i !== -1)
    );
    setSelectedRows(newSet);
  };
  const onHeaderLayout = (key: string) => (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setColWidths((prev) => ({ ...prev, [key]: width }));
  };
  const getColumnWidth = (key: string) => colWidths[key] || 100;

  return (
    <InvoiceCard title={`List Preview : ${selectedRows.size} Selected`}>
      <View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.btnStyle} onPress={selectAll}>
            <Text>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStyle} onPress={deselectAll}>
            <Text>Deselect All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStyle} onPress={inverseSelection}>
            <Text>Inverse</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal nestedScrollEnabled>
          <View>
            <View style={styles.headerRow}>
              {columns.map((col) => (
                <Text
                  key={col.key}
                  style={styles.headerCell}
                  onLayout={onHeaderLayout(col.key)}
                >
                  {col.title}
                </Text>
              ))}
            </View>

            <ScrollView horizontal>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                nestedScrollEnabled
                style={styles.tableContainer}
                renderItem={({ item, index }) => {
                  const isSelected = selectedRows.has(index);
                  return (
                    <Pressable
                      style={[styles.row, isSelected && styles.rowSelected]}
                      onPress={() => toggleRow(index)}
                    >
                      {columns.map((col) => (
                        <Text
                          key={col.key}
                          style={[
                            styles.cell,
                            { width: getColumnWidth(col.key) },
                          ]}
                        >
                          {item[col.key]}
                        </Text>
                      ))}
                    </Pressable>
                  );
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </InvoiceCard>
  );
};

function createStyles(theme: any, colorScheme: string) {
  return StyleSheet.create({
    tableContainer: {
      maxHeight: 220,
    },
    headerRow: {
      flexDirection: "row",
      padding: 8,
      backgroundColor: theme.tint,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    row: {
      flexDirection: "row",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    rowSelected: {
      backgroundColor: theme.subText + "18",
    },
    headerCell: {
      fontWeight: "bold",
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
      paddingRight: 24,
    },
    cell: {
      color: theme.headText || (colorScheme === "dark" ? "#fff" : "#000"),
      paddingRight: 4,
    },
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 8,
    },
    btnStyle: {
      borderWidth: 1,
      padding: 8,
      borderRadius: 12,
    },
  });
}
