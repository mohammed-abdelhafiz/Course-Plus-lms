"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/FileUpload";
import { MuxData } from "@/generated/prisma/client";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  muxData: MuxData | null;
  videoUrl: string | null;
  courseId: string;
  chapterId: string;
}

export const ChapterVideoForm = ({
  muxData,
  videoUrl,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const onSubmit = async (data: { videoUrl: string }) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
      toast.success("Course video updated successfully");
      toggleEditMode();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-muted rounded-md p-4">
      <div className="flex justify-between items-center">
        <span>Chapter Video</span>
        <Button variant="ghost" onClick={toggleEditMode} className="text-sm">
          {isEditing ? (
            <p>Cancel</p>
          ) : videoUrl ? (
            <>
              <Pencil className="w-4 h-4 mr-1" />
              Edit Video
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-1" />
              Upload Video
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Upload chapter video
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "text-sm mt-4",
            !videoUrl && "text-muted-foreground italic",
          )}
        >
          {!videoUrl ? (
            <div className="flex items-center justify-center h-60 bg-muted rounded-md border border-dashed border-muted-foreground/50">
              <Video className="w-10 h-10 text-muted-foreground" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <MuxPlayer
                playbackId={muxData?.playbackId || ""}
                className="w-full h-full rounded-md"
              />
            </div>
          )}
          {videoUrl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
              Videos take time to process and will appear here once ready. If it
              doesn&apos;t appear, try refreshing the page.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
