# Admin API

Every route except /auth/login and /auth/password/* requires a valid Admin session (email/password login, separate JWT secret from buyer/seller tokens). Gated centrally in admin/routes/index.js via authenticateAdmin.

**Base URL:** `http://localhost:5000/api/admin`

## Contents

- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [User Management — Sellers](#user-management-sellers)
- [User Management — Buyers](#user-management-buyers)
- [Product Moderation](#product-moderation)
- [Category Management](#category-management)
- [Order Oversight](#order-oversight)
- [Wallet Management](#wallet-management)
- [Reports](#reports)
- [Support Tickets](#support-tickets)
- [Notifications](#notifications)
- [Platform Settings](#platform-settings)

## Authentication

### POST /auth/login

**Admin login** — 🌐 Public

`POST /api/admin/auth/login`

**Request body:**

```json
{
  "email": "ops@hunarmandai.pk",
  "password": "ChangeMe123!"
}
```

**Example response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "admin": {
      "id": "{{admin_id}}",
      "email": "ops@hunarmandai.pk",
      "name": "Ops Admin",
      "role": "super_admin"
    }
  }
}
```

---

### POST /auth/logout

**Logout (revokes current token)** — 🔒 Admin

`POST /api/admin/auth/logout`

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /auth/password/forgot

**Request password reset** — 🌐 Public

`POST /api/admin/auth/password/forgot`

Always returns a generic success message regardless of whether the email exists, to avoid leaking registered admin emails. In dev, the reset link is printed to the server console.

**Request body:**

```json
{
  "email": "ops@hunarmandai.pk"
}
```

**Response:** 200, standard success envelope (see top of document).

---

### POST /auth/password/reset

**Reset password with token** — 🌐 Public

`POST /api/admin/auth/password/reset`

**Request body:**

```json
{
  "token": "<token from reset email>",
  "newPassword": "NewPassw0rd!"
}
```

Notes:
- newPassword: required, min 8 characters

**Response:** 200, standard success envelope (see top of document).

---

## Dashboard

### GET /dashboard

**Platform statistics** — 🔒 Admin · _SRS §4.2_

`GET /api/admin/dashboard`

**Example response** (200):

```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "users": {
      "totalBuyers": 1204,
      "totalSellers": 340,
      "activeSellers": 312,
      "pendingSellerVerifications": 8
    },
    "products": {
      "totalProducts": 2156,
      "activeProducts": 1980,
      "pendingProducts": 41
    },
    "orders": {
      "ordersToday": 37,
      "totalOrders": 9821,
      "completedOrders": 8765,
      "cancelledOrders": 412
    },
    "revenue": {
      "totalRevenue": 4582300
    },
    "wallet": {
      "pendingWithdrawals": 6
    }
  }
}
```

---

## User Management — Sellers

### GET /users/sellers

**List sellers** — 🔒 Admin · _SRS §4.3_

`GET /api/admin/users/sellers`

CNIC is always returned masked (e.g. "*********3334") — the raw value is never exposed via this or any endpoint.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `search` | string | no | Matches phone number |
| `verificationStatus` | string | no |  (pending \| verified \| suspended) |
| `accountStatus` | string | no |  (active \| suspended \| deleted) |

**Response:** 200, standard success envelope (see top of document).

---

### GET /users/sellers/:sellerId

**Get seller detail** — 🔒 Admin

`GET /api/admin/users/sellers/:sellerId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `sellerId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /users/sellers/:sellerId/verify

**Verify a seller** — 🔒 Admin

`POST /api/admin/users/sellers/:sellerId/verify`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `sellerId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /users/sellers/:sellerId/suspend

**Suspend a seller** — 🔒 Admin

`POST /api/admin/users/sellers/:sellerId/suspend`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `sellerId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /users/sellers/:sellerId/activate

**Reactivate a seller** — 🔒 Admin

`POST /api/admin/users/sellers/:sellerId/activate`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `sellerId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /users/sellers/:sellerId

**Delete a seller (soft delete)** — 🔒 Admin

`DELETE /api/admin/users/sellers/:sellerId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `sellerId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

## User Management — Buyers

### GET /users/buyers

**List buyers** — 🔒 Admin

`GET /api/admin/users/buyers`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `search` | string | no |  |
| `accountStatus` | string | no |  (active \| suspended \| deleted) |

**Response:** 200, standard success envelope (see top of document).

---

### GET /users/buyers/:buyerId

**Get buyer detail (includes credibility score)** — 🔒 Admin

`GET /api/admin/users/buyers/:buyerId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `buyerId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /users/buyers/:buyerId/suspend

**Suspend a buyer** — 🔒 Admin

`POST /api/admin/users/buyers/:buyerId/suspend`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `buyerId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /users/buyers/:buyerId/activate

**Reactivate a buyer** — 🔒 Admin

`POST /api/admin/users/buyers/:buyerId/activate`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `buyerId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /users/buyers/:buyerId

**Delete a buyer (soft delete)** — 🔒 Admin

`DELETE /api/admin/users/buyers/:buyerId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `buyerId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

## Product Moderation

### GET /products

**List all products** — 🔒 Admin · _FR-8, SRS §4.4_

`GET /api/admin/products`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `approvalStatus` | string | no |  (pending \| approved \| rejected) |
| `categoryId` | ObjectId | no |  |
| `search` | string | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /products/:productId

**Get product detail** — 🔒 Admin

`GET /api/admin/products/:productId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /products/:productId/approve

**Approve a pending listing** — 🔒 Admin · _FR-8-02_

`POST /api/admin/products/:productId/approve`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /products/:productId/reject

**Reject a pending listing** — 🔒 Admin · _FR-8-02_

`POST /api/admin/products/:productId/reject`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "Violates content policy — misleading product images"
}
```

Notes:
- reason: required

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /products/:productId

**Remove an already-approved listing** — 🔒 Admin · _FR-8-04, SRS §4.11_

`DELETE /api/admin/products/:productId`

For listings that were approved but are later found to violate policy (vs. reject, which is for still-pending listings).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "Reported by multiple buyers as counterfeit"
}
```

Notes:
- reason: required

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /products/:productId/category

**Reassign a product’s category** — 🔒 Admin · _SRS §4.4_

`PATCH /api/admin/products/:productId/category`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Request body:**

```json
{
  "categoryId": "{{category_id}}"
}
```

**Response:** 200, standard success envelope (see top of document).

---

## Category Management

### POST /categories

**Create a category** — 🔒 Admin · _SRS §4.5_

`POST /api/admin/categories`

**Request body:**

```json
{
  "name": "Stones",
  "parentCategory": null,
  "sortOrder": 10
}
```

Notes:
- name: required, 2–60 chars
- parentCategory: optional ObjectId (omit for a top-level category)
- sortOrder: optional integer

**Response:** 201, standard success envelope (see top of document).

---

### PATCH /categories/reorder

**Reorder categories** — 🔒 Admin

`PATCH /api/admin/categories/reorder`

**Request body:**

```json
{
  "orderedIds": [
    "{{category_id}}",
    "665f1a2b3c4d5e6f7a8b9c0e"
  ]
}
```

Notes:
- orderedIds: required, array of category ObjectIds in the desired display order

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /categories/:categoryId

**Update a category** — 🔒 Admin

`PATCH /api/admin/categories/:categoryId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `categoryId` | ObjectId |  |

**Request body:**

```json
{
  "name": "Stones & Gems",
  "sortOrder": 11,
  "status": "active"
}
```

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /categories/:categoryId

**Delete a category** — 🔒 Admin

`DELETE /api/admin/categories/:categoryId`

Soft delete (status → inactive). Blocked with 409 if any non-rejected products still reference this category.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `categoryId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

## Order Oversight

### GET /orders

**List all orders** — 🔒 Admin · _SRS §4.6_

`GET /api/admin/orders`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `status` | string | no |  |
| `sellerId` | ObjectId | no |  |
| `buyerId` | ObjectId | no |  |
| `search` | string | no | Matches order number |

**Response:** 200, standard success envelope (see top of document).

---

### GET /orders/:orderId

**Get order detail** — 🔒 Admin

`GET /api/admin/orders/:orderId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /orders/:orderId/resolve-dispute

**Resolve dispute in buyer’s favor (force-cancel)** — 🔒 Admin

`POST /api/admin/orders/:orderId/resolve-dispute`

Administrative override — bypasses the normal state-machine transition rules (this is precisely the case where the normal buyer/seller flow has broken down). Still runs the standard cancellation side effects: wallet transaction voided, both parties notified, buyer credibility updated.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "Package confirmed lost in transit by courier"
}
```

Notes:
- reason: required

**Response:** 200, standard success envelope (see top of document).

---

### POST /orders/:orderId/resolve-dispute-seller-favor

**Resolve dispute in seller’s favor (force-deliver)** — 🔒 Admin

`POST /api/admin/orders/:orderId/resolve-dispute-seller-favor`

Force-completes the order and releases the seller’s wallet funds, same as a normal delivery.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Request body:**

```json
{
  "note": "Seller provided proof of delivery (signed receipt)"
}
```

**Response:** 200, standard success envelope (see top of document).

---

## Wallet Management

### GET /wallet/transactions

**List all wallet transactions** — 🔒 Admin · _SRS §4.7_

`GET /api/admin/wallet/transactions`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `status` | string | no |  (pending \| completed \| rejected) |
| `type` | string | no |  (credit_sale \| withdrawal \| deposit \| adjustment) |
| `sellerId` | ObjectId | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /wallet/withdrawals/pending

**List pending withdrawal requests** — 🔒 Admin

`GET /api/admin/wallet/withdrawals/pending`

Only relevant when platformSettings.walletSettings.manualApprovalRequired is true.

**Response:** 200, standard success envelope (see top of document).

---

### POST /wallet/withdrawals/:transactionId/approve

**Approve a withdrawal** — 🔒 Admin

`POST /api/admin/wallet/withdrawals/:transactionId/approve`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `transactionId` | ObjectId |  |

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

### POST /wallet/withdrawals/:transactionId/reject

**Reject a withdrawal (returns funds to seller)** — 🔒 Admin

`POST /api/admin/wallet/withdrawals/:transactionId/reject`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `transactionId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "Bank account details could not be verified"
}
```

**Response:** 200, standard success envelope (see top of document).

---

## Reports

### GET /reports

**List reports** — 🔒 Admin · _SRS §4.8, §4.11_

`GET /api/admin/reports`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `status` | string | no |  (open \| reviewed \| dismissed \| actioned) |
| `targetType` | string | no |  (product \| user \| review \| message) |

**Response:** 200, standard success envelope (see top of document).

---

### GET /reports/:reportId

**Get report detail** — 🔒 Admin

`GET /api/admin/reports/:reportId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `reportId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /reports/:reportId/resolve

**Resolve a report** — 🔒 Admin

`POST /api/admin/reports/:reportId/resolve`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `reportId` | ObjectId |  |

**Request body:**

```json
{
  "outcome": "actioned",
  "resolutionNote": "Confirmed fake review, removed and rating recalculated"
}
```

Notes:
- outcome: required, one of reviewed | dismissed | actioned
- resolutionNote: optional, max 1000 chars
- If outcome is "actioned" and targetType is "review", the review is automatically hidden and product/seller ratings recalculated

**Response:** 200, standard success envelope (see top of document).

---

## Support Tickets

### GET /support-tickets

**List all tickets** — 🔒 Admin · _SRS §4.12_

`GET /api/admin/support-tickets`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `status` | string | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /support-tickets/:ticketId

**Get ticket detail** — 🔒 Admin

`GET /api/admin/support-tickets/:ticketId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /support-tickets/:ticketId/respond

**Respond to a ticket** — 🔒 Admin

`POST /api/admin/support-tickets/:ticketId/respond`

Automatically moves the ticket from "open" to "in_progress" on the first admin response.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Request body:**

```json
{
  "message": "We’re looking into this and will update you within 24 hours."
}
```

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /support-tickets/:ticketId/status

**Update ticket status** — 🔒 Admin

`PATCH /api/admin/support-tickets/:ticketId/status`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Request body:**

```json
{
  "status": "resolved"
}
```

Notes:
- status: required, one of open | in_progress | resolved | closed

**Response:** 200, standard success envelope (see top of document).

---

## Notifications

### POST /notifications/broadcast

**Broadcast an announcement** — 🔒 Admin · _SRS §4.10_

`POST /api/admin/notifications/broadcast`

**Request body:**

```json
{
  "audience": "all",
  "title": "Platform maintenance tonight",
  "body": "HunarmandAI will be briefly unavailable for maintenance at 11 PM PKT."
}
```

Notes:
- audience: required, one of all | sellers | buyers
- title: required, 3–150 chars
- body: optional, max 1000 chars

**Response:** 201, standard success envelope (see top of document).

---

## Platform Settings

### GET /settings

**Get current platform settings** — 🔒 Admin · _SRS §4.13_

`GET /api/admin/settings`

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /settings

**Update platform settings** — 🔒 Admin · _SRS §4.13, FR-4-03, FR-4-04_

`PATCH /api/admin/settings`

**Request body:**

```json
{
  "platformCommissionPercentage": 5,
  "walletSettings": {
    "manualApprovalRequired": true,
    "requiredSuccessfulSalesForWithdrawal": 2,
    "minWithdrawalAmount": 500
  },
  "paymentMethods": {
    "creditCard": true,
    "jazzCash": true,
    "easyPaisa": true
  }
}
```

Notes:
- All fields optional (partial updates)
- platformCommissionPercentage: 0–100, the "if introduced" optional commission (FR-4-03)
- walletSettings.requiredSuccessfulSalesForWithdrawal: the FR-4-04 threshold, default 2

**Response:** 200, standard success envelope (see top of document).

---
