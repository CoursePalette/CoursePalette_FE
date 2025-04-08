import '@testing-library/jest-dom';

jest.mock('next/navigation', () => {
  const actual = require('next-router-mock');
  return {
    useRouter: actual.useRouter,
    usePathname: actual.usePathname,
    useSearchParams: actual.useSearchParams,
    redirect: actual.redirect,
  };
});

// Pointer Events Polyfill (Radix UI 등에서 사용)
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId;
    width;
    height;
    pressure;
    tangentialPressure;
    tiltX;
    tiltY;
    twist;
    pointerType;
    isPrimary;

    constructor(type, params = {}) {
      super(type, params);
      this.pointerId = params.pointerId;
      this.width = params.width;
      this.height = params.height;
      this.pressure = params.pressure;
      this.tangentialPressure = params.tangentialPressure;
      this.tiltX = params.tiltX;
      this.tiltY = params.tiltY;
      this.twist = params.twist;
      this.pointerType = params.pointerType;
      this.isPrimary = params.isPrimary;
    }
  }
  window.PointerEvent = PointerEvent;
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = (pointerId) => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = (pointerId) => {};
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = (pointerId) => false;
  }
}

// matchMedia 모킹 (반응형 디자인 컴포넌트 테스트 시 필요)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false, // 기본적으로 false 반환 (필요시 테스트별로 변경 가능)
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// IntersectionObserver 모킹 (가시성 기반 동작 컴포넌트 테스트 시 필요)
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// ResizeObserver 모킹 (요소 크기 변화 감지 컴포넌트 테스트 시 필요)
const mockResizeObserver = jest.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.ResizeObserver = mockResizeObserver;

// scrollIntoView Polyfill
if (typeof window !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn(); // 간단한 모의 함수 할당
}
