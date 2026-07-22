import { Attachment, Chapter } from "@/generated/prisma/client";
import { db } from "@/lib/db";

interface getChapterArgs {
  userId: string;
  chapterId: string;
  courseId: string;
}
export async function getChapter({
  userId,
  chapterId,
  courseId,
}: getChapterArgs) {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    });
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) throw new Error("Chapter or course not found");
    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapter.id,
        },
      });
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      userProgress,
      nextChapter,
      attachments,
      muxData,
      purchase,
    };
  } catch (error) {
    console.log(error);
    return {
      chapter: null,
      course: null,
      userProgress: null,
      nextChapter: null,
      attachments: [],
      muxData: null,
      purchase: null,
    };
  }
}
