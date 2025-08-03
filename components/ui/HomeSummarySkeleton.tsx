import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

const HomeSummarySkeleton = () => {
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
    <Animated.View style={[styles.cardOuter, { opacity }]}>
      <View style={styles.cardTop}>
        <View style={styles.skeletonTextLarge} />
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.partition}>
          <View style={styles.skeletonTextSmall} />
          <View style={styles.skeletonTextMedium} />
        </View>

        <View style={styles.partition}>
          <View style={styles.skeletonTextSmall} />
          <View style={styles.skeletonTextMedium} />
        </View>

        <View style={styles.partition}>
          <View style={styles.skeletonTextSmall} />
          <View style={styles.skeletonTextMedium} />
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create<{
    cardOuter: ViewStyle;
    cardBottom: ViewStyle;
    cardTop: ViewStyle;
    partition: ViewStyle;
    skeletonTextLarge: ViewStyle;
    skeletonTextMedium: ViewStyle;
    skeletonTextSmall: ViewStyle;
  }>({
    cardOuter: {
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 24,
      backgroundColor: theme.tint,
    },
    cardTop: {
      padding: 16,
      height: 90,
    },
    cardBottom: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-around",
      height: 75,
    },
    partition: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "flex-start",
    },
    skeletonTextLarge: {
      width: "70%",
      height: 28,
      borderRadius: 4,
      backgroundColor: theme.tabIconDefault,
    },
    skeletonTextMedium: {
      width: "60%",
      height: 22,
      borderRadius: 4,
      backgroundColor: theme.tabIconDefault,
    },
    skeletonTextSmall: {
      width: "40%",
      height: 16,
      borderRadius: 4,
      backgroundColor: theme.tabIconDefault,
      marginBottom: 8,
    },
  });

export default HomeSummarySkeleton;
