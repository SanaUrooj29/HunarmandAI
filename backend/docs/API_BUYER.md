# Buyer API

Endpoints require a Buyer session unless marked public. Marketplace browsing and category listing live under /api/marketplace and /api/categories respectively — see the Shared / Public collection.

**Base URL:** `http://localhost:5000/api/buyer`

## Contents

- [Authentication](#authentication)
- [Profile & Addresses](#profile-addresses)
- [Cart](#cart)
- [Checkout](#checkout)
- [Orders](#orders)
- [Support Tickets](#support-tickets)

## Authentication

### POST /auth/otp/request

**Request OTP** — 🌐 Public · _UC-01, FR-1-01, FR-1-04_

`POST /api/buyer/auth/otp/request`

**Request body:**

```json
{
  "phone": "+923009998888",
  "preferredLanguage": "en"
}
```

Notes:
- phone: required, Pakistani mobile format
- preferredLanguage: optional, "ur" or "en"

**Response:** 200, standard success envelope (see top of document).

---

### POST /auth/otp/verify

**Verify OTP and log in** — 🌐 Public · _UC-01_

`POST /api/buyer/auth/otp/verify`

**Request body:**

```json
{
  "phone": "+923009998888",
  "code": "123456"
}
```

**Example response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "isNewAccount": true,
    "buyer": {
      "id": "{{buyer_id}}",
      "phone": "+923009998888",
      "name": null,
      "preferredLanguage": "en",
      "credibilityScore": 50
    }
  }
}
```

---

### POST /auth/logout

**Logout (revokes current token)** — 🔒 Buyer

`POST /api/buyer/auth/logout`

_No request body._

**Response:** 200, standard success envelope (see top of document).

---

## Profile & Addresses

### GET /profile

**Get my profile** — 🔒 Buyer

`GET /api/buyer/profile`

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /profile

**Update my profile** — 🔒 Buyer

`PATCH /api/buyer/profile`

**Request body:**

```json
{
  "name": "Zainab Khan",
  "preferredLanguage": "ur"
}
```

**Response:** 200, standard success envelope (see top of document).

---

### POST /profile/addresses

**Add a saved address** — 🔒 Buyer

`POST /api/buyer/profile/addresses`

**Request body:**

```json
{
  "label": "Home",
  "addressLine": "456 Bazaar Road, Model Town",
  "city": "Lahore",
  "isDefault": true
}
```

Notes:
- addressLine: required, 5–300 chars
- city: required
- The first address saved is always auto-marked default

**Response:** 201, standard success envelope (see top of document).

---

### PATCH /profile/addresses/:addressId

**Update a saved address** — 🔒 Buyer

`PATCH /api/buyer/profile/addresses/:addressId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `addressId` | ObjectId |  |

**Request body:**

```json
{
  "addressLine": "789 Main Street",
  "isDefault": true
}
```

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /profile/addresses/:addressId

**Delete a saved address** — 🔒 Buyer

`DELETE /api/buyer/profile/addresses/:addressId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `addressId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

## Cart

### GET /cart

**Get my cart** — 🔒 Buyer

`GET /api/buyer/cart`

**Response:** 200, standard success envelope (see top of document).

---

### POST /cart/items

**Add item to cart** — 🔒 Buyer

`POST /api/buyer/cart/items`

**Request body:**

```json
{
  "productId": "{{product_id}}",
  "quantity": 2
}
```

Notes:
- productId: required, must be approved and in stock
- quantity: optional, default 1

**Response:** 200, standard success envelope (see top of document).

---

### PATCH /cart/items/:productId

**Update item quantity** — 🔒 Buyer

`PATCH /api/buyer/cart/items/:productId`

Setting quantity to 0 removes the item.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Request body:**

```json
{
  "quantity": 3
}
```

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /cart/items/:productId

**Remove item from cart** — 🔒 Buyer

`DELETE /api/buyer/cart/items/:productId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `productId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### DELETE /cart

**Clear entire cart** — 🔒 Buyer

`DELETE /api/buyer/cart`

**Response:** 200, standard success envelope (see top of document).

---

## Checkout

### POST /checkout/initiate

**Initiate checkout** — 🔒 Buyer · _UC-05_

`POST /api/buyer/checkout/initiate`

Re-validates stock, splits the cart by seller (one order-group per seller), and returns a signed gateway request. Does NOT create Order records yet — that only happens after a verified payment callback. Redirect the buyer’s browser to gatewayRequest.baseUrl with gatewayRequest.fields.

**Request body:**

```json
{
  "shippingAddress": {
    "addressLine": "456 Bazaar Road",
    "city": "Lahore"
  },
  "paymentMethod": "jazzcash"
}
```

Notes:
- Provide EITHER addressId (a saved address) OR shippingAddress {addressLine, city}
- paymentMethod: required, one of credit_card | jazzcash | easypaisa

**Example response** (200):

```json
{
  "success": true,
  "message": "Checkout initiated",
  "data": {
    "checkoutToken": "<short-lived signed token>",
    "totalAmount": 9000,
    "removedItems": [],
    "gatewayRequest": {
      "gateway": "jazzcash",
      "baseUrl": "https://sandbox.jazzcash.com.pk",
      "fields": {
        "pp_MerchantID": "...",
        "pp_Amount": 900000,
        "pp_BillReference": "<checkoutToken>",
        "pp_SecureHash": "..."
      }
    }
  }
}
```

---

### POST /checkout/callback/:method

**Payment gateway callback (server-to-server)** — 🌐 Public · _UC-05, FR-4-02_

`POST /api/buyer/checkout/callback/:method`

Called BY THE PAYMENT GATEWAY, not the buyer’s browser — authenticated via HMAC signature verification, not a buyer session. On a verified success, creates one Order per seller group, credits seller wallets (minus commission), clears the buyer’s cart, and notifies everyone. Included here mainly for reference/simulation during integration testing.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `method` | string |  (credit_card \| jazzcash \| easypaisa) |

**Request body:**

```json
{
  "pp_MerchantID": "...",
  "pp_Amount": 900000,
  "pp_BillReference": "<checkoutToken>",
  "pp_ResponseCode": "000",
  "pp_TxnRefNo": "TXN123",
  "pp_SecureHash": "<computed HMAC>"
}
```

**Response:** 200, standard success envelope (see top of document).

---

## Orders

### GET /orders

**List my orders** — 🔒 Buyer

`GET /api/buyer/orders`

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | integer | no |  |
| `limit` | integer | no |  |
| `status` | string | no |  |

**Response:** 200, standard success envelope (see top of document).

---

### GET /orders/:orderId

**Get order detail / tracking** — 🔒 Buyer

`GET /api/buyer/orders/:orderId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /orders/:orderId/cancel

**Cancel an order** — 🔒 Buyer · _FR-3-05_

`POST /api/buyer/orders/:orderId/cancel`

Only allowed while the order is still "pending" (before the seller accepts it).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orderId` | ObjectId |  |

**Request body:**

```json
{
  "reason": "Changed my mind"
}
```

Notes:
- reason: optional, max 500 chars

**Response:** 200, standard success envelope (see top of document).

---

## Support Tickets

### POST /support-tickets

**Raise a support ticket** — 🔒 Buyer

`POST /api/buyer/support-tickets`

**Request body:**

```json
{
  "relatedOrderId": "{{order_id}}",
  "subject": "Order never arrived",
  "description": "My order shows \"delivered\" but I never received it. The seller is not responding to messages."
}
```

**Response:** 201, standard success envelope (see top of document).

---

### GET /support-tickets

**List my tickets** — 🔒 Buyer

`GET /api/buyer/support-tickets`

**Response:** 200, standard success envelope (see top of document).

---

### GET /support-tickets/:ticketId

**Get my ticket detail** — 🔒 Buyer

`GET /api/buyer/support-tickets/:ticketId`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Response:** 200, standard success envelope (see top of document).

---

### POST /support-tickets/:ticketId/respond

**Add a response to my ticket** — 🔒 Buyer

`POST /api/buyer/support-tickets/:ticketId/respond`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `ticketId` | ObjectId |  |

**Request body:**

```json
{
  "message": "Still no response from the seller."
}
```

**Response:** 200, standard success envelope (see top of document).

---
