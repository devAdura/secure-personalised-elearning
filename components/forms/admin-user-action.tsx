"use client";

import { useState } from "react";
import { Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ManagedRole = "STUDENT" | "LECTURER" | "ADMIN";

export function AdminUserAction({ userId, userName, userRole, isActive }: { userId:string; userName:string; userRole:ManagedRole; isActive:boolean }) {
  const [loading,setLoading]=useState<"status"|"delete"|null>(null);

  async function changeStatus() {
    setLoading("status");
    const response=await fetch(`/api/admin/users/${userId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!isActive})});
    if(response.ok)window.location.reload();
    else{const result=await response.json();alert(result.error||"Account status could not be changed.");setLoading(null);}
  }

  async function deleteUser() {
    const warning=userRole==="LECTURER"?"Deleting this lecturer will also permanently remove their courses, assignments, materials, discussions, and related submissions.":"Deleting this student will permanently remove their enrolments, submissions, discussions, notifications, and security credentials.";
    if(!window.confirm(`${warning}\n\nThis action cannot be undone.`))return;
    const confirmation=window.prompt(`Type DELETE to permanently remove ${userName}.`);
    if(confirmation!=="DELETE")return;
    setLoading("delete");
    const response=await fetch(`/api/admin/users/${userId}`,{method:"DELETE"});
    if(response.ok)window.location.reload();
    else{const result=await response.json();alert(result.error||"User could not be deleted.");setLoading(null);}
  }

  return <div className="flex flex-wrap gap-2"><Button size="sm" variant={isActive?"destructive":"success"} disabled={Boolean(loading)} onClick={changeStatus}><Power className="h-4 w-4"/>{loading==="status"?"Saving...":isActive?"Disable":"Enable"}</Button>{userRole!=="ADMIN"?<Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50" disabled={Boolean(loading)} onClick={deleteUser}><Trash2 className="h-4 w-4"/>{loading==="delete"?"Deleting...":"Delete"}</Button>:null}</div>;
}
