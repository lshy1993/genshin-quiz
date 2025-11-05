import Axios, { type AxiosRequestConfig, type AxiosRequestHeaders } from 'axios';
import { DateTime } from 'luxon';
import qs from 'qs';

const axiosClient = Axios.create({
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

axiosClient.interceptors.request.use((config) => {
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

// 声明全局的登出回调函数，将在应用初始化时设置
let globalLogoutCallback: (() => void) | null = null;

export const setGlobalLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

axiosClient.interceptors.response.use(
  (originalResponse) => {
    originalResponse.data = transformDatesWithZod(originalResponse.data);
    return originalResponse;
  },
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.force_logout === true) {
      // 强制登出，调用全局登出回调来正确清理状态
      if (globalLogoutCallback) {
        globalLogoutCallback();
      }
    }
    return Promise.reject(error);
  },
);

export const Fetcher = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = await axiosClient
    .request<T>(config)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 401) {
          // 401 Unauthorized
          setJWT(''); // 清空本地 JWT
        }
        return Promise.reject(err.response.data);
      }
      return Promise.reject(err);
    });
  return promise;
};
export default Fetcher;

export const getJWT = () => {
  return axiosClient.defaults.headers.common.Authorization?.toString() ?? '';
};

export const setJWT = (token: string) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common.Authorization;
  }
};

// Recursively transform date strings in objects
function transformDatesWithZod(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Try to parse as ISO datetime string
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
    if (dateTimeRegex.test(obj)) {
      try {
        const dateTime = DateTime.fromISO(obj);
        if (dateTime.isValid) {
          return dateTime.toJSDate(); // 直接返回 Date 对象
        }
      } catch {
        // 如果解析失败，返回原字符串
        console.warn(`Failed to parse date string: ${obj}`);
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformDatesWithZod(item));
  }

  if (typeof obj === 'object') {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      transformed[key] = transformDatesWithZod(value);
    }
    return transformed;
  }

  return obj;
}
