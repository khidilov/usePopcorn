import { useState, useEffect, useRef } from "react";
import { key } from "./App";
import { Loader } from "../components/Loader";
import StarsRating from "./StarsRating";

export function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [selectedItem, setSelectedItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const ratingSelections = useRef(0);

  useEffect(() => {
    if (userRating) ratingSelections.current++;
  }, [userRating]);

  const watchedUserRating = watched.find(
    (mov) => mov.imdbID === selectedId
  )?.userRating;
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
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
  useEffect(() => {
    const callback = (e) => {
      if (e.target.key === "Escape");
      onClose();
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onClose]);
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
      ratingSelections: ratingSelections,
    };
    onAddWatched(newWatchedMovie);
    onClose();
  }

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
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
