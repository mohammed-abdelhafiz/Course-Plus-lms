import { Course, Category } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

export interface CourseWithProgressWithCategory extends Course {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
}

interface GetCourses {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const CourseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }
        return {
          ...course,
          progress: await getProgress(userId, course.id),
        };
      }),
    );
    return CourseWithProgress;
  } catch (error) {
    console.log(error);
    return [];
  }
};
