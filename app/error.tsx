"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){return <div className="grid min-h-[70vh] place-items-center px-4"><div className="max-w-md text-center"><AlertTriangle className="mx-auto h-12 w-12 text-red-500"/><h1 className="mt-4 text-2xl font-bold">Something went wrong</h1><p className="mt-2 text-sm text-muted-foreground">{process.env.NODE_ENV==="development"?error.message:"The requested operation could not be completed."}</p><Button className="mt-5" onClick={reset}>Try again</Button></div></div>}
