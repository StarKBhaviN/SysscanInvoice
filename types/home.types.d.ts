// types.ts

// Define the shape of a single sales summary record from the database
export type SalesSummaryRecord = {
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
  // Add other types as needed
  grandTotal: number;
};

// Define the shape of the data for your `CategoryCard`
export type CategoryData = {
  value: number;
  unit: string;
};

// Define the shape of all the data fetched for the home screen
export type HomeData = {
  sales: any[]; // Assuming 'sales' is an array of objects
  totalSales: SalesSummaryRecord[];
};

// Define the return type of our custom hook
export type UseHomeDataResult = {
  homeData: HomeData | null;
  calculatedSalesValue: AggregatedSales;
  isFetching: boolean;
  fetchError: Error | null | string;
};
