"use client";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EnrolButton({ courseId }: {courseId:string}) { const[loading,setLoading]=useState(false); return <Button disabled={loading} onClick={async()=>{setLoading(true);const response=await fetch(`/api/courses/${courseId}/enrol`,{method:"POST"});if(response.ok)window.location.reload();else{const result=await response.json();alert(result.error||"Could not enrol");setLoading(false);}}}><UserPlus className="h-4 w-4" />{loading?"Enrolling...":"Enrol in course"}</Button>; }
