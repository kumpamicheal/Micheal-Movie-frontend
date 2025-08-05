import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../MovieCard'; // ✅ Correct path

const GenrePage = () => {
    const { genre } = useParams();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/movies`);

                const data = await response.json();

                // ✅ Filter movies matching the genre (case-insensitive)
                const filtered = data.filter(movie =>
                    movie.genre?.toLowerCase() === genre.toLowerCase()
                );

                setMovies(filtered);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [genre]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ textTransform: 'capitalize' }}>{genre} Movies</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {movies.length > 0 ? (
                    movies.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))
                ) : (
                    <p>No movies found for this genre.</p>
                )}
            </div>
        </div>
    );
};

export default GenrePage;
