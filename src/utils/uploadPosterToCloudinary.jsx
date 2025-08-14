// uploadPosterToCloudinary.jsx
import api from "../services/api";

/**
 * Uploads a poster image to Cloudinary (signed) with progress tracking.
 * @param {File} file - The image file to upload.
 * @param {function} onProgress - Callback for upload progress (0-100).
 * @returns {Promise<string>} - Resolves with the Cloudinary secure_url.
 */
export const uploadPosterToCloudinary = async (file, onProgress) => {
    try {
        // 1️⃣ Get token from localStorage
        const token = localStorage.getItem("token");

        // 2️⃣ Request a signed URL / signature from backend
        const signRes = await api.get(`/cloudinary/sign?folder=posters&resource_type=image`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { signature, timestamp, api_key, cloud_name } = signRes.data;

        // 3️⃣ Prepare FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", api_key);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "posters");

        // 4️⃣ Upload to Cloudinary with progress tracking
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, true);

            // Track progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                try {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.secure_url);
                    } else {
                        reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
                    }
                } catch (err) {
                    reject(new Error("Invalid JSON response from Cloudinary."));
                }
            };

            xhr.onerror = () => reject(new Error("Network error during upload."));
            xhr.send(formData);
        });

    } catch (err) {
        console.error("Poster upload failed:", err);
        throw err;
    }
};
