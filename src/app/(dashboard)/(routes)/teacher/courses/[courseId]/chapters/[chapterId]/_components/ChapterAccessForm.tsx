"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialChapterAccess: boolean;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean(),
});

export const ChapterAccessForm = ({
  initialChapterAccess,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: Boolean(initialChapterAccess),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
      toast.success("Chapter access updated successfully");
      toggleEditMode();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const { isSubmitting } = form.formState;

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="bg-muted rounded-md p-4">
      <div className="flex justify-between items-center">
        <span>Chapter Access</span>
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
            name="isFree"
            render={({ field }) => (
              <FieldGroup className="">
                <Field orientation="horizontal">
                  <Checkbox
                    id="isFree"
                    name="isFree"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="isFree">
                      Free Preview for this chapter
                    </FieldLabel>
                    <FieldDescription>
                      By checking this checkbox, students will be able to
                      preview this chapter for free.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </form>
      ) : (
        <div className={cn("text-sm mt-4", "text-muted-foreground italic")}>
          <p>
            This chapter is {initialChapterAccess ? "" : "not"} free for preview
          </p>
        </div>
      )}
    </div>
  );
};
