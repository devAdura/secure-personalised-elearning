import Link from "next/link";
import { Fingerprint } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-black text-[#12201c]">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white shadow-[0_12px_24px_rgba(23,107,88,0.22)]">
        <Fingerprint className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        SecureLearn
        <span className="block text-xs font-bold text-muted-foreground">Biometric learning OS</span>
      </span>
    </Link>
  );
}
