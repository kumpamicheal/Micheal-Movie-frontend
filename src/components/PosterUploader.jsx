import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PosterUploader = ({ onPosterUploaded, movieId }) => {
    const [posterFile, setPosterFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [posterData, setPosterData] = useState(null); // Holds uploaded poster data

    // Fetch current poster for the movie (if one exists)
    useEffect(() => {
        const fetchPoster = async () => {
            if (!movieId) return;
            try {
                const res = await api.get(`/posters/movie/${movieId}`);
                if (res.data) setPosterData(res.data); // expecting { _id, posterUrl }
            } catch (err) {
                console.error('No poster found or error fetching poster:', err.response?.data || err.message);
            }
        };

        fetchPoster();
    }, [movieId]);

    // Handle Upload
    const handleUpload = async () => {
        if (!posterFile) {
            alert('Please select a poster file first.');
            return;
        }
        if (!movieId) {
            alert('Movie ID is required to upload a poster.');
            return;
        }

        const formData = new FormData();
        formData.append('poster', posterFile); // must match multer field
        formData.append('movieId', movieId);

        try {
            setUploading(true);
            const res = await api.post('/posters/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPosterData(res.data); // expects { _id, posterUrl }
            onPosterUploaded(res.data.posterUrl);
            alert('Poster uploaded successfully!');
            setPosterFile(null); // reset selected file
        } catch (err) {
            console.error('Poster upload failed:', err.response || err.message);
            alert('Poster upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Handle Delete
    const handleDeletePoster = async () => {
        if (!posterData?._id) {
            alert('No poster to delete.');
            return;
        }

        try {
            await api.delete(`/posters/${posterData._id}`);
            alert('Poster deleted.');
            setPosterData(null); // remove from UI
        } catch (err) {
            console.error('Error deleting poster:', err.response || err.message);
            alert('Failed to delete poster');
        }
    };

    return (
        <div>
            <label>Upload Poster:</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files[0])}
            />
            <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !posterFile}
            >
                {uploading ? 'Uploading...' : 'Upload Poster'}
            </button>

            {/* Show current poster and delete option */}
            {posterData && (
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>Current Poster:</strong></p>
                    <img
                        src={posterData.posterUrl}
                        alt="Uploaded Poster"
                        style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                    />
                    <br />
                    <button
                        style={{ marginTop: '0.5rem', background: 'red', color: 'white' }}
                        onClick={handleDeletePoster}
                    >
                        Delete Poster
                    </button>
                </div>
            )}
        </div>
    );
};

export default PosterUploader;
