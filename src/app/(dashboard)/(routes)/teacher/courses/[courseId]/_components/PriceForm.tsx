"use client";
import * as z from "zod";
import { Controller, useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format-money";

interface PriceFormProps {
  initialCoursePrice: number | null;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({ initialCoursePrice, courseId }: PriceFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<
      z.infer<typeof formSchema>
    >,
    defaultValues: {
      price: initialCoursePrice ?? 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("Price updated successfully");
      toggleEditMode();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const { isValid, isSubmitting, isDirty } = form.formState;

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="bg-muted rounded-md p-4">
      <div className="flex justify-between items-center">
        <span>Course Price</span>
        <Button variant="ghost" onClick={toggleEditMode}>
          {isEditing ? (
            <p>Cancel</p>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="edit-price-form"
          className="space-y-4 mt-4"
        >
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="course-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Write price of your course..."
                  disabled={isSubmitting}
                  type="number"
                  step={0.01}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={!isValid || isSubmitting || !isDirty}>
            Save
          </Button>
        </form>
      ) : (
        <p
          className={cn(
            "text-sm mt-4",
            !initialCoursePrice && "text-muted-foreground italic",
          )}
        >
          {initialCoursePrice
            ? formatMoney(initialCoursePrice)
            : "No price set"}
        </p>
      )}
    </div>
  );
};
