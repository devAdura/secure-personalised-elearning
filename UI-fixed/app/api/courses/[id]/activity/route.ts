import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessCourse } from "@/lib/permissions";
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) { const user=await getCurrentUser(); if(!user)return NextResponse.json({success:false},{status:401}); const{id}=await params; if(!(await canAccessCourse(user.id,user.role,id)))return NextResponse.json({success:false},{status:403}); await db.learningActivity.create({data:{userId:user.id,courseId:id,action:"COURSE_VIEW"}}); return NextResponse.json({success:true}); }
