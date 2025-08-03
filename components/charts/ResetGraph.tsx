import { useThemeContext } from "@/hooks/useThemeContext";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface ResetGraphButtonProps {
  onReset: () => void;
  size?: number;
}

export const ResetGraphButton: React.FC<ResetGraphButtonProps> = ({
  onReset,
  size = 22,
}) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity onPress={onReset} style={styles.button}>
      <Entypo name="ccw" size={size} color={theme.icon || "#fff"} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  button: ViewStyle;
}>({
  button: {
    padding: 6,
    marginHorizontal: 6,
    borderRadius: 50,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
