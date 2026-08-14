import { siteConfig } from "@/constants/site";
import type { SocialIconId, SocialLink } from "@/types/marketing";

type SocialLinksVariant = "list" | "cluster";

type SocialLinksProps = {
  links?: SocialLink[];
  className?: string;
  /**
   * `list` = TopBar (`ul.social-links4` + `li`).
   * `cluster` = Footer (`div.vs-social` com `<a>` diretos).
   */
  variant?: SocialLinksVariant;
};

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    icon: "facebook",
  },
  {
    label: "X",
    href: siteConfig.social.x,
    icon: "x",
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: "linkedin",
  },
];

function socialIconClassName(icon: SocialIconId): string {
  switch (icon) {
    case "instagram":
      return "fab fa-instagram";
    case "facebook":
      return "fab fa-facebook-f";
    case "x":
      // Paridade visual com o legado (ícone Twitter do FA no tema).
      return "fab fa-twitter";
    case "linkedin":
      return "fab fa-linkedin-in";
    default: {
      const _exhaustive: never = icon;
      return _exhaustive;
    }
  }
}

function SocialAnchor({ link }: { link: SocialLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
    >
      <i className={socialIconClassName(link.icon)} aria-hidden="true" />
    </a>
  );
}

function defaultClassName(variant: SocialLinksVariant): string {
  switch (variant) {
    case "list":
      return "social-links4";
    case "cluster":
      return "vs-social social-style1 v2";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

/**
 * Redes sociais do marketing (SPEC-003 / MARKETING-017).
 * Server Component — ícones FontAwesome via CSS do tema.
 */
export function SocialLinks({
  links = DEFAULT_SOCIAL_LINKS,
  className,
  variant = "list",
}: SocialLinksProps) {
  const resolvedClassName = className ?? defaultClassName(variant);

  switch (variant) {
    case "cluster":
      return (
        <div className={resolvedClassName}>
          {links.map((link) => (
            <SocialAnchor key={link.icon} link={link} />
          ))}
        </div>
      );
    case "list":
      return (
        <ul className={resolvedClassName}>
          {links.map((link) => (
            <li key={link.icon}>
              <SocialAnchor link={link} />
            </li>
          ))}
        </ul>
      );
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
