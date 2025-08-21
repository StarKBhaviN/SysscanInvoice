import PairingAPI from "@/services/api/pairing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePairingsQuery = () =>
  useQuery({
    queryKey: ["pairing", "all"],
    queryFn: PairingAPI.list,
  });

export const useCreatePairingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => PairingAPI.create(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pairing"] });
    },
  });
};

export const useActivatePairingMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { code: string; desktopClientId: string }) =>
      PairingAPI.activate(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pairing"] });
    },
  });
};
