// hooks/useHomeData.ts

import { useCompanyContext } from "@/context/companyContext";
import { useSQLite } from "@/context/SQLiteContext";
import {
  AggregatedSales,
  HomeData,
  SalesSummaryRecord,
  UseHomeDataResult,
} from "@/types/home.types";
import { useEffect, useState } from "react";

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

const initialAggregatedSales: AggregatedSales = {
  totalSales: 0,
  totalGSL: 0,
  totalJWI: 0,
  grandTotal: 0,
};

export const useHomeData = (): UseHomeDataResult => {
  const { controllers, error: fetchError } = useSQLite();
  const { selectedCompanies } = useCompanyContext();

  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [calculatedSalesValue, setCalculatedSalesValue] =
    useState<AggregatedSales>(initialAggregatedSales);
  const [isFetching, setIsFetching] = useState(false);

  const fetchAllData = async () => {
    // Start fetching
    setIsFetching(true);

    const companyCodes = selectedCompanies.map((company) => company.CMP_CD);

    try {
      if (controllers && companyCodes.length > 0) {
        // Fetch testSales and totalSales concurrently for efficiency
        const [salesResult, totalSalesResult] = await Promise.all([
          controllers.Company.getSales("testSales", companyCodes),
          controllers.Company.getSales("getHomeSales", companyCodes),
        ]);

        const data: HomeData = {
          sales: salesResult,
          totalSales: totalSalesResult as SalesSummaryRecord[],
        };
        setHomeData(data);
      } else {
        setHomeData(null);
        setCalculatedSalesValue(initialAggregatedSales);
      }
    } catch (err) {
      console.error("useHomeData error:", err);
      setHomeData(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanies, controllers]);

  useEffect(() => {
    if (homeData) {
      const total = calculateTotalSales(homeData.totalSales);
      setCalculatedSalesValue(total);
    }
  }, [homeData]);

  return { homeData, calculatedSalesValue, isFetching, fetchError };
};
