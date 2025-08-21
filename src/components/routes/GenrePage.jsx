import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../MovieCard';
import './GenrePage.css';

const GenrePage = () => {
    const { genre } = useParams();
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 12; // ✅ Number of movies per page

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/movies`);
                const data = await response.json();

                // ✅ Filter by genre
                const filtered = data.filter(movie =>
                    movie.genre?.toLowerCase() === genre.toLowerCase()
                );

                // ✅ Sort by newest first
                const sorted = filtered.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setMovies(sorted);
                setCurrentPage(1); // Reset to first page when genre changes
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [genre]);

    // ✅ Pagination logic
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(movies.length / moviesPerPage);

    return (
        <div className="genre-page">
            <h2 style={{ textTransform: 'capitalize' }}>{genre} Movies</h2>

            <div className="genre-movies-grid">
                {currentMovies.length > 0 ? (
                    currentMovies.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))
                ) : (
                    <p>No movies found for this genre.</p>
                )}
            </div>

            {/* ✅ Pagination Controls */}
            {totalPages > 1 && (
                <div className="genre-pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default GenrePage;

