export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details: Array<{ field?: string; message: string }>;

  constructor(message: string, statusCode: number, code: string = "API_ERROR", details: Array<{ field?: string; message: string }> = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const BASE_URL = `${API_ORIGIN}/api/v1`;

interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return {} as T;
  }

  let data: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    if (response.status === 401 && !path.includes("/auth/")) {
      // Unauthorized, redirect to login unless on public page
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    const errorData = data as ApiErrorPayload;
    throw new ApiError(
      errorData?.error?.message || response.statusText || "Request failed",
      response.status,
      errorData?.error?.code || "HTTP_ERROR",
      errorData?.error?.details || []
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
