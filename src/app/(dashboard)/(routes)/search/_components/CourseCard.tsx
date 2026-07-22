import { CourseWithProgressWithCategory } from "@/actions/get-courses";
import { IconBadge } from "@/components/IconBadge";
import { formatMoney } from "@/lib/format-money";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: CourseWithProgressWithCategory;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link href={`courses/${course.id}`}>
      <div className="group h-full p-3 rounded-lg border overflow-hidden hover:shadow-sm transition-all duration-300">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            src={course.imageUrl!}
            alt={course.title}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-primary transition line-clamp-2">
            {course.title}
          </div>
          <p className="text-xs text-muted-foreground">
            {course.category?.name}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1">
              <IconBadge icon={BookOpen} size="sm" />
              <span>
                {course.chapters.length}
                {course.chapters.length === 1 ? " chapter" : " chapters"}
              </span>
            </div>
          </div>
          {course.progress !== null ? (
            <div>
              {/* <Progress value={course.progress} className="h-2" /> */}
            </div>
          ) : (
            <p className="text-md md:text-sm font-medium">{formatMoney(course.price || 0)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
