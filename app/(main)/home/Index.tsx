import { CategoryCard } from "@/components/ui/CategoryCard";
import { useHomeDataQuery } from "@/hooks/useHomeDataQuery";
import { useThemeContext } from "@/hooks/useThemeContext";
import { AllInOneRecord } from "@/types/home.types";
import { Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import HomeSummary from "./_components/HomeSummary";

type IconName =
  | React.ComponentProps<typeof Entypo>["name"]
  | React.ComponentProps<typeof Feather>["name"];

type DisplayConfigItem = {
  type: string;
  name: string;
  IconComponent: typeof Entypo | typeof Feather;
  iconName: IconName; // This ensures only valid icon names are used.
};

const displayConfig: DisplayConfigItem[] = [
  // Row 1
  { type: "SAL", name: "Sales", IconComponent: Entypo, iconName: "bar-graph" },
  { type: "PUR", name: "Purchase", IconComponent: Entypo, iconName: "layers" },
  // Row 2
  {
    type: "Receivables",
    name: "Receivables",
    IconComponent: Feather,
    iconName: "arrow-down-left",
  },
  {
    type: "Payables",
    name: "Payables",
    IconComponent: Feather,
    iconName: "arrow-up-right",
  },
  // Row 3
  {
    type: "JWI",
    name: "Job Work Income",
    IconComponent: Entypo,
    iconName: "briefcase",
  },
  {
    type: "JWP",
    name: "Job Work Payment",
    IconComponent: Entypo,
    iconName: "tools",
  },
  // Row 4
  // { type: "EXD", name: "Exports", IconComponent: Entypo, iconName: "globe" },
  { type: "GSL", name: "General Sale", IconComponent: Entypo, iconName: "tag" },
  {
    type: "GEN",
    name: "General Purchase",
    IconComponent: Entypo,
    iconName: "archive",
  },
  // Row 5
  {
    type: "SRT",
    name: "Sales Return",
    IconComponent: Feather,
    iconName: "corner-up-left",
  },
  {
    type: "PDN",
    name: "Purchase Return",
    IconComponent: Feather,
    iconName: "corner-up-right",
  },
  // Row 6
  {
    type: "CRN",
    name: "Credit Note",
    IconComponent: Entypo,
    iconName: "file-minus",
  },
  {
    type: "DBN",
    name: "Debit Note",
    IconComponent: Entypo,
    iconName: "file-plus",
  },
  // Other categories
  {
    type: "CGR",
    name: "Credit Note (Gen)",
    IconComponent: Entypo,
    iconName: "file-minus",
  },
  {
    type: "DGR",
    name: "Debit Note (Gen)",
    IconComponent: Entypo,
    iconName: "file-plus",
  },
];

export default function Home() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  const {
    data: homeData,
    // calculatedSalesValue,
    // calculatedPurchaseValue,
    isLoading: isFetching,
    error: fetchError,
    refetch, // For manual refresh if needed
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

  console.log("This ", categoriesToDisplay);
  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.icon} />
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
                onPress={() => router.push(`/(main)/home/${cat.name}`)}
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
    },
    errorContainer: {
      borderWidth: 1,
    },
  });
}
