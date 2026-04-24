#!/usr/bin/env node
import { intro, outro, select, cancel, isCancel } from '@clack/prompts';
import promptBlocks from './tools/prompt-blocks';
import youtubeDownloader from './tools/youtube';
import mdConverter from './tools/md-converter';
import miscUtils from './tools/misc-utils';

async function main() {
	intro('⚡ dev-sr - Multi-tool CLI');

	const choice = await select({
		message: 'Choose a tool',
		options: [
			{ value: 'prompt-blocks', label: '🧠 AI Prompt Blocks' },
			{ value: 'yt', label: '🎬 YouTube Downloader' },
			{ value: 'md-convert', label: '📄 Markdown Converter' },
			{ value: 'misc', label: '🧰 Misc Utils' },
			{ value: 'exit', label: '❌ Exit' }
		]
	});

	if (isCancel(choice) || choice === 'exit') {
		cancel('Exiting...');
		process.exit(0);
	}

	switch (choice) {
		case 'prompt-blocks':
			await promptBlocks();
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
