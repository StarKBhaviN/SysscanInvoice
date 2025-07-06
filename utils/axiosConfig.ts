// utils/axiosConfig.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.29.99:3000", // <--- Your local IP
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
