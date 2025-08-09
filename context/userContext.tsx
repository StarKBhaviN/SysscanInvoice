import axios from "@/utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "./alertContext";

type User = {
  id: number;
  email: string;
  role: string;
  username?: string;
  profileImage?: string | null;
  phoneNumber?: string | null;
  adminRefID?: number | null;
  createdAt?: string;
};

type UserContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showAlert } = useAlert();

  const userRes = async (accessToken: string) => {
    const resp = await axios.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setUser(resp.data);
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("Invoice_Token");
      if (storedToken) {
        setToken(storedToken);
        await userRes(storedToken);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/users/login", { email, password });
      const token = res.data.accessToken;
      await AsyncStorage.setItem("Invoice_Token", token);
      setToken(token);
      await userRes(token);

      router.replace("/(main)/home/index");
    } catch (err: any) {
      const messages = err?.response?.data?.message;

      const errorMessage = Array.isArray(messages)
        ? messages.join("\n")
        : messages || "Try again";

      showAlert("Login Failed...", errorMessage);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("Invoice_Token");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used inside Provider");
  return context;
};
