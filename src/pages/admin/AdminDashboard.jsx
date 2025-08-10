import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [poster, setPoster] = useState(null);
    const [video, setVideo] = useState(null);

    // ✅ Fetch movies from backend
    useEffect(() => {
        fetch("http://localhost:5000/movies")
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

    // ✅ Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!poster || !video) {
            return alert("Please select both poster and video");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("genre", genre);
        formData.append("poster", poster);
        formData.append("video", video);

        try {
            const res = await fetch("http://localhost:5000/movies", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Movie added successfully!");
                const newMovie = await res.json();
                setMovies([...movies, newMovie]);
                setTitle("");
                setGenre("");
                setPoster(null);
                setVideo(null);
            } else {
                alert("Failed to add movie");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding movie");
        }
    };

    // ✅ Delete movie
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;

        try {
            const res = await fetch(`http://localhost:5000/movies/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMovies(movies.filter((movie) => movie._id !== id));
                alert("Movie deleted successfully");
            } else {
                alert("Failed to delete movie");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting movie");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            {/* Upload form */}
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
                <button type="submit">Add Movie</button>
            </form>

            <hr />

            {/* Movie list */}
            <h2>Movie List</h2>
            {movies.length === 0 ? (
                <p>No movies found</p>
            ) : (
                <table border="1" cellPadding="8">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Poster</th>
                        <th>Video</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.map((movie) => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.genre}</td>
                            <td>
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    width="80"
                                />
                            </td>
                            <td>
                                <video width="120" controls>
                                    <source src={movie.videoUrl} type="video/mp4" />
                                </video>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(movie._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
