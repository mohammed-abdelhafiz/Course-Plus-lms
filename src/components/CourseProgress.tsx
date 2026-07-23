import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
  progress: number;
  variant?: "success" | "default";
  size?: "default" | "sm";
}

const colorByVariant = {
  success: "text-green-600",
  default: "text-primary",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({
  progress,
  variant,
  size = "default",
}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={progress} variant={variant} />
      <p
        className={cn(
          "text-primary mt-2 font-medium",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"],
        )}
      >
        {Math.round(progress)}% Complete
      </p>
    </div>
  );
};
