import { useState, useEffect } from "react";

export const key = "4afe83df";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovieData() {
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }

        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Oops you lost your connection");
          }

          const data = await res.json();
          if (data.Response === "False") {
            setMovies([]);
            throw new Error("Are you sure about the name?");
          }

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log({ err });
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovieData();

      return () => {
        controller.abort();
      };
    },
    [query]
  );
  return { isLoading, movies, error };
}
