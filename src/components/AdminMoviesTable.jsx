// src/components/AdminMoviesTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMoviesTable = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all movies
    const fetchMovies = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/movies"); // Adjust base URL if needed
            // Safely extract movies array from response
            setMovies(Array.isArray(res.data) ? res.data : res.data.movies || []);
            setLoading(false);
        } catch (err) {
            setError("Failed to load movies");
            setMovies([]); // Ensure movies is always an array
            setLoading(false);
        }
    };

    // Delete movie by ID
    const deleteMovie = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            await axios.delete(`/api/movies/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // if admin auth is required
                },
            });
            // Refresh after delete
            setMovies((prev) => prev.filter((movie) => movie._id !== id));
        } catch (err) {
            alert("Failed to delete movie");
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    if (loading) return <p>Loading movies...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Manage Movies</h2>
            {movies.length === 0 ? (
                <p>No movies found</p>
            ) : (
                <table border="1" cellPadding="8" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.map((movie) => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.genre}</td>
                            <td>
                                <button
                                    onClick={() => deleteMovie(movie._id)}
                                    style={{
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px"
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminMoviesTable;
