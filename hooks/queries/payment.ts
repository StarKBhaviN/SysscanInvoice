import PaymentAPI, { CheckoutRequest, Payment } from "@/services/api/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaymentsQuery = () =>
  useQuery({
    queryKey: ["payment", "all"],
    queryFn: PaymentAPI.list,
  });

export const usePaymentsByUserQuery = (userID?: number) =>
  useQuery({
    queryKey: ["payment", "byUser", userID],
    queryFn: () => PaymentAPI.listByUser(userID as number),
    enabled: !!userID,
  });

export const useCreatePaymentMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Payment, "id">) => PaymentAPI.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment"] });
    },
  });
};

export const useCheckoutMutation = () =>
  useMutation({
    mutationFn: (payload: CheckoutRequest) => PaymentAPI.checkout(payload),
  });

export const usePaymentWebhookMutation = () =>
  useMutation({
    mutationFn: (payload: {
      event: string;
      data: { userId: number; amount: number; status: string };
    }) => PaymentAPI.webhook(payload),
  });
