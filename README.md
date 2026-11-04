# AR Studio — Create Beyond Reality

An early-development browser-based 3D editor by Amir Saeid Dehghan. This is not yet a complete AR app/game creation platform.

## What is implemented

- Add boxes, spheres, cylinders and GLB models (up to 5 MB per file); edit transforms with gizmos or numeric inputs, colors, names and a simple tap-to-rotate interaction.
- Orbit the viewport, duplicate or delete objects, autosave the current project locally, and import/export a versioned JSON backup.
- Preview the scene in 3D and test the tap interaction; preview rotations are reset on exit.
- Export a standalone HTML scene player with embedded scene data, 3D orbit controls, tap-to-rotate and experimental WebXR hit-test surface placement where the device and browser support immersive AR. The HTML still requires an internet connection to load Three.js; it is not an offline package or a PWA.

## Run

Run `python3 -m http.server 8080` in this directory and open http://localhost:8080 in a modern WebGL-capable browser. For WebXR camera access, serve the exported HTML over HTTPS on a compatible device/browser. iOS Safari does not provide equivalent WebXR immersive AR support; use the 3D viewer instead. AR support and behavior vary by device. The app loads Three.js and fonts from third-party CDNs.

## Test

Run `node --test tests/*.test.mjs`. These tests cover web export encoding and generated JavaScript syntax, not real browser rendering or AR tracking.

## Limitations and unfinished work

The WebXR path is experimental and has not been tested on a physical device; 3D editor and player interaction have not been verified in a browser in the current environment. Native Android/iOS project export, APK/IPA builds, visual node graphs, advanced game logic, animations, project dashboard, undo/redo, IndexedDB, and offline PWA are not implemented. The current interaction is a simple property, not a visual scripting editor. No native build is generated. LocalStorage has browser-dependent size limits; export JSON backups regularly. Imported GLB assets with external resources may not work. Use only trusted projects and assets. See PROGRESS.md.

## Ready-made models (experimental)

The asset browser fetches a Kenney CC0 collection (primarily stylized low-poly), a static engine, a circuit board, and a named brain anatomy model. Use Explore asset library, choose a model, then Preview and tap the brain to see a label and, where provided by its source, an English description. Web exports include the same experimental picking code. The brain model and descriptions are CC BY-SA; see [ASSET_CREDITS.md](ASSET_CREDITS.md). Models remain remotely hosted and require network access. Loading, picking and AR on mobile devices have not yet been verified. Native installation is not available. The engine and circuit board are static and show only general descriptions, not full annotated part diagrams.

## AI Copilot (local development)

The editor includes a neon prompt interface. A server-side OpenAI integration can propose a small scene from the existing, allowlisted library; proposals are validated and displayed before application. It does not generate new 3D geometry or a full app/game, and cannot provide unsupported features. Generated scene objects can be undone using the AI dialog.

GitHub Pages uses the browser-based AI described below. To use the optional separate OpenAI server adapter locally instead, use Node 20+ and configure a server-side API key and a model that supports Responses structured outputs:

```sh
export OPENAI_API_KEY='your-key'
export OPENAI_MODEL='your-supported-model'
node server/ai-server.mjs
```

Then open `http://127.0.0.1:8787/`. The current UI defaults to browser AI; the server adapter is available for separate integration. The key is read only by the local server, never sent to the browser or committed. The server binds to localhost and is not designed for public hosting; authentication, quotas, rate limiting, abuse controls, and HTTPS must be implemented before deploying a shared version. The prompt and catalog metadata are sent to the AI provider. No provider request has been tested in this environment because no API key is configured. API usage may incur charges.

## Browser-based AI (experimental)

The published editor now attempts to run Qwen2.5-1.5B locally in the browser through WebLLM; an API key or backend is not required. A WebGPU-compatible browser/GPU, sufficient GPU memory, and internet for the initial large model and asset downloads are required. The model runs on-device and is smaller and less capable than hosted AI. The model and assets are hosted externally. The returned scene is validated and reviewed before it is applied. This is not an automatic full native application/game builder. Inference has not been tested on a real GPU in this environment. The earlier local server adapter remains optional.
