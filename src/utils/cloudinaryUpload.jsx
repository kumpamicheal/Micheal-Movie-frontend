// utils/cloudinaryUpload.jsx
import axios from "axios";
import api from "../services/api";

/**
 * Uploads poster and video directly to Cloudinary using signed params from backend
 * @param {File} posterFile
 * @param {File} videoFile
 * @param {string} title
 * @param {string} genre
 * @param {function} onProgress - optional callback for progress { poster: %, video: % }
 */
export const uploadMediaToCloudinary = async (posterFile, videoFile, title, genre, onProgress) => {
    if (!posterFile || !videoFile) throw new Error("Poster and video files are required");

    // 1️⃣ Request signed params for poster and video
    const [posterSigRes, videoSigRes] = await Promise.all([
        api.get("/movies/upload-signature", { params: { folder: "posters", resource_type: "image" } }),
        api.get("/movies/upload-signature", { params: { folder: "movies", resource_type: "video" } }),
    ]);

    const uploadToCloud = async (file, sigRes) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigRes.data.apiKey);
        formData.append("timestamp", sigRes.data.timestamp);
        formData.append("signature", sigRes.data.signature);
        formData.append("folder", sigRes.data.folder);

        // Direct Cloudinary upload URL
        const cloudinaryURL = `https://api.cloudinary.com/v1_1/${sigRes.data.cloudName}/${sigRes.data.resource_type}/upload`;

        const response = await axios.post(cloudinaryURL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if (sigRes.data.resource_type === "video") {
                        onProgress({ video: percent });
                    } else {
                        onProgress({ poster: percent });
                    }
                }
            },
        });

        return {
            url: response.data.secure_url,
            publicId: response.data.public_id,
        };
    };

    // 2️⃣ Upload poster and video in parallel
    const [posterResult, videoResult] = await Promise.all([
        uploadToCloud(posterFile, posterSigRes),
        uploadToCloud(videoFile, videoSigRes),
    ]);

    // 3️⃣ Return URLs and public IDs
    return {
        posterURL: posterResult.url,
        posterPublicId: posterResult.publicId,
        videoURL: videoResult.url,
        videoPublicId: videoResult.publicId,
    };
};
