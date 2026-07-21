import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_SECRET_KEY!,
});

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { isAuthenticated, userId } = await auth();

    if (!isAuthenticated || !userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json("Course not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter.muxData.assetId);
      }
    }

    await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json("Course deleted successfully");
  } catch (error) {
    console.log("[COURSE_ID_DELETE_ERROR]", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
