import type { ReactNode } from "react";

import { StudentGuard } from "@/features/auth/components/student-guard";

export default function StudentAreaLayout({ children }: { children: ReactNode }) {
  return <StudentGuard>{children}</StudentGuard>;
}
