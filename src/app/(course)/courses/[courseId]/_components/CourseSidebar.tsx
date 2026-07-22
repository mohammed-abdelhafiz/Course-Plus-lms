import { Chapter, Course, UserProgress } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./CourseSidebarItem";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
}

export const CourseSidebar = async ({
  course,
  progress,
}: CourseSidebarProps) => {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {/* check purchase and add progress bar */}
      </div>
      <div className="flex flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            courseId={chapter.courseId}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            isLocked={!purchase && !chapter.isFree}
          />
        ))}
      </div>
    </div>
  );
};
