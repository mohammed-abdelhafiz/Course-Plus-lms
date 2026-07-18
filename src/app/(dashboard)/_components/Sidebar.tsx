import { Logo } from "./Logo";
import { SidebarRoutes } from "./SidebarRoutes";

export const Sidebar = () => {
  return (
    <aside className="flex flex-col h-full border-r overflow-y-auto shadow-sm bg-background">
      <Logo />
      <SidebarRoutes />
    </aside>
  );
};
