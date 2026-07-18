"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      className={cn(
        "flex items-center pl-6 transition-all hover:bg-primary/5 text-sm font-medium text-foreground/80",
        isActive && "text-primary bg-primary/5",
      )}
      href={href}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon className={cn("size-5", isActive && "text-primary")} />
        <span>{label}</span>
      </div>
      <span
        className={cn(
          "ml-auto opacity-0 border-2 border-primary h-full transition-all",
          isActive && "opacity-100",
        )}
      />
    </Link>
  );
};
