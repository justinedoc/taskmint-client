import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import Navbar from "@/components/dashboard/navbar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import SecondarySidebar from "@/components/dashboard/sidebar/secondary-sidebar";
import Loading from "@/components/ui/loading";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { isAuthed, isOtpVerified } = useAuthStore.getState();

    if (!isAuthed) {
      throw redirect({ to: "/signin" });
    }

    if (!isOtpVerified) {
      throw redirect({ to: "/verify-otp" });
    }
  },
  component: Dashboard,
  pendingComponent: () => <Loading />,
  notFoundComponent: () => <div>Layout - not found</div>,
});

function Dashboard() {
  const isAuthed = useAuthStore((s) => s.isAuthed);

  if (!isAuthed) {
    return <Navigate to="/signin" />;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />

      <SidebarInset className="flex flex-col h-svh overflow-hidden">
        <Navbar />

        <ResizablePanelGroup
          direction="horizontal"
          className="hidden! flex-1 h-full md:flex!"
        >
          {/* MAIN CONTENT PANEL */}
          <ResizablePanel defaultSize={68} minSize={30}>
            <div className="h-full w-full overflow-y-auto p-8">
              <Outlet />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* SECONDARY SIDEBAR PANEL */}
          <ResizablePanel defaultSize={32} minSize={32} maxSize={38}>
            <div className="h-full w-full overflow-y-auto border-l">
              <SecondarySidebar />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Mobile View */}
        <div className="flex w-full flex-1 overflow-y-auto p-4 md:hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
