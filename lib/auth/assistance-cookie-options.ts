import { authConfig } from "./config.ts";

/** Shared options for set/delete — must stay aligned or clear fails in browsers. */
export function assistanceCookieOptions(maxAge?: number): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge?: number;
} {
  return {
    httpOnly: true,
    secure: authConfig.secure,
    sameSite: authConfig.sameSite,
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}
