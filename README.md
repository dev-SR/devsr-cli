# CLI

<!-- TOC -->

- [CLI](#cli)
  - [Setup](#setup)
    - [🔨 Build \& link locally with pnpm](#-build--link-locally-with-pnpm)
      - [Re-build \& re-link (if already linked globally)](#re-build--re-link-if-already-linked-globally)
    - [📦 Publish to npm (public package)](#-publish-to-npm-public-package)
    - [🔁 Updating during dev](#-updating-during-dev)
  - [`yt-dlp` setups](#yt-dlp-setups)
  - [AI Prompt Blocks](#ai-prompt-blocks)

## Setup

### 🔨 Build & link locally with pnpm

```bash
# 1. Install dependencies
pnpm install

# 2. Dev run 
pnpm dev

# Publish locally in global 
# 3. Build project (make sure "build" script exists in package.json)
pnpm run build

# 3.1 Creates a global bin directory
pnpm setup

# 3.2 Link globally (makes dev-sr command available everywhere)
pnpm link --global
```

#### Re-build & re-link (if already linked globally)

```bash
pnpm run build
pnpm unlink --global
pnpm link --global
```

### 📦 Publish to npm (public package)

First, make sure you’re logged in:

`pnpm login`

Then publish:

`pnpm publish --access public`

---

### 🔁 Updating during dev

When you edit the CLI:

`pnpm run build`

It’s already linked globally, so `dev-sr` will pick up the changes automatically.

---

⚡ Extra tip: If you want to unlink later:

`pnpm unlink --global`

## `yt-dlp` setups

1. Install `yt-dlp`

```bash
pip install -U yt-dlp
```

2. Install `winget`

```bash
winget install "FFmpeg (Essentials Build)"
# linux
sudo apt install ffmpeg -y
```

3. Download youtube cookies with logged in using [Get cookies.txt LOCALLY - Chrome Web Store](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc?pli=1) extension.

First time using  `devsr` you have enter full path to the cookies.txt file, but after that it will be saved in `config.json` for future use.

```bash
pwd
```


`yt-dlp ` commands:

1. List all available formats

```bash
yt-dlp -F URL
```

2. Download video + audio separately and merge 
   
   examples:

```bash
yt-dlp -f "140+136" --cookies cookies.txt URL
```

```bash
yt-dlp -f "140+137" --merge-output-format mp4 --cookies cookies.txt URL
```

  👉 downloads `137` (1080p video-only) + `140` (m4a audio), then merges into one file.

3. Advance options
   
   1. **best audio + best video:**
      
      ```bash
      yt-dlp -f "bv+ba" URL
      ```
      
      ```bash
      yt-dlp -f "bv+ba/b" URL
      ```

            `-f "bv+ba/b"` means:

- Try downloading the **best video stream** + **best audio stream** separately, then merge them.

- If that fails (site doesn’t provide separate streams), fall back to the **best single file** that already contains both video and audio.
  
  2. **Best video ≤1080p with best audio**:
     
     ```bash
     yt-dlp -f "bv[height<=1080]+ba" URL
     ```


## AI Prompt Blocks

Inside `Misc Utils`, there is now an `AI Prompt Blocks` utility for reusable instruction blocks that go before pasted user content.

It includes prompt templates for:

- simple explanation
- notes generation
- step-by-step problem solving
- code explanation
- code generation
- debugging
- system design explanation
- summarization
- actionable notes / next steps
- comparison of concepts

Recommended workflow:

1. Copy your source content first.
2. Open `devsr` → `Misc Utils` → `AI Prompt Blocks`.
3. Pick a prompt.
4. Choose `Merge with clipboard and copy back`.
5. Paste the merged result into your AI tool.

You can also choose `Copy prompt block only` if you want to paste the source content manually after the instruction block.

Clipboard support uses common system tools:

- macOS: `pbcopy` / `pbpaste`
- Linux Wayland: `wl-copy` / `wl-paste`
- Linux X11: `xclip` or `xsel`
- Windows: `clip` / PowerShell clipboard access
