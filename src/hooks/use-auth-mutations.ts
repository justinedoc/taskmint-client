import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  googleAuth,
  resendOTP,
  signInUser,
  signOutUser,
  signUpUser,
  verifyOTP,
} from "@/api/auth";
import { parseAxiosError } from "@/lib/parse-axios-error";
import { useAuthStore } from "@/store/auth-store";

// --- SIGN IN ---
export function useSigninMutation() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUnverifiedAuth = useAuthStore((s) => s.setUnverifiedAuth);

  return useMutation({
    mutationFn: signInUser,
    onSuccess: (response) => {
      const { accessToken, twoFactorEnabled } = response.data;

      if (twoFactorEnabled) {
        setUnverifiedAuth(accessToken);
        toast.info("Please verify your OTP.");
        navigate({ to: "/verify-otp" });
        return;
      }

      setAuth(accessToken);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard", replace: true });
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- SIGN UP ---
export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log("Signup success", data);
      toast.success("Account created! Please verify your email/OTP.");
      navigate({ to: "/verify-otp" });
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- GOOGLE LOGIN ---
export function useGoogleLoginMutation() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: googleAuth,
    onSuccess: (response) => {
      setAuth(response.data.accessToken);
      toast.success("Google sign-in successful!");
      navigate({ to: "/dashboard", replace: true });
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- OTP VERIFICATION ---
export function useVerifyOtpMutation() {
  const navigate = useNavigate();
  const markVerified = useAuthStore((s) => s.markVerified);

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (response) => {
      markVerified(response.data.accessToken);
      toast.success("Verification successful!");
      navigate({ to: "/dashboard", replace: true });
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- RESEND OTP ---
export function useResendOtpMutation() {
  return useMutation({
    mutationFn: resendOTP,
    onSuccess: (data) => {
      toast.success(data.message || "OTP Resent successfully");
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
}

// --- LOGOUT ---
export function useLogoutMutation() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: signOutUser,
    onSettled: () => {
      clearAuth();
      navigate({ to: "/signin" });
      toast.success("Logged out successfully");
    },
  });
}
