# Monica Seafood

A responsive React storefront for Monica’s dried seafood and Nigerian pantry selection. Cream, forest teal and terracotta colours, self-hosted typography, illustrative food imagery, product filters and a WhatsApp enquiry basket.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

The production build is in `dist/`. For Vercel or Netlify, use the Vite preset, `npm run build`, and `dist` as the output directory. The site has no backend or payment gateway. It runs without API keys.

## Ordering

Visitors can filter products, add/remove items, adjust quantities, and enter optional name, delivery location and desired weights. Selections are saved in the visitor’s local browser. Customer details stay in React state until the visitor explicitly follows the WhatsApp link; this site does not store them on a server.

Checkout opens WhatsApp with an enquiry addressed to `2348157542436`. It asks Monica to confirm availability, pack sizes, prices and delivery charges. It does not send automatically or promise stock, delivery dates or a completed payment.

Business data and the product list are in `src/order.js`. Page sections are in `src/main.jsx`; responsive styles are in `src/styles.css`.

## Business context

The requested display name is **Monica Seafood**. The business identified in the earlier conversation was **Monica Iornum — Nica Foods**, Sangotedo, Lagos. This is a proposed seafood storefront for that business, not a claim that it has formally rebranded.

Public sources consulted:

- [Monica’s Facebook](https://www.facebook.com/mngu.monica/)
- [Published WhatsApp contact and Sangotedo location](https://www.facebook.com/mngu.monica/videos/for-more-details-click-on-the-bio-to-chat-directly-on-our-whatsapp-or-c/1647522763467287/)
- [Seafood post mentioning crayfish and prawns](https://www.facebook.com/mngu.monica/videos/you-see-crayfish-price-is-high-prawns-too-is-costly-but-because-we-have-the-inte/1429869502588026/)

Prices, inventory, pack sizes, opening hours, reviews, ratings and shipping guarantees have intentionally not been invented. Confirm the current catalogue and replace illustrative images with the business’s own product photographs when available.

## Assets and accessibility

- Food images: generated with the built-in Imagegen tool, optimized as WebP, clearly described as illustrative in the catalogue and FAQ. The image briefs are in `ASSETS.md`.
- Fonts: DM Sans and Instrument Serif via Fontsource (SIL Open Font License).
- Icons: Lucide (ISC license).
- Keyboard navigation, visible focus rings, skip link, accessible filter buttons, live basket feedback, dialog focus management, Escape-to-close and reduced-motion support.

## Validation

`npm test` checks basket validation, quantity bounds, enquiry contents and WhatsApp URL encoding. `npm run build` compiles the React application and packages the site. Browser-based visual and interaction QA is not available in the current workspace and has not been claimed.
