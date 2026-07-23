"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string | null;
  playbackId?: string | null;
  isLocked: boolean;
  completeOnEnd: boolean;
}
export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnded = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          },
        );
        if (!nextChapterId) {
          confetti.open();
        } else {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
        toast.success("Progress updated");
        router.refresh();
      }
    } catch {
      toast.error("Error updating progress");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 bg-foreground/90 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-background" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 bg-foreground/90 flex flex-col items-center justify-center gap-y-2">
          <Lock className="h-8 w-8 text-background" />
          <p className="text-background">This chapter is locked</p>
        </div>
      )}
      {!isLocked && playbackId && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => {
            setIsReady(true);
          }}
          onEnded={onEnded}
          autoPlay
        />
      )}
    </div>
  );
};
