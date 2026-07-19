"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/FileUpload";
import { Attachment } from "@/generated/prisma/client";

interface AttachmentFormProps {
  attachments: Attachment[];
  courseId: string;
}

export const AttachmentForm = ({
  attachments,
  courseId,
}: AttachmentFormProps) => {
  const router = useRouter();

  const onSubmit = async (data: { url: string }) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, data);
      toast.success("Attachment added successfully");
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

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteAttachment = async (attachmentId: string) => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/attachments/${attachmentId}`,
      );
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete attachment");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="bg-muted rounded-md p-4">
      <div className="flex justify-between items-center">
        <span>Course attachments</span>
        <Button variant="ghost" onClick={toggleEditMode} className="text-sm">
          {isEditing ? (
            <p>Cancel</p>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-1" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Add anything your students need to complete or understand this
            course.
          </p>
        </div>
      ) : attachments.length === 0 ? (
        <p className="text-sm mt-2 italic text-muted-foreground">
          No attachments yet
        </p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              className="flex items-center mt-2 p-3 border border-primary/20 bg-primary/10 rounded-sm w-full"
              key={attachment.id}
            >
              <File className="w-4 h-4 mr-2 shrink-0" />
              <p className="text-sm line-clamp-1 text-ellipsis mr-4">
                {attachment.name}
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                disabled={deletingId === attachment.id}
                onClick={() => {
                  setDeletingId(attachment.id);
                  deleteAttachment(attachment.id);
                }}
              >
                {deletingId === attachment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
