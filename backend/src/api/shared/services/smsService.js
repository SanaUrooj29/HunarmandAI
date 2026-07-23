const twilio = require('twilio');
const twilioConfig = require('../config/twilio.config');
const { env } = require('../config/env');
const { ApiError } = require('../utils/apiError.util');

/**
 * Twilio is lazily instantiated (not at module load) so that importing this
 * file never throws in dev/test when credentials aren't set — the
 * dev-console fallback below is what makes local development and the e2e
 * test suite work without any Twilio account at all (the OTP code is
 * printed to the terminal instead of texted).
 */
let client = null;
function getClient() {
  if (!client) {
    client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
  }
  return client;
}

/**
 * Sends an SMS via Twilio. Prefers a Messaging Service SID over a single
 * "from" number when both are configured, since a Messaging Service
 * handles sender selection and delivery retries automatically — Twilio's
 * recommended setup for production sending to Pakistani numbers.
 */
async function sendSms(toPhoneNumber, body) {
  if (!twilioConfig.isConfigured) {
    if (env.NODE_ENV === 'production') {
      throw ApiError.internal('SMS service is not configured (missing Twilio credentials)');
    }
    // eslint-disable-next-line no-console
    console.log(`[smsService] (dev, Twilio not configured) SMS to ${toPhoneNumber}: ${body}`);
    return { sid: 'dev-fake-sid', status: 'dev-simulated' };
  }

  try {
    const message = await getClient().messages.create({
      to: toPhoneNumber,
      body,
      ...(twilioConfig.messagingServiceSid
        ? { messagingServiceSid: twilioConfig.messagingServiceSid }
        : { from: twilioConfig.fromNumber }),
    });
    return { sid: message.sid, status: message.status };
  } catch (err) {
    // Twilio error codes: https://www.twilio.com/docs/api/errors
    // eslint-disable-next-line no-console
    console.error(`[smsService] Twilio send failed (code ${err.code}): ${err.message}`);
    throw ApiError.internal('Failed to send SMS. Please try again.', { code: 'SMS_SEND_FAILED' });
  }
}

module.exports = { sendSms };
