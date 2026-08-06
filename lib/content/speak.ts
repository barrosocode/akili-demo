/**
 * TTS pt-BR via speechSynthesis do navegador.
 * Port do admin scripts/front-end-scripts/speak.js
 */

const VOZ_BOA = [
  /google/i,
  /natural/i,
  /neural/i,
  /online/i,
  /luciana/i,
  /vit[oó]ria/i,
  /francisca/i,
  /camila/i,
  /thalita/i,
  /joana/i,
  /helena/i,
  /isabela/i,
  /maria/i,
];

const VOZ_RUIM = [/e-?speak/i, /compact/i, /festival/i, /robot/i];

let selectedVoice: SpeechSynthesisVoice | null = null;
let voicesPt: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function scoreVoice(voice: SpeechSynthesisVoice): number {
  let score = 0;
  if (/pt[-_]?BR/i.test(voice.lang)) score += 100;
  else if (/^pt/i.test(voice.lang)) score += 45;
  VOZ_BOA.forEach((re, index) => {
    if (re.test(voice.name)) score += 30 - index;
  });
  VOZ_RUIM.forEach((re) => {
    if (re.test(voice.name)) score -= 60;
  });
  if (voice.localService === false) score += 10;
  return score;
}

function loadVoices(): void {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = speechSynthesis.getVoices();
    voicesPt = voices
      .filter((voice) => /^pt/i.test(voice.lang))
      .sort((a, b) => scoreVoice(b) - scoreVoice(a));

    let saved: string | null = null;
    try {
      saved = localStorage.getItem("akili_voz");
    } catch {
      // ignore
    }

    if (saved) {
      selectedVoice = voices.find((voice) => voice.name === saved) ?? null;
    }
    if (!selectedVoice) {
      selectedVoice =
        voicesPt[0] ??
        voices.find((voice) => /^pt/i.test(voice.lang)) ??
        null;
    }
    voicesLoaded = true;
  } catch {
    // ignore
  }
}

function ensureVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (!voicesLoaded || !selectedVoice) {
    loadVoices();
  }
  if (!voicesLoaded) {
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }
}

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
};

export function falar(texto: string, opt: SpeakOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setTimeout(resolve, 350);
      return;
    }
    try {
      ensureVoices();
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "pt-BR";
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = opt.rate ?? 0.96;
      utterance.pitch = opt.pitch ?? 1.04;
      utterance.volume = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

export default falar;
