# HunarmandAI — Postman Collections

Four collections (one per module) plus one shared environment. Generated from `docs/api-spec/*.js` — the same source the Markdown docs (`docs/API_*.md`) are generated from, so the two can never drift apart. If the API changes, edit the spec and re-run `node docs/generate-postman.js`, don't hand-edit these JSON files.

## Files

| File | Requests | Covers |
|---|---|---|
| `HunarmandAI_SharedPublic.postman_collection.json` | 12 | Categories, Marketplace browse, Reviews |
| `HunarmandAI_Seller.postman_collection.json` | 29 | Seller auth, profile, wallet, products, orders, learning, support |
| `HunarmandAI_Buyer.postman_collection.json` | 22 | Buyer auth, profile/addresses, cart, checkout, orders, support |
| `HunarmandAI_Admin.postman_collection.json` | 44 | Admin auth, dashboard, user/product/category/order/wallet management, reports, support, notifications, settings |
| `HunarmandAI_Local.postman_environment.json` | — | Shared variables all four collections read from |

**107 requests total**, one-to-one with every route registered in the running server (verified against `src/app.js` route mounts, not hand-transcribed).

## Setup (2 minutes)

1. **Import everything**: Postman → Import → drag in all 4 `*.postman_collection.json` files and the 1 `*.postman_environment.json` file.
2. **Select the environment**: top-right environment dropdown → "HunarmandAI Local".
3. **Check `base_url`**: defaults to `http://localhost:5000` — change it if your server runs elsewhere.
4. **Start the backend**: `npm run dev` (see the main `README`/setup instructions) and seed categories first: `npm run seed:categories`.

## Auth flow — do this first in each collection

Tokens are **not** pre-filled — you generate them by actually calling the login endpoints, same as a real client would:

- **Seller / Buyer collections**: run `Authentication → POST /auth/otp/request`, copy the OTP code from your server's console log (no real SMS gateway needed in dev), then run `POST /auth/otp/verify`. A test script on that request automatically saves the returned JWT into the environment as `seller_token` or `buyer_token` — every other request in that collection already references `{{seller_token}}` / `{{buyer_token}}` in its Auth tab, so nothing else to configure.
- **Admin collection**: seed an admin first (`npm run seed:admin`, see main README), then run `Authentication → POST /auth/login`. Same auto-save pattern, into `admin_token`.

## Other auto-saved variables

A few more requests save their result into collection variables so downstream requests can chain without manual copy-pasting:

- `Admin → Category Management → POST /categories` saves `category_id`
- `Seller → Products → POST /products` saves `product_id`

`order_id` is **not** auto-saved — orders are only created after a verified payment gateway callback (see `Buyer → Checkout`), and simulating that callback's HMAC signature from inside a Postman script is possible but non-trivial (it has to match `paymentService.js`'s exact signing scheme). Easiest path for manual testing: complete a checkout via the running server directly (or read `tests/buyer.e2e.test.js`, which does exactly this), then paste a real order ID into the `order_id` environment variable.

## Public vs. authenticated requests

Every request's **Auth tab** already reflects what the server actually requires:
- No auth tab set → public endpoint (categories, marketplace browse, product reviews list, OTP request/verify, admin login, payment callback).
- Bearer token referencing `{{seller_token}}` / `{{buyer_token}}` / `{{admin_token}}` → protected, gated by that role.

## Multipart/form-data requests

Two endpoints expect file uploads, not JSON:
- `Seller → Products → POST /products/ai-listing` (field: `image`)
- `Seller → Profile → POST /profile/picture` (field: `picture`)

Both are pre-configured as `form-data` bodies with the file field ready — just click "Select Files" in Postman before sending.

## Test scripts

Every request has a basic test assertion (status code sanity check at minimum; auth requests additionally auto-save their token). These aren't a substitute for the real automated test suite (`npm test` — 195 checks across 5 suites) — they exist to make manual, interactive testing in Postman a little more convenient, not to replace CI.
