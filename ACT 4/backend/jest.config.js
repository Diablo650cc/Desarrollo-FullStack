module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'routes/**/*.js',
        'models/**/*.js',
        'middleware/**/*.js'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/'
    ],
    testTimeout: 10000,
    forceExit: true,
    clearMocks: true
};
