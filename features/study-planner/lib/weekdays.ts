import type { WeekdayIso } from "@/types/guardian-study-planner";

export const WEEKDAYS: { iso: WeekdayIso; label: string }[] = [
  { iso: "mon", label: "Segunda" },
  { iso: "tue", label: "Terça" },
  { iso: "wed", label: "Quarta" },
  { iso: "thu", label: "Quinta" },
  { iso: "fri", label: "Sexta" },
  { iso: "sat", label: "Sábado" },
  { iso: "sun", label: "Domingo" },
];

export const SCHOOL_WEEKDAYS = WEEKDAYS.filter(
  (day) => day.iso !== "sat" && day.iso !== "sun"
);

export function isSchoolWeekday(
  iso: string
): iso is (typeof SCHOOL_WEEKDAYS)[number]["iso"] {
  return SCHOOL_WEEKDAYS.some((day) => day.iso === iso);
}

export function weekdayLabel(iso: string): string {
  return WEEKDAYS.find((day) => day.iso === iso)?.label ?? iso;
}
