import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function TeacherCoursesPage() {
  return (
    <div className="p-6">
      <Link
        href={"/teacher/courses/new"}
        className={buttonVariants({ variant: "default", size: "lg" })}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        New Course
      </Link>
    </div>
  );
}
