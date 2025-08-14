// uploadPosterToCloudinary.jsx
import api from "../services/api";

/**
 * Uploads a poster image to Cloudinary (signed).
 * @param {File} file - The image file to upload.
 * @param {function} onProgress - Callback for upload progress (0-100).
 * @returns {Promise<string>} - Returns the secure_url of the uploaded image.
 */
export const uploadPosterToCloudinary = (file, onProgress) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Get signed URL & params from backend
            const signRes = await api.get(
                `/cloudinary/sign?folder=posters&resource_type=image`
            );
            const { signature, timestamp, api_key, cloud_name } = signRes.data;

            // 2. Prepare form data for Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", api_key);   // ✅ use api_key from backend
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);
            formData.append("folder", "posters");

            // 3. Send to Cloudinary with progress tracking
            const xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                true
            );

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url);
                } else {
                    reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
                }
            };

            xhr.onerror = () => reject(new Error("Network error during upload."));
            xhr.send(formData);
        } catch (err) {
            reject(err);
        }
    });
};
