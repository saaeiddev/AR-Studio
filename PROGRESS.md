# Development progress

## Implemented

- Early browser 3D editor, primitives, GLB import, transforms, color editing, localStorage save, JSON project import/export and 3D preview.
- Single per-object tap-to-rotate interaction, exercised in editor preview and included in a generated HTML player.
- Experimental WebXR hit-test placement code in the exported player, with 3D fallback and an unsupported-device message.
- GLB color overrides now persist in saved projects and exports.

## Verification

- `node --check app.js` and `node --check web-export.js`: passed.
- `node --test tests/*.test.mjs`: two tests passed, covering exported project encoding/escaping and generated module syntax.
- GitHub Pages workflow successfully deployed the editor and ran the tests. The online page and its Three.js modules loaded, but the remote test browser could not create a WebGL context (GPU disabled); rendering, input, download, persistence, and physical-device AR remain unverified. No screenshots claimed.

## Outstanding

- Physical device WebXR testing and bug fixing; visual graph, animations, physics, game systems, asset management; robust schema/migrations and IndexedDB; undo/redo; offline packaging and PWA; native runtime projects and build infrastructure; design assets; production browser and device verification.
- Three.js and fonts require a CDN. LocalStorage limits saved project size and imported GLBs with external resources are not supported reliably. Export is a single HTML file but not offline/self-contained because it fetches library code.
