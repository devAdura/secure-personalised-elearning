import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await getCurrentUser();if(!admin||admin.role!=="ADMIN")return NextResponse.json({error:"Admin access required."},{status:403});const{id}=await params;try{if(id===admin.id)throw new Error("You cannot disable your own administrator account.");const{isActive}=z.object({isActive:z.boolean()}).parse(await request.json());const user=await db.user.update({where:{id},data:{isActive}});if(!isActive)await db.session.deleteMany({where:{userId:id}});await logSecurityEvent({request,userId:admin.id,action:"ADMIN_USER_STATUS",status:"SUCCESS",metadata:{targetUserId:id,isActive}});return NextResponse.json({user});}catch(error){return apiError(error,"Admin action failed");}}
