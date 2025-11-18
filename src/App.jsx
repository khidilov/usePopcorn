import { useEffect, useState } from "react";
import ErrorMessage from "./Error";
import StarsRating from "./StarsRating";
const key = "4afe83df";
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
          // setError(""); // Line 30
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
          )}{" "}
        </Container>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    </div>
  );
}

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumOfFoundItems({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

function Container({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelection }) {
  return (
    <ul className="list list-movies">
      {movies.length > 0
        ? movies.map((movie) => (
            <Movie movie={movie} onSelection={onSelection} key={movie.imdbID} />
          ))
        : null}
    </ul>
  );
}

function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [selectedItem, setSelectedItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const watchedUserRating = watched.find(
    (mov) => mov.imdbID === selectedId
  )?.userRating;
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setSelectedItem(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  const {
    Title: title,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
    imdbRating,
    Poster: poster,
  } = selectedItem;

  function addWatchedMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating,
      runtime: runtime.split(" ").at(0),
      userRating: Number(userRating),
    };
    onAddWatched(newWatchedMovie);
    onClose();
  }

  useEffect(() => {
    document.title = `Movie | ${title}`;

    return () => {
      if (!title) return;
      document.title = "usePopcorn";
    };
  }, [title]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClose}>
          &larr;
        </button>

        <img src={poster} alt={`Poster if ${title}`} />

        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>🌟</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {watched.some((mov) => mov.imdbID === selectedId) ? (
            <div>
              <p>You rated this movie with {watchedUserRating} stars</p>
            </div>
          ) : (
            <>
              <StarsRating
                amount={10}
                size="24px"
                color="#f9de37"
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button onClick={addWatchedMovie} className="btn-add">
                  + Add to your list
                </button>
              )}
            </>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring: {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function Movie({ movie, onSelection }) {
  return (
    <li onClick={() => onSelection(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

function WatchedStats({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} </span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
      </div>
    </li>
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

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
