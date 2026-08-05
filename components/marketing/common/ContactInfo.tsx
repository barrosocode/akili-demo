import { siteConfig } from "@/constants/site";

type ContactInfoProps = {
  showLabels?: boolean;
  className?: string;
};

/**
 * Contato institucional (SPEC-003 / MARKETING-018).
 * Server Component — valores em `siteConfig.contact`.
 */
export function ContactInfo({
  showLabels = true,
  className = "header-links v4 style2 style-white",
}: ContactInfoProps) {
  const { email, phoneDisplay, phoneTel } = siteConfig.contact;

  return (
    <div className={className}>
      <ul>
        <li>
          <i className="fas fa-envelope" aria-hidden="true" />
          {showLabels ? <span>E-mail: </span> : null}
          <a href={`mailto:${email}`}>{email}</a>
        </li>
        <li>
          <i className="fas fa-mobile-alt" aria-hidden="true" />
          {showLabels ? <span>Telefone: </span> : null}
          <a href={`tel:${phoneTel}`}>{phoneDisplay}</a>
        </li>
      </ul>
    </div>
  );
}
