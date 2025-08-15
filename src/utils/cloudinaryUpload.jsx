// utils/cloudinaryUpload.jsx
import api from "../services/api";

/**
 * Uploads poster and video to backend (/upload-movie)
 * and returns the URLs.
 * @param {File} posterFile
 * @param {File} videoFile
 * @param {function} onProgress - optional callback for video progress (0-100)
 */
export const uploadMediaToCloudinary = async (posterFile, videoFile, onProgress) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const formData = new FormData();
        formData.append("poster", posterFile);
        formData.append("video", videoFile);

        const response = await api.post("/cloudinary/upload-movie", formData, {

            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress({ video: percent, poster: percent }); // same % for simplicity
                }
            },
        });

        return {
            posterURL: response.data.posterUrl,
            videoURL: response.data.videoUrl,
        };
    } catch (err) {
        console.error("Media upload failed:", err);
        throw err;
    }
};
