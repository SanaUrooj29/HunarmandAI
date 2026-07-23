# Shared / Public API

Endpoints not owned by a single panel: the category tree, marketplace browsing, and product reviews. Browsing and category listing are fully public (no auth); review submission requires a buyer session.

**Base URL:** `http://localhost:5000/api`

## Contents

- [Categories](#categories)
- [Marketplace (Browse)](#marketplace-browse)
- [Reviews](#reviews)

## Categories

### GET /categories

**List all active categories** — 🌐 Public · _FR-6-03_

`GET /api/categories`

Returns the full active category tree (top-level categories with their subcategories nested inside). Used by sellers to pick a category and by buyers to filter the marketplace.

**Example response** (200):

```json
{
  "success": true,
  "message": "Categories fetched",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Clothing",
      "parentCategory": null,
      "sortOrder": 9,
      "status": "active",
      "subcategories": [
        {
          "_id": "665f1a2b3c4d5e6f7a8b9c0e",
          "name": "Shawls",
          "parentCategory": "665f1a2b3c4d5e6f7a8b9c0d"
        },
        {
          "_id": "665f1a2b3c4d5e6f7a8b9c0f",
          "name": "Kurtas",
          "parentCategory": "665f1a2b3c4d5e6f7a8b9c0d"
        }
      ]
    }
  ]
}
```

---

## Marketplace (Browse)

### GET /marketplace

**Search / filter products** — 🌐 Public · _FR-6-01, FR-6-02_

`GET /api/marketplace`

Full-text search plus filters. Only approved, non-deleted listings are ever returned.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `q` | string | no | Full-text search across title/description/tags |
| `categoryId` | ObjectId | no |  |
| `minPrice` | number | no |  |
| `maxPrice` | number | no |  |
| `city` | string | no | Matches the seller’s city |
| `minRating` | number | no | 0–5 |
| `stockStatus` | string | no |  (in_stock \| out_of_stock) |
| `page` | integer | no |  — default 1 |
| `limit` | integer | no |  — default 20 |

**Response:** 200, standard success envelope (see top of document).

---

### GET /marketplace/featured

**Featured products feed** — 🌐 Public

`GET /api/marketplace/featured`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `limit` | integer | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /marketplace/latest

**Latest products feed** — 🌐 Public

`GET /api/marketplace/latest`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `limit` | integer | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /marketplace/popular

**Popular products feed (by salesCount)** — 🌐 Public

`GET /api/marketplace/popular`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `limit` | integer | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /marketplace/recommended

**Recommended products feed (highest-rated proxy)** — 🌐 Public

`GET /api/marketplace/recommended`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `limit` | integer | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /marketplace/sellers/:sellerId

**Seller storefront** — 🌐 Public

`GET /api/marketplace/sellers/:sellerId`

Public seller profile plus their approved product listings.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `sellerId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /marketplace/:productId

**Product detail** — 🌐 Public

`GET /api/marketplace/:productId`

Increments the product’s viewCount as a side effect.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

## Reviews

### GET /reviews/product/:productId

**List visible reviews for a product** — 🌐 Public

`GET /api/reviews/product/:productId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /reviews

**Submit a review** — 🔒 Buyer · _FR-6-04_

`POST /api/reviews`

Only allowed if the buyer has a delivered order containing this product.

**Request body:**

```json
{
  "productId": "{{product_id}}",
  "orderId": "{{order_id}}",
  "rating": 5,
  "comment": "Beautiful craftsmanship, exactly as pictured!"
}
```

Notes:
- productId: required, ObjectId
- orderId: required, ObjectId — must be a delivered order
- rating: required, integer 1–5
- comment: optional, max 1000 chars

**Response:** 201, standard success envelope (see top of document).

---

### PATCH /reviews/:reviewId

**Edit a review (within 48h edit window)** — 🔒 Buyer

`PATCH /api/reviews/:reviewId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `reviewId` | ObjectId |  |

**Request body:**

```json
{
  "rating": 4,
  "comment": "Updated my rating after using it for a week."
}
```

Notes:
- rating: optional, integer 1–5
- comment: optional, max 1000 chars

**Response:** 200, standard success envelope (see top of document).

---

### POST /reviews/:reviewId/report

**Report a review as fake/abusive** — 🔒 Buyer

`POST /api/reviews/:reviewId/report`

Files a Report for admin review — does not hide the review itself (that requires admin action, see Admin → Reports).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `reviewId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "This review appears to be fake — the reviewer never purchased this item."
}
```

Notes:
- reason: required, max 500 chars

**Response:** 201, standard success envelope (see top of document).

---
