import { type PropsWithChildren, useEffect } from "react";
import Loading from "@/components/ui/loading";
import { useUser } from "@/hooks/use-user";
import { router } from "@/router";
import { useAuthStore } from "@/store/auth-store";

function AuthProvider({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { isFetching, isError, isSuccess } = useUser();

  useEffect(() => {
    if (accessToken && isError) {
      useAuthStore.getState().clearAuth();

      router.navigate({ to: "/" });
    }
  }, [accessToken, isError]);

  if (accessToken && (isFetching || isError || !isSuccess)) {
    return <Loading />;
  }

  return <>{children}</>;
}

export default AuthProvider;
