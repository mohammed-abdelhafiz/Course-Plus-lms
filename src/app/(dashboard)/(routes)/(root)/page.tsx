import { getStudentDashboardCourses } from "@/actions/get-student-dashboard-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "../search/_components/CoursesList";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./_components/InfoCard";

export default async function StudentDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { completedCourses, coursesInProgress } =
    await getStudentDashboardCourses(userId);
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
