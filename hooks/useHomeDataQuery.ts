import { useCompanyContext } from "@/context/companyContext";
import { useSQLite } from "@/context/SQLiteContext";
import { HomeData, HomeDetailRecord } from "@/types/home.types";
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

export const useHomeDetailsQuery = (typ: string) => {
  const { controllers } = useSQLite();
  const { selectedCompanies } = useCompanyContext();
  const companyCodes = selectedCompanies.map((company) => company.CMP_CD);

  return useQuery({
    queryKey: ["homeDetails", companyCodes.sort(), typ],

    queryFn: async (): Promise<HomeDetailRecord[]> => {
      if (!controllers || companyCodes.length === 0 || !typ) {
        return [];
      }

      const details = await controllers.Home.getDetailsByTyp(companyCodes, typ);
      return details as HomeDetailRecord[];
    },

    enabled: !!controllers && companyCodes.length > 0 && !!typ,

    staleTime: 5 * 60 * 1000,
  });
};

export const useDetailsSummary = (companyCodes, typ, controllers) => {
  return useQuery({
    queryKey: ["detailsSummary", [...companyCodes].sort(), typ],

    queryFn: () => {
      if (!controllers || !typ) {
        throw new Error("Invalid parameters for getSummaryByTyp.");
      }
      return controllers.Home.getSummaryByTyp(companyCodes, typ);
    },

    enabled: !!typ && companyCodes.length > 0,
  });
};

export const useHomeDetails = (
  companyCodes,
  typ,
  expandedParty,
  controllers
) => {
  return useQuery({
    queryKey: ["homeDetails", [...companyCodes].sort(), typ, expandedParty],

    queryFn: () => {
      if (!controllers || !typ || !expandedParty) {
        throw new Error("Invalid parameters for getSummaryDetailsByTyp.");
      }
      return controllers.Home.getSummaryDetailsByTyp(
        companyCodes,
        typ,
        expandedParty
      );
    },

    enabled: !!typ && !!expandedParty && companyCodes.length > 0,
  });
};
