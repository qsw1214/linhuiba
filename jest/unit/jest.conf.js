const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  // testPathIgnorePatterns: [
  //   '<rootDir>/test/e2e'
  // ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/jest/unit/setup'],
  mapCoverage: true,
  coverageDirectory: '<rootDir>/jest/unit/coverage',
  collectCoverageFrom: [
    // 'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/router.js',
    '!**/node_modules/**',
    '!src/components/mixin.js',
    '!src/style/**',
    '!src/store/**',
    '!src/service/**',
    '!src/images/**',
  ]
}
