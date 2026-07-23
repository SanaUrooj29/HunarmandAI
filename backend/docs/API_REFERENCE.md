# HunarmandAI API

Version 1.0.0

AI-powered marketplace connecting Pakistan’s informal artisans, craftsmen, farmers, and small businesses with buyers. REST API, JSON request/response bodies unless noted (file uploads use multipart/form-data).

**Base URL (local dev):** `http://localhost:5000`

## Response Envelope

Every response follows one of these two shapes.

**Success:**

```json
{
  "success": true,
  "message": "Human-readable summary",
  "data": "<endpoint-specific payload>",
  "meta": "<optional, present on paginated list endpoints: {page, limit, total, totalPages}>"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Human-readable error summary",
  "code": "MACHINE_READABLE_CODE",
  "details": "<optional, e.g. field-level validation errors>"
}
```

## Authentication

**Buyer / Seller:** OTP-based (phone number). POST /auth/otp/request, then POST /auth/otp/verify to receive a Bearer JWT (7-day default expiry). Send as "Authorization: Bearer <token>" on every subsequent request.

**Admin:** Email + password. POST /api/admin/auth/login returns a Bearer JWT (12-hour default expiry, separate signing secret from buyer/seller tokens — the two are never interchangeable).

## Common Error Codes

| Status | Code | When |
|---|---|---|
| 400 | `BAD_REQUEST` | Validation failure or a business rule was violated (e.g. insufficient wallet balance) |
| 401 | `UNAUTHORIZED` | Missing/invalid/expired/revoked token, or wrong credentials |
| 403 | `FORBIDDEN` | Authenticated, but not allowed to perform this action (wrong role, or a gating rule like PROFILE_INCOMPLETE / WITHDRAWAL_NOT_ELIGIBLE) |
| 404 | `NOT_FOUND` | Resource does not exist, or exists but is not owned by the caller (ownership checks return 404, not 403, to avoid confirming existence) |
| 409 | `CONFLICT` | A uniqueness or state conflict (duplicate resource, product has open orders, category in use, etc.) |
| 429 | `TOO_MANY_REQUESTS` | Rate limit exceeded (OTP request/verify limits, or the general API limiter) |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

## Modules

| Module | Base Path | Endpoints | Reference |
|---|---|---|---|
| Shared / Public | `/api` | 12 | [API_SHARED.md](./API_SHARED.md) |
| Seller | `/api/seller` | 29 | [API_SELLER.md](./API_SELLER.md) |
| Buyer | `/api/buyer` | 22 | [API_BUYER.md](./API_BUYER.md) |
| Admin | `/api/admin` | 44 | [API_ADMIN.md](./API_ADMIN.md) |

Each module also has its own dedicated Postman collection under `/postman` — see `postman/README.md`.
