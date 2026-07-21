import { Chapter } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated || !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { courseId } = await params;
    const { list } = await req.json();

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    list.forEach(async (chapter: Chapter) => {
      await db.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      });
    });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("REORDER_CHAPTERS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
