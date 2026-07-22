import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}
export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) return redirect("/search");

  return redirect(`/courses/${courseId}/chapters/${course.chapters[0]?.id}`);
}
