import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const data = await req.json();

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data,
    });
    if (!course) {
      return NextResponse.json("Course not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID_ERROR]", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
