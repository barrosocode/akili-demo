import { Fredoka, Jost } from "next/font/google";

/**
 * Tipografia do site institucional (SPEC-005 / SPEC-009).
 * Self-hosted via next/font — sem fonts.googleapis.com em runtime.
 */
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-fredoka",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jost",
});

export const marketingFontVariables = `${fredoka.variable} ${jost.variable}`;
