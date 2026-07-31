"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export function DeleteCourseButton({courseId,endpoint=`/api/courses/${courseId}`,redirectTo="/lecturer/courses"}:{courseId:string;endpoint?:string;redirectTo?:string}){const[loading,setLoading]=useState(false);return <Button variant="destructive" size="sm" disabled={loading} onClick={async()=>{if(!confirm("Delete this course and all related content?"))return;setLoading(true);const response=await fetch(endpoint,{method:"DELETE"});if(response.ok)window.location.href=redirectTo;else{const result=await response.json();alert(result.error||"Delete failed");setLoading(false);}}}><Trash2 className="h-4 w-4" />{loading?"Deleting...":"Delete"}</Button>}
