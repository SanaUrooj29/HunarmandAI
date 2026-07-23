# Gemini API Configuration & Image Compression

## Current Setup

**Model:** `gemini-2.5-flash` (stable, released June 2025)
- **Supported methods:** `generateContent`, `countTokens`, `createCachedContent`, `batchGenerateContent`
- **Input token limit:** 1,048,576 (1M tokens)
- **Output token limit:** 65,536
- **Use case:** Vision API for product listing generation (FR-2)

## Configuration

### Backend (`.env`)

```bash
GEMINI_API_KEY=<your-api-key>
GEMINI_MODEL=gemini-2.5-flash
GEMINI_VISION_TIMEOUT_MS=10000
GEMINI_MAX_IMAGE_SIZE_MB=1
```

**Config file:** `backend/src/api/shared/config/env.js`

## Token Exhaustion Prevention

### 1. Frontend Image Compression (Primary)
- **File:** `apps/seller/lib/api/seller-listings.ts`
- **Behavior:** `generateAiListing()` automatically compresses images to **max 1 MB** before sending
- **Method:** Canvas-based JPEG compression (progressive quality reduction)
- **Downscaling:** Images larger than 1200px are resized proportionally

### 2. Backend Image Validation (Secondary)
- **File:** `backend/src/api/shared/services/aiVisionService.js`
- **Behavior:** Logs a warning if image exceeds `GEMINI_MAX_IMAGE_SIZE_MB`
- **Why:** Alerts developers to frontend compression failures or direct API calls

## Changing Models

To list available models:
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | jq .
```

**Recommended alternatives:**
- `gemini-2.5-pro` — larger model, higher accuracy (65M token limit)
- `gemini-2.0-flash` — legacy, more restricted, avoid for new flows
- `gemini-flash-latest` — always points to latest stable flash release

To change:
```bash
# .env
GEMINI_MODEL=gemini-2.5-pro
```

Then restart the backend.

## See Also

- [Gemini API Documentation](https://ai.google.dev/docs)
- `backend/src/api/seller/routes/product.routes.js` — POST `/products/ai-listing` endpoint
- `apps/seller/app/listing/new/page.tsx` — Product listing creation UI
