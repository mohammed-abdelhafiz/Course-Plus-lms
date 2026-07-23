"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  id: string;
  label: string;
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  id,
  label,
  courseId,
  isCompleted,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <Button
      onClick={onClick}
      type="button"
      variant={isActive ? "default" : isCompleted ? "textSuccess" : "ghost"}
      className="justify-start px-0 pl-6 h-12 rounded-sm"
    >
      <div className="flex items-center gap-x-2">
        <Icon
          size={22}
          className={cn(
            isActive && "text-primary-foreground",
            isCompleted && "text-green-600 hover:text-green-700",
          )}
        />
        {label}
      </div>
    </Button>
  );
};
