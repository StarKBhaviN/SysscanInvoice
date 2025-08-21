import SubscriptionAPI, { Subscription } from "@/services/api/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubscriptionsQuery = () =>
  useQuery({
    queryKey: ["subscription", "all"],
    queryFn: SubscriptionAPI.list,
  });

export const useSubscriptionByUserQuery = (userID?: number) =>
  useQuery({
    queryKey: ["subscription", "byUser", userID],
    queryFn: () => SubscriptionAPI.getByUser(userID as number),
    enabled: !!userID,
  });

export const useCreateSubscriptionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Subscription, "id">) =>
      SubscriptionAPI.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};
