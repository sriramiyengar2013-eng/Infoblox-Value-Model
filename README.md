# Infoblox Value Model App

A simple static web app to compare the business value of Infoblox vs without Infoblox and competitor solutions.

## Features

- Conservative default assumptions for annual labor, incident cost, and risk reduction.
- Optional competitor comparison mode: keep the model focused on Infoblox vs no Infoblox until you need to compare.
- Infoblox product selector for `Infoblox DDI`, `Infoblox IPAM`, `BloxOne DDI`, and `Custom`.
- Input fields for adjusting numbers directly.
- Prompt-driven value updates via the `Update values by prompt` button.

## Run locally

1. Open `index.html` in a browser.
2. Adjust the assumptions.
3. Select the competitor and review the comparative result table.

## Files

- `index.html` — application UI
- `styles.css` — styling
- `app.js` — calculation logic, prompt inputs, and PowerPoint export

## Deployment options

This is a static HTML/CSS/JavaScript app, so the easiest deployment options are:

1. **GitHub Pages** (recommended for sharing publicly)
   - Create a GitHub repository.
   - Commit all files from this folder.
   - Push to GitHub.
   - In repository `Settings` → `Pages`, set source to `main` branch and `/ (root)`.
   - Your site will publish at `https://<your-github-username>.github.io/<repo-name>/`.

2. **Render static site**
   - Create a GitHub repository and push the code.
   - In Render, create a new `Static Site` and connect your GitHub repo.
   - Set the root directory to `/` and deploy.
   - Render will give you a shareable URL like `https://<site-name>.onrender.com`.

### Render deploy agent

Use the provided PowerShell agent to stage, commit, and push your changes before deploying to Render:

```powershell
cd C:\Users\srira\infoblox-value-model
.\render-deploy-agent.ps1
```

The script will guide you through:
- initializing Git if needed
- committing uncommitted changes
- configuring the GitHub remote
- pushing the branch to GitHub
- opening Render to create/connect your static site

### Quick Git setup (Windows)

If you have Git installed, run these commands from the app folder:

```powershell
cd C:\Users\srira\infoblox-value-model
ngit init
ngit add .
ngit commit -m "Initial Infoblox value model app"
ngit branch -M main
ngit remote add origin https://github.com/<your-username>/<repo-name>.git
ngit push -u origin main
```

### Recommended approach for sharing

- Use **GitHub Pages** when you want the simplest public URL and easy sharing.
- Use **Render** when you want a managed deployment dashboard, automatic rebuilds, and a custom domain.

Both options work well for a static app like this.

## Competitor assumptions

Values for competitor efficiency and incident rates are based on public market comparison sources and peer review summaries from sites such as PeerSpot, SourceForge, and industry analysis content like ControlD.
