import { type PropsWithChildren, useEffect } from "react";
import Loading from "@/components/ui/loading";
import { useUser } from "@/hooks/use-user";
import { router } from "@/main";
import { useAuthStore } from "@/store/auth-store";

function AuthProvider({ children }: PropsWithChildren) {
  const { isLoading, isError } = useUser();

  // biome-ignore lint/correctness/useExhaustiveDependencies: handled by router
  useEffect(() => {
    if (isError) {
      useAuthStore.setState({ isAuthed: false });
      router.navigate({ to: "/" });
    }
  }, [isError, router]);

  if (isLoading || isError) {
    return <Loading />;
  }

  return <>{children}</>;
}

export default AuthProvider;
