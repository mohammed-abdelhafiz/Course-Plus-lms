import { CourseWithProgressWithCategory } from "@/actions/get-courses";
import { CourseCard } from "./CourseCard";

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CourseListProps) => {
  return (
    <div>
      {items.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <CourseCard key={item.id} course={item}/>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No courses found. Try adjusting your search terms.
        </p>
      )}
    </div>
  );
};
