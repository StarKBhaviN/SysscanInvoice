import axiosInstance from "@/utils/axiosConfig";

export type RegisterSQLiteRequest = {
  provider: "url";
  url: string;
};

export type SQLiteMeta = {
  provider: string;
  url?: string;
  lastSyncedAt?: string;
};

export const SQLiteAPI = {
  register: async (
    payload: RegisterSQLiteRequest
  ): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<{ success: boolean }>(
      "/sqlite/register",
      payload
    );
    return data;
  },

  sync: async (): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<{ success: boolean }>(
      "/sqlite/sync"
    );
    return data;
  },

  meta: async (): Promise<SQLiteMeta> => {
    const { data } = await axiosInstance.get<SQLiteMeta>("/sqlite/meta");
    return data;
  },
};

export default SQLiteAPI;
