import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/constants/site";

type LogoVariant = "positive" | "negative";

type LogoProps = {
  variant: LogoVariant;
  href?: string;
  priority?: boolean;
  className?: string;
};

const logoByVariant = {
  positive: siteConfig.assets.logoPositive,
  negative: siteConfig.assets.logoNegative,
} as const;

/**
 * Marca Akili com link para a home (SPEC-003 / MARKETING-016).
 * Server Component — `next/image` + `next/link`.
 */
export function Logo({
  variant,
  href = "/",
  priority = false,
  className,
}: LogoProps) {
  const logo = logoByVariant[variant];
  // Nome acessível do link = alt da imagem (evita duplicar com aria-label no <Link>).
  const alt = `Logotipo ${siteConfig.brand.name}`;

  return (
    <Link href={href} className={className}>
      <Image
        src={logo.src}
        alt={alt}
        width={logo.width}
        height={logo.height}
        priority={priority}
      />
    </Link>
  );
}
