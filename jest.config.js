// jest.config.js
const nextJest = require('next/jest');  // Next.js 제공 유틸리티
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // 경로 별칭(@)을 Jest가 인식하도록 매핑
    '^@/(.*)$': '<rootDir>/components/$1'
  }
  // 필요시 여기에 기타 Jest 옵션 추가 가능 (예: coverage 설정 등)
};

module.exports = createJestConfig(customJestConfig);
