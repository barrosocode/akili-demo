export function can(permissions: string[], required: string): boolean {
  return permissions.includes(required);
}

export function canAny(permissions: string[], required: string[]): boolean {
  return required.some((permission) => permissions.includes(permission));
}

export function checkAccess(
  permissions: string[],
  required: string | string[] | null
): boolean {
  if (!required) return true;
  if (Array.isArray(required)) return canAny(permissions, required);
  return can(permissions, required);
}
