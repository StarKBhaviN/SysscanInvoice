import SQLiteAPI, { RegisterSQLiteRequest } from "@/services/api/sqlite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSQLiteMetaQuery = () =>
  useQuery({
    queryKey: ["sqlite", "meta"],
    queryFn: SQLiteAPI.meta,
    staleTime: 5 * 60 * 1000,
  });

export const useSQLiteRegisterMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterSQLiteRequest) => SQLiteAPI.register(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sqlite", "meta"] });
    },
  });
};

export const useSQLiteSyncMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => SQLiteAPI.sync(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sqlite", "meta"] });
    },
  });
};
