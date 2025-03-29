import axios, { AxiosInstance } from 'axios';


const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  timeout: 5000,
});

export {axiosInstance};