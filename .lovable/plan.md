# Aarohi — Minimal White Saree Storefront

A quiet, gallery-like e-commerce site for a saree brand. White canvas, ink-black type, gold zari accent used sparingly. The whole point is that the product photography carries the page and buying takes two taps.

## Design direction (chosen defaults)

- Palette: ivory white `#fefdfb` base, warm paper `#f2ede4` surfaces, ink `#171514` text, zari gold `#c9a84c` accent, deep maroon `#7a1f2b` for sale/urgency only.
- Typography: Cormorant Garamond for headings (delicate, luxury drape), Karla for body and UI.
- Layout: full-bleed hero, then a calm 2/3-column product gallery. Generous whitespace, hairline borders, near-zero shadows, sharp-to-2px radius, restrained fade-up motion on scroll only.
- No gradients, no purple, no card-heavy dashboards look.

## Pages

1. `/` — Home: full-bleed hero saree image with one CTA, "New Drapes" 6-product gallery, weave-category strip (Kanjivaram, Banarasi, Linen, Chanderi, Cotton), one editorial band about the weavers, minimal footer.
2. `/shop` — Catalog: product gallery with simple filters (weave, colour, price) and sort. No sidebar clutter; filters as a slim inline bar.
3. `/shop/$slug` — Product: large image column with thumbnails, name, price, fabric/weave/blouse details, quantity, "Add to bag" + "Book now".
4. `/bag` — Bag: line items, quantity edit, remove, subtotal, "Proceed to booking".
5. `/booking` — Checkout-lite: name, phone, email, address, delivery notes, order summary, "Confirm booking". Submits to a confirmation state.
6. `/about` — Short brand story with two images.

## Ordering flow (default decision)

Shopify was not enabled, so this ships as a working front-end store: a demo saree catalog (12 products with generated imagery) plus a real cart and a booking form that ends in a confirmation screen. No card payments, no database — cart persists in the browser. When you're ready for real inventory, payments and shipping, enabling Shopify swaps the demo catalog for live products without changing the UI.

## Technical notes

- Product data as a typed local module `src/data/sarees.ts`; images generated into `src/assets/`.
- Cart in a React context backed by `localStorage`, read after hydration to avoid SSR mismatch.
- TanStack Start file routes as listed above; `src/routes/index.tsx` is rewritten as Home (placeholder removed).
- Tokens added to `src/styles.css` under `:root` + `@theme inline` (oklch); fonts loaded via `<link>` in `__root.tsx`.
- Reusable components: `SareeCard`, `ProductGallery`, `FilterBar`, `QuantityStepper`, `SiteHeader`, `SiteFooter`, `BookingForm`.
- Per-route `head()` metadata with unique titles/descriptions, single H1 per page, alt text on all product images, JSON-LD `Product` on product pages.
