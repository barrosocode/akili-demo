import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { unwrapData } from "@/lib/api/envelope";
import { toApiError } from "@/lib/api/errors";
import { ApiError } from "@/types/api";
import { hasAssistanceSessionCookie } from "@/lib/auth/assistance-cookies";
import {
  clearAllPortalAuthCookies,
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  isSupportDeskTokenActive,
  setAuthCookies,
} from "@/lib/auth/cookies";
import {
  clearSupportAuthCookies,
  getSupportAccessToken,
  setSupportAuthCookies,
} from "@/lib/auth/support-cookies";

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

async function refreshAccessToken(): Promise<string | null> {
  if (await hasAssistanceSessionCookie()) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      const accessToken = await getAccessToken();

      if (!refreshToken && !accessToken) return null;

      const useSupportRefresh = await isSupportDeskTokenActive();
      const refreshPath = useSupportRefresh
        ? "/support/auth/refresh"
        : "/client/auth/refresh";

      try {
        const response = await axios.post(
          `${baseURL}${refreshPath}`,
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

        if (useSupportRefresh) {
          await setSupportAuthCookies({
            accessToken: data.token,
            refreshToken: data.refresh_token,
            expiresAt: data.expires_in
              ? Date.now() + data.expires_in * 1000
              : undefined,
          });
        } else {
          await setAuthCookies({
            accessToken: data.token,
            refreshToken: data.refresh_token,
            expiresAt: data.expires_in
              ? Date.now() + data.expires_in * 1000
              : undefined,
          });
        }

        return data.token;
      } catch {
        if (useSupportRefresh) {
          await clearSupportAuthCookies();
        } else {
          await clearAuthCookies();
        }
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

  const token = await getAccessToken();
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
      if (await hasAssistanceSessionCookie()) {
        await clearAllPortalAuthCookies();
        return Promise.reject(toApiError(error));
      }

      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      }
    }

    return Promise.reject(toApiError(error));
  }
);

export async function laravelRequest<T>(
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

/** Força o Bearer da mesa de suporte (ignora prioridade assistance/guardian). */
export async function supportLaravelRequest<T>(
  path: string,
  config?: AxiosRequestConfig & { skipUnauthorizedRetry?: boolean }
): Promise<T> {
  const token = await getSupportAccessToken();
  if (!token) {
    throw new ApiError({
      title: "Não autenticado",
      status: 401,
      detail: "Sessão de atendimento expirada. Entre novamente.",
    });
  }

  try {
    const headers: Record<string, string> = {
      ...(config?.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
      "x-skip-auth": "1",
    };
    if (config?.skipUnauthorizedRetry) {
      headers["x-skip-unauthorized-retry"] = "1";
    }

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

export { http as laravelHttp };
