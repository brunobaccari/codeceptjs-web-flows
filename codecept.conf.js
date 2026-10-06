exports.config = {
  tests: './tests/*_test.js',
  output: './results',
  name: 'codeceptjs-web-flows',
  timeout: 45,
  helpers: {
    Playwright: {
      url: process.env.BASE_URL || 'https://www.selenium.dev/selenium/web',
      browser: 'chromium',
      show: false,
      restart: 'context',
      waitForAction: 0,
      waitForTimeout: 10000,
      trace: true,
      keepTraceForPassedTests: true,
    },
  },
  plugins: {
    junitReporter: { enabled: true, outputName: 'junit.xml', attachSteps: true },
    screenshot: { enabled: true, on: 'fail' },
  },
};
