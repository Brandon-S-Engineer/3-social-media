// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom', // Simulates a browser-like environment
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Specifies setup file
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transforms modern JavaScript and TypeScript
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Mocks CSS/SCSS imports
  },
  collectCoverage: true, // Collect code coverage
  coverageDirectory: 'coverage', // Directory for coverage reports
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}', // Include source files
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/index.{js,jsx,ts,tsx}', // Exclude entry files
  ],
  resetMocks: true, // Automatically reset mocks after each test
  clearMocks: true, // Clear mock usage data after each test
};
