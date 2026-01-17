"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/catalogo?search=${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs mx-auto md:mx-0">
      <input
        type="text"
        placeholder="BUSCAR..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border-b border-current bg-transparent px-2 py-1 text-sm focus:outline-none placeholder:text-neutral-500 uppercase tracking-wider"
      />
      <button type="submit" className="absolute right-0 top-1 text-neutral-500 hover:text-current">
        <FaSearch size={14} />
      </button>
    </form>
  );
}