import { useEffect, useState } from "react";
import ErrorMessage from "./Error.jsx";
import { Main } from "./Main.1";
import { Loader } from "./Loader";
import { NavBar } from "./NavBar";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { NumOfFoundItems } from "./NumOfFoundItems";
import { Container } from "./Container";
import { MoviesList } from "./MoviesList";
import { MovieDetails } from "./MovieDetails";
import { WatchedStats } from "./WatchedStats";
import { WatchedMoviesList } from "./WatchedMoviesList";
export const key = "4afe83df";
export default function App() {
  const [watched, setWatched] = useState(() => {
    const storedVal = localStorage.getItem("watched");
    return JSON.parse(storedVal);
  });
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("Leon");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelection(id) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((movies) => [...movies, movie]);
  }

  function deleteFromWatchedList(id) {
    return setWatched((c) => {
      return c.filter((mov) => mov.imdbID !== id);
    });
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

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
          // setError("");
          setIsLoading(true);
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
          setError(""); // Line 47
        } catch (err) {
          if (err.message !== "AbortError") {
            setError(err.message);
            console.error(err);
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
  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <NumOfFoundItems movies={movies} />
      </NavBar>
      <Main>
        <Container>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList onSelection={handleSelection} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Container>

        <Container>
          {selectedId ? (
            <MovieDetails
              onSelect={handleSelection}
              onClose={handleCloseMovie}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedStats watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDelete={deleteFromWatchedList}
              />
            </>
          )}
        </Container>
      </Main>
    </>
  );
}
