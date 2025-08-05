import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard'; // Adjust path if needed

const Library = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('/api/movies')
            .then(res => {
                console.log('Movies API response:', res.data);

                // Check if res.data is an array
                if (Array.isArray(res.data)) {
                    setMovies(res.data);
                } else if (res.data && Array.isArray(res.data.movies)) {
                    // If data is an object with a "movies" array
                    setMovies(res.data.movies);
                } else {
                    // If structure unknown or no array found, clear movies
                    setMovies([]);
                    console.warn('Unexpected movies data format:', res.data);
                }
            })
            .catch(err => {
                console.error('Error loading movies:', err);
                setMovies([]); // clear on error
            });
    }, []);

    return (
        <div>
            <h2>All Movies</h2>
            <div className="movie-grid">
                {Array.isArray(movies) && movies.length > 0 ? (
                    movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <p>No movies to display.</p>
                )}
            </div>
        </div>
    );
};

export default Library;
