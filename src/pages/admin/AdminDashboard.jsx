import React, { useState, useEffect } from "react";
import api from "../api"; // Axios instance pointing to your backend

export default function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [poster, setPoster] = useState(null);
    const [video, setVideo] = useState(null);

    // Fetch all movies for admin
    const fetchMovies = async () => {
        try {
            const res = await api.get("/movies");
            setMovies(res.data);
        } catch (err) {
            console.error("Error fetching movies", err);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // Handle new movie upload
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!poster || !video) {
            return alert("Please select both a poster and a video file");
        }

        const token = localStorage.getItem("token");
        if (!token) {
            return alert("You must be logged in as admin");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("genre", genre);
        formData.append("poster", poster);
        formData.append("video", video);

        try {
            await api.post("/movies", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Movie uploaded successfully!");
            setTitle("");
            setGenre("");
            setPoster(null);
            setVideo(null);
            fetchMovies();
        } catch (err) {
            console.error("Error uploading movie", err);
            alert("Failed to upload movie");
        }
    };

    // Delete movie
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            return alert("You must be logged in as admin");
        }

        try {
            await api.delete(`/movies/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Movie deleted successfully");
            fetchMovies();
        } catch (err) {
            console.error("Error deleting movie", err);
            alert("Failed to delete movie");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            {/* Movie Upload Form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <br />
                <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
                <br />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPoster(e.target.files[0])}
                    required
                />
                <br />
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    required
                />
                <br />
                <button type="submit">Upload Movie</button>
            </form>

            {/* Movie List with Delete Option */}
            <h2>Uploaded Movies</h2>
            <ul>
                {movies.map((movie) => (
                    <li key={movie._id}>
                        <strong>{movie.title}</strong> - {movie.genre}
                        <br />
                        <img src={movie.posterUrl} alt={movie.title} width="100" />
                        <br />
                        <button onClick={() => handleDelete(movie._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
