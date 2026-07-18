import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";

interface CourseSetupPageProps {
  params: Promise<{ courseId: string }>;
}
export default async function CourseSetupPage({
  params,
}: CourseSetupPageProps) {
  const { courseId } = await params;
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId: userId,
    },
  });

  if (!course) return redirect("/teacher/courses");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Course setup</h1>
        <p className="text-sm text-muted-foreground">
          Complete all fields {completionText}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm courseId={courseId} initialCourseTitle={course.title} />
          <DescriptionForm
            courseId={courseId}
            initialCourseDescription={course.description}
          />
          <ImageForm courseId={courseId} initialImageUrl={course.imageUrl} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
