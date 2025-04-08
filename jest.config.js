// jest.config.js
const nextJest = require('next/jest'); // Next.js 제공 유틸리티
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // 경로 별칭(@)을 Jest가 인식하도록 매핑
    '^@/(.*)$': '<rootDir>/$1',
  },
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: './test-results/test-report.html', // HTML 파일이 생성될 경로
        pageTitle: 'Test Report', // HTML 페이지 제목
        includeFailureMsg: true, // 실패 메시지 포함 여부
        includeConsoleLog: true, // 콘솔 로그 포함 여부
      },
    ],
  ],
  // 필요시 여기에 기타 Jest 옵션 추가 가능 (예: coverage 설정 등)
};

module.exports = createJestConfig(customJestConfig);
