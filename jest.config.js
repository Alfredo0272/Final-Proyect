/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist', 'src/app/app.ts', 'src/index.ts'],
  resolver: 'jest-ts-webcompat-resolver',
  coveragePathIgnorePatterns: [
    'src/app.ts',
    'src/index.ts',
    'src/routers/user.routes.ts',
    'src/routers/beer.routes.ts',
  ],
};
