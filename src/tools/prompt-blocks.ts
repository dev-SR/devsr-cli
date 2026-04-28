import { execSync } from 'child_process';
import { select, cancel, isCancel, confirm } from '@clack/prompts';
import { promptTemplates } from './prompt-library';

interface PromptBlocksOptions {
	category?: 'all' | 'Learning' | 'Coding' | 'Productivity';
	template?: string;
	action?: 'clipboard-merge' | 'clipboard-prompt' | 'print';
}

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

async function executePromptBlocks(
	category: 'all' | 'Learning' | 'Coding' | 'Productivity',
	selectedTemplate: string,
	action: 'clipboard-merge' | 'clipboard-prompt' | 'print'
) {
	const filteredTemplates =
		category === 'all'
			? promptTemplates
			: promptTemplates.filter((template) => template.category === category);

	const template = filteredTemplates.find((item) => item.name === selectedTemplate);

	if (!template) {
		console.log('❌ Prompt template not found.');
		process.exit(1);
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

export default async function promptBlocks(options?: PromptBlocksOptions) {
	let category: 'all' | 'Learning' | 'Coding' | 'Productivity';
	let selectedTemplate: string;
	let action: 'clipboard-merge' | 'clipboard-prompt' | 'print';

	// Use provided options or prompt user
	if (options?.category) {
		category = options.category;
	} else {
		const categoryResult = await select({
			message: 'Choose a prompt category',
			options: [
				{ value: 'all', label: 'All categories' },
				{ value: 'Learning', label: 'Learning' },
				{ value: 'Coding', label: 'Coding' },
				{ value: 'Productivity', label: 'Productivity' }
			]
		});

		if (isCancel(categoryResult)) {
			cancel('Cancelled');
			process.exit(0);
		}

		category = categoryResult as 'all' | 'Learning' | 'Coding' | 'Productivity';
	}

	if (options?.template) {
		selectedTemplate = options.template;
	} else {
		const filteredTemplates =
			category === 'all'
				? promptTemplates
				: promptTemplates.filter((template) => template.category === category);

		const templateResult = await select({
			message: 'Choose a prompt block',
			options: filteredTemplates.map((t) => ({ value: t.name, label: t.name }))
		});

		if (isCancel(templateResult)) {
			cancel('Cancelled');
			process.exit(0);
		}

		selectedTemplate = templateResult as string;
	}

	if (options?.action) {
		action = options.action;
	} else {
		const actionResult = await select({
			message: 'Choose what to do with this prompt',
			options: [
				{ value: 'clipboard-merge', label: 'Merge with clipboard and copy back' },
				{ value: 'clipboard-prompt', label: 'Prompt for clipboard content' },
				{ value: 'print', label: 'Print to console' }
			]
		});

		if (isCancel(actionResult)) {
			cancel('Cancelled');
			process.exit(0);
		}

		action = actionResult as 'clipboard-merge' | 'clipboard-prompt' | 'print';
	}

	await executePromptBlocks(category, selectedTemplate, action);
}
