import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, isAuthenticated } = await auth();
    const { title } = await req.json();

    if (!isAuthenticated || !userId || !isTeacher(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing course title" },
        { status: 400 },
      );
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.log("[COURSES_POST_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
