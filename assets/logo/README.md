# Cairn logo assets

The mark is a cairn: four stacked stones, narrowing towards the top. Read the other
way it is four rows of a table. That double reading is the whole idea, so keep the
stack intact and do not reorder or remove stones.

## Files

1. `cairn-mark.svg` - the symbol on its own, 32x32 viewBox, `fill="currentColor"`. Use this everywhere the surrounding text colour is right.
2. `cairn-mark-depth.svg` - the same geometry with a light opacity ramp from top to bottom. For hero areas and large sizes only.
3. `cairn-wordmark.svg` - symbol plus the word "Cairn". The lettering is Inter SemiBold converted to outlines, so no font file is needed at render time.
4. `cairn-wordmark-auto.svg` - the same wordmark with fixed colours that flip on `prefers-color-scheme`. For README files, where GitHub and npm render the file through an `<img>` and `currentColor` is not available.
5. `favicon.svg` - a three-stone version with fixed colours that flip on `prefers-color-scheme`. The four-stone stack closes up below 20 pixels, which is why the browser tab gets its own drawing.
6. `favicon-32.png`, `apple-touch-icon.png` (180x180), `favicon-512.png` - raster fallbacks.
7. `cairn-cover.svg` and `cairn-cover.png` - 1000x420 social card for dev.to, Bluesky and Open Graph.

## Colour

There is one colour. `cairn-mark.svg` and `cairn-wordmark.svg` inherit it through
`currentColor`, so a stylesheet decides:

```css
.logo { color: #18181b; }
html.dark .logo { color: #fafafa; }
```

Those two values are the `--cairn-text` pair already used by the shipped datatable
stylesheet, so the logo and the table stay in step.

## Clear space and minimum size

1. Keep clear space of at least one stone height, which is 5 units in the 32 unit
   viewBox, on every side.
2. Minimum size for the four-stone mark is 20 pixels. Below that use `favicon.svg`.
3. Minimum height for the wordmark is 20 pixels.

## Please do not

1. Add a gradient, an outline or a drop shadow.
2. Rotate the stack or tilt individual stones.
3. Re-set the wordmark in another typeface. Use `cairn-wordmark.svg` as it is.
4. Place the mark on a background that gives it less than a 4.5:1 contrast ratio.

## Rebuilding

`build.py` and `textpath.py` generate every file in this folder from the geometry
constants at the top of `build.py`. Inter SemiBold is the only external input.
