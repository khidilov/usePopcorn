import { useState } from "react";
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
import { useMovies } from "../hooks/useMovies.jsx";
import { useLocaleStorageState } from "../hooks/useLocaleStorageState.jsx";

export const key = "4afe83df";

export default function App() {
  const [query, setQuery] = useState("Leon");
  const [watched, setWatched] = useLocaleStorageState([], "watched");
  const { movies, error, isLoading } = useMovies(query);

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
