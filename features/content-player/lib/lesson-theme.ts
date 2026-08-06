/**
 * Tokens alinhados ao Kiddino (portal aluno).
 * Preferir classes CSS (`lesson-player-*`); estes valores servem a feedbacks dinâmicos.
 */
export const lessonTheme = {
  primary: "var(--theme-color, #DF5C16)",
  primarySolid: "#DF5C16",
  secondary: "var(--vs-secondary-color, #47892F)",
  secondarySolid: "#47892F",
  secondaryBg: "#EAF5E4",
  title: "var(--title-color, #060A39)",
  body: "#444",
  muted: "#6c757d",
  line: "#e8e8e8",
  card: "#ffffff",
  pageBg: "#f7f7f9",
  danger: "#B03A2E",
  dangerBg: "#FBEBE9",
  success: "#47892F",
  successBg: "#EAF5E4",
  headerGradient:
    "linear-gradient(135deg, #c24e12 0%, var(--theme-color, #DF5C16) 55%, #f07a35 100%)",
  fontDisplay: 'var(--title-font, "Fredoka", system-ui, sans-serif)',
  fontBody: 'var(--body-font, "Jost", system-ui, sans-serif)',
} as const;
