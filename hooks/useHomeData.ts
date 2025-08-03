// hooks/useHomeData.ts

import { useCompanyContext } from "@/context/companyContext";
import { useSQLite } from "@/context/SQLiteContext";
import { HomeData, UseHomeDataResult } from "@/types/home.types";
import { useEffect, useState } from "react";

export const useHomeData = (): UseHomeDataResult => {
  const { controllers, error: fetchError } = useSQLite();
  const { selectedCompanies } = useCompanyContext();

  const [homeData, setHomeData] = useState<HomeData | null>(null);

  const [isFetching, setIsFetching] = useState(false);

  const fetchAllData = async () => {
    setIsFetching(true);

    const companyCodes = selectedCompanies.map((company) => company.CMP_CD);

    try {
      if (controllers && companyCodes.length > 0) {
        const [allInOneHome] = await Promise.all([
          controllers.Home.getAllHome("getAllHomeData", companyCodes),
        ]);

        const data: HomeData = {
          allInOneHome: allInOneHome as any,
        };
        setHomeData(data);
      } else {
        setHomeData(null);
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
  }, [selectedCompanies]);

  return {
    homeData,
    isFetching,
    fetchError,
  };
};
