import { redirect } from "next/navigation";

import { STUDENT_HOME_PATH } from "@/lib/auth/portal-paths";

export default function StudentStudiesRedirectPage() {
  redirect(STUDENT_HOME_PATH);
}
