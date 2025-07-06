import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface Company {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  userID: number;
}

interface CompanyDropdownWithChipsProps {
  allCompany: Company[];
  onSelectionChange?: (selected: Company[]) => void;
}

export const CompanyDropdownWithChips: React.FC<
  CompanyDropdownWithChipsProps
> = ({ allCompany, onSelectionChange }) => {
  const { theme } = useThemeContext();
  const [selected, setSelected] = useState<Company[]>([]);
  const [showDropdown, setShowDropdown] = useState(true);

  const toggleSelection = (company: Company) => {
    let updated: Company[];
    if (selected.find((c) => c.id === company.id)) {
      updated = selected.filter((c) => c.id !== company.id);
    } else {
      updated = [...selected, company];
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
            ? `${selected.length} Compan${
                selected.length > 1 ? "ies" : "y"
              } Selected`
            : "Select Company"}
        </Text>
      </Pressable>

      {selected.length > 0 && (
        <View style={styles.chipsContainer}>
          {selected.map((company) => (
            <View
              key={company.id}
              style={[styles.chip, { backgroundColor: theme.tint }]}
            >
              <Text style={{ color: theme.headText }}>{company.name}</Text>
              <Pressable
                style={styles.chipClose}
                onPress={() => toggleSelection(company)}
              >
                <Text style={{ color: theme.headText }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {showDropdown && (
        <FlatList
          data={allCompany}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => {
            const isSelected = selected.some((c) => c.id === item.id);
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
                  {item.name}
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
