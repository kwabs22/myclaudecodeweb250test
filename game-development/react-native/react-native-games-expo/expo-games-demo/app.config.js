// Adds the folder the web export is served from. EXPO_BASE_URL is only set by the Session Atlas site build;
// without it this behaves exactly like app.json on its own.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...(config.experiments || {}),
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
