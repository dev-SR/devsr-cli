import { intro, outro, multiselect, select, cancel, isCancel } from '@clack/prompts';
import { readdirSync } from 'fs';
import { execSync } from 'child_process';
import { mdToPdf } from 'md-to-pdf';
import markedKatex from 'marked-katex-extension';

function checkPandoc(): boolean {
	try {
		execSync('pandoc --version', { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

export default async function mdConverter() {
	intro('📄 Markdown Converter');

	// Get markdown files in current directory
	const files = readdirSync(process.cwd()).filter((f) => f.endsWith('.md'));

	if (files.length === 0) {
		console.error('❌ No .md files found in current directory.');
		process.exit(1);
	}

	// Multi-select files
	const selectedFiles = await multiselect({
		message: 'Select Markdown files to convert',
		options: files.map((f) => ({
			value: f,
			label: f
		}))
	});

	if (isCancel(selectedFiles) || (selectedFiles as string[]).length === 0) {
		cancel('No files selected. Exiting...');
		process.exit(0);
	}

	// Output format selection
	const format = await select({
		message: 'Choose output format',
		options: [
			{ value: 'pdf', label: 'PDF' },
			{ value: 'html', label: 'HTML' },
			{ value: 'docx', label: 'DOCX' },
			{ value: 'epub', label: 'EPUB' },
			{ value: 'latex', label: 'LaTeX' }
		]
	});

	if (isCancel(format)) {
		cancel('Exiting...');
		process.exit(0);
	}

	// Check pandoc if non-pdf format selected
	if (format !== 'pdf' && !checkPandoc()) {
		console.error('❌ pandoc not found in PATH.');
		console.error('For non-PDF formats, pandoc is required.');
		console.error('Install with: sudo apt install pandoc');
		process.exit(1);
	}

	// Conversion loop
	for (const file of selectedFiles as string[]) {
		const outputFile = file.replace(/\.md$/, `.${format}`);

		console.log(`\n▶ Converting: ${file} -> ${outputFile}`);

		try {
			if (format === 'pdf') {
				await mdToPdf(
					{ path: file },
					{
						dest: outputFile,
						launch_options: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
						css: `@import "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";`,
						marked_extensions: [markedKatex({ throwOnError: false })]
					}
				);
			} else {
				const cmd = `pandoc "${file}" -o "${outputFile}"`;
				execSync(cmd, { stdio: 'inherit' });
			}
		} catch (err) {
			console.error(`❌ Failed to convert ${file}:`, err instanceof Error ? err.message : String(err));
		}
	}

	outro('✅ Conversion completed!');
}
