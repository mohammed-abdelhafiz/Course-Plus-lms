"use client";

import { Category } from "@/generated/prisma/client";

import {
  FcEngineering,
  FcMusic,
  FcFilmReel,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import type { IconType } from "react-icons";
import { CategoryItem } from "./CategoryItem";

const iconMap: Record<Category["name"], IconType> = {
  "Computer Science": FcMultipleDevices,
  Business: FcSalesPerformance,
  Music: FcMusic,
  Filming: FcFilmReel,
  Photography: FcOldTimeCamera,
  Engineering: FcEngineering,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
};

interface CategoriesProps {
  items: Category[];
}

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
