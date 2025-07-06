import axios from "@/utils/axiosConfig";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "./alertContext";
import { useUserContext } from "./userContext";

type Company = {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  userID: number;
};

type CompanyContextType = {
  companies: Company[];
  fetchCompanies: () => Promise<void>;
  createCompany: (data: Partial<Company>) => Promise<void>;
  loading: boolean;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useUserContext();
  const { showAlert } = useAlert();

  const fetchCompanies = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      const resp = await axios.get("/companies/" + user.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(resp.data);
    } catch (error) {
      showAlert("Error", "Could not fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (data: Partial<Company>) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.post("/company", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies((prev) => [...prev, res.data]); // Add to list
    } catch (err: any) {
      console.error("Error creating company:", err);
      showAlert("Error", "Could not create company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchCompanies();
    }
  }, [token, user]);

  return (
    <CompanyContext.Provider
      value={{ companies, fetchCompanies, createCompany, loading }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context)
    throw new Error("useCompanyContext must be used inside Provider");
  return context;
};
