import SecondarySidebarContent from "@/components/dashboard/sidebar/secondary-sidebar-content";
import SidebarTasks from "@/components/dashboard/sidebar/sidebar-tasks";
import { Sheet } from "@/components/ui/sheet";

function SecondarySidebar() {
  return (
    <Sheet>
      <SecondarySidebarContent />
      <SidebarTasks />
    </Sheet>
  );
}

export default SecondarySidebar;
