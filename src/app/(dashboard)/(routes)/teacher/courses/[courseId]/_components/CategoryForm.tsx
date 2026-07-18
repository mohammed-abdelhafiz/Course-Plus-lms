"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Category } from "@/generated/prisma/client";

interface CategoryFormProps {
  initialCategoryId: string | null;
  courseId: string;
  categories: Category[];
}

export const CategoryForm = ({
  initialCategoryId,
  courseId,
  categories,
}: CategoryFormProps) => {
  const router = useRouter();

  const onSubmit = async (categoryId: string | undefined) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, { categoryId });
      toast.success("Category updated successfully");
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

  const category = categories.find((cat) => cat.id === initialCategoryId);

  function getCategoryId(value: string) {
    return categories.find((cat) => cat.name === value)?.id;
  }

  const [selectedCategory, setSelectedCategory] = useState(
    category?.name || "",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategory(category?.name ?? "");
  }, [category]);

  return (
    <div className="bg-muted rounded-md p-4">
      <div className="flex justify-between items-center">
        <span>Course category</span>
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
        <Combobox
          items={categories}
          value={selectedCategory}
          onValueChange={(value) => {
            if (value) {
              setSelectedCategory(value);
              onSubmit(getCategoryId(value));
            }
          }}
        >
          <ComboboxInput placeholder="Select category" className="mt-2" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(category) => (
                <ComboboxItem key={category.id} value={category.name}>
                  {category.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      ) : (
        <p
          className={cn(
            "text-sm mt-4",
            !initialCategoryId && "text-muted-foreground italic",
          )}
        >
          {category?.name || "No category"}
        </p>
      )}
    </div>
  );
};
