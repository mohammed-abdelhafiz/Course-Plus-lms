import { db } from "@/lib/db";
import { Categories } from "./_components/Categories";
import { SearchInput } from "@/components/SearchInput";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "./_components/CoursesList";

interface SearchPageProps {
  searchParams: Promise<{
    categoryId?: string;
    title?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { categoryId, title } = await searchParams;
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const courses = await getCourses({ userId, categoryId, title });
  console.log(courses);
  return (
    <>
      <div className="block md:hidden px-6 pt-6">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses}/>
      </div>
    </>
  );
}
