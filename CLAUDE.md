# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

One-page marketing site for "Horizon Wealth Planning". Everything lives in a single `index.html`: CSS in one `<style>` tag, JS in one `<script>` tag. This is a hard constraint from the brief: no frameworks, build tools, package manager, or external JS/CSS files. The only external resources are Google Fonts (Playfair Display for headings, Inter for body), one Unsplash hero image, and `i.pravatar.cc` avatars.

## Versions

- `index.html` is the original site (v1). Leave it unchanged unless asked.
- `v2/index.html` is the redesign, built on the same single-file rules. It adds a quick-start hero form, a live market ticker, market-trend charts, a retirement calculator, a free-guide lead magnet, an FAQ and a mobile action bar. Its footer links back to `../index.html`. Inline nav starts at 1024px (not 768px) because the menu has more links.
- **v2 market data:** FX rates come live from `api.frankfurter.dev` (ECB) and crypto from `api.coingecko.com`. Both are keyless. If a request fails, the `FALLBACK` object in the JS is used. The snapshot cards (RBA rate, CPI, ASX 200, S&P 500), the "as of" date, the announcement bar and the insight copy are hand-written. Update them together when the figures change.
- **v2 lead capture:** any link with `data-interest="<option value>"` preselects that service in the enquiry form. The hero quick form prefills name, email and interest, then scrolls to `#contact`. Submitted data includes `leadSource`.
- The Pages workflow copies both `index.html` and `v2/`.

## Running

There is no build, lint, or test tooling. Open the file directly:

```powershell
Start-Process index.html
```

To verify changes, load `file:///C:/Users/deepa/financial2/index.html` in the built-in browser and test at both mobile (375px) and desktop widths.

## Structure of index.html

The file runs in the same order in all three languages, with a banner comment (`/* ===== N. NAME ===== */` or `<!-- ===== -->`) at each major section. Keep that order and comment style when adding sections.

- **CSS**: design tokens on `:root` (colors `--navy #0B2545`, `--gold #C9A227`, `--bg #F7F9FC`, spacing `--space-1..8`, `--nav-height`). Use tokens, not literal colors. The CSS is mobile-first: base styles first, then `@media (min-width: 768px)` and `@media (min-width: 1024px)` blocks near the end of the stylesheet. Put responsive overrides in those blocks rather than next to the base rules.
- **JS**: one IIFE with numbered sections: nav toggle, scroll effects (header shadow and back-to-top after 400px), fade-in observer, stat counters, carousel, enquiry form, newsletter, footer year, workshop popup, chatbot widget.
- **Chatbot widget:** a fixed bottom-left button (z-index above the sticky header). Clicking it opens a panel with a "Chat on WhatsApp" link (`wa.me/6512345678`, a placeholder) and says "How can I help you?" aloud through the browser's `speechSynthesis`.
- **Workshop popup:** a native `<dialog>` that opens 10s after page load. It collects name and email and logs them like the enquiry form. It doesn't show again once dismissed or registered (`localStorage` key `hwp-workshop-<date>`), and it stops appearing after `WORKSHOP_ENDS`. For a new event, update the dialog copy, `WORKSHOP_ENDS` and `WORKSHOP_KEY` together.

## Cross-cutting conventions

- **Fade-in animation:** add the `.fade-in` class to any element. A shared IntersectionObserver adds `.is-visible` once it scrolls into view.
- **Stat counters:** `.stat-number` elements are driven by `data-target`, `data-prefix` and `data-suffix` attributes. Edit those attributes, not the text.
- **Carousel cards per view:**
  - **Where it's set:** `getPerView()` in the JS and `.carousel-slide { flex-basis }` in the CSS both define how many cards show (1, 2 or 3 at the 768px and 1024px breakpoints). Change both together.
  - **Positioning:** the track moves by `index * 100/perView %`.
  - **Dots and slide counts:** the dots are built in JS from `slides.length - perView`. When you add a testimonial, also update every slide's `aria-label="n of N"`.
  - **Stars:** these are injected by JS into empty `.stars` divs.
- **Enquiry form validation:**
  - **Rules:** the `validators` object maps each field `name` to a function that returns an error string (`''` means valid). Each field has a matching `#<name>-error` span linked through `aria-describedby`.
  - **Red borders:** `getTarget()` picks the element that gets the `.invalid` border. For radios and the checkbox this is the wrapper element.
  - **Adding a field:** add a validator, an error span, and the `aria-describedby` link.
- **Submission:** this is simulated. After a 1.5s spinner the form data is logged as JSON and the form is replaced with a success panel. User input is inserted with `textContent` only.
- **Accessibility:** the page uses aria attributes on the menu toggle (`aria-expanded`), the carousel (`aria-roledescription`, `aria-current` on dots, `aria-hidden` and `inert` on off-screen slides), and the form (`aria-invalid`). It also respects `prefers-reduced-motion`. Keep these in place when changing these components.
- **Placeholder content:** the contact details, the `.example` email address and the social links are placeholders.
