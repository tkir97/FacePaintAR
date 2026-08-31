# AR Face Painter V1.5.2 — Pinch Zoom

This version adds mobile-friendly navigation inside the Mask Studio.

## New

- Pinch to zoom the digital twin and mask drawing canvas
- Two-finger pan while zoomed
- Reset zoom button
- Live zoom percentage badge

## Notes

- Single finger still draws / erases
- Stamp and emoji modes still place items with a tap
- Two-finger gestures are reserved for zooming and panning
- The zoom transform affects the studio view only, not the underlying face geometry or exported paint

## Run

```bash
python3 -m http.server 8080
```

For iPhone testing, use HTTPS or localhost.
