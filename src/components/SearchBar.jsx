import { useEffect, useRef } from "react";

export function SearchBar({ query, setQuery }) {
  const searchBarEl = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement !== searchBarEl.current) {
        if (e.code === "Enter") {
          searchBarEl.current.focus();
          setQuery("");
        }
      }
    }
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);
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
