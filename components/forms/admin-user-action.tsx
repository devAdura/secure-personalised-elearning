"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminUserAction({ userId, isActive }: {userId:string;isActive:boolean}) { const[loading,setLoading]=useState(false);return <Button size="sm" variant={isActive?"destructive":"success"} disabled={loading} onClick={async()=>{setLoading(true);const response=await fetch(`/api/admin/users/${userId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!isActive})});if(response.ok)window.location.reload();else{alert("Action failed");setLoading(false);}}}>{loading?"Saving…":isActive?"Disable":"Enable"}</Button>; }
