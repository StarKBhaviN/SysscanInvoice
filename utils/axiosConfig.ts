// utils/axiosConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from AsyncStorage for every request
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("Invoice_Token");
    if (token && config && config.headers && !config.headers["Authorization"]) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Basic response interceptor stub (kept minimal; surface errors to caller)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
