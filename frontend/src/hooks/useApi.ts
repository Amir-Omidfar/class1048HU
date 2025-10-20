import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const useApi = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: API_URL });
    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return instance;
  }, [getToken]);

  return api;
};
