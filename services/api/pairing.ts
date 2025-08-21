import axios from "@/utils/axiosConfig";

export type Pairing = {
  id: number;
  code: string;
  desktopClientId?: string;
  userId: number;
  createdAt: string;
};

export const PairingAPI = {
  create: async (): Promise<{ code: string }> => {
    const { data } = await axios.post<{ code: string }>("/pairing/create");
    return data;
  },

  activate: async (payload: {
    code: string;
    desktopClientId: string;
  }): Promise<{ success: boolean }> => {
    const { data } = await axios.post<{ success: boolean }>(
      "/pairing/activate",
      payload
    );
    return data;
  },

  list: async (): Promise<Pairing[]> => {
    const { data } = await axios.get<Pairing[]>("/pairing");
    return data;
  },
};

export default PairingAPI;
