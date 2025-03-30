import { BOOKS_API_ENDPOINT } from '@/constants/constants';
import { useAuth } from '@/providers/auth-provider';
import { ErrorResponse } from '@/types';

export const useApi = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  const fetcher = async <T>(url: string, options: RequestInit = {}) => {
    const response = await fetch(`${BOOKS_API_ENDPOINT}${url}`, options);
    if (!response.ok) {
      throw new Error(await generateErrorMessage(url, response));
    }
    return response.json() as Promise<T>;
  };

  const fetcherWithAuth = async <T>(url: string, options: RequestInit = {}) => {
    let response = await fetch(`${BOOKS_API_ENDPOINT}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      response = await fetch(`${BOOKS_API_ENDPOINT}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error(await generateErrorMessage(url, response));
    }

    return response.json() as Promise<T>;
  };

  const mutationWithAuth = async (url: string, options: RequestInit = {}) => {
    let response = await fetch(`${BOOKS_API_ENDPOINT}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      response = await fetch(`${BOOKS_API_ENDPOINT}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error(await generateErrorMessage(url, response));
    }
  };

  const generateErrorMessage = async (url: string, response: Response) => {
    let errorMessage = `[URL] ${url}`;
    try {
      const errorResponse = (await response.json()) as ErrorResponse;
      errorMessage += ` [MESSAGE] ${errorResponse.message} [STATUS] ${response.status}(${errorResponse.status})`;
    } catch {
      // JSON でない場合は無視
    }
    return errorMessage;
  };

  return { fetcher, fetcherWithAuth, mutationWithAuth };
};
