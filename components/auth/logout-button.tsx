"use client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  return <Button variant="ghost" size="sm" disabled={loading} onClick={async () => { setLoading(true); await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/"; }}><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Logout</span></Button>;
}
