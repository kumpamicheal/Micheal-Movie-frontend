import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // ✅ Adjust the path if this file is elsewhere
import MovieCard from '../components/MovieCard'; // Adjust path if needed

const Library = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        api.get('/movies')
            .then(res => {
                console.log('Movies API response:', res.data);

                if (Array.isArray(res.data)) {
                    setMovies(res.data);
                } else if (res.data && Array.isArray(res.data.movies)) {
                    setMovies(res.data.movies);
                } else {
                    setMovies([]);
                    console.warn('Unexpected movies data format:', res.data);
                }
            })
            .catch(err => {
                console.error('Error loading movies:', err);
                setMovies([]);
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
