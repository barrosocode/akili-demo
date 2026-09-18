export interface ApiErrorPayload {
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string>;
  error_code?: string | null;
  errorCode?: string | null;
  data?: unknown;
}
