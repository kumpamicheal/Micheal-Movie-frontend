// utils/cloudinaryUpload.jsx
import axios from "axios";

/**
 * Uploads poster and video directly to Cloudinary using unsigned presets
 * @param {File} posterFile
 * @param {File} videoFile
 * @param {string} title
 * @param {string} genre
 * @param {function} onProgress - optional callback for progress { poster: %, video: % }
 */
export const uploadMediaToCloudinary = async (posterFile, videoFile, title, genre, onProgress) => {
    if (!posterFile || !videoFile) throw new Error("Poster and video files are required");

    const uploadToCloud = async (file, preset, type) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);

        const cloudinaryURL = `https://api.cloudinary.com/v1_1/dutoofaax/${type}/upload`;

        const response = await axios.post(cloudinaryURL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if (type === "video") {
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

    // Replace 'unsigned_posters_upload' and 'unsigned_movies_upload' with your Cloudinary presets
    const [posterResult, videoResult] = await Promise.all([
        uploadToCloud(posterFile, "unsigned_posters_upload", "image"),
        uploadToCloud(videoFile, "unsigned_movies_upload", "video"),
    ]);

    return {
        posterURL: posterResult.url,
        posterPublicId: posterResult.publicId,
        videoURL: videoResult.url,
        videoPublicId: videoResult.publicId,
    };
};
