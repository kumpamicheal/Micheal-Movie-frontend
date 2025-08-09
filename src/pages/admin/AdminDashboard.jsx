import React, { useState, useEffect } from "react";
import api from "../api"; // your axios instance
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [video, setVideo] = useState(null);
    const [poster, setPoster] = useState(null);
    const [movies, setMovies] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [createdMovie, setCreatedMovie] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get("/movies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovies(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch movies:", err);
        }
    };

    const handleVideoSelect = (e) => {
        setVideo(e.target.files[0]);
        console.log("🎥 File selected:", e.target.files[0]);
    };

    const handlePosterSelect = (e) => {
        setPoster(e.target.files[0]);
        console.log("🖼 Poster selected:", e.target.files[0]);
    };

    const handleUploadMovie = async (e) => {
        e.preventDefault();
        console.log("📤 Upload Movie button clicked");

        if (!title || !genre || !video) {
            alert("❗ Title, genre, and video are required");
            return;
        }

        try {
            // Step 1 — Upload video to Cloudinary (unsigned)
            const cloudName = "YOUR_CLOUD_NAME"; // change this
            const uploadPreset = "YOUR_UNSIGNED_PRESET"; // change this

            const formData = new FormData();
            formData.append("file", video);
            formData.append("upload_preset", uploadPreset);
            formData.append("resource_type", "video");

            setUploadProgress(0);

            const cloudinaryUpload = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
                );

                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded * 100) / event.total);
                        setUploadProgress(percent);
                        console.log(`📤 Upload progress: ${percent}%`);
                    }
                });

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error("❌ Failed to upload to Cloudinary"));
                    }
                };

                xhr.onerror = () => reject(new Error("❌ Network error"));

                xhr.send(formData);
            });

            if (!cloudinaryUpload.secure_url) {
                throw new Error("❌ Cloudinary did not return secure_url");
            }

            console.log("✅ Video uploaded to Cloudinary:", cloudinaryUpload.secure_url);

            // Step 2 — Upload poster (optional)
            let posterUrl = "";
            if (poster) {
                const posterFormData = new FormData();
                posterFormData.append("file", poster);
                posterFormData.append("upload_preset", uploadPreset);

                const posterRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: posterFormData,
                    }
                );
                const posterData = await posterRes.json();
                posterUrl = posterData.secure_url || "";
            }

            // Step 3 — Save movie metadata in backend
            const movieRes = await api.post(
                "/movies",
                {
                    title,
                    genre,
                    videoUrl: cloudinaryUpload.secure_url,
                    publicId: cloudinaryUpload.public_id,
                    posterUrl,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCreatedMovie(movieRes.data);
            alert("✅ Movie uploaded successfully!");
            setTitle("");
            setGenre("");
            setVideo(null);
            setPoster(null);
            setUploadProgress(0);
            fetchMovies();
        } catch (err) {
            console.error("❌ Movie upload failed:", err);
            alert("❌ Movie upload failed: " + err.message);
            setUploadProgress(0);
        }
    };

    const handleDeleteMovie = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;
        try {
            await api.delete(`/movies/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMovies();
        } catch (err) {
            console.error("❌ Failed to delete movie:", err);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🎬 Admin Dashboard</h2>

            <form onSubmit={handleUploadMovie}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                />
                <input type="file" accept="video/*" onChange={handleVideoSelect} />
                <input type="file" accept="image/*" onChange={handlePosterSelect} />

                {uploadProgress > 0 && (
                    <div className="progress-bar">
                        <div
                            style={{
                                width: `${uploadProgress}%`,
                                background: "green",
                                height: "10px",
                            }}
                        ></div>
                    </div>
                )}

                <button type="submit">Upload Movie</button>
            </form>

            <h3>📜 Movie List</h3>
            <ul>
                {movies.map((movie) => (
                    <li key={movie._id}>
                        {movie.title} ({movie.genre}){" "}
                        <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
