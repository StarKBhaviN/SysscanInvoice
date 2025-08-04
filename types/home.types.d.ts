// types.ts

// Define the shape of a single sales summary record from the database
export type SalesSummaryRecord = {
  "COUNT(BILL_NO_SNC_N)": number;
  "Sum(NET_AMT)": number;
  "Sum(QTY1)": number;
  "Sum(QTY3)": number;
  TYP: string;
};
export type PurchaseSummaryRecord = {
  "COUNT(BILL_NO_SNC_N)": number;
  "Sum(NET_AMT)": number;
  "Sum(QTY1)": number;
  "Sum(QTY3)": number;
  TYP: string;
};

export type AggregatedSales = {
  totalSales: number;
  totalGSL: number;
  totalJWI: number;
  grandTotal: number;
};

export type AggregatedPurchase = {
  totalPurchase: number;
  totalJWP: number;
  grandTotal: number;
};

export type AggregatedReceivables = {
  totalReceivables: number;
  // totalJWP: number;
  grandTotal: number;
};

export type AggregatedPayables = {
  totalPayables: number;
  // totalJWP: number;
  grandTotal: number;
};

// Define the shape of the data for your `CategoryCard`
export type CategoryData = {
  value: number;
  unit: string;
};

// Define the shape of all the data fetched for the home screen
export type HomeData = {
  // totalSales: SalesSummaryRecord[];
  // totalPurchase: PurchaseSummaryRecord[];
  allInOneHome: AllInOneRecord[];
};

export type AllInOneRecord = {
  "COUNT(BILL_NO_SNC_N)": number;
  "Sum(NET_AMT)": number;
  "Sum(QTY1)": number;
  "Sum(QTY3)": number;
  TYP: string;
};

export type HomeDetailRecord = {
  BILL_NO_SNC_N: string;
  PartyName: string;
  BrokerName: string;
  QTY1: number;
  QTY3: number;
  NET_AMT: number;
};

// Define the return type of our custom hook
export type UseHomeDataResult = {
  homeData: HomeData | null;
  // calculatedSalesValue: AggregatedSales;
  // calculatedPurchaseValue: AggregatedPurchase;
  isFetching: boolean;
  fetchError: Error | null | string;
};
