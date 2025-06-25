import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CompanySelectionButtonsProps {
  companies: string[];
  onSelectionChange?: (selected: string[]) => void;
}

export const CompanySelectionButtons: React.FC<CompanySelectionButtonsProps> = ({
  companies,
  onSelectionChange,
}) => {
  const { theme } = useThemeContext();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const toggleSelection = (name: string) => {
    let updated: string[];
    if (selectedCompanies.includes(name)) {
      updated = selectedCompanies.filter((c) => c !== name);
    } else {
      updated = [...selectedCompanies, name];
    }
    setSelectedCompanies(updated);
    onSelectionChange?.(updated);
  };
  
  return (
    <View style={styles.container}>
      {companies.map((name) => {
        const isSelected = selectedCompanies.includes(name);
        return (
          <Pressable
            key={name}
            style={[
              styles.button,
              {
                borderColor: isSelected ? theme.tint : theme.subText,
                backgroundColor: isSelected ? theme.tint : theme.background,
              },
            ]}
            onPress={() => toggleSelection(name)}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isSelected ? theme.headText : theme.subText,
              }}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
    margin: 4,
    alignItems: "center",
  },
});
