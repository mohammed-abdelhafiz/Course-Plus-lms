"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const SearchInput = () => {
  const [value, setVale] = useState("");
  const debouncedValue = useDebounce(value);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, pathname, router]);
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search for a course..."
        className="pl-9"
        value={value}
        onChange={(e) => setVale(e.target.value)}
      />
    </div>
  );
};
