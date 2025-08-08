import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import PosterUploader from '../../components/PosterUploader';

const AdminDashboard = () => {
    const { isAdmin, user } = useContext(AuthContext);
    const token = user?.token;

    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [video, setVideo] = useState(null);
    const [createdMovie, setCreatedMovie] = useState(null);
    const [movies, setMovies] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch (err) {
            console.error('❌ Failed to fetch movies:', err);
        }
    };

    // ✅ UPDATED: Movie Upload (removed /movies/sign)
    const handleUploadMovie = async (e) => {
        e.preventDefault();
        console.log("📤 Upload Movie button clicked");

        if (!title || !genre || !video) {
            alert('❗ Title, genre, and video are required');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('genre', genre);
            formData.append('video', video);

            setUploadProgress(0);

            const res = await api.post('/movies', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`📤 Upload progress: ${percent}%`);
                    setUploadProgress(percent);
                },
            });

            const movieData = res.data;

            if (!movieData || !movieData._id) {
                throw new Error('❌ No _id returned for created movie');
            }

            alert('✅ Movie uploaded successfully!');
            setCreatedMovie(movieData);
            setTitle('');
            setGenre('');
            setVideo(null);
            setUploadProgress(0);
            fetchMovies();
        } catch (err) {
            console.error('❌ Movie upload failed:', err.response?.data || err.message);
            alert('❌ Movie upload failed: ' + (err.response?.data?.error || err.message));
            setUploadProgress(0);
        }
    };

    const handleDeleteVideo = async (movieId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        try {
            await api.delete(`/movies/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('🗑️ Video deleted successfully!');
            setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
        } catch (err) {
            console.error('❌ Deletion failed:', err);
            alert('❌ Failed to delete video');
        }
    };

    const handleDeletePoster = async (movieId, posterPublicId) => {
        if (!window.confirm('Are you sure you want to delete this poster?')) return;
        try {
            await api.delete('/posters/delete', {
                data: { movieId, posterPublicId },
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('🗑️ Poster deleted successfully!');
            fetchMovies();
        } catch (err) {
            console.error('❌ Failed to delete poster:', err);
            alert('❌ Failed to delete poster');
        }
    };

    const handlePosterUploaded = () => {
        setCreatedMovie(null);
        fetchMovies();
    };

    if (!isAdmin) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to access the admin dashboard.</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {!createdMovie ? (
                <form onSubmit={handleUploadMovie}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            console.log("🎥 File selected:", e.target.files[0]);
                            setVideo(e.target.files[0]);
                        }}
                        required
                    />
                    <button type="submit">Upload Movie</button>

                    {/* Upload progress bar */}
                    {uploadProgress > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <div style={{
                                width: '100%',
                                backgroundColor: '#eee',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${uploadProgress}%`,
                                    backgroundColor: '#4caf50',
                                    height: '10px',
                                    transition: 'width 0.4s ease-in-out'
                                }} />
                            </div>
                            <p>{uploadProgress}%</p>
                        </div>
                    )}
                </form>
            ) : (
                createdMovie._id ? (
                    <div style={{ marginTop: '1rem' }}>
                        <h3>Upload Poster for: {createdMovie.title}</h3>
                        <PosterUploader
                            movieId={createdMovie._id}
                            onPosterUploaded={handlePosterUploaded}
                        />
                        <button
                            onClick={() => setCreatedMovie(null)}
                            style={{ marginTop: '10px' }}
                        >
                            Cancel Poster Upload
                        </button>
                    </div>
                ) : (
                    <p style={{ color: 'red' }}>❌ Cannot upload poster: Invalid or missing movie ID.</p>
                )
            )}

            <div className="movie-list" style={{ marginTop: '2rem' }}>
                <h3>Uploaded Movies</h3>
                {movies.map((movie) => (
                    <div key={movie._id} className="movie-item" style={{ marginBottom: '20px' }}>
                        <h4>{movie.title}</h4>
                        <p>Genre: {movie.genre}</p>

                        {movie.posterUrl && (
                            <>
                                <img
                                    src={movie.posterUrl}
                                    alt="Poster"
                                    style={{
                                        width: '200px',
                                        borderRadius: '5px',
                                        display: 'block',
                                        marginBottom: '10px',
                                    }}
                                />
                                {movie.posterPublicId && (
                                    <button
                                        onClick={() =>
                                            handleDeletePoster(movie._id, movie.posterPublicId)
                                        }
                                        style={{ marginBottom: '10px' }}
                                    >
                                        Delete Poster
                                    </button>
                                )}
                            </>
                        )}

                        <video width="320" height="240" controls>
                            <source src={movie.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <button
                            onClick={() => handleDeleteVideo(movie._id)}
                            style={{ marginTop: '10px' }}
                        >
                            Delete Video
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
