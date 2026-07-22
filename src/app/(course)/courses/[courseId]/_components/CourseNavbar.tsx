import { NavbarRoutes } from "@/components/NavbarRoutes";
import { Chapter, Course, UserProgress } from "@/generated/prisma/client";
import { CourseMobileSidebar } from "./CourseMobileSidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b shadow-sm flex items-center bg-background h-full">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
