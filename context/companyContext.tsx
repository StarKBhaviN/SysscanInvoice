import { Company } from "@/components/ui/CompanySelectionDropdown";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSQLite } from "./SQLiteContext";

interface CompanyContextType {
  selectedCompanies: Company[];
  setSelectedCompanies: (companies: Company[]) => void;
  companies: Company[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

  const { controllers, isLoading } = useSQLite();
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    if (!isLoading && controllers) {
      (async () => {
        try {
          const result: any = await controllers.Company.getHome();
          setCompanies(result);
          if (result.length > 0) {
            setSelectedCompanies([result[0]]);
          }
        } catch (err) {
          console.error("handleTest error:", err);
        }
      })();
    }
  }, [isLoading, controllers]);

  return (
    <CompanyContext.Provider
      value={{ selectedCompanies, setSelectedCompanies, companies }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};
