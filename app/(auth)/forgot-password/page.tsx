import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  return <ForgotPasswordForm resetToken={params.token} />;
}
