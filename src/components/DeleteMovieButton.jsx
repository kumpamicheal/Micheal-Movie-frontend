// DeleteMovieButton.jsx
import React from "react";
import api from "../services/api"; // ✅ use your configured Axios instance

export default function DeleteMovieButton({ movieId, posterUrl, videoUrl, onDeleted }) {
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            // ✅ Delete poster file
            const posterPublicId = posterUrl.split('/').slice(-2).join('/').split('.')[0];
            await api.post('/admin/delete-file', { filePath: posterPublicId });

            // ✅ Delete video file
            const videoPublicId = videoUrl.split('/').slice(-2).join('/').split('.')[0];
            await api.post('/admin/delete-file', { filePath: videoPublicId });

            // ✅ Delete movie record from DB
            await api.delete(`/movies/${movieId}`);

            // ✅ Trigger parent refresh if provided
            if (onDeleted) onDeleted(movieId);
        } catch (err) {
            console.error("Error deleting movie:", err);
            alert("Failed to delete movie");
        }
    };

    return (
        <button
            style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
                marginTop: "8px",
                borderRadius: "4px"
            }}
            onClick={handleDelete}
        >
            Delete
        </button>
    );
}
