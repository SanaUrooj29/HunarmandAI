# Seller API

All endpoints require a Seller session (Bearer JWT from OTP login) unless marked public. Every route below except /auth/otp/* is gated by authenticateUser + requireRole(seller) at the router level.

**Base URL:** `http://localhost:5000/api/seller`

## Contents

- [Authentication](#authentication)
- [Profile](#profile)
- [Wallet](#wallet)
- [Products](#products)
- [Orders](#orders)
- [Micro-Learning](#micro-learning)
- [Support Tickets](#support-tickets)

## Authentication

### POST /auth/otp/request

**Request OTP** — 🌐 Public · _UC-01, FR-1-01, FR-1-04_

`POST /api/seller/auth/otp/request`

Creates the seller account on first contact (role selection happens client-side before this call). Rate-limited to 3 requests / 10 min per phone.

**Request body:**

```json
{
  "phone": "+923001234567",
  "preferredLanguage": "ur"
}
```

Notes:
- phone: required, Pakistani mobile format (+92XXXXXXXXXX)
- preferredLanguage: optional, "ur" or "en", defaults to "ur"

**Example response** (200):

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "isNewAccount": true,
    "expiresAt": "2026-07-14T10:35:00.000Z"
  }
}
```

---

### POST /auth/otp/verify

**Verify OTP and log in** — 🌐 Public · _UC-01, FR-1-02, FR-1-03_

`POST /api/seller/auth/otp/verify`

Rate-limited to 5 attempts / 15 min per phone (lockout on the 6th). Returns a JWT valid for 7 days by default.

**Request body:**

```json
{
  "phone": "+923001234567",
  "code": "123456"
}
```

Notes:
- phone: required
- code: required, exactly 6 digits

**Example response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "isNewAccount": true,
    "seller": {
      "id": "{{seller_id}}",
      "phone": "+923001234567",
      "username": null,
      "preferredLanguage": "ur",
      "profileComplete": false,
      "verificationStatus": "pending"
    }
  }
}
```

---

### POST /auth/logout

**Logout (revokes current token)** — 🔒 Seller · _UC-01_

`POST /api/seller/auth/logout`

Adds this specific token’s jti to the revocation list — a real server-side logout, not just client-side token deletion.

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

## Profile

### GET /profile

**Get my profile** — 🔒 Seller · _UC-02_

`GET /api/seller/profile`

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /profile

**Update my profile** — 🔒 Seller · _UC-02_

`PATCH /api/seller/profile`

Accepts partial updates — profileComplete is recalculated automatically once username, cnic, shopName, city, and productCategory are all present.

**Request body:**

```json
{
  "username": "Amina Crafts",
  "gender": "female",
  "cnic": "3520112223334",
  "shopName": "Amina Handicrafts",
  "city": "Lahore",
  "productCategory": "{{category_id}}",
  "shopDescription": "Hand-embroidered textiles made with traditional Punjabi thread work.",
  "socialMediaLinks": [
    "https://instagram.com/aminahandicrafts"
  ]
}
```

Notes:
- All fields optional (partial updates supported)
- cnic: 13 digits, no dashes
- gender: male | female | other | prefer_not_to_say
- productCategory: must be a valid, active category ObjectId

**Response:** 200, standard success envelope (see top of document).

---

### POST /profile/picture

**Upload profile picture** — 🔒 Seller

`POST /api/seller/profile/picture`

multipart/form-data upload, field name "picture". Max 8MB, jpeg/png/webp only.

**Request body:** `multipart/form-data`

| Field | Type |
|---|---|
| `picture` | file |

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /profile

**Delete my account** — 🔒 Seller

`DELETE /api/seller/profile`

Soft delete — sets accountStatus to "deleted", preserves order/review history.

**Response:** 200, standard success envelope (see top of document).

---

## Wallet

### GET /wallet

**Get my wallet balance** — 🔒 Seller · _UC-02_

`GET /api/seller/wallet`

**Response:** 200, standard success envelope (see top of document).

---

### GET /wallet/transactions

**List my wallet transaction history** — 🔒 Seller

`GET /api/seller/wallet/transactions`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /wallet/withdraw

**Request a withdrawal** — 🔒 Seller · _FR-4-04_

`POST /api/seller/wallet/withdraw`

Only permitted after 2+ completed sales (platform-configurable). Funds are reserved from availableBalance immediately — if manual approval is on, the transaction stays "pending" until an admin approves/rejects it (Admin → Wallet).

**Request body:**

```json
{
  "amount": 1000
}
```

Notes:
- amount: required, positive number, must not exceed availableBalance, must meet platform minimum

**Response:** 201, standard success envelope (see top of document).

---

## Products

### POST /products/ai-listing

**Generate AI listing suggestion from a photo** — 🔒 Seller · _UC-03, FR-2_

`POST /api/seller/products/ai-listing`

multipart/form-data, field name "image". Uploads the photo and calls Claude Vision for a bilingual title/description/category/price suggestion. Does NOT create a product — review the suggestion, then call POST /products to publish. Degrades gracefully (suggestion: null) if the AI service is unavailable or unconfigured.

**Request body:** `multipart/form-data`

| Field | Type |
|---|---|
| `image` | file |

**Response:** 200, standard success envelope (see top of document).

---

### POST /products

**Create a product listing** — 🔒 Seller · _UC-03, UC-04, FR-2-06_

`POST /api/seller/products`

Always starts at approvalStatus "pending". Requires a completed seller profile. Triggers the first-product micro-learning lesson and the underpricing check.

**Request body:**

```json
{
  "categoryId": "{{category_id}}",
  "title": "Hand-embroidered Cushion Cover",
  "description": "A beautiful hand-embroidered cushion cover made with traditional thread work.",
  "images": [
    "https://cdn.example.com/products/cushion.jpg"
  ],
  "price": 1500,
  "quantity": 5,
  "stockStatus": "in_stock",
  "tags": [
    "handmade",
    "embroidery"
  ],
  "isAiGenerated": false
}
```

Notes:
- categoryId: required
- title: required, 3–150 chars
- description: required, 10–3000 chars
- images: required, at least 1 valid URL
- price: required, positive number

**Response:** 201, standard success envelope (see top of document).

---

### GET /products

**List my products** — 🔒 Seller

`GET /api/seller/products`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `stockStatus` | string | no |  (in_stock \| out_of_stock) |
| `approvalStatus` | string | no |  (pending \| approved \| rejected) |

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /products/stock/bulk

**Bulk update stock status** — 🔒 Seller

`PATCH /api/seller/products/stock/bulk`

E.g. mark everything out of stock before travel.

**Request body:**

```json
{
  "productIds": [
    "{{product_id}}"
  ],
  "stockStatus": "out_of_stock"
}
```

**Response:** 200, standard success envelope (see top of document).

---

### GET /products/:productId

**Get one of my products** — 🔒 Seller

`GET /api/seller/products/:productId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /products/:productId

**Edit a product** — 🔒 Seller

`PATCH /api/seller/products/:productId`

Materially editing title/description/images/category on an already-approved listing resets it to "pending" for re-review.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Request body:**

```json
{
  "title": "Hand-embroidered Cushion Cover (Updated)",
  "price": 1600
}
```

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /products/:productId/stock

**Toggle stock status** — 🔒 Seller

`PATCH /api/seller/products/:productId/stock`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Request body:**

```json
{
  "stockStatus": "out_of_stock"
}
```

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /products/:productId

**Delete a product** — 🔒 Seller

`DELETE /api/seller/products/:productId`

Blocked with 409 if the product has any open (non-delivered, non-cancelled) orders.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

## Orders

### GET /orders

**List my orders** — 🔒 Seller · _UC-06_

`GET /api/seller/orders`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `status` | string | no |  (pending \| accepted \| preparing \| shipped \| delivered \| cancelled) |

**Response:** 200, standard success envelope (see top of document).

---

### GET /orders/:orderId

**Get order detail (includes buyer credibility score)** — 🔒 Seller · _FR-7-02_

`GET /api/seller/orders/:orderId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /orders/:orderId/accept

**Accept an order** — 🔒 Seller

`POST /api/seller/orders/:orderId/accept`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /orders/:orderId/reject

**Reject an order (auto-refund)** — 🔒 Seller

`POST /api/seller/orders/:orderId/reject`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "Item is out of stock"
}
```

Notes:
- reason: optional, max 500 chars

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /orders/:orderId/status

**Advance order status** — 🔒 Seller · _FR-3-01, FR-3-04_

`PATCH /api/seller/orders/:orderId/status`

Valid transitions only: accepted→preparing→shipped→delivered. On "delivered", moves the seller’s pending wallet balance to available and increments completedSalesCount.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Request body:**

```json
{
  "nextStatus": "shipped",
  "courierName": "Leopards Courier",
  "trackingReference": "LEO123456789"
}
```

Notes:
- nextStatus: required, one of preparing | shipped | delivered
- courierName / trackingReference: optional, only meaningful when nextStatus is "shipped"

**Response:** 200, standard success envelope (see top of document).

---

## Micro-Learning

### GET /learning

**List my lessons** — 🔒 Seller · _FR-5, UC-07_

`GET /api/seller/learning`

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /learning/:lessonId

**Update lesson status** — 🔒 Seller

`PATCH /api/seller/learning/:lessonId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `lessonId` | string | e.g. "introduction-to-selling", "pricing-basics" |

**Request body:**

```json
{
  "status": "completed"
}
```

Notes:
- status: required, one of viewed | completed | dismissed

**Response:** 200, standard success envelope (see top of document).

---

## Support Tickets

### POST /support-tickets

**Raise a support ticket** — 🔒 Seller

`POST /api/seller/support-tickets`

**Request body:**

```json
{
  "relatedOrderId": "{{order_id}}",
  "subject": "Payment not received for delivered order",
  "description": "I delivered order #HMD-260714-ABC123 five days ago but the funds still show as pending."
}
```

Notes:
- relatedOrderId: optional
- subject: required, 3–150 chars
- description: required, 10–3000 chars

**Response:** 201, standard success envelope (see top of document).

---

### GET /support-tickets

**List my tickets** — 🔒 Seller

`GET /api/seller/support-tickets`

**Response:** 200, standard success envelope (see top of document).

---

### GET /support-tickets/:ticketId

**Get my ticket detail** — 🔒 Seller

`GET /api/seller/support-tickets/:ticketId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /support-tickets/:ticketId/respond

**Add a response to my ticket** — 🔒 Seller

`POST /api/seller/support-tickets/:ticketId/respond`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Request body:**

```json
{
  "message": "Following up — any update on this?"
}
```

**Response:** 200, standard success envelope (see top of document).

---
