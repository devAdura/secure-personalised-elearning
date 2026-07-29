import Link from "next/link";
import { Fingerprint } from "lucide-react";

export function Logo() {
  return <Link href="/" className="flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white"><Fingerprint className="h-5 w-5" /></span><span className="leading-tight">SecureLearn<span className="block text-xs font-medium text-muted-foreground">Biometric E-Learning</span></span></Link>;
}
