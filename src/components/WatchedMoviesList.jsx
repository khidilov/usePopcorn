import { WatchedMovie } from "./WatchedMovie";

export function WatchedMoviesList({ watched, setWatched }) {
  function deleteMovieFromList(id) {
    console.log({ id });
    setWatched((c) => {
      c.filter((mov) => mov.imdbID !== id);
    });
  }

  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDelete={deleteMovieFromList}
        />
      ))}
    </ul>
  );
}
