// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://micheal-movie-backend.onrender.com/api";

export default function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [poster, setPoster] = useState(null);
    const [video, setVideo] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/movies`);
            setMovies(res.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const handleCreateMovie = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("You are not authorized. Please log in as admin.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (poster) formData.append("poster", poster);
        if (video) formData.append("video", video);

        try {
            await axios.post(`${API_BASE_URL}/movies`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Movie added successfully!");
            setTitle("");
            setDescription("");
            setPoster(null);
            setVideo(null);
            fetchMovies();
        } catch (error) {
            console.error("Error creating movie:", error);
            alert("Failed to add movie. Check console for details.");
        }
    };

    const handleDeleteMovie = async (id) => {
        if (!token) {
            alert("You are not authorized.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/movies/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMovies();
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            {/* Form to add a new movie */}
            <form onSubmit={handleCreateMovie} style={{ marginBottom: "30px" }}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Movie Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPoster(e.target.files[0])}
                />
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                />
                <button type="submit">Add Movie</button>
            </form>

            {/* List of movies */}
            <div>
                <h2>Existing Movies</h2>
                {movies.length === 0 ? (
                    <p>No movies found.</p>
                ) : (
                    movies.map((movie) => (
                        <div key={movie._id} style={{ marginBottom: "15px" }}>
                            <h3>{movie.title}</h3>
                            <p>{movie.description}</p>
                            {movie.poster && (
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    style={{ width: "150px", display: "block" }}
                                />
                            )}
                            <button onClick={() => handleDeleteMovie(movie._id)}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
