import axios from "@/utils/axiosConfig";

export type Company = {
  id: number;
  name: string;
  address?: string;
  userID: number;
  invoices?: Record<string, unknown>;
  sales?: Record<string, unknown>;
  purchases?: Record<string, unknown>;
  receivables?: Record<string, unknown>;
  payables?: Record<string, unknown>;
};

export type CreateCompanyRequest = Omit<Company, "id">;

export const CompaniesAPI = {
  list: async (): Promise<Company[]> => {
    const { data } = await axios.get<Company[]>("/companies");
    return data;
  },

  listMine: async (): Promise<Company[]> => {
    const { data } = await axios.get<Company[]>("/companies/me");
    return data;
  },

  create: async (payload: CreateCompanyRequest): Promise<Company> => {
    const { data } = await axios.post<Company>("/companies", payload);
    return data;
  },
};

export default CompaniesAPI;
