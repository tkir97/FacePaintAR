# AR Face Painter — GitHub Pages Build

Publish these files together:

- index.html
- face-worker.js
- canonical_face_model.obj

The canonical 468-vertex MediaPipe face geometry is bundled locally and loaded
with `./canonical_face_model.obj`.

The visible version badge beside the app title has been removed, and the browser
page title is now simply `AR Face Painter`.

GitHub Pages serves over HTTPS, so webcam access can work after camera permission
is granted.

Note: MediaPipe's JS/WASM/face-landmarker model URLs are still external CDN/model
dependencies. Only the canonical 3D geometry requested for this build is bundled.
