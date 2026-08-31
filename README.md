# AR Face Painter V1.5 — Mobile Studio

V1.5 adds a mobile-first two-view workflow.

## Mobile views

### Mask Studio
A full-screen creation view for:
- brush painting
- erasing
- stamps
- emojis
- mask controls
- digital twin calibration guide

### Camera AR
A separate full-screen live camera view with:
- webcam preview
- live AR mask
- camera start/stop
- recalibration
- tracking/performance status

A fixed bottom navigation switches between **Mask Studio** and **Camera AR**.

## Mobile flow

1. Open the app on your phone.
2. Tap **Camera AR**.
3. Start the camera and complete calibration.
4. The app returns to **Mask Studio**.
5. Create the mask.
6. Tap **Camera AR** to see it live.

Desktop keeps the existing two-column layout.

## Run

```bash
python3 -m http.server 8080
```

For testing on a real phone, camera permissions usually require HTTPS when not using localhost. A local HTTPS dev server or deployed HTTPS URL is recommended.
