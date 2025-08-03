import {
  AggregatedPurchase,
  AggregatedSales,
  PurchaseSummaryRecord,
  SalesSummaryRecord,
} from "@/types/home.types";

export const calculateTotalSales = (
  salesData: SalesSummaryRecord[]
): AggregatedSales => {
  const initialState: AggregatedSales = {
    totalSales: 0,
    totalGSL: 0,
    totalJWI: 0,
    grandTotal: 0,
  };

  return salesData.reduce((accumulator, item) => {
    const netAmount = item["Sum(NET_AMT)"];

    switch (item.TYP) {
      case "SAL":
        accumulator.totalSales += netAmount;
        break;
      case "GSL":
        accumulator.totalGSL += netAmount;
        break;
      case "JWI":
        accumulator.totalJWI += netAmount;
        break;
      // Add other cases for different types if needed
    }

    accumulator.grandTotal += netAmount;

    return accumulator;
  }, initialState);
};

export const calculateTotalPurchase = (
  purchaseData: PurchaseSummaryRecord[]
): AggregatedPurchase => {
  const initialState: AggregatedPurchase = {
    totalPurchase: 0,
    totalJWP: 0,
    grandTotal: 0,
  };

  return purchaseData.reduce((accumulator, item) => {
    const netAmount = item["Sum(NET_AMT)"];

    switch (item.TYP) {
      case "PUR":
        accumulator.totalPurchase += netAmount;
        break;
      case "JWP":
        accumulator.totalJWP += netAmount;
        break;
      // Add other cases for different types if needed
    }

    accumulator.grandTotal += netAmount;

    return accumulator;
  }, initialState);
};
