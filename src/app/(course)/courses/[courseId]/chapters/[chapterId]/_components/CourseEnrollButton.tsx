"use client";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}
export const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  return (
    <Button size="lg" onClick={() => {}} className="w-full md:w-auto">
      Enroll for {formatMoney(price)}
    </Button>
  );
};
