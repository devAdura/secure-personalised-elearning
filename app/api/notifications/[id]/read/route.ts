import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const{id}=await params;const{isRead}=z.object({isRead:z.boolean()}).parse(await request.json());const result=await db.notification.updateMany({where:{id,userId:user.id},data:{isRead}});if(!result.count)return NextResponse.json({error:"Notification not found."},{status:404});return NextResponse.json({success:true,isRead});}
