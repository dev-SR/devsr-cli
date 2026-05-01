#!/usr/bin/env node
import { intro, outro, select, cancel, isCancel } from '@clack/prompts';
import promptBlocks from './tools/prompt-blocks';
import youtubeDownloader from './tools/youtube';
import mdConverter from './tools/md-converter';
import miscUtils from './tools/misc-utils';

// Define shortcut commands that bypass prompts
interface ShortcutCommand {
	tool: 'prompt-blocks' | 'yt' | 'md-convert' | 'misc';
	category?: 'all' | 'Learning' | 'Coding' | 'Productivity';
	template?: string;
	action?: 'clipboard-merge' | 'clipboard-prompt' | 'print';
}

const shortcuts: Record<string, ShortcutCommand> = {
	// Prompt blocks shortcuts
	'prompt-explain-clipboard': {
		tool: 'prompt-blocks',
		category: 'Learning',
		template: 'Beginner-Friendly Explanation',
		action: 'clipboard-merge'
	},
	'prompt-notes-clipboard': {
		tool: 'prompt-blocks',
		category: 'Learning',
		template: 'Beginner-Friendly Notes',
		action: 'clipboard-merge'
	},
	'prompt-youtube-notes-clipboard': {
		tool: 'prompt-blocks',
		category: 'Learning',
		template: 'YouTube Caption Notes',
		action: 'clipboard-merge'
	},
	'prompt-project-context-clipboard': {
		tool: 'prompt-blocks',
		category: 'Coding',
		template: 'Project Context Extractor',
		action: 'clipboard-merge'
	},
	'prompt-debug-clipboard': {
		tool: 'prompt-blocks',
		category: 'all',
		template: 'Debugging Assistant',
		action: 'clipboard-merge'
	},
	'prompt-learning': { tool: 'prompt-blocks', category: 'Learning' },
	'prompt-coding': { tool: 'prompt-blocks', category: 'Coding' },
	'prompt-productivity': { tool: 'prompt-blocks', category: 'Productivity' }
};

const shortcutDescriptions: Record<string, string> = {
	'prompt-explain-clipboard': 'Explain content in beginner-friendly way + auto-merge clipboard',
	'prompt-learning': 'Choose from Learning category prompts',
	'prompt-coding': 'Choose from Coding category prompts',
	'prompt-productivity': 'Choose from Productivity category prompts',
	'prompt-notes-clipboard': 'Generate clean notes from content + auto-merge clipboard',
	'prompt-youtube-notes-clipboard':
		'Generate learning notes from YouTube captions + auto-merge clipboard',
	'prompt-project-context-clipboard':
		'Extract reusable project context from codebase snippets + auto-merge clipboard',
	'prompt-debug-clipboard': 'Debug code/issues + auto-merge clipboard'
};

function printHelp() {
	console.log(`
⚡ dev-sr - Multi-tool CLI

USAGE:
  devsr [COMMAND] [OPTIONS]

COMMANDS:
  prompt-blocks           AI Prompt Blocks tool
  yt                      YouTube Downloader
  md-convert              Markdown Converter
  misc                    Misc Utilities

SHORTCUTS (bypass interactive prompts):
`);

	Object.entries(shortcuts).forEach(([cmd, shortcut]) => {
		const desc = shortcutDescriptions[cmd];
		console.log(`  devsr ${cmd}`);
		console.log(`    └─ ${desc}\n`);
	});

	console.log(`EXAMPLES:
  devsr                                    # Interactive mode
  devsr --help                             # Show this help message
  devsr prompt-explain-clipboard       # Explain + merge with clipboard
  devsr prompt-notes-clipboard             # Generate notes + merge with clipboard
  devsr prompt-youtube-notes-clipboard     # YouTube captions to notes + merge with clipboard
  devsr prompt-project-context-clipboard   # Project context extraction + merge with clipboard
  devsr prompt-learning                    # Choose Learning prompt
`);
}

async function main() {
	const args = process.argv.slice(2);

	// Handle --help flag
	if (args.length > 0 && (args[0] === '--help' || args[0] === '-h')) {
		printHelp();
		process.exit(0);
	}

	let choice: string;
	let options: ShortcutCommand | undefined;

	// Check if user provided a shortcut command
	if (args.length > 0) {
		const command = args[0];
		if (shortcuts[command]) {
			options = shortcuts[command];
			choice = options.tool;
		} else {
			// Try direct tool selection
			const validTools = ['prompt-blocks', 'yt', 'md-convert', 'misc'];
			if (validTools.includes(command)) {
				choice = command;
			} else {
				console.log(`\n❌ Unknown command: ${command}`);
				console.log('\nAvailable shortcuts:');
				Object.keys(shortcuts).forEach((cmd) => {
					console.log(`  devsr ${cmd}`);
				});
				process.exit(1);
			}
		}
	} else {
		intro('⚡ dev-sr - Multi-tool CLI');

		const choiceResult = await select({
			message: 'Choose a tool',
			options: [
				{ value: 'prompt-blocks', label: '🧠 AI Prompt Blocks' },
				{ value: 'yt', label: '🎬 YouTube Downloader' },
				{ value: 'md-convert', label: '📄 Markdown Converter' },
				{ value: 'misc', label: '🧰 Misc Utils' },
				{ value: 'exit', label: '❌ Exit' }
			]
		});

		if (isCancel(choiceResult)) {
			cancel('Exiting...');
			process.exit(0);
		}

		choice = choiceResult as string;

		if (choice === 'exit') {
			cancel('Exiting...');
			process.exit(0);
		}
	}

	switch (choice) {
		case 'prompt-blocks':
			await promptBlocks(options);
			break;
		case 'yt':
			await youtubeDownloader();
			break;
		case 'md-convert':
			await mdConverter();
			break;
		case 'misc':
			await miscUtils();
			break;
		default:
			break;
	}

	outro('✅ Done!');
}

main();
