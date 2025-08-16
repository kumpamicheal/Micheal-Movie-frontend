import React from 'react';

const MovieCard = ({ movie, sliderMatch }) => {
    if (!movie || typeof movie !== 'object') return null;

    console.log("🎥 MovieCard movie data:", movie);

    const linkToMovie = sliderMatch?.linkToMovie || `/movie/${movie._id || movie.id || ''}`;
    const posterUrl = movie.poster || movie.posterUrl;
    const title = movie.title || 'Untitled';

    return (
        <a href={linkToMovie} style={{ textDecoration: 'none' }}>
            <div className="movie-card">
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={title}
                    />
                ) : (
                    <p style={{ color: '#fff', textAlign: 'center' }}>No poster available</p>
                )}
                <h4>{title}</h4>
            </div>
        </a>
    );
};

export default MovieCard;
