import { useEffect, useState } from "react";
import ErrorMessage from "./Error";
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
  const [watched, setWatched] = useState([]);
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
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
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
          if (err.code !== 20) setError(err.message);
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
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Container>
      </Main>
    </>
  );
}

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
