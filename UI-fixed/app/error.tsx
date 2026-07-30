"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){return <div className="state-panel"><div className="premium-card max-w-md p-8 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-red-50 text-red-600"><AlertTriangle className="h-7 w-7"/></span><h1 className="mt-5 text-2xl font-black text-[#12201c]">This view needs attention</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{process.env.NODE_ENV==="development"?error.message:"The requested operation could not be completed."}</p><Button className="mt-5" onClick={reset}>Try again</Button></div></div>}
