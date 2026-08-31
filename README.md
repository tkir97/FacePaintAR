# AR Face Painter V1.5.1 — Mobile Performance

This version specifically targets iPhone / mobile lag.

## Mobile optimizations

- Detection throttled to about 15fps on mobile instead of attempting every camera frame.
- AR rendering still runs on the browser animation loop.
- Short-term landmark prediction fills the gaps between MediaPipe detections.
- Mobile camera request reduced to roughly 480×360 where supported.
- WebGL antialiasing disabled on mobile.
- Output device-pixel-ratio capped at 1 on mobile.
- WebGL requests high-performance GPU preference.
- Desktop keeps the faster 30fps detection path.

## Why this helps

On mobile, MediaPipe `detectForVideo()` can occupy a large part of the main thread. Trying to run inference on every video frame can actually make the overlay feel later because frames queue behind expensive detection work.

This version prioritizes responsiveness:
- detect less often
- render more often
- predict very short-term motion between detections

## Run

```bash
python3 -m http.server 8080
```

For a real iPhone, use an HTTPS deployment or HTTPS dev server for camera access.
