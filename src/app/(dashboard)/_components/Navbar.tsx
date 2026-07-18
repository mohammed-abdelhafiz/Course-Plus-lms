import { MobileSidebar } from "./MobileSidebar";
import { NavbarRoutes } from "@/components/NavbarRoutes";

export const Navbar = () => {
  return (
    <nav className="p-4 h-full border-b bg-background shadow-sm flex items-center">
      <MobileSidebar />
      <NavbarRoutes />
    </nav>
  );
};
