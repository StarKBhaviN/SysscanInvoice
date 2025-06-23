import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          source={require("@/assets/images/header/headerSysscanLogo.png")}
        />
      </View>
      <View style={styles.headingContent}>
        <Text style={{ marginBottom: 2, color: theme.headText, fontSize: 16 }}>
          SYSSCAN SOFTWARE
        </Text>
        <Text style={{ marginBottom: 0, color: theme.headText }}>
          Company Name
        </Text>
        <Text style={{ marginBottom: 0, color: theme.headText, fontSize: 10 }}>
          2500 rs
        </Text>
      </View>
    </View>
  );
}

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
    container: {
      backgroundColor: theme.tint,
      height: 80,
      padding: 10,
      flexDirection: "row",
    },
    logoBox: {
      // borderWidth: 2,
      width: 110,
      height: "100%",
      marginRight: 12,
    },
    headingContent: {
      // borderWidth: 2,
      flexGrow: 1,
    },
  });
}
