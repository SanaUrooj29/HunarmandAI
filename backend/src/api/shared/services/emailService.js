const axios = require('axios');
const { env } = require('../config/env');

/**
 * Generic REST-based transactional email sender. The SRS does not name a
 * specific email provider (no admin-facing email requirement existed
 * before password reset was added in FR context) — this follows the same
 * dev-console-fallback pattern as smsService/otpService so the rest of the
 * auth flow is testable without real provider credentials.
 */
async function sendEmail({ to, subject, html }) {
  if (env.NODE_ENV !== 'production' || !env.EMAIL_BASE_URL) {
    // eslint-disable-next-line no-console
    console.log(`[emailService] (dev) email to ${to} | subject: ${subject}\n${html}`);
    return;
  }
  await axios.post(
    env.EMAIL_BASE_URL,
    { to, from: env.EMAIL_FROM_ADDRESS, subject, html },
    { headers: { Authorization: `Bearer ${env.EMAIL_API_KEY}` }, timeout: 8000 }
  );
}

async function sendPasswordResetEmail({ to, resetToken }) {
  const resetUrl = `${env.ADMIN_RESET_PASSWORD_URL}?token=${resetToken}`;
  await sendEmail({
    to,
    subject: 'HunarmandAI Admin — Password Reset',
    html: `<p>A password reset was requested for your admin account.</p>
           <p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 30 minutes.</p>
           <p>If you did not request this, you can safely ignore this email.</p>`,
  });
}

module.exports = { sendEmail, sendPasswordResetEmail };
