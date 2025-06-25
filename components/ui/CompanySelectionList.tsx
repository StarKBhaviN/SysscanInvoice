import { useThemeContext } from "@/hooks/useThemeContext";
import Checkbox from "expo-checkbox"; // Install: `npx expo install expo-checkbox`
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CompanySelectionListProps {
  companies: string[];
  onSelectionChange?: (selected: string[]) => void;
}

export const CompanySelectionList: React.FC<CompanySelectionListProps> = ({
  companies,
  onSelectionChange,
}) => {
  const { theme } = useThemeContext();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleSelection = (name: string) => {
    const updated = { ...selected, [name]: !selected[name] };
    setSelected(updated);
    onSelectionChange?.(Object.keys(updated).filter((k) => updated[k]));
  };
  
  return (
    <View>
      {companies.map((name) => (
        <View key={name} style={styles.item}>
          <Text style={[styles.label, { color: theme.headText }]}>
            {name}
          </Text>
          <Checkbox
            value={!!selected[name]}
            onValueChange={() => toggleSelection(name)}
            color={theme.tint}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
});
