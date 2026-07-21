import { IconBadge } from "@/components/IconBadge";
import { LucideIcon } from "lucide-react";

interface SetupCardHeaderProps {
  icon: LucideIcon;
  title: string;
}
export const SetupCardHeader = ({
  icon: Icon,
  title,
}: SetupCardHeaderProps) => {
  return (
    <div className="flex items-center gap-x-2 my-6">
      <IconBadge icon={Icon} />
      <h2 className="text-xl">{title}</h2>
    </div>
  );
};
