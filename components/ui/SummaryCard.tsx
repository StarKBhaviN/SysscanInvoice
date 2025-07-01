import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface SummaryCardProps {
  theme: {
    background: string;
    headText: string;
    subText: string;
    tint: string;
  };
  title: string;
  icon?: React.ReactNode;
  value: string;
  unit: string;
  onPress?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  theme,
  title,
  icon,
  value,
  unit,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.tint }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: theme.headText }]}>{title}</Text>
        </View>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: theme.background,
            height: 34,
            width: 34,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: theme.headText }]}>{value}</Text>
        <Text style={[styles.unit, { color: theme.subText }]}>{unit}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  card: ViewStyle;
  headerRow: ViewStyle;
  left: ViewStyle;
  valueRow: ViewStyle;
  title: TextStyle;
  value: TextStyle;
  unit: TextStyle;
}>({
  card: {
    borderRadius: 12,
    padding: 14,
    // flex: 1,
    width: "48%",
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    minHeight: 40,
  },
  left: {
    flex: 0.9,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  value: {
    fontSize: 22,
    marginRight: 6,
  },
  unit: {
    fontSize: 18,
  },
});
