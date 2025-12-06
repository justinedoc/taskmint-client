import { QueryClient, QueryCache } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth-store";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.error("Auth error detected. Logging out.");
        useAuthStore.getState().clearAuth();
      }
    },
  }),
});
