type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Script JSON-LD genérico (MARKETING-054).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
