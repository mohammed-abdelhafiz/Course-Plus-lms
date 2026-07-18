"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FileUpload } from "@/components/FileUpload";

interface ImageFormProps {
  initialImageUrl: string | null;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string(),
});

export const ImageForm = ({ initialImageUrl, courseId }: ImageFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialImageUrl ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("Course image updated successfully");
      toggleEditMode();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };


  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="bg-muted rounded-md p-4">
      <div className="flex justify-between items-center">
        <span>Course Image</span>
        <Button variant="ghost" onClick={toggleEditMode} className="text-sm">
          {isEditing ? (
            <p>Cancel</p>
          ) : initialImageUrl ? (
            <>
              <Pencil className="w-4 h-4 mr-1" />
              Edit Image
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-1" />
              Upload Image
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                form.setValue("imageUrl", url);
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            16:9 aspect ratio recommended
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "text-sm mt-4",
            !initialImageUrl && "text-muted-foreground italic",
          )}
        >
          {initialImageUrl ? (
            <div className="relative aspect-video mt-2">
              <Image
                src={initialImageUrl}
                alt="Course image"
                fill
                className="rounded-md object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 bg-muted rounded-md border border-dashed border-muted-foreground/50">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
