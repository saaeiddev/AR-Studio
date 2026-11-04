# AR Studio — Create Beyond Reality

An early development version of a browser-based 3D scene editor. Created by Amir Saeid Dehghan.

## Current functionality

Create boxes, spheres and cylinders; import GLB (up to 5 MB); select objects; manipulate transforms using gizmos or numeric fields; change mesh colors; duplicate and delete; orbit the camera; save automatically in localStorage and export/import a versioned JSON project. Preview hides the editor grid and gizmo. Internet access is required for the Three.js modules and font CDN. Local browser storage is limited; export backups regularly.

## Run locally

Serve this directory with an HTTP server, for example `python3 -m http.server 8080`, then open http://localhost:8080. Requires WebGL and a modern browser.

## Important limitations

This is a first editor foundation, not the requested finished product. AR/WebXR, surface tracking, behavior graphs, animation editing, project management, native Android/iOS export, independent web export, PWA, cloud builds and AI are not implemented. Preview is ordinary 3D, not AR. No APK, IPA, Xcode or Unity project is generated. GLB color modifications apply to all meshes and are not yet restored on reload. Device testing and actual screenshots are outstanding. Do not use for production work.
