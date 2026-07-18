// app/dashboard/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "./_components/Sidebar";
import { Navbar } from "./_components/Navbar";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return (
    <div className="h-full">
      <div className="hidden md:block w-56 fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="h-20 md:pl-56 w-full fixed">
        <Navbar />
      </div>
      <main className="md:pl-56 pt-20 h-full">{children}</main>
    </div>
  );
}
