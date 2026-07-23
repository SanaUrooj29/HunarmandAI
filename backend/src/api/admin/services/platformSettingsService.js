const { PlatformSettings } = require('../../shared/models');

/** Singleton — always operates on the first (and only) settings document, creating it on first access. */
async function getSettings() {
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create({});
  }
  return settings;
}

const EDITABLE_TOP_LEVEL = ['platformCommissionPercentage', 'termsAndConditions', 'privacyPolicy'];
const EDITABLE_NESTED = ['paymentMethods', 'walletSettings', 'otpSettings', 'aiSettings'];

async function updateSettings(updates) {
  const settings = await getSettings();

  EDITABLE_TOP_LEVEL.forEach((field) => {
    if (updates[field] !== undefined) settings[field] = updates[field];
  });
  EDITABLE_NESTED.forEach((field) => {
    if (updates[field] !== undefined) {
      Object.assign(settings[field], updates[field]);
    }
  });

  await settings.save();
  return settings;
}

module.exports = { getSettings, updateSettings };
