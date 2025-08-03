import { Company } from "@/components/ui/CompanySelectionDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSQLite } from "./SQLiteContext";

interface CompanyContextType {
  selectedCompanies: Company[];
  setSelectedCompanies: (companies: Company[]) => void;
  companies: Company[];
  loading: boolean;
  error: Error | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);
const SELECTED_COMPANIES_STORAGE_KEY = "user_selected_companies";

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const { controllers, isLoading: isSQLiteLoading } = useSQLite();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompaniesState] = useState<Company[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isSQLiteLoading) {
      return;
    }

    const initialize = async () => {
      if (!controllers) {
        setError(
          new Error("Database connection failed. Controllers not available.")
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all available companies from the database.
        const allCompaniesResult: any =
          await controllers.Company.getHeaderCompanyData();
        setCompanies(allCompaniesResult);

        // 2. Load the user's last selection from persistent storage.
        const storedCompaniesJson = await AsyncStorage.getItem(
          SELECTED_COMPANIES_STORAGE_KEY
        );

        if (storedCompaniesJson) {
          // If a selection was saved, use it.
          const storedCompanies = JSON.parse(storedCompaniesJson);
          setSelectedCompaniesState(storedCompanies);
        } else if (allCompaniesResult.length > 0) {
          // If no selection was saved (e.g., first launch), default to the first company.
          setSelectedCompaniesState([allCompaniesResult[0]]);
        }
      } catch (err) {
        console.error("Failed to initialize company context:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSQLiteLoading]);

  const setSelectedCompanies = async (newSelectedCompanies: Company[]) => {
    try {
      // Update the state in memory for immediate UI feedback.
      setSelectedCompaniesState(newSelectedCompanies);

      // Persist the new selection to storage.
      const jsonValue = JSON.stringify(newSelectedCompanies);
      await AsyncStorage.setItem(SELECTED_COMPANIES_STORAGE_KEY, jsonValue);
    } catch (err) {
      console.error("Failed to save selected companies:", err);
      setError(err as Error);
    }
  };

  const value = useMemo(
    () => ({
      selectedCompanies,
      setSelectedCompanies,
      companies,
      loading,
      error,
    }),
    [selectedCompanies, companies, loading, error]
  );

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};
