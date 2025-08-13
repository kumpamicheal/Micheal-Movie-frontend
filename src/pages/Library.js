// src/pages/Library.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Library = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/movies/paginated?page=${page}&limit=8`);
                console.log("Fetched movies:", res.data.movies); // Debug API response
                setMovies(res.data.movies);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Movie Library</h1>

            {loading && <p>Loading movies...</p>}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px'
                }}
            >
                {movies.map((movie, idx) => {
                    try {
                        console.log("Rendering movie:", movie); // Debug each movie

                        return (
                            <div
                                key={movie._id || idx}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    textAlign: 'center'
                                }}
                            >
                                {movie.posterUrl && (
                                    <img
                                        src={String(movie.posterUrl)}
                                        alt={String(movie.title || 'Movie Poster')}
                                        style={{ width: '100%', borderRadius: '8px' }}
                                    />
                                )}

                                <h3>{String(movie.title || '')}</h3>
                                <p>{String(movie.genre || '')}</p>
                            </div>
                        );
                    } catch (err) {
                        console.error("Error rendering movie:", movie, err);
                        return (
                            <div key={`error-${idx}`} style={{ color: 'red' }}>
                                Error rendering this movie. Check console for details.
                            </div>
                        );
                    }
                })}
            </div>

            {/* Pagination Controls */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span style={{ margin: '0 10px' }}>
                    Page {page} of {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Library;
