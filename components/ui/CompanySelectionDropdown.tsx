import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export interface Company {
  CMP_CD: string;
  CMP_NM: string;
}

interface CompanyDropdownWithChipsProps {
  allCompany: Company[];
  selectedCompanies: Company[];
  onSelectionChange?: (selected: Company[]) => void;
}

export const CompanyDropdownWithChips: React.FC<
  CompanyDropdownWithChipsProps
> = ({ allCompany, selectedCompanies, onSelectionChange }) => {
  const { theme } = useThemeContext();
  const [showDropdown, setShowDropdown] = useState(true);

  const toggleSelection = (company: Company) => {
    let updated: Company[];
    if (selectedCompanies.find((c) => c.CMP_CD === company.CMP_CD)) {
      updated = selectedCompanies.filter((c) => c.CMP_CD !== company.CMP_CD);
    } else {
      updated = [...selectedCompanies, company];
    }
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
          {selectedCompanies.length >= 0
            ? `${selectedCompanies.length} Compan${
                selectedCompanies.length > 1 ? "ies" : "y"
              } Selected`
            : "Select Company"}
        </Text>
      </Pressable>

      {selectedCompanies.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedCompanies.map((company) => (
            <View
              key={company.CMP_CD}
              style={[styles.chip, { backgroundColor: theme.tint }]}
            >
              <Text style={{ color: theme.headText }}>{company.CMP_NM}</Text>
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
          keyExtractor={(item) => item.CMP_CD.toString()}
          style={styles.list}
          renderItem={({ item }) => {
            const isSelected = selectedCompanies.some(
              (c) => c.CMP_CD === item.CMP_CD
            );
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
                  {item.CMP_NM}
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
