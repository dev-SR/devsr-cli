import { execSync } from "child_process";
import fs from "fs";

export function checkDependency(cmd: string, version:string = "--version"): boolean {
    try {
        execSync(`${cmd} ${version}`, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

export function validateCookie(path: string | undefined): boolean {
    return !!path && fs.existsSync(path);
}
