const axios = require('axios');
const { env } = require('../config/env');
const { ApiError } = require('../utils/apiError.util');
const { TOP_LEVEL_CATEGORIES } = require('../constants/enums');

/**
 * FR-2-01..03 — sends a product photo to the Google Gemini Vision API and returns
 * a structured, bilingual (Urdu + English) listing suggestion. All calls
 * are server-side only — the API key is never exposed to the client
 * (SRS §2.4 "All AI API calls are made server-side").
 */

const SYSTEM_PROMPT = `You are a product listing assistant for HunarmandAI, a Pakistani artisan marketplace.
Given a photograph of a product, respond with ONLY a JSON object (no markdown, no preamble) matching exactly:
{
  "titleEnglish": string,
  "titleUrdu": string,
  "descriptionEnglish": string (2-4 sentences),
  "descriptionUrdu": string (2-4 sentences),
  "suggestedCategory": one of ${JSON.stringify(TOP_LEVEL_CATEGORIES)},
  "suggestedPriceMinPKR": number,
  "suggestedPriceMaxPKR": number,
  "suggestedTags": string[] (3-6 tags)
}
Base the price range on typical Pakistani marketplace pricing for a comparable handmade/small-batch item.
If the image does not clearly show a sellable product, set suggestedCategory to null and explain nothing else — just return the JSON with null category and empty strings/arrays for the rest.`;

function detectMediaType(buffer) {
  // Minimal magic-byte sniff — sufficient since uploadService already
  // restricts allowed MIME types before this is ever called.
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  return 'image/webp';
}

function parseModelJson(rawText) {
  const cleaned = rawText.trim().replace(/^```json\s*|```$/g, '');
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw ApiError.internal('AI listing service returned an unparseable response');
  }
}

/**
 * @param {Buffer} imageBuffer
 * @returns {Promise<object>} structured listing suggestion
 */
async function generateListingFromImage(imageBuffer) {
  if (!env.GEMINI_API_KEY) {
    throw ApiError.internal('AI listing service is not configured (missing GEMINI_API_KEY)');
  }

  // Validate image size to prevent token exhaustion
  const imageSizeMB = imageBuffer.length / (1024 * 1024);
  const maxSizeMB = env.GEMINI_MAX_IMAGE_SIZE_MB;
  if (imageSizeMB > maxSizeMB) {
    // eslint-disable-next-line no-console
    console.warn(
      `[aiVisionService] Image size ${imageSizeMB.toFixed(2)}MB exceeds limit of ${maxSizeMB}MB. ` +
      `Consider compressing on frontend before upload to save tokens and bandwidth.`
    );
  }

  const base64Image = imageBuffer.toString('base64');
  const mediaType = detectMediaType(imageBuffer);

  let response;
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (env.GEMINI_VISION_TIMEOUT_MS > 0) {
    requestConfig.timeout = env.GEMINI_VISION_TIMEOUT_MS;
  }

  const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;
  const requestBody = {
    system_instruction: {
      parts: {
        text: SYSTEM_PROMPT,
      },
    },
    contents: {
      parts: [
        {
          inline_data: {
            mime_type: mediaType,
            data: base64Image,
          },
        },
        {
          text: 'Generate the listing JSON for this product photo.',
        },
      ],
    },
  };

  const requestStart = Date.now();

  try {
    response = await axios.post(requestUrl, requestBody, requestConfig);
  } catch (err) {
    const durationMs = Date.now() - requestStart;
    const responseData = err.response?.data;
    const statusCode = err.response?.status;
    // eslint-disable-next-line no-console
    console.error('[aiVisionService] Gemini API error:', {
      message: err.message,
      code: err.code,
      status: statusCode,
      responseData,
      durationMs,
      url: requestUrl,
      timeoutMs: env.GEMINI_VISION_TIMEOUT_MS,
    });

    if (err.code === 'ECONNABORTED') {
      throw ApiError.internal('AI listing generation timed out', { code: 'AI_TIMEOUT' });
    }

    throw ApiError.internal('AI listing service is temporarily unavailable', { code: 'AI_UNAVAILABLE' });
  }

  const textContent = response.data?.candidates?.[0]?.content?.parts?.find((part) => part.text);
  if (!textContent) {
    throw ApiError.internal('AI listing service returned no usable content');
  }

  const parsed = parseModelJson(textContent.text);

  if (!parsed.suggestedCategory) {
    throw ApiError.badRequest('The uploaded image does not appear to show a sellable product', {
      code: 'AI_NO_PRODUCT_DETECTED',
    });
  }

  return parsed;
}

module.exports = { generateListingFromImage };
