import {intro, text, cancel, isCancel, note} from "@clack/prompts";
import fs from "fs-extra";
import path from "path";

export default async function dotnetProject() {
    intro("🟦 .NET Project Generator");

    const projectName = await text({
        message: "Project name:"
    });
    if (isCancel(projectName)) {
        cancel("Exiting...");
        process.exit(0);
    }

    const targetDir = await text({
        message: "Target directory (relative, default=.)",
        placeholder: "."
    });
    if (isCancel(targetDir)) {
        cancel("Exiting...");
        process.exit(0);
    }

    const outDir = path.resolve(process.cwd(), targetDir || ".", projectName as string);
    const templateDir = path.resolve(__dirname, "../../templates/dotnet-webapi");

    note(`Copying template from:\n${templateDir}\n→ ${outDir}`);

    try {
        fs.copySync(templateDir, outDir, {overwrite: true});
        console.log(`✅ Project generated at ${outDir}`);
    } catch (err) {
        console.error("❌ Failed to copy template:", err);
        process.exit(1);
    }
}
