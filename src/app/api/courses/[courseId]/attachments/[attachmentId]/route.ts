import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentId: string }> },
) {
  try {
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, attachmentId } = await params;

    if (!courseId || !attachmentId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }
    if (course.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });
    if (!attachment) {
      return new NextResponse("Attachment Not Found", { status: 404 });
    }

   const attachmentDeleted = await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });

    return NextResponse.json(attachmentDeleted);
  } catch (error) {
    console.log("ATTACHMENT_ID_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
