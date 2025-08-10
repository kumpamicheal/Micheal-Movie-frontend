import React, { useState, useEffect } from "react";
import api from "../api"; // Your axios instance
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [video, setVideo] = useState(null);
    const [poster, setPoster] = useState(null);
    const [movies, setMovies] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [createdMovie, setCreatedMovie] = useState(null);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    const CLOUD_NAME = "YOUR_CLOUD_NAME"; // ✅ Replace with your Cloudinary cloud name
    const UPLOAD_PRESET = "YOUR_UNSIGNED_PRESET"; // ✅ Replace with your unsigned preset

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
    };

    const handlePosterSelect = (e) => {
        setPoster(e.target.files[0]);
    };

    const uploadToCloudinary = (file, type) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const endpoint =
                type === "video"
                    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
                    : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

            const xhr = new XMLHttpRequest();
            xhr.open("POST", endpoint);

            if (type === "video") {
                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded * 100) / event.total);
                        setUploadProgress(percent);
                    }
                });
            }

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error("❌ Upload failed"));
                }
            };

            xhr.onerror = () => reject(new Error("❌ Network error"));
            xhr.send(formData);
        });
    };

    const handleUploadMovie = async (e) => {
        e.preventDefault();

        if (!title || !genre || !video) {
            alert("❗ Title, genre, and video are required");
            return;
        }

        try {
            setUploadProgress(0);

            // 1️⃣ Upload video
            const videoUpload = await uploadToCloudinary(video, "video");
            if (!videoUpload.secure_url) throw new Error("❌ Video upload failed");

            // 2️⃣ Upload poster if exists
            let posterUrl = "";
            if (poster) {
                const posterUpload = await uploadToCloudinary(poster, "image");
                posterUrl = posterUpload.secure_url || "";
            }

            // 3️⃣ Save movie metadata in backend
            const movieRes = await api.post(
                "/movies",
                {
                    title,
                    genre,
                    videoUrl: videoUpload.secure_url,
                    publicId: videoUpload.public_id,
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
            alert(err.message);
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
