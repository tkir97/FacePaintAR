# AR Face Painter V1.5.3 — iOS Pinch Fix

This fixes pinch-to-zoom on iPhone Safari.

## What changed

The previous build handled pinch using Pointer Events directly on the transformed paint canvas. Safari can lose or confuse pointer tracking while that element is being transformed.

V1.5.3 instead:
- listens for native `touchstart` / `touchmove` on the stable outer paint wrapper
- reserves two-finger touches for zoom + pan
- leaves single-finger Pointer Events for drawing, stamps and emojis
- prevents Safari page zoom/callout inside the studio canvas

## Controls

- 1 finger: draw / erase / place stamp / place emoji
- 2 fingers: pinch to zoom + pan
- Reset zoom: restore 100%

