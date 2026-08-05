/**
 * Folhas do tema Kiddino servidas de `public/assets/css`
 * (SPEC-014 / PORTAL-001) — não bundlar para preservar urls relativas.
 */
export function KiddinoThemeStyles() {
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
