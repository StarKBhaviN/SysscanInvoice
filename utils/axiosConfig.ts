// utils/axiosConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.11:3000", // <--- Your local IP
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from AsyncStorage for every request
instance.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("Invoice_Token");
    if (token && config && config.headers && !config.headers["Authorization"]) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Basic response interceptor stub (kept minimal; surface errors to caller)
instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;
