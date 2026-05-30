# devsr CLI

CLI helper tool for generating templates, downloading YouTube videos with `yt-dlp`, converting Markdown to PDF, and using reusable AI prompt blocks.

## Table of Contents

- [devsr CLI](#devsr-cli)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Local development setup](#local-development-setup)
    - [Make the CLI globally available](#make-the-cli-globally-available)
    - [Update after code changes](#update-after-code-changes)
    - [Unlink the global CLI](#unlink-the-global-cli)
  - [Publishing to npm](#publishing-to-npm)
  - [`yt-dlp` Setup](#yt-dlp-setup)
  - [`yt-dlp` Useful Commands](#yt-dlp-useful-commands)
  - [AI Prompt Blocks](#ai-prompt-blocks)
    - [Adding New Prompts](#adding-new-prompts)
      - [1. Define the prompt in `src/tools/prompt-library.ts`](#1-define-the-prompt-in-srctoolsprompt-libraryts)
      - [2. Register the shortcut in `src/index.ts`](#2-register-the-shortcut-in-srcindexts)

## Requirements

- Node.js
- pnpm
- TypeScript
- Python and `pip`, only needed for `yt-dlp`
- FFmpeg, only needed for video/audio merging

## Installation

### Local development setup

Install dependencies:

```bash
pnpm install
```

If pnpm blocks dependency build scripts, approve the required package builds:

```bash
pnpm approve-builds
pnpm install
```

Run the CLI in development mode:

```bash
pnpm dev
```

Build the project:

```bash
pnpm run build
```

The compiled output should be generated in:

```bash
dist/
```

### Make the CLI globally available

Your `package.json` should contain a `bin` entry like this:

```json
{
  "bin": {
    "devsr": "dist/index.js"
  }
}
```

Make sure your CLI entry file starts with a Node shebang.

At the top of `src/index.ts`:

```ts
#!/usr/bin/env node
```

Build and link the package globally:

```bash
pnpm run build
pnpm link --global .
```

Now the CLI should be available from anywhere:

```bash
devsr
```

Check where the command is linked:

```bash
which devsr
```

If pnpm says the global bin directory is not in `PATH`, run:

```bash
pnpm setup
source ~/.zshrc
```

For Bash users, reload Bash instead:

```bash
source ~/.bashrc
```

### Update after code changes

After editing the CLI source code, rebuild the project:

```bash
pnpm run build
```

Because the package is already linked globally, the `devsr` command should use the latest build automatically.

### Unlink the global CLI

To remove the globally linked command:

```bash
pnpm unlink --global @dev-sr/devsr
```

If needed, you can also check globally linked packages:

```bash
pnpm list --global --depth 0
```

## Publishing to npm

Log in to npm:

```bash
pnpm login
```

Or configure an npm token:

```bash
npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN
```

Before publishing, build the project:

```bash
pnpm run build
```

Publish as a public scoped package:

```bash
pnpm publish --access public
```

Update the package version before publishing a new release:

```bash
pnpm version patch
pnpm version minor
pnpm version major
```

Use only one version command depending on the type of release.

## `yt-dlp` Setup

Install `yt-dlp`:

```bash
pip install -U yt-dlp
```

Install FFmpeg.

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install ffmpeg -y
```

On Windows:

```powershell
winget install "FFmpeg (Essentials Build)"
```

For YouTube downloads that require login, export cookies from your browser using a cookies.txt extension, such as:

[Get cookies.txt LOCALLY - Chrome Web Store](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)

The first time you use the `devsr` YouTube downloader, enter the full path to your `cookies.txt` file. The path will be saved in `config.json` for future use.

To find the full path of the current directory:

```bash
pwd
```

## `yt-dlp` Useful Commands

List all available formats:

```bash
yt-dlp -F URL
```

Download video and audio separately, then merge:

```bash
yt-dlp -f "140+136" --cookies cookies.txt URL
```

Download 1080p video-only format with audio and merge as MP4:

```bash
yt-dlp -f "140+137" --merge-output-format mp4 --cookies cookies.txt URL
```

Download best video and best audio:

```bash
yt-dlp -f "bv+ba" URL
```

Download best video and best audio, with fallback to best single file:

```bash
yt-dlp -f "bv+ba/b" URL
```

Meaning:

- `bv+ba` downloads the best video stream and best audio stream separately, then merges them.
- `/b` falls back to the best single file if separate streams are not available.

Download best video up to 1080p with best audio:

```bash
yt-dlp -f "bv[height<=1080]+ba" URL
```

## AI Prompt Blocks

Inside `Misc Utils`, the `AI Prompt Blocks` utility provides reusable instruction blocks that can be placed before pasted user content.

Current prompt templates include:

- simple explanation
- notes generation
- step-by-step problem solving
- code explanation
- code generation
- debugging
- system design explanation
- project context extraction
- summarization
- actionable notes / next steps
- comparison of concepts

Recommended workflow:

1. Copy your source content.
2. Open `devsr`.
3. Go to `Misc Utils`.
4. Open `AI Prompt Blocks`.
5. Pick a prompt.
6. Choose `Merge with clipboard and copy back`.
7. Paste the merged result into your AI tool.

You can also choose `Copy prompt block only` if you want to paste the source content manually after the instruction block.

Clipboard support uses common system tools:

- macOS: `pbcopy` / `pbpaste`
- Linux Wayland: `wl-copy` / `wl-paste`
- Linux X11: `xclip` or `xsel`
- Windows: `clip` / PowerShell clipboard access

### Adding New Prompts

To add a new prompt template and register it as a command, follow these steps.

#### 1. Define the prompt in `src/tools/prompt-library.ts`

Add a new object to the `promptTemplates` array:

```ts
{
  name: 'My New Prompt',
  category: 'Learning', // Valid categories: 'Learning' | 'Coding' | 'Productivity'
  description: 'A brief description of what this prompt does.',
  prompt: `The actual prompt text goes here.

Context:

`
}
```

The logic in `src/tools/prompt-blocks.ts` automatically picks up new templates, so no changes are needed there.

#### 2. Register the shortcut in `src/index.ts`

To make your prompt available as a direct command, for example:

```bash
devsr prompt-my-new-one
```

add it to the `shortcuts` object:

```ts
const shortcuts: Record<string, ShortcutCommand> = {
  // ...existing shortcuts
  'prompt-my-new-one': {
    tool: 'prompt-blocks',
    category: 'Learning',
    template: 'My New Prompt', // Must match the name in prompt-library.ts
    action: 'clipboard-merge' // clipboard-merge, clipboard-prompt, or print
  },
};
```

Then add it to the `shortcutDescriptions` object:

```ts
const shortcutDescriptions: Record<string, string> = {
  // ...existing descriptions
  'prompt-my-new-one': 'Description for the help menu'
};
```

Rebuild the project:

```bash
pnpm run build
```

The new prompt will be available through the direct command and the interactive menus.
