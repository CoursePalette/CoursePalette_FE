export const useRouter = () => {
  return {
    push: () => console.log('[mock] push'),
    back: () => console.log('[mock] back'),
    // 여기에 필요한 라우터 기능들 계속 mock
  };
};
