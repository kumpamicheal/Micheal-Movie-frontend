import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query')?.trim();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                setNotFound(true);
                return;
            }

            setLoading(true);
            setNotFound(false);
            setError(null);

            try {
                const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (Array.isArray(data?.movies) && data.movies.length > 0) {
                    setMovies(data.movies);
                } else {
                    setMovies([]);
                    setNotFound(true);
                }
            } catch (err) {
                console.error('Search error:', err);
                setError('Something went wrong while searching. Please try again later.');
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="search-results-page">
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : (
                <>
                    <h2 className="results-heading">
                        {query ? `Results for "${query}"` : 'No query provided'}
                    </h2>

                    {error && (
                        <p className="error-text">{error}</p>
                    )}

                    {notFound ? (
                        <p className="no-results-text">
                            {query
                                ? `No results found for "${query}".`
                                : 'Please enter a search query.'}
                        </p>
                    ) : (
                        <div className="movie-grid">
                            {movies.map((movie) => (
                                <Link
                                    to={`/movie/${movie._id}`}
                                    key={movie._id}
                                    className="movie-card-link"
                                >
                                    <div className="movie-card">
                                        <img
                                            src={movie.posterUrl || '/fallback-poster.jpg'}
                                            alt={movie.title || 'Untitled Movie'}
                                            className="movie-poster"
                                        />
                                        <h3 className="movie-title">{movie.title || 'Untitled'}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;
