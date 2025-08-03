import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

export const CategoryCardSkeleton = () => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonTextSmall} />
        </View>
        <View style={styles.skeletonIcon} />
      </View>

      <View style={styles.valueRow}>
        <View style={styles.skeletonValue} />
      </View>

      <View style={[styles.valueRow, { marginBottom: 0 }]}>
        <View style={{ width: "100%" }}>
          <View style={styles.skeletonTextSmall} />
          <View style={styles.skeletonTextSmall} />
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create<{
    card: ViewStyle;
    headerRow: ViewStyle;
    left: ViewStyle;
    valueRow: ViewStyle;
    skeletonTitle: ViewStyle;
    skeletonValue: ViewStyle;
    skeletonTextSmall: ViewStyle;
    skeletonIcon: ViewStyle;
  }>({
    card: {
      borderRadius: 12,
      padding: 14,
      width: "48%",
      marginBottom: 15,
      backgroundColor: theme.tint,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      minHeight: 40,
    },
    left: {
      flex: 0.9,
    },
    valueRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 8,
    },
    skeletonTitle: {
      width: "80%",
      height: 20,
      borderRadius: 4,
      backgroundColor: theme.tabIconDefault,
      marginBottom: 8,
    },
    skeletonValue: {
      width: "50%",
      height: 18,
      borderRadius: 4,
      backgroundColor: theme.tabIconDefault,
    },
    skeletonTextSmall: {
      width: "60%",
      height: 14,
      borderRadius: 4,
      backgroundColor: theme.tabIconDefault,
      marginTop: 6,
    },
    skeletonIcon: {
      height: 34,
      width: 34,
      borderRadius: 17,
      backgroundColor: theme.background,
    },
  });
