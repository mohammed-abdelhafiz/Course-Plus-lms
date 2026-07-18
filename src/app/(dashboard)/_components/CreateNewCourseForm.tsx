"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const CreateNewCourseForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", data);
      router.push(`/teacher/courses/${response.data.id}`);
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Name your course</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-course-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-title">Course Title</FieldLabel>
                <Input
                  {...field}
                  id="course-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Python for Complete Beginners"
                  disabled={isSubmitting}
                />
                <FieldDescription>
                  What will you teach in this course?
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Link
            href="/teacher/courses"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
            })}
          >
            Cancel
          </Link>
          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            size="lg"
            form="create-course-form"
          >
            Continue
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
