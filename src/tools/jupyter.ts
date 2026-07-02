import { intro, outro, multiselect, select, cancel, isCancel } from '@clack/prompts';
import { readdirSync } from 'fs';
import { execSync } from 'child_process';

function checkJupytext(): boolean {
	try {
		execSync('jupytext --version', { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

export default async function jupyterConverter() {
	intro('🪐 Jupyter Notebook Converter');

	if (!checkJupytext()) {
		console.error('❌ jupytext not found in PATH.');
		console.error('Please install Jupytext first. You can run:');
		console.error('  pip install jupytext');
		console.error('  or');
		console.error('  pipx install jupytext');
		process.exit(1);
	}

	const action = await select({
		message: 'Choose conversion direction',
		options: [
			{ value: 'py-to-ipynb', label: '🐍 Python Script (.py) -> 📓 Jupyter Notebook (.ipynb)' },
			{ value: 'ipynb-to-py', label: '📓 Jupyter Notebook (.ipynb) -> 🐍 Python Script (.py)' }
		]
	});

	if (isCancel(action)) {
		cancel('Exiting...');
		process.exit(0);
	}

	const isPyToIpynb = action === 'py-to-ipynb';
	const extension = isPyToIpynb ? '.py' : '.ipynb';
	const targetExtension = isPyToIpynb ? '.ipynb' : '.py';

	// Get files in current directory
	const files = readdirSync(process.cwd()).filter((f) => f.endsWith(extension));

	if (files.length === 0) {
		console.error(`❌ No ${extension} files found in the current directory.`);
		process.exit(1);
	}

	const SELECT_ALL = '__select_all__';

	// Multi-select files
	const selectedFiles = await multiselect({
		message: `Select ${extension} files to convert  [space] toggle · [a] select all`,
		options: [
			{ value: SELECT_ALL, label: '── Select All ──' },
			...files.map((f) => ({ value: f, label: f }))
		]
	});

	if (isCancel(selectedFiles) || (selectedFiles as string[]).length === 0) {
		cancel('No files selected. Exiting...');
		process.exit(0);
	}

	// Expand "select all" sentinel to the full file list
	const resolvedFiles: string[] = (selectedFiles as string[]).includes(SELECT_ALL)
		? files
		: (selectedFiles as string[]);

	// Conversion loop
	for (const file of resolvedFiles) {
		const outputFile = file.replace(new RegExp(`\\${extension}$`), targetExtension);

		console.log(`\n▶ Converting: ${file} -> ${outputFile}`);

		try {
			let cmd = '';
			if (isPyToIpynb) {
				// Covert .py to .ipynb using jupytext --to notebook <file>.py
				cmd = `jupytext --to notebook "${file}"`;
			} else {
				// Convert .ipynb to .py (make sure markdowns are included)
				// Using standard jupytext --to py ensures markdown cells are preserved
				cmd = `jupytext --to py "${file}"`;
			}
			execSync(cmd, { stdio: 'inherit' });
		} catch (err) {
			console.error(
				`❌ Failed to convert ${file}:`,
				err instanceof Error ? err.message : String(err)
			);
		}
	}

	outro('✅ Conversion completed!');
}
