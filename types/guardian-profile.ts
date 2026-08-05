/**
 * Perfil do responsável para a UI do portal (sem identificadores técnicos).
 */
export type GuardianProfile = {
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
};

/**
 * Shape cru do Laravel `GuardianResource` (uso só no BFF/Route Handler).
 */
export type GuardianResourceApi = {
  uuid?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  document?: string | null;
  status?: string;
};
