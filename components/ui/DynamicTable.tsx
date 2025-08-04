import React, { useEffect, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import InvoiceCard from "@/components/ui/InvoiceCard";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useDebounce } from "@/utils/useDebounce";

export interface TableColumn {
  key: string;
  title: string;
}
export interface TableRow {
  [key: string]: any;
}
interface AugmentedTableRow extends TableRow {
  originalIndex: number;
}

export interface DynamicTableProps {
  columns: TableColumn[];
  data: TableRow[];
  showSelectionUtils?: boolean;
  showSearch?: boolean;
}

export const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  showSelectionUtils = false,
  showSearch = false,
}) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filteredData, setFilteredData] = useState<AugmentedTableRow[]>([]);

  useEffect(() => {
    const augmentedData = data.map((item, index) => ({
      ...item,
      originalIndex: index,
    }));

    if (!debouncedSearchQuery) {
      setFilteredData(augmentedData);
    } else {
      const lowercasedQuery = debouncedSearchQuery.toLowerCase();
      const results = augmentedData.filter((row) =>
        columns.some((col) =>
          String(row[col.key]).toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredData(results);
    }
  }, [data, columns, debouncedSearchQuery]);

  const toggleRow = (originalIndex: number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(originalIndex)) {
      newSet.delete(originalIndex);
    } else {
      newSet.add(originalIndex);
    }
    setSelectedRows(newSet);
  };

  const selectAll = () =>
    setSelectedRows(new Set(filteredData.map((item) => item.originalIndex)));

  const deselectAll = () => setSelectedRows(new Set());
  const inverseSelection = () => {
    const currentVisibleIndexes = new Set(
      filteredData.map((item) => item.originalIndex)
    );
    const newSet = new Set(selectedRows);
    currentVisibleIndexes.forEach((index) => {
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
    });
    setSelectedRows(newSet);
  };

  const onHeaderLayout = (key: string) => (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setColWidths((prev) => ({ ...prev, [key]: width }));
  };
  const getColumnWidth = (key: string) => colWidths[key] || 100;

  return (
    <InvoiceCard
      title={`List Preview : ${selectedRows.size} Selected`}
      showRecordsCount
      recordsCount={filteredData.length}
    >
      <View>
        {showSelectionUtils && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.btnStyle} onPress={selectAll}>
              <Text>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnStyle} onPress={deselectAll}>
              <Text>Deselect All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnStyle}
              onPress={inverseSelection}
            >
              <Text>Inverse</Text>
            </TouchableOpacity>
          </View>
        )}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search table..."
              placeholderTextColor={theme.subText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

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
                data={filteredData}
                keyExtractor={(item) => item.originalIndex.toString()}
                nestedScrollEnabled
                style={styles.tableContainer}
                renderItem={({ item, index }) => {
                  const isSelected = selectedRows.has(item.originalIndex);
                  return (
                    <Pressable
                      style={[styles.row, isSelected && styles.rowSelected]}
                      onPress={() => toggleRow(item.originalIndex)}
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
    searchContainer: {
      paddingHorizontal: 8,
      marginBottom: 12,
    },
    searchInput: {
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
      fontSize: 12,
      color: theme.headText,
      backgroundColor: theme.background,
      marginTop: 8,
    },
  });
}
