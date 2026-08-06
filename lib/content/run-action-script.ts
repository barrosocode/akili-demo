import { falar, type SpeakOptions } from "@/lib/content/speak";

export type ActionScriptFn = (
  text: string,
  opt?: SpeakOptions
) => Promise<void> | void;

type ActionScriptModule = {
  default?: ActionScriptFn;
  falar?: ActionScriptFn;
};

const SCRIPT_LOADERS: Record<string, () => Promise<ActionScriptModule>> = {
  "speak.js": async () => ({ default: falar, falar }),
};

function normalizeActionPath(path: string): string {
  const trimmed = path.replace(/^\.?\//, "");
  return trimmed.split("/").pop() ?? trimmed;
}

export async function loadActionScript(path: string): Promise<ActionScriptFn> {
  const key = normalizeActionPath(path);
  const loader = SCRIPT_LOADERS[key];

  if (!loader) {
    throw new Error(`Script de action não suportado: ${path}`);
  }

  const mod = await loader();
  const fn = mod.falar ?? mod.default;

  if (typeof fn !== "function") {
    throw new Error(`Script ${path} não exporta uma função executável.`);
  }

  return fn;
}

export async function runActionScript(
  path: string,
  readText: string
): Promise<void> {
  const fn = await loadActionScript(path);
  await fn(readText);
}
