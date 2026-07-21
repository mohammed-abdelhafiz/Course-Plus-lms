import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated || !userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { title } = await request.json();
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }
    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 },
      );
    }
    if (course.userId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: { position: "desc" },
    });
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: lastChapter ? lastChapter.position + 1 : 1,
      },
    });
    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
