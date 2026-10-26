# Asset provenance

All `01-*.webp` through `24-*.webp` are lossless encodings of the approved Signature Green v2 page designs generated in this project. Source filenames, dimensions and encoded sizes are recorded in `src/design-assets.json`. They are retained as design references; production pages no longer enlarge small crops from these mockups.

## Production imagery — 27 October 2026

The 21 images in `public/assets/production/` are separate high-resolution derivatives prepared with the built-in image-generation editing tool. The landscape assets are 1536×1024; the isolated portrait is 1024×1536 with real alpha transparency. They are encoded as WebP at quality 94. Original generated PNG siblings are preserved in the local project `outputs/production-assets/` directory, outside the deployment.

These assets reconstruct detail from the approved mockups, rather than being lossless enlargements or untouched originals. They retain the subjects, palette and scene style, but fine photographic details can differ. The portrait derives from the owner-supplied photograph, not a crop of a website screenshot.

Reference mapping:
- Home: `01-utama.png`; car: `03-insurans-kereta.png`; bike: `04-insurans-motosikal.png`; truck/van/bus: `05-kenderaan-komersial.png`.
- House, shop, boat, takaful: the corresponding `06`–`09` approved page mockups.
- City, NCD and flood: photographs in `12-blog.png`.
- Coast, travel, personal, industry, cargo, contractor, agriculture and liability: `23-insurans-am-lain.png`.
- Footer road: the owner's supplied footer reference `codex-clipboard-fa0eada0-e68c-4260-aea5-830a1c06a2db.png`.
- Portrait: `codex-clipboard-95375fc9-62cd-465d-be82-9d04a37d6928.png`, followed by a transparent-background cleanup pass.

Generation mode: reference-image edit. Scene prompt pattern: “Extract and restore ONLY the photograph of [reference subject] from this approved mockup. Standalone crisp high-resolution 3:2 landscape, maximum resolution. Preserve subject, colors, setting and style. Remove all website UI, text, green overlays and buttons. Keep the entire subject visible with generous road/scenery margins, suitable for a wide crop. No blurring, halos or painterly smoothing.” Hero variants requested subjects in the right 65% and central vertical 65% to leave space for the separate curve.

Portrait prompt: “Remove the white background and paper border completely to genuine transparent alpha. Preserve exact identity, facial geometry, expression, skin tone, gray suit, striped tie and pose. Clean compression and mild blur conservatively. No scenery, text or frame.” Cleanup requested removal of all background haze, opaque person pixels and precisely cut edges.

The green hero curves, mint contact-banner waves, icons, text and buttons are native SVG/HTML/CSS. They remain sharp at every viewport size. The large portrait appears only in the homepage hero; seven selected pages retain the smaller portrait contact strip.

`videosale1.mp4` and `videosale2.mp4` are the two videos supplied by the website owner. The JPG posters are local frame extractions from those supplied videos. The person pictured is identified by the owner as Abdul Kata bin Haji Burijin. His user-supplied biography and business contact information are intentionally included in the website.

`chat-pattern.svg`, `favicon.svg` and inline interface SVGs are project-created vector artwork.

Inter is self-hosted from `@fontsource/inter` under the SIL Open Font License. See `public/assets/INTER-LICENSE.txt`.
