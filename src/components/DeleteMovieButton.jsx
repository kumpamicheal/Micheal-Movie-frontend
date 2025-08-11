import React from "react";
import axios from "axios";

export default function DeleteMovieButton({ movieId, posterUrl, videoUrl, onDeleted }) {
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            await axios.delete(`/api/movies/${movieId}`, {
                data: { posterUrl, videoUrl }
            });

            // Optional: callback to parent so it can refresh list
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
