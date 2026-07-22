import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TeacherCoursesPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
