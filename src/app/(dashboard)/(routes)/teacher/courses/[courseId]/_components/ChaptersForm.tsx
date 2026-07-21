"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chapter } from "@/generated/prisma/client";
import { ChaptersList } from "./ChaptersList";

interface ChaptersFormProps {
  courseId: string;
  chapters: Chapter[];
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const ChaptersForm = ({ courseId, chapters }: ChaptersFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, data);
      toast.success("Chapter created successfully");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleReorder = async (
    updatedData: { id: string; position: number }[],
  ) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData,
      });
      toast.success("Chapters reordered successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const { isValid, isSubmitting, isDirty } = form.formState;

  const [isCreating, setIsCreating] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
    form.reset();
  };

  const onEdit = (chapterId: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
  }

  return (
    <div className="relative bg-muted rounded-md p-4">
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span>Course chapters</span>
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <p>Cancel</p>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating ? (
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
                  id="course-description"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g.  Introduction to React"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={!isValid || isSubmitting || !isDirty}>
            Create
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          {chapters.length === 0 ? (
            <p className={cn("text-sm mt-4 text-muted-foreground italic")}>
              No chapters added yet
            </p>
          ) : (
            <div>
              <ChaptersList
                chapters={chapters}
                onReorder={handleReorder}
                onEdit={onEdit}
              />
              <p className="text-sm text-muted-foreground">
                Drag and drop to reorder your chapters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
