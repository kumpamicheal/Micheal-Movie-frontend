import React from 'react';

const MovieCard = ({ movie, sliderMatch }) => {
    if (!movie || typeof movie !== 'object') return null;

    console.log("🎥 MovieCard movie data:", movie);

    const linkToMovie = sliderMatch?.linkToMovie || `/movie/${movie._id || movie.id || ''}`;
    const posterUrl = movie.poster || movie.posterUrl;
    const title = movie.title || 'Untitled';

    return (
        <a href={linkToMovie} style={{ textDecoration: 'none' }}>
            <div
                className="movie-card"
                style={{
                    cursor: 'pointer',
                    backgroundColor: '#2c2c2c',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column', // stack image and title vertically
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '320px', // slightly increased to make room for title
                    width: '200px',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '260px', // fixed height for image
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '10px',
                        }}
                    />
                ) : (
                    <p style={{ color: '#fff', textAlign: 'center' }}>No poster available</p>
                )}
                <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '16px' }}>{title}</h4>
            </div>
        </a>
    );
};


export default MovieCard;
