import { intro, text, note, cancel, isCancel } from '@clack/prompts';
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

export default async function catFilesToSingleFile() {
	intro('📄 Combine Files');

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
		cancel('Exiting...');
		process.exit(0);
	}

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

	const resolvedInputDir = path.resolve(inputDir as string);
	const resolvedOutputFile = path.resolve((outputFile as string).trim() || defaultOutputFile);

	const files = getAllFiles(resolvedInputDir);

	if (files.length === 0) {
		cancel('No files found in the input directory.');
		process.exit(0);
	}

	const outputStream = fs.createWriteStream(resolvedOutputFile, {
		encoding: 'utf-8'
	});

	for (const file of files) {
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

	outputStream.end();

	note(`Combined ${files.length} files into:\n${resolvedOutputFile}`, '✅ Done');
}
