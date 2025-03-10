module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest']
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/*.test.js'],
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage'
};