export interface ApiErrorPayload {
  title: string;
  status: number;
  detail?: string;
  type?: string;
  error_code?: string;
  errors?: Record<string, string>;
}
