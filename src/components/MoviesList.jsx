import { Movie } from "./Movie";

export function MoviesList({ movies, onSelection }) {
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
