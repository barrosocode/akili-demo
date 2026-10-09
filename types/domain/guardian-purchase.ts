export interface GuardianPurchaseStudent {
  ref: string;
  name: string;
  login: string | null;
}

export interface GuardianPurchasePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GuardianPurchase {
  ref: string;
  packageName: string;
  statusLabel: string;
  amountLabel: string;
  paidAt: string | null;
  canAddChild: boolean;
  unavailableReason: string | null;
  student: GuardianPurchaseStudent | null;
}

export interface GuardianPurchasesPage {
  purchases: GuardianPurchase[];
  pagination: GuardianPurchasePagination;
}

export interface CreatedGuardianChild {
  name: string;
  login: string | null;
  preferredName: string | null;
  birthdate: string | null;
  relationship: string | null;
  packageName: string | null;
}
