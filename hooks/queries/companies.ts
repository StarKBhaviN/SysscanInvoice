import CompaniesAPI, { CreateCompanyRequest } from "@/services/api/companies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCompaniesQuery = () =>
  useQuery({
    queryKey: ["companies", "all"],
    queryFn: CompaniesAPI.list,
    staleTime: 60 * 1000,
  });

export const useMyCompaniesQuery = () =>
  useQuery({
    queryKey: ["companies", "me"],
    queryFn: CompaniesAPI.listMine,
    staleTime: 60 * 1000,
  });

export const useCreateCompanyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyRequest) => CompaniesAPI.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
