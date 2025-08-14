// uploadMediaToCloudinary.jsx
import axios from 'axios';
import api from './api'; // your axios instance pointing to backend

/**
 * Upload poster and video to Cloudinary simultaneously
 * @param {File} posterFile
 * @param {File} videoFile
 * @param {function} onProgress - callback receives { poster: 0-100, video: 0-100 }
 * @returns {Promise<{posterURL: string, videoURL: string}>}
 */
export const uploadMediaToCloudinary = async (posterFile, videoFile, onProgress) => {
    if (!posterFile && !videoFile) throw new Error('No files to upload');

    // 1️⃣ Request signed data for poster
    const posterSignRes = posterFile
        ? await api.get('/cloudinary/sign', { params: { folder: 'posters', resource_type: 'image' } })
        : null;

    // 2️⃣ Request signed data for video
    const videoSignRes = videoFile
        ? await api.get('/cloudinary/sign', { params: { folder: 'videos', resource_type: 'video' } })
        : null;

    // Helper function to upload one file
    const uploadFile = async (file, signData) => {
        if (!file || !signData) return null;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.api_key);
        formData.append('timestamp', signData.timestamp);
        formData.append('signature', signData.signature);
        formData.append('folder', signData.folder);

        // Include resource_type (required for video)
        formData.append('resource_type', signData.resource_type);

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${signData.resource_type}/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress({ [signData.resource_type]: percent });
                    }
                },
            }
        );
        return res.data.secure_url;
    };

    // 3️⃣ Upload both files in parallel
    const [posterURL, videoURL] = await Promise.all([
        uploadFile(posterFile, posterSignRes?.data),
        uploadFile(videoFile, videoSignRes?.data),
    ]);

    return { posterURL, videoURL };
};
