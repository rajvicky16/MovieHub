# 🔧 Netlify Build Fix Guide

## Current Error Analysis
The error shows:
- Netlify can't find `package.json`
- It's looking in `/opt/build/repo/` but your files might be in `/opt/build/repo/vite-project/`
- UI settings are overriding netlify.toml

## Solution Steps

### Step 1: Check Your GitHub Repository Structure
Your repository should look like this:
```
MovieHub/
├── vite-project/          ← Your React app is here
│   ├── package.json       ← This is what Netlify needs
│   ├── netlify.toml       ← Configuration file
│   ├── index.html
│   ├── src/
│   └── dist/ (after build)
└── README.md (optional)
```

### Step 2: Fix Netlify Settings
Go to your Netlify dashboard:

1. **Site settings** → **Build & deploy** → **Build settings**
2. Update these settings:
   - **Base directory**: `vite-project`
   - **Build command**: `npm run build`
   - **Publish directory**: `vite-project/dist`

### Step 3: Alternative netlify.toml
If your structure is different, try this configuration:

```toml
[build]
  # If your package.json is in the root
  base = "."
  publish = "dist"
  command = "npm run build"

# OR if your package.json is in vite-project folder
[build]
  base = "vite-project"
  publish = "vite-project/dist"
  command = "npm run build"
```

### Step 4: Environment Variables
Make sure these are set in Netlify:
- `VITE_TMDB_API_KEY` = `3aec63790d50f3b9fc2efb4c15a8cf99`
- `SECRETS_SCAN_OMIT_KEYS` = `VITE_TMDB_API_KEY`

## Quick Test
Try deploying with these exact settings:
- Base directory: `vite-project`
- Build command: `npm run build`  
- Publish directory: `vite-project/dist`