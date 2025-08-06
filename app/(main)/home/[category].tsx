import { useSQLite } from "@/context/SQLiteContext";
import { useCompanyContext } from "@/context/companyContext";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

// This is a placeholder for your actual data item type
type DetailItem = {
  id: string;
  name: string;
  NET_AMT: number;
  date: string;
};

export default function CategoryDetailsPage() {
  const { title, typ } = useLocalSearchParams<{ title: string; typ: string }>();

  const { controllers } = useSQLite();
  const { selectedCompanies } = useCompanyContext();
  const companyCodes = selectedCompanies.map((c) => c.CMP_CD);

  const {
    data: detailsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["homeDetails", companyCodes.sort(), typ],
    queryFn: () => {
      if (!controllers || !typ) {
        throw new Error("Query function called with invalid parameters.");
      }
      return controllers.Home.getDetailsByTyp(companyCodes, typ);
    },
    // Only run the query if the 'typ' parameter exists.
    enabled: !!typ,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error fetching details: {error.message}
        </Text>
      </View>
    );
  }

  console.log("detailsData", detailsData);
  return (
    <View style={styles.container}>
      <View>
        <Text>{title}</Text>
      </View>

      {/* You can now render the details for the category */}
      <FlatList
        data={detailsData as DetailItem[]} // Cast data to your specific type
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item?.name || "No Data"}</Text>
            <Text style={styles.itemAmount}>
              ₹{item?.NET_AMT?.toFixed(2) || "No Data"}
            </Text>
            <Text style={styles.itemDate}>{item?.date || "No Data"}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No data available for {title}.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemAmount: {
    fontSize: 14,
    color: "green",
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
});
