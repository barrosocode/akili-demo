/**
 * Folhas do tema legado servidas de `public/assets/css`
 * (MARKETING-003 / 004) — não bundlar para preservar urls relativas.
 */
export function MarketingThemeStyles() {
  return (
    <>
      <link
        rel="stylesheet"
        href="/assets/css/bootstrap.min.css"
        precedence="medium"
      />
      <link
        rel="stylesheet"
        href="/assets/css/fontawesome.min.css"
        precedence="medium"
      />
      <link
        rel="stylesheet"
        href="/assets/css/style.css"
        precedence="medium"
      />
    </>
  );
}
