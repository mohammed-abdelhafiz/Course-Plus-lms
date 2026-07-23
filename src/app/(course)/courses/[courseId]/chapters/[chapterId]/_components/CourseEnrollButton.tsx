"use client";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}
export const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button size="lg" onClick={onClick} disabled={isLoading} className="w-full md:w-auto">
      {isLoading ? "Loading..." : `Enroll for ${formatMoney(price)}`}
    </Button>
  );
};
