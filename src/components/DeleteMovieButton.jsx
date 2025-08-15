import React from "react";
import api from "../services/api"; // ✅ use your configured Axios instance

export default function DeleteMovieButton({ movieId, posterPublicId, videoPublicId, onDeleted }) {
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            // ✅ Delete poster file
            if (posterPublicId) {
                await api.post('/admin/delete-file', { public_id: posterPublicId });
            }

            // ✅ Delete video file
            if (videoPublicId) {
                await api.post('/admin/delete-file', { public_id: videoPublicId });
            }

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
