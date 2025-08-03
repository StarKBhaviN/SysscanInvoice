import { CategoryCard } from "@/components/ui/CategoryCard";
import { CategoryCardSkeleton } from "@/components/ui/CategoryCardSkeleton";
import HomeSummarySkeleton from "@/components/ui/HomeSummarySkeleton";
import { displayConfig } from "@/context/displayConfig";
import { useHomeDataQuery } from "@/hooks/useHomeDataQuery";
import { useThemeContext } from "@/hooks/useThemeContext";
import { AllInOneRecord } from "@/types/home.types";
import { RelativePathString, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import HomeSummary from "./_components/HomeSummary";

export default function Home() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  const {
    data: homeData,
    isLoading: isFetching,
    error: fetchError,
    // refetch, // For manual refresh if needed
  } = useHomeDataQuery();

  const categoriesToDisplay = useMemo(() => {
    if (!homeData?.allInOneHome) return [];

    const dataMap = new Map<string, AllInOneRecord>(
      homeData.allInOneHome.map((item) => [item.TYP, item])
    );

    const defaultRecord: Omit<AllInOneRecord, "TYP"> = {
      "COUNT(BILL_NO_SNC_N)": 0,
      "Sum(NET_AMT)": 0,
      "Sum(QTY1)": 0,
      "Sum(QTY3)": 0,
    };

    return displayConfig.map((config) => {
      let record: AllInOneRecord;

      if (config.type === "Receivables") {
        record = { ...defaultRecord, TYP: config.name, "Sum(NET_AMT)": 1500 };
      } else if (config.type === "Payables") {
        record = { ...defaultRecord, TYP: config.name, "Sum(NET_AMT)": 500 };
      } else {
        record = dataMap.get(config.type) || {
          ...defaultRecord,
          TYP: config.type,
        };
      }

      return {
        ...config,
        data: record,
      };
    });
  }, [homeData]);

  if (isFetching) {
    return (
      <View style={styles.homePage}>
        <HomeSummarySkeleton />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </View>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "red" }}>
          Error fetching data:{" "}
          {fetchError instanceof Error ? fetchError.message : fetchError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.homePage}>
      <HomeSummary />

      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {categoriesToDisplay.map((cat) => {
            const { IconComponent, iconName, data } = cat;
            const path = `/(main)/home/${cat.name}` as RelativePathString;
            return (
              <CategoryCard
                key={cat.name}
                theme={theme}
                title={cat.name}
                unit="rs"
                data={data}
                icon={
                  <IconComponent name={iconName} size={24} color={theme.icon} />
                }
                onPress={() => router.push(path)}
              />
            );
          })}
        </View>
      </ScrollView>
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
    homePage: ViewStyle;
    loadingContainer: ViewStyle;
    errorContainer: ViewStyle;
  }>({
    homePage: {
      flex: 1,
      paddingVertical: 8,
    },
    loadingContainer: {
      borderWidth: 1,
      flex: 1,
    },
    errorContainer: {
      borderWidth: 1,
    },
  });
}
