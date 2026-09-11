"use client";

type SupportFaqBodyProps = {
  html: string;
};

/** Body HTML is sanitized on write by the API allowlist. */
export function SupportFaqBody({ html }: SupportFaqBodyProps) {
  return (
    <div
      className="akili-support-faq-body blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
