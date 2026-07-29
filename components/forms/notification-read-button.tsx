"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
export function NotificationReadButton({id}:{id:string}){return <Button variant="ghost" size="sm" onClick={async()=>{await fetch(`/api/notifications/${id}/read`,{method:"PATCH"});window.location.reload();}}><Check className="h-4 w-4" />Mark read</Button>}
