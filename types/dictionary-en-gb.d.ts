declare module "dictionary-en-gb" {
  type Dictionary = { aff: Buffer; dic: Buffer };
  export default function load(callback: (error: NodeJS.ErrnoException | null, dictionary?: Dictionary) => void): void;
}
