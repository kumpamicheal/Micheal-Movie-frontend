import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import './GenreSection.css';

const GenreSection = ({ genre, movies, sliderItems }) => {
    const navigate = useNavigate();

    return (
        <section className="genre-section">
            <div className="genre-header">
                {/* Display genre name in uppercase */}
                <h2 className="genre-heading">{genre.toUpperCase()}</h2>
                <button
                    className="view-all-btn"
                    onClick={() => navigate(`/genre/${genre.toLowerCase()}`)}
                >
                    View All →
                </button>
            </div>

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
