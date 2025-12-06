import type { PropsWithChildren } from "react";
import Loading from "@/components/ui/loading";
import { useUser } from "@/hooks/use-user";
import { useAuthStore } from "@/store/auth-store";

function AuthProvider({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { isFetching, isError, isSuccess } = useUser();

  if (accessToken && (isFetching || isError || !isSuccess)) {
    return <Loading />;
  }

  return <>{children}</>;
}

export default AuthProvider;
