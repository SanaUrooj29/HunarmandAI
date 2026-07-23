const { env } = require('./env');

module.exports = {
  accountSid: env.TWILIO_ACCOUNT_SID,
  authToken: env.TWILIO_AUTH_TOKEN,
  fromNumber: env.TWILIO_FROM_NUMBER,
  messagingServiceSid: env.TWILIO_MESSAGING_SERVICE_SID,
  isConfigured: Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && (env.TWILIO_FROM_NUMBER || env.TWILIO_MESSAGING_SERVICE_SID)),
};
