import { Category, Chapter, Course } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { getProgress } from "./get-progress";

interface CourseWithProgressWithCategory extends Course {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
}
interface StudentDashboardCourses {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
}
export const getStudentDashboardCourses = async (
  studentId: string,
): Promise<StudentDashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: studentId,
      },
      include: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });
    const courses = purchasedCourses.map(
      (purchase) => purchase.course,
    ) as CourseWithProgressWithCategory[];
    for (const course of courses) {
      const progressData = await getProgress(studentId, course.id);
      course.progress = progressData;
    }
    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);
    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("Error fetching student dashboard courses:", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
