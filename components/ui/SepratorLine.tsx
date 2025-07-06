import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import { View } from "react-native";

export default function SepratorLine() {
  const { theme } = useThemeContext();
  return (
    <View
      style={{
        borderTopWidth: 1.5,
        borderColor: theme.subText,
        marginBottom: 12,
      }}
    ></View>
  );
}
