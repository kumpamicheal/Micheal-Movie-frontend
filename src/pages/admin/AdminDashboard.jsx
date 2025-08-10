import React, { useState } from "react";

const CLOUD_NAME = "dutoofaax"; // your Cloudinary cloud name
const UPLOAD_PRESET = "unsigned_movies_upload"; // your unsigned preset

export default function AdminDashboard() {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [poster, setPoster] = useState(null);
    const [video, setVideo] = useState(null);
    const [uploadingPoster, setUploadingPoster] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const [posterUrl, setPosterUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    // Upload to Cloudinary
    const uploadFile = async (file, resourceType) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

        const res = await fetch(cloudinaryUrl, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error(data.error?.message || "Upload failed");
        }
    };

    const handlePosterUpload = async () => {
        if (!poster) return alert("Please select a poster");
        setUploadingPoster(true);
        try {
            const url = await uploadFile(poster, "image");
            setPosterUrl(url);
            alert("Poster uploaded successfully");
        } catch (err) {
            console.error(err);
            alert("Poster upload failed");
        }
        setUploadingPoster(false);
    };

    const handleVideoUpload = async () => {
        if (!video) return alert("Please select a video");
        setUploadingVideo(true);
        try {
            const url = await uploadFile(video, "video");
            setVideoUrl(url);
            alert("Video uploaded successfully");
        } catch (err) {
            console.error(err);
            alert("Video upload failed");
        }
        setUploadingVideo(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!posterUrl || !videoUrl) {
            return alert("Please upload both video and poster first");
        }

        try {
            const res = await fetch("http://localhost:5000/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    genre,
                    posterUrl,
                    videoUrl,
                }),
            });

            if (res.ok) {
                alert("Movie added successfully!");
                setTitle("");
                setGenre("");
                setPoster(null);
                setVideo(null);
                setPosterUrl("");
                setVideoUrl("");
            } else {
                alert("Failed to save movie to backend");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving movie");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                />
                <br />

                {/* Poster Upload */}
                <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files[0])} />
                <button type="button" onClick={handlePosterUpload} disabled={uploadingPoster}>
                    {uploadingPoster ? "Uploading Poster..." : "Upload Poster"}
                </button>
                {posterUrl && <p>Poster uploaded ✅</p>}
                <br />

                {/* Video Upload */}
                <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                <button type="button" onClick={handleVideoUpload} disabled={uploadingVideo}>
                    {uploadingVideo ? "Uploading Video..." : "Upload Video"}
                </button>
                {videoUrl && <p>Video uploaded ✅</p>}
                <br />

                <button type="submit">Save Movie</button>
            </form>
        </div>
    );
}
