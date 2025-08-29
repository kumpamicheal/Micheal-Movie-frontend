// utils/cloudinaryUpload.jsx
import axios from "axios";

/**
 * Uploads poster and video directly to Cloudinary using a single unsigned preset
 * @param {File} posterFile
 * @param {File} videoFile
 * @param {function} onProgress - optional callback for progress { poster: %, video: % }
 */
export const uploadMediaToCloudinary = async (posterFile, videoFile, onProgress) => {
    if (!posterFile || !videoFile) throw new Error("Poster and video files are required");

    const uploadToCloud = async (file, preset, folder) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);
        formData.append("folder", folder);

        // Detect whether file is an image or a video
        const resourceType = file.type.startsWith("video/") ? "video" : "image";
        const cloudinaryURL = `https://api.cloudinary.com/v1_1/dutoofaax/${resourceType}/upload`;

        const response = await axios.post(cloudinaryURL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if (resourceType === "video") {
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

    // Upload poster and video in parallel using the same preset
    const [posterResult, videoResult] = await Promise.all([
        uploadToCloud(posterFile, "unsigned_movies_upload", "posters"),
        uploadToCloud(videoFile, "unsigned_movies_upload", "movies"),
    ]);

    return {
        posterURL: posterResult.url,
        posterPublicId: posterResult.publicId,
        videoURL: videoResult.url,
        videoPublicId: videoResult.publicId,
    };
};
