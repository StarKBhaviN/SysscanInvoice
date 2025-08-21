import axios from "@/utils/axiosConfig";

export type Subscription = {
  id: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  paymentMethod: string;
  userID: number;
};

export const SubscriptionAPI = {
  list: async (): Promise<Subscription[]> => {
    const { data } = await axios.get<Subscription[]>("/subscription");
    return data;
  },

  getByUser: async (userID: number): Promise<Subscription> => {
    const { data } = await axios.get<Subscription>(`/subscription/${userID}`);
    return data;
  },

  create: async (payload: Omit<Subscription, "id">): Promise<Subscription> => {
    const { data } = await axios.post<Subscription>("/subscription", payload);
    return data;
  },
};

export default SubscriptionAPI;
