import { intro, text, confirm, multiselect, note, cancel, isCancel } from '@clack/prompts';
import fs from 'fs';
import path from 'path';

function getAllFiles(dir: string): string[] {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...getAllFiles(fullPath));
		} else if (entry.isFile()) {
			files.push(fullPath);
		}
	}

	return files;
}

function validateDirectory(dirPath: string): boolean {
	try {
		return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}

function validateOutputPath(filePath: string): boolean {
	try {
		const outputDir = path.dirname(filePath);
		return fs.existsSync(outputDir) && fs.statSync(outputDir).isDirectory();
	} catch {
		return false;
	}
}

async function appendDirToStream(
	outputStream: fs.WriteStream,
	resolvedOutputFile: string
): Promise<number> {
	const inputDir = await text({
		message: 'Enter input directory path:',
		placeholder: './my-folder',
		validate(value) {
			if (!value.trim()) return 'Input directory is required';

			const resolvedPath = path.resolve(value);

			if (!validateDirectory(resolvedPath)) {
				return 'Directory not found';
			}
		}
	});

	if (isCancel(inputDir)) {
		return -1; // signal exit
	}

	const resolvedInputDir = path.resolve(inputDir as string);
	const allFiles = getAllFiles(resolvedInputDir);

	if (allFiles.length === 0) {
		note('No files found in the input directory — skipping.', '⚠️ Empty');
		return 0;
	}

	// ── All files or pick specific ones? (default: All) ───────────────────────
	const pickSpecific = await confirm({
		message: `Found ${allFiles.length} file(s) — pick specific files?`,
		initialValue: false   // default: No → use all
	});

	if (isCancel(pickSpecific)) {
		return -1;
	}

	let selectedFiles: string[];

	if (pickSpecific) {
		const picked = await multiselect({
			message: 'Select files to include (Space to toggle, Enter to confirm):',
			options: allFiles.map((f) => ({
				value: f,
				label: path.relative(resolvedInputDir, f)
			})),
			required: true
		});

		if (isCancel(picked)) {
			return -1;
		}

		selectedFiles = picked as string[];
	} else {
		selectedFiles = allFiles;
	}

	for (const file of selectedFiles) {
		const relativePath = path.relative(resolvedInputDir, file);

		outputStream.write(`===== ${relativePath} =====\n`);

		try {
			const content = fs.readFileSync(file, 'utf-8');
			outputStream.write(content);
			outputStream.write('\n\n');
		} catch {
			outputStream.write(`[Could not read file: ${relativePath}]\n\n`);
		}
	}

	note(
		`Appended ${selectedFiles.length} file(s) from:\n  ${resolvedInputDir}\n\nOutput: ${resolvedOutputFile}`,
		'✅ Done'
	);

	return selectedFiles.length;
}

export default async function catFilesToSingleFile() {
	intro('📄 Combine Files');

	// ── Output file (asked once) ──────────────────────────────────────────────
	const defaultOutputFile = path.resolve(process.cwd(), 'output.txt');

	const outputFile = await text({
		message: 'Enter output file path:',
		placeholder: defaultOutputFile,
		defaultValue: defaultOutputFile,
		validate(value) {
			const finalValue = value.trim() || defaultOutputFile;
			const resolvedPath = path.resolve(finalValue);

			if (!validateOutputPath(resolvedPath)) {
				return 'Output directory does not exist';
			}
		}
	});

	if (isCancel(outputFile)) {
		cancel('Exiting...');
		process.exit(0);
	}

	const resolvedOutputFile = path.resolve((outputFile as string).trim() || defaultOutputFile);

	// ── Append vs overwrite (only relevant when file already exists) ──────────
	let streamFlag = 'w'; // default: create fresh

	if (fs.existsSync(resolvedOutputFile)) {
		const shouldAppend = await confirm({
			message: `output.txt already exists — append to it?`,
			initialValue: true   // default: Yes (append)
		});

		if (isCancel(shouldAppend)) {
			cancel('Exiting...');
			process.exit(0);
		}

		streamFlag = shouldAppend ? 'a' : 'w';
	}

	const outputStream = fs.createWriteStream(resolvedOutputFile, {
		encoding: 'utf-8',
		flags: streamFlag
	});

	let totalFiles = 0;

	// ── Loop: add directory → ask to continue ─────────────────────────────────
	while (true) {
		const added = await appendDirToStream(outputStream, resolvedOutputFile);

		if (added === -1) {
			// User cancelled the directory prompt → exit
			outputStream.end();
			cancel('Exiting...');
			process.exit(0);
		}

		totalFiles += added;

		// ── Options ──────────────────────────────────────────────────────────
		const addAnother = await confirm({
			message: 'Add from separate directory path?',
			initialValue: false   // default: No
		});

		if (isCancel(addAnother) || !addAnother) {
			// "No" (default) or Ctrl-C → exit the loop
			break;
		}
		// "Yes" → loop back and ask for the next directory
	}

	outputStream.end();

	note(
		`Total files combined: ${totalFiles}\nOutput: ${resolvedOutputFile}`,
		'✅ All done'
	);
}
