import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated || !userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) return NextResponse.json("Unauthorized", { status: 401 });

    const hasPublishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished,
    );

    if (!hasPublishedChapters)
      return NextResponse.json(
        "No chapters are published, please publish at least one chapter",
        { status: 400 },
      );

    const hasCompletedFields =
      course.title &&
      course.description &&
      course.price &&
      course.categoryId &&
      course.imageUrl;

    if (!hasCompletedFields)
      return NextResponse.json("Missing required fields", { status: 400 });

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json("Course published successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
