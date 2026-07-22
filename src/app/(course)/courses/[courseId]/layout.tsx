import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/CourseSidebar";
import { CourseNavbar } from "./_components/CourseNavbar";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}
export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { courseId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) redirect("/search");

  const progress = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="h-20 md:pl-80 fixed w-full z-50">
        <CourseNavbar course={course} progressCount={progress} />
      </div>
      <div className="hidden md:flex flex-col w-80 h-full fixed inset-y-0 z-50">
        <CourseSidebar course={course} progress={progress} />
      </div>
      <main className="md:pl-80 pt-20 h-full">{children}</main>
    </div>
  );
}
