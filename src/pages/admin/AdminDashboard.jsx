import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [movies, setMovies] = useState([]); // Store fetched movies

    // ✅ Fetch movies on component mount
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                console.log('Movies fetched:', res.data);
                setMovies(res.data);
            } catch (err) {
                console.error('Failed to fetch movies:', err);
            }
        };

        fetchMovies();
    }, []);

    // Upload to Cloudinary unsigned
    const uploadToCloudinary = async (file, folder, resourceType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'YOUR_UNSIGNED_UPLOAD_PRESET'); // unsigned preset
        formData.append('folder', folder);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/${resourceType}/upload`,
            { method: 'POST', body: formData }
        );

        const data = await res.json();
        if (!data.secure_url) throw new Error('Upload failed');
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !genre || !posterFile || !videoFile) {
            setMessage('Please fill all fields.');
            return;
        }

        try {
            setUploading(true);
            setMessage('Uploading files...');

            // Upload poster
            const posterUrl = await uploadToCloudinary(posterFile, 'posters', 'image');

            // Upload video
            const videoUrl = await uploadToCloudinary(videoFile, 'movies', 'video');

            // Save to backend
            await api.post('/movies', {
                title,
                genre,
                posterUrl,
                videoUrl
            });

            setMessage('Movie uploaded successfully!');
            setTitle('');
            setGenre('');
            setPosterFile(null);
            setVideoFile(null);

            // ✅ Refresh movie list after upload
            const res = await api.get('/movies');
            setMovies(res.data);

        } catch (err) {
            console.error(err);
            setMessage('Error uploading movie.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
            <h1>Admin Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />

                <label>Genre</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />

                <label>Poster</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files[0])}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />

                <label>Video</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />

                <button
                    type="submit"
                    disabled={uploading}
                    style={{
                        background: '#007bff',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {uploading ? 'Uploading...' : 'Upload Movie'}
                </button>
            </form>

            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}

            {/* ✅ Display movies list */}
            {movies.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Uploaded Movies</h2>
                    <ul>
                        {movies.map((movie) => (
                            <li key={movie._id}>
                                <strong>{movie.title}</strong> — {movie.genre}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
