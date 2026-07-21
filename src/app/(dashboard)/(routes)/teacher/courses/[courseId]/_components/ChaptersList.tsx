"use client";
import { Chapter } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChaptersListProps {
  chapters: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersList = ({
  chapters,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  const [chaptersList, setChaptersList] = useState(chapters);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChaptersList(chapters);
  }, [chapters]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chaptersList);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChaptersList(items);

    const bulkOrderData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));
    onReorder(bulkOrderData);
  };

  if (!isMounted) return null;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chaptersList.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex items-center gap-x-2 bg-muted border border-muted rounded-md hover:bg-muted/50 transition-colors mb-4 text-sm",
                      chapter.isPublished &&
                        "border-primary/20 bg-primary/10 text-primary",
                    )}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-muted hover:bg-muted rounded-l-md transition",
                        chapter.isPublished &&
                          "border-r-primary/20 hover:bg-primary/20",
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>
                    <p>{chapter.title}</p>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && <Badge> Free</Badge>}
                      <Badge
                        className={cn(
                          "bg-primary/50",
                          chapter.isPublished &&
                            "bg-primary hover:bg-primary/80",
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(chapter.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
