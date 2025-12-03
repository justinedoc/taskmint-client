import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/main";
import { useAuthStore } from "@/store/auth-store";

export default function App() {
  const auth = useAuthStore();
  return <RouterProvider router={router} context={{ auth }} />;
}
