import dictionary from "dictionary-en-gb";
import nspell from "nspell";

const PLATFORM_WORDS = [
  "SecureLearn",
  "WebAuthn",
  "passkey",
  "passkeys",
  "biometric",
  "biometrics",
  "authenticator",
  "TOTP",
  "e-learning",
  "coursework",
  "username",
  "online",
  "programme",
  "programmes"
];

const checkerPromise = new Promise<ReturnType<typeof nspell>>((resolve, reject) => {
  dictionary((error, loaded) => {
    if (error || !loaded) return reject(error || new Error("English dictionary could not be loaded."));
    const checker = nspell(loaded);
    for (const word of PLATFORM_WORDS) checker.add(word);
    resolve(checker);
  });
});

export type SpellingIssue = { word: string; suggestions: string[] };

export async function findSpellingIssues(text: string): Promise<SpellingIssue[]> {
  const checker = await checkerPromise;
  const candidates = text.match(/[A-Za-z][A-Za-z'-]{2,}/g) || [];
  const uniqueWords = new Map<string, string>();
  for (const word of candidates) {
    if (/^[A-Z]{2,}$/.test(word)) continue;
    const normalized = word.toLowerCase();
    if (!uniqueWords.has(normalized)) uniqueWords.set(normalized, word);
  }

  const issues: SpellingIssue[] = [];
  for (const [normalized, original] of uniqueWords) {
    if (checker.correct(normalized)) continue;
    issues.push({ word: original, suggestions: checker.suggest(normalized).slice(0, 3) });
    if (issues.length >= 12) break;
  }
  return issues;
}
