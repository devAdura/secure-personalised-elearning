import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound(){return <main className="state-panel text-center"><div className="premium-card max-w-md p-8"><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eef8f1] text-primary"><SearchX className="h-8 w-8"/></span><h1 className="mt-5 text-3xl font-black text-[#12201c]">Page not found</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">The requested page or record does not exist.</p><Link href="/" className={buttonVariants({className:"mt-6"})}>Return home</Link></div></main>}
