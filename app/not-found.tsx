import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound(){return <main className="grid min-h-screen place-items-center px-4 text-center"><div><SearchX className="mx-auto h-14 w-14 text-primary/50"/><h1 className="mt-5 text-3xl font-bold">Page not found</h1><p className="mt-2 text-muted-foreground">The requested page or record does not exist.</p><Link href="/" className={buttonVariants({className:"mt-6"})}>Return home</Link></div></main>}
