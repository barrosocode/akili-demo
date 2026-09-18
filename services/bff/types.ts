export interface ApiErrorPayload {
  title: string;
  status: number;
  detail?: string;
  type?: string;
  error_code?: string | null;
  errorCode?: string | null;
  errors?: Record<string, string>;
  data?: unknown;
}
