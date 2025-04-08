/* eslint-disable @typescript-eslint/no-explicit-any */

//axios.create() 호출 시 인터셉터와 http 메서드를 포함한 객체를 반환하도록 모킹

const instance = {
  interceptors: {
    request: {
      handlers: [] as any,
      use(fulfilled: any) {
        this.handlers.push({ fulfilled });
      },
    },
  },
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
};

const axiosMock = {
  create: jest.fn(() => instance),
  post: instance.post,
  get: instance.get,
  delete: instance.delete,
  push: instance.put,
};

export default axiosMock;
