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
    });

    if (!course) return NextResponse.json("Unauthorized", { status: 401 });

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json("Course unpublished successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
