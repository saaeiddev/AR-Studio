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

## Asset catalog work (experimental)

- Added a searchable third-party model catalog, plus a CC BY-SA brain atlas and CC0 static engine and circuit board, fetched remotely.
- Added descriptions on picking supported brain structures in 3D preview and exported viewer, and general descriptions for engine/board. Not all brain structures have descriptions; engine and board are not annotated internally.
- Unit tests validate catalog handling and allowlisted asset URLs. External catalog text and the upstream brain model file were confirmed available, but no WebGL rendering, interaction, exported mobile experience, AR tracking, or installable native app was verified. Sources: ASSET_CREDITS.md.

## AI Copilot

- Added neon prompt dialog, Farsi/English candidate matching, OpenAI Responses server adapter with JSON schema, allowlisted asset planning, preview/apply, and undo of last AI-created objects.
- Local-only backend uses environment credentials and validates both request and AI output. Seven unit tests pass. Manual local HTTP check returned 200 for the editor and a clear 503 when provider credentials are absent.
- No API key is configured; real model generation, provider API compatibility, browser apply, and end-to-end testing remain unverified. GitHub Pages has no AI backend, so public AI is not yet functional. A secure deployed backend with authentication, quota, rate limits and credentials is still needed. No native app builds, general game logic, or arbitrary 3D generation are provided.


## Browser AI fallback

- AI Copilot now attempts local WebLLM inference on WebGPU, without a key or an AI backend. Local AI downloads model weights on first use and has GPU/browser and memory requirements. It proposes scene plans using the existing allowlisted assets and the existing preview/apply pipeline.
- Unit tests exercise the generated request, successful structured result and errors using a mock engine; real inference and WebGPU cannot be tested on the available GPU-disabled browser. The earlier server adapter remains present but is no longer the default.
- This is a small on-device model, not a full app generator; it cannot create arbitrary new assets, complex behaviors or native apps.
