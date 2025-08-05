import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard'; // Adjust path if needed

const Library = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // Replace this with your actual API or movie data logic
        axios.get('/api/movies')
            .then(res => setMovies(res.data))
            .catch(err => console.error('Error loading movies:', err));
    }, []);

    return (
        <div>
            <h2>All Movies</h2>
            <div className="movie-grid">
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Library;
