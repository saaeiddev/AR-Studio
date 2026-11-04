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
