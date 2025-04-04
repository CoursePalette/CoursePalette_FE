import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// 요청 인터셉터에서 NextAuth 세션 안에 있는 backendJwt를 꺼내서 Authrization 헤더 세팅
axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.user?.backendJwt) {
      config.headers.Authorization = `Bearer ${session.user.backendJwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosServer: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export { axiosClient, axiosServer };
