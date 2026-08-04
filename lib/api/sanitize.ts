const REF_PREFIX = "ref_";

export function toRef(uuid: string): string {
  return `${REF_PREFIX}${Buffer.from(uuid).toString("base64url")}`;
}

export function fromRef(ref: string): string | null {
  if (!ref.startsWith(REF_PREFIX)) return null;
  try {
    return Buffer.from(ref.slice(REF_PREFIX.length), "base64url").toString("utf8");
  } catch {
    return null;
  }
}

type SanitizableRecord = Record<string, unknown>;

const INTERNAL_KEYS = new Set([
  "uuid",
  "id",
  "tenant_id",
  "slug",
  "assignable_id",
  "guardian_id",
  "student_id",
  "classroom_id",
  "school_id",
]);

export function sanitizeRecord<T extends SanitizableRecord>(
  record: T,
  options?: { keepRef?: boolean }
): SanitizableRecord {
  const result: SanitizableRecord = {};

  for (const [key, value] of Object.entries(record)) {
    if (INTERNAL_KEYS.has(key)) {
      if (key === "uuid" && options?.keepRef !== false && typeof value === "string") {
        result.ref = toRef(value);
      }
      continue;
    }

    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "object" && item !== null
          ? sanitizeRecord(item as SanitizableRecord)
          : item
      );
      continue;
    }

    if (typeof value === "object" && value !== null) {
      result[key] = sanitizeRecord(value as SanitizableRecord);
      continue;
    }

    result[key] = value;
  }

  return result;
}

export function sanitizeList<T extends SanitizableRecord>(items: T[]): SanitizableRecord[] {
  return items.map((item) => sanitizeRecord(item));
}
