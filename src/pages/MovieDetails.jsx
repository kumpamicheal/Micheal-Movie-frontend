import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { openExternalUrl } from '../utils/openExternal'; // ✅ new import

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/movies/${id}`);
                setMovie(res.data);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError('Failed to load movie details.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const handleDownload = () => {
        if (!movie?.videoUrl) {
            alert("No download link found");
            return;
        }
        // ✅ Open the Cloudinary URL in system browser
        openExternalUrl(movie.videoUrl);
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    if (!movie) return <p style={{ textAlign: 'center' }}>Movie not found.</p>;

    const genres = Array.isArray(movie.genre)
        ? movie.genre
        : movie.genre
            ? [movie.genre]
            : [];

    return (
        <div
            style={{
                maxWidth: 700,
                margin: '2rem auto',
                padding: '1rem',
                boxShadow: '0 0 15px #ddd',
                borderRadius: 8,
                textAlign: 'center',
            }}
        >
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{movie.title}</h1>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                }}
            >
                {genres.length > 0 ? (
                    genres.map((g, idx) => (
                        <span
                            key={idx}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                            }}
                        >
                            {g}
                        </span>
                    ))
                ) : (
                    <span style={{ fontStyle: 'italic', color: '#666' }}>
                        Genre not available
                    </span>
                )}
            </div>

            {movie.videoUrl && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                    }}
                >
                    <video
                        controls
                        src={movie.videoUrl}
                        style={{ maxWidth: '100%', borderRadius: 8, backgroundColor: '#000' }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        backgroundColor: '#007bff',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        color: 'white',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    ← Back
                </button>
                <button
                    onClick={handleDownload}
                    style={{
                        backgroundColor: '#28a745',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        color: 'white',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    ⬇ Download
                </button>
            </div>
        </div>
    );
};

export default MovieDetails;
