import { intro, outro, select, cancel, isCancel, text, confirm } from '@clack/prompts';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

function getReadmeFiles(): string[] {
	return readdirSync(process.cwd()).filter(
		(f) => f.toLowerCase().startsWith('readme') && f.endsWith('.md')
	);
}

export default async function miscUtils() {
	intro('🧰 Misc Utils');

	const action = await select({
		message: 'Choose utility',
		options: [
			{
				value: 'heading-transform',
				label: '📝 Transform Markdown headings'
			},
			{ value: 'exit', label: '❌ Exit' }
		]
	});
	if (isCancel(action) || action === 'exit') {
		cancel('Exited');
		process.exit(0);
	}

	if (action === 'heading-transform') {
		await transformHeadings();
	}

	outro('✅ Done');
}

async function transformHeadings() {
	const files = getReadmeFiles();

	if (files.length === 0) {
		console.log('❌ No README files found in current directory.');
		process.exit(1);
	}

	const file = await select({
		message: 'Select README file',
		options: files.map((f) => ({ value: f, label: f }))
	});

	if (isCancel(file)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const action = await select({
		message: 'Choose action',
		options: [
			{ value: 'downgrade', label: '⬇️ Downgrade headings (h1→h2)' },
			{ value: 'upgrade', label: '⬆️ Upgrade headings (h2→h1)' }
		]
	});

	if (isCancel(action)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const filePath = String(file);
	let content = readFileSync(filePath, 'utf-8');

	// FIX 1: Normalize line endings (handle CRLF)
	content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

	const lines = content.split('\n');
	const totalLines = lines.length;

	// Get line range (1-based indexing for user convenience)
	const startLineInput = await text({
		message: `Start line (1-${totalLines}, default: 1)`,
		placeholder: '1',
		validate: (value) => {
			if (!value) return;
			const num = parseInt(value);
			if (isNaN(num) || num < 1 || num > totalLines) {
				return `Must be between 1 and ${totalLines}`;
			}
		}
	});

	if (isCancel(startLineInput)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const endLineInput = await text({
		message: `End line (1-${totalLines}, default: ${totalLines})`,
		placeholder: String(totalLines),
		validate: (value) => {
			if (!value) return;
			const num = parseInt(value);
			const startNum = startLineInput ? parseInt(String(startLineInput)) : 1;
			if (isNaN(num) || num < 1 || num > totalLines) {
				return `Must be between 1 and ${totalLines}`;
			}
			if (num < startNum) {
				return `End line must be >= start line (${startNum})`;
			}
		}
	});

	if (isCancel(endLineInput)) {
		cancel('Cancelled');
		process.exit(0);
	}

	// Parse line ranges (convert to 0-based index)
	const startLine = startLineInput ? parseInt(String(startLineInput)) : 1;
	const endLine = endLineInput ? parseInt(String(endLineInput)) : totalLines;

	const startIndex = startLine - 1;
	const endIndex = endLine - 1;

	let changed = 0;

	const updatedLines = lines.map((line, index) => {
		// Only process lines within the specified range
		if (index < startIndex || index > endIndex) {
			return line;
		}

		// FIX 2: Better regex that handles:
		// - Optional indentation (0-3 spaces, per CommonMark spec)
		// - 1-6 hashes
		// - Required space after hashes (standard markdown)
		// - Heading text
		// - Optional closing hashes and trailing spaces
		const match = line.match(/^(\s{0,3})(#{1,6})(\s+)(.*?)(\s*#*\s*)$/);

		if (!match) return line;

		const indent = match[1];
		const hashes = match[2];
		const spaceAfterHashes = match[3];
		let headingText = match[4].trim();
		const closingPart = match[5];

		// FIX 3: Better empty heading check
		// If there's no actual text after trimming, skip this line
		if (!headingText) return line;

		let level = hashes.length;

		if (action === 'downgrade') {
			level = Math.min(level + 1, 6);
		} else {
			level = Math.max(level - 1, 1);
		}

		changed++;

		// FIX 4: Preserve original format (indentation, spacing, closing hashes)
		return `${indent}${'#'.repeat(level)}${spaceAfterHashes}${headingText}${closingPart}`;
	});

	// Write back with original line endings or normalized LF
	writeFileSync(filePath, updatedLines.join('\n'), 'utf-8');

	console.log(`\n✅ Updated file: ${filePath}`);
	console.log(`📄 Line range: ${startLine} to ${endLine} (of ${totalLines})`);
	console.log(`✏️ Headings changed: ${changed}`);
	console.log(`➡️ Action: ${action}`);

	if (changed === 0) {
		console.log(`\n⚠️  Warning: No headings were found in the specified range.`);
		console.log(`   Common issues:`);
		console.log(`   • Headings need a space after # (e.g., "# Title" not "#Title")`);
		console.log(`   • Check that your line numbers are correct`);
		console.log(`   • File may not contain standard Markdown headings`);
	}
}
