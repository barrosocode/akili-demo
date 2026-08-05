import Link from "next/link";
import type { ReactNode } from "react";

type MarketingButtonVariant = "default" | "v4" | "banner" | "form5";

type MarketingButtonBase = {
  variant?: MarketingButtonVariant;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

type MarketingButtonAsLink = MarketingButtonBase & {
  href: string;
};

type MarketingButtonAsButton = MarketingButtonBase & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
};

export type MarketingButtonProps = MarketingButtonAsLink | MarketingButtonAsButton;

function variantClassName(variant: MarketingButtonVariant): string {
  switch (variant) {
    case "default":
      return "vs-btn";
    case "v4":
      return "vs-btn v4";
    case "banner":
      return "vs-btn banner";
    case "form5":
      return "vs-btn form5";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function joinClassNames(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * CTA do tema marketing (`vs-btn`). Não usar `components/ui/button` (shadcn).
 * SPEC-003 / MARKETING-020 — Server Component.
 */
export function Button(props: MarketingButtonProps) {
  const { variant = "default", children, className, disabled = false } = props;
  const classes = joinClassNames(variantClassName(variant), className);

  if (props.href !== undefined) {
    if (disabled) {
      return (
        <span className={classes} aria-disabled="true" role="link">
          {children}
        </span>
      );
    }

    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
