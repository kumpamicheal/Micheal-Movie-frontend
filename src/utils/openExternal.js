import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Open a URL in the system browser on mobile,
 * or a new tab if running in a web browser.
 */
export async function openExternalUrl(url) {
    if (!url) throw new Error("No URL provided");

    try {
        if (Capacitor.getPlatform() === 'web') {
            // Running in browser
            window.open(url, "_blank", "noopener,noreferrer");
        } else {
            // Running in mobile app (Android/iOS)
            await App.openUrl({ url });
        }
    } catch (err) {
        console.error("Failed to open URL", err);
        window.open(url, "_blank");
    }
}
