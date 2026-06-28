import { CategoryCard } from "@/components/ui/CategoryCard";
import { CategoryCardSkeleton } from "@/components/ui/CategoryCardSkeleton";
import HomeSummarySkeleton from "@/components/ui/HomeSummarySkeleton";
import { useCompanyContext } from "@/context/companyContext";
import { displayConfig } from "@/context/displayConfig";
import { useSQLite } from "@/context/SQLiteContext";
import {
  useHomeDataQuery,
  usePayablesTotals,
  useReceivablesTotals,
} from "@/hooks/useHomeDataQuery";
import { useThemeContext } from "@/hooks/useThemeContext";
import { AllInOneRecord } from "@/types/home.types";
import { useQueryClient } from "@tanstack/react-query";
import { RelativePathString, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import HomeSummary from "./_components/HomeSummary";
import LoadingDatabase from "./_components/LoadingDatabase";

export default function Home() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { controllers, isLoading: isDatabaseLoading } = useSQLite();
  const { selectedCompanies } = useCompanyContext();
  const companyCodes = selectedCompanies.map((c) => c.CMP_CD);

  const { data: recivables = [] } = useReceivablesTotals(
    "2023-06-17",
    "2025-06-17"
  );
  const { data: payables = [] } = usePayablesTotals("2023-06-17", "2025-06-17");
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
        // take sum of all receivables
        const total = (recivables ?? []).reduce(
          (acc, row) => acc + (row.TotalAmount || 0),
          0
        );
        record = { ...defaultRecord, TYP: config.name, "Sum(NET_AMT)": total };
      } else if (config.type === "Payables") {
        const total = (payables ?? []).reduce(
          (acc, row) => acc + (row.TotalAmount || 0),
          0
        );
        record = { ...defaultRecord, TYP: config.name, "Sum(NET_AMT)": total };
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
  }, [homeData, recivables, payables]);

  const prefetchAndNavigate = async (typ: string, name: string) => {
    if (!controllers) return;

    // This puts the data into the cache with a specific key
    await queryClient.prefetchQuery({
      queryKey: ["homeDetails", companyCodes.sort(), typ],
      queryFn: () => controllers.Home.getDetailsByTyp(companyCodes, typ),
    });

    console.log("Prefetched home details for:", typ, companyCodes);
    const nameForPath = name.replace(/\s*\(Gen\)\s*/g, "");
    const pathSegment = nameForPath.replace(/\s+/g, "");

    router.push({
      pathname: `/home/${pathSegment}` as RelativePathString,
      params: { title: name, typ: typ },
    });
  };

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

      {isDatabaseLoading ? (
        <LoadingDatabase />
      ) : (
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
              return (
                <CategoryCard
                  key={cat.name}
                  theme={theme}
                  title={cat.name}
                  unit="rs"
                  data={data}
                  icon={
                    <IconComponent
                      // @ts-ignore
                      name={iconName}
                      size={24}
                      color={theme.icon}
                    />
                  }
                  onPress={() => prefetchAndNavigate(cat.type, cat.name)}
                />
              );
            })}
          </View>
        </ScrollView>
      )}
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
