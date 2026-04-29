# MEMORY.md

This file is for future AI agents working in this repository. Read it first to get project context quickly.

## Project Summary

`devsr-cli` is a TypeScript Node CLI published as `@dev-sr/devsr`. The executable command is `devsr`, built from `src/index.ts` into `dist/index.js`.

The CLI currently provides:

- AI prompt blocks that can be printed, copied, or merged with clipboard content.
- YouTube downloading through `yt-dlp` and `ffmpeg`.
- Markdown conversion to PDF/HTML/DOCX/EPUB/LaTeX.
- Misc utilities, currently Markdown heading transformation.
- Some .NET generation helpers exist in source but are not wired into the main CLI menu at the time this file was written.

## Commands

- Install dependencies: `pnpm install`
- Development run: `pnpm dev`
- Build: `npm run build` or `pnpm run build`
- Main CLI after build/link: `devsr`
- Prompt shortcut examples:
- `devsr prompt-explain-clipboard`
- `devsr prompt-notes-clipboard`
- `devsr prompt-youtube-notes-clipboard`
- `devsr prompt-debug-clipboard`
- `devsr prompt-learning`
- `devsr prompt-coding`
- `devsr prompt-productivity`

## Important Files

- `src/index.ts`: CLI entrypoint, top-level menu, shortcut command mapping, help output.
- `src/tools/prompt-library.ts`: All prompt template definitions. Each template has `name`, `category`, `description`, and `prompt`.
- `src/tools/prompt-blocks.ts`: Interactive prompt-template picker and clipboard actions.
- `src/tools/youtube.ts`: YouTube downloader flow using `yt-dlp`, `ffmpeg`, and saved cookie path.
- `src/tools/md-converter.ts`: Converts Markdown files in the current working directory. Uses `md-to-pdf` for PDF and `pandoc` for other formats.
- `src/tools/misc-utils.ts`: Misc CLI utilities. Currently transforms README Markdown heading levels by selected line range.
- `src/config.ts`: Reads/writes `~/.dev-sr-config.json`.
- `src/utils.ts`: Small dependency and cookie-path helpers.
- `src/tools/dotnet-project.ts`: Copies a .NET template, but is not currently wired into `src/index.ts`.
- `src/tools/dotnet-srcgen.ts`: Generates simple .NET Service/Repository/Controller files, but is not currently wired into `src/index.ts`.
- `templates/dotnet-webapi/`: Template files for the .NET project generator.

## Prompt Blocks Flow

`src/index.ts` stores shortcut commands in `shortcuts`. A shortcut can set:

- `tool`: currently one of `prompt-blocks`, `yt`, `md-convert`, or `misc`.
- `category`: `all`, `Learning`, `Coding`, or `Productivity`.
- `template`: must match a prompt template `name`.
- `action`: `clipboard-merge`, `clipboard-prompt`, or `print`.

`src/tools/prompt-blocks.ts` filters templates by category, finds the selected template by `name`, then:

- `print`: prints template name, description, and prompt.
- `clipboard-prompt`: copies only the prompt block to the clipboard.
- `clipboard-merge`: reads current clipboard content, prepends the prompt block, and writes the merged content back.

Clipboard support:

- macOS: `pbpaste` / `pbcopy`
- Windows: PowerShell `Get-Clipboard` / `clip`
- Linux Wayland: `wl-paste` / `wl-copy`
- Linux X11: `xclip` or `xsel`

## Prompt Review Notes

The current prompt set is useful and practical, but there are several improvement opportunities.

Previously fixed:

- The previous duplicate `Notes Generator` templates were renamed to `Concise Notes Generator` and `Beginner-Friendly Notes`.
- Prompt templates were tightened with more consistent source-faithfulness and anti-hallucination rules.
- Output structures were made more explicit per prompt type.

Remaining opportunities:

- Consider adding stable `id` fields so shortcuts do not depend on user-facing names.
- Consider moving shared prompt rules into helpers if the prompt library grows much larger.
- Consider adding tests or validation to prevent duplicate prompt names.

Template-specific notes:

- `Beginner-Friendly Explanation`: Explains source content with intuition, preserved examples, summary, and check question.
- `YouTube Caption Notes`: Converts messy captions into notes, preserves timestamps when useful, and labels likely missing visuals.
- `Concise Notes Generator`: Produces compact source-faithful notes with takeaways and review items.
- `Step-by-Step Problem Solving`: Separates the question, given information, assumptions, solution, and final answer.
- `Concept Comparison`: Compares concepts using tables when useful and labels unsupported inference.
- `Beginner-Friendly Notes`: Produces richer learning notes with intuition, key takeaways, review items, and a check question.
- `Code Generation`: Generates practical code with assumptions, usage, and tests or verification when useful.
- `Debugging Assistant`: Uses evidence, confidence-ranked root causes, minimal fixes, and verification steps.
- `System Design Explanation`: Covers components, flows, tradeoffs, assumptions, and failure modes.
- `Summarization`: Preserves key facts, numbers, names, dates, decisions, and constraints.
- `Actionable Notes and Next Steps`: Extracts decisions, action items, open questions, and risks without inventing owners or dates.

Do not edit prompt text without asking the user first. The user explicitly asked to be asked for permission before prompt edits.

## Recently Added Prompt

`YouTube Caption Notes` was added to `src/tools/prompt-library.ts` as a Learning template for converting YouTube captions into notes.

Shortcut added in `src/index.ts`:

```bash
devsr prompt-youtube-notes-clipboard
```

This shortcut uses:

- `category: 'Learning'`
- `template: 'YouTube Caption Notes'`
- `action: 'clipboard-merge'`

## Current Known Issues / Risks

- `src/index.ts` currently has mixed line endings after recent edits. Git warned: `CRLF will be replaced by LF the next time Git touches it`.
- `README.md` says AI Prompt Blocks are inside Misc Utils, but the current CLI has `prompt-blocks` as a top-level tool.
- `README.md` mentions prompts like "code explanation", but the current prompt library does not include a `Code Explanation` template.
- `README.md` says users can choose "Copy prompt block only"; current UI label is `Prompt for clipboard content`, but behavior copies the prompt block only. The label is likely confusing.
- `youtube.ts` asks for an absolute path to `cookies.txt`, validates that path, stores it as `cookiePath`, but later builds `--cookies "${config.cookiePath}\\cookies.txt"`. This suggests `cookiePath` is treated as a directory later, not a file. This may break cookie usage.
- `dotnet-project.ts` and `dotnet-srcgen.ts` are not reachable from the top-level menu.
- `promptTemplates` still uses `name` as the identifier. Duplicate names are currently avoided, but a future refactor should add a stable `id` field and use that for shortcuts/select values.

## Style / Conventions

- Code uses TypeScript with `strict: true`, CommonJS modules, and ES2020 target.
- Formatting is inconsistent across files: some use tabs and single quotes, others use spaces and double quotes.
- Prefer matching the style of the file being edited unless doing a deliberate formatting cleanup.
- Manual edits should preserve user changes and avoid unrelated cleanup unless requested.
- Build validation should run with `npm run build` or `pnpm run build`.

## Safe Next Improvements

Ask the user before applying these:

- Add an `id` field to prompt templates to avoid depending on user-facing names.
- Add a duplicate-name validation check for prompt templates.
- Add a `Code Explanation` prompt or update `README.md` so docs match reality.
- Rename `clipboard-prompt` UI label from `Prompt for clipboard content` to `Copy prompt block only`.
- Fix the YouTube cookie path handling.
- Wire `.NET` tools into `src/index.ts` or remove unused source if not needed.
