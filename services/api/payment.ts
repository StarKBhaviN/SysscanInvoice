import axiosInstance from "@/utils/axiosConfig";

export type Payment = {
  id: number;
  amount: number;
  status: string;
  date: string;
  subscriptionID?: number;
  userID?: number;
};

export type CheckoutRequest = {
  amount: number;
  provider: string;
};

export type CheckoutResponse = {
  checkoutId: string;
  status: string;
};

export const PaymentAPI = {
  list: async (): Promise<Payment[]> => {
    const { data } = await axiosInstance.get<Payment[]>("/payment");
    return data;
  },

  listByUser: async (userID: number): Promise<Payment[]> => {
    const { data } = await axiosInstance.get<Payment[]>(`/payment/${userID}`);
    return data;
  },

  create: async (payload: Omit<Payment, "id">): Promise<Payment> => {
    const { data } = await axiosInstance.post<Payment>("/payment", payload);
    return data;
  },

  checkout: async (payload: CheckoutRequest): Promise<CheckoutResponse> => {
    console.log("Payload : ", payload, axiosInstance.defaults.baseURL);

    const { data } = await axiosInstance.post<CheckoutResponse>(
      "/payment/checkout",
      payload
    );
    return data;
  },

  webhook: async (payload: {
    event: string;
    data: { userId: number; amount: number; status: string };
  }): Promise<{ rolePromoted?: boolean }> => {
    const { data } = await axiosInstance.post("/payment/webhook", payload);
    return data;
  },
};

export default PaymentAPI;
