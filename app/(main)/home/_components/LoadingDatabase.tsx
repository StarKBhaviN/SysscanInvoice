import { openDatabase } from "@/db";
import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingDatabase() {
  const [progress, setProgress] = useState(0);
  const { theme } = useThemeContext();

  useEffect(() => {
    (async () => {
      await openDatabase((p) => setProgress(p));
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10, color: theme.headText }}>
        Downloading and copying database...
      </Text>
      <Text style={{ marginTop: 6, color: theme.headText }}>{progress}%</Text>
    </View>
  );
}
