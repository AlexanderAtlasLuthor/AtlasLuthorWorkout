# Atlas Luthor Workout

React/Vite PWA for the Atlas Luthor workout protocol.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare Pages

Use these settings when creating the Pages project:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

After logging in locally with Cloudflare, you can also deploy from the terminal:

```bash
npm run deploy:cloudflare
```
