import { useThemeContext } from "@/hooks/useThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export default function Home() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#003953", theme.tint]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardTop}
      >
        <Text style={styles.headText}>June Invoices Report</Text>
      </LinearGradient>

      <View style={styles.cardBottom}>
        <View style={styles.partition}>
          <Text style={{color : theme.subText}}>Paid</Text>
          <Text style={{fontSize : 22, color : theme.headText}}>1,500</Text>
        </View>
        <View style={styles.partition}>
          <Text style={{color : theme.subText}}>Unpaid</Text>
          <Text style={{fontSize : 22, color : theme.headText}}>123</Text>
        </View>
        <View style={[styles.partition, {borderEndWidth : 0, marginRight : 0, marginLeft : 0}]}>
          <Text style={{color : theme.subText}}>Overdue</Text>
          <Text style={{fontSize : 22, color : theme.headText}}>320</Text>
        </View>
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
  return StyleSheet.create<{
    container: ViewStyle;
    cardBottom: ViewStyle;
    cardTop: ViewStyle;
    headText: TextStyle;
    partition : ViewStyle
  }>({
    container: {
      borderRadius: 12,
      overflow: "hidden",
    },
    cardTop: {
      padding: 16,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    headText: {
      fontSize: 24,
      width: "70%",
      color: "#fff",
      fontWeight: "600",
    },
    cardBottom: {
      backgroundColor: theme.tint,
      padding: 16,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      flexDirection : "row",
    },
    partition : {
      borderEndWidth : 1,
      flex : 1,
      marginRight : 22,
      borderColor : theme.subText
    }
  });
}
