import { intro, outro, multiselect, select, cancel, isCancel } from '@clack/prompts';
import { readdirSync } from 'fs';
import { execSync } from 'child_process';

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

	// Check pandoc
	if (!checkPandoc()) {
		console.error('❌ pandoc not found in PATH.');
		console.error('Install with:');
		console.error(
			'sudo apt install pandoc texlive-latex-base texlive-xetex texlive-latex-recommended'
		);
		process.exit(1);
	}

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

	// Conversion loop
	for (const file of selectedFiles as string[]) {
		const outputFile = file.replace(/\.md$/, `.${format}`);

		let cmd = '';

		if (format === 'pdf') {
			cmd = `pandoc "${file}" -o "${outputFile}" --pdf-engine=xelatex`;
		} else {
			cmd = `pandoc "${file}" -o "${outputFile}"`;
		}

		console.log(`\n▶ Converting: ${file} -> ${outputFile}`);

		try {
			execSync(cmd, { stdio: 'inherit' });
		} catch (err) {
			console.error(`❌ Failed to convert ${file}`);
		}
	}

	outro('✅ Conversion completed!');
}
