import { IconBadge } from "@/components/IconBadge";
import { LucideIcon } from "lucide-react";

interface CourseSetupCardHeaderProps {
  icon: LucideIcon;
  title: string;
}
export const CourseSetupCardHeader = ({
  icon: Icon,
  title,
}: CourseSetupCardHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-x-2 my-6">
        <IconBadge icon={Icon} />
        <h2 className="text-xl">{title}</h2>
      </div>
    </div>
  );
};
