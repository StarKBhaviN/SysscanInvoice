import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface CompanyDropdownWithChipsProps {
  companies: string[];
  onSelectionChange?: (selected: string[]) => void;
}

export const CompanyDropdownWithChips: React.FC<CompanyDropdownWithChipsProps> = ({
  companies,
  onSelectionChange,
}) => {
  const { theme } = useThemeContext();
  const [selected, setSelected] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(true);

  const toggleSelection = (name: string) => {
    let updated: string[];
    if (selected.includes(name)) {
      updated = selected.filter((c) => c !== name);
    } else {
      updated = [...selected, name];
    }
    setSelected(updated);
    onSelectionChange?.(updated);
  };
  
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.dropdownButton,
          { borderColor: theme.subText, backgroundColor: theme.background },
        ]}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={{ color: theme.headText }}>
          {selected.length >= 0
            ? `${selected.length} Compan${selected.length > 1 ? "ies" : "y"} Selected`
            : "Select Company"}
        </Text>
      </Pressable>

      {selected.length > 0 && (
        <View style={styles.chipsContainer}>
          {selected.map((name) => (
            <View
              key={name}
              style={[
                styles.chip,
                { backgroundColor: theme.tint },
              ]}
            >
              <Text style={{ color: theme.headText }}>{name}</Text>
              <Pressable
                style={styles.chipClose}
                onPress={() => toggleSelection(name)}
              >
                <Text style={{ color: theme.headText }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {showDropdown && (
        <FlatList
          data={companies}
          keyExtractor={(item) => item}
          style={styles.list}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item);
            return (
              <Pressable
                style={[
                  styles.listItem,
                  {
                    backgroundColor: isSelected ? theme.tint : theme.background,
                  },
                ]}
                onPress={() => toggleSelection(item)}
              >
                <Text
                  style={{
                    color: isSelected ? theme.headText : theme.subText,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    position: "relative",
    width: "100%",
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  chipClose: {
    marginLeft: 8,
  },
  list: {
    marginTop: 8,
    maxHeight: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  listItem: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
