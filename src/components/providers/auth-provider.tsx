import { type PropsWithChildren, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { router } from "@/main";
import { useAuthStore } from "@/store/auth-store";

function AuthProvider({ children }: PropsWithChildren) {
  const { isLoading, isError } = useUser();

  useEffect(() => {
    if (isError) {
      useAuthStore.setState({ isAuthed: false });
      router.navigate({ to: "/" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, router]);

  if (isLoading || isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
