import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PlanCardProps {
  title: string;
  description: string;
  value: string;
  amount: string;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  value,
  amount,
  selectedPlan,
  setSelectedPlan,
}) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const isSelected = selectedPlan === value;

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => setSelectedPlan(value)}
    >
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
      <Text style={styles.cardAmount}>₹{amount}</Text>
    </TouchableOpacity>
  );
};

function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: any;
    tint?: string;
    icon?: string;
    tabIconDefault?: string;
    tabIconSelected?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: theme.icon,
      borderRadius: 12,
      padding: 20,
      marginVertical: 8,
      backgroundColor: theme.tint,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardSelected: {
      borderColor: theme.icon,
      backgroundColor: theme.background,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
      color: theme.headText,
    },
    cardDesc: { fontSize: 14, color: "#555" },
    cardAmount: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.headText,
    },
  });
}

export default PlanCard;
