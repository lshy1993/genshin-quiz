import Axios, { type AxiosRequestConfig, type AxiosRequestHeaders } from 'axios';
import qs from 'qs';

const axios = Axios.create({
  baseURL: '/api/',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
  } as AxiosRequestHeaders,
  withCredentials: false,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true }),
  transformRequest: Axios.defaults.transformRequest
    ? Array.isArray(Axios.defaults.transformRequest)
      ? [...Axios.defaults.transformRequest]
      : [Axios.defaults.transformRequest]
    : [],
});

axios.interceptors.request.use((config) => {
  if (config.method && ['post', 'put', 'patch'].includes(config.method)) {
    // 如果已经手动设置了 Content-Type，保持不变
    if (config.headers?.['Content-Type']) {
      return config;
    }

    // 如果数据是 FormData，让浏览器自动设置 Content-Type（包含 boundary）
    if (config.data instanceof FormData) {
      // 不设置 Content-Type，让浏览器自动处理
      return config;
    }

    // 默认情况下使用 application/json
    config.headers['Content-Type'] = 'application/json';
  } else {
    delete config.headers['Content-Type'];
  }
  return config;
});

export const Fetcher = async <T>(config: AxiosRequestConfig): Promise<T> => {
  // if (getJWT() === '') {
  //     return Promise.reject('No JWT token set');
  // }
  const promise = await axios
    .request<T>(config)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 401) {
          // 401 Unauthorized
          // setJWT('');
        }
        return Promise.reject(err.response.data);
      }
      return Promise.reject(err);
    });
  return promise;
};
export default Fetcher;

export const getJWT = () => {
  return axios.defaults.headers.common.Authorization?.toString() ?? '';
};

export const setJWT = (token: string) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};
