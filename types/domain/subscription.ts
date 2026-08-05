export interface PortalSubscription {
  planKey: string;
  planName: string;
  status: string;
  audience: string;
  startsAt: string | null;
  endsAt: string | null;
  description: string | null;
  limits: {
    maxStudents: number | null;
    studentsUsed: number;
    maxPackages: number | null;
  };
  features: Record<string, boolean>;
  upgradeTargets: string[];
  downgradeTargets: string[];
}
