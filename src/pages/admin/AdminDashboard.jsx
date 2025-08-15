// AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import DeleteMovieButton from '../../components/DeleteMovieButton';
import { uploadMediaToCloudinary } from "../../utils/cloudinaryUpload"; // ✅ updated import

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [poster, setPoster] = useState(null);
    const [video, setVideo] = useState(null);
    const [movies, setMovies] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({ poster: 0, video: 0 });

    const posterInputRef = useRef(null);
    const videoInputRef = useRef(null);

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
            // ✅ Upload poster + video together with progress tracking
            const { posterURL, videoURL } = await uploadMediaToCloudinary(
                poster,
                video,
                title,
                genre,
                (progress) => setUploadProgress((prev) => ({ ...prev, ...progress }))
            );


            // ✅ Save to backend
            await api.post('/movies', {
                title,
                genre,
                posterUrl: posterURL,
                videoUrl: videoURL
            });

            alert('Upload successful!');
            setTitle('');
            setGenre('');
            setPoster(null);
            setVideo(null);
            setUploadProgress({ poster: 0, video: 0 });

            if (posterInputRef.current) posterInputRef.current.value = "";
            if (videoInputRef.current) videoInputRef.current.value = "";

            fetchMovies();
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed: ' + err.message);
            setUploadProgress({ poster: 0, video: 0 });
        }
    };

    const removeMovieFromUI = (deletedId) => {
        setMovies((prev) => prev.filter(movie => movie._id !== deletedId));
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
                    ref={posterInputRef}
                    onChange={(e) => setPoster(e.target.files[0])}
                    style={styles.input}
                />
                <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={(e) => setVideo(e.target.files[0])}
                    style={styles.input}
                />
                {uploadProgress.poster > 0 && <div>Uploading Poster: {uploadProgress.poster}%</div>}
                {uploadProgress.video > 0 && <div>Uploading Video: {uploadProgress.video}%</div>}
                <button type="submit" style={styles.button}>Upload</button>
            </form>

            {/* Uploaded Movies */}
            <h3>Uploaded Movies</h3>
            <div style={styles.grid}>
                {movies.map((movie) => (
                    <div key={movie._id} style={styles.card}>
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            style={styles.poster}
                        />
                        <h4>{movie.title}</h4>
                        <p>{movie.genre}</p>

                        <DeleteMovieButton
                            movieId={movie._id}
                            posterUrl={movie.posterUrl}
                            videoUrl={movie.videoUrl}
                            onDeleted={removeMovieFromUI}
                        />
                    </div>
                ))}
            </div>
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
