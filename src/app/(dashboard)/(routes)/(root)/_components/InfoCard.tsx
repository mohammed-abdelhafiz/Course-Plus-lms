import { IconBadge } from "@/components/IconBadge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

export const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: InfoCardProps) => {
  return (
    <div className="border rounded-md p-3 flex items-center gap-x-2">
      <IconBadge icon={Icon} variant={variant} />
      <div className="">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {numberOfItems} {numberOfItems === 1 ? " course" : " courses"}
        </p>
      </div>
    </div>
  );
};
