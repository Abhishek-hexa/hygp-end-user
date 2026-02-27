import axios, { AxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
};

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? import.meta.env.REACT_APP_API_URL ?? '';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (response) => {
    // TEMP: response logger to inspect backend payloads while wiring managers.
    console.log('[API][RESPONSE]', {
      data: response.data,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      url: response.config.url,
    });

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // TEMP: error logger to inspect failing payloads as well.
    console.error('[API][ERROR]', {
      data: error.response?.data,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      url: error.config?.url,
    });

    const message =
      error.response?.data?.message ?? error.message ?? 'Unexpected API error';

    return Promise.reject(new Error(message));
  },
);
