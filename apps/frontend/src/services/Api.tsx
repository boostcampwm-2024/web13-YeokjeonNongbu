import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

const pendingRequests = new Map();

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const requestKey = `${config.url}&${config.method}&${JSON.stringify(config.params)}&${JSON.stringify(config.data)}`;

    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller.abort();
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    const requestKey = `${response.config.url}&${response.config.method}&${JSON.stringify(response.config.params)}&${JSON.stringify(response.config.data)}`;
    pendingRequests.delete(requestKey);

    return response;
  },
  error => {
    const requestKey = `${error.config?.url}&${error.config?.method}&${JSON.stringify(error.config?.params)}&${JSON.stringify(error.config?.data)}`;
    pendingRequests.delete(requestKey);

    if (error.response && error.response.status === 401) {
      localStorage.clear();
      alert('액세스 토큰이 만료되었습니다. 로그아웃되었습니다.');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);
