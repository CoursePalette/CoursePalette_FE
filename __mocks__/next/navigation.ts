export const useRouter = () => {
  return {
    push: () => console.log('[mock] push'),
    back: () => console.log('[mock] back'),
    replace: () => console.log('[mock] replace'),
    prefetch: () => console.log('[mock] prefetch'),
    forward: () => console.log('[mock] forward'),
    refresh: () => console.log('[mock] refresh'),
    // 여기에 필요한 라우터 기능들 계속 mock
  };
};

export const usePathname = () => {
  return '/mock-story-path';
};
