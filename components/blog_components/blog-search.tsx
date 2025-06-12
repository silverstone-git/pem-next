"use client";

import type React from "react";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            pl-10 pr-10 h-12 w-64 rounded-full
            bg-white dark:bg-zinc-800
            border-zinc-300 dark:border-zinc-600
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-500 dark:placeholder:text-zinc-400
            focus:border-pink-500 dark:focus:border-pink-400
            focus:ring-pink-500 dark:focus:ring-pink-400
            transition-colors duration-200
            ${isFocused ? "ring-2 ring-pink-500/20 dark:ring-pink-400/20" : ""}
          `}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </form>
  );
}
