/**
 * Focused test for smsService's Twilio integration. Verifies:
 *  1. When Twilio credentials are NOT configured, it falls back to the
 *     console-log dev path (this is what makes the OTP-driven e2e tests
 *     work without any Twilio account).
 *  2. When configured, it calls the Twilio SDK with the correct shape,
 *     preferring messagingServiceSid over a bare "from" number.
 *  3. A Twilio API error is translated into our standard ApiError shape.
 *
 * Run: node tests/sms.test.js
 */
const results = [];
function check(label, condition, extra) {
  results.push({ label, pass: Boolean(condition) });
  console.log(`${condition ? '✓' : '✗'} ${label}${!condition && extra ? ` (${JSON.stringify(extra)})` : ''}`);
}

async function run() {
  // --------------------------------------------------- 1. DEV FALLBACK
  process.env.NODE_ENV = 'test';
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.TWILIO_MESSAGING_SERVICE_SID;

  let capturedLogs = [];
  const originalLog = console.log;
  console.log = (...a) => { capturedLogs.push(a.join(' ')); originalLog(...a); };

  const smsServiceUnconfigured = require('../src/api/shared/services/smsService');
  const devResult = await smsServiceUnconfigured.sendSms('+923001234567', 'Test message body');
  console.log = originalLog;

  check('dev fallback returns simulated result (no real send)', devResult.status === 'dev-simulated');
  check('dev fallback logs the message content', capturedLogs.some((l) => l.includes('Test message body')));

  // ------------------------------------------- 2. CONFIGURED (mocked SDK)
  delete require.cache[require.resolve('../src/api/shared/config/twilio.config')];
  delete require.cache[require.resolve('../src/api/shared/config/env')];
  delete require.cache[require.resolve('../src/api/shared/services/smsService')];
  delete require.cache[require.resolve('twilio')];

  process.env.TWILIO_ACCOUNT_SID = 'ACtest1234567890';
  process.env.TWILIO_AUTH_TOKEN = 'test-auth-token';
  process.env.TWILIO_MESSAGING_SERVICE_SID = 'MGtest1234567890';
  process.env.TWILIO_FROM_NUMBER = '+15551234567';

  // Mock the twilio module before smsService requires it, so no real
  // network call is attempted (Twilio's API host isn't reachable from
  // this sandbox anyway).
  let capturedCallArgs = null;
  const twilioModulePath = require.resolve('twilio');
  require.cache[twilioModulePath] = {
    id: twilioModulePath,
    filename: twilioModulePath,
    loaded: true,
    exports: function mockTwilioFactory() {
      return {
        messages: {
          create: async (args) => {
            capturedCallArgs = args;
            return { sid: 'SMmocked123', status: 'queued' };
          },
        },
      };
    },
  };

  const smsServiceConfigured = require('../src/api/shared/services/smsService');
  const configuredResult = await smsServiceConfigured.sendSms('+923001234567', 'Your OTP is 123456');

  check('configured send returns real-shaped result', configuredResult.sid === 'SMmocked123' && configuredResult.status === 'queued');
  check('Twilio called with correct "to"', capturedCallArgs?.to === '+923001234567');
  check('Twilio called with correct "body"', capturedCallArgs?.body === 'Your OTP is 123456');
  check(
    'messagingServiceSid preferred over "from" when both configured',
    capturedCallArgs?.messagingServiceSid === 'MGtest1234567890' && capturedCallArgs?.from === undefined
  );

  // --------------------------------------------- 3. ERROR TRANSLATION
  require.cache[twilioModulePath].exports = function mockTwilioFactoryError() {
    return {
      messages: {
        create: async () => {
          const err = new Error('The number +92XXX is not a valid phone number');
          err.code = 21211;
          throw err;
        },
      },
    };
  };
  delete require.cache[require.resolve('../src/api/shared/services/smsService')];
  const smsServiceErrorPath = require('../src/api/shared/services/smsService');

  let caughtError = null;
  try {
    await smsServiceErrorPath.sendSms('+92invalid', 'test');
  } catch (err) {
    caughtError = err;
  }
  check('Twilio error translated to ApiError', caughtError?.name === 'ApiError' && caughtError.statusCode === 500);
  check('ApiError carries SMS_SEND_FAILED code', caughtError?.code === 'SMS_SEND_FAILED');

  // --------------------------------------------------------------- SUMMARY
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.log('FAILED CHECKS:', failed.map((f) => f.label));
    process.exitCode = 1;
  } else {
    console.log('ALL SMS/TWILIO INTEGRATION CHECKS PASSED.');
  }
}

run().catch((err) => {
  console.error('TEST CRASHED:', err);
  process.exit(1);
});
