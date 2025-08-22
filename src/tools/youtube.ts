import {intro, select, text, note, cancel, isCancel} from "@clack/prompts";
import {loadConfig, saveConfig} from "../config";
import {checkDependency, validateCookie} from "../utils";
import {execSync} from "child_process";

export default async function youtubeDownloader() {
    intro("🎬 YouTube Downloader");

    if (!checkDependency("yt-dlp")) {
        console.error("❌ yt-dlp not found in PATH.");
        process.exit(1);
    }
    if (!checkDependency("ffmpeg", "-version")) {
        console.error("❌ ffmpeg not found in PATH.");
        process.exit(1);
    }

    const config = loadConfig();

    // Cookie validation
    if (!validateCookie(config.cookiePath)) {
        const newPath = await text({
            message: "Enter absolute path to cookies.txt",
            validate(value) {
                if (!value.trim()) return "Path required";
                if (!validateCookie(value)) return "File not found";
            }
        });

        if (isCancel(newPath)) {
            cancel("Exiting...");
            process.exit(0);
        }

        config.cookiePath = newPath as string;
        saveConfig(config);
        note(`Saved cookie path: ${config.cookiePath}`, "✅ Config updated");
    }

    // URL
    const url = await text({message: "Enter YouTube video/playlist URL:"});
    if (isCancel(url)) {
        cancel("Exiting...");
        process.exit(0);
    }

    // Format selection
    const format = await select({
        message: "Choose download quality",
        options: [
            {value: "720p", label: "720p"},
            {value: "1080p", label: "1080p"},
            {value: "best", label: "Best available"},
            {value: "best1080", label: "Best ≤1080p"}
        ]
    });
    if (isCancel(format)) {
        cancel("Exiting...");
        process.exit(0);
    }

    let formatSelector = "";
    switch (format) {
        case "720p":
            formatSelector = 'bv[height=720]+ba/b[height=720]';
            break;
        case "1080p":
            formatSelector = 'bv[height=1080]+ba/b[height=1080]';
            break;
        case "best":
            formatSelector = 'bv+ba/b';
            break;
        case "best1080":
            formatSelector = 'bv[height<=1080]+ba/b[height<=1080]';
            break;
    }

    // Single video or playlist
    const downloadType = await select({
        message: "Download type",
        options: [
            {value: "single", label: "Single video"},
            {value: "playlist", label: "Playlist"}
        ]
    });
    if (isCancel(downloadType)) {
        cancel("Exiting...");
        process.exit(0);
    }

    let outputTemplate = "";
    if (downloadType === "single") {
        // uploader_title_res_.ext
        outputTemplate = "%(uploader)s_%(title)s_%(height)sp.%(ext)s";
    } else {
        // uploader_playlist/playlist_index__title_res_.ext
        outputTemplate = "%(uploader)s_%(playlist)s/%(playlist_index)s__%(title)s_%(height)sp.%(ext)s";
    }

    const cmd = `yt-dlp -f "${formatSelector}" --merge-output-format mp4 --cookies "${config.cookiePath}\\cookies.txt" -o "${outputTemplate}" "${url}"`;

    console.log(`\n▶ Running: ${cmd}\n`);

    try {
        execSync(cmd, {stdio: "inherit"});
    } catch {
        console.error("❌ Download failed");
        process.exit(1);
    }
}
