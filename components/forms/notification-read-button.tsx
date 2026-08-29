"use client";
import { useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export function NotificationReadButton({id,isRead}:{id:string;isRead:boolean}){const[loading,setLoading]=useState(false);return <Button variant="ghost" size="sm" disabled={loading} onClick={async()=>{setLoading(true);const response=await fetch(`/api/notifications/${id}/read`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isRead:!isRead})});if(response.ok)window.location.reload();else setLoading(false);}}>{isRead?<Undo2 className="h-4 w-4"/>:<Check className="h-4 w-4"/>}{loading?"Saving...":isRead?"Mark unread":"Mark read"}</Button>}
