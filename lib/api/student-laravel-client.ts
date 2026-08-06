import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

import { unwrapData } from "@/lib/api/envelope";
import { toApiError } from "@/lib/api/errors";
import {
  clearStudentAuthCookies,
  getStudentAccessToken,
  getStudentRefreshToken,
  setStudentAuthCookies,
} from "@/lib/auth/student-cookies";
import { ApiError } from "@/types/api";

const baseURL = process.env.LARAVEL_API_URL ?? "http://localhost:8000/api/v1";
const timeout = Number(process.env.LARAVEL_API_TIMEOUT_MS ?? 30000);

let refreshPromise: Promise<string | null> | null = null;

const http = axios.create({
  baseURL,
  timeout,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

async function refreshStudentAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getStudentRefreshToken();
      const accessToken = await getStudentAccessToken();

      if (!refreshToken && !accessToken) return null;

      try {
        const response = await axios.post(
          `${baseURL}/mobile/auth/refresh`,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken ?? refreshToken}`,
            },
            timeout,
          }
        );

        const data = unwrapData<{
          token: string;
          refresh_token?: string;
          expires_in?: number;
        }>(response.data);

        await setStudentAuthCookies({
          accessToken: data.token,
          refreshToken: data.refresh_token,
          expiresAt: data.expires_in
            ? Date.now() + data.expires_in * 1000
            : undefined,
        });

        return data.token;
      } catch {
        await clearStudentAuthCookies();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.headers?.["x-skip-auth"]) {
    delete config.headers["x-skip-auth"];
    return config;
  }

  const token = await getStudentAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.headers?.["x-skip-unauthorized-retry"]
    ) {
      original._retry = true;
      const newToken = await refreshStudentAccessToken();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      }
    }

    return Promise.reject(toApiError(error));
  }
);

export async function studentLaravelRequest<T>(
  path: string,
  config?: AxiosRequestConfig & { skipAuth?: boolean; skipUnauthorizedRetry?: boolean }
): Promise<T> {
  try {
    const headers: Record<string, string> = {
      ...(config?.headers as Record<string, string> | undefined),
    };

    if (config?.skipAuth) headers["x-skip-auth"] = "1";
    if (config?.skipUnauthorizedRetry) headers["x-skip-unauthorized-retry"] = "1";

    const response = await http.request({
      url: path,
      ...config,
      headers,
    });

    return unwrapData<T>(response.data);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw toApiError(error);
  }
}
