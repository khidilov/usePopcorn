import { useEffect, useRef } from "react";
import { useKey } from "../hooks/useKey";

export function SearchBar({ query, setQuery }) {
  const searchBarEl = useRef(null);

  useKey(
    "Enter",
    function () {
      if (document.activeElement !== searchBarEl.current) {
        searchBarEl.current.focus();
        setQuery("");
      }
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={searchBarEl}
    />
  );
}
