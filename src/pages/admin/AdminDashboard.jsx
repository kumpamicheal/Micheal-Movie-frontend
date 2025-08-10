// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminMoviesTable from '../../components/AdminMoviesTable';

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [poster, setPoster] = useState(null);
    const [video, setVideo] = useState(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch (err) {
            console.error('Failed to fetch movies:', err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !genre || !poster || !video) {
            alert('All fields are required including video');
            return;
        }

        try {
            // Log environment variables
            console.log("Cloudinary Cloud Name:", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
            console.log("Cloudinary Upload Preset:", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

            // ✅ 1. Upload poster
            const posterData = new FormData();
            posterData.append('file', poster);
            posterData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

            console.log("Uploading Poster to:", `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`);

            const posterRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: posterData }
            );
            const posterJson = await posterRes.json();
            console.log("Poster Upload Response:", posterJson);

            // ✅ 2. Upload video
            const videoData = new FormData();
            videoData.append('file', video);
            videoData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

            console.log("Uploading Video to:", `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload`);

            const videoRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload`,
                { method: 'POST', body: videoData }
            );
            const videoJson = await videoRes.json();
            console.log("Video Upload Response:", videoJson);

            // ✅ 3. Save to backend
            await api.post('/movies', {
                title,
                genre,
                posterUrl: posterJson.secure_url,
                videoUrl: videoJson.secure_url
            });

            alert('Upload successful!');
            setTitle('');
            setGenre('');
            setPoster(null);
            setVideo(null);
            fetchMovies();
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed: ' + err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Admin Dashboard</h2>

            {/* Upload Form */}
            <form onSubmit={handleUpload} style={styles.form}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPoster(e.target.files[0])}
                    style={styles.input}
                />
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Upload</button>
            </form>

            {/* Uploaded Movies */}
            <h3>Uploaded Movies</h3>
            <AdminMoviesTable
                movies={movies}
                onDelete={(id) => setMovies(movies.filter(movie => movie._id !== id))}
            />

        </div>
    );
};

const styles = {
    container: { padding: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' },
    input: { padding: '10px', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
    card: { border: '1px solid #ccc', padding: '10px', borderRadius: '8px' },
    poster: { width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' },
};

export default AdminDashboard;
