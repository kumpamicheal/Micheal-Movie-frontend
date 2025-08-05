import React from 'react';
import MovieCard from './MovieCard';
import './GenreSection.css';

const GenreSection = ({ genre, movies, sliderItems }) => {
    return (
        <section className="genre-section">
            <h2 className="genre-heading">{genre}</h2>
            <div className="movie-row">
                {movies.map((movie) => {
                    if (!movie) return null;

                    const match = sliderItems?.find(
                        (item) => item.title?.toLowerCase() === movie.title?.toLowerCase()
                    );

                    return (
                        <MovieCard
                            key={movie._id || movie.id}
                            movie={movie}
                            sliderMatch={match}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default GenreSection;
