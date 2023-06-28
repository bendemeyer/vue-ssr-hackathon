const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CLOUD_RUN_SERVICE_URLS?.split(',')[0] || process.env.CYPRESS_BASE_URL || 'http://localhost:3000/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
