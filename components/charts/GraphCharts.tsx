import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  BarChart,
  LineChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import GraphSettings from "./GraphSettings";

interface GraphChartProps {
  title: string;
  data: any;
  type: "line" | "bar" | "pie" | "progress";
}

export const GraphCharts: React.FC<GraphChartProps> = ({
  title,
  data,
  type,
}) => {
  const { theme } = useThemeContext();
  const { width: screenWidth } = useWindowDimensions();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Get total labels
  const labelCount = data?.labels?.length ?? 1;

  // Dynamic chart width:
  const calculatedWidth = Math.max(screenWidth, labelCount * 60);

  const chartCommonProps = {
    data,
    height: 300,
    chartConfig: {
      backgroundColor: theme.background,
      backgroundGradientFrom: theme.background,
      backgroundGradientTo: theme.background,
      decimalPlaces: 0,
      color: (opacity = 1) => theme.headText || `rgba(255,255,255,${opacity})`,
      labelColor: (opacity = 1) =>
        theme.subText || `rgba(255,255,255,${opacity})`,
      propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: theme.tint,
      },
    },
    style: {
      borderRadius: 16,
    },
  };

  const chart = (
    <>
      {type === "line" && (
        <LineChart
          {...chartCommonProps}
          bezier
          fromZero={true}
          width={calculatedWidth}
        />
      )}
      {type === "bar" && (
        <BarChart
          yAxisLabel=""
          yAxisSuffix=" rs"
          {...chartCommonProps}
          fromZero={true}
          verticalLabelRotation={0}
          width={calculatedWidth}
        />
      )}
      {type === "pie" && (
        <PieChart
          data={data}
          width={Math.min(screenWidth * 0.9, screenWidth - 40)}
          height={200}
          chartConfig={chartCommonProps.chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft={"5"}
          center={[0, 0]}
          absolute
          hasLegend
        />
      )}
      {type === "progress" && (
        <ProgressChart
          data={data}
          width={screenWidth - 40}
          height={220}
          strokeWidth={16}
          chartConfig={chartCommonProps.chartConfig}
          hideLegend={false}
        />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom : 12
        }}
      >
        <Text style={[styles.header, { color: theme.headText }]}>{title}</Text>
        <GraphSettings
          setIsModalVisible={setIsSettingsVisible}
          isModalVisible={isSettingsVisible}
        />
      </View>
      {(type === "line" || type === "bar") && calculatedWidth > screenWidth ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {chart}
        </ScrollView>
      ) : (
        chart
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingBottom: 0,
    // flex: 1,
    // borderWidth : 2
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
  },
});
