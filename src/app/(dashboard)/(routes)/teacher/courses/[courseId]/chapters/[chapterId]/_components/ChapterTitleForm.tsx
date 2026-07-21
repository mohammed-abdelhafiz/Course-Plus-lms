"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface ChapterTitleFormProps {
  initialChapterTitle: string;
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChapterTitleForm = ({
  initialChapterTitle,
  courseId,
  chapterId,
}: ChapterTitleFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialChapterTitle,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
      toast.success("Chapter title updated successfully");
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
        <span>Chapter title</span>
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
          id="edit-title-form"
          className="space-y-4 mt-4"
        >
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="course-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Introduction to Python"
                  disabled={isSubmitting}
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
        <p className="text-sm mt-4">{initialChapterTitle}</p>
      )}
    </div>
  );
};
