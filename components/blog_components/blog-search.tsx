"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onSearch } from "@/lib/search"; // assumed to return Promise<Blog[]>
import { Blog } from "@/lib/models";
import BlogCardSearch from "./blog_card_client";
import LoadingCard from "@/components/loading_card";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true); // Set loading to true before search
      try {
        const res = await onSearch(query.trim());
        setResults(res || []);
      } finally {
        setIsLoading(false); // Set loading to false after search completes
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
  };

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
        handleClear();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Dark overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setIsExpanded(false);
            handleClear();
          }}
        />
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className={`z-50 fixed ${
          isExpanded
            ? "inset-x-4 top-20 sm:top-32"
            : "bottom-4 right-4 w-fit sm:static"
        } transition-all duration-300 ease-in-out ${
          isExpanded ? "max-w-xl mx-auto" : ""
        } ${className}`}
      >
        <div
          className={`relative flex items-center ${
            isExpanded
              ? "w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-lg p-4"
              : "bg-white dark:bg-zinc-800 rounded-full px-4 py-2 shadow"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          <Search className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`bg-white dark:bg-zinc-800 ml-3 border-none focus:outline-none focus:ring-0 text-sm sm:text-base flex-1 ${
              !isExpanded ? "w-24 sm:w-40" : "w-full"
            }`}
            autoFocus={isExpanded}
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Results
          getTitleFromContent(res.content)
          */}
        {isExpanded &&
          isLoading &&
          results.length === 0 && ( // Render LoadingCard when loading and no results
            <div className="mt-3 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow max-h-60 overflow-auto">
              <LoadingCard />
            </div>
          )}

        {isExpanded && results.length > 0 && (
          <div className="mt-3 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow max-h-60 overflow-auto mb-28">
            {results.map((blog) => (
              <BlogCardSearch key={blog.blogId} blog={blog} />
            ))}
          </div>
        )}
      </form>
    </>
  );
}
