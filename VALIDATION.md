# Validation — 27 October 2026

- Built 27 complete HTML pages (24 requested designs, privacy, terms and 404).
- Seven automated content, local-link, structured-data, review-privacy, portrait-placement and Worker response tests pass.
- Browser checks across all 24 design routes at 320px, 768px and 1920px found no horizontal overflow and one H1 per page.
- Verified video 1 playback (29.5 seconds, ready state 4, no media error), mobile navigation, product choice to enquiry dialog, blog category/search/no-results behavior and native FAQ expansion.
- Desktop supporting typography increased for older readers: 19px body, 17px navigation/buttons and 16px tertiary/footer at 1600px and above.
- Replaced overlapping translucent hero decorations with an opaque curved panel and visible green waves. All 24 page heroes share the refined treatment. Each reference image has its own crop boundary to avoid exposing baked text and page sections. Home preserves the approved portrait/car/motorcycle composition; the service cards overlap the lower hero background without covering the name panel.
- Approved PNG artwork was losslessly encoded to WebP with pixel equality verified. Original generated-image shading remains in that artwork.
- Both original videos are served with range-response support, native controls, preview posters and no autoplay.
- WhatsApp actions prepare a message for the visitor to review; no customer messages were sent during testing.
- Local preview uses the same Worker request handler with a development asset adapter.

## Deployment validation

The Windows execution environment blocks native subprocess creation (spawn EPERM), so local Wrangler/esbuild dry-run could not execute. GitHub Actions is configured to run npm ci, npm run check and npx wrangler deploy --dry-run on Linux. Check the repository Actions result before production deployment.

No Cloudflare account deployment or custom-domain setup has been performed. Cloudflare import settings are in README.md.
