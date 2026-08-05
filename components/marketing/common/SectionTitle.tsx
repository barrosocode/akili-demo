import Image from "next/image";

const TITLE_ORNAMENT = {
  src: "/assets/img/breadcumb/title-img.png",
  width: 84,
  height: 84,
} as const;

type SectionTitleAlign = "center" | "start";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  showOrnament?: boolean;
  align?: SectionTitleAlign;
  className?: string;
};

function alignClassName(align: SectionTitleAlign): string {
  switch (align) {
    case "center":
      return "text-center";
    case "start":
      return "text-start";
    default: {
      const _exhaustive: never = align;
      return _exhaustive;
    }
  }
}

/**
 * Título de seção do marketing (SPEC-003 / MARKETING-029).
 * Server Component — ornament `title-img` via `next/image`.
 */
export function SectionTitle({
  title,
  subtitle,
  showOrnament = true,
  align = "center",
  className,
}: SectionTitleProps) {
  const classes = ["title-area-four", alignClassName(align), className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {showOrnament ? (
        <Image
          src={TITLE_ORNAMENT.src}
          alt=""
          width={TITLE_ORNAMENT.width}
          height={TITLE_ORNAMENT.height}
          aria-hidden
        />
      ) : null}
      <h2>{title}</h2>
      {subtitle ? <span className="sub-title">{subtitle}</span> : null}
    </div>
  );
}
