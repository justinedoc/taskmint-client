import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { queryClient } from "@/lib/react-query";

export interface AuthState {
  accessToken: string | null;
  isAuthed: boolean;
  isOtpVerified: boolean;
  setAuth: (token: string) => void;
  setUnverifiedAuth: (token: string) => void;
  markVerified: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthed: false,
      isOtpVerified: false,

      setAuth: (token: string) => {
        set({ accessToken: token, isAuthed: true, isOtpVerified: true });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },

      setUnverifiedAuth: (token: string) => {
        set({ accessToken: token, isAuthed: true, isOtpVerified: false });
      },

      markVerified: (token: string) => {
        set({ accessToken: token, isAuthed: true, isOtpVerified: true });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },

      clearAuth: () => {
        set({
          accessToken: null,
          isAuthed: false,
          isOtpVerified: false,
        });
        queryClient.clear();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
