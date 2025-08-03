import { useCompanyContext } from "@/context/companyContext";
import { useSQLite } from "@/context/SQLiteContext";
import { HomeData } from "@/types/home.types";
import { useQuery } from "@tanstack/react-query";

export const useHomeDataQuery = () => {
  const { controllers } = useSQLite();
  const { selectedCompanies } = useCompanyContext();

  const companyCodes = selectedCompanies.map((company) => company.CMP_CD);

  return useQuery({
    queryKey: ["homeData", companyCodes.sort()],
    queryFn: async (): Promise<HomeData> => {
      if (!controllers || companyCodes.length === 0) {
        throw new Error("No controllers or companies available");
      }

      const [allInOneHome] = await Promise.all([
        controllers.Home.getAllHome("getAllHomeData", companyCodes),
      ]);

      return {
        allInOneHome: allInOneHome as any,
      };
    },
    enabled: !!controllers && companyCodes.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
