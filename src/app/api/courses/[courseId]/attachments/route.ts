import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { userId, isAuthenticated } = await auth();
    if (!isAuthenticated)
      return new NextResponse("Unauthorized", { status: 401 });

    const { courseId } = await params;
    const { url } = await req.json();

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const attachment = await db.attachment.create({
      data: {
        courseId,
        url,
        name: url.split("/").pop(),
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.log("[ATTACHMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
