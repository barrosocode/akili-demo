/**
 * Tokens da prévia editorial (admin). O visual do player vive no CSS
 * (`.lesson-player`); estes valores cobrem feedbacks dinâmicos.
 */
export const lessonTheme = {
  primary: "#1A5FAD",
  primarySolid: "#1A5FAD",
  primaryDeep: "#0E3A6B",
  secondary: "#1E7A46",
  secondarySolid: "#1E7A46",
  secondaryBg: "#E7F3EC",
  title: "#0E3A6B",
  body: "#20303f",
  muted: "#5b6b78",
  line: "#dbe4ee",
  card: "#ffffff",
  pageBg: "#eef2f7",
  cream: "#FBF6EE",
  danger: "#B03A2E",
  dangerBg: "#FBEBE9",
  success: "#1E7A46",
  successBg: "#E7F3EC",
  headerGradient: "linear-gradient(135deg, #0E3A6B 0%, #1A5FAD 100%)",
  fontDisplay: '"Lora", Georgia, serif',
  fontBody: '"Nunito", system-ui, sans-serif',
} as const;

export const LESSON_PREVIEW_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap";
