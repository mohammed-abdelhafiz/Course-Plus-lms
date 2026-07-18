"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Logo = () => {
  const path = usePathname();
  const isTeacherPage = path.includes("/teacher");

  return (
    <Link
      href={isTeacherPage ? "/teacher/courses" : "/"}
      className="p-6 flex items-center gap-1"
    >
      <Image src="/logo.svg" alt="Logo" width={42} height={30} />
      <h1 className="text-2xl font-extrabold text-primary mt-1 uppercase italic">
        Course+
      </h1>
    </Link>
  );
};
