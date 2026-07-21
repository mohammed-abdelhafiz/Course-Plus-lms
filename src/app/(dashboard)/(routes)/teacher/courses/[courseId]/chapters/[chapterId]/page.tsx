import { db } from "@/lib/db";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/ChapterDescriptionForm";
import { ChapterAccessForm } from "./_components/ChapterAccessForm";
import { ChapterVideoForm } from "./_components/ChapterVideoForm";
import { SetupCardHeader } from "../../_components/SetupCardHeader";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/ChapterActions";

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

  const isComplete = requiredFields.every(Boolean);

  return (
    <div>
      {!chapter.isPublished && (
        <Banner
          label="This chapter is not published, it will not be visible to students"
          variant="warning"
        />
      )}
      <div className="p-6">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="flex items-center text-sm mb-6 hover:opacity-75 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to course setup
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Chapter creation</h1>
            <span className="text-sm text-muted-foreground">
              Complete all fields {completionText}
            </span>
          </div>
          <ChapterActions
            disabled={!isComplete}
            chapterId={chapterId}
            courseId={courseId}
            isPublished={chapter.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <SetupCardHeader
              icon={LayoutDashboard}
              title="Customize your chapter"
            />
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
            <div>
              <SetupCardHeader icon={Eye} title="Access settings" />
              <ChapterAccessForm
                courseId={courseId}
                chapterId={chapterId}
                initialChapterAccess={chapter.isFree}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <SetupCardHeader icon={Video} title="Add a video" />
              <ChapterVideoForm
                courseId={courseId}
                chapterId={chapterId}
                videoUrl={chapter.videoUrl}
                muxData={chapter.muxData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
