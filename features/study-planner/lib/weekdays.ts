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

export function weekdayLabel(iso: string): string {
  return WEEKDAYS.find((day) => day.iso === iso)?.label ?? iso;
}
