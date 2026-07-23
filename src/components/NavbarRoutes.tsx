"use client";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { SearchInput } from "./SearchInput";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto items-center">
        {isTeacherPage || isCoursePage ? (
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
    </>
  );
};
