// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // ✅ Use your configured axios instance
import GenreSection from '../components/GenreSection';
import Header from '../components/Header';
// import Library from './Library'; // ❌ Removed Library import
import './Home.css';

const Home = () => {
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [allMovies, setAllMovies] = useState([]); // ✅ Store all movies

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies'); // ✅ Use the correct api instance
                const movies = res.data;

                // ✅ Save all movies for Library
                setAllMovies(movies);

                // ✅ Group by genre for GenreSection
                const grouped = {};
                movies.forEach((movie) => {
                    const genre = movie.genre?.trim() || 'Unknown';
                    if (!grouped[genre]) {
                        grouped[genre] = [];
                    }
                    grouped[genre].push(movie);
                });

                setMoviesByGenre(grouped);
            } catch (err) {
                console.error('Error fetching movies:', err);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="home">
            <Header />
            <main style={{ padding: '20px', marginTop: '20px' }}>
                {Object.keys(moviesByGenre).length === 0 ? (
                    <p>No movies available.</p>
                ) : (
                    <>
                        {Object.entries(moviesByGenre).map(([genre, movies]) => (
                            <GenreSection
                                key={genre}
                                genre={genre}
                                movies={movies}
                            />
                        ))}

                        {/* ❌ Removed Library component */}
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;
