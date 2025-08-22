#!/usr/bin/env node
import { intro, outro, select, cancel, isCancel } from "@clack/prompts";
import youtubeDownloader from "./tools/youtube";
import dotnetProject from "./tools/dotnet-project";
import dotnetSrcGen from "./tools/dotnet-srcgen";

async function main() {
    intro("⚡ dev-sr - Multi-tool CLI");

    const choice = await select({
        message: "Choose a tool",
        options: [
            { value: "yt", label: "🎬 YouTube Downloader" },
            { value: "dotnet-project", label: "🟦 .NET Project Generator" },
            { value: "dotnet-srcgen", label: "🟦 .NET Service/Repo/Controller Generator" },
            { value: "exit", label: "❌ Exit" }
        ]
    });

    if (isCancel(choice) || choice === "exit") {
        cancel("Exiting...");
        process.exit(0);
    }

    switch (choice) {
        case "yt":
            await youtubeDownloader();
            break;
        case "dotnet-project":
            await dotnetProject();
            break;
        case "dotnet-srcgen":
            await dotnetSrcGen();
            break;
    }

    outro("✅ Done!");
}

main();
