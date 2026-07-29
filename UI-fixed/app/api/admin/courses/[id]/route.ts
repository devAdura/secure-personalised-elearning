import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security-log";
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await getCurrentUser();if(!admin||admin.role!=="ADMIN")return NextResponse.json({error:"Admin access required."},{status:403});const{id}=await params;await db.course.delete({where:{id}});await logSecurityEvent({request,userId:admin.id,action:"ADMIN_COURSE_REMOVAL",status:"SUCCESS",metadata:{courseId:id}});return NextResponse.json({success:true});}
