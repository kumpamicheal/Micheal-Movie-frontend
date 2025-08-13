// src/utils/cloudinaryUpload.js
import axios from "axios";

const API_BASE_URL = "https://micheal-movie-backend.onrender.com/api";

// Upload video with backend-signed params
export async function uploadVideoToCloudinary(file, onProgress) {
    try {
        // Get signed params
        const signRes = await axios.get(`${API_BASE_URL}/cloudinary/sign`, {
            params: { folder: "movies", resource_type: "video" },
            withCredentials: true
        });

        const { timestamp, signature, api_key, cloud_name, folder, resource_type } = signRes.data;

        // Prepare upload form
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", api_key);

        // Direct upload to Cloudinary
        const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`,
            formData,
            {
                onUploadProgress: (e) => {
                    if (onProgress && e.total) {
                        const percent = Math.round((e.loaded * 100) / e.total);
                        onProgress(percent);
                    }
                },
                timeout: 0
            }
        );

        return uploadRes.data.secure_url;
    } catch (err) {
        console.error("❌ Video upload failed:", err.response?.data || err.message);
        throw err;
    }
}
