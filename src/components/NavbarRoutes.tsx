"use client";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");
  return (
    <div className="flex gap-x-2 ml-auto items-center">
      {isTeacherPage || isPlayerPage ? (
        <Link
          className={buttonVariants({
            variant: "ghost",
          })}
          href={"/"}
        >
          <div className="flex items-center gap-x-2">
            <LogOut />
            <span className="text-sm font-medium">Exit</span>
          </div>
        </Link>
      ) : (
        <Link
          className={buttonVariants({
            variant: "ghost",
          })}
          href={"/teacher/courses"}
        >
          <span className="text-sm font-medium">Teacher mode</span>
        </Link>
      )}
      <UserButton />
    </div>
  );
};
