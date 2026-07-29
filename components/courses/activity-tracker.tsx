"use client";
import { useEffect } from "react";
export function ActivityTracker({courseId}:{courseId:string}) { useEffect(()=>{void fetch(`/api/courses/${courseId}/activity`,{method:"POST"});},[courseId]); return null; }
