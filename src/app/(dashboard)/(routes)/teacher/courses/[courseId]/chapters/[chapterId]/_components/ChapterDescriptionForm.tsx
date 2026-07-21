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
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Editor from "@/components/editor";
import Preview from "@/components/preview";

interface ChapterDescriptionFormProps {
  initialChapterDescription: string | null;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string(),
});

export const ChapterDescriptionForm = ({
  initialChapterDescription,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialChapterDescription ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
      toast.success("Chapter description updated successfully");
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
        <span>Chapter Description</span>
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
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Editor {...field} />
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
        <div
          className={cn(
            "text-sm mt-4",
            !initialChapterDescription && "text-muted-foreground italic",
          )}
        >
          {initialChapterDescription ? (
            <div
              className={cn(
                "text-sm mt-4",
                !initialChapterDescription && "text-muted-foreground italic",
              )}
            >
              <Preview value={initialChapterDescription} />
            </div>
          ) : (
            <p>No description</p>
          )}
        </div>
      )}
    </div>
  );
};
