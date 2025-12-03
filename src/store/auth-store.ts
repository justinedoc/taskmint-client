import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { queryClient } from "@/main"; // Assuming this is where your QueryClient is exported

export interface AuthState {
  accessToken: string | null;
  isAuthed: boolean;
  isOtpVerified: boolean; // Kept this as it is specific to your app's 2FA flow

  // Actions
  setAuth: (token: string) => void;
  setUnverifiedAuth: (token: string) => void; // For when 2FA is required but password passed
  markVerified: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthed: false,
      isOtpVerified: false,

      // Standard Login (No 2FA or Google Auth)
      setAuth: (token: string) => {
        set({
          accessToken: token,
          isAuthed: true,
          isOtpVerified: true,
        });

        // Invalidate user data to fetch fresh profile
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },

      // Intermediate state: Password correct, but OTP needed
      setUnverifiedAuth: (token: string) => {
        set({
          accessToken: token, // Sometimes you need the token to verify the OTP
          isAuthed: true,
          isOtpVerified: false,
        });
      },

      // OTP Verification success
      markVerified: (token: string) => {
        set({
          accessToken: token,
          isAuthed: true,
          isOtpVerified: true,
        });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },

      clearAuth: () => {
        set({
          accessToken: null,
          isAuthed: false,
          isOtpVerified: false,
        });
        queryClient.removeQueries({ queryKey: ["user"] });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
