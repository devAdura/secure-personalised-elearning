import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validators";
import { apiError } from "@/lib/api";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user||user.role!=="LECTURER")return NextResponse.json({error:"Lecturer access required."},{status:403});const{id}=await params;try{const data=reviewSchema.parse(await request.json());const current=await db.submission.findFirst({where:{id,assignment:{course:{lecturerId:user.id}}},include:{assignment:{select:{title:true}},student:{select:{id:true}}}});if(!current)throw new Error("Submission not found or access denied.");const submission=await db.submission.update({where:{id},data});await db.notification.create({data:{userId:current.student.id,title:"Assignment graded",message:`Your submission for ${current.assignment.title} received ${data.grade}%.`}});return NextResponse.json({submission});}catch(error){return apiError(error,"Review failed");}}
