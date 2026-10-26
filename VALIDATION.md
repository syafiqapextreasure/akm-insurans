# Validation — 27 October 2026

- Built 27 complete HTML pages (24 requested designs, privacy, terms and 404).
- Seven automated content, local-link, structured-data, review-privacy, portrait-placement and Worker response tests pass.
- 104 browser checks across all 26 indexed routes at 320px, 768px, 1440px and 2560px found no horizontal overflow, one H1 per page, no failed loaded images and the large hero portrait only on the homepage.
- Verified both videos (29.5 and 33.0 seconds, ready state 4, no media errors), required-product form validation, mobile navigation, product choice to enquiry dialog, blog category/search/no-results behavior and native FAQ expansion.
- Verified computed desktop font scaling: body 17px / 20.16px / 26.88px and supporting copy/buttons 16px / 19.2px / 25.6px at 1440 / 1920 / 2560px respectively. Tertiary text reaches 23.04px at 2560px.
- Shared opaque SVG hero curves are separated from standalone high-resolution photographs. Visually checked homepage, car, commercial vehicles, marine, blog and reviews at 2560px; the curves remain clear of the vehicle subjects. Overlapping panels and homepage name badge remain visible.
- All seven overview product-card image boxes were measured at the same 762px width as their cards at 2560px. No blank image strips remain.
- Contact banners now sit outside the constrained content container, directly adjoining the illustrated footer. Checked the portrait, mint/green waves and forest-road footer at desktop and phone widths.
- Replaced enlarged mockup crops with 21 high-resolution derivatives (1536×1024 scenes and 1024×1536 portrait). Real portrait alpha was checked. These are reconstructed derivatives; see ASSET-NOTES.md for limitations and provenance.
- Both original videos are served with range-response support, native controls, preview posters and no autoplay.
- WhatsApp actions prepare a message for the visitor to review; no customer messages were sent during testing.
- Local preview uses the same Worker request handler with a development asset adapter.

## Deployment validation

The Windows execution environment blocks native subprocess creation (spawn EPERM), so local Wrangler/esbuild dry-run could not execute. GitHub Actions successfully ran npm ci, npm run check and npx wrangler deploy --dry-run on Linux for source commit 4e5916b1f9d78a057fccdb2a50b6ab8ed1f27515. All stages passed: https://github.com/syafiqapextreasure/akm-insurans/actions/runs/40372478109.

The owner connected Cloudflare Workers Builds to the main branch. The compatibility-date correction in fc38d3a94bdf97bb053f870a4d17ce2a5d43378a deployed successfully before this visual revision. Subsequent pushes are checked by GitHub Actions and the connected Cloudflare build. Custom-domain setup is outside this revision.
