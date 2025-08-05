import React from 'react';
import { useParams } from 'react-router-dom';

const movies = [
    { _id: 1, title: 'Movie A', genre: 'horror', posterUrl: 'https://via.placeholder.com/150x225?text=Movie+A' },
    { _id: 2, title: 'Movie B', genre: 'comedy', posterUrl: 'https://via.placeholder.com/150x225?text=Movie+B' },
    { _id: 3, title: 'Movie C', genre: 'action', posterUrl: 'https://via.placeholder.com/150x225?text=Movie+C' },
    { _id: 4, title: 'Movie D', genre: 'drama', posterUrl: 'https://via.placeholder.com/150x225?text=Movie+D' },
    { _id: 5, title: 'Movie E', genre: 'romance', posterUrl: 'https://via.placeholder.com/150x225?text=Movie+E' },
    { _id: 6, title: 'Movie F', genre: 'sci-fi', posterUrl: 'https://via.placeholder.com/150x225?text=Movie+F' },
    // Add more movie objects here as needed
];

const Library = () => {
    const { genre } = useParams(); // e.g. "horror", "action", etc.

    // If genre param exists, filter by it (case insensitive), otherwise show all movies
    const filteredMovies = genre
        ? movies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase())
        : movies;

    return (
        <div>
            <h2>{genre ? `Genre: ${genre.charAt(0).toUpperCase() + genre.slice(1)}` : 'All Movies'}</h2>
            <div className="movie-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {filteredMovies.length > 0 ? (
                    filteredMovies.map(movie => (
                        <div key={movie._id} className="movie-card" style={{ width: '150px' }}>
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                style={{ width: '100%', height: '225px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <h3 style={{ fontSize: '1rem', marginTop: '8px', textAlign: 'center' }}>{movie.title}</h3>
                        </div>
                    ))
                ) : (
                    <p>No movies found for this genre.</p>
                )}
            </div>
        </div>
    );
};

export default Library;
