import React, { useEffect, useState } from "react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

const DownloadsPage = () => {
    const [downloads, setDownloads] = useState([]);

    useEffect(() => {
        loadDownloads();
    }, []);

    // Load downloads.json and filter only available files
    const loadDownloads = async () => {
        try {
            const result = await Filesystem.readFile({
                path: "downloads.json",
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const allDownloads = JSON.parse(result.data);

            const availableDownloads = [];
            for (const d of allDownloads) {
                try {
                    await Filesystem.stat({ path: d.videoFile, directory: Directory.Data });
                    await Filesystem.stat({ path: d.posterFile, directory: Directory.Data });
                    availableDownloads.push(d);
                } catch {}
            }

            setDownloads(availableDownloads);
        } catch {
            setDownloads([]);
        }
    };

    // Delete a downloaded movie
    const handleDelete = async (movie) => {
        try {
            await Filesystem.deleteFile({ path: movie.posterFile, directory: Directory.Data });
            await Filesystem.deleteFile({ path: movie.videoFile, directory: Directory.Data });

            const updated = downloads.filter((d) => d.id !== movie.id);
            await Filesystem.writeFile({
                path: "downloads.json",
                data: JSON.stringify(updated),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            setDownloads(updated);
            alert(`🗑️ ${movie.title} deleted!`);
        } catch (err) {
            console.error("❌ Delete failed:", err);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-3">📂 My Downloads</h2>

            {downloads.length === 0 ? (
                <p>No downloads yet.</p>
            ) : (
                downloads.map((d) => (
                    <div key={d.id} className="mb-4 border p-2 rounded">
                        <p className="font-semibold">{d.title}</p>
                        <img
                            src={Capacitor.convertFileSrc(d.posterFile)}
                            alt={d.title}
                            className="w-32 mb-2"
                        />
                        <video
                            src={Capacitor.convertFileSrc(d.videoFile)}
                            controls
                            className="w-full max-w-md mb-2"
                        />
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleDelete(d)}
                        >
                            🗑️ Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default DownloadsPage;
