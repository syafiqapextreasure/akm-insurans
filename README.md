# Insurans & Roadtax MY

Responsive Malay-language website based on the approved Signature Green designs. Includes 24 main/product/blog pages, plus privacy, terms and a real 404 page. The homepage is the only page with a large salesperson portrait in its hero; seven selected pages have the compact portrait contact strip.

## Cloudflare Workers deployment

Connect this GitHub repository in **Cloudflare → Workers & Pages → Create → Import a repository** and select the Workers build flow.

| Setting | Value |
| --- | --- |
| Repository | `syafiqapextreasure/akm-insurans` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Worker name | `akm-insurans` |
| Node.js | 22 or newer |

Dependencies are installed from `package-lock.json`. `wrangler.jsonc` configures the Worker entry point and the generated `dist` static assets. No database, API key or application secret is needed. The site's enquiries open WhatsApp; the site does not collect enquiries in a database.

For a manual deployment:

```sh
npm ci
npm run check
npx wrangler login
npm run deploy
```

After adding a custom domain, optionally set the Worker variable `SITE_URL` to its HTTPS origin, for example `https://your-real-domain.com`. This is a configuration example, not a preselected domain. Without this variable, canonical URLs, Open Graph URLs, structured-data URLs, sitemap and robots automatically use the incoming request origin. With a production domain, setting `SITE_URL` keeps previews canonicalized to production.

Documentation: [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/) and [Workers build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## Local use

```sh
npm ci
npm run build
npm run preview
```

Preview defaults to `http://127.0.0.1:8787`. If the environment cannot launch Wrangler's native subprocesses, the dependency-free fallback `node scripts/preview.mjs` serves the generated pages through the same Worker request handler with a local static-assets adapter. This fallback is for development, not the deployment entry point.

## Structure

- `src/data.mjs`: business details, products, exact customer excerpts and source links.
- `src/articles.mjs`: ten individual Malaysian insurance guides.
- `src/pages.mjs`: page layouts and route definitions.
- `src/ui.mjs`: reusable HTML components, artwork framing and structured data.
- `src/design-assets.json`: provenance and dimensions of the 24 approved designs.
- `public/assets/`: lossless artwork, original supplied videos, preview stills and self-hosted Inter fonts.
- `public/styles.css`: responsive Signature Green layouts and animation.
- `public/readability.css`: larger supporting typography, including 19px desktop body text at 1600px+ widths, 17px navigation/buttons and 16px tertiary/footer text.
- `public/app.js`: accessible navigation, enquiry dialog, WhatsApp form, blog filters, video controls and restrained parallax.
- `scripts/build.mjs`: generates complete HTML for every route.
- `worker/index.mjs`: canonical-origin replacement, sitemap, robots, security headers and static asset delivery.
- `tests/site.test.mjs`: content, links, media, portrait rules, structured data and Worker behavior.

## Artwork and content

The artwork is the same approved design imagery, losslessly encoded as WebP with pixel equality checked against the source PNGs. SVG viewports crop the photo areas without redrawing or regenerating the images. Text, forms, controls, curves, icons and navigation are real HTML/CSS/SVG. The responsive implementation deliberately adapts image framing and increases type sizes for readability; it is not a flattened screenshot of each page.

The two supplied videos are included unchanged and use click-to-play controls. Short visible-scene summaries are provided beneath the players; these are not claimed to be verbatim audio transcripts. No autoplay or audio-on-load is used.

Seven customer quotations are transcribed from the supplied WhatsApp screenshots. Personal policy records, identification numbers, vehicle registrations, bank details and raw customer screenshots are not published. No fabricated star ratings or customer names are used.

Insurance articles include source links and a concise direct answer. Product acceptance, claims and cover remain subject to the relevant provider and actual policy/certificate. Source links do not imply an insurer appointment. The supplied biography is included on `/hubungi/`.

## SEO, accessibility and motion

Every page is fully rendered before delivery, with a unique title, description, canonical link and Open Graph metadata. JSON-LD includes Organization, WebSite, WebPage, BreadcrumbList, Article and FAQPage where the same content is visible. `/sitemap.xml`, `/robots.txt` and `/llms.txt` are generated or served by the Worker. These features support discoverability; they do not guarantee rankings or rich results.

The site includes keyboard navigation, skip link, visible focus, native radio controls, dialog dismissal, labelled inputs, click-to-play video, real links and native FAQ accordions. Reduced-motion settings disable parallax, reveal effects and transitions. Cross-document View Transitions are progressive enhancement; unsupported browsers retain normal navigation.

## Validation

```sh
npm run check
npx wrangler deploy --dry-run
```

GitHub Actions runs both commands on pushes to `main` and pull requests. See `VALIDATION.md` for the completed checks and environment-specific limitations from initial delivery.

