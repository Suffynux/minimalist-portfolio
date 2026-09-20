# Midjourney prompts for /creatives

28 images replace the Pexels placeholders in `lib/data.ts`. They're grouped into
the four sections the page already renders.

## Before you start

**House style.** Every prompt ends with the same style suffix so the set reads as
one body of work rather than 28 unrelated images. Keep it identical:

```
muted olive and bone palette, #5F6B3A and #F2F0E9, soft natural light,
fine film grain, editorial, restrained, no text --style raw --v 6.1
```

**Aspect ratios.** The page uses a masonry grid, so portrait works best in the
column sections and landscape in the two hero slots:

| Where | Ratio | Flag |
|---|---|---|
| Section tiles (01–04) | portrait | `--ar 3:4` |
| Hero cards | landscape | `--ar 16:10` |

**Resolution.** Upscale each pick, then export at **1400px on the long edge or
more**. The tiles render up to 700px wide on retina, so anything smaller will
look soft — that was the original bug.

---

## 01 — Visual direction (6 images, portrait)

The moodboard section. Abstract, textural, no literal subjects.

1. `abstract olive gradient study, layered translucent planes, soft falloff, [style]  --ar 3:4`
2. `close-up of woven linen texture in bone white, raking light, shallow depth of field, [style] --ar 3:4`
3. `minimal sculptural form in matte clay, single soft shadow, studio backdrop, [style] --ar 3:4`
4. `topographic contour lines in olive on cream paper, printed texture, macro, [style] --ar 3:4`
5. `soft focus botanical silhouette behind frosted glass, olive tones, [style] --ar 3:4`
6. `torn paper collage edges, bone and sage layers, subtle drop shadow, [style] --ar 3:4`

## 02 — Brand concepts (8 images, portrait)

Identity work. These should look like real deliverables photographed on a desk.

7. `minimal logo mark embossed on bone business card, olive ink, macro, [style] --ar 3:4`
8. `brand colour swatch cards fanned on a warm concrete surface, olive family, [style] --ar 3:4`
9. `typography specimen sheet, large serif letterform, printed on textured stock, [style] --ar 3:4`
10. `matte packaging box with blind-deboss logo, soft studio light, [style] --ar 3:4`
11. `folded stationery set flat lay, bone paper, olive accent, overhead, [style] --ar 3:4`
12. `enamel pin badge on canvas tote, shallow depth of field, [style] --ar 3:4`
13. `brand guidelines book open to a grid page, natural window light, [style] --ar 3:4`
14. `signage mockup on a plaster wall, cut metal letters, long shadow, [style] --ar 3:4`

## 03 — Product & UI (6 images, portrait)

Interface work in physical context. Keep screens abstract — no fake copy.

15. `laptop on a walnut desk showing an abstract dashboard interface, olive accents, natural light, [style] --ar 3:4`
16. `smartphone held in hand displaying a minimal app screen, blurred background, [style] --ar 3:4`
17. `tablet propped on a stand, soft UI grid visible, morning light, [style] --ar 3:4`
18. `product box beside a phone showing a matching storefront screen, [style] --ar 3:4`
19. `desktop monitor on a clean desk, abstract analytics layout, olive data bars, [style] --ar 3:4`
20. `stack of printed UI wireframes with a pencil, overhead, bone paper, [style] --ar 3:4`

## 04 — Abstract & texture (8 images, portrait)

Raw material. The most experimental of the four.

21. `macro of olive ink bleeding into wet cotton paper, [style] --ar 3:4`
22. `smooth sand ripples in low sun, bone and shadow, aerial, [style] --ar 3:4`
23. `crumpled tracing paper lit from behind, soft glow, [style] --ar 3:4`
24. `long exposure light trail in olive over dark ground, [style] --ar 3:4`
25. `cross-section of layered sedimentary rock, muted earth bands, [style] --ar 3:4`
26. `soap film iridescence desaturated to olive and bone, macro, [style] --ar 3:4`
27. `dense fog over a low hill at dawn, minimal, high key, [style] --ar 3:4`
28. `fine mesh fabric stretched over a frame, moiré pattern, backlit, [style] --ar 3:4`

---

## Hero cards (2 images, landscape)

These sit at the top of `/creatives` with a caption overlaid on the bottom-left,
so **keep the lower-left third visually quiet** — no busy detail there.

- **Featured:** `wide abstract composition, olive gradient sweeping across bone ground, generous negative space in the lower left, [style] --ar 16:10`
- **Series:** `atmospheric landscape at dusk, low horizon, muted olive sky, empty foreground, [style] --ar 16:10`

---

## Wiring them in

1. Put the exported files in `public/creatives/` with predictable names:
   `01-direction-1.jpg` … `04-texture-8.jpg`, plus `hero-featured.jpg` and
   `hero-series.jpg`.

2. In `lib/data.ts`, the gallery currently builds URLs through the `pexels()`
   helper and `mk()`. Replace that with local paths — the `mk()` signature stays
   the same, so only the image source changes:

   ```ts
   const local = (section: string, n: number) => `/creatives/${section}-${n}.jpg`;
   ```

3. Once real work is in place, the copy can go back to claiming it. Revert the
   three hedges I added:
   - section label `01 - VISUAL DIRECTION` → `01 - AI ARTWORK`
   - section title `Moodboard` → `Generative art`
   - the page intro and section `desc` in `lib/data.ts`

   That copy is only understated because the images are currently stock.
