import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import { SetupCardHeader } from "./_components/SetupCardHeader";
import { AttachmentForm } from "./_components/AttachmentForm";
import { ChaptersForm } from "./_components/ChaptersForm";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/CourseActions";

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
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) return redirect("/teacher/courses");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is not published. It will not be visible to students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <p className="text-sm text-muted-foreground">
              Complete all fields {completionText}
            </p>
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <SetupCardHeader
              icon={LayoutDashboard}
              title="Customize your course"
            />
            <TitleForm courseId={courseId} initialCourseTitle={course.title} />
            <DescriptionForm
              courseId={courseId}
              initialCourseDescription={course.description}
            />
            <ImageForm courseId={courseId} initialImageUrl={course.imageUrl} />
            <CategoryForm
              courseId={courseId}
              initialCategoryId={course.categoryId}
              categories={categories}
            />
          </div>
          <div className="space-y-6">
            <div>
              <SetupCardHeader icon={ListChecks} title="Course chapters" />
              <ChaptersForm courseId={courseId} chapters={course.chapters} />
            </div>
            <div>
              <SetupCardHeader
                icon={CircleDollarSign}
                title="Sell your course"
              />
              <PriceForm
                courseId={courseId}
                initialCoursePrice={course.price}
              />
            </div>
            <div>
              <SetupCardHeader icon={File} title="Resources & Attachments" />
              <AttachmentForm
                courseId={courseId}
                attachments={course.attachments}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
