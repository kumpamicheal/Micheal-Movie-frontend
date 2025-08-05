// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GenreSection from '../components/GenreSection';
import Header from '../components/Header';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL + '/movies';


const Home = () => {
    const [moviesByGenre, setMoviesByGenre] = useState({});

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get(API_URL);
                const movies = res.data;

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

            {/* Add margin or padding here so the genres start below the header */}
            <main style={{ padding: '20px', marginTop: '20px' }}>
                {Object.keys(moviesByGenre).length === 0 ? (
                    <p>No movies available.</p>
                ) : (
                    Object.entries(moviesByGenre).map(([genre, movies]) => (
                        <GenreSection
                            key={genre}
                            genre={genre}
                            movies={movies}
                        />
                    ))
                )}
            </main>
        </div>
    );
};

export default Home;
