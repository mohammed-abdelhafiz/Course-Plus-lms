import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/ChapterDescriptionForm";

export default async function ChapterIdPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/teacher/courses");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const fieldsCompleted = requiredFields.filter(Boolean).length;
  const completionText = `(${fieldsCompleted}/${totalFields})`;

  return (
    <div className="p-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="flex items-center text-sm mb-6 hover:opacity-75 transition"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to course setup
      </Link>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Chapter creation</h1>
        <span className="text-sm text-muted-foreground">
          Complete all fields {completionText}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              courseId={courseId}
              chapterId={chapterId}
              initialChapterTitle={chapter.title}
            />
            <ChapterDescriptionForm
              courseId={courseId}
              chapterId={chapterId}
              initialChapterDescription={chapter.description}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
