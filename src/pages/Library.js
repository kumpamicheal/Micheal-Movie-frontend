import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "./Library.css";

const Library = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10;

    useEffect(() => {
        // Fetch all movies from your backend
        fetch("https://your-backend-url.onrender.com/api/movies")
            .then(res => res.json())
            .then(data => setMovies(data))
            .catch(err => console.error("Error fetching movies:", err));
    }, []);

    // Sort newest first
    const sortedMovies = [...movies].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);

    return (
        <section className="library-section">
            <h2 className="library-heading">Library</h2>
            <div className="movie-grid">
                {currentMovies.map((movie) => (
                    <MovieCard key={movie._id || movie.id} movie={movie} />
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Library;
