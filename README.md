# AR Face Painter V1.6.2 — Extended Forehead Mesh

This is a structural forehead-coverage upgrade.

## Why the previous version still stopped too low

Increasing the painter crop does not extend the actual MediaPipe face mesh. MediaPipe's normal tessellation ends around the upper forehead, so artwork above that line had no geometry to render onto.

## What V1.6.2 changes

V1.6.2 creates **two synthetic rows of forehead vertices** above the normal face mesh and connects them to the existing upper-face landmarks.

The live renderer now has an extended forehead cap, allowing paint to project significantly higher than the standard MediaPipe boundary.

The Mask Studio shows the top of the new region with a yellow dashed **EXTENDED FOREHEAD** guide.

## Notes

The synthetic forehead region follows head position, scale and roll based on the real upper-face landmarks. It is extrapolated geometry rather than directly detected scalp landmarks, because MediaPipe does not provide tracking points all the way to the hairline.

After opening this build, rebuild the digital twin once.

## Run

```bash
python3 -m http.server 8080
```
