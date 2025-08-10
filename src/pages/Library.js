import React, { useState } from "react";
import MovieCard from "../../components/MovieCard";

import "./Library.css"; // optional styling

const Library = ({ movies }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10; // Number of movies per page

    // Sort by newest first (assuming createdAt exists)
    const sortedMovies = [...movies].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Pagination calculations
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

            {/* Pagination buttons */}
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
