import { execSync } from 'child_process';
import { select, cancel, isCancel, confirm } from '@clack/prompts';
import { promptTemplates } from './prompt-library';

function getClipboardCommand(type: 'read' | 'write'): string | null {
	const isMac = process.platform === 'darwin';
	const isWindows = process.platform === 'win32';
	const sessionType = process.env.XDG_SESSION_TYPE?.toLowerCase();
	const waylandDisplay = process.env.WAYLAND_DISPLAY;
	const display = process.env.DISPLAY;

	if (isMac) {
		return type === 'read' ? 'pbpaste' : 'pbcopy';
	}

	if (isWindows) {
		return type === 'read' ? 'powershell -NoProfile -Command Get-Clipboard' : 'clip';
	}

	const preferredCommands =
		type === 'read'
			? [
					waylandDisplay || sessionType === 'wayland' ? 'wl-paste --no-newline' : null,
					display ? 'xclip -selection clipboard -o' : null,
					display ? 'xsel --clipboard --output' : null
				]
			: [
					waylandDisplay || sessionType === 'wayland' ? 'wl-copy' : null,
					display ? 'xclip -selection clipboard' : null,
					display ? 'xsel --clipboard --input' : null
				];

	for (const command of preferredCommands) {
		if (!command) continue;

		const binary = command.split(' ')[0];

		try {
			execSync(`command -v ${binary}`, { stdio: 'ignore' });
			return command;
		} catch {
			continue;
		}
	}

	return null;
}

function readClipboard(): string | null {
	const command = getClipboardCommand('read');

	if (!command) {
		return null;
	}

	try {
		return execSync(command, { encoding: 'utf8' });
	} catch {
		return null;
	}
}

function writeClipboard(content: string): boolean {
	const command = getClipboardCommand('write');

	if (!command) {
		return false;
	}

	try {
		execSync(command, {
			input: content,
			stdio: ['pipe', 'ignore', 'ignore']
		});
		return true;
	} catch {
		return false;
	}
}

export default async function promptBlocks() {
	const category = await select({
		message: 'Choose a prompt category',
		options: [
			{ value: 'all', label: 'All categories' },
			{ value: 'Learning', label: 'Learning' },
			{ value: 'Coding', label: 'Coding' },
			{ value: 'Productivity', label: 'Productivity' }
		]
	});

	if (isCancel(category)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const filteredTemplates =
		category === 'all'
			? promptTemplates
			: promptTemplates.filter((template) => template.category === category);

	const selectedTemplate = await select({
		message: 'Choose a prompt block',
		options: filteredTemplates.map((template) => ({
			value: template.name,
			label: `${template.name} (${template.category})`,
			hint: template.description
		}))
	});

	if (isCancel(selectedTemplate)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const template = filteredTemplates.find((item) => item.name === selectedTemplate);

	if (!template) {
		console.log('❌ Prompt template not found.');
		process.exit(1);
	}

	const action = await select({
		message: 'Choose what to do with this prompt',
		options: [
			{
				value: 'clipboard-merge',
				label: 'Merge with clipboard and copy back',
				hint: 'Best for paste-once workflow'
			},
			{
				value: 'clipboard-prompt',
				label: 'Copy prompt block only',
				hint: 'Best when you will paste content manually'
			},
			{
				value: 'print',
				label: 'Print prompt to terminal',
				hint: 'Useful if clipboard tools are unavailable'
			}
		]
	});

	if (isCancel(action)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const promptBlock = `${template.prompt}\n`;

	if (action === 'print') {
		console.log(`\n${template.name}\n`);
		console.log(`${template.description}\n`);
		console.log(promptBlock);
		return;
	}

	if (action === 'clipboard-prompt') {
		if (!writeClipboard(promptBlock)) {
			console.log('\n❌ Clipboard access is not available on this system.');
			console.log('Install wl-clipboard, xclip, or xsel, or use "Print prompt to terminal".');
			process.exit(1);
		}

		console.log(`\n✅ Copied "${template.name}" prompt block to clipboard.`);
		return;
	}

	const clipboardContent = readClipboard();

	if (clipboardContent === null) {
		console.log('\n❌ Unable to read clipboard content.');
		console.log('Install wl-clipboard, xclip, or xsel, or use "Copy prompt block only".');
		process.exit(1);
	}

	const trimmedClipboard = clipboardContent.trim();

	if (!trimmedClipboard) {
		const shouldCopyPromptOnly = await confirm({
			message: 'Clipboard is empty. Copy the prompt block only instead?',
			initialValue: true
		});

		if (isCancel(shouldCopyPromptOnly) || !shouldCopyPromptOnly) {
			cancel('Cancelled');
			process.exit(0);
		}

		if (!writeClipboard(promptBlock)) {
			console.log('\n❌ Clipboard access is not available on this system.');
			process.exit(1);
		}

		console.log(
			`\n✅ Clipboard was empty, so only the "${template.name}" prompt block was copied.`
		);
		return;
	}

	const mergedContent = `${promptBlock}\n${trimmedClipboard}\n`;

	if (!writeClipboard(mergedContent)) {
		console.log('\n❌ Unable to write merged content back to the clipboard.');
		process.exit(1);
	}

	console.log(`\n✅ Merged "${template.name}" with current clipboard content and copied it back.`);
}
