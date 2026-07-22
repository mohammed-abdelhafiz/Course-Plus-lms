import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chapter, Course, UserProgress } from "@/generated/prisma/client";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseSidebar } from "./CourseSidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
export const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger
        className={cn(buttonVariants({ variant: "ghost" }), "md:hidden")}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <CourseSidebar course={course} progress={progressCount} />
      </SheetContent>
    </Sheet>
  );
};
