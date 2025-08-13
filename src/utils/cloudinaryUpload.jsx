import axios from "axios";

const API_BASE_URL = "https://micheal-movie-backend.onrender.com/api";

export async function uploadVideoToCloudinary(file, onProgress) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No admin token found. Please log in again.");

        // 1️⃣ Get signed params
        const signRes = await axios.get(`${API_BASE_URL}/cloudinary/sign`, {
            params: { folder: "movies" },
            headers: { Authorization: `Bearer ${token}` }
        });

        const { timestamp, signature, api_key, cloud_name, folder, resource_type } = signRes.data;

        // 2️⃣ Build formData (NO resource_type here)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("api_key", api_key);

        // 3️⃣ Upload
        const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`,
            formData,
            {
                onUploadProgress: (e) => {
                    if (onProgress && e.total) {
                        onProgress(Math.round((e.loaded * 100) / e.total));
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
