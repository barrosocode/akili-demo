export interface ApiErrorPayload {
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string>;
}
