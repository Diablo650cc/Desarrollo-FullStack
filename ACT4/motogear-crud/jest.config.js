module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/*.js',
        '!src/models/*.js'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
