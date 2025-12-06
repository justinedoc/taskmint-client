import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  toggleTwoFactorAuth,
  type UpdateUserPl,
  updateProfilePicture,
  updateUser,
} from "@/api/user";
import { getCurrentUser } from "@/data/get-current-user";
import { parseAxiosError } from "@/lib/parse-axios-error";
import { useAuthStore } from "@/store/auth-store";

export const userQueryOptions = () => {
  const accessToken = useAuthStore.getState().accessToken;

  return queryOptions({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
    enabled: !!accessToken,
  });
};

export const useUser = () => useQuery(userQueryOptions());

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserPl }) =>
      updateUser(userId, data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: userQueryOptions().queryKey });
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
};

export const useToggle2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTwoFactorAuth,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: userQueryOptions().queryKey });
      toast.success(data.message);
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfilePicture(formData),
    onSuccess: () => {
      toast.success("Profile picture updated!");
      queryClient.invalidateQueries({ queryKey: userQueryOptions().queryKey });
    },
    onError: (error) => {
      const { message } = parseAxiosError(error);
      toast.error(message);
    },
  });
};
