import axios from "axios";

const API_BASE_URL = "https://micheal-movie-backend.onrender.com/api";

/**
 * Uploads a video file to Cloudinary using signed upload params.
 * @param {File} file - The video file to upload.
 * @param {Function} onProgress - Optional progress callback (percent complete).
 * @returns {Promise<string>} - Secure URL of the uploaded video.
 */
export async function uploadVideoToCloudinary(file, onProgress) {
    try {
        // 1️⃣ Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No admin token found. Please log in again.");

        // 2️⃣ Request signed upload parameters from backend
        const signRes = await axios.get(`${API_BASE_URL}/cloudinary/sign`, {
            params: { folder: "movies" }, // ✅ backend will auto-use video type
            headers: { Authorization: `Bearer ${token}` }
        });

        const { timestamp, signature, api_key, cloud_name, folder, resource_type } = signRes.data;

        // 3️⃣ Prepare form data for Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", api_key);
        formData.append("resource_type", resource_type);


        // 4️⃣ Upload directly to Cloudinary
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
                timeout: 0 // disable timeout for large videos
            }
        );

        // 5️⃣ Return the secure URL
        return uploadRes.data.secure_url;

    } catch (err) {
        console.error("❌ Video upload failed:", err.response?.data || err.message);
        throw err;
    }
}
