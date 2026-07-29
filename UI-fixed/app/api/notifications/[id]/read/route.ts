import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function PATCH(_:Request,{params}:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const{id}=await params;await db.notification.updateMany({where:{id,userId:user.id},data:{isRead:true}});return NextResponse.json({success:true});}
